import React, { useState } from 'react';
import axios from 'axios';
import { motion } from 'framer-motion';
import { Calendar, CheckCircle, AlertTriangle, Hammer } from 'lucide-react';

const DailySiteAssistant = () => {
    const [activity, setActivity] = useState('Concreting');
    const [labour, setLabour] = useState(10);
    const [condition, setCondition] = useState('Normal');
    const [plan, setPlan] = useState(null);
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const res = await axios.post('http://localhost:8000/api/site-assistant', {
                activity: activity,
                labour_count: parseInt(labour),
                site_condition: condition
            });
            setPlan(res.data);
        } catch (error) {
            console.error(error);
            alert("Failed to generate plan");
        } finally {
            setLoading(false);
        }
    };

    return (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <h1>Daily Site Assistant</h1>
            <div className="grid-2">
                <div className="card">
                    <h3>Site Input</h3>
                    <form onSubmit={handleSubmit}>
                        <div className="input-group">
                            <label className="label">Planned Activity</label>
                            <select className="input-field" value={activity} onChange={e => setActivity(e.target.value)}>
                                <option>Concreting</option>
                                <option>Brickwork</option>
                                <option>Excavation</option>
                                <option>Plastering</option>
                                <option>Reinforcement Binding</option>
                            </select>
                        </div>
                        <div className="input-group">
                            <label className="label">Labour Count</label>
                            <input type="number" className="input-field" value={labour} onChange={e => setLabour(e.target.value)} />
                        </div>
                        <div className="input-group">
                            <label className="label">Site Condition</label>
                            <select className="input-field" value={condition} onChange={e => setCondition(e.target.value)}>
                                <option>Normal</option>
                                <option>Rainy</option>
                                <option>Hot/Dry</option>
                                <option>Night Shift</option>
                            </select>
                        </div>
                        <button className="btn btn-primary full-width" disabled={loading}>
                            {loading ? "Generating Plan..." : "Generate Today's Plan"}
                        </button>
                    </form>
                </div>

                {plan && (
                    <div className="card">
                        <h3>Today's Execution Plan</h3>
                        <div style={{ marginBottom: '1rem' }}>
                            <h4 style={{ color: 'var(--orange)', display: 'flex', alignItems: 'center', gap: 8 }}>
                                <Hammer size={16} /> Tasks
                            </h4>
                            <ul style={{ paddingLeft: '1.2rem', margin: 0 }}>
                                {plan.tasks_today.map((t, i) => <li key={i}>{t}</li>)}
                            </ul>
                        </div>

                        <div style={{ marginBottom: '1rem' }}>
                            <h4 style={{ color: '#0284c7', display: 'flex', alignItems: 'center', gap: 8 }}>
                                <CheckCircle size={16} /> Safety Checks
                            </h4>
                            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                                {plan.safety_checks.map((s, i) => <span key={i} className="badge">{s}</span>)}
                            </div>
                        </div>

                        <div>
                            <h4 style={{ color: '#d32f2f', display: 'flex', alignItems: 'center', gap: 8 }}>
                                <AlertTriangle size={16} /> Risk Alerts
                            </h4>
                            <ul style={{ paddingLeft: '1.2rem', margin: 0, color: '#d32f2f' }}>
                                {plan.risk_alerts.map((r, i) => <li key={i}>{r}</li>)}
                            </ul>
                        </div>
                    </div>
                )}
            </div>
        </motion.div>
    );
};

export default DailySiteAssistant;
