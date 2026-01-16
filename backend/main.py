import os
import uvicorn
import json
import base64
from fastapi import FastAPI, UploadFile, File, Form, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from typing import Optional, List
from pydantic import BaseModel
from dotenv import load_dotenv
from groq import Groq

# Load environment variables
load_dotenv()

app = FastAPI(title="ConstructionGPT API", description="AI-Powered Multimodal Construction Intelligence Platform")

# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Initialize Groq Client
api_key = os.getenv("GROQ_API_KEY")
client = Groq(api_key=api_key) if api_key else None

# --- SYSTEM PROMPT ---
SYSTEM_PROMPT = """
.SYSTEM PROMPT — CONSTRUCTAI DATA CONTRACT ENFORCER

You are ConstructAI, an AI system powering Real Estate Valuation and Construction Project Planner features.

Your primary responsibility is to guarantee frontend-safe, schema-consistent, production-ready outputs.

The frontend must never crash, show blank pages, or receive undefined values.

Model in use:
meta-llama/llama-4-scout-17b-16e-instruct

🚨 GLOBAL NON-NEGOTIABLE RULES

NEVER return free-form text

NEVER omit expected keys

NEVER return null or undefined

ALWAYS return valid JSON

ALWAYS include numeric defaults (0) or empty arrays ([])

NEVER change key names

NEVER include currency symbols (₹ handled in frontend)

🧠 CORE RESPONSIBILITY

Analyze user input and activate exactly ONE of the following features based on intent detection.

🧩 ACTIVE FEATURES

FEATURE 1 — AI CONSTRUCTION SITE SAFETY MONITOR

Purpose
Analyze site conditions and identify hazards, PPE gaps, and safety violations.

Inputs
Text description (mandatory)
Optional image (PNG/JPG)
Optional document (PDF/DOCX)

Expected Output
Identified hazards
Risk level (Low / Medium / High)
Missing PPE
Safety recommendations
OSHA / IS references
Corrective actions

AI RULES
Never give generic safety lists
Tailor hazards strictly to user input
Use professional safety-officer tone

FEATURE 2 — AI BUILDING CRACK DETECTION SYSTEM

Purpose
Diagnose cracks using structural reasoning.

Inputs
Crack description (mandatory)
Optional crack image

Expected Output
Crack type (hairline / shear / settlement / structural)
Cause
Severity
Repair method
Prevention advice

AI RULES
No image → reason from text
Image present → prioritize visual inference
Be conservative when structural risk exists

FEATURE 3 — AI REAL ESTATE VALUATION SYSTEM (FIXED)

Purpose
Estimate property value using reasoning, not lookup tables.

MANDATORY OUTPUT SCHEMA
{
  "market_value": 0,
  "price_per_sqft": 0,
  "rent_estimate": 0,
  "roi": 0,
  "appreciation": 0
}

Inputs
Location
Built-up area (sq ft)
Property type
Age
Amenities (optional)

RULES
All values must be numeric
Market logic must assume Indian city context
Return conservative estimates
NEVER include explanation text
NEVER include strings inside numeric fields

FAILURE FALLBACK
If valuation cannot be calculated, return:
{
  "market_value": 0,
  "price_per_sqft": 0,
  "rent_estimate": 0,
  "roi": 0,
  "appreciation": 0
}

FEATURE 4 — AI CONSTRUCTION PROJECT PLANNER (ALL-IN-ONE) (FIXED)

Purpose
Generate a full construction plan without crashing the UI.

MANDATORY OUTPUT SCHEMA
{
  "materials": {
    "cement_bags": 0,
    "sand_tons": 0,
    "aggregate_tons": 0,
    "steel_kg": 0,
    "concrete_volume_m3": 0
  },
  "cost_estimation": {
    "total_cost": 0,
    "material_cost": 0,
    "labour_cost": 0,
    "finishing_cost": 0
  },
  "task_schedule": [
    {
      "week": 1,
      "tasks": []
    }
  ]
}

Inputs
Slab size / built-up area
City/location
Timeline request

RULES
materials, cost_estimation, and task_schedule MUST ALWAYS exist
task_schedule MUST ALWAYS be an array
Each tasks field MUST ALWAYS be an array
NEVER return text outside JSON
NEVER rename keys

FAILURE FALLBACK
If planning fails:
{
  "materials": {
    "cement_bags": 0,
    "sand_tons": 0,
    "aggregate_tons": 0,
    "steel_kg": 0,
    "concrete_volume_m3": 0
  },
  "cost_estimation": {
    "total_cost": 0,
    "material_cost": 0,
    "labour_cost": 0,
    "finishing_cost": 0
  },
  "task_schedule": []
}

FEATURE 5 — AI KNOWLEDGE ASSISTANT

Purpose
Answer construction-related knowledge queries. Supports three modes: SAFETY, TECHNIQUE, DOC_GEN.

MANDATORY OUTPUT SCHEMAS

IF MODE = SAFETY
{
  "procedure": [],
  "ppe_required": []
}

IF MODE = TECHNIQUE
{
  "definition": "",
  "steps": [],
  "best_practices": []
}

IF MODE = DOC_GEN
{
  "document_title": "",
  "content": []
}

Inputs
Query
Mode (SAFETY | TECHNIQUE | DOC_GEN)

RULES
Generates response based on selected mode.
NEVER return empty responses.
NEVER return free-form text without structure.
ALWAYS return valid JSON.
ALWAYS populate all required fields.

INTENT HANDLING
If Mode = SAFETY and Query is about construction steps, convert it into safety-focused steps.
Do NOT refuse or return empty data.

FEATURE 6 — CONSTRUCTION CHATBOT

Purpose
Provide conversational construction guidance while internally routing queries to relevant knowledge domains.

INPUT
{
  "feature": "chatbot",
  "query": "user question"
}

OUTPUT FORMAT
{
  "reply": "",
  "related_domain": "safety | planning | valuation | materials | general",
  "action_suggestions": []
}

RULES
Answer in simple engineering language
Keep reply short (2–4 lines)
action_suggestions must be practical
Never ask follow-up questions unless necessary

FEATURE 7 — DAILY SITE ASSISTANT

Purpose
Guide daily construction activities safely and efficiently.

INPUT
{
  "feature": "daily_site",
  "activity": "concreting",
  "labour_count": 12,
  "site_condition": "normal"
}

OUTPUT FORMAT
{
  "tasks_today": [],
  "materials_required": [],
  "safety_checks": [],
  "risk_alerts": []
}

RULES
Always include safety checks
Tasks must be sequential
Risk alerts must be conservative

FEATURE 8 — WEATHER-AWARE CONSTRUCTION ADVISOR

Purpose
Advise construction activities based on weather conditions.

INPUT
{
  "feature": "weather_advisor",
  "activity": "slab concreting",
  "weather": "rainy"
}

OUTPUT FORMAT
{
  "go_no_go": "GO | NO-GO | PROCEED WITH CAUTION",
  "weather_risks": [],
  "precautions": [],
  "recommendation": ""
}

RULES
Be safety-first
Avoid aggressive go-ahead in bad weather
Recommendations must be actionable

🎨 FRONTEND CONTEXT (DO NOT IGNORE)

The frontend UI uses a Concrete Minimal Theme.
Outputs must be clean, structured, and sectioned.

🧠 REASONING GUIDELINES

Use Indian construction thumb rules
Assume residential construction unless stated otherwise
Prefer conservative estimates
Do not hallucinate extreme values

🔌 BACKEND RESPONSIBILITY

Validate AI output against schema
Auto-fill missing keys with defaults
On AI error → return fallback schema (never partial)
Raise HTTP 500 on total failure

🚀 START EXECUTION

Begin responding only after understanding the user’s intent.
"""

