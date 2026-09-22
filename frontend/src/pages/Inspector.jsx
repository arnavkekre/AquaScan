import React, { useState, useEffect } from 'react';
import { 
  AlertTriangle, 
  ShieldAlert, 
  CheckCircle2, 
  Filter, 
  Ship, 
  Search, 
  Ruler, 
  MapPin,
  ExternalLink,
  CheckSquare,
  Activity
} from 'lucide-react';
import { useScrollReveal } from '../hooks';

const PRIORITY_COLORS = {
  'P1': { text: 'text-rose-400',   bg: 'bg-rose-500/15',   border: 'border-rose-500/30',   glow: 'rgba(239,68,68,0.15)'  },
  'P2': { text: 'text-amber-400',  bg: 'bg-amber-500/15',  border: 'border-amber-500/30',  glow: 'rgba(245,158,11,0.12)' },
  'P3': { text: 'text-sky-400',    bg: 'bg-sky-500/15',    border: 'border-sky-500/30',    glow: 'rgba(56,189,248,0.10)' },
};

const STATUS_STYLES = {
  'RECOVERED_CLEARED': 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 hover:bg-emerald-500/30',
  'VESSEL_EN_ROUTE':   'bg-amber-500/20  text-amber-400  border border-amber-500/30  hover:bg-amber-500/30',
  'NOTIFIED_NAVY':     'bg-sky-500/20    text-sky-400    border border-sky-500/30    hover:bg-sky-500/30',
  'VERIFIED':          'bg-teal-500/20   text-teal-400   border border-teal-500/30   hover:bg-teal-500/30',
  'CHARTED':           'bg-indigo-500/20 text-indigo-400 border border-indigo-500/30 hover:bg-indigo-500/30',
  'DISPATCH_PENDING':  'bg-sonar-cyan/15 text-sonar-cyan border border-sonar-cyan/30 hover:bg-sonar-cyan/25',
};

