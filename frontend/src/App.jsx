import React, { useEffect, useRef } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import MissionConsole from './pages/MissionConsole';
import GISMap from './pages/GISMap';
import Inspector from './pages/Inspector';
import Reports from './pages/Reports';

/** Smooth page transition wrapper — fades + slides on route change */
function AnimatedPage({ children }) {
  const ref = useRef(null);
  const location = useLocation();

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    el.style.opacity = '0';
    el.style.transform = 'translateY(14px)';
    const raf = requestAnimationFrame(() => {
      el.style.transition = 'opacity 0.45s ease, transform 0.45s ease';
      el.style.opacity = '1';
      el.style.transform = 'translateY(0)';
    });
    return () => cancelAnimationFrame(raf);
  }, [location.pathname]);

  return <div ref={ref}>{children}</div>;
}

export default function App() {
  return (
    <Router>
      <div className="min-h-screen bg-ocean-950 text-slate-100 flex flex-col font-sans selection:bg-sonar-cyan selection:text-ocean-950 relative overflow-x-hidden">

        {/* Persistent subtle scanline overlay */}
        <div className="sonar-scanlines fixed inset-0 z-0 pointer-events-none" />

        {/* Navigation Bar */}
        <Navbar />

        {/* Dynamic Route Pages */}
        <main className="flex-1 pb-20 relative z-10">
          <AnimatedRoutes />
        </main>

        {/* Global Hydrographic Footer */}
        <footer className="relative border-t border-ocean-800/60 bg-ocean-950/95 py-6 px-4 lg:px-8 text-xs font-mono text-slate-500 overflow-hidden z-10">
          {/* Wave decoration */}
          <div className="absolute top-0 left-0 right-0 h-px overflow-hidden">
            <div
              className="absolute top-0 h-px w-[200%]"
              style={{
                background: 'linear-gradient(90deg, transparent, #00F0FF33, #0DF5C444, #00F0FF33, transparent, transparent, #00F0FF22, transparent)',
                animation: 'waveMove 6s linear infinite',
              }}
            />
          </div>

          <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3 text-center sm:text-left">
            <div>
              <span className="text-slate-300 font-bold tracking-wide">
                AQUA<span className="text-sonar-cyan">SCAN</span>
              </span>
              <span className="text-slate-500"> • Automated Side-Scan Sonar Marine Debris Detection</span>
              <div className="text-[11px] text-slate-600 mt-0.5">
                Smart India Hackathon 2026 (SIH26057) • Ministry of Earth Sciences (MoES) / NIOT
              </div>
            </div>
            <div className="flex items-center gap-4 text-[11px] text-slate-600">
              <span className="hover:text-sonar-cyan transition-colors duration-300 cursor-default">7x7 Lee Filter</span>
              <span className="text-ocean-700">•</span>
              <span className="hover:text-sonar-cyan transition-colors duration-300 cursor-default">YOLOv8s ONNX</span>
              <span className="text-ocean-700">•</span>
              <span className="hover:text-sonar-cyan transition-colors duration-300 cursor-default">WGS-84 Geotagging</span>
            </div>
          </div>
        </footer>

      </div>
    </Router>
  );
}

function AnimatedRoutes() {
  return (
    <AnimatedPage>
      <Routes>
        <Route path="/"          element={<Home />} />
        <Route path="/console"   element={<MissionConsole />} />
        <Route path="/map"       element={<GISMap />} />
        <Route path="/inspector" element={<Inspector />} />
        <Route path="/reports"   element={<Reports />} />
      </Routes>
    </AnimatedPage>
  );
}
