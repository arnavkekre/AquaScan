import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  Waves, 
  Compass, 
  MapPin, 
  AlertTriangle, 
  FileSpreadsheet, 
  Mail,
  ChevronRight,
  Menu,
  X,
  Radio
} from 'lucide-react';
import { fetchHealth } from '../services/api';

export default function Navbar() {
  const location = useLocation();
  const [health, setHealth] = useState(null);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    fetchHealth()
      .then(setHealth)
      .catch(() => setHealth({ status: 'OFFLINE' }));
  }, []);

  useEffect(() => {
    setMobileOpen(false);
  }, [location.pathname]);

  const navItems = [
    { path: '/',          label: 'Overview',         icon: Compass },
    { path: '/console',   label: 'Waterfall Console', icon: Waves },
    { path: '/map',       label: 'Seafloor GIS',      icon: MapPin },
    { path: '/inspector', label: 'Hazard Inspector',  icon: AlertTriangle },
    { path: '/reports',   label: 'Mission Reports',   icon: FileSpreadsheet },
  ];

  return (
    <>
      <header className="fixed top-0 left-0 right-0 h-20 z-50 glass-dark border-b border-white/[0.08] transition-all duration-300">
        <div className="max-w-7xl mx-auto h-full px-4 sm:px-6 lg:px-8 flex items-center justify-between">

          {/* ── Brand & 40px Icon Box ─────────────────── */}
          <Link to="/" className="flex items-center gap-3.5 group">
            <div className="w-10 h-10 rounded-[12px] bg-[#1a1a1a] border border-white/10 flex items-center justify-center text-crimson group-hover:border-crimson/60 group-hover:shadow-[0_0_15px_rgba(225,29,72,0.35)] transition-all duration-300">
              <Radio className="w-5 h-5 text-crimson group-hover:scale-110 transition-transform duration-300" />
            </div>

            <div className="flex flex-col">
              <div className="flex items-center gap-2">
                <span className="font-calsans font-bold text-xl tracking-wider text-white">
                  AQUA<span className="text-crimson">SCAN</span>
                </span>
                <span className="text-[10px] font-semibold tracking-wider px-2 py-0.5 rounded-full bg-crimson/15 text-crimson border border-crimson/30 uppercase">
                  SIH26057
                </span>
              </div>
              <span className="text-[10px] text-zinc-400 font-poppins font-normal tracking-wide">
                MoES / NIOT Hydrographic Fleet
              </span>
            </div>
          </Link>

          {/* ── Center Desktop Nav (Uppercase, Tracking-Widest) ──── */}
          <nav className="hidden lg:flex items-center gap-7">
            {navItems.map((item) => {
              const active = location.pathname === item.path;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`text-xs font-semibold uppercase tracking-widest transition-all duration-200 py-1 relative ${
                    active
                      ? 'text-crimson font-bold'
                      : 'text-zinc-400 hover:text-white'
                  }`}
                >
                  {item.label}
                  {active && (
                    <span className="absolute bottom-0 left-0 right-0 h-[2px] bg-crimson rounded-full shadow-[0_0_8px_rgba(225,29,72,0.8)]" />
                  )}
                </Link>
              );
            })}
          </nav>

          {/* ── Right Controls: Live Beacon, Developer Email & Dual-Line CTA ─ */}
          <div className="flex items-center gap-4">
            
            {/* Live green beacon indicator */}
            <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#1a1a1a] border border-white/10 text-[11px] font-medium text-zinc-300">
              <span className="w-2 h-2 rounded-full bg-emerald-500 pulse-green" />
              <span className="tracking-wider uppercase text-[10px] text-zinc-400 font-semibold">LIVE // ONNX EDGE</span>
            </div>

            {/* Developer Contact Email Link */}
            <a 
              href="mailto:arnavkekre2807@gmail.com"
              className="hidden md:flex items-center gap-2 text-xs text-zinc-300 hover:text-white transition-all duration-200 bg-[#1a1a1a] px-3.5 py-1.5 rounded-full border border-white/10 hover:border-crimson/50 hover:shadow-[0_0_12px_rgba(225,29,72,0.25)]"
              title="Contact Lead Developer"
            >
              <Mail className="w-3.5 h-3.5 text-crimson" />
              <span className="font-poppins text-[11px] tracking-wide">arnavkekre2807@gmail.com</span>
            </a>

            {/* Dual-line deployment button */}
            <Link
              to="/console"
              className="btn-crimson px-5 py-2 rounded-xl flex flex-col items-center justify-center text-center shadow-lg shadow-crimson/25 hover:shadow-crimson/40 hover:scale-[1.02] active:scale-[0.98] transition-all"
            >
              <span className="text-[13px] font-calsans font-bold tracking-wider leading-tight text-white flex items-center gap-1">
                DEPLOY VESSEL
                <ChevronRight className="w-3.5 h-3.5 stroke-[2.5]" />
              </span>
              <span className="text-[9px] font-poppins font-medium tracking-widest text-white/80 uppercase leading-none">
                INSTANT NIOT CLEARANCE
              </span>
            </Link>

            {/* Mobile Hamburger Button */}
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="lg:hidden p-2 rounded-lg bg-[#1a1a1a] border border-white/10 text-zinc-300 hover:text-white"
              aria-label="Toggle navigation menu"
            >
              {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>

        </div>
      </header>

      {/* ── Mobile Drawer (Glass Dark) ────────────────── */}
      {mobileOpen && (
        <div className="lg:hidden fixed top-20 left-0 right-0 z-40 glass-dark-strong border-b border-white/10 p-5 shadow-2xl transition-all">
          <nav className="flex flex-col gap-3">
            {navItems.map((item) => {
              const Icon = item.icon;
              const active = location.pathname === item.path;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold tracking-wider uppercase transition-all ${
                    active
                      ? 'bg-crimson/15 text-crimson border border-crimson/30'
                      : 'text-zinc-300 hover:bg-white/5 hover:text-white'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  {item.label}
                </Link>
              );
            })}
            <div className="pt-3 border-t border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs text-zinc-400">
              <span className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-500 pulse-green" />
                EDGE ONNX READY
              </span>
              <a href="mailto:arnavkekre2807@gmail.com" className="text-crimson font-medium flex items-center gap-1.5">
                <Mail className="w-3.5 h-3.5" />
                arnavkekre2807@gmail.com
              </a>
            </div>
          </nav>
        </div>
      )}
    </>
  );
}
