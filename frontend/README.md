# 🏗️ AI-Powered Multimodal Construction Intelligence Platform

An end-to-end **AI-driven construction intelligence system** that assists engineers, contractors, and site managers with safety analysis, planning, valuation, and daily site operations using **multimodal AI**.

This platform converts **text, images, and structured inputs** into **actionable construction insights**, following real-world engineering workflows.

---

## 🚀 Features

### 🔹 Construction Site Safety Monitor
- Analyzes site images and descriptions
- Identifies safety hazards and risks
- Recommends PPE and corrective actions
- Structured, frontend-safe outputs

### 🔹 Building Crack Detection & Analysis
- Classifies crack types and severity
- Identifies possible structural causes
- Suggests repair and prevention methods

### 🔹 Real Estate Valuation System
- Estimates market value (₹ INR)
- Price per sq ft
- Rental potential
- ROI and appreciation analysis
- Indian real-estate focused logic

### 🔹 Construction Project Planner
- Material estimation (cement, sand, steel, aggregate)
- Cost estimation
- Week-wise task scheduling
- Prevents frontend crashes using strict schemas

### 🔹 Knowledge Assistant
- Safety procedures
- Construction techniques
- Auto-generated documents (reports, work orders)
- Mode-based structured responses

### 🔹 Construction Chatbot
- Domain-specific conversational assistant
- Answers planning, safety, and material queries
- Provides practical action suggestions

### 🔹 Daily Site Assistant
- Generates daily task plans
- Material and labour requirements
- Safety checks and risk alerts

### 🔹 Weather-Aware Construction Advisor
- GO / NO-GO construction recommendations
- Weather risk assessment
- Safety precautions based on conditions

---

## 🧠 AI & Technology Stack

### 🔹 AI Model
- **meta-llama/llama-4-scout-17b-16e-instruct**
- Multimodal (text + image understanding)

### 🔹 Backend
- Python
- FastAPI
- Pydantic schemas
- Strict AI response validation

### 🔹 Frontend
- React.js
- Concrete Minimal UI Theme
- Crash-proof rendering
- Structured dashboards

---

## 🎨 UI Design Philosophy

**Concrete Minimal Theme**
- Industrial, rugged aesthetic
- High contrast for field usage
- Safety-orange highlights
- Clean, professional dashboards

Designed for **construction environments**, not generic apps.

---

## 🏗️ System Architecture

React Frontend
↓
FastAPI Backend
↓
Multimodal LLM (Llama-4)
↓
Strict JSON Schema
↓
Frontend-safe Rendering

yaml
Copy code

---

## 📌 Use Cases

- Construction site safety audits
- Structural crack inspection
- Cost and material estimation
- Daily site planning
- Real estate investment analysis
- Construction knowledge assistance

---

## ⚙️ Installation & Setup

### Backend
```bash
cd backend
pip install -r requirements.txt
uvicorn main:app --reload
Frontend
bash
Copy code
cd frontend
npm install
npm run dev
🧪 Key Design Principles
No static or hardcoded AI responses

No frontend .map() crashes

Strict backend ↔ frontend contracts

Modular, scalable feature design

Real-world construction relevance

⚠️ Disclaimer
This platform provides decision-support assistance only.
All outputs should be validated by qualified engineers and professionals before execution on site.

📄 License
MIT License

🙌 Acknowledgements
Built as a practical multimodal AI system for the construction industry, focusing on safety, reliability, and real-world applicability.
