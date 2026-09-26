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
  Terminal,
  Radio
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
          "vessel_dispatch": "MoES Coastal Research Vessel (CRV Sagar)"
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

  // Syntax-highlight helper
  const highlightJson = (str) => {
    return str
      .replace(/"([^"]+)":/g, '<span class="text-crimson">"$1"</span>:')
      .replace(/: "([^"]+)"/g, ': <span class="text-emerald-400">"$1"</span>')
      .replace(/: (\d+\.?\d*)/g, ': <span class="text-amber-400">$1</span>')
      .replace(/: (true|false|null)/g, ': <span class="text-rose-400">$1</span>');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 font-poppins">

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
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-crimson/10 border border-crimson/30 text-crimson text-xs font-bold tracking-widest uppercase mb-2">
            <span>OFFICIAL CLEARANCE AUDIT</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-calsans font-black text-white uppercase flex items-center gap-3">
            <Radio className="w-8 h-8 text-crimson" />
            Hydrographic Clearance Reports & GIS Exports
          </h1>
          <p className="text-sm text-zinc-400 mt-1 max-w-2xl">
            Structured statutory mission exports for the Ministry of Earth Sciences (MoES) and National Institute of Ocean Technology (NIOT).
          </p>
        </div>

        {/* Download Buttons */}
        <div className="flex items-center gap-3 flex-wrap">
          <a
            href={getExportUrl('csv')}
            download="aquascan_debris_clearance.csv"
            className="btn-luxury-dark group flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-calsans font-bold tracking-wider uppercase transition-all hover:scale-105 active:scale-95"
          >
            <Download className="w-4 h-4 text-crimson group-hover:translate-y-0.5 transition-transform" />
            <span>DOWNLOAD CSV LOG</span>
          </a>

          <a
            href={getExportUrl('geojson')}
            download="aquascan_debris_clearance.geojson"
            className="btn-crimson group flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-calsans font-bold tracking-wider uppercase shadow-lg shadow-crimson/25 hover:shadow-crimson/40 hover:scale-105 active:scale-95 transition-all"
          >
            <Download className="w-4 h-4 group-hover:translate-y-0.5 transition-transform" />
            <span>DOWNLOAD RFC 7946 GEOJSON</span>
          </a>
        </div>
      </div>

      {/* ── Compliance Strip ────────────────────────────── */}
      <div
        className="rounded-[2.5rem] p-6 bg-[#1a1a1a] border border-white/10 flex flex-wrap items-center justify-between gap-4 shadow-xl"
        style={{
          opacity: mounted ? 1 : 0,
          transform: mounted ? 'translateY(0)' : 'translateY(12px)',
          transition: 'opacity 0.5s ease 0.1s, transform 0.5s ease 0.1s',
        }}
      >
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-crimson/15 border border-crimson/30 flex items-center justify-center flex-shrink-0">
            <Award className="w-6 h-6 text-crimson" />
          </div>
          <div>
            <h3 className="font-calsans font-bold text-base text-white uppercase">
              IHO S-44 Order 1a & MoES Marine Spatial Planning Compliance
            </h3>
            <p className="text-xs text-zinc-400 mt-0.5 font-poppins">
              All telemetry outputs maintain spatial accuracy within 0.5m with acoustic shadow elevation verification.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 text-xs font-poppins font-bold text-emerald-400 bg-emerald-500/10 px-4 py-2 rounded-xl border border-emerald-500/20">
          <ShieldCheck className="w-4 h-4" />
          <span>VERIFIED FOR MARITIME DISPATCH</span>
        </div>
      </div>

      {/* ── GeoJSON Code View ───────────────────────────── */}
      <div
        className="rounded-[2.5rem] overflow-hidden bg-[#1a1a1a] border border-white/10 shadow-2xl"
        style={{
          opacity: mounted ? 1 : 0,
          transform: mounted ? 'translateY(0)' : 'translateY(12px)',
          transition: 'opacity 0.5s ease 0.2s, transform 0.5s ease 0.2s',
        }}
      >
        {/* Terminal header */}
        <div className="flex items-center justify-between px-6 py-4 bg-[#161616] border-b border-white/10">
          <div className="flex items-center gap-3">
            {/* Traffic lights decoration */}
            <div className="flex gap-2">
              <div className="w-3 h-3 rounded-full bg-crimson" />
              <div className="w-3 h-3 rounded-full bg-amber-500/80" />
              <div className="w-3 h-3 rounded-full bg-emerald-500/80" />
            </div>
            <div className="flex items-center gap-2 text-xs font-poppins font-semibold text-zinc-300 ml-2">
              <Terminal className="w-4 h-4 text-crimson" />
              <span>aquascan_clearance_output.geojson</span>
              <span
                className="text-crimson"
                style={{ opacity: showCursor ? 1 : 0, transition: 'opacity 0.1s' }}
              >▋</span>
            </div>
          </div>

          <button
            onClick={handleCopy}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#121212] text-xs font-poppins font-medium transition-all duration-300 border border-white/10 hover:border-crimson/50 hover:scale-105 active:scale-95"
            style={copied
              ? { color: '#34d399', borderColor: 'rgba(52,211,153,0.3)', background: 'rgba(52,211,153,0.1)' }
              : { color: '#ffffff' }
            }
          >
            {copied
              ? <Check className="w-3.5 h-3.5 text-emerald-400" />
              : <Copy className="w-3.5 h-3.5" />
            }
            <span>{copied ? 'Copied to Clipboard!' : 'Copy GeoJSON'}</span>
          </button>
        </div>

        {/* Syntax-highlighted JSON */}
        <div className="relative">
          {/* Line numbers gutter */}
          <div className="absolute left-0 top-0 bottom-0 w-12 bg-[#121212] border-r border-white/10 flex flex-col items-end pr-3 pt-5 text-[10px] font-mono text-zinc-600 select-none overflow-hidden pointer-events-none">
            {jsonString.split('\n').map((_, i) => (
              <div key={i} className="leading-6">{i + 1}</div>
            ))}
          </div>

          <pre
            className="pl-16 pr-6 py-5 bg-[#0f0f0f] font-mono text-xs text-zinc-300 overflow-x-auto max-h-[460px] leading-6"
            dangerouslySetInnerHTML={{ __html: highlightJson(jsonString) }}
          />
        </div>
      </div>

    </div>
  );
}
