import React, { useEffect, useRef, useState } from 'react';
import { 
  Waves, 
  AlertOctagon, 
  CheckCircle2, 
  Activity, 
  Zap,
  ShieldAlert
} from 'lucide-react';
import { useAnimatedCounter } from '../hooks';

/** Individual stat card with animated counter */
function StatCard({ stat, index, visible }) {
  const counterRef = useAnimatedCounter(stat.value, 950, visible);
  const Icon = stat.icon;

  return (
    <div
      className="stat-card-glow glass-panel rounded-xl p-4 border border-ocean-800 flex flex-col justify-between"
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? 'translateY(0) scale(1)' : 'translateY(20px) scale(0.95)',
        transition: `opacity 0.55s ease ${index * 90}ms, transform 0.55s cubic-bezier(0.34, 1.56, 0.64, 1) ${index * 90}ms`,
      }}
    >
      <div className="flex items-center justify-between mb-3">
        <span className="text-[10px] font-mono tracking-wider text-slate-500 uppercase">
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
          className={`text-2xl font-mono font-bold tracking-tight ${stat.color}`}
        >
          {stat.value}
        </div>
        <div className="text-[10px] text-slate-500 mt-0.5 truncate font-medium">
          {stat.subtext}
        </div>
      </div>

      {/* Bottom accent bar */}
      <div
        className="mt-3 h-0.5 rounded-full opacity-40"
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

  // Trigger counter animation when scrolled into view
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
      icon:      Waves,
      color:     'text-sonar-cyan',
      border:    'border-sonar-cyan/30',
      bg:        'bg-sonar-cyan/10',
      glowColor: 'rgba(0,240,255,0.3)',
      subtext:   'Classified Subsea Hazards'
    },
    {
      label:     'GHOST FISHING NETS',
      value:     ghostNets,
      icon:      AlertOctagon,
      color:     'text-rose-400',
      border:    'border-rose-500/30',
      bg:        'bg-rose-500/10',
      glowColor: 'rgba(244,63,94,0.3)',
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
      label:     'DESPECKLE FILTER',
      value:     `${noiseReductionPct}%`,
      icon:      Activity,
      color:     'text-teal-400',
      border:    'border-teal-500/30',
      bg:        'bg-teal-500/10',
      glowColor: 'rgba(20,184,166,0.3)',
      subtext:   '7×7 Lee Acoustic Gain'
    },
    {
      label:     'EDGE LATENCY',
      value:     `${avgLatencyMs}ms`,
      icon:      Zap,
      color:     'text-amber-400',
      border:    'border-amber-500/30',
      bg:        'bg-amber-500/10',
      glowColor: 'rgba(245,158,11,0.3)',
      subtext:   'Pure CPU ONNX Runtime'
    }
  ];

  return (
    <div ref={ref} className="grid grid-cols-2 md:grid-cols-5 gap-3">
      {stats.map((stat, i) => (
        <StatCard key={i} stat={stat} index={i} visible={visible} />
      ))}
    </div>
  );
}
