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
  FolderOpen,
  Activity
} from 'lucide-react';
import { fetchSamples, detectSample, detectUpload } from '../services/api';
import WaterfallViewer from '../components/WaterfallViewer';
import DebrisCard from '../components/DebrisCard';
import StatsHUD from '../components/StatsHUD';

/** Animated range slider with colored fill */
function SonarSlider({ label, value, min, max, step, onChange, color = '#00F0FF', unit = '' }) {
  const pct = ((value - min) / (max - min)) * 100;
  return (
    <div className="group">
      <div className="flex items-center justify-between text-[11px] font-mono text-slate-400 mb-2">
        <span className="tracking-wider">{label}</span>
        <span className="font-bold transition-all duration-300" style={{ color }}>
          {value}{unit}
        </span>
      </div>
      <div className="relative h-1.5 rounded-full bg-ocean-800">
        {/* Filled track */}
        <div
          className="absolute top-0 left-0 h-full rounded-full transition-all duration-200"
          style={{ width: `${pct}%`, background: `linear-gradient(90deg, ${color}88, ${color})` }}
        />
        <input
          type="range"
          min={min}
          max={max}
          step={step}
          value={value}
          onChange={onChange}
          className="absolute inset-0 w-full opacity-0 cursor-pointer h-full"
        />
        {/* Thumb */}
        <div
          className="absolute top-1/2 -translate-y-1/2 w-3.5 h-3.5 rounded-full border-2 shadow-lg transition-all duration-200 group-hover:scale-125"
          style={{
            left: `calc(${pct}% - 7px)`,
            borderColor: color,
            background: '#030712',
            boxShadow: `0 0 8px ${color}88`,
          }}
        />
      </div>
    </div>
  );
}

