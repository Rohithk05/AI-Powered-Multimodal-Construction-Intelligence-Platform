import React, { useState } from 'react';
import { Building2, TrendingUp } from 'lucide-react';
import axios from 'axios';
import { motion } from 'framer-motion';

const Valuation = () => {
    const [form, setForm] = useState({ location: '', area: '', property_type: 'Residential', building_age: '', amenities: '' });
    const [result, setResult] = useState(null);
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        const formData = new FormData();
        Object.keys(form).forEach(key => formData.append(key, form[key]));

        try {
            const response = await axios.post('http://localhost:8000/api/real-estate-valuation', formData);
            setResult(response.data);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <h1>Real Estate Estimator</h1>
            <div className="grid-2">
                <div className="card">
                    <h3>Property Details</h3>
                    <form onSubmit={handleSubmit}>
                        <div className="input-group">
                            <label className="label">Location</label>
                            <input className="input-field" name="location" onChange={handleChange} required />
                        </div>
                        <div className="grid-2">
                            <div className="input-group">
                                <label className="label">Area (sq ft)</label>
                                <input className="input-field" name="area" type="number" onChange={handleChange} required />
                            </div>
                            <div className="input-group">
                                <label className="label">Age (Years)</label>
                                <input className="input-field" name="building_age" type="number" onChange={handleChange} required />
                            </div>
                        </div>
                        <div className="input-group">
                            <label className="label">Type</label>
                            <select className="input-field" name="property_type" onChange={handleChange}>
                                <option>Residential</option>
                                <option>Commercial</option>
                                <option>Industrial</option>
                            </select>
                        </div>
                        <div className="input-group">
                            <label className="label">Amenities</label>
                            <textarea className="textarea-field" name="amenities" rows="2" onChange={handleChange} placeholder="Pool, Gym, Parking..." />
                        </div>
                        <button className="btn btn-primary full-width" type="submit" disabled={loading}>Calculate Value</button>
                    </form>
                </div>

                {result && (
                    <div className="card">
                        <h3>Valuation Report</h3>
                        <div style={{ textAlign: 'center', margin: '2rem 0', padding: '1.5rem', border: '2px solid var(--orange)' }}>
                            <div className="label">Estimated Market Value</div>
                            <div style={{ fontSize: '2.5rem', fontWeight: 900, color: 'var(--coal)' }}>{result.market_value_range}</div>
                        </div>

                        <table className="data-table">
                            <tbody>
                                <tr>
                                    <td><strong>Price / Sq Ft</strong></td>
                                    <td>{result.price_per_sqft}</td>
                                </tr>
                                <tr>
                                    <td><strong>Rent Estimate</strong></td>
                                    <td>{result.rent_estimate}</td>
                                </tr>
                                <tr>
                                    <td><strong>ROI</strong></td>
                                    <td style={{ color: 'green', fontWeight: 'bold' }}>{result.roi_percentage}</td>
                                </tr>
                                <tr>
                                    <td><strong>Appreciation</strong></td>
                                    <td>{result.appreciation_forecast}</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </motion.div>
    );
}

export default Valuation;
