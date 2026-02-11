import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Shield, Siren, Activity, MapPin, Users, Clock, TrendingUp, TrendingDown, 
  AlertTriangle, Radio, BarChart3, CheckCircle2, Navigation, ArrowRight, 
  ArrowUpRight, MoreHorizontal, Search, Car, Video, Mic, X, Filter, Bell
} from 'lucide-react';
import { 
  AreaChart, Area, ResponsiveContainer, XAxis, Tooltip, CartesianGrid 
} from 'recharts';

import PageLayout from '../../components/PageLayout';

// --- SUB-COMPONENTS ---

const TrendBadge = ({ value, invert = false }) => {
    const isPositive = value > 0;
    const isGood = (isPositive && !invert) || (!isPositive && invert);
    
    if (value === 0) return <div className="bg-zinc-100 text-zinc-500 text-xs px-2 py-1 rounded-full font-bold">Stable</div>;

    return (
        <div className={`flex items-center gap-1 text-xs font-medium px-2 py-1 rounded-full ${
            isGood ? 'bg-emerald-50 text-emerald-700' : 'bg-rose-50 text-rose-700'
        }`}>
            {isPositive ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
            {Math.abs(value).toFixed(1)}%
        </div>
    );
};

const MetricCard = ({ item }) => (
    <motion.div
        layout
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        whileHover={{ y: -4, scale: 1.02 }}
        className="bg-white rounded-3xl p-5 h-48 flex flex-col justify-between shadow-sm hover:shadow-xl hover:shadow-blue-900/5 border border-zinc-100 transition-all duration-300 group cursor-pointer relative overflow-hidden"
    >
        <div className="flex justify-between items-start z-10">
            <div className={`w-10 h-10 rounded-2xl flex items-center justify-center transition-colors duration-300 bg-zinc-50 text-zinc-900 group-hover:bg-blue-900 group-hover:text-white`}>
                <item.icon size={20} />
            </div>
            <div className="w-7 h-7 rounded-full bg-zinc-100 flex items-center justify-center text-zinc-400 group-hover:text-blue-900 transition-colors">
                <ArrowUpRight size={14} />
            </div>
        </div>
        <div className="z-10 mt-auto">
            <div className="flex justify-between items-end mb-1">
                <h3 className="text-3xl font-bold text-zinc-900 tracking-tight leading-none group-hover:text-blue-900 transition-colors">
                    {item.value}
                </h3>
                <TrendBadge value={item.trend} invert={item.label === 'Active Cases' || item.label === 'Avg Response'} />
            </div>
            <p className="text-xs text-zinc-500 font-medium uppercase tracking-wide">{item.label}</p>
        </div>
        <div className="absolute -right-4 -bottom-4 opacity-0 group-hover:opacity-5 transition-opacity duration-500 pointer-events-none">
            <item.icon size={100} />
        </div>
    </motion.div>
);

// --- MODALS (NEW FEATURES) ---

const DispatchModal = ({ incident, onClose, onAssign }) => {
  if (!incident) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
      <motion.div 
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className="bg-white rounded-[2rem] w-full max-w-md p-6 shadow-2xl"
      >
        <div className="flex justify-between items-center mb-6">
          <div>
            <h3 className="text-xl font-bold text-zinc-900">Dispatch Unit</h3>
            <p className="text-xs text-zinc-400">Case ID: #{incident.id.toString().padStart(4, '0')}</p>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-zinc-100 rounded-full transition-colors"><X size={20} /></button>
        </div>
        
        <div className="mb-6 p-4 bg-zinc-50 rounded-2xl border border-zinc-100">
          <div className="flex items-center gap-3 mb-2">
            <span className={`w-2 h-2 rounded-full ${incident.priority === 'high' ? 'bg-rose-500' : 'bg-amber-500'}`} />
            <span className="font-bold text-zinc-900">{incident.type}</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-zinc-500">
            <MapPin size={14} /> {incident.loc}
          </div>
        </div>

        <div className="space-y-3 mb-6">
          <p className="text-xs font-bold text-zinc-400 uppercase tracking-wider">Recommended Units</p>
          {[101, 104, 202].map(unit => (
            <button key={unit} onClick={() => onAssign(unit)} className="w-full flex items-center justify-between p-3 rounded-xl border border-zinc-200 hover:border-blue-500 hover:bg-blue-50 transition-all group">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center font-bold text-xs">P{unit}</div>
                <div className="text-left">
                  <p className="text-sm font-bold text-zinc-900">Patrol Unit {unit}</p>
                  <p className="text-[10px] text-zinc-500">0.8km away • 2 min ETA</p>
                </div>
              </div>
              <div className="px-3 py-1 bg-white text-zinc-900 text-xs font-bold rounded-lg border border-zinc-100 group-hover:bg-blue-600 group-hover:text-white transition-colors">
                Assign
              </div>
            </button>
          ))}
        </div>
      </motion.div>
    </div>
  );
};

