import React from 'react';
import { 
  AlertTriangle, 
  MapPin, 
  Ruler, 
  ArrowUpRight, 
  Ship, 
  ShieldCheck, 
  CheckCircle,
  ExternalLink,
  X
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
    <div className="rounded-[2rem] p-6 bg-[#1a1a1a] border-2 border-crimson/40 relative shadow-2xl font-poppins">
      
      {/* Top Header & Priority */}
      <div className="flex items-start justify-between gap-3 mb-4">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <span 
              className="w-2.5 h-2.5 rounded-full" 
              style={{ backgroundColor: color || '#e11d48' }} 
            />
            <span className="text-[10px] font-calsans uppercase tracking-widest px-2.5 py-0.5 rounded-full bg-[#121212] border border-white/10 text-white font-bold">
              {hazard_level}
            </span>
            <span className="text-[10px] font-poppins font-bold px-2.5 py-0.5 rounded-full bg-crimson/15 text-crimson border border-crimson/30">
              {confidence_pct}% CONFIDENCE
            </span>
          </div>
          <h3 className="font-calsans text-xl font-black text-white tracking-wide uppercase">
            {display_name}
          </h3>
        </div>

        {onClose && (
          <button 
            onClick={onClose}
            className="text-zinc-400 hover:text-white p-1 rounded-lg hover:bg-white/10 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Physical Dimensions & Acoustic Shadow Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mb-4">
        <div className="p-3 rounded-xl bg-[#121212] border border-white/10">
          <div className="text-[10px] font-bold text-zinc-400 uppercase">EST. LENGTH</div>
          <div className="text-base font-calsans font-bold text-white mt-0.5">
            {loc.estimated_length_m || 0}m
          </div>
        </div>
        <div className="p-3 rounded-xl bg-[#121212] border border-white/10">
          <div className="text-[10px] font-bold text-zinc-400 uppercase">EST. WIDTH</div>
          <div className="text-base font-calsans font-bold text-white mt-0.5">
            {loc.estimated_width_m || 0}m
          </div>
        </div>
        <div className="p-3 rounded-xl bg-[#121212] border border-white/10">
          <div className="text-[10px] font-bold text-zinc-400 uppercase">SHADOW HEIGHT (h)</div>
          <div className="text-base font-calsans font-bold text-crimson mt-0.5">
            {loc.estimated_height_off_seabed_m || 0}m
          </div>
        </div>
        <div className="p-3 rounded-xl bg-[#121212] border border-white/10">
          <div className="text-[10px] font-bold text-zinc-400 uppercase">ACROSS-TRACK</div>
          <div className="text-base font-calsans font-bold text-emerald-400 mt-0.5">
            {loc.across_track_distance_m || 0}m
          </div>
        </div>
      </div>

      {/* Geolocation Details */}
      <div className="p-3.5 rounded-xl bg-[#121212] border border-white/10 mb-4 text-xs font-poppins space-y-1.5">
        <div className="flex items-center justify-between text-zinc-300">
          <span className="flex items-center gap-1.5 text-zinc-400 font-semibold">
            <MapPin className="w-3.5 h-3.5 text-crimson" />
            TARGET LAT / LON:
          </span>
          <span className="font-calsans font-bold text-white tracking-wide">
            {loc.target_latitude?.toFixed(6)}°N, {loc.target_longitude?.toFixed(6)}°E
          </span>
        </div>
        <div className="flex items-center justify-between text-zinc-400 text-[11px]">
          <span>SLANT RANGE / GROUND RANGE:</span>
          <span className="font-medium text-zinc-300">{loc.slant_range_m}m / {loc.ground_range_m}m</span>
        </div>
      </div>

      {/* MoES / NIOT Action Recommendation */}
      <div className="p-4 rounded-xl bg-gradient-to-br from-[#1e1417] to-[#121212] border border-crimson/30 space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-xs font-calsans font-bold text-crimson uppercase tracking-wider flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4" />
            CLEARANCE PROTOCOL: {action.priority || 'P2'}
          </span>
          <span className="text-[10px] font-poppins font-semibold text-zinc-400 uppercase tracking-widest">
            NIOT SPEC
          </span>
        </div>
        <p className="text-xs text-zinc-200 leading-relaxed font-poppins">
          {action.recommended_action || 'Record acoustic signature and log coordinates.'}
        </p>
        <div className="flex items-center gap-2 pt-2 border-t border-white/10 text-xs font-poppins text-zinc-400">
          <Ship className="w-3.5 h-3.5 text-crimson" />
          <span>VESSEL DISPATCH:</span>
          <span className="text-white font-semibold">{action.vessel_dispatch || 'Research Vessel'}</span>
        </div>
      </div>

    </div>
  );
}
