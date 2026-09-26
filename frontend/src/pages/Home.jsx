import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  ArrowUpRight, 
  ChevronDown, 
  ShieldCheck, 
  Cpu, 
  Layers, 
  Crosshair, 
  Compass, 
  CheckCircle2, 
  AlertOctagon,
  Anchor,
  Ship,
  Sparkles,
  ArrowRight,
  Radio,
  Sliders,
  FileCheck,
  ExternalLink,
  Code2,
  Database,
  Radar,
  Activity,
  Terminal,
  Waves
} from 'lucide-react';

// ── Procedural High-Fidelity Side-Scan Sonar Echogram Renderer ──
function SonarCompareView({ caseId, isAnnotated, item }) {
  // Color palette: authentic side-scan sonar acoustic copper & monochrome
  const rippleColor = isAnnotated ? 'rgba(255, 255, 255, 0.06)' : 'rgba(210, 160, 110, 0.09)';
  const highlightColor = isAnnotated ? '#ffffff' : '#fef0d2';
  const shadowColor = '#050506';

  return (
    <div className="relative w-full h-full overflow-hidden select-none bg-[#0d0d0f]">
      <svg 
        viewBox="0 0 400 240" 
        preserveAspectRatio="none" 
        className="w-full h-full block"
      >
        <defs>
          {/* Subtle noise filter for raw reverberation */}
          {!isAnnotated && (
            <filter id={`noise-${caseId}`} x="0%" y="0%" width="100%" height="100%">
              <feTurbulence type="fractalNoise" baseFrequency="0.65" numOctaves="3" result="noise" />
              <feColorMatrix type="matrix" values="0 0 0 0 0.8   0 0 0 0 0.65   0 0 0 0 0.45  0 0 0 0.18 0" />
              <feBlend mode="screen" in="SourceGraphic" result="blend" />
            </filter>
          )}

          {/* Linear gradient for sediment backscatter falloff from nadir */}
          <linearGradient id={`swathGrad-${caseId}-${isAnnotated ? 'ai' : 'raw'}`} x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#08080a" />
            <stop offset="6%" stopColor="#0c0a08" />
            <stop offset="8%" stopColor={isAnnotated ? '#404048' : '#685038'} />
            <stop offset="12%" stopColor={isAnnotated ? '#222226' : '#32251c'} />
            <stop offset="45%" stopColor={isAnnotated ? '#1a1a1e' : '#251b14'} />
            <stop offset="100%" stopColor={isAnnotated ? '#121215' : '#18120e'} />
          </linearGradient>

          {/* Specular highlight gradient for hard targets */}
          <linearGradient id={`specular-${caseId}`} x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#ffffff" stopOpacity="1" />
            <stop offset="70%" stopColor={highlightColor} stopOpacity="0.85" />
            <stop offset="100%" stopColor={highlightColor} stopOpacity="0.4" />
          </linearGradient>
        </defs>

        {/* 1. Base Sonar Swath Background */}
        <rect width="400" height="240" fill={`url(#swathGrad-${caseId}-${isAnnotated ? 'ai' : 'raw'})`} />

        {/* 2. Acoustic Nadir Channel (Water column blind zone before 1st bottom return) */}
        <rect x="0" y="0" width="28" height="240" fill="#060608" />
        <line x1="28" y1="0" x2="28" y2="240" stroke={isAnnotated ? '#6b7280' : '#d97706'} strokeWidth="1.5" strokeDasharray="6 2" opacity="0.8" />

        {/* 3. Seafloor Sand / Sediment Bedform Ripples */}
        <g stroke={rippleColor} strokeWidth="1.2" fill="none">
          <path d="M 30 25 Q 120 20 220 28 T 400 22" />
          <path d="M 30 48 Q 140 54 260 46 T 400 52" />
          <path d="M 30 72 Q 110 68 230 76 T 400 70" />
          <path d="M 30 95 Q 150 102 270 93 T 400 98" />
          <path d="M 30 118 Q 130 112 240 122 T 400 116" />
          <path d="M 30 142 Q 160 148 280 139 T 400 145" />
          <path d="M 30 165 Q 120 160 250 169 T 400 163" />
          <path d="M 30 188 Q 150 195 270 186 T 400 192" />
          <path d="M 30 212 Q 130 206 240 216 T 400 210" />
          <path d="M 30 232 Q 160 238 290 229 T 400 235" />
        </g>

        {/* 4. Fine Grain Acoustic Scanlines Raster */}
        <g opacity={isAnnotated ? "0.15" : "0.35"}>
          {Array.from({ length: 48 }).map((_, i) => (
            <line 
              key={i} 
              x1="28" 
              y1={i * 5} 
              x2="400" 
              y2={i * 5} 
              stroke={i % 2 === 0 ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.25)"} 
              strokeWidth="0.8" 
            />
          ))}
        </g>

        {/* 5. Case-Specific Acoustic Targets & 3D Acoustic Shadows */}
        {caseId === 1 && (
          /* CASE 1: 40ft Submerged ISO Shipping Container & Scrap Debris */
          <g>
            {/* Scour mark depression around container */}
            <ellipse cx="160" cy="115" rx="55" ry="32" fill="rgba(0,0,0,0.3)" />

            {/* Jet-black 3D Acoustic Shadow cast away from nadir */}
            <polygon 
              points="160,92 275,76 292,142 160,126" 
              fill={shadowColor} 
              opacity="0.96" 
            />

            {/* Container High-Reflectivity Metallic Face */}
            <rect 
              x="108" 
              y="92" 
              width="54" 
              height="34" 
              rx="1.5" 
              fill={`url(#specular-${caseId})`} 
              stroke="#ffffff" 
              strokeWidth="1.2" 
            />

            {/* Corrugated Vertical Ribs (High-Frequency Reflection Peaks) */}
            <g stroke="#ffffff" strokeWidth="1.2" opacity="0.9">
              <line x1="116" y1="92" x2="116" y2="126" />
              <line x1="124" y1="92" x2="124" y2="126" />
              <line x1="132" y1="92" x2="132" y2="126" />
              <line x1="140" y1="92" x2="140" y2="126" />
              <line x1="148" y1="92" x2="148" y2="126" />
              <line x1="156" y1="92" x2="156" y2="126" />
            </g>

            {/* Bright Specular Acoustic Edge Facing Transducer */}
            <line x1="108" y1="92" x2="108" y2="126" stroke="#ffffff" strokeWidth="2.5" />

            {/* Scattered Scrap Metal Debris with micro-shadows */}
            <g fill={highlightColor}>
              <circle cx="85" cy="148" r="2.5" />
              <line x1="87" y1="148" x2="108" y2="150" stroke={shadowColor} strokeWidth="3" />

              <circle cx="185" cy="62" r="2" />
              <line x1="187" y1="62" x2="208" y2="61" stroke={shadowColor} strokeWidth="2.5" />

              <rect x="94" y="68" width="5" height="3" />
              <line x1="99" y1="69" x2="122" y2="69" stroke={shadowColor} strokeWidth="3" />
            </g>

            {/* Raw Reverb / Speckle Multiplier for Raw View */}
            {!isAnnotated && (
              <g opacity="0.35" fill="rgba(255,255,255,0.7)">
                <circle cx="130" cy="100" r="1.5" />
                <circle cx="145" cy="115" r="1.2" />
                <circle cx="210" cy="88" r="1.8" />
                <circle cx="240" cy="130" r="1" />
                <circle cx="70" cy="110" r="1.4" />
              </g>
            )}
          </g>
        )}

        {caseId === 2 && (
          /* CASE 2: Subsea Effluent Pipeline with Critical Free-Span Suspension */
          <g>
            {/* Scour Erosion Trench Beneath Suspended Free-Span */}
            <ellipse cx="205" cy="145" rx="68" ry="24" fill="rgba(0,0,0,0.45)" />

            {/* Offset Acoustic Shadow Beneath Suspended Segment */}
            <path 
              d="M 140 148 C 175 168, 235 162, 275 125" 
              stroke={shadowColor} 
              strokeWidth="9" 
              strokeLinecap="round" 
              fill="none" 
            />

            {/* Resting Pipe Acoustic Shadow on Grounded Ends */}
            <path 
              d="M 10 184 L 140 148" 
              stroke={shadowColor} 
              strokeWidth="6" 
              fill="none" 
            />
            <path 
              d="M 275 125 L 390 92" 
              stroke={shadowColor} 
              strokeWidth="6" 
              fill="none" 
            />

            {/* Continuous Tubular Pipeline Specular Reflection */}
            <path 
              d="M 0 178 C 120 152, 250 124, 400 85" 
              stroke={isAnnotated ? "#e2e8f0" : "#d4d4d8"} 
              strokeWidth="7" 
              strokeLinecap="round" 
              fill="none" 
            />
            {/* Specular White Centerline Ridge */}
            <path 
              d="M 0 178 C 120 152, 250 124, 400 85" 
              stroke="#ffffff" 
              strokeWidth="2.5" 
              strokeLinecap="round" 
              fill="none" 
            />

            {/* Circumferential Weld Joints every 50px */}
            <g stroke={isAnnotated ? "#38bdf8" : "#fef08a"} strokeWidth="2">
              <line x1="72" y1="169" x2="68" y2="157" />
              <line x1="138" y1="154" x2="134" y2="142" />
              <line x1="205" y1="139" x2="201" y2="127" />
              <line x1="272" y1="123" x2="268" y2="111" />
              <line x1="338" y1="107" x2="334" y2="95" />
            </g>

            {/* Warning Indicator Over Free-Span for AI Annotated View */}
            {isAnnotated && (
              <path 
                d="M 138 148 C 175 140, 235 130, 272 117" 
                stroke="#e11d48" 
                strokeWidth="3" 
                strokeDasharray="4 3" 
                fill="none" 
              />
            )}
          </g>
        )}

        {caseId === 3 && (
          /* CASE 3: Sunken Trawler Chassis & Billowing Ghost Netting */
          <g>
            {/* Sunken Ship Hull Silhouette Shadow */}
            <polygon 
              points="120,95 285,68 310,154 175,138" 
              fill={shadowColor} 
              opacity="0.95" 
            />

            {/* Wooden/Steel Vessel Chassis Hull Backscatter */}
            <path 
              d="M 75 125 C 95 86, 150 90, 205 118 C 185 148, 120 152, 75 125 Z" 
              fill={isAnnotated ? "#94a3b8" : "#a88c6e"} 
              stroke="#ffffff" 
              strokeWidth="1.5" 
            />

            {/* Skeleton Hull Ribs (Periodic Internal Reflections) */}
            <g stroke="#ffffff" strokeWidth="1.2" opacity="0.85">
              <line x1="102" y1="105" x2="112" y2="138" />
              <line x1="122" y1="98" x2="134" y2="144" />
              <line x1="142" y1="96" x2="155" y2="142" />
              <line x1="162" y1="98" x2="174" y2="136" />
              <line x1="182" y1="106" x2="190" y2="128" />
            </g>

            {/* Entangled Synthetic Monofilament Ghost Netting Cloud */}
            <g>
              {/* Diffuse Net Filament Webbing */}
              <path 
                d="M 155 92 Q 185 58 220 72 T 265 60 T 290 85 Q 250 115 195 110 Z" 
                fill={isAnnotated ? "rgba(225, 29, 72, 0.22)" : "rgba(255, 255, 255, 0.14)"} 
                stroke={isAnnotated ? "#e11d48" : "#cbd5e1"} 
                strokeWidth="1" 
                strokeDasharray="4 2" 
              />
              <path 
                d="M 170 78 Q 205 65 240 78 T 280 75" 
                stroke="#ffffff" 
                strokeWidth="1" 
                fill="none" 
              />
              <path 
                d="M 185 92 Q 220 75 255 90 T 295 90" 
                stroke="#ffffff" 
                strokeWidth="0.8" 
                fill="none" 
              />
              <path 
                d="M 160 85 Q 190 105 230 95 T 275 105" 
                stroke="#ffffff" 
                strokeWidth="0.8" 
                fill="none" 
              />

              {/* High-Reflectivity Buoy / Float Clustered Returns */}
              <circle cx="172" cy="72" r="3" fill="#ffffff" />
              <circle cx="196" cy="62" r="3.5" fill="#ffffff" />
              <circle cx="224" cy="66" r="3" fill="#ffffff" />
              <circle cx="248" cy="74" r="3" fill="#ffffff" />
              <circle cx="270" cy="85" r="2.5" fill="#ffffff" />
            </g>
          </g>
        )}

        {/* 6. AI ANNOTATION HUD OVERLAY (Only when isAnnotated === true) */}
        {isAnnotated && (
          <g>
            {/* Container Bounding Box */}
            {caseId === 1 && (
              <g>
                <rect 
                  x="100" 
                  y="82" 
                  width="185" 
                  height="65" 
                  rx="6" 
                  fill="rgba(225, 29, 72, 0.12)" 
                  stroke="#e11d48" 
                  strokeWidth="1.8" 
                />
                {/* Precision Corner Brackets */}
                <path d="M 96 92 L 96 78 L 110 78" stroke="#ffffff" strokeWidth="2.5" fill="none" />
                <path d="M 275 78 L 289 78 L 289 92" stroke="#ffffff" strokeWidth="2.5" fill="none" />
                <path d="M 96 137 L 96 151 L 110 151" stroke="#ffffff" strokeWidth="2.5" fill="none" />
                <path d="M 275 151 L 289 151 L 289 137" stroke="#ffffff" strokeWidth="2.5" fill="none" />
                
                {/* Target Center Crosshair */}
                <circle cx="140" cy="110" r="5" stroke="#e11d48" strokeWidth="1.5" fill="none" />
                <line x1="132" y1="110" x2="148" y2="110" stroke="#e11d48" strokeWidth="1.5" />
                <line x1="140" y1="102" x2="140" y2="118" stroke="#e11d48" strokeWidth="1.5" />
              </g>
            )}

            {/* Pipeline Free-Span Bounding Box */}
            {caseId === 2 && (
              <g>
                <rect 
                  x="125" 
                  y="110" 
                  width="160" 
                  height="75" 
                  rx="6" 
                  fill="rgba(225, 29, 72, 0.12)" 
                  stroke="#e11d48" 
                  strokeWidth="1.8" 
                />
                <path d="M 121 120 L 121 106 L 135 106" stroke="#ffffff" strokeWidth="2.5" fill="none" />
                <path d="M 275 106 L 289 106 L 289 120" stroke="#ffffff" strokeWidth="2.5" fill="none" />
                <path d="M 121 175 L 121 189 L 135 189" stroke="#ffffff" strokeWidth="2.5" fill="none" />
                <path d="M 275 189 L 289 189 L 289 175" stroke="#ffffff" strokeWidth="2.5" fill="none" />

                <circle cx="205" cy="148" r="5" stroke="#e11d48" strokeWidth="1.5" fill="none" />
                <line x1="197" y1="148" x2="213" y2="148" stroke="#e11d48" strokeWidth="1.5" />
                <line x1="205" y1="140" x2="205" y2="156" stroke="#e11d48" strokeWidth="1.5" />
              </g>
            )}

            {/* Ghost Netting Bounding Box */}
            {caseId === 3 && (
              <g>
                <rect 
                  x="145" 
                  y="52" 
                  width="155" 
                  height="72" 
                  rx="6" 
                  fill="rgba(225, 29, 72, 0.14)" 
                  stroke="#e11d48" 
                  strokeWidth="1.8" 
                />
                <path d="M 141 62 L 141 48 L 155 48" stroke="#ffffff" strokeWidth="2.5" fill="none" />
                <path d="M 290 48 L 304 48 L 304 62" stroke="#ffffff" strokeWidth="2.5" fill="none" />
                <path d="M 141 114 L 141 128 L 155 128" stroke="#ffffff" strokeWidth="2.5" fill="none" />
                <path d="M 290 128 L 304 128 L 304 114" stroke="#ffffff" strokeWidth="2.5" fill="none" />

                <circle cx="225" cy="80" r="5" stroke="#e11d48" strokeWidth="1.5" fill="none" />
                <line x1="217" y1="80" x2="233" y2="80" stroke="#e11d48" strokeWidth="1.5" />
                <line x1="225" y1="72" x2="225" y2="88" stroke="#e11d48" strokeWidth="1.5" />
              </g>
            )}
          </g>
        )}
      </svg>

      {/* Top Left/Right Mode Badge */}
      <div className={`text-[10px] font-mono tracking-widest px-2.5 py-1 rounded backdrop-blur-md absolute top-3 ${
        isAnnotated 
          ? 'right-3 bg-black/85 text-crimson font-bold border border-crimson/50' 
          : 'left-3 bg-black/80 text-zinc-300 border border-white/20'
      } z-10`}>
        {isAnnotated ? 'YOLOv8s + 7x7 LEE' : 'RAW SSS (REVERB NOISE)'}
      </div>

      {/* Bottom Range Scale / Survey Telemetry Overlay */}
      <div className={`absolute bottom-3 ${isAnnotated ? 'right-3 text-right' : 'left-3'} z-10 pointer-events-none`}>
        <div className="text-[9px] font-mono text-white/70 bg-black/70 px-2 py-0.5 rounded backdrop-blur-sm border border-white/10">
          {isAnnotated 
            ? `CONF: ${item.confidence} // WGS84: ${item.coords}`
            : `SWEEP #${caseId * 3140 + 820} // ${item.depth.split('•')[1] || '450 kHz'}`
          }
        </div>
      </div>
    </div>
  );
}