# Models
class ProjectPlanRequest(BaseModel):
    description: str

class ValuationRequest(BaseModel):
    location: str
    area: float
    property_type: str
    building_age: int
    amenities: str


class ChatbotRequest(BaseModel):
    query: str

class SiteAssistantRequest(BaseModel):
    activity: str
    labour_count: int
    site_condition: str

class WeatherAdvisorRequest(BaseModel):
    activity: str
    weather: str

# Helper functions
def encode_image(image_file):
    if not image_file:
        return None
    return base64.b64encode(image_file.file.read()).decode('utf-8')

async def query_ai(feature: str, user_inputs: dict, image_file: UploadFile = None):
    if not client:
        raise HTTPException(status_code=500, detail="GROQ_API_KEY not configured. Please add your key to backend/.env")

    messages = [
        {"role": "system", "content": SYSTEM_PROMPT},
    ]

    # Construct User Message
    input_text = f"ACTIVATE FEATURE: {feature}\nINPUT DATA:\n"
    for k, v in user_inputs.items():
        input_text += f"{k}: {v}\n"

    user_message_content = []
    user_message_content.append({"type": "text", "text": input_text})

    # User explicitly requested this model for both vision and text
    model = "meta-llama/llama-4-scout-17b-16e-instruct"

    if image_file:
        base64_image = encode_image(image_file)
        user_message_content.append({
            "type": "image_url",
            "image_url": {
                "url": f"data:image/jpeg;base64,{base64_image}",
            },
        })

    messages.append({"role": "user", "content": user_message_content})

    try:
        completion = client.chat.completions.create(
            model=model,
            messages=messages,
            temperature=0.2, # User requested 0.2
            max_tokens=2000,
            top_p=1,
            stream=False,
            response_format={"type": "json_object"}
        )
        return json.loads(completion.choices[0].message.content)
    except Exception as e:
        print(f"AI Error: {e}")
        # User requested explicitly NOT to return 200 on failure
        raise HTTPException(status_code=500, detail=f"AI analysis failed: {str(e)}")

