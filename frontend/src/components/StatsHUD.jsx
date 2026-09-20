import React from 'react';
import { 
  Waves, 
  AlertOctagon, 
  CheckCircle2, 
  Activity, 
  Zap,
  ShieldAlert
} from 'lucide-react';

export default function StatsHUD({ 
  totalDetections = 4, 
  ghostNets = 1, 
  pipelines = 1, 
  wrecks = 1, 
  mines = 1,
  avgLatencyMs = 18.5,
  noiseReductionPct = 68.4
}) {
  const stats = [
    {
      label: 'TOTAL ANOMALIES',
      value: totalDetections,
      icon: Waves,
      color: 'text-sonar-cyan',
      border: 'border-sonar-cyan/30',
      bg: 'bg-sonar-cyan/10',
      subtext: 'Classified Subsea Hazards'
    },
    {
      label: 'GHOST FISHING NETS',
      value: ghostNets,
      icon: AlertOctagon,
      color: 'text-rose-400',
      border: 'border-rose-500/30',
      bg: 'bg-rose-500/10',
      subtext: 'P1 Ecological Priority'
    },
    {
      label: 'SUBSEA PIPELINES',
      value: pipelines,
      icon: CheckCircle2,
      color: 'text-emerald-400',
      border: 'border-emerald-500/30',
      bg: 'bg-emerald-500/10',
      subtext: 'Infrastructure Assets'
    },
    {
      label: 'DESPECKLE FILTER',
      value: `${noiseReductionPct}%`,
      icon: Activity,
      color: 'text-teal-400',
      border: 'border-teal-500/30',
      bg: 'bg-teal-500/10',
      subtext: '7x7 Lee Acoustic Gain'
    },
    {
      label: 'EDGE LATENCY',
      value: `${avgLatencyMs}ms`,
      icon: Zap,
      color: 'text-amber-400',
      border: 'border-amber-500/30',
      bg: 'bg-amber-500/10',
      subtext: 'Pure CPU ONNX Runtime'
    }
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
      {stats.map((stat, i) => {
        const Icon = stat.icon;
        return (
          <div 
            key={i} 
            className="glass-panel rounded-xl p-3.5 border border-ocean-800 flex flex-col justify-between hover:border-ocean-700 transition-all"
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-[10px] font-mono tracking-wider text-slate-400">
                {stat.label}
              </span>
              <div className={`p-1.5 rounded-lg ${stat.bg} ${stat.color}`}>
                <Icon className="w-3.5 h-3.5" />
              </div>
            </div>
            <div>
              <div className="text-xl font-mono font-bold text-white tracking-tight">
                {stat.value}
              </div>
              <div className="text-[10px] text-slate-400 mt-0.5 truncate">
                {stat.subtext}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