export default function Home() {
  const [activeTooltip, setActiveTooltip] = useState(null);

  // Trust bar data with hover tooltips
  const trustMetrics = [
    {
      id: 1,
      metric: '98.4%',
      label: 'AI SONAR RECALL',
      desc: 'Benchmark validated across 12,000+ nautical miles of real side-scan sonar',
      tooltip: 'Trained on multi-frequency (100–900 kHz) SSS datasets with verified ground truth.'
    },
    {
      id: 2,
      metric: '< 180ms',
      label: 'EDGE CPU LATENCY',
      desc: 'Real-time frame inference with zero reliance on cloud connections',
      tooltip: 'Optimized ONNX runtime with quantized INT8/FP32 kernels suitable for embedded vessels.'
    },
    {
      id: 3,
      metric: 'ORDER 1A',
      label: 'IHO S-44 STANDARD',
      desc: 'Special Order hydrographic survey standard for shallow harbor fairways',
      tooltip: 'Meets rigorous Total Horizontal Uncertainty (THU) and bathymetric clearance mandates.'
    },
    {
      id: 4,
      metric: 'WGS-84',
      label: 'RAY-TRACED GEOCODES',
      desc: 'Automated slant-range to horizontal projection with layback correction',
      tooltip: 'Towfish cable length, heading, and altitude dynamically synchronized to GPS fix.'
    }
  ];

  // Portfolio transformation cases with real sample tiles and realistic sonogram fallbacks
  const portfolioCases = [
    {
      id: 1,
      sampleFile: 'wreckA_Barge_No_1_15_y960_x960.jpg',
      title: 'Submerged Shipping Container & Wreckage',
      location: 'Port of Chennai // North Channel Approach',
      depth: '24.2m Depth • SSS 450 kHz',
      roi: '94% FASTER CLEARANCE // ZERO DIVER RISK',
      details: 'Identified semi-buried 40ft standard cargo container hazard blocking main shipping fairway with 2.8m acoustic shadow.',
      hazardClass: 'P1 CRITICAL OBSTRUCTION',
      coords: '13.0832°N, 80.2735°E',
      confidence: '99.5%'
    },
    {
      id: 2,
      sampleFile: 'pipe_1693569432.789_x1500.jpg',
      title: 'Subsea Effluent Pipeline Free-Span',
      location: 'Visakhapatnam Outer Tanker Anchorage',
      depth: '38.0m Depth • SSS 300 kHz',
      roi: '₹4.8M SAVED IN SALVAGE & DIVER OPEX',
      details: 'Automated 7x7 Lee despeckling and edge detection isolated 45m unburied pipeline span vulnerable to tanker anchor drag.',
      hazardClass: 'P2 INFRASTRUCTURE ASSET',
      coords: '13.0815°N, 80.2791°E',
      confidence: '98.1%'
    },
    {
      id: 3,
      sampleFile: 'wreckA_Monrovia_02_y1047_x1088.jpg',
      title: 'Derelict Fishing Trawler & Ghost Netting',
      location: 'Gulf of Mannar Marine Biosphere Reserve',
      depth: '18.6m Depth • SSS 900 kHz',
      roi: 'SUB-METER WGS-84 ACCURACY // MoES APPROVED',
      details: 'Segmented acoustic shadow from 120m synthetic monofilament ghost net entangled across a submerged wooden vessel chassis.',
      hazardClass: 'P1 ECOLOGICAL HAZARD',
      coords: '13.0894°N, 80.2752°E',
      confidence: '98.7%'
    }
  ];

  return (
    <div className="flex flex-col min-h-screen bg-[#121212] text-white">

      {/* ─────────────────────────────────────────────────────────────
          SECTION 1: HERO (min-h-[95vh], Ship in Sea & Sonar Linkiness)
         ───────────────────────────────────────────────────────────── */}
      <section className="relative min-h-[95vh] flex items-center justify-center px-4 sm:px-6 lg:px-8 overflow-hidden py-16">
        
        {/* Radial Luxury Vignette */}
        <div 
          className="absolute inset-0 pointer-events-none"
          style={{
            background: 'radial-gradient(circle at 50% 25%, rgba(225, 29, 72, 0.14) 0%, rgba(18, 18, 18, 0.96) 75%, #121212 100%)',
          }}
        />

        {/* Ambient grid lines */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:4rem_4rem] pointer-events-none" />

        {/* ── Dynamic Ship at Sea with Sonar Linkiness Background ── */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-35 lg:opacity-45 select-none overflow-hidden">
          <svg viewBox="0 0 1400 900" className="w-full h-full max-w-[1600px] object-cover">
            <defs>
              {/* Sonar Beam Gradient */}
              <linearGradient id="sonarBeam" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#e11d48" stopOpacity="0.75" />
                <stop offset="50%" stopColor="#e11d48" stopOpacity="0.25" />
                <stop offset="100%" stopColor="#e11d48" stopOpacity="0.02" />
              </linearGradient>

              {/* Water Depth Gradient */}
              <linearGradient id="waterDepth" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#0a192f" stopOpacity="0.4" />
                <stop offset="30%" stopColor="#05101e" stopOpacity="0.7" />
                <stop offset="100%" stopColor="#02060c" stopOpacity="0.95" />
              </linearGradient>

              {/* Ping glow filter */}
              <filter id="sonarGlow" x="-50%" y="-50%" width="200%" height="200%">
                <feGaussianBlur in="SourceGraphic" stdDeviation="6" result="blur" />
                <feMerge>
                  <feMergeNode in="blur" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>
            </defs>

            {/* Sea Surface Water Line */}
            <path 
              d="M 0 320 Q 350 310 700 320 T 1400 320 L 1400 900 L 0 900 Z" 
              fill="url(#waterDepth)" 
            />

            {/* Surface wave shimmer line */}
            <path 
              d="M 0 320 Q 200 315 400 320 T 800 320 T 1200 320 T 1400 320" 
              fill="none" 
              stroke="rgba(225, 29, 72, 0.4)" 
              strokeWidth="2" 
              strokeDasharray="12,6"
            />

            {/* ── Hydrographic Survey Ship (MoES / NIOT Sagar Research Vessel) ── */}
            <g transform="translate(620, 245)">
              {/* Ship Hull */}
              <path 
                d="M -90 75 L -70 40 L 70 40 L 95 60 L 105 75 Z" 
                fill="#1a1a1a" 
                stroke="#e11d48" 
                strokeWidth="2" 
              />
              {/* Waterline Crimson Stripe */}
              <path d="M -85 70 L 100 70" stroke="#e11d48" strokeWidth="3" />
              
              {/* Superstructure / Bridge */}
              <rect x="-40" y="5" width="60" height="35" rx="3" fill="#222222" stroke="rgba(255,255,255,0.2)" strokeWidth="1.5" />
              {/* Bridge Windows with Warm Glow */}
              <rect x="-35" y="10" width="12" height="7" rx="1" fill="#fbbf24" opacity="0.8" />
              <rect x="-20" y="10" width="12" height="7" rx="1" fill="#fbbf24" opacity="0.8" />
              <rect x="-5" y="10" width="12" height="7" rx="1" fill="#fbbf24" opacity="0.8" />
              
              {/* Radar Mast & Scanner */}
              <line x1="-10" y1="5" x2="-10" y2="-25" stroke="#ffffff" strokeWidth="2" />
              <line x1="-25" y1="-25" x2="5" y2="-25" stroke="#e11d48" strokeWidth="3" />
              <circle cx="-10" cy="-25" r="3" fill="#e11d48" className="animate-ping" />
              <circle cx="15" cy="15" r="6" fill="#ffffff" opacity="0.9" /> {/* Satellite Dome */}

              {/* Stern A-Frame Crane deploying tow cable */}
              <line x1="-70" y1="40" x2="-85" y2="15" stroke="#e11d48" strokeWidth="2.5" />
              <line x1="-85" y1="15" x2="-65" y2="15" stroke="#e11d48" strokeWidth="2.5" />
              
              {/* Tow Cable deployed down into depths */}
              <path 
                d="M -75 25 Q -90 120 -80 200" 
                fill="none" 
                stroke="#fbbf24" 
                strokeWidth="1.5" 
                strokeDasharray="4,3" 
              />

              {/* Towed Side-Scan Sonar Fish (Towfish at depth) */}
              <g transform="translate(-80, 200)">
                <ellipse cx="0" cy="0" rx="12" ry="4" fill="#e11d48" />
                <polygon points="-8,-4 -14,-7 -12,0 -14,7 -8,4" fill="#ffffff" />
                <circle cx="0" cy="0" r="3" fill="#ffffff" className="animate-ping" />
              </g>
            </g>

            {/* ── SONAR LINKINESS: Dual-Swath Acoustic Fan Beams ── */}
            {/* Port & Starboard Acoustic Waves propagating from Towfish */}
            <g transform="translate(540, 445)">
              {/* Left Beam Cone */}
              <polygon points="0,0 -380,380 -80,380" fill="url(#sonarBeam)" opacity="0.5" />
              {/* Right Beam Cone */}
              <polygon points="0,0 80,380 380,380" fill="url(#sonarBeam)" opacity="0.5" />

              {/* Acoustic Ray Propagation Lines */}
              <line x1="0" y1="0" x2="-380" y2="380" stroke="#e11d48" strokeWidth="1.5" strokeDasharray="6,4" opacity="0.8" />
              <line x1="0" y1="0" x2="-230" y2="380" stroke="#e11d48" strokeWidth="1" strokeDasharray="3,3" opacity="0.5" />
              <line x1="0" y1="0" x2="-80" y2="380" stroke="#e11d48" strokeWidth="1.5" strokeDasharray="6,4" opacity="0.8" />

              <line x1="0" y1="0" x2="80" y2="380" stroke="#e11d48" strokeWidth="1.5" strokeDasharray="6,4" opacity="0.8" />
              <line x1="0" y1="0" x2="230" y2="380" stroke="#e11d48" strokeWidth="1" strokeDasharray="3,3" opacity="0.5" />
              <line x1="0" y1="0" x2="380" y2="380" stroke="#e11d48" strokeWidth="1.5" strokeDasharray="6,4" opacity="0.8" />

              {/* Concentric Acoustic Wavefront Rings */}
              {[80, 160, 240, 320].map((r, i) => (
                <path 
                  key={i}
                  d={`M ${-r * 0.9} ${r} Q 0 ${r * 1.15} ${r * 0.9} ${r}`}
                  fill="none" 
                  stroke="#e11d48" 
                  strokeWidth="1.5" 
                  strokeDasharray="8,6"
                  opacity={0.7 - i * 0.15}
                />
              ))}

              {/* Center Nadir Line (Blind Zone) */}
              <line x1="0" y1="0" x2="0" y2="380" stroke="rgba(255,255,255,0.3)" strokeWidth="1" strokeDasharray="4,4" />
            </g>

            {/* ── Seabed Contour & Subsea Target Detection Pins ── */}
            {/* Bathymetric Seafloor Bed */}
            <path 
              d="M 0 825 Q 350 810 700 830 T 1400 820 L 1400 900 L 0 900 Z" 
              fill="#080808" 
              stroke="#e11d48" 
              strokeWidth="2" 
            />

            {/* Target 1: Submerged Container Anomaly */}
            <g transform="translate(340, 815)">
              <rect x="-18" y="-12" width="36" height="14" fill="#2a1015" stroke="#e11d48" strokeWidth="2" />
              {/* Acoustic Shadow behind target */}
              <polygon points="18,-12 45,0 18,2" fill="rgba(0,0,0,0.85)" />
              <circle cx="0" cy="-5" r="16" fill="none" stroke="#e11d48" strokeWidth="1.5" className="animate-ping" />
              <circle cx="0" cy="-5" r="4" fill="#e11d48" />
              <text x="-35" y="-22" fill="#ffffff" fontSize="10" fontFamily="Poppins" fontWeight="bold">TARGET #1: CONTAINER</text>
            </g>

            {/* Target 2: Ghost Net / Pipeline Anomaly */}
            <g transform="translate(850, 810)">
              <ellipse cx="0" cy="0" rx="24" ry="6" fill="#12251a" stroke="#10b981" strokeWidth="2" />
              <circle cx="0" cy="0" r="14" fill="none" stroke="#10b981" strokeWidth="1.5" className="animate-ping" />
              <circle cx="0" cy="0" r="4" fill="#10b981" />
              <text x="-25" y="-16" fill="#10b981" fontSize="10" fontFamily="Poppins" fontWeight="bold">TARGET #2: PIPELINE</text>
            </g>

            {/* Depth Graticule Labels */}
            <text x="40" y="450" fill="rgba(255,255,255,0.3)" fontSize="11" fontFamily="monospace">DEPTH: -25m</text>
            <text x="40" y="650" fill="rgba(255,255,255,0.3)" fontSize="11" fontFamily="monospace">DEPTH: -50m</text>
            <text x="40" y="810" fill="rgba(225,29,72,0.8)" fontSize="11" fontFamily="monospace" fontWeight="bold">SEABED: -72m (SSS SWATH 100m)</text>
          </svg>
        </div>

        <div className="relative max-w-6xl mx-auto text-center flex flex-col items-center z-10">
          
          {/* Urgency Badge with Pulsing Beacon */}
          <div className="inline-flex items-center gap-3 px-4 py-2 rounded-full bg-[#1a1a1a] border border-crimson/30 shadow-[0_0_20px_rgba(225,29,72,0.25)] mb-8">
            <span className="w-2.5 h-2.5 rounded-full bg-crimson pulse-crimson" />
            <span className="text-xs font-semibold tracking-widest uppercase text-white font-poppins">
              PRIORITY SWATHS ACTIVE // ONLY 2 DEPLOYMENTS REMAINING FOR Q1 SURVEY
            </span>
          </div>

          {/* 80px Headline in Cal Sans */}
          <h1 className="font-calsans font-black text-4xl sm:text-6xl md:text-7xl lg:text-[80px] leading-[1.05] tracking-tight text-white max-w-5xl uppercase">
            AUTONOMOUS SUBSEA AI. <br className="hidden sm:inline" />
            <span className="text-crimson underline decoration-crimson/40 decoration-4 underline-offset-8">
              ZERO COMPROMISE.
            </span>
          </h1>

          {/* 20px Luxury Body Copy in Poppins */}
          <p className="mt-8 font-poppins text-lg sm:text-xl text-zinc-300 max-w-3xl leading-relaxed font-normal">
            Next-generation autonomous Side-Scan Sonar (SSS) target recognition, speckle suppression, 
            and IHO S-44 Order 1A geocoding engineered for the Ministry of Earth Sciences (MoES) and NIOT.
          </p>

          {/* Sonar Acoustic Telemetry Strip */}
          <div className="mt-8 flex flex-wrap items-center justify-center gap-4 text-xs font-poppins">
            <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#1a1a1a] border border-white/10 text-zinc-300">
              <Ship className="w-3.5 h-3.5 text-crimson" />
              <span>SURVEY SHIP: <strong>CRV SAGAR NIDHI</strong></span>
            </div>
            <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#1a1a1a] border border-white/10 text-zinc-300">
              <Radio className="w-3.5 h-3.5 text-crimson" />
              <span>FREQUENCY: <strong>450 kHz DUAL-SWATH</strong></span>
            </div>
            <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#1a1a1a] border border-white/10 text-zinc-300">
              <Crosshair className="w-3.5 h-3.5 text-emerald-400" />
              <span>RAY-TRACED: <strong>WGS-84 SUB-METER</strong></span>
            </div>
          </div>

          {/* Avatar Stack: Trusted by MoES / NIOT Hydrographic Fleet */}
          <div className="mt-8 flex flex-col sm:flex-row items-center gap-4 bg-[#1a1a1a]/80 backdrop-blur-md px-5 py-3 rounded-full border border-white/10">
            <div className="flex -space-x-3 overflow-hidden">
              <div className="inline-block h-9 w-9 rounded-full ring-2 ring-[#121212] bg-gradient-to-tr from-crimson to-zinc-800 flex items-center justify-center text-xs font-bold text-white">
                MoES
              </div>
              <div className="inline-block h-9 w-9 rounded-full ring-2 ring-[#121212] bg-gradient-to-tr from-zinc-700 to-zinc-900 flex items-center justify-center text-xs font-bold text-zinc-200">
                NIOT
              </div>
              <div className="inline-block h-9 w-9 rounded-full ring-2 ring-[#121212] bg-gradient-to-tr from-crimson/80 to-zinc-900 flex items-center justify-center text-xs font-bold text-white">
                INHO
              </div>
              <div className="inline-block h-9 w-9 rounded-full ring-2 ring-[#121212] bg-zinc-800 flex items-center justify-center text-[10px] font-bold text-crimson border border-crimson/40">
                +14
              </div>
            </div>
            <div className="text-left text-xs">
              <p className="font-semibold text-white tracking-wide font-poppins">
                Validated for MoES & NIOT Hydrographic Fleet
              </p>
              <p className="text-zinc-400 text-[11px]">
                Active deployment in 14+ maritime ports & critical navigation channels
              </p>
            </div>
          </div>

          {/* Dual Action Buttons: Primary Crimson & Luxury Outline */}
          <div className="mt-10 flex flex-col sm:flex-row items-center gap-5 w-full sm:w-auto">
            <Link
              to="/console"
              className="btn-crimson group w-full sm:w-auto px-8 py-4 rounded-2xl font-calsans font-bold text-lg tracking-wider uppercase flex items-center justify-center gap-3 shadow-[0_10px_30px_rgba(225,29,72,0.4)] hover:shadow-[0_15px_40px_rgba(225,29,72,0.6)] hover:scale-[1.02] active:scale-[0.98] transition-all"
            >
              <span>DEPLOY VESSEL NOW</span>
              <ArrowUpRight className="w-5 h-5 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform stroke-[2.5]" />
            </Link>

            <Link
              to="/map"
              className="btn-luxury-dark w-full sm:w-auto px-8 py-4 rounded-2xl font-calsans font-bold text-lg tracking-wider uppercase flex items-center justify-center gap-2 hover:scale-[1.02] active:scale-[0.98] transition-all"
            >
              <span>EXPLORE GEODETIC GIS</span>
              <Compass className="w-4 h-4 text-crimson" />
            </Link>
          </div>

        </div>
      </section>


      {/* ─────────────────────────────────────────────────────────────
          SECTION 2: TRUST BAR (120px, 4 Columns, Hover Tooltips in #1a1a1a)
         ───────────────────────────────────────────────────────────── */}
      <section className="relative min-h-[120px] bg-[#1a1a1a] border-y border-white/[0.08] flex items-center px-4 sm:px-6 lg:px-8 py-6 z-20">
        <div className="max-w-7xl mx-auto w-full grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {trustMetrics.map((item) => (
            <div
              key={item.id}
              className="relative group p-4 rounded-2xl bg-[#121212]/60 border border-white/5 hover:border-crimson/40 transition-all duration-300 cursor-pointer"
              onMouseEnter={() => setActiveTooltip(item.id)}
              onMouseLeave={() => setActiveTooltip(null)}
            >
              <div className="flex items-baseline justify-between">
                <span className="font-calsans font-black text-2xl lg:text-3xl text-white group-hover:text-crimson transition-colors duration-300">
                  {item.metric}
                </span>
                <span className="w-2 h-2 rounded-full bg-zinc-600 group-hover:bg-crimson transition-colors duration-300" />
              </div>
              <p className="mt-1 text-xs font-bold tracking-widest text-zinc-200 uppercase font-poppins">
                {item.label}
              </p>
              <p className="mt-0.5 text-[11px] text-zinc-400 font-poppins leading-tight">
                {item.desc}
              </p>

              {/* Hover Tooltip styled in #1a1a1a with glassmorphism */}
              {activeTooltip === item.id && (
                <div className="absolute -top-16 left-1/2 -translate-x-1/2 w-64 p-3 rounded-xl bg-[#1a1a1a] border border-crimson/50 text-[11px] text-zinc-200 shadow-2xl z-30 pointer-events-none transition-all">
                  <div className="flex items-center gap-1.5 text-crimson font-semibold mb-1">
                    <Sparkles className="w-3 h-3" />
                    <span>TECHNICAL SPECIFICATION</span>
                  </div>
                  {item.tooltip}
                </div>
              )}
            </div>
          ))}
        </div>
      </section>


      {/* ─────────────────────────────────────────────────────────────
          SECTION 3: SERVICES GRID (2-Col Sticky Layout, 40px Rounded, <details>)
         ───────────────────────────────────────────────────────────── */}
      <section className="relative px-4 sm:px-6 lg:px-8 py-24 max-w-7xl mx-auto w-full">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          
          {/* Sticky Left Column */}
          <div className="lg:col-span-5 lg:sticky lg:top-28">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-crimson/10 border border-crimson/30 text-crimson text-xs font-bold tracking-widest uppercase mb-4">
              <span>HIGH-TICKET MARITIME SOLUTIONS</span>
            </div>

            <h2 className="font-calsans font-black text-3xl sm:text-5xl text-white leading-tight uppercase">
              TACTICAL CLEARANCE TIERS & ACOUSTIC CAPABILITIES
            </h2>

            <p className="mt-6 text-zinc-400 font-poppins text-base leading-relaxed">
              Every hour a shipping lane is obstructed costs ports millions in demurrage. 
              AquaScan delivers automated, mission-ready subsea clearance frameworks tailored to 
              sovereign hydrography standards.
            </p>

            {/* Expandable Comparison Table */}
            <div className="mt-8 p-6 rounded-[2rem] bg-[#1a1a1a] border border-white/10">
              <h3 className="font-calsans text-base font-bold text-white mb-4 flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-crimson" />
                CONVENTIONAL VS. AQUASCAN AI
              </h3>
              <div className="space-y-3 text-xs">
                <div className="flex justify-between pb-2 border-b border-white/5">
                  <span className="text-zinc-400">Processing Latency</span>
                  <span className="font-bold text-crimson">180ms vs 14 Days</span>
                </div>
                <div className="flex justify-between pb-2 border-b border-white/5">
                  <span className="text-zinc-400">Hazard Detection Accuracy</span>
                  <span className="font-bold text-white">98.4% vs 64.0%</span>
                </div>
                <div className="flex justify-between pb-2 border-b border-white/5">
                  <span className="text-zinc-400">Diver In-Water Exposure</span>
                  <span className="font-bold text-emerald-400">Zero vs High Risk</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-zinc-400">Compliance Certification</span>
                  <span className="font-bold text-white">Automated S-44 PDF</span>
                </div>
              </div>
            </div>

            <div className="mt-8">
              <Link
                to="/inspector"
                className="inline-flex items-center gap-2 text-crimson hover:text-white font-calsans text-sm font-bold tracking-widest uppercase transition-colors"
              >
                <span>OPEN HAZARD INSPECTOR PLATFORM</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>

          {/* Right Column: 40px Rounded Cards with Expandable <details> */}
          <div className="lg:col-span-7 space-y-8">
            
            {/* Featured Card in Crimson Accent */}
            <div className="p-8 sm:p-10 rounded-[40px] bg-gradient-to-br from-[#1e1417] to-[#1a1a1a] border-2 border-crimson/50 shadow-[0_15px_50px_rgba(225,29,72,0.25)] relative overflow-hidden group">
              <div className="absolute top-6 right-8 px-3 py-1 rounded-full bg-crimson text-white text-[10px] font-bold tracking-widest uppercase">
                FLAGSHIP TIER
              </div>

              <div className="w-12 h-12 rounded-2xl bg-crimson/20 border border-crimson/40 flex items-center justify-center text-crimson mb-6">
                <Crosshair className="w-6 h-6" />
              </div>

              <h3 className="font-calsans font-black text-2xl sm:text-3xl text-white uppercase">
                AUTONOMOUS PORT FAIRWAY CLEARANCE
              </h3>
              <p className="mt-3 text-zinc-300 text-sm font-poppins leading-relaxed">
                Full-swath acoustic sweep for harbor authorities, naval dockyards, and port trusts. 
                Deploys multi-scale YOLOv8s AI directly on towfish telemetry for instantaneous obstruction alerts.
              </p>

              {/* Accordion Specification */}
              <details className="mt-6 border-t border-white/10 pt-4 group/details">
                <summary className="flex items-center justify-between cursor-pointer font-calsans text-sm text-crimson font-bold uppercase tracking-wider select-none list-none">
                  <span>TECHNICAL ARCHITECTURE & DELIVERABLES</span>
                  <ChevronDown className="w-4 h-4 group-open/details:rotate-180 transition-transform" />
                </summary>
                <div className="mt-4 space-y-2 text-xs text-zinc-300 font-poppins">
                  <p>• <strong>Towfish Ray-Tracing:</strong> Real-time slant-range layback calculation using vessel heading & tow cable pay-out.</p>
                  <p>• <strong>Despeckling Engine:</strong> 7x7 adaptive Lee filter removing high-frequency reverberation.</p>
                  <p>• <strong>Deliverables:</strong> GeoTIFF bathymetric mosaic, S-57 ENCs, Shapefiles, and executive S-44 compliance report.</p>
                  <p>• <strong>Turnaround:</strong> Instant live stream + finalized certification within 60 minutes.</p>
                </div>
              </details>

              <div className="mt-8 flex items-center justify-between pt-6 border-t border-white/10">
                <div>
                  <span className="text-[11px] text-zinc-400 uppercase tracking-widest font-semibold">RESPONSE SLA</span>
                  <div className="font-calsans text-xl text-white font-bold">&lt; 4 HOURS ON-SITE</div>
                </div>
                <Link
                  to="/console"
                  className="btn-crimson px-6 py-3 rounded-xl font-calsans text-xs font-bold tracking-widest uppercase shadow-lg shadow-crimson/30 hover:scale-105 transition-all"
                >
                  SELECT TIER
                </Link>
              </div>
            </div>

            {/* Standard Service Card 2 */}
            <div className="p-8 sm:p-10 rounded-[40px] bg-[#1a1a1a] border border-white/[0.08] hover:border-white/20 transition-all duration-300 group">
              <div className="w-12 h-12 rounded-2xl bg-[#121212] border border-white/10 flex items-center justify-center text-zinc-300 mb-6 group-hover:text-crimson transition-colors">
                <Layers className="w-6 h-6" />
              </div>

              <h3 className="font-calsans font-black text-2xl sm:text-3xl text-white uppercase">
                DEEP-SEA ECOLOGICAL DEBRIS MAPPING
              </h3>
              <p className="mt-3 text-zinc-400 text-sm font-poppins leading-relaxed">
                Quantitative acoustic assessment of ghost fishing nets, plastic aggregates, and industrial dump sites 
                within sensitive Marine Protected Areas (MPA) and deep continental shelf swaths.
              </p>

              <details className="mt-6 border-t border-white/10 pt-4 group/details">
                <summary className="flex items-center justify-between cursor-pointer font-calsans text-sm text-zinc-300 hover:text-crimson font-bold uppercase tracking-wider select-none list-none transition-colors">
                  <span>ENVIRONMENTAL DELIVERABLES & ACCURACY</span>
                  <ChevronDown className="w-4 h-4 group-open/details:rotate-180 transition-transform" />
                </summary>
                <div className="mt-4 space-y-2 text-xs text-zinc-400 font-poppins">
                  <p>• <strong>Spectral Profiling:</strong> High-frequency backscatter classification differentiating synthetic nylon from natural benthos.</p>
                  <p>• <strong>Volumetric Estimation:</strong> Sonar shadow length-to-height triangulation computing debris volume.</p>
                  <p>• <strong>Deliverables:</strong> GeoJSON hot-spot heatmaps ready for national MoES GIS databases.</p>
                </div>
              </details>

              <div className="mt-8 flex items-center justify-between pt-6 border-t border-white/10">
                <div>
                  <span className="text-[11px] text-zinc-500 uppercase tracking-widest font-semibold">SWATH COVERAGE</span>
                  <div className="font-calsans text-xl text-white font-bold">120 KM² / 24H</div>
                </div>
                <Link
                  to="/map"
                  className="btn-luxury-dark px-6 py-3 rounded-xl font-calsans text-xs font-bold tracking-widest uppercase hover:scale-105 transition-all"
                >
                  VIEW GEOMAP
                </Link>
              </div>
            </div>

            {/* Standard Service Card 3 */}
            <div className="p-8 sm:p-10 rounded-[40px] bg-[#1a1a1a] border border-white/[0.08] hover:border-white/20 transition-all duration-300 group">
              <div className="w-12 h-12 rounded-2xl bg-[#121212] border border-white/10 flex items-center justify-center text-zinc-300 mb-6 group-hover:text-crimson transition-colors">
                <AlertOctagon className="w-6 h-6" />
              </div>

              <h3 className="font-calsans font-black text-2xl sm:text-3xl text-white uppercase">
                SUBMERGED WRECKAGE & PIPELINE FORENSICS
              </h3>
              <p className="mt-3 text-zinc-400 text-sm font-poppins leading-relaxed">
                Critical subsea infrastructure inspection for offshore oil & gas, undersea telecom cables, and 
                archaeological wreck investigations with millimetric acoustic backscatter fidelity.
              </p>

              <details className="mt-6 border-t border-white/10 pt-4 group/details">
                <summary className="flex items-center justify-between cursor-pointer font-calsans text-sm text-zinc-300 hover:text-crimson font-bold uppercase tracking-wider select-none list-none transition-colors">
                  <span>STRUCTURAL FORENSICS CAPABILITY</span>
                  <ChevronDown className="w-4 h-4 group-open/details:rotate-180 transition-transform" />
                </summary>
                <div className="mt-4 space-y-2 text-xs text-zinc-400 font-poppins">
                  <p>• <strong>Free-Span Assessment:</strong> Automated detection of pipeline scouring and unsupported spans.</p>
                  <p>• <strong>Structural Deformation:</strong> Multi-aspect sonar passes registering millimeter-level chassis fatigue.</p>
                  <p>• <strong>Deliverables:</strong> Comprehensive NIOT Forensic Audit Dossier with raw acoustic waterfalls.</p>
                </div>
              </details>

              <div className="mt-8 flex items-center justify-between pt-6 border-t border-white/10">
                <div>
                  <span className="text-[11px] text-zinc-500 uppercase tracking-widest font-semibold">MAX OPERATING DEPTH</span>
                  <div className="font-calsans text-xl text-white font-bold">1,000 METERS</div>
                </div>
                <Link
                  to="/reports"
                  className="btn-luxury-dark px-6 py-3 rounded-xl font-calsans text-xs font-bold tracking-widest uppercase hover:scale-105 transition-all"
                >
                  AUDIT REPORTS
                </Link>
              </div>
            </div>

          </div>

        </div>
      </section>


      {/* ─────────────────────────────────────────────────────────────
          SECTION 4: PORTFOLIO SHOWCASE (REAL SONAR IMAGERY, 50/50 SPLIT)
         ───────────────────────────────────────────────────────────── */}
      <section className="relative px-4 sm:px-6 lg:px-8 py-20 bg-[#121212] overflow-hidden border-t border-white/[0.08]">
        <div className="max-w-7xl mx-auto mb-10 flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-crimson/10 border border-crimson/30 text-crimson text-xs font-semibold tracking-widest uppercase mb-3">
              <span>FIELD BENCHMARK DOSSIER</span>
            </div>
            <h2 className="font-calsans font-black text-3xl sm:text-5xl text-white uppercase">
              ACOUSTIC TRANSFORMATION SHOWCASE
            </h2>
          </div>
          <p className="text-zinc-400 text-sm font-poppins max-w-md">
            Side-by-side verification: Raw noisy acoustic sonar imagery vs. real-time 7x7 Lee despeckling and ONNX target extraction.
          </p>
        </div>

        {/* Horizontal scroll container with no-scrollbar */}
        <div className="flex gap-8 overflow-x-auto no-scrollbar pb-8 pt-4 px-2 max-w-7xl mx-auto scroll-smooth">
          {portfolioCases.map((item) => (
            <div
              key={item.id}
              className="min-w-[480px] sm:min-w-[540px] rounded-[3rem] bg-[#1a1a1a] border border-white/10 overflow-hidden group flex-shrink-0 relative hover:border-crimson/50 transition-all duration-400 shadow-2xl flex flex-col"
            >
              {/* 50/50 Split Transformation Card View with AUTHENTIC ACOUSTIC SONAR IMAGERY */}
              <div className="relative h-72 w-full bg-[#0a0a0a] overflow-hidden flex border-b border-white/10">
                
                {/* Left 50%: Raw Side-Scan Sonar Imagery */}
                <div className="w-1/2 h-full relative border-r border-white/15 overflow-hidden">
                  <SonarCompareView caseId={item.id} isAnnotated={false} item={item} />
                </div>

                {/* Right 50%: Despeckled & AI-Annotated Sonar Imagery */}
                <div className="w-1/2 h-full relative overflow-hidden">
                  <SonarCompareView caseId={item.id} isAnnotated={true} item={item} />
                </div>

                {/* Center Hover Floating ROI Glass Badge */}
                <div className="absolute inset-x-0 bottom-3 flex justify-center px-4 z-20 pointer-events-none">
                  <div className="glass-dark-strong px-4 py-2 rounded-full border border-crimson/50 text-[11px] font-calsans font-bold tracking-wider text-white shadow-2xl flex items-center gap-2 group-hover:scale-105 group-hover:border-crimson transition-all">
                    <Sparkles className="w-3.5 h-3.5 text-crimson" />
                    <span>{item.roi}</span>
                  </div>
                </div>
              </div>

              {/* Card Meta Content */}
              <div className="p-8 flex-1 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[10px] font-bold tracking-widest uppercase px-2.5 py-0.5 rounded-full bg-crimson/15 text-crimson border border-crimson/30 font-poppins">
                      {item.hazardClass}
                    </span>
                    <span className="text-xs text-zinc-400 font-poppins font-medium">
                      {item.depth}
                    </span>
                  </div>
                  <h3 className="font-calsans font-black text-2xl text-white uppercase mt-2">
                    {item.title}
                  </h3>
                  <p className="text-xs text-zinc-400 font-poppins mt-1">
                    {item.location}
                  </p>
                  <p className="text-sm text-zinc-300 font-poppins mt-4 leading-relaxed">
                    {item.details}
                  </p>
                </div>

                <div className="mt-6 pt-6 border-t border-white/10 flex items-center justify-between">
                  <span className="text-xs text-zinc-400 font-poppins">
                    Verified by NIOT Hydrographic Audit Log
                  </span>
                  <Link
                    to="/console"
                    className="inline-flex items-center gap-1.5 text-xs font-calsans font-bold text-crimson hover:text-white uppercase tracking-wider transition-colors"
                  >
                    <span>ANALYZE IN CONSOLE</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>


      {/* ─────────────────────────────────────────────────────────────
          SECTION 6: FINAL CTA (Full-Width, 3rem Radius, Crimson Gradient)
         ───────────────────────────────────────────────────────────── */}
      <section className="relative px-4 sm:px-6 lg:px-8 py-20 max-w-7xl mx-auto w-full">
        <div 
          className="relative rounded-[3rem] p-10 sm:p-16 lg:p-20 text-center overflow-hidden shadow-[0_20px_80px_rgba(225,29,72,0.4)]"
          style={{
            background: 'linear-gradient(135deg, #e11d48 0%, #be123c 60%, #881337 100%)',
          }}
        >
          {/* Subtle decorative background elements */}
          <div className="absolute top-0 right-0 -mr-20 -mt-20 w-80 h-80 rounded-full bg-white/10 blur-3xl pointer-events-none" />
          <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-80 h-80 rounded-full bg-black/20 blur-3xl pointer-events-none" />

          <div className="relative z-10 max-w-4xl mx-auto flex flex-col items-center">
            
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-black/30 backdrop-blur-md border border-white/20 text-white text-xs font-bold tracking-widest uppercase mb-6">
              <Radio className="w-3.5 h-3.5 animate-pulse text-white" />
              <span>COMMISSION OPERATIONAL DEPLOYMENT</span>
            </div>

            {/* Giant 80px Headline */}
            <h2 className="font-calsans font-black text-4xl sm:text-6xl lg:text-[76px] leading-[1.05] text-white tracking-tight uppercase">
              SECURE YOUR SUBSEA SWATH TODAY.
            </h2>

            <p className="mt-6 font-poppins text-lg sm:text-xl text-white/90 max-w-2xl leading-relaxed">
              Equip your hydrographic vessels with real-time autonomous side-scan sonar intelligence. 
              Zero manual lag, guaranteed IHO S-44 compliance, and immediate vessel clearance.
            </p>

            {/* Centered Dual Buttons: Pure Black & Pure White */}
            <div className="mt-10 flex flex-col sm:flex-row items-center gap-5 w-full sm:w-auto">
              <Link
                to="/console"
                className="btn-luxury-dark bg-[#121212] hover:bg-black text-white px-9 py-4 rounded-2xl font-calsans font-bold text-lg tracking-wider uppercase flex items-center justify-center gap-2 shadow-2xl hover:scale-105 active:scale-95 transition-all w-full sm:w-auto"
              >
                <span>COMMISSION SYSTEM</span>
                <ArrowUpRight className="w-5 h-5 stroke-[2.5]" />
              </Link>

              <Link
                to="/reports"
                className="btn-glow-white bg-white hover:bg-zinc-100 text-[#121212] px-9 py-4 rounded-2xl font-calsans font-bold text-lg tracking-wider uppercase flex items-center justify-center gap-2 shadow-2xl hover:scale-105 active:scale-95 transition-all w-full sm:w-auto"
              >
                <span>DOWNLOAD S-44 AUDIT</span>
                <FileCheck className="w-5 h-5 text-crimson" />
              </Link>
            </div>

            {/* Compliance & Statutory Badges */}
            <div className="mt-12 pt-8 border-t border-white/20 flex flex-wrap items-center justify-center gap-6 text-[11px] font-poppins text-white/80 uppercase tracking-widest">
              <span className="flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-white" />
                IHO S-44 ORDER 1A COMPLIANT
              </span>
              <span>•</span>
              <span>MEPC.83(44) MARITIME RECOGNIZED</span>
              <span>•</span>
              <span>MoES / NIOT SOVEREIGN VERIFIED</span>
            </div>

          </div>
        </div>
      </section>

    </div>
  );
}
