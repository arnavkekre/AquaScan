import React, { useState, useEffect } from 'react';
import { 
  FileSpreadsheet, 
  Download, 
  Copy, 
  Check, 
  FileJson, 
  ShieldCheck, 
  Award,
  Layers,
  Terminal
} from 'lucide-react';
import { getExportUrl } from '../services/api';

export default function Reports() {
  const [copied, setCopied]   = useState(false);
  const [mounted, setMounted] = useState(false);
  const [showCursor, setShowCursor] = useState(true);

  useEffect(() => {
    const t = setTimeout(() => setMounted(true), 60);
    return () => clearTimeout(t);
  }, []);

  // Blinking cursor effect
  useEffect(() => {
    const interval = setInterval(() => setShowCursor(v => !v), 550);
    return () => clearInterval(interval);
  }, []);

  const sampleGeoJson = {
    "type": "FeatureCollection",
    "metadata": {
      "generator": "AquaScan Autonomous SSS Processor",
      "standards_compliance": "MoES / NIOT / IHO S-44 Order 1a",
      "mission_name": "NIOT_BAY_OF_BENGAL_EXPEDITION_26",
      "generated_at": new Date().toISOString()
    },
    "features": [
      {
        "type": "Feature",
        "geometry": { "type": "Point", "coordinates": [80.273512, 13.083214] },
        "properties": {
          "id": "HAZ-26057-01",
          "class_name": "ghost_net",
          "display_name": "Derelict Fishing Net (Ghost Gear)",
          "confidence_pct": 99.5,
          "hazard_level": "Critical Ecological Hazard",
          "priority": "P1 - CRITICAL URGENT",
          "estimated_length_m": 14.2,
          "height_off_seabed_m": 2.8,
          "action_required": "Deploy ROV with hydraulic line cutters for immediate recovery.",
          "vessel_dispatch": "MoES Coastal Research Vessel (CRV)"
        }
      },
      {
        "type": "Feature",
        "geometry": { "type": "Point", "coordinates": [80.278014, 13.086112] },
        "properties": {
          "id": "HAZ-26057-03",
          "class_name": "submarine_pipeline",
          "display_name": "Subsea Fuel Pipeline Span",
          "confidence_pct": 99.4,
          "hazard_level": "Infrastructure Asset",
          "priority": "P2 - INFRASTRUCTURE MONITORING",
          "estimated_length_m": 62.0,
          "height_off_seabed_m": 0.4,
          "action_required": "Verify pipeline integrity, burial depth, and free-span scouring.",
          "vessel_dispatch": "Offshore Survey Vessel / Pipeline ROV"
        }
      }
    ]
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(JSON.stringify(sampleGeoJson, null, 2));
    setCopied(true);
    setTimeout(() => setCopied(false), 2200);
  };

  const jsonString = JSON.stringify(sampleGeoJson, null, 2);

  // Syntax-highlight helper (very minimal)
  const highlightJson = (str) => {
    return str
      .replace(/"([^"]+)":/g, '<span class="text-sonar-cyan">"$1"</span>:')
      .replace(/: "([^"]+)"/g, ': <span class="text-emerald-400">"$1"</span>')
      .replace(/: (\d+\.?\d*)/g, ': <span class="text-amber-400">$1</span>')
      .replace(/: (true|false|null)/g, ': <span class="text-rose-400">$1</span>');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 lg:px-8 py-6 space-y-6">

      {/* ── Header ─────────────────────────────────────── */}
      <div
        className="flex flex-wrap items-center justify-between gap-4"
        style={{
          opacity: mounted ? 1 : 0,
          transform: mounted ? 'translateY(0)' : 'translateY(16px)',
          transition: 'opacity 0.5s ease, transform 0.5s ease',
        }}
      >
        <div>
          <h1 className="text-2xl font-bold text-white flex items-center gap-2.5">
            <FileSpreadsheet className="w-6 h-6 text-sonar-cyan" style={{ animation: 'float 5s ease-in-out infinite' }} />
            Hydrographic Clearance Reports & GIS Exports
          </h1>
          <p className="text-sm text-slate-400 mt-1">
            Structured mission exports for the Ministry of Earth Sciences (MoES) and National Institute of Ocean Technology (NIOT).
          </p>
        </div>

        {/* Download Buttons */}
        <div className="flex items-center gap-3 flex-wrap">
          <a
            href={getExportUrl('csv')}
            download="aquascan_debris_clearance.csv"
            className="btn-shimmer group flex items-center gap-2 px-4 py-2 rounded-xl bg-ocean-900 border border-ocean-700 hover:border-sonar-cyan/50 text-slate-200 text-xs font-mono font-semibold transition-all duration-300 hover:scale-105 active:scale-95"
          >
            <Download className="w-3.5 h-3.5 text-sonar-cyan group-hover:translate-y-0.5 transition-transform duration-300" />
            <span>Download CSV Log</span>
          </a>

          <a
            href={getExportUrl('geojson')}
            download="aquascan_debris_clearance.geojson"
            className="btn-shimmer group flex items-center gap-2 px-4 py-2 rounded-xl bg-sonar-cyan text-ocean-950 font-bold text-xs font-mono hover:bg-sonar-teal transition-all duration-300 shadow-md shadow-sonar-cyan/25 hover:shadow-sonar-cyan/40 hover:scale-105 active:scale-95"
          >
            <Download className="w-3.5 h-3.5 group-hover:translate-y-0.5 transition-transform duration-300" />
            <span>Download RFC 7946 GeoJSON</span>
          </a>
        </div>
      </div>

      {/* ── Compliance Strip ────────────────────────────── */}
      <div
        className="glass-panel rounded-2xl p-5 border border-sonar-cyan/20 flex flex-wrap items-center justify-between gap-4"
        style={{
          opacity: mounted ? 1 : 0,
          transform: mounted ? 'translateY(0)' : 'translateY(12px)',
          transition: 'opacity 0.5s ease 0.1s, transform 0.5s ease 0.1s',
        }}
      >
        <div className="flex items-center gap-4">
          <div
            className="w-12 h-12 rounded-xl bg-sonar-cyan/15 border border-sonar-cyan/30 flex items-center justify-center flex-shrink-0"
            style={{ animation: 'glowPulse 3s ease-in-out infinite' }}
          >
            <Award className="w-6 h-6 text-sonar-cyan" />
          </div>
          <div>
            <h3 className="font-semibold text-sm text-white">
              IHO S-44 Order 1a & MoES Marine Spatial Planning Compliance
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              All outputs maintain spatial accuracy within 0.5m with acoustic shadow elevation verification.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 text-xs font-mono text-emerald-400 bg-emerald-500/10 px-3 py-2 rounded-lg border border-emerald-500/20 hover:bg-emerald-500/15 transition-colors duration-300">
          <ShieldCheck className="w-4 h-4" />
          <span>VERIFIED FOR MARITIME DISPATCH</span>
        </div>
      </div>

      {/* ── GeoJSON Code View ───────────────────────────── */}
      <div
        className="glass-panel rounded-2xl overflow-hidden border border-ocean-800"
        style={{
          opacity: mounted ? 1 : 0,
          transform: mounted ? 'translateY(0)' : 'translateY(12px)',
          transition: 'opacity 0.5s ease 0.2s, transform 0.5s ease 0.2s',
        }}
      >
        {/* Terminal header */}
        <div className="flex items-center justify-between px-4 py-3 bg-ocean-900/90 border-b border-ocean-800">
          <div className="flex items-center gap-3">
            {/* Traffic lights decoration */}
            <div className="flex gap-1.5">
              <div className="w-2.5 h-2.5 rounded-full bg-rose-500/70" />
              <div className="w-2.5 h-2.5 rounded-full bg-amber-500/70" />
              <div className="w-2.5 h-2.5 rounded-full bg-emerald-500/70" />
            </div>
            <div className="flex items-center gap-2 text-xs font-mono text-slate-300">
              <Terminal className="w-3.5 h-3.5 text-sonar-cyan" />
              <span>aquascan_output.geojson</span>
              {/* Blinking cursor */}
              <span
                className="text-sonar-cyan"
                style={{ opacity: showCursor ? 1 : 0, transition: 'opacity 0.1s' }}
              >▋</span>
            </div>
          </div>

          <button
            onClick={handleCopy}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-ocean-950 text-xs font-mono transition-all duration-300 border hover:scale-105 active:scale-95"
            style={copied
              ? { color: '#34d399', borderColor: 'rgba(52,211,153,0.3)', background: 'rgba(52,211,153,0.1)' }
              : { color: '#94a3b8', borderColor: 'rgba(15,30,61,1)'     }
            }
          >
            <span
              style={{
                display: 'inline-block',
                transform: copied ? 'scale(1.2)' : 'scale(1)',
                transition: 'transform 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)',
              }}
            >
              {copied
                ? <Check className="w-3.5 h-3.5 text-emerald-400" />
                : <Copy className="w-3.5 h-3.5" />
              }
            </span>
            <span>{copied ? 'Copied!' : 'Copy JSON'}</span>
          </button>
        </div>

        {/* Syntax-highlighted JSON */}
        <div className="relative">
          {/* Line numbers gutter */}
          <div className="absolute left-0 top-0 bottom-0 w-10 bg-ocean-900/40 border-r border-ocean-800/50 flex flex-col items-end pr-2 pt-4 text-[10px] font-mono text-slate-600 select-none overflow-hidden pointer-events-none">
            {jsonString.split('\n').map((_, i) => (
              <div key={i} className="leading-5">{i + 1}</div>
            ))}
          </div>

          <pre
            className="pl-14 pr-4 py-4 bg-ocean-950/90 font-mono text-xs text-slate-300 overflow-x-auto max-h-[420px] leading-5"
            dangerouslySetInnerHTML={{ __html: highlightJson(jsonString) }}
          />
        </div>
      </div>

    </div>
  );
}
