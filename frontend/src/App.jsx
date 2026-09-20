import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import MissionConsole from './pages/MissionConsole';
import GISMap from './pages/GISMap';
import Inspector from './pages/Inspector';
import Reports from './pages/Reports';

export default function App() {
  return (
    <Router>
      <div className="min-h-screen bg-ocean-950 text-slate-100 flex flex-col font-sans selection:bg-sonar-cyan selection:text-ocean-950">
        
        {/* Navigation Bar */}
        <Navbar />

        {/* Dynamic Route Pages */}
        <main className="flex-1 pb-16">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/console" element={<MissionConsole />} />
            <Route path="/map" element={<GISMap />} />
            <Route path="/inspector" element={<Inspector />} />
            <Route path="/reports" element={<Reports />} />
          </Routes>
        </main>

        {/* Global Hydrographic Footer */}
        <footer className="border-t border-ocean-900 bg-ocean-950/90 py-6 px-4 lg:px-8 text-xs font-mono text-slate-500">
          <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3 text-center sm:text-left">
            <div>
              <span className="text-slate-300 font-bold">AquaScan</span> • Automated Side-Scan Sonar Marine Debris Detection
              <div className="text-[11px] text-slate-500 mt-0.5">
                Smart India Hackathon 2026 (SIH26057) • Ministry of Earth Sciences (MoES) / NIOT
              </div>
            </div>
            <div className="flex items-center gap-4 text-[11px]">
              <span>7x7 Lee Filter</span>
              <span>•</span>
              <span>YOLOv8s ONNX</span>
              <span>•</span>
              <span>WGS-84 Geotagging</span>
            </div>
          </div>
        </footer>

      </div>
    </Router>
  );
}
