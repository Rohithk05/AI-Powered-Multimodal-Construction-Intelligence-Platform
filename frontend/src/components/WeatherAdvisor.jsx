import React, { useState } from 'react';
import axios from 'axios';
import { motion } from 'framer-motion';
import { CloudRain, Sun, Wind, Umbrella } from 'lucide-react';

const WeatherAdvisor = () => {
    const [activity, setActivity] = useState('Slab Conversion');
    const [weather, setWeather] = useState('Rainy');
    const [advice, setAdvice] = useState(null);
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const res = await axios.post('http://localhost:8000/api/weather-advisor', {
                activity: activity,
                weather: weather
            });
            setAdvice(res.data);
        } catch (error) {
            console.error(error);
            alert("Analysis failed");
        } finally {
            setLoading(false);
        }
    };

    return (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <h1>Weather Advisor</h1>
            <div className="grid-2">
                <div className="card">
                    <h3>Check Weather Impact</h3>
                    <form onSubmit={handleSubmit}>
                        <div className="input-group">
                            <label className="label">Planned Activity</label>
                            <input className="input-field" value={activity} onChange={e => setActivity(e.target.value)} />
                        </div>
                        <div className="input-group">
                            <label className="label">Current/Forecast Weather</label>
                            <select className="input-field" value={weather} onChange={e => setWeather(e.target.value)}>
                                <option>Sunny</option>
                                <option>Rainy</option>
                                <option>Windy</option>
                                <option>Cloudy</option>
                                <option>Stormy</option>
                            </select>
                        </div>
                        <button className="btn btn-primary full-width" disabled={loading}>
                            {loading ? "Analyzing..." : "Check Feasibility"}
                        </button>
                    </form>
                </div>

                {advice && (
                    <div className="card" style={{ textAlign: 'center' }}>
                        <div style={{
                            fontSize: '2rem',
                            fontWeight: 900,
                            color: advice.go_no_go === 'GO' ? 'green' : advice.go_no_go === 'NO-GO' ? 'red' : 'orange',
                            marginBottom: '1rem'
                        }}>
                            {advice.go_no_go}
                        </div>

                        <div style={{ marginBottom: '1.5rem', fontSize: '1.1rem' }}>
                            {advice.recommendation}
                        </div>

                        <div style={{ textAlign: 'left', marginBottom: '1rem' }}>
                            <h4 style={{ color: '#555' }}>Hazards</h4>
                            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                                {advice.weather_risks.map((r, i) => <span key={i} className="badge badge-critical">{r}</span>)}
                            </div>
                        </div>

                        <div style={{ textAlign: 'left' }}>
                            <h4 style={{ color: '#555' }}>Required Precautions</h4>
                            <ul style={{ paddingLeft: '1.2rem', margin: 0 }}>
                                {advice.precautions.map((p, i) => <li key={i}>{p}</li>)}
                            </ul>
                        </div>
                    </div>
                )}
            </div>
        </motion.div>
    );
};

export default WeatherAdvisor;