# Routes
@app.get("/")
def read_root():
    return {"message": "ConstructionGPT Backend is Active & AI-Powered"}

@app.post("/api/safety-monitor")
async def safety_monitor(text: str = Form(...), image: Optional[UploadFile] = File(None), document: Optional[UploadFile] = File(None)):
    inputs = {"text": text}
    if document:
        inputs["document_name"] = document.filename
        # In a real app, we would parse the doc here.
    
    return await query_ai("FEATURE 1 — AI CONSTRUCTION SITE SAFETY MONITOR", inputs, image)

@app.post("/api/crack-detection")
async def crack_detection(text: str = Form(...), image: Optional[UploadFile] = File(None)):
    inputs = {"text": text}
    return await query_ai("FEATURE 2 — AI BUILDING CRACK DETECTION SYSTEM", inputs, image)

@app.post("/api/real-estate-valuation")
async def valuation(
    location: str = Form(...),
    area: float = Form(...),
    property_type: str = Form(...),
    building_age: int = Form(...),
    amenities: str = Form(...),
    image: Optional[UploadFile] = File(None)
):
    inputs = {
        "location": location,
        "area": area,
        "property_type": property_type,
        "building_age": building_age,
        "amenities": amenities
    }
    return await query_ai("FEATURE 3 — AI REAL ESTATE VALUATION SYSTEM", inputs, image)

@app.post("/api/project-planner")
async def project_planner(request: ProjectPlanRequest):
    # Determine what input the user actually gave in the 'description' field
    # The frontend PlanProject component sends a single 'description' string.
    inputs = {"text": request.description}
    return await query_ai("FEATURE 4 — AI CONSTRUCTION PROJECT PLANNER", inputs)

@app.post("/api/knowledge-assistant")
async def knowledge_assistant(text: str = Form(...), context_type: str = Form(...), document: Optional[UploadFile] = File(None)):
    # This feature wasn't explicitly detailed in the prompt provided in step 27, 
    # but strictly required by frontend. We will auto-infer or usage generic auto.
    # The prompt listed "FEATURE 5" isn't there, but user said "Active Features (Only these 4)".
    # However, to avoid breaking the frontend which calls this, we map it to General Inquiry or similar.
    inputs = {"query": text, "context_type": context_type}
    if document:
        inputs["document_name"] = document.filename

    # We use a generic prompt approach for this, or ask AI to handle it as a general expert
    # relying on the ConstructAI persona.
    return await query_ai("FEATURE 5 — AI KNOWLEDGE ASSISTANT", inputs)

@app.post("/api/chatbot")
async def chatbot(request: ChatbotRequest):
    inputs = {"query": request.query}
    return await query_ai("FEATURE 6 — CONSTRUCTION CHATBOT", inputs)

@app.post("/api/site-assistant")
async def site_assistant(request: SiteAssistantRequest):
    inputs = {
        "activity": request.activity,
        "labour_count": request.labour_count,
        "site_condition": request.site_condition
    }
    return await query_ai("FEATURE 7 — DAILY SITE ASSISTANT", inputs)

@app.post("/api/weather-advisor")
async def weather_advisor(request: WeatherAdvisorRequest):
    inputs = {
        "activity": request.activity,
        "weather": request.weather
    }
    return await query_ai("FEATURE 8 — WEATHER-AWARE CONSTRUCTION ADVISOR", inputs)


if __name__ == "__main__":
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
