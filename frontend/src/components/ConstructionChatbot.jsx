import React, { useState } from 'react';
import axios from 'axios';
import { motion } from 'framer-motion';
import { MessageSquare, Send } from 'lucide-react';

const ConstructionChatbot = () => {
    const [query, setQuery] = useState('');
    const [conversation, setConversation] = useState([]);
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!query.trim()) return;

        const userMsg = { role: 'user', text: query };
        setConversation(prev => [...prev, userMsg]);
        setLoading(true);
        setQuery('');

        try {
            const res = await axios.post('http://localhost:8000/api/chatbot', { query: userMsg.text });
            const aiMsg = {
                role: 'ai',
                text: res.data.reply,
                suggestions: res.data.action_suggestions || []
            };
            setConversation(prev => [...prev, aiMsg]);
        } catch (error) {
            console.error(error);
            setConversation(prev => [...prev, { role: 'ai', text: "Sorry, I encountered an error. Please try again." }]);
        } finally {
            setLoading(false);
        }
    };

    return (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <h1>Construction Chatbot</h1>
            <div className="card" style={{ height: '70vh', display: 'flex', flexDirection: 'column' }}>
                <div style={{ flex: 1, overflowY: 'auto', marginBottom: '1rem', padding: '1rem', background: '#f9f9f9', borderRadius: '8px' }}>
                    {conversation.length === 0 && <div style={{ textAlign: 'center', color: '#999', marginTop: '20%' }}>Ask me anything about construction...</div>}
                    {conversation.map((msg, idx) => (
                        <div key={idx} style={{ marginBottom: '1rem', textAlign: msg.role === 'user' ? 'right' : 'left' }}>
                            <div style={{
                                display: 'inline-block',
                                padding: '0.8rem 1.2rem',
                                borderRadius: '12px',
                                background: msg.role === 'user' ? 'var(--orange)' : 'white',
                                color: msg.role === 'user' ? 'white' : 'var(--dark)',
                                border: msg.role === 'ai' ? '1px solid #eee' : 'none',
                                maxWidth: '80%'
                            }}>
                                {msg.text}
                            </div>
                            {msg.suggestions && msg.suggestions.length > 0 && (
                                <div style={{ marginTop: '0.5rem', marginLeft: '1rem' }}>
                                    {msg.suggestions.map((s, i) => (
                                        <div key={i} className="badge" style={{ margin: '0.2rem', display: 'inline-block' }}>{s}</div>
                                    ))}
                                </div>
                            )}
                        </div>
                    ))}
                    {loading && <div style={{ color: '#999', fontStyle: 'italic' }}>AI is thinking...</div>}
                </div>
                <form onSubmit={handleSubmit} style={{ display: 'flex', gap: '0.5rem' }}>
                    <input
                        className="input-field"
                        value={query}
                        onChange={e => setQuery(e.target.value)}
                        placeholder="Type your question..."
                        style={{ flex: 1 }}
                        disabled={loading}
                    />
                    <button type="submit" className="btn btn-primary" disabled={loading}>
                        <Send size={18} />
                    </button>
                </form>
            </div>
        </motion.div>
    );
};

export default ConstructionChatbot;
