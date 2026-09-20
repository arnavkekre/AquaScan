import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  Waves, 
  Compass, 
  MapPin, 
  AlertTriangle, 
  FileSpreadsheet, 
  Cpu, 
  ShieldCheck, 
  Activity,
  ChevronRight
} from 'lucide-react';
import { fetchHealth } from '../services/api';

export default function Navbar() {
  const location = useLocation();
  const [health, setHealth] = useState(null);

  useEffect(() => {
    fetchHealth()
      .then(setHealth)
      .catch(() => setHealth({ status: 'OFFLINE' }));
  }, []);

  const navItems = [
    { path: '/', label: 'Overview', icon: Compass },
    { path: '/console', label: 'Waterfall Console', icon: Waves },
    { path: '/map', label: 'Seafloor GIS', icon: MapPin },
    { path: '/inspector', label: 'Hazard Inspector', icon: AlertTriangle },
    { path: '/reports', label: 'Mission Reports', icon: FileSpreadsheet },
  ];

  return (
    <header className="sticky top-0 z-50 bg-ocean-950/80 backdrop-blur-md border-b border-ocean-800/80 px-4 lg:px-8 py-3 transition-all">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        
        {/* Brand & MoES / NIOT identity */}
        <Link to="/" className="flex items-center gap-3 group">
          <div className="relative w-10 h-10 rounded-xl bg-gradient-to-br from-ocean-800 to-ocean-900 border border-sonar-cyan/30 flex items-center justify-center shadow-lg shadow-sonar-cyan/10 group-hover:border-sonar-cyan transition-all">
            <Waves className="w-6 h-6 text-sonar-cyan animate-pulse" />
            <span className="absolute -top-1 -right-1 flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-sonar-cyan opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-sonar-cyan"></span>
            </span>
          </div>

          <div>
            <div className="flex items-center gap-2">
              <span className="font-mono font-bold text-lg tracking-wider text-white group-hover:text-sonar-cyan transition-colors">
                AQUA<span className="text-sonar-cyan">SCAN</span>
              </span>
              <span className="text-[10px] uppercase font-mono px-1.5 py-0.5 rounded bg-sonar-cyan/10 text-sonar-cyan border border-sonar-cyan/20">
                SIH26057
              </span>
            </div>
            <div className="text-[10px] text-slate-400 tracking-tight font-medium flex items-center gap-1.5">
              <span>MoES / NIOT Underwater AI</span>
            </div>
          </div>
        </Link>

        {/* Primary Navigation Links */}
        <nav className="hidden md:flex items-center gap-1 bg-ocean-900/60 p-1.5 rounded-xl border border-ocean-800">
          {navItems.map((item) => {
            const Icon = item.icon;
            const active = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-medium tracking-wide transition-all ${
                  active
                    ? 'bg-gradient-to-r from-sonar-cyan/20 to-sonar-teal/10 text-sonar-cyan border border-sonar-cyan/30 shadow-sm'
                    : 'text-slate-400 hover:text-slate-100 hover:bg-ocean-800/50'
                }`}
              >
                <Icon className={`w-3.5 h-3.5 ${active ? 'text-sonar-cyan' : 'text-slate-400'}`} />
                {item.label}
              </Link>
            );
          })}
        </nav>

        {/* Edge CPU Readiness & System Status */}
        <div className="flex items-center gap-3">
          <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-lg bg-ocean-900/80 border border-ocean-800 text-xs">
            <Cpu className="w-3.5 h-3.5 text-sonar-cyan" />
            <span className="text-slate-400 text-[11px] font-mono">EDGE:</span>
            <span className="text-slate-200 font-mono text-[11px]">ONNX CPU</span>
            <span className="flex h-2 w-2 rounded-full bg-emerald-400"></span>
          </div>

          <Link
            to="/console"
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-sonar-cyan text-ocean-950 font-semibold text-xs hover:bg-sonar-teal transition-all shadow-md shadow-sonar-cyan/20"
          >
            <span>Launch Sonar</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </Link>
        </div>

      </div>
    </header>
  );
}
