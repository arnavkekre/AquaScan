import React, { useState } from 'react';
import { 
  Eye, 
  Layers, 
  Sparkles, 
  Crosshair, 
  Maximize2, 
  Sliders, 
  ShieldAlert,
  Info,
  Clock
} from 'lucide-react';

export default function WaterfallViewer({ 
  result, 
  loading, 
  selectedDetection, 
  onSelectDetection 
}) {
  const [activeTab, setActiveTab] = useState('annotated'); // 'raw', 'despeckled', 'enhanced', 'annotated', 'split'
  const [cursorPos, setCursorPos] = useState({ x: 0, y: 0, slant_m: 0, ground_m: 0 });

  if (loading) {
    return (
      <div className="glass-panel rounded-2xl p-12 flex flex-col items-center justify-center min-h-[480px] border border-sonar-cyan/20">
        <div className="relative w-20 h-20 mb-6">
          <div className="absolute inset-0 rounded-full border-2 border-sonar-cyan/30 animate-ping"></div>
          <div className="absolute inset-2 rounded-full border-2 border-sonar-cyan animate-pulse"></div>
          <div className="absolute inset-0 flex items-center justify-center">
            <Crosshair className="w-8 h-8 text-sonar-cyan animate-spin" />
          </div>
        </div>
        <p className="font-mono text-sm tracking-wider text-sonar-cyan mb-2">
          PROCESSING ACOUSTIC SWATH
        </p>
        <p className="text-xs text-slate-400 text-center max-w-sm">
          Applying 7x7 Lee speckle filter, CLAHE histogram equalization, and running YOLOv8 ONNX inference...
        </p>
      </div>
    );
  }

  if (!result) {
    return (
      <div className="glass-panel rounded-2xl p-12 flex flex-col items-center justify-center min-h-[480px] border border-ocean-800 text-center">
        <Crosshair className="w-12 h-12 text-slate-600 mb-4" />
        <h3 className="font-mono text-base font-semibold text-slate-300 mb-2">No Active Acoustic Feed</h3>
        <p className="text-xs text-slate-500 max-w-md">
          Select a sample sonar swath from the catalog or upload raw SSS imagery to trigger the acoustic detection pipeline.
        </p>
      </div>
    );
  }

  const {
    raw_image_data,
    despeckled_image_data,
    enhanced_image_data,
    annotated_image_data,
    detections,
    speckle_metrics,
    image_dimensions,
    inference_time_ms,
    total_latency_ms
  } = result;

  const currentImg = 
    activeTab === 'raw' ? raw_image_data :
    activeTab === 'despeckled' ? despeckled_image_data :
    activeTab === 'enhanced' ? enhanced_image_data :
    annotated_image_data;

  const handleMouseMove = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = Math.round(((e.clientX - rect.left) / rect.width) * (image_dimensions?.width || 640));
    const y = Math.round(((e.clientY - rect.top) / rect.height) * (image_dimensions?.height || 640));
    const across_m = ((x - (image_dimensions?.width || 640) / 2) * (100 / (image_dimensions?.width || 640))).toFixed(1);
    setCursorPos({ x, y, across_m });
  };

  return (
    <div className="glass-panel rounded-2xl overflow-hidden border border-ocean-800 flex flex-col">
      
      {/* Top Controls Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 px-4 py-3 bg-ocean-900/90 border-b border-ocean-800">
        
        {/* View Switcher Tabs */}
        <div className="flex items-center gap-1 bg-ocean-950/80 p-1 rounded-lg border border-ocean-800">
          <button
            onClick={() => setActiveTab('raw')}
            className={`px-3 py-1 rounded text-xs font-mono font-medium transition-all ${
              activeTab === 'raw' ? 'bg-ocean-800 text-slate-200 shadow' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Raw SSS
          </button>
          <button
            onClick={() => setActiveTab('despeckled')}
            className={`px-3 py-1 rounded text-xs font-mono font-medium transition-all ${
              activeTab === 'despeckled' ? 'bg-ocean-800 text-sonar-teal shadow' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            7x7 Lee Filter
          </button>
          <button
            onClick={() => setActiveTab('enhanced')}
            className={`px-3 py-1 rounded text-xs font-mono font-medium transition-all ${
              activeTab === 'enhanced' ? 'bg-ocean-800 text-sonar-cyan shadow' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            CLAHE Equalized
          </button>
          <button
            onClick={() => setActiveTab('annotated')}
            className={`px-3 py-1 rounded text-xs font-mono font-medium transition-all flex items-center gap-1.5 ${
              activeTab === 'annotated' ? 'bg-sonar-cyan/20 text-sonar-cyan border border-sonar-cyan/30 shadow' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" />
            AI Detections
          </button>
          <button
            onClick={() => setActiveTab('split')}
            className={`px-3 py-1 rounded text-xs font-mono font-medium transition-all ${
              activeTab === 'split' ? 'bg-ocean-800 text-sonar-amber shadow' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Side-by-Side
          </button>
        </div>

        {/* Telemetry & Latency HUD */}
        <div className="flex items-center gap-4 text-xs font-mono">
          <div className="flex items-center gap-1 text-slate-400">
            <Clock className="w-3.5 h-3.5 text-sonar-cyan" />
            <span>INFER:</span>
            <span className="text-sonar-cyan font-bold">{inference_time_ms}ms</span>
          </div>
          <div className="hidden sm:flex items-center gap-1 text-slate-400">
            <span>TOTAL:</span>
            <span className="text-slate-200">{total_latency_ms}ms</span>
          </div>
          <div className="flex items-center gap-1 text-slate-400">
            <span>NOISE REDUCTION:</span>
            <span className="text-emerald-400 font-bold">{speckle_metrics?.noise_reduction_pct}%</span>
          </div>
        </div>

      </div>

      {/* Main Sonar Viewport */}
      <div className="relative bg-black flex items-center justify-center min-h-[460px] p-2 select-none overflow-hidden group">
        
        {/* Waterfall Scanlines Grid Overlay */}
        <div className="absolute inset-0 sonar-scanlines z-10"></div>

        {/* Dynamic Center Nadir Line */}
        <div className="absolute top-0 bottom-0 left-1/2 w-0.5 border-r border-dashed border-cyan-500/30 z-10 pointer-events-none">
          <span className="absolute top-2 left-1 text-[9px] font-mono text-cyan-500/50 uppercase tracking-widest">
            NADIR (AUV TRACKLINE)
          </span>
        </div>

        {activeTab === 'split' ? (
          /* Side-by-Side Comparison Mode */
          <div className="grid grid-cols-2 gap-2 w-full h-full z-0">
            <div className="relative flex flex-col items-center">
              <span className="absolute top-2 left-2 z-20 px-2 py-0.5 rounded bg-black/70 text-[10px] font-mono text-slate-400 border border-slate-700">
                RAW ACOUSTIC FEED (NOISY)
              </span>
              <img 
                src={raw_image_data} 
                alt="Raw SSS" 
                className="w-full max-h-[500px] object-contain rounded-lg border border-ocean-800"
              />
            </div>
            <div className="relative flex flex-col items-center">
              <span className="absolute top-2 left-2 z-20 px-2 py-0.5 rounded bg-black/70 text-[10px] font-mono text-sonar-cyan border border-sonar-cyan/40">
                FILTERED + AI ANNOTATED
              </span>
              <img 
                src={annotated_image_data} 
                alt="AI Annotated" 
                className="w-full max-h-[500px] object-contain rounded-lg border border-sonar-cyan/20"
              />
            </div>
          </div>
        ) : (
          /* Single Interactive Image Viewport */
          <div 
            className="relative cursor-crosshair max-w-full max-h-[520px] flex items-center justify-center z-0"
            onMouseMove={handleMouseMove}
          >
            <img 
              src={currentImg} 
              alt="Side Scan Sonar Swath" 
              className="max-h-[500px] w-auto object-contain rounded-lg shadow-2xl transition-all"
            />

            {/* Clickable Bounding Box Hit Areas */}
            {activeTab === 'annotated' && detections.map((det) => {
              const [x1, y1, x2, y2] = det.box_xyxy;
              const w = image_dimensions?.width || 640;
              const h = image_dimensions?.height || 640;
              const leftPct = (x1 / w) * 100;
              const topPct = (y1 / h) * 100;
              const widthPct = ((x2 - x1) / w) * 100;
              const heightPct = ((y2 - y1) / h) * 100;
              const isSelected = selectedDetection?.id === det.id;

              return (
                <div
                  key={det.id}
                  onClick={() => onSelectDetection && onSelectDetection(det)}
                  style={{
                    left: `${leftPct}%`,
                    top: `${topPct}%`,
                    width: `${widthPct}%`,
                    height: `${heightPct}%`,
                  }}
                  className={`absolute cursor-pointer transition-all border-2 rounded ${
                    isSelected 
                      ? 'border-white ring-4 ring-sonar-cyan/50 bg-sonar-cyan/20 z-30' 
                      : 'border-transparent hover:border-white/80 hover:bg-white/10 z-20'
                  }`}
                  title={`${det.display_name} (${det.confidence_pct}%)`}
                />
              );
            })}
          </div>
        )}

        {/* HUD Crosshair Position Footer */}
        <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between pointer-events-none z-20">
          <div className="px-2.5 py-1 rounded bg-ocean-950/85 backdrop-blur border border-ocean-800 text-[11px] font-mono text-slate-300 flex items-center gap-3">
            <span>PIXELS: <strong className="text-white">X:{cursorPos.x} Y:{cursorPos.y}</strong></span>
            <span>ACROSS-TRACK: <strong className="text-sonar-cyan">{cursorPos.across_m || 0}m</strong></span>
            <span className="hidden md:inline">TARGETS: <strong className="text-emerald-400">{detections.length}</strong></span>
          </div>

          <div className="px-2.5 py-1 rounded bg-ocean-950/85 backdrop-blur border border-ocean-800 text-[11px] font-mono text-slate-400">
            SWATH: 100m • RESOLUTION: 0.15m/px
          </div>
        </div>

      </div>

      {/* Detection Strip Footer */}
      {detections.length > 0 && (
        <div className="px-4 py-2.5 bg-ocean-900/70 border-t border-ocean-800 flex items-center gap-2 overflow-x-auto">
          <span className="text-xs font-mono text-slate-400 flex items-center gap-1 mr-2 flex-shrink-0">
            <ShieldAlert className="w-3.5 h-3.5 text-sonar-cyan" />
            TARGETS:
          </span>
          {detections.map((det) => {
            const isSelected = selectedDetection?.id === det.id;
            return (
              <button
                key={det.id}
                onClick={() => onSelectDetection && onSelectDetection(det)}
                className={`flex items-center gap-2 px-3 py-1 rounded-lg text-xs font-mono transition-all flex-shrink-0 border ${
                  isSelected 
                    ? 'bg-sonar-cyan/20 border-sonar-cyan text-white shadow-sm' 
                    : 'bg-ocean-950/60 border-ocean-800 text-slate-300 hover:border-slate-600'
                }`}
              >
                <span 
                  className="w-2 h-2 rounded-full" 
                  style={{ backgroundColor: det.color || '#00F0FF' }}
                />
                <span>{det.display_name}</span>
                <span className="text-slate-400 font-bold">{det.confidence_pct}%</span>
              </button>
            );
          })}
        </div>
      )}

    </div>
  );
}
