import React, { useState } from 'react';
import { Upload, Activity, AlertOctagon } from 'lucide-react';
import axios from 'axios';
import { motion } from 'framer-motion';

const CrackDetection = () => {
    const [text, setText] = useState('');
    const [image, setImage] = useState(null);
    const [result, setResult] = useState(null);
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        const formData = new FormData();
        formData.append('text', text);
        if (image) formData.append('image', image);

        try {
            const response = await axios.post('http://localhost:8000/api/crack-detection', formData);
            setResult(response.data);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <h1>Structural Crack Diagnosis</h1>
            <div className="grid-2">
                <div className="card">
                    <h3>Input Analysis Data</h3>
                    <form onSubmit={handleSubmit}>
                        <div className="input-group">
                            <label className="label">Description</label>
                            <textarea className="textarea-field" rows="4" value={text} onChange={e => setText(e.target.value)} placeholder="Describe the crack location and pattern..." />
                        </div>
                        <div className="input-group">
                            <label className="label">Crack Image</label>
                            <div className="file-upload">
                                <input type="file" id="crack-upload" hidden accept="image/*" onChange={(e) => setImage(e.target.files[0])} />
                                <label htmlFor="crack-upload" style={{ cursor: 'pointer' }}>
                                    <Upload size={24} style={{ marginBottom: 8, display: 'block', margin: '0 auto' }} />
                                    {image ? image.name : "Upload Close-up"}
                                </label>
                            </div>
                        </div>
                        <button className="btn btn-primary full-width" type="submit" disabled={loading}>{loading ? "Diagnosing..." : "Run Diagnosis"}</button>
                    </form>
                </div>

                {result && (
                    <div className="card">
                        <h3>Diagnosis Report</h3>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
                            <div>
                                <div className="label">Crack Type</div>
                                <div style={{ fontSize: '1.2rem', fontWeight: 800 }}>{result.crack_type}</div>
                            </div>
                            <div>
                                <div className="label">Severity</div>
                                <span className="badge badge-high">{result.severity}</span>
                            </div>
                            <div>
                                <div className="label">Structural Risk</div>
                                <div style={{ color: 'red', fontWeight: 800 }}>{result.structural_risk}</div>
                            </div>
                        </div>

                        <div className="input-group">
                            <label className="label">Probable Cause</label>
                            <p>{result.cause}</p>
                        </div>

                        <div className="input-group" style={{ background: '#eee', padding: '1rem', borderLeft: '4px solid var(--orange)' }}>
                            <label className="label">Recommended Repair</label>
                            <p style={{ margin: 0, fontWeight: 600 }}>{result.repair_method}</p>
                            <p style={{ margin: '0.5rem 0 0 0', fontSize: '0.9rem' }}>Material: {result.material_recommendation}</p>
                        </div>
                    </div>
                )}
            </div>
        </motion.div>
    );
};

export default CrackDetection;