export default function Inspector() {
  const [filterPriority, setFilterPriority] = useState('ALL');
  const [searchQuery, setSearchQuery]       = useState('');
  const [mounted, setMounted]               = useState(false);
  const cardsRef = useScrollReveal();

  useEffect(() => {
    const t = setTimeout(() => setMounted(true), 60);
    return () => clearTimeout(t);
  }, []);

  const [anomalies, setAnomalies] = useState([
    {
      id: 'HAZ-26057-01',
      type: 'ghost_net',
      title: 'Derelict Monofilament Gillnet (Ghost Gear)',
      hazardLevel: 'Critical Ecological Hazard',
      priority: 'P1',
      priorityLabel: 'P1 - URGENT',
      confidence: 99.5,
      lat: 13.083214,
      lon: 80.273512,
      length: '14.2m',
      height: '2.8m',
      vessel: 'MoES Coastal Research Vessel (CRV Sagar)',
      action: 'Deploy ROV hydraulic line cutter; recover derelict netting.',
      status: 'DISPATCH_PENDING'
    },
    {
      id: 'HAZ-26057-02',
      type: 'mine_cylinder',
      title: 'Subsea Cylindrical Anomaly / Ordnance',
      hazardLevel: 'High Threat Explosive Hazard',
      priority: 'P1',
      priorityLabel: 'P1 - HAZMAT',
      confidence: 91.0,
      lat: 13.092045,
      lon: 80.281519,
      length: '2.1m',
      height: '0.9m',
      vessel: 'Indian Navy EOD / MCMV',
      action: 'Enforce 500m exclusion perimeter; dispatch acoustic diver team.',
      status: 'NOTIFIED_NAVY'
    },
    {
      id: 'HAZ-26057-03',
      type: 'submarine_pipeline',
      title: 'Submarine Hydrocarbon Fuel Pipeline Span',
      hazardLevel: 'Subsea Infrastructure',
      priority: 'P2',
      priorityLabel: 'P2 - MONITOR',
      confidence: 99.4,
      lat: 13.086112,
      lon: 80.278014,
      length: '62.0m',
      height: '0.4m',
      vessel: 'Offshore Survey ROV',
      action: 'Conduct cathodic protection survey; inspect for free-span scour.',
      status: 'VERIFIED'
    },
    {
      id: 'HAZ-26057-04',
      type: 'shipwreck',
      title: 'Monrovia Cargo Shipwreck (Bow Hull Section)',
      hazardLevel: 'Navigational Obstacle',
      priority: 'P3',
      priorityLabel: 'P3 - CHARTING',
      confidence: 94.2,
      lat: 13.089420,
      lon: 80.275210,
      length: '28.5m',
      height: '5.1m',
      vessel: 'Hydrographic Survey Vessel',
      action: 'Update National Hydrographic Office (NHO) chart depth soundings.',
      status: 'CHARTED'
    }
  ]);

  const toggleStatus = (id) => {
    setAnomalies(prev => prev.map(a => {
      if (a.id !== id) return a;
      const next =
        a.status === 'DISPATCH_PENDING'  ? 'VESSEL_EN_ROUTE' :
        a.status === 'VESSEL_EN_ROUTE'   ? 'RECOVERED_CLEARED' :
        'DISPATCH_PENDING';
      return { ...a, status: next };
    }));
  };

  const filtered = anomalies.filter(a => {
    const matchPriority = filterPriority === 'ALL' || a.priority === filterPriority;
    const matchSearch   = a.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          a.id.toLowerCase().includes(searchQuery.toLowerCase());
    return matchPriority && matchSearch;
  });

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
            <AlertTriangle
              className="w-6 h-6 text-amber-400"
              style={{ animation: 'glowPulse 2.5s ease-in-out infinite' }}
            />
            Marine Hazard Review Queue
          </h1>
          <p className="text-sm text-slate-400 mt-1">
            Operational triage dashboard for MoES salvage missions, ROV dispatching, and naval hazard alerts.
          </p>
        </div>

        {/* Priority filter pills */}
        <div className="flex items-center gap-2 flex-wrap">
          {['ALL', 'P1', 'P2', 'P3'].map((p, i) => {
            const active = filterPriority === p;
            const pStyle = PRIORITY_COLORS[p] || {};
            return (
              <button
                key={p}
                onClick={() => setFilterPriority(p)}
                style={{ transitionDelay: `${i * 30}ms` }}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-mono font-semibold transition-all duration-300 hover:scale-105 active:scale-95 ${
                  active
                    ? p === 'ALL'
                      ? 'bg-sonar-cyan text-ocean-950 shadow-md shadow-sonar-cyan/30'
                      : `${pStyle.bg} ${pStyle.text} ${pStyle.border} border`
                    : 'bg-ocean-900 border border-ocean-800 text-slate-400 hover:text-white hover:border-ocean-700'
                }`}
              >
                {p === 'ALL' ? 'All Priorities' : `${p} Level`}
              </button>
            );
          })}
        </div>
      </div>

      {/* ── Search ─────────────────────────────────────── */}
      <div
        className="relative"
        style={{
          opacity: mounted ? 1 : 0,
          transform: mounted ? 'translateY(0)' : 'translateY(12px)',
          transition: 'opacity 0.5s ease 0.1s, transform 0.5s ease 0.1s',
        }}
      >
        <Search className="w-4 h-4 text-slate-500 absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none" />
        <input
          type="text"
          placeholder="Filter by hazard keyword, anomaly ID, or vessel type..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full bg-ocean-900/80 border border-ocean-800 rounded-xl pl-11 pr-4 py-2.5 text-xs font-mono text-slate-200 focus:outline-none focus:border-sonar-cyan focus:shadow-sm focus:shadow-sonar-cyan/10 transition-all duration-300 placeholder:text-slate-600"
        />
      </div>

      {/* ── Anomaly Cards Grid ─────────────────────────── */}
      <div ref={cardsRef} className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {filtered.map((item, idx) => {
          const pStyle  = PRIORITY_COLORS[item.priority] || PRIORITY_COLORS['P3'];
          const isP1    = item.priority === 'P1';

          return (
            <div
              key={item.id}
              className={`reveal glass-panel rounded-2xl p-6 border border-ocean-800 flex flex-col justify-between group transition-all duration-300 hover:-translate-y-1 ${isP1 ? 'p1-card' : ''}`}
              data-delay={idx * 100}
            >
              <div>
                {/* Header */}
                <div className="flex items-start justify-between gap-3 mb-4">
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <span className={`text-[10px] font-mono px-2.5 py-1 rounded-lg ${pStyle.bg} ${pStyle.text} ${pStyle.border} border font-bold tracking-wider`}>
                        {item.priorityLabel}
                      </span>
                      <span className="text-[10px] font-mono text-slate-500">{item.id}</span>
                    </div>
                    <h3 className="font-semibold text-base text-white leading-snug group-hover:text-sonar-cyan transition-colors duration-300">
                      {item.title}
                    </h3>
                    <p className="text-[11px] text-slate-500 font-mono mt-0.5">{item.hazardLevel}</p>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <span className="text-lg font-mono font-bold text-sonar-cyan block">
                      {item.confidence}%
                    </span>
                    <span className="text-[9px] font-mono text-slate-500 tracking-wider">CONFIDENCE</span>
                  </div>
                </div>

                {/* Physical metrics */}
                <div className="grid grid-cols-3 gap-2 mb-4 text-center font-mono">
                  {[
                    { label: 'LENGTH',          value: item.length,            color: 'text-white' },
                    { label: 'SHADOW ELEV.',     value: item.height,            color: 'text-sonar-cyan' },
                    { label: 'WGS-84 LAT',       value: `${item.lat.toFixed(4)}°N`, color: 'text-slate-300' },
                  ].map((m) => (
                    <div key={m.label} className="p-2.5 rounded-xl bg-ocean-950/60 border border-ocean-800 group-hover:border-ocean-700 transition-colors duration-300">
                      <div className="text-[9px] text-slate-500 tracking-wider mb-1">{m.label}</div>
                      <div className={`text-xs font-bold ${m.color}`}>{m.value}</div>
                    </div>
                  ))}
                </div>

                {/* Action directive */}
                <p className="text-xs text-slate-300 leading-relaxed mb-0">
                  {item.action}
                </p>
              </div>

              {/* Footer */}
              <div className="pt-4 mt-4 border-t border-ocean-800/70 flex items-center justify-between gap-3 text-xs font-mono">
                <div className="flex items-center gap-1.5 text-slate-500 text-[11px] truncate">
                  <Ship className="w-3.5 h-3.5 text-sonar-teal flex-shrink-0" />
                  <span className="truncate">{item.vessel}</span>
                </div>

                <button
                  onClick={() => toggleStatus(item.id)}
                  className={`px-3 py-1.5 rounded-lg text-[11px] font-mono font-semibold transition-all duration-300 flex items-center gap-1.5 hover:scale-105 active:scale-95 ${STATUS_STYLES[item.status] || STATUS_STYLES['DISPATCH_PENDING']}`}
                >
                  <CheckSquare className="w-3 h-3" />
                  <span>{item.status.replace(/_/g, ' ')}</span>
                </button>
              </div>
            </div>
          );
        })}

        {filtered.length === 0 && (
          <div className="md:col-span-2 text-center py-16 text-slate-500 font-mono text-sm">
            <Search className="w-8 h-8 mx-auto mb-3 opacity-40" />
            No anomalies match the current filter.
          </div>
        )}
      </div>

    </div>
  );
}
