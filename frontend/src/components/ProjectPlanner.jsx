import React, { useState } from 'react';
import axios from 'axios';
import { motion } from 'framer-motion';

// 🛡️ Error Boundary Component
class ErrorBoundary extends React.Component {
    state = { hasError: false };

    static getDerivedStateFromError() {
        return { hasError: true };
    }

    render() {
        if (this.state.hasError) {
            return (
                <div style={{ padding: 20, color: "#FF7600", textAlign: "center", border: "1px solid #FF7600", borderRadius: 8, background: "#fffaf0" }}>
                    Project Planner failed. Please retry.
                </div>
            );
        }
        return this.props.children;
    }
}

const ProjectPlannerContent = () => {
    const [desc, setDesc] = useState('');
    const [loading, setLoading] = useState(false);

    // 🧩 STEP 1 — FIX STATE INITIALIZATION
    const [plan, setPlan] = useState({
        materials: {
            cement_bags: 0,
            sand_tons: 0,
            aggregate_tons: 0,
            steel_kg: 0,
            concrete_volume_m3: 0
        },
        cost_estimation: {
            total_cost: 0,
            material_cost: 0,
            labour_cost: 0,
            finishing_cost: 0
        },
        task_schedule: []
    });

    // 🧩 STEP 5 — FIX API CALL ERROR HANDLING
    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const response = await axios.post('http://localhost:8000/api/project-planner', { description: desc });
            setPlan(response.data);
        } catch (error) {
            console.error("Planner failed", error);
            setPlan({
                materials: {
                    cement_bags: 0,
                    sand_tons: 0,
                    aggregate_tons: 0,
                    steel_kg: 0,
                    concrete_volume_m3: 0
                },
                cost_estimation: {
                    total_cost: 0,
                    material_cost: 0,
                    labour_cost: 0,
                    finishing_cost: 0
                },
                task_schedule: []
            });
        } finally {
            setLoading(false);
        }
    };

    // 🧩 STEP 4 — ADD RENDER GUARD
    if (!plan || typeof plan !== "object") {
        return <div style={{ color: "#FF7600", padding: "2rem", textAlign: "center" }}>Generating plan…</div>;
    }

    return (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <h1>Construction Project Planner</h1>
            <div className="card">
                <h3>Project Brief</h3>
                <div style={{ display: 'flex', gap: '1rem' }}>
                    <input className="input-field" style={{ flex: 1 }} value={desc} onChange={e => setDesc(e.target.value)} placeholder="e.g. Create full plan for 20x30 slab construction..." />
                    <button className="btn btn-primary" onClick={handleSubmit} disabled={loading}>{loading ? "Generating..." : "Generate Plan"}</button>
                </div>
            </div>

            {/* Always render structure, data populates safely */}
            <div className="grid-2" style={{ gridTemplateColumns: '1fr 1fr 1fr' }}>

                {/* MATERIAL ESTIMATOR - Adapted to Object Schema */}
                <motion.div className="card" initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.1 }}>
                    <h3>Material Estimator</h3>
                    <table className="data-table">
                        <thead><tr><th>Item</th><th>Qty</th></tr></thead>
                        <tbody>
                            <tr><td>Cement</td><td>{plan.materials?.cement_bags || 0} bags</td></tr>
                            <tr><td>Sand</td><td>{plan.materials?.sand_tons || 0} tons</td></tr>
                            <tr><td>Aggregate</td><td>{plan.materials?.aggregate_tons || 0} tons</td></tr>
                            <tr><td>Steel</td><td>{plan.materials?.steel_kg || 0} kg</td></tr>
                            <tr><td>Concrete Vol</td><td>{plan.materials?.concrete_volume_m3 || 0} m³</td></tr>
                        </tbody>
                    </table>
                </motion.div>

                {/* COST ESTIMATOR - Adapted to Object Schema */}
                <motion.div className="card" initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.2 }}>
                    <h3>Cost Estimator</h3>
                    <table className="data-table">
                        <tbody>
                            <tr><td>Materials</td><td>₹ {plan.cost_estimation?.material_cost || 0}</td></tr>
                            <tr><td>Labour</td><td>₹ {plan.cost_estimation?.labour_cost || 0}</td></tr>
                            <tr><td>Finishing</td><td>₹ {plan.cost_estimation?.finishing_cost || 0}</td></tr>
                            <tr style={{ background: '#eee', fontWeight: 'bold' }}><td>TOTAL</td><td>₹ {plan.cost_estimation?.total_cost || 0}</td></tr>
                        </tbody>
                    </table>
                </motion.div>

                {/* TIME SCHEDULE - Using Nested Map with Guards */}
                <motion.div className="card" initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.3 }}>
                    <h3>Time Schedule</h3>
                    <ul style={{ padding: 0, listStyle: 'none' }}>
                        {/* 🧩 STEP 2 & 3 — FIX NESTED .map() */}
                        {(Array.isArray(plan?.task_schedule) ? plan.task_schedule : []).map((weekData, i) => (
                            <li key={i} style={{ borderBottom: '1px solid #eee', padding: '0.5rem 0' }}>
                                <span className="badge">Week {weekData.week}</span>
                                <ul style={{ marginTop: '0.5rem', paddingLeft: '1rem', listStyle: 'circle', color: '#555' }}>
                                    {(Array.isArray(weekData?.tasks) ? weekData.tasks : []).map((task, j) => (
                                        <li key={j}>{task}</li>
                                    ))}
                                </ul>
                            </li>
                        ))}
                    </ul>
                </motion.div>
            </div>
        </motion.div>
    );
};

// 🛡️ Wrap Export
const ProjectPlanner = () => (
    <ErrorBoundary>
        <ProjectPlannerContent />
    </ErrorBoundary>
);

export default ProjectPlanner;