// --- MAIN COMPONENT ---

export default function PoliceCenter() {
  // --- STATE MANAGEMENT (NEW) ---
  const [time, setTime] = useState(new Date());
  const [isEmergency, setIsEmergency] = useState(false); // Feature: Emergency Alert
  const [mapMode, setMapMode] = useState('map'); // Feature: CCTV Toggle
  const [searchQuery, setSearchQuery] = useState(''); // Feature: Search
  const [filterPriority, setFilterPriority] = useState('all'); // Feature: Filter
  const [selectedIncident, setSelectedIncident] = useState(null); // Feature: Dispatch Modal
  
  // Real-time Data States
  const [kpiData, setKpiData] = useState([
    { id: 1, label: 'Active Cases', sub: 'Open Investigations', value: 28, trend: 4, icon: AlertTriangle, color: 'rose' },
    { id: 2, label: 'Avg Response', sub: 'Dispatch Time', value: 272, trend: -8, icon: Clock, color: 'blue' }, // seconds
    { id: 3, label: 'Resolution Rate', sub: 'Case Closed', value: 92.4, trend: 1.2, icon: CheckCircle2, color: 'emerald' },
    { id: 4, label: 'Units Deployed', sub: 'On Patrol', value: 20, trend: 0, icon: Car, color: 'indigo' },
  ]);

  const [incidents, setIncidents] = useState([
    { id: 1, type: "Traffic Collision", loc: "Jalan HZ Mustofa", time: "2m ago", priority: "high" },
    { id: 2, type: "Public Disturbance", loc: "Cihideung Market", time: "12m ago", priority: "med" },
    { id: 3, type: "Suspicious Activity", loc: "Dadaha Park", time: "25m ago", priority: "low" },
    { id: 4, type: "Traffic Obstruction", loc: "Indihiang Terminal", time: "40m ago", priority: "low" },
  ]);

  const [unitStatus, setUnitStatus] = useState([
    { status: 'Available', count: 12, total: 20, color: 'bg-emerald-500' },
    { status: 'Responding', count: 5, total: 20, color: 'bg-amber-500' },
    { status: 'On Patrol', count: 3, total: 20, color: 'bg-blue-600' },
  ]);

  // --- NEW FEATURE: REAL-TIME SIMULATION LOGIC ---
  useEffect(() => {
    const timer = setInterval(() => {
      setTime(new Date());

      // Simulate KPI Jitter
      setKpiData(prev => prev.map(item => {
        const jitter = Math.random() > 0.7 ? (Math.random() - 0.5) * 2 : 0;
        return { ...item, value: item.value + (item.label === 'Active Cases' ? Math.round(jitter) : jitter * 0.1), trend: item.trend + jitter };
      }));
    }, 1000);

    // Simulate Incident Feed (Add new incident every 15s)
    const incidentTimer = setInterval(() => {
      const types = ["Theft Report", "Noise Complaint", "Traffic Stop", "Medical Assist"];
      const locs = ["Simpang Lima", "Tawang Square", "Cikalang", "Mangkubumi"];
      const newInc = {
        id: Date.now(),
        type: types[Math.floor(Math.random() * types.length)],
        loc: locs[Math.floor(Math.random() * locs.length)],
        time: "Just now",
        priority: Math.random() > 0.8 ? "high" : "low"
      };
      setIncidents(prev => [newInc, ...prev].slice(0, 8)); // Keep max 8 items
      
      // Update unit count slightly
      setUnitStatus(prev => {
        const newAvailable = Math.max(0, Math.min(20, prev[0].count + (Math.random() > 0.5 ? 1 : -1)));
        const responding = 20 - newAvailable - prev[2].count;
        return [
            { ...prev[0], count: newAvailable },
            { ...prev[1], count: Math.max(0, responding) },
            prev[2]
        ];
      });

    }, 15000);

    return () => {
      clearInterval(timer);
      clearInterval(incidentTimer);
    };
  }, []);

  // --- NEW FEATURE: SEARCH & FILTER LOGIC ---
  const filteredIncidents = useMemo(() => {
    return incidents.filter(inc => {
      const matchesSearch = inc.type.toLowerCase().includes(searchQuery.toLowerCase()) || 
                            inc.loc.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesPriority = filterPriority === 'all' || inc.priority === filterPriority;
      return matchesSearch && matchesPriority;
    });
  }, [incidents, searchQuery, filterPriority]);

  // Helper formatting
  const formatTime = (seconds) => {
    const m = Math.floor(seconds / 60);
    const s = Math.floor(seconds % 60);
    return `${m}m ${s}s`;
  };

  // --- RENDER ---
  return (
    <PageLayout 
        title="Police Center" 
        subtitle="Law Enforcement" 
        colorTheme="blue"
    >
        {/* NEW FEATURE: EMERGENCY BROADCAST ALERT */}
        <AnimatePresence>
            {isEmergency && (
                <motion.div 
                    initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }}
                    className="mb-8 overflow-hidden"
                >
                    <div className="bg-rose-600 text-white p-4 rounded-3xl flex items-center justify-between shadow-xl shadow-rose-200 animate-pulse">
                        <div className="flex items-center gap-4">
                            <Siren size={32} className="animate-spin" />
                            <div>
                                <h2 className="text-xl font-bold uppercase tracking-widest">Code Red Active</h2>
                                <p className="text-rose-100 text-sm">City-wide lockdown protocols initiated. All units respond.</p>
                            </div>
                        </div>
                        <button onClick={() => setIsEmergency(false)} className="px-6 py-2 bg-white text-rose-600 font-bold rounded-xl text-xs uppercase tracking-wider hover:bg-rose-50 transition-colors">
                            Stand Down
                        </button>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>

        {/* HEADER CONTROLS */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-8">
            <div className="flex items-center gap-3">
                 <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-blue-50 border border-blue-200 shadow-sm animate-pulse">
                    <div className={`w-2 h-2 rounded-full ${isEmergency ? 'bg-rose-600' : 'bg-blue-600'}`}></div>
                    <span className={`text-xs font-bold uppercase tracking-wide ${isEmergency ? 'text-rose-800' : 'text-blue-800'}`}>
                        {isEmergency ? 'Emergency Mode' : 'Command Center Live'}
                    </span>
                </div>
                <span className="text-xs text-zinc-400 font-mono">Synced: {time.toLocaleTimeString()}</span>
            </div>

            <div className="flex items-center gap-4">
                {/* NEW FEATURE: EMERGENCY TRIGGER BUTTON */}
                <button 
                    onClick={() => setIsEmergency(!isEmergency)}
                    className={`p-3 rounded-full transition-all border ${
                        isEmergency ? 'bg-zinc-800 text-white border-zinc-700' : 'bg-white text-zinc-400 border-zinc-200 hover:text-rose-500 hover:border-rose-200'
                    }`}
                >
                    <Bell size={20} />
                </button>

                {/* Safety Score Widget */}
                <div className="bg-white p-2 pr-6 rounded-[2rem] border border-zinc-200 shadow-sm flex items-center gap-4">
                    <div className={`w-12 h-12 rounded-full flex items-center justify-center border-4 border-white shadow-sm transition-colors duration-500 ${isEmergency ? 'bg-rose-100 text-rose-600' : 'bg-blue-100 text-blue-800'}`}>
                        <Shield size={20} fill="currentColor" />
                    </div>
                    <div>
                        <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider">City Safety Index</p>
                        <div className="flex items-baseline gap-1">
                            <span className="text-lg font-bold text-zinc-900">{isEmergency ? 'CRITICAL' : 'HIGH'}</span>
                            <span className="text-xs text-zinc-400 font-medium">• Level {isEmergency ? '5' : '1'}</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        {/* KPI SECTION (Dynamic Data) */}
        <section className="mb-8">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {kpiData.map((kpi) => (
                    <MetricCard 
                        key={kpi.id} 
                        item={{
                            ...kpi,
                            value: kpi.label === 'Avg Response' ? formatTime(kpi.value) : kpi.label === 'Resolution Rate' ? `${kpi.value.toFixed(1)}%` : Math.floor(kpi.value)
                        }} 
                    />
                ))}
            </div>
        </section>

        {/* MAIN GRID */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            
            {/* LEFT: MAP & ANALYTICS (8 Cols) */}
            <div className="lg:col-span-8 flex flex-col gap-8">
                
                {/* Incident Map / CCTV View */}
                <div className="bg-white rounded-[2.5rem] p-2 shadow-sm border border-zinc-200 relative overflow-hidden h-[500px] group transition-all">
                      {/* Map Container */}
                      <div className="w-full h-full rounded-[2rem] bg-zinc-100 relative overflow-hidden">
                        
                        {/* NEW FEATURE: CCTV MODE TOGGLE */}
                        <div className="absolute top-6 right-6 z-30 flex bg-white/90 backdrop-blur rounded-2xl p-1 border border-zinc-200 shadow-sm">
                            <button 
                                onClick={() => setMapMode('map')}
                                className={`px-3 py-1.5 text-[10px] font-bold uppercase rounded-xl transition-all ${mapMode === 'map' ? 'bg-blue-900 text-white shadow-md' : 'text-zinc-500 hover:bg-zinc-100'}`}
                            >
                                Map View
                            </button>
                            <button 
                                onClick={() => setMapMode('cctv')}
                                className={`px-3 py-1.5 text-[10px] font-bold uppercase rounded-xl transition-all ${mapMode === 'cctv' ? 'bg-blue-900 text-white shadow-md' : 'text-zinc-500 hover:bg-zinc-100'}`}
                            >
                                CCTV Grid
                            </button>
                        </div>

                        {mapMode === 'map' ? (
                            // --- MAP VIEW ---
                            <>
                                <div className="absolute inset-0 opacity-[0.05] bg-[linear-gradient(to_right,#000000_1px,transparent_1px),linear-gradient(to_bottom,#000000_1px,transparent_1px)] bg-[size:40px_40px]"></div>
                                {/* Abstract Blocks */}
                                <div className="absolute top-1/4 left-1/4 w-32 h-32 border-2 border-zinc-300/50 rotate-12"></div>
                                <div className="absolute bottom-1/3 right-1/3 w-40 h-40 border-2 border-zinc-300/50 -rotate-6"></div>
                                
                                {/* Map Overlay Info */}
                                <div className="absolute top-6 left-6 z-20">
                                    <div className="bg-white/90 backdrop-blur-md px-4 py-2 rounded-2xl border border-zinc-200 shadow-sm flex flex-col gap-1">
                                        <h3 className="text-sm font-bold text-zinc-900 flex items-center gap-2">
                                            <MapPin size={16} className="text-blue-800" /> Jurisdiction View
                                        </h3>
                                        <div className="flex gap-2">
                                            <span className="px-2 py-0.5 bg-blue-100 text-blue-800 text-[9px] font-bold rounded uppercase">Tawang</span>
                                            <span className="px-2 py-0.5 bg-zinc-100 text-zinc-500 text-[9px] font-bold rounded uppercase">Cihideung</span>
                                        </div>
                                    </div>
                                </div>

                                {/* Patrol Units (Blue Markers) - Simulated Movement */}
                                <motion.div 
                                    animate={{ x: [0, 60, 0], y: [0, -40, 0] }} 
                                    transition={{ repeat: Infinity, duration: 20, ease: "linear" }}
                                    className="absolute bottom-1/4 right-1/4 z-10 cursor-pointer group/unit"
                                >
                                    <div className="p-1.5 bg-blue-900 text-white rounded-full shadow-lg border-2 border-white transform transition-transform group-hover/unit:scale-125">
                                        <Car size={14} />
                                    </div>
                                    <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-blue-900 text-white text-[9px] px-2 py-1 rounded opacity-0 group-hover/unit:opacity-100 transition-opacity whitespace-nowrap">
                                        Unit 104
                                    </div>
                                </motion.div>

                                {/* Incidents (Red Markers) */}
                                {incidents.slice(0, 3).map((inc, i) => (
                                    <div 
                                        key={inc.id}
                                        className="absolute group cursor-pointer z-10"
                                        style={{ top: `${30 + (i * 15)}%`, left: `${40 + (i * 10)}%` }}
                                        onClick={() => setSelectedIncident(inc)} // Feature: Click map to dispatch
                                    >
                                        <div className="relative">
                                            <span className={`absolute -inset-4 rounded-full animate-ping ${inc.priority === 'high' ? 'bg-rose-500/20' : 'bg-amber-500/20'}`}></span>
                                            <div className={`w-4 h-4 rounded-full border-2 border-white shadow-lg ${inc.priority === 'high' ? 'bg-rose-500' : 'bg-amber-500'}`}></div>
                                            {/* Tooltip */}
                                            <div className="absolute top-6 left-1/2 -translate-x-1/2 bg-zinc-900 text-white px-3 py-2 rounded-xl shadow-lg whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity z-20 pointer-events-none">
                                                <p className="text-[10px] font-bold uppercase text-rose-400">{inc.type}</p>
                                                <p className="text-[10px] text-zinc-300">{inc.loc}</p>
                                            </div>
                                        </div>
                                    </div>
                                ))}

                                {/* Legend */}
                                <div className="absolute bottom-6 right-6 bg-white/90 backdrop-blur-md p-3 rounded-2xl border border-zinc-200 shadow-sm flex gap-4">
                                    <div className="flex items-center gap-2 text-[10px] font-bold text-zinc-500">
                                        <span className="w-2 h-2 bg-rose-500 rounded-full animate-pulse"></span> Incident
                                    </div>
                                    <div className="flex items-center gap-2 text-[10px] font-bold text-zinc-500">
                                        <span className="w-2 h-2 bg-blue-900 rounded-full"></span> Unit
                                    </div>
                                </div>
                            </>
                        ) : (
                            // --- CCTV VIEW (NEW FEATURE) ---
                            <div className="w-full h-full bg-zinc-900 grid grid-cols-2 grid-rows-2 gap-1 p-1">
                                {[1, 2, 3, 4].map(cam => (
                                    <div key={cam} className="relative bg-zinc-800 rounded-xl overflow-hidden group">
                                        <div className="absolute inset-0 flex items-center justify-center opacity-20">
                                            <Video size={40} className="text-zinc-600" />
                                        </div>
                                        {/* Simulated Grain/Static */}
                                        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-10"></div>
                                        <div className="absolute top-3 left-3 flex items-center gap-2">
                                            <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
                                            <span className="text-[9px] font-mono text-white/70">REC • CAM_0{cam}</span>
                                        </div>
                                        <div className="absolute bottom-3 right-3 text-[9px] font-mono text-white/50">
                                            {time.toLocaleTimeString()}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                      </div>
                </div>

                {/* Analytics Row */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    
                    {/* Activity Volume */}
                    <div className="bg-white p-6 rounded-[2.5rem] border border-zinc-200 shadow-sm">
                        <div className="flex justify-between items-center mb-6">
                            <h3 className="font-bold text-sm text-zinc-900">Incident Volume (24h)</h3>
                            <span className="text-[10px] font-bold bg-zinc-100 text-zinc-500 px-2 py-1 rounded-md">Peak: 16:00</span>
                        </div>
                        <div className="h-40 w-full">
                            <ResponsiveContainer width="100%" height="100%">
                                <AreaChart data={[
                                    { time: '08:00', val: 12 }, { time: '10:00', val: 18 }, { time: '12:00', val: 15 },
                                    { time: '14:00', val: 22 }, { time: '16:00', val: 28 }, { time: '18:00', val: 20 }
                                ]}>
                                    <defs>
                                        <linearGradient id="colorInc" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="#1e3a8a" stopOpacity={0.2}/>
                                            <stop offset="95%" stopColor="#1e3a8a" stopOpacity={0}/>
                                        </linearGradient>
                                    </defs>
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f4f4f5" />
                                    <XAxis dataKey="time" axisLine={false} tickLine={false} tick={{fontSize: 10, fill: '#a1a1aa'}} />
                                    <Tooltip contentStyle={{ borderRadius: '12px', border: 'none' }} />
                                    <Area type="monotone" dataKey="val" stroke="#1e3a8a" strokeWidth={3} fillOpacity={1} fill="url(#colorInc)" />
                                </AreaChart>
                            </ResponsiveContainer>
                        </div>
                    </div>

                    {/* Unit Deployment */}
                    <div className="bg-white p-6 rounded-[2.5rem] border border-zinc-200 shadow-sm relative overflow-hidden">
                        <div className="flex justify-between items-center mb-6">
                            <h3 className="font-bold text-sm text-zinc-900">Unit Deployment</h3>
                            <button className="p-1 hover:bg-zinc-100 rounded-full text-zinc-400"><MoreHorizontal size={16} /></button>
                        </div>
                        <div className="space-y-4">
                            {unitStatus.map((unit, i) => (
                                <div key={i}>
                                    <div className="flex justify-between text-xs mb-1 font-medium text-zinc-600">
                                        <span>{unit.status}</span>
                                        <span>{unit.count}</span>
                                    </div>
                                    <div className="w-full bg-zinc-100 h-1.5 rounded-full overflow-hidden">
                                        <motion.div 
                                            initial={{ width: 0 }}
                                            animate={{ width: `${(unit.count / unit.total) * 100}%` }}
                                            transition={{ duration: 1 }}
                                            className={`h-full rounded-full ${unit.color}`} 
                                        />
                                    </div>
                                </div>
                            ))}
                        </div>
                        {/* Decor */}
                        <div className="absolute -bottom-10 -right-10 w-32 h-32 bg-blue-900/5 rounded-full blur-2xl pointer-events-none"></div>
                    </div>

                </div>
            </div>

            {/* RIGHT: LIVE FEED & DISPATCH (4 Cols) */}
            <div className="lg:col-span-4 flex flex-col gap-6">
                
                {/* Dispatch Status (Dark Card) */}
                <div className={`text-white rounded-[2.5rem] p-8 shadow-xl relative overflow-hidden transition-colors duration-500 ${isEmergency ? 'bg-rose-950 shadow-rose-200' : 'bg-blue-950 shadow-blue-200'}`}>
                    <div className="relative z-10">
                        <div className="flex justify-between items-center mb-6">
                            <h3 className="font-bold text-lg">Dispatch</h3>
                            <div className={`p-2 rounded-full animate-pulse ${isEmergency ? 'bg-rose-500/20' : 'bg-white/10'}`}>
                                <Radio size={16} className={`${isEmergency ? 'text-rose-300' : 'text-blue-300'}`} />
                            </div>
                        </div>

                        <div className="space-y-4">
                            <div className="flex justify-between items-center p-3 bg-white/5 rounded-2xl border border-white/5">
                                <div>
                                    <p className={`text-[10px] font-bold uppercase ${isEmergency ? 'text-rose-200' : 'text-blue-200'}`}>Available Units</p>
                                    <p className="text-xl font-bold">{unitStatus[0].count}</p>
                                </div>
                                <Car size={20} className={`${isEmergency ? 'text-rose-400' : 'text-blue-400'}`} />
                            </div>
                            <div className="flex justify-between items-center p-3 bg-white/5 rounded-2xl border border-white/5">
                                <div>
                                    <p className={`text-[10px] font-bold uppercase ${isEmergency ? 'text-rose-200' : 'text-blue-200'}`}>Response Efficiency</p>
                                    <p className="text-xl font-bold">{kpiData[2].value}%</p>
                                </div>
                                <CheckCircle2 size={20} className="text-emerald-400" />
                            </div>
                        </div>
                    </div>
                    {/* Decor */}
                    <div className={`absolute top-0 right-0 w-64 h-64 blur-[60px] rounded-full pointer-events-none ${isEmergency ? 'bg-rose-500/20' : 'bg-blue-500/10'}`}></div>
                </div>

                {/* Incident Feed */}
                <div className="bg-white border border-zinc-200 rounded-[2.5rem] p-6 shadow-sm flex-1 flex flex-col min-h-[500px]">
                    <div className="flex items-center justify-between mb-4 px-2">
                        <h3 className="text-lg font-bold text-zinc-900 tracking-tight">Live Feed</h3>
                        <div className="flex gap-1">
                            <span className="w-2 h-2 rounded-full bg-rose-500 animate-pulse"></span>
                            <span className="text-[10px] font-bold text-rose-500 uppercase">Real-time</span>
                        </div>
                    </div>
                    
                    {/* NEW FEATURE: SEARCH & FILTER UI */}
                    <div className="mb-4 space-y-3">
                        <div className="relative">
                            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400" />
                            <input 
                                type="text" 
                                placeholder="Search location or type..." 
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full bg-zinc-50 border border-zinc-100 rounded-xl py-2 pl-9 pr-3 text-xs font-medium text-zinc-700 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                            />
                        </div>
                        <div className="flex gap-2 overflow-x-auto pb-1 no-scrollbar">
                            {['all', 'high', 'med', 'low'].map(priority => (
                                <button 
                                    key={priority}
                                    onClick={() => setFilterPriority(priority)}
                                    className={`px-3 py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-wider whitespace-nowrap transition-colors ${
                                        filterPriority === priority 
                                        ? 'bg-zinc-900 text-white' 
                                        : 'bg-zinc-100 text-zinc-500 hover:bg-zinc-200'
                                    }`}
                                >
                                    {priority}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="space-y-2 flex-1 overflow-y-auto max-h-[400px] pr-1 custom-scrollbar">
                        <AnimatePresence initial={false}>
                            {filteredIncidents.map((inc) => (
                                <motion.div 
                                    layout
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, scale: 0.9 }}
                                    key={inc.id} 
                                    onClick={() => setSelectedIncident(inc)} // Trigger Dispatch Modal
                                    className="flex gap-4 items-start p-3 hover:bg-blue-50 rounded-2xl transition-all cursor-pointer group border border-transparent hover:border-blue-100"
                                >
                                    <div className={`mt-1 w-2.5 h-2.5 rounded-full shrink-0 ${
                                        inc.priority === 'high' ? 'bg-rose-500 animate-pulse' : 
                                        inc.priority === 'med' ? 'bg-amber-400' : 'bg-emerald-400'
                                    }`} />
                                    
                                    <div className="flex-1 min-w-0">
                                        <div className="flex justify-between items-start">
                                            <p className="text-sm font-bold text-zinc-900 truncate group-hover:text-blue-900 transition-colors">{inc.type}</p>
                                            <span className="text-[10px] text-zinc-400 whitespace-nowrap bg-zinc-50 px-1.5 py-0.5 rounded-md">{inc.time}</span>
                                        </div>
                                        <div className="flex items-center gap-1.5 mt-1">
                                            <MapPin size={10} className="text-zinc-400 group-hover:text-blue-400" />
                                            <p className="text-[11px] text-zinc-500 truncate">{inc.loc}</p>
                                        </div>
                                    </div>
                                    <div className="opacity-0 group-hover:opacity-100 transition-opacity self-center">
                                        <div className="w-6 h-6 rounded-full bg-blue-100 flex items-center justify-center text-blue-600">
                                            <Navigation size={12} />
                                        </div>
                                    </div>
                                </motion.div>
                            ))}
                            {filteredIncidents.length === 0 && (
                                <div className="text-center py-8 text-zinc-400 text-xs">No incidents found matching criteria.</div>
                            )}
                        </AnimatePresence>
                    </div>

                    <button className="w-full mt-4 py-3 text-xs font-bold text-blue-900 bg-blue-50 border border-blue-100 rounded-xl hover:bg-blue-100 transition-colors uppercase tracking-wider flex items-center justify-center gap-2">
                        View All Reports <ArrowRight size={14} />
                    </button>
                </div>

            </div>
        </div>
        
        {/* DISPATCH MODAL COMPONENT (Rendered Conditionally) */}
        <AnimatePresence>
            {selectedIncident && (
                <DispatchModal 
                    incident={selectedIncident} 
                    onClose={() => setSelectedIncident(null)} 
                    onAssign={(unitId) => {
                        // Simulation: Change incident status or remove
                        alert(`Unit ${unitId} dispatched to ${selectedIncident.type}`);
                        setSelectedIncident(null);
                    }}
                />
            )}
        </AnimatePresence>

    </PageLayout>
  );
}