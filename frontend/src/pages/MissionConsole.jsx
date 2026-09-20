import React, { useState, useEffect } from 'react';
import { 
  Waves, 
  Upload, 
  Sliders, 
  Play, 
  RefreshCw, 
  FileText, 
  Compass, 
  AlertTriangle,
  FolderOpen
} from 'lucide-react';
import { fetchSamples, detectSample, detectUpload } from '../services/api';
import WaterfallViewer from '../components/WaterfallViewer';
import DebrisCard from '../components/DebrisCard';
import StatsHUD from '../components/StatsHUD';

export default function MissionConsole() {
  const [samples, setSamples] = useState([]);
  const [selectedSample, setSelectedSample] = useState('');
  const [confThreshold, setConfThreshold] = useState(0.25);
  const [altitudeM, setAltitudeM] = useState(12.0);
  const [headingDeg, setHeadingDeg] = useState(45.0);
  const [swathWidthM, setSwathWidthM] = useState(100.0);
  
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [selectedDetection, setSelectedDetection] = useState(null);

  // Load samples on mount
  useEffect(() => {
    fetchSamples()
      .then((data) => {
        setSamples(data);
        if (data.length > 0) {
          // Default to first sample (e.g. pipe or wreck)
          setSelectedSample(data[0].filename);
          runDetection(data[0].filename);
        }
      })
      .catch((err) => setError(err.message));
  }, []);

  const runDetection = async (filename) => {
    if (!filename) return;
    setLoading(true);
    setError(null);
    try {
      const data = await detectSample(filename, {
        conf_threshold: confThreshold,
        altitude_m: altitudeM,
        heading_deg: headingDeg,
        swath_width_m: swathWidthM
      });
      setResult(data);
      if (data.detections && data.detections.length > 0) {
        setSelectedDetection(data.detections[0]);
      } else {
        setSelectedDetection(null);
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSampleChange = (e) => {
    const fn = e.target.value;
    setSelectedSample(fn);
    runDetection(fn);
  };

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setLoading(true);
    setError(null);
    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('conf_threshold', confThreshold);
      formData.append('altitude_m', altitudeM);
      formData.append('heading_deg', headingDeg);
      formData.append('swath_width_m', swathWidthM);

      const data = await detectUpload(formData);
      setResult(data);
      if (data.detections && data.detections.length > 0) {
        setSelectedDetection(data.detections[0]);
      } else {
        setSelectedDetection(null);
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Compute stats tally
  const detections = result?.detections || [];
  const ghostNets = detections.filter(d => d.class_name === 'ghost_net').length;
  const pipelines = detections.filter(d => d.class_name === 'submarine_pipeline').length;
  const wrecks = detections.filter(d => d.class_name === 'shipwreck').length;
  const mines = detections.filter(d => d.class_name === 'mine_cylinder').length;

  return (
    <div className="max-w-7xl mx-auto px-4 lg:px-8 py-6 space-y-6">
      
      {/* Top Header & Mission Indicators */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-mono font-bold text-white flex items-center gap-2">
            <Waves className="w-6 h-6 text-sonar-cyan animate-pulse" />
            Side-Scan Sonar Waterfall Console
          </h1>
          <p className="text-xs text-slate-400 mt-0.5">
            Real-time acoustic despeckling, ONNX AI detection, and acoustic shadow height profiling.
          </p>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-3">
          <label className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-ocean-900 border border-ocean-700 hover:border-sonar-cyan/40 text-slate-200 text-xs font-mono font-medium cursor-pointer transition-all">
            <Upload className="w-3.5 h-3.5 text-sonar-cyan" />
            <span>Upload SSS File</span>
            <input 
              type="file" 
              accept="image/*" 
              className="hidden" 
              onChange={handleFileUpload} 
            />
          </label>

          <button
            onClick={() => runDetection(selectedSample)}
            disabled={loading || !selectedSample}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-sonar-cyan text-ocean-950 font-bold text-xs font-mono hover:bg-sonar-teal disabled:opacity-50 transition-all shadow-md shadow-sonar-cyan/20"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
            <span>Reprocess Swath</span>
          </button>
        </div>
      </div>

      {/* KPI Stats HUD */}
      <StatsHUD 
        totalDetections={detections.length}
        ghostNets={ghostNets}
        pipelines={pipelines}
        wrecks={wrecks}
        mines={mines}
        avgLatencyMs={result?.inference_time_ms || 18.5}
        noiseReductionPct={result?.speckle_metrics?.noise_reduction_pct || 68.4}
      />

      {/* Controls Bar: Sample Selector & Telemetry Sliders */}
      <div className="glass-panel rounded-2xl p-4 border border-ocean-800 grid grid-cols-1 md:grid-cols-4 gap-4">
        
        {/* Sample Swath Dropdown */}
        <div>
          <label className="block text-[11px] font-mono text-slate-400 mb-1.5 flex items-center gap-1.5">
            <FolderOpen className="w-3.5 h-3.5 text-sonar-cyan" />
            TEST SONAR SWATH
          </label>
          <select
            value={selectedSample}
            onChange={handleSampleChange}
            className="w-full bg-ocean-950 border border-ocean-700 rounded-xl px-3 py-2 text-xs font-mono text-slate-200 focus:outline-none focus:border-sonar-cyan"
          >
            {samples.map((s) => (
              <option key={s.filename} value={s.filename}>
                {s.display_title}
              </option>
            ))}
          </select>
        </div>

        {/* Confidence Threshold Slider */}
        <div>
          <div className="flex items-center justify-between text-[11px] font-mono text-slate-400 mb-1.5">
            <span>AI CONFIDENCE FILTER</span>
            <span className="text-sonar-cyan font-bold">{Math.round(confThreshold * 100)}%</span>
          </div>
          <input
            type="range"
            min="0.05"
            max="0.95"
            step="0.05"
            value={confThreshold}
            onChange={(e) => setConfThreshold(parseFloat(e.target.value))}
            className="w-full accent-sonar-cyan cursor-pointer"
          />
        </div>

        {/* AUV Altitude Off Seafloor */}
        <div>
          <div className="flex items-center justify-between text-[11px] font-mono text-slate-400 mb-1.5">
            <span>AUV ALTITUDE (H)</span>
            <span className="text-white font-bold">{altitudeM}m</span>
          </div>
          <input
            type="range"
            min="5.0"
            max="30.0"
            step="1.0"
            value={altitudeM}
            onChange={(e) => setAltitudeM(parseFloat(e.target.value))}
            className="w-full accent-sonar-teal cursor-pointer"
          />
        </div>

        {/* Acoustic Swath Width */}
        <div>
          <div className="flex items-center justify-between text-[11px] font-mono text-slate-400 mb-1.5">
            <span>SWATH COVERAGE</span>
            <span className="text-emerald-400 font-bold">{swathWidthM}m</span>
          </div>
          <input
            type="range"
            min="50"
            max="250"
            step="25"
            value={swathWidthM}
            onChange={(e) => setSwathWidthM(parseFloat(e.target.value))}
            className="w-full accent-emerald-400 cursor-pointer"
          />
        </div>

      </div>

      {/* Error Banner */}
      {error && (
        <div className="p-4 rounded-xl bg-red-500/15 border border-red-500/30 text-xs font-mono text-red-200 flex items-center gap-2">
          <AlertTriangle className="w-4 h-4 text-red-400 flex-shrink-0" />
          <span>Error: {error}</span>
        </div>
      )}

      {/* Main Workspace: Waterfall Viewer + Debris Card */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        
        {/* Waterfall Display (Takes 2 Columns on desktop) */}
        <div className="lg:col-span-2">
          <WaterfallViewer
            result={result}
            loading={loading}
            selectedDetection={selectedDetection}
            onSelectDetection={setSelectedDetection}
          />
        </div>

        {/* Detailed Anomaly Inspection Sidebar */}
        <div className="space-y-4">
          {selectedDetection ? (
            <DebrisCard 
              detection={selectedDetection} 
              onClose={() => setSelectedDetection(null)} 
            />
          ) : (
            <div className="glass-panel rounded-2xl p-8 border border-ocean-800 text-center">
              <Compass className="w-10 h-10 text-slate-600 mx-auto mb-3" />
              <h4 className="font-mono text-sm font-semibold text-slate-300 mb-1">
                Select Anomaly to Inspect
              </h4>
              <p className="text-xs text-slate-500">
                Click on any bounding box or target pill in the waterfall console to view physical dimensions, WGS-84 coordinates, and MoES clearance protocols.
              </p>
            </div>
          )}

          {/* SSS Acoustic Physics Reference */}
          <div className="glass-panel rounded-2xl p-4 border border-ocean-800 font-mono text-xs space-y-2">
            <div className="text-[11px] font-bold text-sonar-cyan tracking-wider uppercase">
              Acoustic Physics Grounding
            </div>
            <div className="text-slate-400 text-[11px] leading-relaxed">
              • <strong>Ground Range:</strong> G = √(R<sub>s</sub>² - H²)<br />
              • <strong>Object Height:</strong> h = (H · L<sub>s</sub>) / R<sub>s</sub><br />
              • <strong>Speckle Model:</strong> 7x7 Lee filter with local variance weight W
            </div>
          </div>
        </div>

      </div>

    </div>
  );
}
