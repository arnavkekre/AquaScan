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
  Activity,
  Radio
} from 'lucide-react';
import { useScrollReveal } from '../hooks';

const PRIORITY_COLORS = {
  'P1': { text: 'text-crimson',    bg: 'bg-crimson/15',    border: 'border-crimson/30',   glow: 'rgba(225,29,72,0.25)'  },
  'P2': { text: 'text-amber-400',  bg: 'bg-amber-500/15',  border: 'border-amber-500/30',  glow: 'rgba(245,158,11,0.15)' },
  'P3': { text: 'text-sky-400',    bg: 'bg-sky-500/15',    border: 'border-sky-500/30',    glow: 'rgba(56,189,248,0.15)' },
};

const STATUS_STYLES = {
  'RECOVERED_CLEARED': 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 hover:bg-emerald-500/30',
  'VESSEL_EN_ROUTE':   'bg-amber-500/20  text-amber-400  border border-amber-500/30  hover:bg-amber-500/30',
  'NOTIFIED_NAVY':     'bg-sky-500/20    text-sky-400    border border-sky-500/30    hover:bg-sky-500/30',
  'VERIFIED':          'bg-teal-500/20   text-teal-400   border border-teal-500/30   hover:bg-teal-500/30',
  'CHARTED':           'bg-zinc-700/50   text-zinc-300   border border-zinc-600      hover:bg-zinc-700',
  'DISPATCH_PENDING':  'bg-crimson/20    text-crimson    border border-crimson/40    hover:bg-crimson/30',
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
      title: 'Unexploded Ordnance (Cylindrical UXO)',
      hazardLevel: 'Immediate Explosive Danger',
      priority: 'P1',
      priorityLabel: 'P1 - CRITICAL',
      confidence: 94.2,
      lat: 13.085120,
      lon: 80.271890,
      length: '1.8m',
      height: '0.6m',
      vessel: 'Indian Navy Explosive Ordnance Disposal (EOD)',
      action: 'Notify Maritime Operations Center; establish 500m exclusion perimeter.',
      status: 'NOTIFIED_NAVY'
    },
    {
      id: 'HAZ-26057-03',
      type: 'submarine_pipeline',
      title: 'Displaced Subsea Effluent Pipeline',
      hazardLevel: 'Structural Anchor Foul Risk',
      priority: 'P2',
      priorityLabel: 'P2 - ELEVATED',
      confidence: 98.1,
      lat: 13.081540,
      lon: 80.279110,
      length: '45.0m',
      height: '1.2m',
      vessel: 'Port Trust Survey Catamaran',
      action: 'Issue Notice to Mariners (NOTMAR); dispatch dive inspection crew.',
      status: 'VESSEL_EN_ROUTE'
    },
    {
      id: 'HAZ-26057-04',
      type: 'shipwreck',
      title: 'Semi-Buried Wooden Barge Hull',
      hazardLevel: 'Navigational Sounding Anomaly',
      priority: 'P3',
      priorityLabel: 'P3 - MONITOR',
      confidence: 91.8,
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
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 font-poppins">

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
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-crimson/10 border border-crimson/30 text-crimson text-xs font-bold tracking-widest uppercase mb-2">
            <span>SALVAGE & REMEDIATION QUEUE</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-calsans font-black text-white uppercase flex items-center gap-3">
            <Radio className="w-8 h-8 text-crimson" />
            Marine Hazard Review Queue
          </h1>
          <p className="text-sm text-zinc-400 mt-1 max-w-2xl">
            Operational triage dashboard for MoES salvage missions, ROV dispatching, and naval hazard alerts.
          </p>
        </div>

        {/* Priority filter pills */}
        <div className="flex items-center gap-2 flex-wrap">
          {['ALL', 'P1', 'P2', 'P3'].map((p) => {
            const active = filterPriority === p;
            const pStyle = PRIORITY_COLORS[p] || {};
            return (
              <button
                key={p}
                onClick={() => setFilterPriority(p)}
                className={`px-4 py-2 rounded-xl text-xs font-calsans font-bold tracking-wider uppercase transition-all hover:scale-105 active:scale-95 ${
                  active
                    ? p === 'ALL'
                      ? 'btn-crimson shadow-md shadow-crimson/30'
                      : `${pStyle.bg} ${pStyle.text} ${pStyle.border} border shadow-lg`
                    : 'bg-[#1a1a1a] border border-white/10 text-zinc-400 hover:text-white hover:border-white/20'
                }`}
              >
                {p === 'ALL' ? 'All Priorities' : `${p} Level`}
              </button>
            );
          })}
        </div>
      </div>

      {/* ── Search Input ─────────────────────────────────── */}
      <div
        className="relative"
        style={{
          opacity: mounted ? 1 : 0,
          transform: mounted ? 'translateY(0)' : 'translateY(12px)',
          transition: 'opacity 0.5s ease 0.1s, transform 0.5s ease 0.1s',
        }}
      >
        <Search className="w-4 h-4 text-zinc-500 absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none" />
        <input
          type="text"
          placeholder="Filter by hazard keyword, anomaly ID, or vessel type..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full bg-[#1a1a1a] border border-white/10 rounded-2xl pl-12 pr-4 py-3.5 text-xs font-poppins text-white focus:outline-none focus:border-crimson focus:shadow-[0_0_15px_rgba(225,29,72,0.25)] transition-all placeholder:text-zinc-500"
        />
      </div>

      {/* ── Anomaly Cards Grid (2.5rem Radius) ─────────────── */}
      <div ref={cardsRef} className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filtered.map((item, idx) => {
          const pStyle = PRIORITY_COLORS[item.priority] || PRIORITY_COLORS['P3'];
          const isP1 = item.priority === 'P1';

          return (
            <div
              key={item.id}
              className={`rounded-[2.5rem] p-8 bg-[#1a1a1a] border flex flex-col justify-between group transition-all duration-300 hover:-translate-y-1 shadow-2xl ${
                isP1 
                  ? 'border-crimson/50 hover:shadow-[0_15px_40px_rgba(225,29,72,0.2)]' 
                  : 'border-white/10 hover:border-white/30'
              }`}
            >
              <div>
                {/* Header */}
                <div className="flex items-start justify-between gap-3 mb-5">
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <span className={`text-[10px] font-calsans px-3 py-1 rounded-full ${pStyle.bg} ${pStyle.text} ${pStyle.border} border font-bold tracking-widest uppercase`}>
                        {item.priorityLabel}
                      </span>
                      <span className="text-[11px] font-semibold text-zinc-500">{item.id}</span>
                    </div>
                    <h3 className="font-calsans font-black text-xl text-white leading-snug group-hover:text-crimson transition-colors duration-200 uppercase">
                      {item.title}
                    </h3>
                    <p className="text-xs text-zinc-400 font-poppins mt-1">{item.hazardLevel}</p>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <span className="text-2xl font-calsans font-black text-crimson block">
                      {item.confidence}%
                    </span>
                    <span className="text-[10px] font-bold text-zinc-500 tracking-widest uppercase">CONFIDENCE</span>
                  </div>
                </div>

                {/* Physical metrics */}
                <div className="grid grid-cols-3 gap-2.5 mb-5 text-center">
                  {[
                    { label: 'EST. LENGTH',      value: item.length,                 color: 'text-white' },
                    { label: 'SHADOW ELEV.',     value: item.height,                 color: 'text-crimson' },
                    { label: 'WGS-84 LAT',       value: `${item.lat.toFixed(4)}°N`,  color: 'text-zinc-300' },
                  ].map((m) => (
                    <div key={m.label} className="p-3 rounded-2xl bg-[#121212] border border-white/10">
                      <div className="text-[9px] font-bold text-zinc-400 tracking-widest uppercase mb-0.5">{m.label}</div>
                      <div className={`text-xs font-calsans font-bold ${m.color}`}>{m.value}</div>
                    </div>
                  ))}
                </div>

                {/* Action directive */}
                <p className="text-xs text-zinc-300 font-poppins leading-relaxed mb-0">
                  {item.action}
                </p>
              </div>

              {/* Footer */}
              <div className="pt-5 mt-5 border-t border-white/10 flex items-center justify-between gap-3 text-xs">
                <div className="flex items-center gap-2 text-zinc-400 text-xs truncate">
                  <Ship className="w-4 h-4 text-crimson flex-shrink-0" />
                  <span className="truncate">{item.vessel}</span>
                </div>

                <button
                  onClick={() => toggleStatus(item.id)}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-poppins font-semibold transition-all duration-300 flex items-center gap-1.5 hover:scale-105 active:scale-95 ${STATUS_STYLES[item.status] || STATUS_STYLES['DISPATCH_PENDING']}`}
                >
                  <CheckSquare className="w-3.5 h-3.5" />
                  <span>{item.status.replace(/_/g, ' ')}</span>
                </button>
              </div>
            </div>
          );
        })}

        {filtered.length === 0 && (
          <div className="md:col-span-2 text-center py-20 text-zinc-500 font-poppins text-sm">
            <Search className="w-10 h-10 mx-auto mb-3 opacity-30 text-crimson" />
            No anomalies match the current filter criteria.
          </div>
        )}
      </div>

    </div>
  );
}
