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
  Sparkles
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
    <div className="max-w-7xl mx-auto px-4 lg:px-8 py-6 space-y-6">
      
      {/* Top Header */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-mono font-bold text-white flex items-center gap-2">
            <MapPin className="w-6 h-6 text-sonar-cyan animate-pulse" />
            Interactive Bathymetric Seafloor GIS Map
          </h1>
          <p className="text-xs text-slate-400 mt-0.5">
            Real-time AUV lawnmower transect tracking, georeferenced anomaly positions, and bathymetric depth layers.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <a
            href={getExportUrl('geojson')}
            download="aquascan_mission.geojson"
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-ocean-900 border border-ocean-700 hover:border-sonar-cyan/40 text-slate-200 text-xs font-mono font-semibold transition-all"
          >
            <Download className="w-3.5 h-3.5 text-sonar-cyan" />
            <span>Export Mission GeoJSON</span>
          </a>
        </div>
      </div>

      {/* Survey Coverage Stats Strip */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 font-mono">
        <div className="glass-panel p-3.5 rounded-xl border border-ocean-800">
          <div className="text-[10px] text-slate-400">SURVEY AREA</div>
          <div className="text-lg font-bold text-white mt-0.5">
            {missionData?.survey_area_sq_km || 1.45} km²
          </div>
          <div className="text-[10px] text-slate-500">Bay of Bengal Sector</div>
        </div>
        <div className="glass-panel p-3.5 rounded-xl border border-ocean-800">
          <div className="text-[10px] text-slate-400">TRANSECT DISTANCE</div>
          <div className="text-lg font-bold text-sonar-teal mt-0.5">
            {missionData?.trackline_km || 8.2} km
          </div>
          <div className="text-[10px] text-slate-500">5 Lawnmower Legs</div>
        </div>
        <div className="glass-panel p-3.5 rounded-xl border border-ocean-800">
          <div className="text-[10px] text-slate-400">LOCATED HAZARDS</div>
          <div className="text-lg font-bold text-rose-400 mt-0.5">
            {hazards.length} Targets
          </div>
          <div className="text-[10px] text-slate-500">Georeferenced WGS-84</div>
        </div>
        <div className="glass-panel p-3.5 rounded-xl border border-ocean-800">
          <div className="text-[10px] text-slate-400">SWATH RESOLUTION</div>
          <div className="text-lg font-bold text-sonar-cyan mt-0.5">
            0.15 m/px
          </div>
          <div className="text-[10px] text-slate-500">Side-Scan 450 kHz</div>
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
          <div className="glass-panel rounded-2xl p-4 border border-ocean-800 space-y-3">
            <div className="text-xs font-mono font-bold text-white uppercase tracking-wider flex items-center justify-between">
              <span className="flex items-center gap-1.5">
                <ShieldAlert className="w-3.5 h-3.5 text-sonar-cyan" />
                Detected Anomalies ({hazards.length})
              </span>
              <span className="text-[10px] text-slate-400">CLICK TO LOCATE</span>
            </div>

            <div className="space-y-2 max-h-[260px] overflow-y-auto pr-1">
              {hazards.map((h) => {
                const isSelected = selectedHazard?.id === h.id;
                return (
                  <div
                    key={h.id}
                    onClick={() => setSelectedHazard(h)}
                    className={`p-3 rounded-xl border cursor-pointer transition-all ${
                      isSelected
                        ? 'bg-sonar-cyan/15 border-sonar-cyan text-white shadow-sm'
                        : 'bg-ocean-950/60 border-ocean-800 text-slate-300 hover:border-slate-700'
                    }`}
                  >
                    <div className="flex items-center justify-between gap-2 mb-1">
                      <span className="font-mono text-xs font-bold flex items-center gap-2">
                        <span 
                          className="w-2 h-2 rounded-full" 
                          style={{ backgroundColor: h.color || '#EF4444' }} 
                        />
                        {h.display_name}
                      </span>
                      <span className="font-mono text-[10px] px-1.5 py-0.2 rounded bg-ocean-900 text-sonar-cyan border border-ocean-800">
                        {h.confidence_pct}%
                      </span>
                    </div>
                    <div className="text-[10px] font-mono text-slate-400 flex items-center justify-between">
                      <span>{h.latitude.toFixed(4)}°N, {h.longitude.toFixed(4)}°E</span>
                      <span className="text-slate-300">{h.priority}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Selected Hazard Quick Card */}
          {selectedHazard && (
            <div className="glass-panel-glow rounded-2xl p-4 border border-sonar-cyan/30 space-y-3 font-mono text-xs">
              <div className="flex items-center justify-between">
                <span className="text-sonar-cyan font-bold uppercase tracking-wider">
                  Target Telemetry Breakdown
                </span>
                <span className="text-[10px] text-slate-400">{selectedHazard.id}</span>
              </div>

              <div className="grid grid-cols-2 gap-2 text-[11px]">
                <div className="p-2 rounded bg-ocean-950 border border-ocean-800">
                  <div className="text-slate-400 text-[9px]">EST. LENGTH</div>
                  <div className="text-white font-bold">{selectedHazard.estimated_length_m}m</div>
                </div>
                <div className="p-2 rounded bg-ocean-950 border border-ocean-800">
                  <div className="text-slate-400 text-[9px]">SHADOW HEIGHT</div>
                  <div className="text-sonar-cyan font-bold">{selectedHazard.height_off_seabed_m}m</div>
                </div>
              </div>

              <div className="p-2.5 rounded bg-ocean-950 border border-ocean-800 space-y-1 text-[10px] text-slate-300">
                <div className="flex justify-between">
                  <span>LATITUDE:</span>
                  <span className="text-white">{selectedHazard.latitude.toFixed(6)}° N</span>
                </div>
                <div className="flex justify-between">
                  <span>LONGITUDE:</span>
                  <span className="text-white">{selectedHazard.longitude.toFixed(6)}° E</span>
                </div>
                <div className="flex justify-between">
                  <span>CLEARANCE ACTION:</span>
                  <span className="text-rose-400 font-bold">{selectedHazard.priority}</span>
                </div>
              </div>
            </div>
          )}

        </div>

      </div>

    </div>
  );
}
