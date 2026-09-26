import React, { useEffect, useRef } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import MissionConsole from './pages/MissionConsole';
import GISMap from './pages/GISMap';
import Inspector from './pages/Inspector';
import Reports from './pages/Reports';

/** Smooth page transition wrapper with luxury cubic-bezier easing */
function AnimatedPage({ children }) {
  const ref = useRef(null);
  const location = useLocation();

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    el.style.opacity = '0';
    el.style.transform = 'translateY(16px)';
    const raf = requestAnimationFrame(() => {
      el.style.transition = 'opacity 0.5s cubic-bezier(0.4, 0, 0.2, 1), transform 0.5s cubic-bezier(0.4, 0, 0.2, 1)';
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
      <div className="min-h-screen bg-[#121212] text-[#ffffff] flex flex-col font-poppins selection:bg-crimson selection:text-white relative overflow-x-hidden">

        {/* Subtle acoustic scanline vignette */}
        <div className="sonar-scanlines fixed inset-0 z-0 pointer-events-none opacity-40" />

        {/* Fixed 80px Luxury Header */}
        <Navbar />

        {/* Main Content Area (Offset by 80px / pt-20 for fixed header) */}
        <main className="flex-1 pt-20 relative z-10">
          <AnimatedRoutes />
        </main>

        {/* Global Dark Luxury Hydrographic Footer */}
        <footer className="relative border-t border-white/[0.08] bg-[#121212] py-8 px-4 sm:px-6 lg:px-8 text-xs text-zinc-400 z-10">
          <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4 text-center md:text-left">
            <div>
              <div className="flex items-center justify-center md:justify-start gap-2">
                <span className="font-calsans font-bold text-base tracking-wider text-white">
                  AQUA<span className="text-crimson">SCAN</span>
                </span>
                <span className="text-zinc-600">•</span>
                <span className="text-zinc-300 font-medium tracking-wide">
                  Ministry of Earth Sciences (MoES) & National Institute of Ocean Technology (NIOT)
                </span>
              </div>
              <div className="text-[11px] text-zinc-500 mt-1">
                Autonomous Side-Scan Sonar Acoustic Processing & AI Marine Debris Geocoding • SIH26057
              </div>
            </div>

            <div className="flex items-center gap-5 text-[11px] text-zinc-400 font-medium">
              <span className="hover:text-crimson transition-colors cursor-default">7x7 Adaptive Lee Filter</span>
              <span className="text-zinc-700">•</span>
              <span className="hover:text-crimson transition-colors cursor-default">YOLOv8s ONNX Edge</span>
              <span className="text-zinc-700">•</span>
              <span className="hover:text-crimson transition-colors cursor-default">WGS-84 Ray-Tracing</span>
              <span className="text-zinc-700">•</span>
              <span className="px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-[10px]">
                IHO S-44 ORDER 1A
              </span>
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
