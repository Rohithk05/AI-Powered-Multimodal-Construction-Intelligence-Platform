import React, { useState } from 'react'
import { BrowserRouter as Router, Routes, Route, NavLink } from 'react-router-dom'
import {
  ShieldAlert,
  Activity,
  Building2,
  ClipboardList,
  BookOpen,
  HardHat
} from 'lucide-react'
// import components (to be created)
import SafetyMonitor from './components/SafetyMonitor'
import CrackDetection from './components/CrackDetection'
import Valuation from './components/Valuation'
import ProjectPlanner from './components/ProjectPlanner'
import KnowledgeBase from './components/KnowledgeBase'
import ConstructionChatbot from './components/ConstructionChatbot'
import DailySiteAssistant from './components/DailySiteAssistant'
import WeatherAdvisor from './components/WeatherAdvisor'

function App() {
  return (
    <Router>
      <div className="app-container">
        <aside className="sidebar">
          <div style={{ marginBottom: '3rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <HardHat size={32} color="var(--orange)" />
            <h2 style={{ fontSize: '1.2rem', margin: 0, color: 'white' }}>Construct<span className="text-orange">AI</span></h2>
          </div>

          <nav>
            <NavLink to="/" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
              <ShieldAlert size={20} style={{ marginRight: '10px' }} />
              Safety Monitor
            </NavLink>
            <NavLink to="/crack-detection" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
              <Activity size={20} style={{ marginRight: '10px' }} />
              Crack Detection
            </NavLink>
            <NavLink to="/valuation" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
              <Building2 size={20} style={{ marginRight: '10px' }} />
              Real Estate Valuation
            </NavLink>
            <NavLink to="/planner" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
              <ClipboardList size={20} style={{ marginRight: '10px' }} />
              Project Planner
            </NavLink>
            <NavLink to="/knowledge" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
              <BookOpen size={20} style={{ marginRight: '10px' }} />
              Knowledge Base
            </NavLink>

            <div style={{ margin: '1rem 0', borderTop: '1px solid #444' }}></div>

            <NavLink to="/chatbot" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ marginRight: '10px' }}><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path></svg>
              Chatbot
            </NavLink>
            <NavLink to="/daily-site" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ marginRight: '10px' }}><path d="M9 11l3 3L22 4"></path><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"></path></svg>
              Daily Site Assistant
            </NavLink>
            <NavLink to="/weather" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ marginRight: '10px' }}><path d="M18.6 18.6L22 22"></path><path d="M22 2H2v20h20V2zM6 10h12v4H6z"></path></svg>
              Weather Advisor
            </NavLink>
          </nav>

          <div style={{ marginTop: 'auto', fontSize: '0.8rem', opacity: 0.5 }}>
            <p>v1.0.0 ConstructionGPT</p>
            <p>System Online</p>
          </div>
        </aside>

        <main className="main-content">
          <Routes>
            <Route path="/" element={<SafetyMonitor />} />
            <Route path="/crack-detection" element={<CrackDetection />} />
            <Route path="/valuation" element={<Valuation />} />
            <Route path="/planner" element={<ProjectPlanner />} />
            <Route path="/knowledge" element={<KnowledgeBase />} />
            <Route path="/chatbot" element={<ConstructionChatbot />} />
            <Route path="/daily-site" element={<DailySiteAssistant />} />
            <Route path="/weather" element={<WeatherAdvisor />} />
          </Routes>
        </main>
      </div>
    </Router>
  )
}

export default App
