import React from 'react';
import { 
  AlertTriangle, 
  MapPin, 
  Ruler, 
  ArrowUpRight, 
  Ship, 
  ShieldCheck, 
  CheckCircle,
  ExternalLink
} from 'lucide-react';


export default function DebrisCard({ detection, onClose }) {
  if (!detection) return null;

  const {
    id,
    display_name,
    class_name,
    confidence_pct,
    hazard_level,
    color,
    spatial_localization,
    action_protocol,
    shadow_metrics
  } = detection;

  const loc = spatial_localization || {};
  const action = action_protocol || {};

  return (
    <div className="glass-panel-glow rounded-2xl p-5 border border-sonar-cyan/40 relative">
      
      {/* Top Header & Priority */}
      <div className="flex items-start justify-between gap-3 mb-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span 
              className="w-2.5 h-2.5 rounded-full" 
              style={{ backgroundColor: color || '#EF4444' }} 
            />
            <span className="text-[10px] font-mono uppercase tracking-wider px-2 py-0.5 rounded bg-ocean-900 border border-ocean-800 text-slate-300">
              {hazard_level}
            </span>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-sonar-cyan/15 text-sonar-cyan border border-sonar-cyan/30">
              {confidence_pct}% CONFIDENCE
            </span>
          </div>
          <h3 className="font-mono text-base font-bold text-white tracking-wide">
            {display_name}
          </h3>
        </div>

        {onClose && (
          <button 
            onClick={onClose}
            className="text-slate-400 hover:text-white text-xs font-mono px-2 py-1 rounded hover:bg-ocean-800"
          >
            ✕
          </button>
        )}
      </div>

      {/* Physical Dimensions & Acoustic Shadow Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mb-4">
        <div className="p-2.5 rounded-xl bg-ocean-950/60 border border-ocean-800">
          <div className="text-[10px] font-mono text-slate-400">EST. LENGTH</div>
          <div className="text-sm font-mono font-bold text-white mt-0.5">
            {loc.estimated_length_m || 0}m
          </div>
        </div>
        <div className="p-2.5 rounded-xl bg-ocean-950/60 border border-ocean-800">
          <div className="text-[10px] font-mono text-slate-400">EST. WIDTH</div>
          <div className="text-sm font-mono font-bold text-white mt-0.5">
            {loc.estimated_width_m || 0}m
          </div>
        </div>
        <div className="p-2.5 rounded-xl bg-ocean-950/60 border border-ocean-800">
          <div className="text-[10px] font-mono text-slate-400">SHADOW HEIGHT (h)</div>
          <div className="text-sm font-mono font-bold text-sonar-cyan mt-0.5">
            {loc.estimated_height_off_seabed_m || 0}m
          </div>
        </div>
        <div className="p-2.5 rounded-xl bg-ocean-950/60 border border-ocean-800">
          <div className="text-[10px] font-mono text-slate-400">ACROSS-TRACK</div>
          <div className="text-sm font-mono font-bold text-emerald-400 mt-0.5">
            {loc.across_track_distance_m || 0}m
          </div>
        </div>
      </div>

      {/* Geolocation Details */}
      <div className="p-3 rounded-xl bg-ocean-950/80 border border-ocean-800 mb-4 font-mono text-xs space-y-1">
        <div className="flex items-center justify-between text-slate-300">
          <span className="flex items-center gap-1.5 text-slate-400">
            <MapPin className="w-3.5 h-3.5 text-sonar-cyan" />
            TARGET LAT / LON:
          </span>
          <span className="font-bold text-white">
            {loc.target_latitude?.toFixed(6)}°N, {loc.target_longitude?.toFixed(6)}°E
          </span>
        </div>
        <div className="flex items-center justify-between text-slate-400 text-[11px]">
          <span>SLANT RANGE / GROUND RANGE:</span>
          <span>{loc.slant_range_m}m / {loc.ground_range_m}m</span>
        </div>
      </div>

      {/* MoES / NIOT Action Recommendation */}
      <div className="p-3.5 rounded-xl bg-gradient-to-br from-ocean-900 to-ocean-950 border border-sonar-cyan/20 space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-[11px] font-mono font-bold text-sonar-cyan uppercase tracking-wider flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4" />
            CLEARANCE PROTOCOL: {action.priority || 'P2'}
          </span>
          <span className="text-[10px] font-mono text-slate-400">NIOT SPEC</span>
        </div>
        <p className="text-xs text-slate-200 leading-relaxed font-sans">
          {action.recommended_action || 'Record acoustic signature and log coordinates.'}
        </p>
        <div className="flex items-center gap-2 pt-1 border-t border-ocean-800/80 text-[11px] font-mono text-slate-400">
          <Ship className="w-3.5 h-3.5 text-sonar-teal" />
          <span>VESSEL DISPATCH:</span>
          <span className="text-white font-medium">{action.vessel_dispatch || 'Research Vessel'}</span>
        </div>
      </div>

    </div>
  );
}
