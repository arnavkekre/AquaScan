import React, { useState } from 'react';
import { 
  MapPin, 
  Navigation, 
  Layers, 
  Filter, 
  ShieldAlert, 
  Compass, 
  ZoomIn, 
  ZoomOut, 
  RotateCcw,
  Anchor
} from 'lucide-react';

export default function SeafloorMap({ 
  waypoints = [], 
  hazards = [], 
  selectedHazard, 
  onSelectHazard 
}) {
  const [filterClass, setFilterClass] = useState('all');
  const [zoom, setZoom] = useState(1);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });

  // Map bounding coordinates (Chennai / NIOT survey grid)
  const minLat = 13.0800, maxLat = 13.0960;
  const minLon = 80.2680, maxLon = 80.2850;

  // Convert WGS84 Lat/Lon to SVG coordinate space (800x550)
  const latToY = (lat) => {
    return 500 - ((lat - minLat) / (maxLat - minLat)) * 440;
  };
  const lonToX = (lon) => {
    return 60 + ((lon - minLon) / (maxLon - minLon)) * 680;
  };

  const filteredHazards = filterClass === 'all' 
    ? hazards 
    : hazards.filter(h => h.class_name === filterClass);

  // Build AUV survey path string
  const pathData = waypoints.map((pt, i) => {
    const x = lonToX(pt.lon);
    const y = latToY(pt.lat);
    return `${i === 0 ? 'M' : 'L'} ${x} ${y}`;
  }).join(' ');

  const handleMouseDown = (e) => {
    setIsDragging(true);
    setDragStart({ x: e.clientX - pan.x, y: e.clientY - pan.y });
  };

  const handleMouseMove = (e) => {
    if (!isDragging) return;
    setPan({ x: e.clientX - dragStart.x, y: e.clientY - dragStart.y });
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  return (
    <div className="glass-panel rounded-2xl overflow-hidden border border-ocean-800 flex flex-col h-full">
      
      {/* Map Controls Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 px-4 py-3 bg-ocean-900/90 border-b border-ocean-800">
        
        <div className="flex items-center gap-2">
          <Navigation className="w-4 h-4 text-sonar-cyan animate-pulse" />
          <span className="font-mono text-xs font-semibold text-white tracking-wider">
            SEAFLOOR GIS BATHYMETRIC CLEARANCE
          </span>
          <span className="px-2 py-0.5 rounded bg-ocean-800 text-[10px] font-mono text-slate-400">
            BAY OF BENGAL / NIOT TRANSECT
          </span>
        </div>

        {/* Hazard Class Filters */}
        <div className="flex items-center gap-1.5 overflow-x-auto">
          <Filter className="w-3.5 h-3.5 text-slate-400 mr-1" />
          {['all', 'ghost_net', 'submarine_pipeline', 'shipwreck', 'mine_cylinder'].map((cls) => {
            const labels = {
              all: 'All Hazards',
              ghost_net: 'Ghost Nets',
              submarine_pipeline: 'Pipelines',
              shipwreck: 'Shipwrecks',
              mine_cylinder: 'Mines / UXO'
            };
            const active = filterClass === cls;
            return (
              <button
                key={cls}
                onClick={() => setFilterClass(cls)}
                className={`px-2.5 py-1 rounded text-[11px] font-mono transition-all ${
                  active 
                    ? 'bg-sonar-cyan/20 border border-sonar-cyan/40 text-sonar-cyan font-bold' 
                    : 'bg-ocean-950/60 border border-ocean-800 text-slate-400 hover:text-white'
                }`}
              >
                {labels[cls]}
              </button>
            );
          })}
        </div>

      </div>

      {/* Map Canvas Area */}
      <div 
        className="relative flex-1 min-h-[460px] bg-ocean-950 overflow-hidden cursor-grab active:cursor-grabbing select-none"
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
      >
        
        {/* Sonar Scanlines effect */}
        <div className="absolute inset-0 sonar-scanlines pointer-events-none"></div>

        {/* SVG GIS Layer */}
        <svg 
          viewBox="0 0 800 550" 
          className="w-full h-full"
          style={{
            transform: `scale(${zoom}) translate(${pan.x / zoom}px, ${pan.y / zoom}px)`,
            transformOrigin: 'center center',
            transition: isDragging ? 'none' : 'transform 0.2s ease-out'
          }}
        >
          <defs>
            {/* Grid Pattern */}
            <pattern id="bathymetryGrid" width="40" height="40" patternUnits="userSpaceOnUse">
              <path d="M 40 0 L 0 0 0 40" fill="none" stroke="rgba(0, 240, 255, 0.05)" strokeWidth="1"/>
            </pattern>
            {/* Glow Filter for Hazards */}
            <filter id="hazardGlow" x="-50%" y="-50%" width="200%" height="200%">
              <feGaussianBlur in="SourceGraphic" stdDeviation="3" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>

          {/* Background Grid */}
          <rect width="800" height="550" fill="url(#bathymetryGrid)" />

          {/* Depth Contours (Simulated Bathymetry Lines) */}
          <path d="M 0 100 Q 200 130 400 90 T 800 110" fill="none" stroke="rgba(16, 185, 129, 0.15)" strokeWidth="1.5" strokeDasharray="6,4" />
          <text x="740" y="105" fill="rgba(16, 185, 129, 0.4)" fontSize="9" fontFamily="monospace">-30m</text>

          <path d="M 0 220 Q 250 250 500 200 T 800 230" fill="none" stroke="rgba(16, 185, 129, 0.18)" strokeWidth="1.5" strokeDasharray="6,4" />
          <text x="740" y="225" fill="rgba(16, 185, 129, 0.4)" fontSize="9" fontFamily="monospace">-40m</text>

          <path d="M 0 350 Q 300 390 550 330 T 800 360" fill="none" stroke="rgba(16, 185, 129, 0.2)" strokeWidth="1.5" strokeDasharray="6,4" />
          <text x="740" y="355" fill="rgba(16, 185, 129, 0.4)" fontSize="9" fontFamily="monospace">-50m</text>

          <path d="M 0 460 Q 280 500 520 440 T 800 470" fill="none" stroke="rgba(16, 185, 129, 0.25)" strokeWidth="1.5" strokeDasharray="6,4" />
          <text x="740" y="465" fill="rgba(16, 185, 129, 0.4)" fontSize="9" fontFamily="monospace">-60m</text>

          {/* AUV Lawnmower Trackline Path */}
          {waypoints.length > 1 && (
            <>
              {/* Swath acoustic corridor */}
              <path 
                d={pathData} 
                fill="none" 
                stroke="rgba(0, 240, 255, 0.08)" 
                strokeWidth="45" 
                strokeLinecap="round" 
                strokeLinejoin="round" 
              />
              {/* Center trackline */}
              <path 
                d={pathData} 
                fill="none" 
                stroke="#00F0FF" 
                strokeWidth="2" 
                strokeDasharray="4,4" 
                className="opacity-75"
              />
            </>
          )}

          {/* AUV Current Vehicle Icon */}
          {waypoints.length > 0 && (
            <g transform={`translate(${lonToX(waypoints[waypoints.length - 1].lon)}, ${latToY(waypoints[waypoints.length - 1].lat)})`}>
              <circle r="12" fill="rgba(0, 240, 255, 0.2)" className="animate-ping" />
              <circle r="6" fill="#00F0FF" />
              <polygon points="0,-10 6,6 0,3 -6,6" fill="#FFFFFF" />
            </g>
          )}

          {/* Detected Hazard Markers */}
          {filteredHazards.map((h) => {
            const x = lonToX(h.longitude);
            const y = latToY(h.latitude);
            const isSelected = selectedHazard?.id === h.id;
            const color = h.color || '#EF4444';

            return (
              <g 
                key={h.id} 
                transform={`translate(${x}, ${y})`}
                onClick={(e) => {
                  e.stopPropagation();
                  onSelectHazard && onSelectHazard(h);
                }}
                className="cursor-pointer group"
              >
                {/* Outer ping animation */}
                <circle 
                  r={isSelected ? "18" : "12"} 
                  fill={color} 
                  opacity="0.25" 
                  className="animate-ping" 
                />
                
                {/* Main pin marker */}
                <circle 
                  r={isSelected ? "9" : "7"} 
                  fill={color} 
                  stroke="#FFFFFF" 
                  strokeWidth={isSelected ? "2.5" : "1.5"}
                  filter="url(#hazardGlow)"
                />

                {/* Target label tooltip */}
                <g transform="translate(12, -10)" className="opacity-90 group-hover:opacity-100">
                  <rect 
                    x="-2" 
                    y="-12" 
                    width="140" 
                    height="20" 
                    rx="4" 
                    fill="rgba(7, 14, 30, 0.9)" 
                    stroke={color} 
                    strokeWidth="1" 
                  />
                  <text 
                    x="4" 
                    y="2" 
                    fill="#FFFFFF" 
                    fontSize="9" 
                    fontFamily="monospace" 
                    fontWeight="bold"
                  >
                    {h.display_name?.slice(0, 18)} ({h.confidence_pct}%)
                  </text>
                </g>
              </g>
            );
          })}

        </svg>

        {/* Map Legend Overlay */}
        <div className="absolute top-4 left-4 bg-ocean-950/85 backdrop-blur border border-ocean-800 rounded-xl p-3 text-xs font-mono max-w-[200px]">
          <div className="text-[10px] text-slate-400 uppercase tracking-wider mb-2 font-bold flex items-center gap-1.5">
            <Compass className="w-3 h-3 text-sonar-cyan" />
            <span>Hazard Taxonomy</span>
          </div>
          <div className="space-y-1.5">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-red-500 shadow-sm shadow-red-500"></span>
              <span className="text-slate-300">Ghost Net (P1 Urgent)</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 shadow-sm shadow-emerald-400"></span>
              <span className="text-slate-300">Pipeline Asset (P2)</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-blue-400 shadow-sm shadow-blue-400"></span>
              <span className="text-slate-300">Shipwreck (P3 Chart)</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-amber-400 shadow-sm shadow-amber-400"></span>
              <span className="text-slate-300">Mine / UXO (P1 Alert)</span>
            </div>
          </div>
        </div>

        {/* Map Zoom Controls */}
        <div className="absolute bottom-4 right-4 flex flex-col gap-1 bg-ocean-950/85 backdrop-blur border border-ocean-800 rounded-lg p-1">
          <button 
            onClick={() => setZoom(z => Math.min(2.5, z + 0.25))}
            className="p-1.5 text-slate-300 hover:text-white hover:bg-ocean-800 rounded"
            title="Zoom In"
          >
            <ZoomIn className="w-4 h-4" />
          </button>
          <button 
            onClick={() => setZoom(z => Math.max(0.75, z - 0.25))}
            className="p-1.5 text-slate-300 hover:text-white hover:bg-ocean-800 rounded"
            title="Zoom Out"
          >
            <ZoomOut className="w-4 h-4" />
          </button>
          <button 
            onClick={() => { setZoom(1); setPan({ x: 0, y: 0 }); }}
            className="p-1.5 text-slate-300 hover:text-white hover:bg-ocean-800 rounded"
            title="Reset View"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>

      </div>

      {/* Selected Hazard Quick Card Footer */}
      {selectedHazard && (
        <div className="p-3 bg-ocean-900/90 border-t border-ocean-800 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div 
              className="w-3 h-3 rounded-full" 
              style={{ backgroundColor: selectedHazard.color || '#EF4444' }} 
            />
            <div>
              <div className="text-xs font-mono font-bold text-white flex items-center gap-2">
                <span>{selectedHazard.display_name}</span>
                <span className="px-1.5 py-0.2 rounded bg-sonar-cyan/10 text-sonar-cyan text-[10px]">
                  {selectedHazard.confidence_pct}% CONF
                </span>
              </div>
              <div className="text-[11px] font-mono text-slate-400">
                COORDINATES: {selectedHazard.latitude?.toFixed(5)}°N, {selectedHazard.longitude?.toFixed(5)}°E • PRIORITY: <strong className="text-white">{selectedHazard.priority}</strong>
              </div>
            </div>
          </div>
          <button 
            onClick={() => onSelectHazard && onSelectHazard(null)}
            className="text-xs font-mono text-slate-400 hover:text-white"
          >
            Dismiss
          </button>
        </div>
      )}

    </div>
  );
}
