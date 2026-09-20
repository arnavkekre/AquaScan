import React, { useState } from 'react';
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
  CheckSquare
} from 'lucide-react';

export default function Inspector() {
  const [filterPriority, setFilterPriority] = useState('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  
  // Interactive anomaly queue
  const [anomalies, setAnomalies] = useState([
    {
      id: 'HAZ-26057-01',
      type: 'ghost_net',
      title: 'Derelict Monofilament Gillnet (Ghost Gear)',
      hazardLevel: 'Critical Ecological Hazard',
      priority: 'P1 - URGENT',
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
      priority: 'P1 - HAZMAT',
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
      priority: 'P2 - MONITOR',
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
      priority: 'P3 - CHARTING',
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
      if (a.id === id) {
        const nextStatus = 
          a.status === 'DISPATCH_PENDING' ? 'VESSEL_EN_ROUTE' :
          a.status === 'VESSEL_EN_ROUTE' ? 'RECOVERED_CLEARED' :
          'DISPATCH_PENDING';
        return { ...a, status: nextStatus };
      }
      return a;
    }));
  };

  const filtered = anomalies.filter(a => {
    const matchPriority = filterPriority === 'ALL' || a.priority.includes(filterPriority);
    const matchSearch = a.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                        a.id.toLowerCase().includes(searchQuery.toLowerCase());
    return matchPriority && matchSearch;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 lg:px-8 py-6 space-y-6">
      
      {/* Top Header */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-mono font-bold text-white flex items-center gap-2">
            <AlertTriangle className="w-6 h-6 text-sonar-amber animate-pulse" />
            Marine Hazard Review Queue & Clean-Up Tasking
          </h1>
          <p className="text-xs text-slate-400 mt-0.5">
            Operational triage dashboard for MoES salvage missions, ROV dispatching, and naval hazard alerts.
          </p>
        </div>

        {/* Priority Filter Pill Switcher */}
        <div className="flex items-center gap-2">
          {['ALL', 'P1', 'P2', 'P3'].map(p => (
            <button
              key={p}
              onClick={() => setFilterPriority(p)}
              className={`px-3 py-1.5 rounded-xl text-xs font-mono font-medium transition-all ${
                filterPriority === p 
                  ? 'bg-sonar-cyan text-ocean-950 font-bold shadow' 
                  : 'bg-ocean-900 border border-ocean-800 text-slate-400 hover:text-white'
              }`}
            >
              {p === 'ALL' ? 'All Priorities' : `${p} Level`}
            </button>
          ))}
        </div>
      </div>

      {/* Search Bar */}
      <div className="relative">
        <Search className="w-4 h-4 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
        <input 
          type="text"
          placeholder="Filter by hazard keyword, anomaly ID, or vessel type..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full bg-ocean-900/80 border border-ocean-800 rounded-xl pl-11 pr-4 py-2.5 text-xs font-mono text-slate-200 focus:outline-none focus:border-sonar-cyan"
        />
      </div>

      {/* Anomaly Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filtered.map((item) => (
          <div 
            key={item.id}
            className="glass-panel rounded-2xl p-5 border border-ocean-800 hover:border-ocean-700 transition-all flex flex-col justify-between"
          >
            <div>
              {/* Header */}
              <div className="flex items-start justify-between gap-3 mb-3">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-rose-500/15 text-rose-400 border border-rose-500/30 font-bold">
                      {item.priority}
                    </span>
                    <span className="text-[10px] font-mono text-slate-400">{item.id}</span>
                  </div>
                  <h3 className="font-mono text-base font-bold text-white">
                    {item.title}
                  </h3>
                </div>

                <div className="text-right flex-shrink-0">
                  <span className="text-xs font-mono font-bold text-sonar-cyan block">
                    {item.confidence}%
                  </span>
                  <span className="text-[9px] font-mono text-slate-500">CONFIDENCE</span>
                </div>
              </div>

              {/* Physical Metrics */}
              <div className="grid grid-cols-3 gap-2 mb-3 text-center font-mono">
                <div className="p-2 rounded-xl bg-ocean-950/60 border border-ocean-800">
                  <div className="text-[9px] text-slate-400">LENGTH</div>
                  <div className="text-xs font-bold text-white mt-0.5">{item.length}</div>
                </div>
                <div className="p-2 rounded-xl bg-ocean-950/60 border border-ocean-800">
                  <div className="text-[9px] text-slate-400">SHADOW ELEVATION</div>
                  <div className="text-xs font-bold text-sonar-cyan mt-0.5">{item.height}</div>
                </div>
                <div className="p-2 rounded-xl bg-ocean-950/60 border border-ocean-800">
                  <div className="text-[9px] text-slate-400">WGS-84 LAT</div>
                  <div className="text-xs font-bold text-slate-300 mt-0.5">{item.lat.toFixed(4)}°N</div>
                </div>
              </div>

              {/* Action Directive */}
              <p className="text-xs text-slate-300 leading-relaxed font-sans mb-3">
                {item.action}
              </p>
            </div>

            {/* Vessel Dispatch & Action Footer */}
            <div className="pt-3 border-t border-ocean-800/80 flex items-center justify-between gap-3 text-xs font-mono">
              <div className="flex items-center gap-1.5 text-slate-400 text-[11px] truncate">
                <Ship className="w-3.5 h-3.5 text-sonar-teal flex-shrink-0" />
                <span className="truncate">{item.vessel}</span>
              </div>

              <button
                onClick={() => toggleStatus(item.id)}
                className={`px-3 py-1.5 rounded-lg text-[11px] font-mono font-semibold transition-all flex items-center gap-1.5 ${
                  item.status === 'RECOVERED_CLEARED'
                    ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                    : item.status === 'VESSEL_EN_ROUTE'
                    ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                    : 'bg-sonar-cyan/15 text-sonar-cyan border border-sonar-cyan/30 hover:bg-sonar-cyan/25'
                }`}
              >
                <CheckSquare className="w-3 h-3" />
                <span>{item.status.replace(/_/g, ' ')}</span>
              </button>
            </div>
          </div>
        ))}
      </div>

    </div>
  );
}
