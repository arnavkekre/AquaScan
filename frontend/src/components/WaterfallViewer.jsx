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
  Clock,
  Radio
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
      <div className="rounded-[2.5rem] p-12 flex flex-col items-center justify-center min-h-[480px] bg-[#1a1a1a] border border-crimson/30 shadow-2xl">
        <div className="relative w-20 h-20 mb-6">
          <div className="absolute inset-0 rounded-full border-2 border-crimson/30 animate-ping"></div>
          <div className="absolute inset-2 rounded-full border-2 border-crimson animate-pulse"></div>
          <div className="absolute inset-0 flex items-center justify-center">
            <Radio className="w-8 h-8 text-crimson animate-pulse" />
          </div>
        </div>
        <p className="font-calsans font-bold text-base tracking-widest text-crimson mb-2 uppercase">
          PROCESSING ACOUSTIC TELEMETRY
        </p>
        <p className="text-xs text-zinc-400 text-center max-w-sm font-poppins">
          Applying 7x7 Lee speckle reduction, CLAHE equalization, and running ONNX edge inference...
        </p>
      </div>
    );
  }

  if (!result) {
    return (
      <div className="rounded-[2.5rem] p-12 flex flex-col items-center justify-center min-h-[480px] bg-[#1a1a1a] border border-white/10 text-center shadow-xl">
        <Crosshair className="w-12 h-12 text-zinc-600 mb-4" />
        <h3 className="font-calsans text-base font-bold text-white mb-2 uppercase">
          No Active Acoustic Feed
        </h3>
        <p className="text-xs text-zinc-400 max-w-md font-poppins">
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
    <div className="rounded-[2rem] overflow-hidden bg-[#1a1a1a] border border-white/10 flex flex-col shadow-2xl">
      
      {/* Top Controls Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 px-5 py-3.5 bg-[#161616] border-b border-white/10">
        
        {/* View Switcher Tabs */}
        <div className="flex items-center gap-1.5 bg-[#121212] p-1.5 rounded-xl border border-white/10">
          <button
            onClick={() => setActiveTab('raw')}
            className={`px-3 py-1 rounded-lg text-xs font-poppins font-medium transition-all ${
              activeTab === 'raw' ? 'bg-[#242424] text-white shadow' : 'text-zinc-400 hover:text-white'
            }`}
          >
            Raw SSS
          </button>
          <button
            onClick={() => setActiveTab('despeckled')}
            className={`px-3 py-1 rounded-lg text-xs font-poppins font-medium transition-all ${
              activeTab === 'despeckled' ? 'bg-[#242424] text-emerald-400 shadow' : 'text-zinc-400 hover:text-white'
            }`}
          >
            7x7 Lee Filter
          </button>
          <button
            onClick={() => setActiveTab('enhanced')}
            className={`px-3 py-1 rounded-lg text-xs font-poppins font-medium transition-all ${
              activeTab === 'enhanced' ? 'bg-[#242424] text-cyan-400 shadow' : 'text-zinc-400 hover:text-white'
            }`}
          >
            CLAHE Equalized
          </button>
          <button
            onClick={() => setActiveTab('annotated')}
            className={`px-3.5 py-1 rounded-lg text-xs font-poppins font-bold transition-all flex items-center gap-1.5 ${
              activeTab === 'annotated' ? 'btn-crimson shadow-md shadow-crimson/30' : 'text-zinc-400 hover:text-white'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" />
            AI Detections
          </button>
          <button
            onClick={() => setActiveTab('split')}
            className={`px-3 py-1 rounded-lg text-xs font-poppins font-medium transition-all ${
              activeTab === 'split' ? 'bg-[#242424] text-amber-400 shadow' : 'text-zinc-400 hover:text-white'
            }`}
          >
            Side-by-Side
          </button>
        </div>

        {/* Telemetry & Latency HUD */}
        <div className="flex items-center gap-4 text-xs font-poppins">
          <div className="flex items-center gap-1.5 text-zinc-400">
            <Clock className="w-3.5 h-3.5 text-crimson" />
            <span>INFER:</span>
            <span className="text-crimson font-calsans font-bold text-sm">{inference_time_ms}ms</span>
          </div>
          <div className="hidden sm:flex items-center gap-1 text-zinc-400">
            <span>TOTAL:</span>
            <span className="text-white font-medium">{total_latency_ms}ms</span>
          </div>
          <div className="flex items-center gap-1 text-zinc-400">
            <span>NOISE REDUCTION:</span>
            <span className="text-emerald-400 font-bold">{speckle_metrics?.noise_reduction_pct}%</span>
          </div>
        </div>

      </div>

      {/* Main Sonar Viewport */}
      <div className="relative bg-black flex items-center justify-center min-h-[460px] p-2 select-none overflow-hidden group">
        
        {/* Waterfall Scanlines Grid Overlay */}
        <div className="absolute inset-0 sonar-scanlines z-10 pointer-events-none"></div>

        {/* Dynamic Center Nadir Line */}
        <div className="absolute top-0 bottom-0 left-1/2 w-0.5 border-r border-dashed border-crimson/30 z-10 pointer-events-none">
          <span className="absolute top-2 left-1 text-[9px] font-mono text-crimson/60 uppercase tracking-widest">
            NADIR (AUV TRACKLINE)
          </span>
        </div>

        {activeTab === 'split' ? (
          /* Side-by-Side Comparison Mode */
          <div className="grid grid-cols-2 gap-3 w-full h-full z-0 p-2">
            <div className="relative flex flex-col items-center">
              <span className="absolute top-3 left-3 z-20 px-2.5 py-1 rounded-md bg-black/80 text-[10px] font-poppins uppercase font-semibold text-zinc-400 border border-white/10">
                RAW ACOUSTIC FEED (NOISY)
              </span>
              <img 
                src={raw_image_data} 
                alt="Raw SSS" 
                className="w-full max-h-[500px] object-contain rounded-xl border border-white/10"
              />
            </div>
            <div className="relative flex flex-col items-center">
              <span className="absolute top-3 left-3 z-20 px-2.5 py-1 rounded-md bg-black/80 text-[10px] font-poppins uppercase font-semibold text-crimson border border-crimson/50">
                DESPECKLED + AI ANNOTATED
              </span>
              <img 
                src={annotated_image_data} 
                alt="AI Annotated" 
                className="w-full max-h-[500px] object-contain rounded-xl border border-crimson/40 shadow-lg"
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
              className="max-h-[500px] w-auto object-contain rounded-xl shadow-2xl transition-all"
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
                      ? 'border-white ring-4 ring-crimson/60 bg-crimson/25 z-30' 
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
          <div className="px-3 py-1.5 rounded-xl bg-[#121212]/90 backdrop-blur border border-white/10 text-xs font-poppins text-zinc-300 flex items-center gap-4">
            <span>PIXELS: <strong className="text-white">X:{cursorPos.x} Y:{cursorPos.y}</strong></span>
            <span>ACROSS-TRACK: <strong className="text-crimson font-semibold">{cursorPos.across_m || 0}m</strong></span>
            <span className="hidden md:inline">TARGETS: <strong className="text-emerald-400">{detections.length}</strong></span>
          </div>

          <div className="px-3 py-1.5 rounded-xl bg-[#121212]/90 backdrop-blur border border-white/10 text-xs font-poppins text-zinc-400">
            SWATH: 100m • RESOLUTION: 0.15m/px
          </div>
        </div>

      </div>

      {/* Detection Strip Footer */}
      {detections.length > 0 && (
        <div className="px-5 py-3 bg-[#161616] border-t border-white/10 flex items-center gap-2 overflow-x-auto no-scrollbar">
          <span className="text-xs font-calsans font-bold tracking-wider uppercase text-zinc-400 flex items-center gap-1.5 mr-2 flex-shrink-0">
            <ShieldAlert className="w-4 h-4 text-crimson" />
            TARGETS:
          </span>
          {detections.map((det) => {
            const isSelected = selectedDetection?.id === det.id;
            return (
              <button
                key={det.id}
                onClick={() => onSelectDetection && onSelectDetection(det)}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-poppins font-medium transition-all flex-shrink-0 border ${
                  isSelected 
                    ? 'btn-crimson shadow-md shadow-crimson/30' 
                    : 'bg-[#121212] border-white/10 text-zinc-300 hover:border-crimson/50'
                }`}
              >
                <span 
                  className="w-2 h-2 rounded-full" 
                  style={{ backgroundColor: det.color || '#e11d48' }}
                />
                <span className="font-semibold">{det.display_name}</span>
                <span className="opacity-80 text-[11px] font-bold">{det.confidence_pct}%</span>
              </button>
            );
          })}
        </div>
      )}

    </div>
  );
}
