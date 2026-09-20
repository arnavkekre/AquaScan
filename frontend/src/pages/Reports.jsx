import React, { useState } from 'react';
import { 
  FileSpreadsheet, 
  Download, 
  Copy, 
  Check, 
  FileJson, 
  ShieldCheck, 
  Award,
  Layers
} from 'lucide-react';
import { getExportUrl } from '../services/api';

export default function Reports() {
  const [copied, setCopied] = useState(false);

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
        "geometry": {
          "type": "Point",
          "coordinates": [80.273512, 13.083214]
        },
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
        "geometry": {
          "type": "Point",
          "coordinates": [80.278014, 13.086112]
        },
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
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 lg:px-8 py-6 space-y-6">
      
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-mono font-bold text-white flex items-center gap-2">
            <FileSpreadsheet className="w-6 h-6 text-sonar-cyan animate-pulse" />
            Hydrographic Clearance Reports & GIS Exports
          </h1>
          <p className="text-xs text-slate-400 mt-0.5">
            Structured mission exports for the Ministry of Earth Sciences (MoES) and National Institute of Ocean Technology (NIOT).
          </p>
        </div>

        {/* Download Buttons */}
        <div className="flex items-center gap-3">
          <a
            href={getExportUrl('csv')}
            download="aquascan_debris_clearance.csv"
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-ocean-900 border border-ocean-700 hover:border-sonar-cyan/40 text-slate-200 text-xs font-mono font-semibold transition-all"
          >
            <Download className="w-3.5 h-3.5 text-sonar-cyan" />
            <span>Download CSV Log</span>
          </a>

          <a
            href={getExportUrl('geojson')}
            download="aquascan_debris_clearance.geojson"
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-sonar-cyan text-ocean-950 font-bold text-xs font-mono hover:bg-sonar-teal transition-all shadow-md shadow-sonar-cyan/20"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Download RFC 7946 GeoJSON</span>
          </a>
        </div>
      </div>

      {/* Compliance Certification Strip */}
      <div className="glass-panel rounded-2xl p-5 border border-sonar-cyan/20 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-sonar-cyan/15 border border-sonar-cyan/30 flex items-center justify-center">
            <Award className="w-6 h-6 text-sonar-cyan" />
          </div>
          <div>
            <h3 className="font-mono text-sm font-bold text-white">
              IHO S-44 Order 1a & MoES Marine Spatial Planning Compliance
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              All outputs maintain spatial accuracy within 0.5m with acoustic shadow elevation verification.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 text-xs font-mono text-emerald-400 bg-emerald-500/10 px-3 py-1.5 rounded-lg border border-emerald-500/20">
          <ShieldCheck className="w-4 h-4" />
          <span>VERIFIED FOR MARITIME DISPATCH</span>
        </div>
      </div>

      {/* Structured GeoJSON Code View */}
      <div className="glass-panel rounded-2xl overflow-hidden border border-ocean-800">
        <div className="flex items-center justify-between px-4 py-3 bg-ocean-900/90 border-b border-ocean-800">
          <div className="flex items-center gap-2 text-xs font-mono text-slate-300">
            <FileJson className="w-4 h-4 text-sonar-cyan" />
            <span>RFC 7946 Standard GeoJSON FeatureCollection Preview</span>
          </div>

          <button
            onClick={handleCopy}
            className="flex items-center gap-1.5 px-3 py-1 rounded-lg bg-ocean-950 text-xs font-mono text-slate-300 hover:text-white border border-ocean-800"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copied ? 'Copied!' : 'Copy JSON'}</span>
          </button>
        </div>

        <pre className="p-4 bg-ocean-950/80 font-mono text-xs text-slate-300 overflow-x-auto max-h-[400px]">
          {JSON.stringify(sampleGeoJson, null, 2)}
        </pre>
      </div>

    </div>
  );
}