export default function MissionConsole() {
  const [samples, setSamples]           = useState([]);
  const [selectedSample, setSelectedSample] = useState('');
  const [confThreshold, setConfThreshold]   = useState(0.25);
  const [altitudeM, setAltitudeM]           = useState(12.0);
  const [headingDeg, setHeadingDeg]         = useState(45.0);
  const [swathWidthM, setSwathWidthM]       = useState(100.0);
  const [result, setResult]                 = useState(null);
  const [loading, setLoading]               = useState(false);
  const [error, setError]                   = useState(null);
  const [selectedDetection, setSelectedDetection] = useState(null);
  const [mounted, setMounted]               = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setMounted(true), 60);
    return () => clearTimeout(t);
  }, []);

  useEffect(() => {
    fetchSamples()
      .then((data) => {
        setSamples(data);
        if (data.length > 0) {
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
        swath_width_m: swathWidthM,
      });
      setResult(data);
      if (data.detections?.length > 0) {
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
      if (data.detections?.length > 0) {
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

  const detections  = result?.detections || [];
  const ghostNets   = detections.filter(d => d.class_name === 'ghost_net').length;
  const pipelines   = detections.filter(d => d.class_name === 'submarine_pipeline').length;
  const wrecks      = detections.filter(d => d.class_name === 'shipwreck').length;
  const mines       = detections.filter(d => d.class_name === 'mine_cylinder').length;

  return (
    <div className="max-w-7xl mx-auto px-4 lg:px-8 py-6 space-y-6">

      {/* ── Header ─────────────────────────────────────── */}
      <div
        className="flex flex-wrap items-center justify-between gap-4"
        style={{
          opacity: mounted ? 1 : 0,
          transform: mounted ? 'translateY(0)' : 'translateY(16px)',
          transition: 'opacity 0.5s ease, transform 0.5s ease',
        }}
      >
        <div>
          <h1 className="text-2xl font-bold text-white flex items-center gap-2.5">
            <div className="relative">
              <Waves className="w-6 h-6 text-sonar-cyan" style={{ animation: 'float 4s ease-in-out infinite' }} />
            </div>
            Side-Scan Sonar Waterfall Console
          </h1>
          <p className="text-sm text-slate-400 mt-1">
            Real-time acoustic despeckling, ONNX AI detection, and acoustic shadow height profiling.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <label className="btn-shimmer flex items-center gap-2 px-4 py-2 rounded-xl bg-ocean-900 border border-ocean-700 hover:border-sonar-cyan/50 text-slate-200 text-xs font-mono font-medium cursor-pointer transition-all duration-300 hover:scale-105 active:scale-95">
            <Upload className="w-3.5 h-3.5 text-sonar-cyan" />
            <span>Upload SSS File</span>
            <input type="file" accept="image/*" className="hidden" onChange={handleFileUpload} />
          </label>

          <button
            onClick={() => runDetection(selectedSample)}
            disabled={loading || !selectedSample}
            className="btn-shimmer flex items-center gap-2 px-4 py-2 rounded-xl bg-sonar-cyan text-ocean-950 font-bold text-xs font-mono hover:bg-sonar-teal disabled:opacity-50 transition-all duration-300 shadow-md shadow-sonar-cyan/25 hover:shadow-sonar-cyan/40 hover:scale-105 active:scale-95 disabled:scale-100"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
            <span>{loading ? 'Processing...' : 'Reprocess Swath'}</span>
          </button>
        </div>
      </div>

      {/* ── Stats HUD ──────────────────────────────────── */}
      <StatsHUD
        totalDetections={detections.length}
        ghostNets={ghostNets}
        pipelines={pipelines}
        wrecks={wrecks}
        mines={mines}
        avgLatencyMs={result?.inference_time_ms || 18.5}
        noiseReductionPct={result?.speckle_metrics?.noise_reduction_pct || 68.4}
      />

      {/* ── Controls Bar ───────────────────────────────── */}
      <div
        className="glass-panel rounded-2xl p-5 border border-ocean-800 grid grid-cols-1 md:grid-cols-4 gap-6"
        style={{
          opacity: mounted ? 1 : 0,
          transform: mounted ? 'translateY(0)' : 'translateY(12px)',
          transition: 'opacity 0.5s ease 0.15s, transform 0.5s ease 0.15s',
        }}
      >
        {/* Sample dropdown */}
        <div>
          <label className="block text-[11px] font-mono text-slate-400 mb-2 flex items-center gap-1.5 tracking-wider">
            <FolderOpen className="w-3.5 h-3.5 text-sonar-cyan" />
            TEST SONAR SWATH
          </label>
          <select
            value={selectedSample}
            onChange={handleSampleChange}
            className="w-full bg-ocean-950 border border-ocean-700 rounded-xl px-3 py-2.5 text-xs font-mono text-slate-200 focus:outline-none focus:border-sonar-cyan transition-colors duration-300 cursor-pointer hover:border-ocean-600"
          >
            {samples.map((s) => (
              <option key={s.filename} value={s.filename}>{s.display_title}</option>
            ))}
          </select>
        </div>

        <SonarSlider
          label="AI CONFIDENCE FILTER"
          value={confThreshold}
          min={0.05} max={0.95} step={0.05}
          onChange={(e) => setConfThreshold(parseFloat(e.target.value))}
          color="#00F0FF"
          unit=""
        />

        <SonarSlider
          label="AUV ALTITUDE (H)"
          value={altitudeM}
          min={5} max={30} step={1}
          onChange={(e) => setAltitudeM(parseFloat(e.target.value))}
          color="#0DF5C4"
          unit="m"
        />

        <SonarSlider
          label="SWATH COVERAGE"
          value={swathWidthM}
          min={50} max={250} step={25}
          onChange={(e) => setSwathWidthM(parseFloat(e.target.value))}
          color="#10B981"
          unit="m"
        />
      </div>

      {/* ── Error Banner ────────────────────────────────── */}
      {error && (
        <div
          className="p-4 rounded-xl bg-red-500/15 border border-red-500/30 text-xs font-mono text-red-200 flex items-center gap-2"
          style={{ animation: 'fadeUp 0.4s ease forwards' }}
        >
          <AlertTriangle className="w-4 h-4 text-red-400 flex-shrink-0" />
          <span>Error: {error}</span>
        </div>
      )}

      {/* ── Main Workspace ──────────────────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">

        <div className="lg:col-span-2">
          <WaterfallViewer
            result={result}
            loading={loading}
            selectedDetection={selectedDetection}
            onSelectDetection={setSelectedDetection}
          />
        </div>

        <div className="space-y-4">
          {selectedDetection ? (
            <div style={{ animation: 'scaleIn 0.35s cubic-bezier(0.34, 1.56, 0.64, 1) forwards' }}>
              <DebrisCard
                detection={selectedDetection}
                onClose={() => setSelectedDetection(null)}
              />
            </div>
          ) : (
            <div className="glass-panel rounded-2xl p-8 border border-ocean-800 text-center">
              <div className="relative mx-auto w-12 h-12 mb-4">
                <Compass className="w-12 h-12 text-slate-600 mx-auto" style={{ animation: 'float 5s ease-in-out infinite' }} />
              </div>
              <h4 className="font-mono text-sm font-semibold text-slate-300 mb-2">
                Select Anomaly to Inspect
              </h4>
              <p className="text-xs text-slate-500 leading-relaxed">
                Click on any bounding box or target pill in the waterfall console to view physical dimensions, WGS-84 coordinates, and MoES clearance protocols.
              </p>
            </div>
          )}

          {/* Acoustic Physics Reference */}
          <div className="glass-panel rounded-2xl p-4 border border-ocean-800 font-mono text-xs space-y-2">
            <div className="flex items-center gap-2 text-[11px] font-bold text-sonar-cyan tracking-wider uppercase mb-3">
              <Activity className="w-3.5 h-3.5" />
              Acoustic Physics Grounding
            </div>
            <div className="text-slate-400 text-[11px] leading-relaxed space-y-1.5">
              <div className="flex items-start gap-2 hover:text-slate-300 transition-colors duration-200">
                <span className="text-sonar-cyan mt-0.5">•</span>
                <span><strong className="text-slate-300">Ground Range:</strong> G = √(R<sub>s</sub>² − H²)</span>
              </div>
              <div className="flex items-start gap-2 hover:text-slate-300 transition-colors duration-200">
                <span className="text-sonar-cyan mt-0.5">•</span>
                <span><strong className="text-slate-300">Object Height:</strong> h = (H · L<sub>s</sub>) / R<sub>s</sub></span>
              </div>
              <div className="flex items-start gap-2 hover:text-slate-300 transition-colors duration-200">
                <span className="text-sonar-cyan mt-0.5">•</span>
                <span><strong className="text-slate-300">Speckle Model:</strong> 7×7 Lee filter with local variance weight W</span>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
