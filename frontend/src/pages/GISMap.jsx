import React, { useState, useEffect } from 'react';
import { 
  MapPin, 
  Navigation, 
  Download, 
  Layers, 
  Compass, 
  ExternalLink,
  ShieldAlert,
  Ship,
  Sparkles,
  Radio
} from 'lucide-react';
import { fetchSimulatedMission, getExportUrl } from '../services/api';
import SeafloorMap from '../components/SeafloorMap';
import DebrisCard from '../components/DebrisCard';

export default function GISMap() {
  const [missionData, setMissionData] = useState(null);
  const [selectedHazard, setSelectedHazard] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchSimulatedMission()
      .then((data) => {
        setMissionData(data);
        if (data.detected_hazards && data.detected_hazards.length > 0) {
          setSelectedHazard(data.detected_hazards[0]);
        }
      })
      .finally(() => setLoading(false));
  }, []);

  const waypoints = missionData?.waypoints || [];
  const hazards = missionData?.detected_hazards || [];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 font-poppins">
      
      {/* Top Header */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-crimson/10 border border-crimson/30 text-crimson text-xs font-bold tracking-widest uppercase mb-2">
            <span>GEODETIC SUBSEA GIS</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-calsans font-black text-white uppercase flex items-center gap-3">
            <Radio className="w-8 h-8 text-crimson" />
            Interactive Bathymetric Seafloor GIS Map
          </h1>
          <p className="text-sm text-zinc-400 mt-1 max-w-2xl">
            Autonomous AUV lawnmower transects, geocoded acoustic anomalies, and IHO S-44 bathymetric depth layers.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <a
            href={getExportUrl('geojson')}
            download="aquascan_mission.geojson"
            className="btn-crimson flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-calsans font-bold tracking-wider uppercase shadow-lg shadow-crimson/25 hover:shadow-crimson/40 hover:scale-105 active:scale-95 transition-all"
          >
            <Download className="w-4 h-4" />
            <span>EXPORT MISSION GEOJSON</span>
          </a>
        </div>
      </div>

      {/* Survey Coverage Stats Strip */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="p-4 rounded-2xl bg-[#1a1a1a] border border-white/10 shadow-lg">
          <div className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">SURVEY AREA</div>
          <div className="text-2xl font-calsans font-black text-white mt-1">
            {missionData?.survey_area_sq_km || 1.45} KM²
          </div>
          <div className="text-[11px] text-zinc-500 font-medium">Bay of Bengal Sector</div>
        </div>
        <div className="p-4 rounded-2xl bg-[#1a1a1a] border border-white/10 shadow-lg">
          <div className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">TRANSECT DISTANCE</div>
          <div className="text-2xl font-calsans font-black text-crimson mt-1">
            {missionData?.trackline_km || 8.2} KM
          </div>
          <div className="text-[11px] text-zinc-500 font-medium">5 Lawnmower Legs</div>
        </div>
        <div className="p-4 rounded-2xl bg-[#1a1a1a] border border-white/10 shadow-lg">
          <div className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">LOCATED HAZARDS</div>
          <div className="text-2xl font-calsans font-black text-white mt-1">
            {hazards.length} TARGETS
          </div>
          <div className="text-[11px] text-zinc-500 font-medium">Georeferenced WGS-84</div>
        </div>
        <div className="p-4 rounded-2xl bg-[#1a1a1a] border border-white/10 shadow-lg">
          <div className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">SWATH RESOLUTION</div>
          <div className="text-2xl font-calsans font-black text-emerald-400 mt-1">
            0.15 M/PX
          </div>
          <div className="text-[11px] text-zinc-500 font-medium">Side-Scan 450 kHz</div>
        </div>
      </div>

      {/* Main Map + Sidebar Workspace */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        
        {/* Seafloor GIS Map Canvas (2 cols) */}
        <div className="lg:col-span-2 min-h-[520px]">
          <SeafloorMap
            waypoints={waypoints}
            hazards={hazards}
            selectedHazard={selectedHazard}
            onSelectHazard={setSelectedHazard}
          />
        </div>

        {/* Hazard List & Selected Detail Sidebar */}
        <div className="space-y-4">
          
          {/* Target List Strip */}
          <div className="rounded-[2rem] p-5 bg-[#1a1a1a] border border-white/10 space-y-3 shadow-xl">
            <div className="text-xs font-calsans font-bold text-white uppercase tracking-wider flex items-center justify-between">
              <span className="flex items-center gap-1.5">
                <ShieldAlert className="w-4 h-4 text-crimson" />
                Detected Anomalies ({hazards.length})
              </span>
              <span className="text-[10px] text-zinc-400 font-poppins">CLICK TO LOCATE</span>
            </div>

            <div className="space-y-2 max-h-[260px] overflow-y-auto no-scrollbar pr-1">
              {hazards.map((h) => {
                const isSelected = selectedHazard?.id === h.id;
                return (
                  <div
                    key={h.id}
                    onClick={() => setSelectedHazard(h)}
                    className={`p-3 rounded-xl border cursor-pointer transition-all ${
                      isSelected
                        ? 'bg-crimson/15 border-crimson text-white shadow-md'
                        : 'bg-[#121212] border-white/10 text-zinc-300 hover:border-crimson/50'
                    }`}
                  >
                    <div className="flex items-center justify-between gap-2 mb-1">
                      <span className="font-calsans text-sm font-bold flex items-center gap-2">
                        <span 
                          className="w-2.5 h-2.5 rounded-full" 
                          style={{ backgroundColor: h.color || '#e11d48' }} 
                        />
                        {h.display_name}
                      </span>
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-crimson/20 text-crimson border border-crimson/30">
                        {h.confidence_pct}%
                      </span>
                    </div>
                    <div className="text-xs text-zinc-400 flex items-center justify-between font-poppins">
                      <span>{h.latitude.toFixed(4)}°N, {h.longitude.toFixed(4)}°E</span>
                      <span className="text-zinc-200 font-semibold">{h.priority}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Selected Hazard Quick Card */}
          {selectedHazard && (
            <div className="rounded-[2rem] p-5 bg-[#1a1a1a] border-2 border-crimson/40 space-y-3 font-poppins text-xs shadow-xl">
              <div className="flex items-center justify-between">
                <span className="text-crimson font-calsans font-bold uppercase tracking-wider text-sm">
                  Target Telemetry Breakdown
                </span>
                <span className="text-[10px] text-zinc-400 font-semibold">{selectedHazard.id}</span>
              </div>

              <div className="grid grid-cols-2 gap-2 text-xs">
                <div className="p-2.5 rounded-xl bg-[#121212] border border-white/10">
                  <div className="text-zinc-400 text-[10px] font-bold uppercase">EST. LENGTH</div>
                  <div className="text-white font-calsans font-bold text-base mt-0.5">{selectedHazard.estimated_length_m}m</div>
                </div>
                <div className="p-2.5 rounded-xl bg-[#121212] border border-white/10">
                  <div className="text-zinc-400 text-[10px] font-bold uppercase">SHADOW HEIGHT</div>
                  <div className="text-crimson font-calsans font-bold text-base mt-0.5">{selectedHazard.height_off_seabed_m}m</div>
                </div>
              </div>

              <div className="p-3 rounded-xl bg-[#121212] border border-white/10 space-y-1.5 text-xs text-zinc-300">
                <div className="flex justify-between">
                  <span className="text-zinc-400">LATITUDE:</span>
                  <span className="text-white font-semibold">{selectedHazard.latitude.toFixed(6)}° N</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-zinc-400">LONGITUDE:</span>
                  <span className="text-white font-semibold">{selectedHazard.longitude.toFixed(6)}° E</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-zinc-400">CLEARANCE ACTION:</span>
                  <span className="text-crimson font-bold">{selectedHazard.priority}</span>
                </div>
              </div>
            </div>
          )}

        </div>

      </div>

    </div>
  );
}
