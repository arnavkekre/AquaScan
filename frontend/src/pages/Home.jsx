import React, { useEffect, useRef, useState } from 'react';
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
  Sparkles,
  ChevronRight,
} from 'lucide-react';
import { useScrollReveal } from '../hooks';

/* ─── Floating Bubble Particle ────────────────────────────── */
function Particle({ style }) {
  return <div className="particle" style={style} />;
}

/* ─── Sonar Ring set ──────────────────────────────────────── */
function SonarRings() {
  return (
    <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
      {[0, 1, 2].map((i) => (
        <span
          key={i}
          className="absolute rounded-full border border-sonar-cyan/20"
          style={{
            width:  `${160 + i * 120}px`,
            height: `${160 + i * 120}px`,
            animation: `sonarExpand ${2.8 + i * 0.6}s ease-out ${i * 0.9}s infinite`,
          }}
        />
      ))}
    </div>
  );
}

export default function Home() {
  const heroRef     = useRef(null);
  const pillarsRef  = useScrollReveal();
  const pipelineRef = useScrollReveal();
  const stakeRef    = useScrollReveal();

  /* Staggered hero text reveal on mount */
  const [heroVisible, setHeroVisible] = useState(false);
  useEffect(() => {
    const t = setTimeout(() => setHeroVisible(true), 80);
    return () => clearTimeout(t);
  }, []);

  /* Generate stable particles */
  const particles = useRef(
    Array.from({ length: 18 }, (_, i) => ({
      id: i,
      width:  `${3 + Math.random() * 5}px`,
      height: `${3 + Math.random() * 5}px`,
      left:   `${Math.random() * 100}%`,
      bottom: '-10px',
      '--drift': `${(Math.random() - 0.5) * 60}px`,
      animationDuration:  `${7 + Math.random() * 10}s`,
      animationDelay:     `${Math.random() * 8}s`,
      opacity:            `${0.3 + Math.random() * 0.5}`,
      background: i % 4 === 0 ? 'rgba(13,245,196,0.5)' : 'rgba(0,240,255,0.5)',
    }))
  ).current;

  const pillars = [
    {
      title: 'Acoustic Despeckling Engine',
      icon: Activity,
      color: 'text-sonar-teal',
      border: 'border-sonar-teal/30',
      bg: 'bg-sonar-teal/10',
      glow: 'rgba(13,245,196,0.15)',
      description: 'Variance-adaptive 7×7 Lee filter suppresses acoustic reverberation and sand ripples by 68%, combined with CLAHE dynamic range expansion to accentuate subtle shadow boundaries.'
    },
    {
      title: 'High-Recall Edge Detection',
      icon: Crosshair,
      color: 'text-sonar-cyan',
      border: 'border-sonar-cyan/30',
      bg: 'bg-sonar-cyan/10',
      glow: 'rgba(0,240,255,0.15)',
      description: 'Fine-tuned YOLOv8s sonar weights achieving 99.5% mAP50 and 1.000 recall on ghost fishing nets, deployed via ONNX Runtime on CPU (<20ms latency) without GPU dependencies.'
    },
    {
      title: 'Slant-Range Spatial Geotagging',
      icon: MapPin,
      color: 'text-emerald-400',
      border: 'border-emerald-500/30',
      bg: 'bg-emerald-500/10',
      glow: 'rgba(16,185,129,0.15)',
      description: 'Converts acoustic slant ranges (G = √(Rs² − H²)) into real-world WGS-84 coordinates and estimates 3D object elevation (h = H·Ls / Rs) directly from acoustic shadow geometry.'
    },
    {
      title: 'MoES Autonomous Clearance Protocol',
      icon: ShieldCheck,
      color: 'text-amber-400',
      border: 'border-amber-500/30',
      bg: 'bg-amber-500/10',
      glow: 'rgba(245,158,11,0.12)',
      description: 'Automates recovery vessel dispatching, ROV hydraulic cutter tasking, and generates IHO S-44 Order 1a compliant GeoJSON and CSV clearance logs for marine salvage crews.'
    }
  ];

  const pipelineSteps = [
    { step: '01', name: 'ACOUSTIC INGESTION',  desc: 'Raw SSS acoustic pings + AUV navigation telemetry (Lat, Lon, Alt, Depth, Heading)', color: '#00F0FF' },
    { step: '02', name: 'DESPECKLE & CLAHE',   desc: 'Adaptive 7×7 Lee filtering eliminates sand-ripple noise; CLAHE sharpens highlight shadows', color: '#0DF5C4' },
    { step: '03', name: 'ONNX EDGE INFERENCE', desc: 'YOLOv8s CPU forward pass detects ghost nets, pipelines, wrecks & mine cylinders in <20ms', color: '#8B5CF6' },
    { step: '04', name: 'SPATIAL GEOTAGGING',  desc: 'Slant-to-ground range geometry computes target WGS-84 coordinates and shadow elevation', color: '#10B981' },
    { step: '05', name: 'MISSION DISPATCH',    desc: 'Interactive hydrographic waterfall, GIS seafloor map, and RFC 7946 GeoJSON export', color: '#F59E0B' },
  ];

  const stakeholders = [
    { role: 'Ministry of Earth Sciences (MoES)',        impact: 'Real-time monitoring of seabed health, marine debris accumulation, and ecological clearance progress.', icon: '🌊' },
    { role: 'National Institute of Ocean Technology',   impact: 'Autonomous edge perception for deep-sea AUVs (Matsya-6000 & coastal crawlers) without cloud latency.', icon: '🤖' },
    { role: 'Indian Coast Guard & Indian Navy',         impact: 'Rapid identification of unexploded ordnance (mine cylinders) and navigational shipwreck hazards.', icon: '⚓' },
    { role: 'Fisheries & Marine Protected Areas (MPAs)',impact: 'Immediate geo-coordinates for ghost net recovery, preventing passive ecological devastation of marine fauna.', icon: '🐟' },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 lg:px-8 py-8 space-y-20">

      {/* ──────────────────────────────────────────────
          HERO SECTION
      ────────────────────────────────────────────── */}
      <div className="relative overflow-hidden rounded-3xl glass-panel-glow p-8 lg:p-14 border border-sonar-cyan/25" ref={heroRef}>

        {/* Animated floating particles */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {particles.map((p) => <Particle key={p.id} style={p} />)}
        </div>

        {/* Glow orbs */}
        <div className="glow-orb absolute -top-24 -right-24 w-96 h-96 rounded-full bg-sonar-cyan/15 pointer-events-none" />
        <div className="glow-orb absolute -bottom-24 left-1/3 w-80 h-80 rounded-full bg-sonar-teal/10 pointer-events-none" style={{ animationDelay: '3s' }} />
        <div className="glow-orb absolute top-1/2 -left-16 w-48 h-48 rounded-full bg-sonar-purple/10 pointer-events-none" style={{ animationDelay: '1.5s' }} />

        {/* Sonar rings (decorative) */}
        <div className="absolute right-12 top-1/2 -translate-y-1/2 opacity-40 pointer-events-none hidden lg:block">
          <SonarRings />
        </div>

        {/* Content */}
        <div className="relative z-10 max-w-3xl">
          {/* Badges */}
          <div
            className="flex flex-wrap items-center gap-2 mb-5"
            style={{
              opacity: heroVisible ? 1 : 0,
              transform: heroVisible ? 'translateY(0)' : 'translateY(16px)',
              transition: 'opacity 0.5s ease, transform 0.5s ease',
            }}
          >
            <span className="px-3 py-1 rounded-full bg-sonar-cyan/15 text-sonar-cyan border border-sonar-cyan/30 text-xs font-mono font-semibold tracking-wider uppercase hover:bg-sonar-cyan/25 transition-colors duration-300 cursor-default">
              Smart India Hackathon 2026 • PS SIH26057
            </span>
            <span className="px-3 py-1 rounded-full bg-ocean-800/80 text-slate-300 border border-ocean-700 text-xs font-mono hover:border-ocean-600 transition-colors duration-300 cursor-default">
              MoES / NIOT Marine Robotics
            </span>
          </div>

          {/* Main heading */}
          <h1
            className="text-3xl sm:text-5xl font-extrabold tracking-tight text-white mb-6 leading-tight"
            style={{
              opacity: heroVisible ? 1 : 0,
              transform: heroVisible ? 'translateY(0)' : 'translateY(22px)',
              transition: 'opacity 0.6s ease 0.1s, transform 0.6s ease 0.1s',
            }}
          >
            Intelligent Underwater<br />
            <span className="text-shimmer">Marine Debris Detection</span>
          </h1>

          {/* Subtext */}
          <p
            className="text-base sm:text-lg text-slate-300 leading-relaxed mb-8 max-w-2xl"
            style={{
              opacity: heroVisible ? 1 : 0,
              transform: heroVisible ? 'translateY(0)' : 'translateY(20px)',
              transition: 'opacity 0.6s ease 0.2s, transform 0.6s ease 0.2s',
            }}
          >
            An edge-deployable acoustic intelligence system for Side-Scan Sonar (SSS).
            Combines <strong className="text-white">7×7 Lee variance despeckling</strong>, <strong className="text-white">YOLOv8s ONNX inference</strong> (99.5% mAP on ghost nets),
            and <strong className="text-white">Pythagorean slant-range geotagging</strong> to localize subsea hazards in real time.
          </p>

          {/* CTA Buttons */}
          <div
            className="flex flex-wrap items-center gap-4"
            style={{
              opacity: heroVisible ? 1 : 0,
              transform: heroVisible ? 'translateY(0)' : 'translateY(20px)',
              transition: 'opacity 0.6s ease 0.3s, transform 0.6s ease 0.3s',
            }}
          >
            <Link
              to="/console"
              className="btn-shimmer group flex items-center gap-2 px-6 py-3 rounded-xl bg-sonar-cyan text-ocean-950 font-bold text-sm hover:bg-sonar-teal transition-all duration-300 shadow-lg shadow-sonar-cyan/30 hover:shadow-sonar-cyan/50 hover:scale-105 active:scale-95"
            >
              <Waves className="w-4 h-4 group-hover:animate-pulse" />
              <span>Launch Waterfall Console</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-300" />
            </Link>

            <Link
              to="/map"
              className="group flex items-center gap-2 px-6 py-3 rounded-xl bg-ocean-900/80 border border-ocean-700 text-slate-200 font-semibold text-sm hover:border-sonar-cyan/50 hover:text-white hover:bg-ocean-800/80 transition-all duration-300 hover:scale-105 active:scale-95 hover:shadow-md hover:shadow-sonar-cyan/10"
            >
              <MapPin className="w-4 h-4 text-sonar-cyan group-hover:scale-110 transition-transform duration-300" />
              <span>Explore Seafloor GIS Map</span>
            </Link>

            <Link
              to="/reports"
              className="flex items-center gap-2 px-6 py-3 rounded-xl bg-ocean-900/40 border border-ocean-800 text-slate-400 font-semibold text-sm hover:text-slate-200 hover:border-ocean-700 transition-all duration-300 hover:scale-105 active:scale-95"
            >
              <FileSpreadsheet className="w-4 h-4" />
              <span>Clearance Reports</span>
            </Link>
          </div>
        </div>
      </div>

      {/* ──────────────────────────────────────────────
          4 TECHNOLOGY PILLARS
      ────────────────────────────────────────────── */}
      <div ref={pillarsRef}>
        <div className="text-center max-w-2xl mx-auto mb-12 reveal" data-delay="0">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-sonar-cyan/10 border border-sonar-cyan/20 text-sonar-cyan text-xs font-mono font-semibold mb-4 tracking-wider">
            <Sparkles className="w-3 h-3" />
            CORE TECHNOLOGY
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold text-white mb-3">
            The 4 Technological Pillars
          </h2>
          <p className="text-sm text-slate-400 leading-relaxed">
            Engineered to overcome acoustic speckle noise, seabed reverberation, and deep-sea computational constraints.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {pillars.map((pillar, i) => {
            const Icon = pillar.icon;
            return (
              <div
                key={i}
                className={`reveal glass-panel rounded-2xl p-6 border border-ocean-800 group cursor-default`}
                data-delay={i * 120}
                style={{ '--glow': pillar.glow }}
              >
                <div className="flex items-start gap-4">
                  <div
                    className={`p-3 rounded-xl ${pillar.bg} ${pillar.color} ${pillar.border} border flex-shrink-0 transition-all duration-400 group-hover:scale-110 group-hover:rotate-3`}
                    style={{ boxShadow: `0 0 0 0 ${pillar.glow}`, transition: 'box-shadow 0.4s ease, transform 0.3s ease' }}
                    onMouseEnter={(e) => e.currentTarget.style.boxShadow = `0 0 20px 4px ${pillar.glow}`}
                    onMouseLeave={(e) => e.currentTarget.style.boxShadow = `0 0 0 0 ${pillar.glow}`}
                  >
                    <Icon className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className={`font-mono text-base font-bold text-white mb-2 group-hover:${pillar.color} transition-colors duration-300`}>
                      {pillar.title}
                    </h3>
                    <p className="text-sm text-slate-400 leading-relaxed">
                      {pillar.description}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* ──────────────────────────────────────────────
          PROCESSING PIPELINE
      ────────────────────────────────────────────── */}
      <div ref={pipelineRef}>
        <div className="glass-panel rounded-3xl p-8 lg:p-10 border border-ocean-800 overflow-hidden relative">
          {/* Background decoration */}
          <div className="absolute inset-0 opacity-[0.03] pointer-events-none"
            style={{ backgroundImage: 'radial-gradient(circle at 20% 80%, #00F0FF 0%, transparent 50%), radial-gradient(circle at 80% 20%, #0DF5C4 0%, transparent 50%)' }}
          />

          <div className="reveal relative z-10 flex flex-wrap items-start justify-between gap-4 mb-10" data-delay="0">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-sonar-teal/10 border border-sonar-teal/20 text-sonar-teal text-xs font-mono font-semibold mb-3 tracking-wider">
                <Activity className="w-3 h-3" />
                PIPELINE ARCHITECTURE
              </div>
              <h2 className="text-xl sm:text-2xl font-bold text-white">
                End-to-End Processing Architecture
              </h2>
              <p className="text-sm text-slate-400 mt-1">
                Deterministic real-time pipeline from acoustic transducer ping to recovery dispatch.
              </p>
            </div>
            <span className="hidden sm:inline font-mono text-xs px-3 py-1.5 rounded-lg bg-sonar-cyan/10 border border-sonar-cyan/20 text-sonar-cyan tracking-wider">
              TOTAL LATENCY &lt; 25MS
            </span>
          </div>

          {/* Steps */}
          <div className="grid grid-cols-1 sm:grid-cols-5 gap-0 relative z-10">
            {pipelineSteps.map((step, i) => (
              <React.Fragment key={i}>
                <div
                  className="reveal p-5 rounded-xl bg-ocean-950/70 border border-ocean-800 relative flex flex-col justify-between group hover:border-opacity-60 transition-all duration-400 hover:-translate-y-1"
                  data-delay={80 + i * 100}
                  style={{ '--step-color': step.color }}
                  onMouseEnter={(e) => e.currentTarget.style.borderColor = step.color + '55'}
                  onMouseLeave={(e) => e.currentTarget.style.borderColor = ''}
                >
                  {/* Step number */}
                  <div
                    className="text-sm font-mono font-bold mb-3 transition-all duration-300 group-hover:scale-110 inline-block"
                    style={{ color: step.color }}
                  >
                    {step.step}
                  </div>
                  <div>
                    <div className="text-xs font-mono font-bold text-white mb-1.5 group-hover:text-slate-100 transition-colors duration-300">
                      {step.name}
                    </div>
                    <div className="text-[11px] text-slate-400 leading-snug group-hover:text-slate-300 transition-colors duration-300">
                      {step.desc}
                    </div>
                  </div>

                  {/* Bottom accent line */}
                  <div
                    className="absolute bottom-0 left-0 right-0 h-0.5 rounded-b-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                    style={{ background: `linear-gradient(90deg, transparent, ${step.color}88, transparent)` }}
                  />
                </div>

                {/* Animated connector between steps */}
                {i < pipelineSteps.length - 1 && (
                  <div className="hidden sm:flex items-center justify-center -mx-2 z-10 relative">
                    <div className="pipeline-line w-full" style={{ background: `linear-gradient(90deg, transparent, ${step.color}66, ${pipelineSteps[i+1].color}66, transparent)` }} />
                  </div>
                )}
              </React.Fragment>
            ))}
          </div>
        </div>
      </div>

      {/* ──────────────────────────────────────────────
          STAKEHOLDERS
      ────────────────────────────────────────────── */}
      <div ref={stakeRef} className="pb-4">
        <div className="text-center max-w-2xl mx-auto mb-12 reveal" data-delay="0">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-mono font-semibold mb-4 tracking-wider">
            <Ship className="w-3 h-3" />
            STAKEHOLDERS & IMPACT
          </div>
          <h2 className="text-xl sm:text-2xl font-bold text-white mb-2">
            Target Stakeholders & Operational Value
          </h2>
          <p className="text-sm text-slate-400">
            Delivering mission-critical intelligence across scientific, defense, and environmental sectors.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {stakeholders.map((s, i) => (
            <div
              key={i}
              className="reveal glass-panel rounded-2xl p-6 border border-ocean-800 flex flex-col justify-between group hover:-translate-y-1 cursor-default"
              data-delay={i * 100}
            >
              <div>
                <div className="text-2xl mb-3 group-hover:scale-110 transition-transform duration-300 inline-block">
                  {s.icon}
                </div>
                <div className="flex items-start gap-2 mb-3">
                  <CheckCircle2 className="w-4 h-4 text-sonar-cyan flex-shrink-0 mt-0.5 group-hover:scale-110 transition-transform duration-300" />
                  <h4 className="font-mono text-xs font-bold text-white leading-snug group-hover:text-sonar-cyan transition-colors duration-300">
                    {s.role}
                  </h4>
                </div>
                <p className="text-xs text-slate-400 leading-relaxed group-hover:text-slate-300 transition-colors duration-300">
                  {s.impact}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}
