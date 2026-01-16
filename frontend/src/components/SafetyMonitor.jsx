import React, { useState } from 'react';
import { Upload, AlertTriangle, CheckCircle, FileText, X } from 'lucide-react';
import axios from 'axios';
import { motion } from 'framer-motion';

const SafetyMonitor = () => {
    const [text, setText] = useState('');
    const [image, setImage] = useState(null);
    const [doc, setDoc] = useState(null);

    // 1️⃣ Initialize state correctly
    const [result, setResult] = useState({
        hazards: [],
        riskLevel: "",
        ppe: [],
        actions: [],
        missing_ppe: [], // Added to match backend likely response key or frontend usage 'missing_ppe'
        osha_standards: [], // Added to match frontend usage
        corrective_actions: [], // Added to match frontend usage
        risk_level: ""  // Added to match frontend usage
    });
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);

    // 2️⃣ Wrap your API call (this is CRITICAL)
    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        const formData = new FormData();
        formData.append('text', text);
        if (image) formData.append('image', image);
        if (doc) formData.append('document', doc);

        try {
            // Using full URL to ensure connectivity without proxy setup
            const res = await axios.post('http://localhost:8000/api/safety-monitor', formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });
            setResult(res.data);
        } catch (err) {
            console.error("Safety analysis failed:", err);
            setError("Safety analysis failed. Please retry.");
            setResult({
                hazards: [],
                riskLevel: "Error",
                ppe: [],
                actions: [],
                missing_ppe: [],
                osha_standards: [],
                corrective_actions: [],
                risk_level: "Error"
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
        >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                <h1>Site Safety Monitor</h1>
                <div className="badge badge-critical" style={{ fontSize: '1rem' }}>AI ACTIVE</div>
            </div>

            <div className="grid-2">
                <div className="card">
                    <h3><FileText size={18} style={{ display: 'inline', marginRight: 8 }} /> Input Data</h3>
                    <form onSubmit={handleSubmit}>
                        <div className="input-group">
                            <label className="label">Observation Log</label>
                            <textarea
                                className="textarea-field"
                                rows="5"
                                placeholder="Describe the scene e.g. 'Workers on scaffold without harness...'"
                                value={text}
                                onChange={(e) => setText(e.target.value)}
                                required
                            />
                        </div>

                        <div className="input-group">
                            <label className="label">Site Photo (Optional)</label>
                            <div className="file-upload">
                                <input type="file" id="img-upload" hidden accept="image/*" onChange={(e) => setImage(e.target.files[0])} />
                                <label htmlFor="img-upload" style={{ cursor: 'pointer' }}>
                                    <Upload size={24} style={{ marginBottom: 8, display: 'block', margin: '0 auto' }} />
                                    {image ? image.name : "Click to Upload Image"}
                                </label>
                                {image && <X size={16} onClick={() => setImage(null)} style={{ cursor: 'pointer', marginTop: 10, color: 'red' }} />}
                            </div>
                        </div>

                        <div className="input-group">
                            <label className="label">Safety Doc (Optional)</label>
                            <div className="file-upload">
                                <input type="file" id="doc-upload" hidden accept=".pdf,.docx,.txt" onChange={(e) => setDoc(e.target.files[0])} />
                                <label htmlFor="doc-upload" style={{ cursor: 'pointer' }}>
                                    <FileText size={24} style={{ marginBottom: 8, display: 'block', margin: '0 auto' }} />
                                    {doc ? doc.name : "Click to Upload Report"}
                                </label>
                            </div>
                        </div>

                        <button className="btn btn-primary full-width" type="submit" disabled={loading}>
                            {loading ? "Analyzing..." : "Analyze Hazards"}
                        </button>
                    </form>
                </div>

                <div className="card" style={{ background: (result && result.risk_level) ? 'white' : 'rgba(255,255,255,0.5)' }}>
                    <h3>Analysis Results</h3>

                    {/* 4️⃣ Prevent render during loading / error or empty state */}
                    {!loading && !error && (!result || !result.risk_level) && (
                        <div style={{ color: '#999', fontStyle: 'italic', padding: '2rem', textAlign: 'center' }}>Waiting for input...</div>
                    )}

                    {loading && (
                        <div className="loader" style={{ color: "#FF7600", textAlign: "center", padding: "2rem" }}>
                            Analyzing site data...
                        </div>
                    )}

                    {error && (
                        <div style={{ color: "#d32f2f", padding: "1rem", textAlign: "center", border: "1px solid #d32f2f", borderRadius: "4px", backgroundColor: "#ffebee" }}>
                            {error}
                        </div>
                    )}

                    {!loading && !error && result && result.risk_level && (
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.5rem', padding: '1rem', background: result.risk_level === 'High' ? '#fee2e2' : '#e0f2fe', borderRadius: 4 }}>
                                <AlertTriangle color={result.risk_level === 'High' ? 'red' : 'blue'} />
                                <div>
                                    <div style={{ fontSize: '0.8rem', fontWeight: 800, textTransform: 'uppercase', color: '#555' }}>Risk Level</div>
                                    <div style={{ fontSize: '1.5rem', fontWeight: 900, color: result.risk_level === 'High' ? '#d32f2f' : '#0284c7' }}>{result.risk_level}</div>
                                </div>
                            </div>

                            <div className="input-group">
                                <label className="label">Identified Hazards</label>
                                {/* 3️⃣ Add rendering guards */}
                                <ul style={{ paddingLeft: '1.2rem', margin: 0 }}>
                                    {(Array.isArray(result.hazards) ? result.hazards : []).map((h, i) => (
                                        <li key={i} style={{ marginBottom: 4 }}>{h}</li>
                                    ))}
                                </ul>
                            </div>

                            <div className="input-group">
                                <label className="label">Missing PPE</label>
                                <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                                    {(Array.isArray(result.missing_ppe) ? result.missing_ppe : []).map((p, i) => (
                                        <span key={i} className="badge badge-critical">{p}</span>
                                    ))}
                                </div>
                            </div>

                            <div className="input-group">
                                <label className="label">OSHA Standards</label>
                                <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                                    {(Array.isArray(result.osha_standards) ? result.osha_standards : []).map((s, i) => (
                                        <span key={i} className="badge">{s}</span>
                                    ))}
                                </div>
                            </div>

                            <div className="input-group">
                                <label className="label">Corrective Actions</label>
                                <ul style={{ paddingLeft: '1.2rem', margin: 0 }}>
                                    {(Array.isArray(result.corrective_actions) ? result.corrective_actions : []).map((h, i) => (
                                        <li key={i} style={{ marginBottom: 4, color: 'var(--orange)', fontWeight: 600 }}>{h}</li>
                                    ))}
                                </ul>
                            </div>
                        </motion.div>
                    )}
                </div>
            </div>
        </motion.div>
    );
};

export default SafetyMonitor;
