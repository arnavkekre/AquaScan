import React from 'react';
import { Link } from 'react-router-dom';
import { 
  Waves, 
  ShieldCheck, 
  Cpu, 
  ArrowRight, 
  Layers, 
  Crosshair, 
  MapPin, 
  FileSpreadsheet, 
  Activity, 
  Compass, 
  CheckCircle2,
  AlertTriangle,
  Anchor,
  Ship,
  Sparkles
} from 'lucide-react';

export default function Home() {
  const pillars = [
    {
      title: 'Acoustic Despeckling Engine',
      icon: Activity,
      color: 'text-sonar-teal',
      border: 'border-sonar-teal/30',
      bg: 'bg-sonar-teal/10',
      description: 'Variance-adaptive 7x7 Lee filter suppresses acoustic reverberation and sand ripples by 68%, combined with CLAHE dynamic range expansion to accentuate subtle shadow boundaries.'
    },
    {
      title: 'High-Recall Edge Detection',
      icon: Crosshair,
      color: 'text-sonar-cyan',
      border: 'border-sonar-cyan/30',
      bg: 'bg-sonar-cyan/10',
      description: 'Fine-tuned YOLOv8s sonar weights achieving 99.5% mAP50 and 1.000 recall on ghost fishing nets, deployed via ONNX Runtime on CPU (<20ms latency) without GPU dependencies.'
    },
    {
      title: 'Slant-Range Spatial Geotagging',
      icon: MapPin,
      color: 'text-emerald-400',
      border: 'border-emerald-500/30',
      bg: 'bg-emerald-500/10',
      description: 'Converts acoustic slant ranges (G = √(Rs² - H²)) into real-world WGS-84 coordinates and estimates 3D object elevation (h = H·Ls / Rs) directly from acoustic shadow geometry.'
    },
    {
      title: 'MoES Autonomous Clearance Protocol',
      icon: ShieldCheck,
      color: 'text-amber-400',
      border: 'border-amber-500/30',
      bg: 'bg-amber-500/10',
      description: 'Automates recovery vessel dispatching, ROV hydraulic cutter tasking, and generates IHO S-44 Order 1a compliant GeoJSON and CSV clearance logs for marine salvage crews.'
    }
  ];

  const pipelineSteps = [
    {
      step: '01',
      name: 'ACOUSTIC INGESTION',
      desc: 'Raw SSS acoustic pings + AUV navigation telemetry (Lat, Lon, Alt, Depth, Heading)'
    },
    {
      step: '02',
      name: 'DESPECKLE & CLAHE',
      desc: 'Adaptive 7x7 Lee filtering eliminates sand-ripple noise; CLAHE sharpens highlight shadows'
    },
    {
      step: '03',
      name: 'ONNX EDGE INFERENCE',
      desc: 'YOLOv8s CPU forward pass detects ghost nets, pipelines, wrecks, and mine cylinders in <20ms'
    },
    {
      step: '04',
      name: 'SPATIAL GEOTAGGING',
      desc: 'Slant-to-ground range geometry computes target WGS-84 coordinates and shadow elevation'
    },
    {
      step: '05',
      name: 'MISSION DISPATCH',
      desc: 'Interactive hydrographic waterfall, GIS seafloor map, and RFC 7946 GeoJSON export'
    }
  ];

  const stakeholders = [
    {
      role: 'Ministry of Earth Sciences (MoES)',
      impact: 'Real-time monitoring of seabed health, marine debris accumulation, and ecological clearance progress.'
    },
    {
      role: 'National Institute of Ocean Technology (NIOT)',
      impact: 'Autonomous edge perception for deep-sea AUVs (Matsya-6000 & coastal crawlers) without cloud latency.'
    },
    {
      role: 'Indian Coast Guard & Indian Navy',
      impact: 'Rapid identification of unexploded ordnance (mine cylinders) and navigational shipwreck hazards.'
    },
    {
      role: 'Fisheries & Marine Protected Areas (MPAs)',
      impact: 'Immediate geo-coordinates for ghost net recovery, preventing passive ecological devastation of marine fauna.'
    }
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 lg:px-8 py-8 space-y-16">
      
      {/* Hero Section */}
      <div className="relative overflow-hidden rounded-3xl glass-panel-glow p-8 lg:p-12 border border-sonar-cyan/30">
        <div className="absolute top-0 right-0 -mr-24 -mt-24 w-96 h-96 rounded-full bg-sonar-cyan/10 blur-3xl pointer-events-none"></div>
        <div className="absolute bottom-0 left-1/3 -mb-24 w-80 h-80 rounded-full bg-sonar-teal/10 blur-3xl pointer-events-none"></div>

        <div className="relative z-10 max-w-3xl">
          <div className="flex flex-wrap items-center gap-2 mb-4">
            <span className="px-3 py-1 rounded-full bg-sonar-cyan/15 text-sonar-cyan border border-sonar-cyan/30 text-xs font-mono font-semibold tracking-wider uppercase">
              Smart India Hackathon 2026 • PS SIH26057
            </span>
            <span className="px-3 py-1 rounded-full bg-ocean-800/80 text-slate-300 border border-ocean-700 text-xs font-mono">
              MoES / NIOT Marine Robotics
            </span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-white mb-6 leading-tight">
            AI-Powered Underwater <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-sonar-cyan via-sonar-teal to-emerald-400">
              Marine Debris & Anomaly Detection
            </span>
          </h1>

          <p className="text-base sm:text-lg text-slate-300 leading-relaxed mb-8">
            An edge-deployable acoustic intelligence system for Side-Scan Sonar (SSS). 
            Combines <strong>7x7 Lee variance despeckling</strong>, <strong>YOLOv8s ONNX inference</strong> (99.5% mAP on ghost nets), 
            and <strong>Pythagorean slant-range geotagging</strong> to localize subsea hazards in real time.
          </p>

          <div className="flex flex-wrap items-center gap-4">
            <Link
              to="/console"
              className="flex items-center gap-2 px-6 py-3 rounded-xl bg-sonar-cyan text-ocean-950 font-bold text-sm hover:bg-sonar-teal transition-all shadow-lg shadow-sonar-cyan/25"
            >
              <Waves className="w-4 h-4" />
              <span>Launch Waterfall Console</span>
              <ArrowRight className="w-4 h-4" />
            </Link>

            <Link
              to="/map"
              className="flex items-center gap-2 px-6 py-3 rounded-xl bg-ocean-900 border border-ocean-700 text-slate-200 font-semibold text-sm hover:border-sonar-cyan/50 hover:text-white transition-all"
            >
              <MapPin className="w-4 h-4 text-sonar-cyan" />
              <span>Explore Seafloor GIS Map</span>
            </Link>

            <Link
              to="/reports"
              className="flex items-center gap-2 px-6 py-3 rounded-xl bg-ocean-900/60 border border-ocean-800 text-slate-400 font-semibold text-sm hover:text-slate-200 transition-all"
            >
              <FileSpreadsheet className="w-4 h-4" />
              <span>Mission Clearance Reports</span>
            </Link>
          </div>
        </div>
      </div>

      {/* The 4 Marine Intelligence Pillars */}
      <div>
        <div className="text-center max-w-2xl mx-auto mb-10">
          <h2 className="text-2xl sm:text-3xl font-mono font-bold text-white mb-3">
            The 4 Technological Pillars
          </h2>
          <p className="text-xs sm:text-sm text-slate-400">
            Engineered to overcome acoustic speckle noise, seabed reverberation, and deep-sea computational constraints.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {pillars.map((pillar, i) => {
            const Icon = pillar.icon;
            return (
              <div 
                key={i} 
                className="glass-panel rounded-2xl p-6 border border-ocean-800 hover:border-ocean-700 transition-all group"
              >
                <div className="flex items-start gap-4">
                  <div className={`p-3 rounded-xl ${pillar.bg} ${pillar.color} ${pillar.border} border flex-shrink-0 group-hover:scale-110 transition-transform`}>
                    <Icon className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="font-mono text-base font-bold text-white mb-2 group-hover:text-sonar-cyan transition-colors">
                      {pillar.title}
                    </h3>
                    <p className="text-xs text-slate-400 leading-relaxed">
                      {pillar.description}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 5-Stage Acoustic Intelligence Pipeline */}
      <div className="glass-panel rounded-3xl p-8 border border-ocean-800">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-xl sm:text-2xl font-mono font-bold text-white">
              End-to-End Processing Architecture
            </h2>
            <p className="text-xs text-slate-400 mt-1">
              Deterministic real-time pipeline executing from acoustic transducer ping to recovery dispatch.
            </p>
          </div>
          <span className="hidden sm:inline font-mono text-xs px-3 py-1 rounded bg-ocean-900 border border-ocean-800 text-slate-400">
            TOTAL LATENCY &lt; 25MS
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-5 gap-3">
          {pipelineSteps.map((step, i) => (
            <div 
              key={i} 
              className="p-4 rounded-xl bg-ocean-950/70 border border-ocean-800 relative flex flex-col justify-between"
            >
              <div className="text-xs font-mono font-bold text-sonar-cyan mb-2">
                {step.step}
              </div>
              <div>
                <div className="text-xs font-mono font-bold text-white mb-1">
                  {step.name}
                </div>
                <div className="text-[11px] text-slate-400 leading-snug">
                  {step.desc}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Stakeholders & Impact Matrix */}
      <div>
        <div className="text-center max-w-2xl mx-auto mb-8">
          <h2 className="text-xl sm:text-2xl font-mono font-bold text-white mb-2">
            Target Stakeholders & Operational Value
          </h2>
          <p className="text-xs text-slate-400">
            Delivering mission-critical intelligence across scientific, defense, and environmental sectors.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {stakeholders.map((s, i) => (
            <div key={i} className="p-5 rounded-2xl glass-panel border border-ocean-800 flex flex-col justify-between">
              <div className="flex items-center gap-2 mb-3">
                <CheckCircle2 className="w-4 h-4 text-sonar-cyan flex-shrink-0" />
                <h4 className="font-mono text-xs font-bold text-white">
                  {s.role}
                </h4>
              </div>
              <p className="text-xs text-slate-400 leading-relaxed">
                {s.impact}
              </p>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}
