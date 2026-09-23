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
  Activity,
  Radio,
  SlidersHorizontal
} from 'lucide-react';
import { fetchSamples, detectSample, detectUpload } from '../services/api';
import WaterfallViewer from '../components/WaterfallViewer';
import DebrisCard from '../components/DebrisCard';
import StatsHUD from '../components/StatsHUD';

/** Animated luxury range slider with crimson fill */
function SonarSlider({ label, value, min, max, step, onChange, color = '#e11d48', unit = '' }) {
  const pct = ((value - min) / (max - min)) * 100;
  return (
    <div className="group">
      <div className="flex items-center justify-between text-xs font-poppins text-zinc-400 mb-2">
        <span className="tracking-wide uppercase font-medium text-[11px]">{label}</span>
        <span className="font-calsans font-bold text-sm tracking-wider" style={{ color }}>
          {value}{unit}
        </span>
      </div>
      <div className="relative h-2 rounded-full bg-[#121212] border border-white/10">
        {/* Filled track */}
        <div
          className="absolute top-0 left-0 h-full rounded-full transition-all duration-150"
          style={{ width: `${pct}%`, background: `linear-gradient(90deg, #be123c, ${color})` }}
        />
        <input
          type="range"
          min={min}
          max={max}
          step={step}
          value={value}
          onChange={onChange}
          className="absolute inset-0 w-full opacity-0 cursor-pointer h-full z-10"
        />
        {/* Thumb */}
        <div
          className="absolute top-1/2 -translate-y-1/2 w-4 h-4 rounded-full border-2 shadow-lg transition-all duration-150 group-hover:scale-125"
          style={{
            left: `calc(${pct}% - 8px)`,
            borderColor: color,
            background: '#ffffff',
            boxShadow: `0 0 10px ${color}aa`,
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
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 font-poppins">

      {/* ── Page Header ─────────────────────────────────────── */}
      <div
        className="flex flex-wrap items-center justify-between gap-4"
        style={{
          opacity: mounted ? 1 : 0,
          transform: mounted ? 'translateY(0)' : 'translateY(16px)',
          transition: 'opacity 0.5s ease, transform 0.5s ease',
        }}
      >
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-crimson/10 border border-crimson/30 text-crimson text-xs font-bold tracking-widest uppercase mb-2">
            <span>TACTICAL ACOUSTIC TELEMETRY</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-calsans font-black text-white uppercase flex items-center gap-3">
            <Radio className="w-8 h-8 text-crimson" />
            Side-Scan Sonar Waterfall Console
          </h1>
          <p className="text-sm text-zinc-400 mt-1 max-w-2xl">
            Real-time acoustic despeckling (7x7 Lee Filter), YOLOv8s subsea target inference, and IHO S-44 shadow profiling.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <label className="btn-luxury-dark flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-calsans font-bold tracking-wider cursor-pointer transition-all hover:scale-105 active:scale-95">
            <Upload className="w-4 h-4 text-crimson" />
            <span>UPLOAD SSS FILE</span>
            <input type="file" accept="image/*" className="hidden" onChange={handleFileUpload} />
          </label>

          <button
            onClick={() => runDetection(selectedSample)}
            disabled={loading || !selectedSample}
            className="btn-crimson flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-calsans font-bold tracking-wider uppercase shadow-lg shadow-crimson/25 hover:shadow-crimson/40 hover:scale-105 active:scale-95 disabled:opacity-50 disabled:scale-100 transition-all"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            <span>{loading ? 'ANALYZING SWATH...' : 'REPROCESS SWATH'}</span>
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

      {/* ── Telemetry & Sliders Bar ────────────────────── */}
      <div
        className="rounded-[2rem] p-6 bg-[#1a1a1a] border border-white/10 shadow-xl grid grid-cols-1 md:grid-cols-4 gap-6"
        style={{
          opacity: mounted ? 1 : 0,
          transform: mounted ? 'translateY(0)' : 'translateY(12px)',
          transition: 'opacity 0.5s ease 0.15s, transform 0.5s ease 0.15s',
        }}
      >
        {/* Sample Swath Dropdown */}
        <div>
          <label className="block text-[11px] font-bold text-zinc-400 mb-2 flex items-center gap-1.5 tracking-wider uppercase">
            <FolderOpen className="w-3.5 h-3.5 text-crimson" />
            BENCHMARK SSS SWATH
          </label>
          <select
            value={selectedSample}
            onChange={handleSampleChange}
            className="w-full bg-[#121212] border border-white/10 rounded-xl px-3.5 py-2.5 text-xs font-poppins text-white focus:outline-none focus:border-crimson transition-colors duration-200 cursor-pointer"
          >
            {samples.map((s) => (
              <option key={s.filename} value={s.filename}>{s.display_title}</option>
            ))}
          </select>
        </div>

        <SonarSlider
          label="AI CONFIDENCE GATE"
          value={confThreshold}
          min={0.05} max={0.95} step={0.05}
          onChange={(e) => setConfThreshold(parseFloat(e.target.value))}
          color="#e11d48"
          unit=""
        />

        <SonarSlider
          label="AUV ALTITUDE (H)"
          value={altitudeM}
          min={5} max={30} step={1}
          onChange={(e) => setAltitudeM(parseFloat(e.target.value))}
          color="#e11d48"
          unit="m"
        />

        <SonarSlider
          label="SWATH RANGE (W)"
          value={swathWidthM}
          min={50} max={250} step={25}
          onChange={(e) => setSwathWidthM(parseFloat(e.target.value))}
          color="#e11d48"
          unit="m"
        />
      </div>

      {/* ── Error Banner ────────────────────────────────── */}
      {error && (
        <div className="p-4 rounded-xl bg-crimson/15 border border-crimson/40 text-xs font-poppins text-crimson-light flex items-center gap-2">
          <AlertTriangle className="w-4 h-4 text-crimson flex-shrink-0" />
          <span>Error processing sonar telemetry: {error}</span>
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
            <div className="transition-all duration-300">
              <DebrisCard
                detection={selectedDetection}
                onClose={() => setSelectedDetection(null)}
              />
            </div>
          ) : (
            <div className="rounded-[2.5rem] p-8 bg-[#1a1a1a] border border-white/10 text-center shadow-xl">
              <div className="relative mx-auto w-12 h-12 mb-4">
                <Compass className="w-12 h-12 text-zinc-600 mx-auto" />
              </div>
              <h4 className="font-calsans text-base font-bold text-white mb-2 uppercase">
                Select Anomaly to Inspect
              </h4>
              <p className="text-xs text-zinc-400 font-poppins leading-relaxed">
                Click on any highlighted anomaly pill in the waterfall viewer to inspect its shadow triangulation, WGS-84 coordinates, and MoES clearance protocols.
              </p>
            </div>
          )}

          {/* Acoustic Physics Reference Card */}
          <div className="rounded-[2rem] p-5 bg-[#1a1a1a] border border-white/10 font-poppins text-xs space-y-2.5 shadow-xl">
            <div className="flex items-center gap-2 text-xs font-calsans font-bold text-crimson tracking-wider uppercase mb-2">
              <Activity className="w-4 h-4" />
              <span>Acoustic Physics Grounding</span>
            </div>
            <div className="text-zinc-400 text-xs leading-relaxed space-y-2">
              <div className="flex items-start gap-2">
                <span className="text-crimson font-bold">•</span>
                <span><strong className="text-white">Ground Range Projection:</strong> G = √(R<sub>s</sub>² − H²)</span>
              </div>
              <div className="flex items-start gap-2">
                <span className="text-crimson font-bold">•</span>
                <span><strong className="text-white">Acoustic Shadow Height:</strong> h = (H · L<sub>s</sub>) / R<sub>s</sub></span>
              </div>
              <div className="flex items-start gap-2">
                <span className="text-crimson font-bold">•</span>
                <span><strong className="text-white">Adaptive Despeckling:</strong> 7×7 Lee filter local variance weighting W</span>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
