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
  Anchor,
  Radio
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
    <div className="rounded-[2rem] overflow-hidden bg-[#1a1a1a] border border-white/10 flex flex-col h-full shadow-2xl font-poppins">
      
      {/* Map Controls Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 px-5 py-3.5 bg-[#161616] border-b border-white/10">
        
        <div className="flex items-center gap-2.5">
          <Radio className="w-4 h-4 text-crimson animate-pulse" />
          <span className="font-calsans text-sm font-bold text-white tracking-wider uppercase">
            SEAFLOOR GIS BATHYMETRIC CLEARANCE
          </span>
          <span className="px-2.5 py-0.5 rounded-full bg-[#121212] text-[10px] font-semibold text-zinc-400 border border-white/10">
            BAY OF BENGAL / NIOT TRANSECT
          </span>
        </div>

        {/* Hazard Class Filters */}
        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar">
          <Filter className="w-3.5 h-3.5 text-zinc-400 mr-1" />
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
                className={`px-3 py-1 rounded-lg text-xs font-poppins font-medium transition-all ${
                  active 
                    ? 'btn-crimson shadow-md shadow-crimson/30' 
                    : 'bg-[#121212] border border-white/10 text-zinc-400 hover:text-white'
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
        className="relative flex-1 min-h-[460px] bg-[#0c0c0c] overflow-hidden cursor-grab active:cursor-grabbing select-none"
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
      >
        
        {/* Sonar Scanlines effect */}
        <div className="absolute inset-0 sonar-scanlines pointer-events-none opacity-40"></div>

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
              <path d="M 40 0 L 0 0 0 40" fill="none" stroke="rgba(255, 255, 255, 0.04)" strokeWidth="1"/>
            </pattern>
            {/* Glow Filter for Hazards */}
            <filter id="hazardGlow" x="-50%" y="-50%" width="200%" height="200%">
              <feGaussianBlur in="SourceGraphic" stdDeviation="4" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>

          {/* Background Grid */}
          <rect width="800" height="550" fill="url(#bathymetryGrid)" />

          {/* Depth Contours (Simulated Bathymetry Lines) */}
          <path d="M 0 100 Q 200 130 400 90 T 800 110" fill="none" stroke="rgba(255, 255, 255, 0.08)" strokeWidth="1.5" strokeDasharray="6,4" />
          <text x="740" y="105" fill="rgba(255, 255, 255, 0.3)" fontSize="9" fontFamily="monospace">-30m</text>

          <path d="M 0 220 Q 250 250 500 200 T 800 230" fill="none" stroke="rgba(255, 255, 255, 0.08)" strokeWidth="1.5" strokeDasharray="6,4" />
          <text x="740" y="225" fill="rgba(255, 255, 255, 0.3)" fontSize="9" fontFamily="monospace">-40m</text>

          <path d="M 0 350 Q 300 390 550 330 T 800 360" fill="none" stroke="rgba(255, 255, 255, 0.08)" strokeWidth="1.5" strokeDasharray="6,4" />
          <text x="740" y="355" fill="rgba(255, 255, 255, 0.3)" fontSize="9" fontFamily="monospace">-50m</text>

          <path d="M 0 460 Q 280 500 520 440 T 800 470" fill="none" stroke="rgba(255, 255, 255, 0.08)" strokeWidth="1.5" strokeDasharray="6,4" />
          <text x="740" y="465" fill="rgba(255, 255, 255, 0.3)" fontSize="9" fontFamily="monospace">-60m</text>

          {/* AUV Lawnmower Trackline Path in Crimson */}
          {waypoints.length > 1 && (
            <>
              {/* Swath acoustic corridor */}
              <path 
                d={pathData} 
                fill="none" 
                stroke="rgba(225, 29, 72, 0.12)" 
                strokeWidth="45" 
                strokeLinecap="round" 
                strokeLinejoin="round" 
              />
              {/* Center trackline */}
              <path 
                d={pathData} 
                fill="none" 
                stroke="#e11d48" 
                strokeWidth="2" 
                strokeDasharray="4,4" 
                className="opacity-80"
              />
            </>
          )}

          {/* AUV Current Vehicle Icon */}
          {waypoints.length > 0 && (
            <g transform={`translate(${lonToX(waypoints[waypoints.length - 1].lon)}, ${latToY(waypoints[waypoints.length - 1].lat)})`}>
              <circle r="14" fill="rgba(225, 29, 72, 0.3)" className="animate-ping" />
              <circle r="7" fill="#e11d48" />
              <polygon points="0,-12 7,7 0,4 -7,7" fill="#FFFFFF" />
            </g>
          )}

          {/* Detected Hazard Markers */}
          {filteredHazards.map((h) => {
            const x = lonToX(h.longitude);
            const y = latToY(h.latitude);
            const isSelected = selectedHazard?.id === h.id;
            const color = h.color || '#e11d48';

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
                  r={isSelected ? "20" : "12"} 
                  fill={color} 
                  opacity="0.35" 
                  className="animate-ping" 
                />
                
                {/* Main pin marker */}
                <circle 
                  r={isSelected ? "10" : "7"} 
                  fill={color} 
                  stroke="#FFFFFF" 
                  strokeWidth={isSelected ? "3" : "1.5"}
                  filter="url(#hazardGlow)"
                />

                {/* Target label tooltip */}
                <g transform="translate(14, -10)" className="opacity-90 group-hover:opacity-100">
                  <rect 
                    x="-2" 
                    y="-12" 
                    width="145" 
                    height="22" 
                    rx="6" 
                    fill="rgba(18, 18, 18, 0.95)" 
                    stroke={color} 
                    strokeWidth="1.5" 
                  />
                  <text 
                    x="5" 
                    y="3" 
                    fill="#FFFFFF" 
                    fontSize="9.5" 
                    fontFamily="Poppins" 
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
        <div className="absolute top-4 left-4 bg-[#121212]/90 backdrop-blur border border-white/10 rounded-2xl p-3.5 text-xs font-poppins max-w-[210px] shadow-xl">
          <div className="text-[10px] text-zinc-400 uppercase tracking-widest mb-2.5 font-bold flex items-center gap-1.5">
            <Compass className="w-3.5 h-3.5 text-crimson" />
            <span>Hazard Taxonomy</span>
          </div>
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-crimson shadow-sm shadow-crimson"></span>
              <span className="text-zinc-200 text-xs">Ghost Net (P1 Urgent)</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 shadow-sm shadow-emerald-400"></span>
              <span className="text-zinc-200 text-xs">Pipeline Asset (P2)</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-cyan-400 shadow-sm shadow-cyan-400"></span>
              <span className="text-zinc-200 text-xs">Shipwreck (P3 Chart)</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-amber-400 shadow-sm shadow-amber-400"></span>
              <span className="text-zinc-200 text-xs">Mine / UXO (P1 Alert)</span>
            </div>
          </div>
        </div>

        {/* Map Zoom Controls */}
        <div className="absolute bottom-4 right-4 flex flex-col gap-1.5 bg-[#121212]/90 backdrop-blur border border-white/10 rounded-xl p-1.5 shadow-xl">
          <button 
            onClick={() => setZoom(z => Math.min(2.5, z + 0.25))}
            className="p-2 text-zinc-300 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
            title="Zoom In"
          >
            <ZoomIn className="w-4 h-4" />
          </button>
          <button 
            onClick={() => setZoom(z => Math.max(0.75, z - 0.25))}
            className="p-2 text-zinc-300 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
            title="Zoom Out"
          >
            <ZoomOut className="w-4 h-4" />
          </button>
          <button 
            onClick={() => { setZoom(1); setPan({ x: 0, y: 0 }); }}
            className="p-2 text-zinc-300 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
            title="Reset View"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>

      </div>

      {/* Selected Hazard Quick Card Footer */}
      {selectedHazard && (
        <div className="p-4 bg-[#161616] border-t border-white/10 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div 
              className="w-3.5 h-3.5 rounded-full" 
              style={{ backgroundColor: selectedHazard.color || '#e11d48' }} 
            />
            <div>
              <div className="text-sm font-calsans font-bold text-white flex items-center gap-2">
                <span>{selectedHazard.display_name}</span>
                <span className="px-2 py-0.5 rounded-full bg-crimson/20 text-crimson text-[10px] font-bold">
                  {selectedHazard.confidence_pct}% CONF
                </span>
              </div>
              <div className="text-xs font-poppins text-zinc-400 mt-0.5">
                COORDINATES: {selectedHazard.latitude?.toFixed(5)}°N, {selectedHazard.longitude?.toFixed(5)}°E • PRIORITY: <strong className="text-white">{selectedHazard.priority}</strong>
              </div>
            </div>
          </div>
          <button 
            onClick={() => onSelectHazard && onSelectHazard(null)}
            className="text-xs font-poppins text-zinc-400 hover:text-white px-3 py-1 rounded-lg hover:bg-white/10 transition-colors"
          >
            Dismiss
          </button>
        </div>
      )}

    </div>
  );
}
