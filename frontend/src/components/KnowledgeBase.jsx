import React, { useState } from 'react';
import axios from 'axios';
import { motion } from 'framer-motion';
import { Book, FileText, LifeBuoy } from 'lucide-react';

const KnowledgeBase = () => {
    const [query, setQuery] = useState('');
    const [mode, setMode] = useState('safety'); // safety, technique, document
    const [result, setResult] = useState(null);
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        const formData = new FormData();
        formData.append('text', query);
        formData.append('context_type', mode);

        try {
            const response = await axios.post('http://localhost:8000/api/knowledge-assistant', formData);
            setResult(response.data);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <h1>Knowledge Assistant</h1>

            <div className="card">
                <div style={{ display: 'flex', gap: '1rem', marginBottom: '1rem' }}>
                    <button className={`btn ${mode === 'safety' ? 'btn-primary' : ''}`} onClick={() => setMode('safety')} style={{ border: '1px solid #ccc' }}>
                        <LifeBuoy size={16} style={{ marginRight: 8 }} /> Safety
                    </button>
                    <button className={`btn ${mode === 'technique' ? 'btn-primary' : ''}`} onClick={() => setMode('technique')} style={{ border: '1px solid #ccc' }}>
                        <Book size={16} style={{ marginRight: 8 }} /> Technique
                    </button>
                    <button className={`btn ${mode === 'document' ? 'btn-primary' : ''}`} onClick={() => setMode('document')} style={{ border: '1px solid #ccc' }}>
                        <FileText size={16} style={{ marginRight: 8 }} /> Doc Gen
                    </button>
                </div>

                <form onSubmit={handleSubmit}>
                    <div className="input-group">
                        <textarea className="textarea-field" rows="3" value={query} onChange={e => setQuery(e.target.value)} placeholder={mode === 'safety' ? 'e.g. Steps for scaffolding' : (mode === 'technique' ? 'e.g. Shuttering vs Centering' : 'e.g. Create simple work order...')} />
                    </div>
                    <button className="btn btn-primary" type="submit" disabled={loading}>Ask Expert</button>
                </form>
            </div>

            {result && (
                <div className="card" style={{ background: '#fafafa' }}>
                    {mode === 'safety' && (
                        <div>
                            <h3>Safety Procedure</h3>
                            <div className="label">Procedure</div>
                            <p>{result.procedure}</p>
                            <div className="label">PPE Required</div>
                            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: '1rem' }}>
                                {result.ppe_list?.map((p, i) => <span key={i} className="badge badge-critical">{p}</span>)}
                            </div>
                        </div>
                    )}
                    {mode === 'technique' && (
                        <div>
                            <h3>Civil Engineering Concept</h3>
                            <p><strong>Definition:</strong> {result.definition}</p>
                            <p><strong>Comparison:</strong> {result.comparison}</p>
                            <ul style={{ background: '#eee', padding: '1rem 2rem' }}>
                                {result.pros_cons?.map((p, i) => <li key={i}>{p}</li>)}
                            </ul>
                        </div>
                    )}
                    {mode === 'document' && (
                        <div>
                            <h3>Generated Document</h3>
                            <pre style={{ background: 'white', padding: '1.5rem', border: '1px solid #ddd', whiteSpace: 'pre-wrap' }}>
                                {result.document_content}
                            </pre>
                        </div>
                    )}
                </div>
            )}
        </motion.div>
    );
};

export default KnowledgeBase;
