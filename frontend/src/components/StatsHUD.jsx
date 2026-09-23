import React, { useEffect, useRef, useState } from 'react';
import { 
  Waves, 
  AlertOctagon, 
  CheckCircle2, 
  Activity, 
  Zap,
  ShieldAlert,
  Radio
} from 'lucide-react';
import { useAnimatedCounter } from '../hooks';

/** Individual stat card with animated counter */
function StatCard({ stat, index, visible }) {
  const counterRef = useAnimatedCounter(stat.value, 950, visible);
  const Icon = stat.icon;

  return (
    <div
      className="rounded-2xl p-4 bg-[#1a1a1a] border border-white/10 hover:border-crimson/40 flex flex-col justify-between shadow-lg transition-all duration-300"
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? 'translateY(0) scale(1)' : 'translateY(16px) scale(0.96)',
        transition: `opacity 0.5s ease ${index * 80}ms, transform 0.5s cubic-bezier(0.4, 0, 0.2, 1) ${index * 80}ms`,
      }}
    >
      <div className="flex items-center justify-between mb-3">
        <span className="text-[10px] font-poppins font-bold tracking-widest text-zinc-400 uppercase">
          {stat.label}
        </span>
        <div
          className={`p-1.5 rounded-lg ${stat.bg} ${stat.color} transition-transform duration-300 hover:scale-110`}
          style={{ boxShadow: `0 0 12px 0 ${stat.glowColor}` }}
        >
          <Icon className="w-3.5 h-3.5" />
        </div>
      </div>

      <div>
        <div
          ref={counterRef}
          className={`text-2xl font-calsans font-bold tracking-tight ${stat.color}`}
        >
          {stat.value}
        </div>
        <div className="text-[10px] text-zinc-500 mt-0.5 truncate font-poppins font-medium">
          {stat.subtext}
        </div>
      </div>

      {/* Bottom accent bar */}
      <div
        className="mt-3 h-0.5 rounded-full opacity-60"
        style={{ background: `linear-gradient(90deg, ${stat.glowColor}, transparent)` }}
      />
    </div>
  );
}

export default function StatsHUD({ 
  totalDetections = 4, 
  ghostNets       = 1, 
  pipelines       = 1, 
  wrecks          = 1,
  mines           = 1,
  avgLatencyMs    = 18.5,
  noiseReductionPct = 68.4
}) {
  const [visible, setVisible] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setVisible(true); obs.disconnect(); } },
      { threshold: 0.2 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  const stats = [
    {
      label:     'TOTAL ANOMALIES',
      value:     totalDetections,
      icon:      Radio,
      color:     'text-white',
      border:    'border-crimson/30',
      bg:        'bg-crimson/15',
      glowColor: 'rgba(225,29,72,0.4)',
      subtext:   'Classified Subsea Hazards'
    },
    {
      label:     'GHOST FISHING NETS',
      value:     ghostNets,
      icon:      AlertOctagon,
      color:     'text-crimson',
      border:    'border-crimson/30',
      bg:        'bg-crimson/10',
      glowColor: 'rgba(225,29,72,0.3)',
      subtext:   'P1 Ecological Priority'
    },
    {
      label:     'SUBSEA PIPELINES',
      value:     pipelines,
      icon:      CheckCircle2,
      color:     'text-emerald-400',
      border:    'border-emerald-500/30',
      bg:        'bg-emerald-500/10',
      glowColor: 'rgba(16,185,129,0.3)',
      subtext:   'Infrastructure Assets'
    },
    {
      label:     'LEE GAIN RATIO',
      value:     `${noiseReductionPct}%`,
      icon:      Activity,
      color:     'text-zinc-200',
      border:    'border-white/20',
      bg:        'bg-white/10',
      glowColor: 'rgba(255,255,255,0.2)',
      subtext:   '7×7 Adaptive Despeckle'
    },
    {
      label:     'EDGE LATENCY',
      value:     `${avgLatencyMs}ms`,
      icon:      Zap,
      color:     'text-amber-400',
      border:    'border-amber-500/30',
      bg:        'bg-amber-500/10',
      glowColor: 'rgba(245,158,11,0.3)',
      subtext:   'CPU ONNX Inference'
    }
  ];

  return (
    <div ref={ref} className="grid grid-cols-2 md:grid-cols-5 gap-3.5">
      {stats.map((stat, i) => (
        <StatCard key={i} stat={stat} index={i} visible={visible} />
      ))}
    </div>
  );
}
