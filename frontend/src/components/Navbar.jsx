import React, { useState, useEffect, useRef } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  Waves, 
  Compass, 
  MapPin, 
  AlertTriangle, 
  FileSpreadsheet, 
  Cpu, 
  ChevronRight,
  Menu,
  X
} from 'lucide-react';
import { fetchHealth } from '../services/api';

export default function Navbar() {
  const location   = useLocation();
  const [health, setHealth]     = useState(null);
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    fetchHealth()
      .then(setHealth)
      .catch(() => setHealth({ status: 'OFFLINE' }));
  }, []);

  // Scroll-aware backdrop enhancement
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Close mobile menu on route change
  useEffect(() => setMobileOpen(false), [location.pathname]);

  const navItems = [
    { path: '/',          label: 'Overview',         icon: Compass },
    { path: '/console',   label: 'Waterfall Console', icon: Waves },
    { path: '/map',       label: 'Seafloor GIS',      icon: MapPin },
    { path: '/inspector', label: 'Hazard Inspector',  icon: AlertTriangle },
    { path: '/reports',   label: 'Mission Reports',   icon: FileSpreadsheet },
  ];

  return (
    <>
      <header
        className={`sticky top-0 z-50 px-4 lg:px-8 py-3 transition-all duration-400 ${
          scrolled
            ? 'bg-ocean-950/95 backdrop-blur-xl border-b border-ocean-800/90 shadow-lg shadow-ocean-950/60'
            : 'bg-ocean-950/80 backdrop-blur-md border-b border-ocean-800/50'
        }`}
      >
        <div className="max-w-7xl mx-auto flex items-center justify-between">

          {/* ── Brand ──────────────────────────────── */}
          <Link to="/" className="flex items-center gap-3 group">
            <div className="relative w-10 h-10 rounded-xl bg-gradient-to-br from-ocean-800 to-ocean-900 border border-sonar-cyan/30 flex items-center justify-center shadow-lg shadow-sonar-cyan/10 group-hover:border-sonar-cyan group-hover:shadow-sonar-cyan/25 transition-all duration-400">
              {/* Sonar rings */}
              <span className="sonar-ring w-10 h-10 -inset-0 absolute" />
              <span className="sonar-ring w-10 h-10 -inset-0 absolute" />
              <Waves className="w-5 h-5 text-sonar-cyan relative z-10" style={{ animation: 'float 4s ease-in-out infinite' }} />
              {/* Live dot */}
              <span className="absolute -top-1 -right-1 flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-sonar-cyan opacity-75" />
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-sonar-cyan" />
              </span>
            </div>

            <div>
              <div className="flex items-center gap-2">
                <span className="font-mono font-bold text-lg tracking-wider text-white group-hover:text-sonar-cyan transition-colors duration-300">
                  AQUA<span className="text-sonar-cyan">SCAN</span>
                </span>
                <span className="text-[10px] uppercase font-mono px-1.5 py-0.5 rounded bg-sonar-cyan/10 text-sonar-cyan border border-sonar-cyan/20 group-hover:bg-sonar-cyan/20 transition-colors duration-300">
                  SIH26057
                </span>
              </div>
              <div className="text-[10px] text-slate-500 tracking-tight font-medium group-hover:text-slate-400 transition-colors duration-300">
                MoES / NIOT Underwater AI
              </div>
            </div>
          </Link>

          {/* ── Desktop Nav ─────────────────────────── */}
          <nav className="hidden md:flex items-center gap-1 bg-ocean-900/60 p-1.5 rounded-xl border border-ocean-800 backdrop-blur-sm">
            {navItems.map((item) => {
              const Icon   = item.icon;
              const active = location.pathname === item.path;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`relative flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-medium tracking-wide transition-all duration-300 ${
                    active
                      ? 'bg-gradient-to-r from-sonar-cyan/20 to-sonar-teal/10 text-sonar-cyan border border-sonar-cyan/30 shadow-sm nav-active-indicator'
                      : 'text-slate-400 hover:text-slate-100 hover:bg-ocean-800/70'
                  }`}
                >
                  <Icon className={`w-3.5 h-3.5 transition-transform duration-300 ${active ? 'text-sonar-cyan scale-110' : 'text-slate-500'}`} />
                  {item.label}
                  {/* Ripple background on hover */}
                  {!active && (
                    <span className="absolute inset-0 rounded-lg opacity-0 hover:opacity-100 transition-opacity duration-300 bg-ocean-800/40" />
                  )}
                </Link>
              );
            })}
          </nav>

          {/* ── Right Controls ──────────────────────── */}
          <div className="flex items-center gap-3">
            {/* Edge status chip */}
            <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-lg bg-ocean-900/80 border border-ocean-800 text-xs hover:border-ocean-700 transition-all duration-300">
              <Cpu className="w-3.5 h-3.5 text-sonar-cyan" />
              <span className="text-slate-400 text-[11px] font-mono">EDGE:</span>
              <span className="text-slate-200 font-mono text-[11px]">ONNX CPU</span>
              <span className="flex h-2 w-2 rounded-full bg-emerald-400 shadow-sm shadow-emerald-400/50" />
            </div>

            {/* CTA button with shimmer */}
            <Link
              to="/console"
              className="btn-shimmer flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-sonar-cyan text-ocean-950 font-bold text-xs hover:bg-sonar-teal transition-all duration-300 shadow-md shadow-sonar-cyan/25 hover:shadow-sonar-cyan/40 hover:scale-105 active:scale-95"
            >
              <span>Launch Sonar</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </Link>

            {/* Mobile menu toggle */}
            <button
              onClick={() => setMobileOpen((v) => !v)}
              className="md:hidden p-2 rounded-lg bg-ocean-900 border border-ocean-800 text-slate-400 hover:text-white transition-all duration-300"
            >
              {mobileOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
            </button>
          </div>

        </div>
      </header>

      {/* ── Mobile Dropdown Menu ─────────────────────── */}
      <div
        className={`md:hidden sticky top-[56px] z-40 border-b border-ocean-800/80 bg-ocean-950/98 backdrop-blur-xl overflow-hidden transition-all duration-400 ease-smooth ${
          mobileOpen ? 'max-h-80 opacity-100' : 'max-h-0 opacity-0'
        }`}
      >
        <nav className="flex flex-col p-3 gap-1">
          {navItems.map((item, i) => {
            const Icon   = item.icon;
            const active = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                style={{ transitionDelay: `${i * 40}ms` }}
                className={`flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium transition-all duration-300 ${
                  active
                    ? 'bg-sonar-cyan/15 text-sonar-cyan border border-sonar-cyan/25'
                    : 'text-slate-400 hover:text-white hover:bg-ocean-800/60'
                }`}
              >
                <Icon className={`w-4 h-4 ${active ? 'text-sonar-cyan' : 'text-slate-500'}`} />
                {item.label}
              </Link>
            );
          })}
        </nav>
      </div>
    </>
  );
}
