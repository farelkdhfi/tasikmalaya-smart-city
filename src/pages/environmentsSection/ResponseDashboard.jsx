import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Siren, 
  Truck, 
  Shield, 
  PhoneIncoming, 
  Clock, 
  MapPin, 
  Activity, 
  CheckCircle2, 
  AlertOctagon,
  MoreHorizontal,
  ArrowRight,
  ArrowUpRight,
  Flame,
  Stethoscope,
  Radio,
  CloudRain,
  Sun,
  X,
  Mic2
} from 'lucide-react';

import PageLayout from '../../components/PageLayout'; 

// --- UTILS & GENERATORS ---
const UNIT_TYPES = ['ambulance', 'police', 'fire'];
const LOCATIONS = ['Cihideung Blk A', 'Pasar Wetan', 'Simpang Lima', 'Dadaha Park', 'Alun-alun', 'Mitra Batik'];
const PRIORITIES = ['Low', 'Medium', 'High', 'Critical'];
const RADIO_CHATTER = [
    "Unit 104, proceed to Sector 4.",
    "Dispatch, we have a 10-23 at location.",
    "Fire command requesting backup at Hz Mustofa.",
    "Suspect fled on foot, heading north.",
    "Patient stabilized, en route to hospital.",
    "Traffic control needed at intersection.",
    "All units, be advised: Heavy rain in sector 2."
];

const getRandomInt = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;

// --- SUB-COMPONENTS ---

const SectionHeader = ({ title, subtitle, extraContent }) => (
    <div className="flex justify-between items-end mb-6 px-2 border-b border-zinc-200/60 pb-4">
        <div>
            <span className="text-xs font-semibold text-rose-600 uppercase tracking-wider mb-1 block">{subtitle}</span>
            <h2 className="text-2xl font-semibold text-zinc-900 tracking-tight">{title}</h2>
        </div>
        {extraContent}
    </div>
);

const TrendBadge = ({ value, invert = false }) => {
    // For emergency: More cases (+) is bad (Rose), Less time (-) is good (Emerald)
    // invert prop swaps this logic
    const isBad = invert ? value < 0 : value > 0; 
    
    return (
        <div className={`flex items-center gap-1 text-xs font-medium px-2 py-1 rounded-full ${
            isBad ? 'bg-rose-50 text-rose-700' : 'bg-emerald-50 text-emerald-700'
        }`}>
            {value > 0 ? <ArrowUpRight size={12} /> : <ArrowRight size={12} className="rotate-45" />}
            {Math.abs(value).toFixed(1)}%
        </div>
    );
};

const MetricCard = ({ item }) => (
    <motion.div
        layout
        whileHover={{ y: -4, scale: 1.02 }}
        className="bg-white rounded-3xl p-5 h-48 flex flex-col justify-between shadow-sm hover:shadow-xl hover:shadow-rose-500/5 border border-zinc-100 transition-all duration-300 group cursor-pointer relative overflow-hidden"
    >
        <div className="flex justify-between items-start z-10">
            <div className={`w-10 h-10 rounded-2xl flex items-center justify-center transition-colors duration-300 ${item.status === 'Critical' || item.status === 'Alert' ? 'bg-rose-50 text-rose-600' : 'bg-zinc-50 text-zinc-900 group-hover:bg-rose-600 group-hover:text-white'}`}>
                <item.icon size={20} />
            </div>
            <div className="w-7 h-7 rounded-full bg-zinc-100 flex items-center justify-center text-zinc-400 group-hover:text-rose-600 transition-colors">
                <ArrowUpRight size={14} />
            </div>
        </div>
        <div className="z-10 mt-auto">
            <div className="flex justify-between items-end mb-1">
                <h3 className="text-3xl font-bold text-zinc-900 tracking-tight leading-none group-hover:text-rose-600 transition-colors">
                    {item.value}
                </h3>
                <TrendBadge value={item.trend} invert={item.label === 'Avg Response' || item.label === 'Unit Avail.'} />
            </div>
            <p className="text-xs text-zinc-500 font-medium uppercase tracking-wide">{item.label}</p>
        </div>
        <div className="absolute -right-4 -bottom-4 opacity-0 group-hover:opacity-5 transition-opacity duration-500 pointer-events-none">
            <item.icon size={100} />
        </div>
    </motion.div>
);

const IncidentDonutChart = ({ total }) => (
  <div className="relative w-32 h-32 flex items-center justify-center">
    <svg viewBox="0 0 36 36" className="w-full h-full transform -rotate-90">
      <path d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="#f4f4f5" strokeWidth="4" />
      {/* Animated segments based on mock visual data for effect */}
      <motion.path 
        initial={{ pathLength: 0 }} animate={{ pathLength: 0.6 }} transition={{ duration: 2, repeat: Infinity, repeatType: "mirror" }}
        d="M18 2.0845 a 15.9155 15.9155 0 0 1 15.14 10.9" fill="none" stroke="#e11d48" strokeWidth="4" strokeDasharray="40, 100" strokeLinecap="round" 
      />
      <path d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831" fill="none" stroke="#3b82f6" strokeWidth="4" strokeDasharray="30, 100" strokeDashoffset="-40" strokeLinecap="round" />
      <path d="M18 2.0845 a 15.9155 15.9155 0 0 1 -10.9 26.6" fill="none" stroke="#f97316" strokeWidth="4" strokeDasharray="20, 100" strokeDashoffset="-70" strokeLinecap="round" />
    </svg>
    <div className="absolute flex flex-col items-center">
      <span className="text-2xl font-bold text-zinc-900 tracking-tighter">{total}</span>
      <span className="text-[9px] uppercase text-zinc-400 font-bold tracking-widest">Total</span>
    </div>
  </div>
);

// --- MAIN COMPONENT ---

export default function ResponseDashboard() {
  // STATE
  const [currentTime, setCurrentTime] = useState(new Date());
  
  // Dynamic Data States
  const [metrics, setMetrics] = useState([
    { id: 1, label: 'Active Cases', sub: 'Live Incidents', value: 42, trend: 8, status: 'Critical', color: 'text-rose-600', icon: Siren },
    { id: 2, label: 'Avg Response', sub: 'Time to Scene', value: '08:12', trend: -12, status: 'Optimal', color: 'text-blue-600', icon: Clock },
    { id: 3, label: 'Unit Avail.', sub: 'Ready to dispatch', value: 18, trend: -2, status: 'Warning', color: 'text-emerald-600', icon: Truck },
    { id: 4, label: 'Critical', sub: 'High Priority', value: 5, trend: 1, status: 'Alert', color: 'text-orange-600', icon: AlertOctagon },
  ]);

  const [queue, setQueue] = useState([
    { id: 'CSE-01', type: 'Medical', loc: 'Cihideung Blk A', status: 'Dispatched', unit: 'MED-04', time: '2m', priority: 'High', notes: 'Patient complaining of chest pain.' },
    { id: 'CSE-02', type: 'Fire', loc: 'Pasar Wetan', status: 'Pending', unit: '--', time: '1m', priority: 'Critical', notes: 'Smoke reported from 2nd floor shop.' },
    { id: 'CSE-03', type: 'Police', loc: 'Simpang Lima', status: 'On Scene', unit: 'POL-09', time: '12m', priority: 'Medium', notes: 'Minor traffic collision, no injuries.' },
  ]);

  const [units, setUnits] = useState([
    { id: 'u1', type: 'ambulance', x: 20, y: 30, status: 'moving', callSign: 'MED-04' },
    { id: 'u2', type: 'police', x: 60, y: 20, status: 'stationary', callSign: 'POL-01' },
    { id: 'u3', type: 'fire', x: 40, y: 70, status: 'moving', callSign: 'FIRE-02' },
    { id: 'u4', type: 'police', x: 80, y: 50, status: 'moving', callSign: 'POL-09' },
    { id: 'u5', type: 'ambulance', x: 10, y: 80, status: 'stationary', callSign: 'MED-12' },
  ]);

  // NEW FEATURE STATES
  const [mapFilter, setMapFilter] = useState('all'); // Feature 1: Map Filters
  const [threatLevel, setThreatLevel] = useState('Low'); // Feature 3: Threat Level
  const [isRaining, setIsRaining] = useState(false); // Feature 4: Weather
  const [selectedIncident, setSelectedIncident] = useState(null); // Feature 5: Detail Modal
  const [currentChatter, setCurrentChatter] = useState(RADIO_CHATTER[0]); // Feature 2: Radio Ticker

  // --- SIMULATION ENGINE ---
  useEffect(() => {
    const interval = setInterval(() => {
        setCurrentTime(new Date());

        // 1. Simulate Unit Movement (Random Walk)
        setUnits(prev => prev.map(u => ({
            ...u,
            x: Math.max(5, Math.min(95, u.x + (Math.random() - 0.5) * 5)),
            y: Math.max(5, Math.min(95, u.y + (Math.random() - 0.5) * 5)),
            status: Math.random() > 0.7 ? 'moving' : 'stationary'
        })));

        // 2. Simulate Queue Updates
        if (Math.random() > 0.6) {
            // Add new call randomly
            if (queue.length < 8) {
                const types = ['Medical', 'Fire', 'Police'];
                const newCall = {
                    id: `CSE-${Math.floor(Math.random() * 900) + 100}`,
                    type: types[Math.floor(Math.random() * types.length)],
                    loc: LOCATIONS[Math.floor(Math.random() * LOCATIONS.length)],
                    status: 'Pending',
                    unit: '--',
                    time: 'Just now',
                    priority: PRIORITIES[Math.floor(Math.random() * PRIORITIES.length)],
                    notes: 'Caller reporting incident.'
                };
                setQueue(prev => [newCall, ...prev]);
                setCurrentChatter(`New Incident: ${newCall.type} at ${newCall.loc}`);
            }
        }
        
        // Progress existing calls
        setQueue(prev => prev.map(q => {
            if (q.status === 'Pending' && Math.random() > 0.5) return { ...q, status: 'Dispatched', unit: 'AUT-01' };
            if (q.status === 'Dispatched' && Math.random() > 0.7) return { ...q, status: 'On Scene' };
            if (q.status === 'On Scene' && Math.random() > 0.8) return { ...q, status: 'Resolved' };
            return q;
        }).filter(q => q.status !== 'Resolved')); // Remove resolved for cleanup

        // 3. Update Metrics
        setMetrics(prev => {
            const activeCount = queue.length;
            const criticalCount = queue.filter(q => q.priority === 'Critical').length;
            return prev.map(m => {
                if (m.label === 'Active Cases') return { ...m, value: 40 + activeCount, trend: activeCount - 2 };
                if (m.label === 'Critical') return { ...m, value: criticalCount, trend: criticalCount > 2 ? 1 : -1 };
                if (m.label === 'Avg Response') {
                   // Rain increases response time logic
                   return { ...m, value: isRaining ? '10:45' : '08:12', status: isRaining ? 'Warning' : 'Optimal' };
                }
                return m;
            });
        });

        // 4. Radio Chatter Randomizer
        if(Math.random() > 0.7) {
            setCurrentChatter(RADIO_CHATTER[Math.floor(Math.random() * RADIO_CHATTER.length)]);
        }

    }, 3000);

    return () => clearInterval(interval);
  }, [queue.length, isRaining]);

  // Filter Logic
  const filteredUnits = mapFilter === 'all' ? units : units.filter(u => u.type === mapFilter);

  return (
    <PageLayout 
        title="Emergency Response" 
        subtitle="Command Center" 
        colorTheme="rose" 
    >
        {/* --- FEATURE 5: INCIDENT DETAIL MODAL --- */}
        <AnimatePresence>
            {selectedIncident && (
                <motion.div 
                    initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 10 }}
                    className="fixed inset-0 z-50 flex items-center justify-center bg-black/20 backdrop-blur-sm pointer-events-auto"
                    onClick={() => setSelectedIncident(null)}
                >
                    <div className="bg-white rounded-3xl p-6 shadow-2xl max-w-sm w-full border border-zinc-200" onClick={e => e.stopPropagation()}>
                        <div className="flex justify-between items-start mb-4">
                            <div>
                                <span className="text-[10px] font-bold uppercase text-zinc-400">Incident ID</span>
                                <h3 className="text-2xl font-bold text-zinc-900">{selectedIncident.id}</h3>
                            </div>
                            <button onClick={() => setSelectedIncident(null)} className="p-2 hover:bg-zinc-100 rounded-full"><X size={18}/></button>
                        </div>
                        <div className="space-y-4">
                            <div className={`p-3 rounded-xl border ${selectedIncident.priority === 'Critical' ? 'bg-rose-50 border-rose-100' : 'bg-zinc-50 border-zinc-100'}`}>
                                <div className="flex items-center gap-2 mb-1">
                                    <AlertOctagon size={14} className={selectedIncident.priority === 'Critical' ? 'text-rose-600' : 'text-zinc-500'} />
                                    <span className="text-sm font-bold">{selectedIncident.type} Emergency</span>
                                </div>
                                <p className="text-xs text-zinc-600">{selectedIncident.notes}</p>
                            </div>
                            <div className="grid grid-cols-2 gap-2 text-xs">
                                <div className="bg-zinc-50 p-2 rounded-lg">
                                    <span className="block text-zinc-400 font-bold uppercase text-[9px]">Location</span>
                                    <span className="font-semibold">{selectedIncident.loc}</span>
                                </div>
                                <div className="bg-zinc-50 p-2 rounded-lg">
                                    <span className="block text-zinc-400 font-bold uppercase text-[9px]">Unit</span>
                                    <span className="font-semibold text-blue-600">{selectedIncident.unit}</span>
                                </div>
                            </div>
                            <button className="w-full py-3 bg-zinc-900 text-white rounded-xl font-bold text-sm hover:bg-zinc-800 transition-colors">
                                Dispatch Support
                            </button>
                        </div>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>

        {/* --- HEADER WITH NEW FEATURES --- */}
        <SectionHeader 
            title="Overview" 
            subtitle="Metrics" 
            extraContent={
                <div className="flex items-center gap-4">
                    {/* FEATURE 3: THREAT LEVEL */}
                    <div 
                        onClick={() => setThreatLevel(prev => prev === 'Low' ? 'High' : 'Low')}
                        className={`hidden md:flex items-center gap-2 px-3 py-1.5 rounded-full border cursor-pointer transition-all ${threatLevel === 'High' ? 'bg-rose-100 border-rose-200 text-rose-700 animate-pulse' : 'bg-zinc-100 border-zinc-200 text-zinc-600'}`}
                    >
                        <Activity size={14} />
                        <span className="text-xs font-bold uppercase">Threat: {threatLevel}</span>
                    </div>

                    {/* FEATURE 4: WEATHER WIDGET */}
                    <div 
                        onClick={() => setIsRaining(!isRaining)}
                        className={`flex items-center gap-2 px-3 py-1.5 rounded-full border cursor-pointer transition-colors ${isRaining ? 'bg-blue-50 border-blue-200' : 'bg-white border-zinc-200'}`}
                    >
                        {isRaining ? <CloudRain size={16} className="text-blue-500" /> : <Sun size={16} className="text-orange-500" />}
                        <span className="text-xs font-bold text-zinc-700 hidden sm:inline">{isRaining ? 'Rainy' : 'Clear'}</span>
                    </div>
                    
                    <div className="text-right">
                        <div className="text-zinc-900 font-bold text-sm">{currentTime.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</div>
                        <div className="text-zinc-400 text-[10px] font-bold uppercase">System Live</div>
                    </div>
                </div>
            }
        />

        {/* --- KPI SECTION --- */}
        <section className="mb-8">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {metrics.map((stat) => (
                    <MetricCard key={stat.id} item={stat} />
                ))}
            </div>
        </section>

        {/* --- MAIN GRID LAYOUT --- */}
        <section className="grid grid-cols-1 lg:grid-cols-12 gap-6 min-h-[600px]">
            
            {/* LEFT: DISPATCH MAP (8 Cols) */}
            <div className="lg:col-span-8 flex flex-col gap-6">
                
                <motion.div 
                    layout
                    className="bg-zinc-50 rounded-[2.5rem] shadow-sm border border-zinc-200 relative overflow-hidden h-full min-h-[500px] group"
                >
                    {/* Map Texture */}
                    <div className="absolute inset-0">
                         {/* Grid Pattern */}
                        <div className="absolute inset-0 opacity-[0.05] bg-[linear-gradient(to_right,#000000_1px,transparent_1px),linear-gradient(to_bottom,#000000_1px,transparent_1px)] bg-[size:40px_40px]"></div>
                        
                        {/* Abstract City Blocks */}
                        <div className="absolute top-1/4 left-1/4 w-32 h-32 bg-zinc-200/50 rounded-lg"></div>
                        <div className="absolute bottom-1/3 right-1/4 w-48 h-24 bg-zinc-200/50 rounded-lg"></div>
                        <div className="absolute top-1/2 left-1/2 w-64 h-64 border border-zinc-200 rounded-full -translate-x-1/2 -translate-y-1/2 opacity-50"></div>
                        <div className={`absolute top-1/2 left-1/2 w-96 h-96 border rounded-full -translate-x-1/2 -translate-y-1/2 opacity-30 transition-colors duration-1000 ${threatLevel === 'High' ? 'border-rose-400' : 'border-zinc-200'}`}></div>

                        {/* Active Units */}
                        <AnimatePresence>
                        {filteredUnits.map((unit) => (
                            <motion.div
                                key={unit.id}
                                className="absolute"
                                initial={{ opacity: 0, scale: 0 }}
                                animate={{ 
                                    opacity: 1, 
                                    scale: 1,
                                    x: `${unit.x}%`, // Using simple percentage positioning for demo
                                    y: `${unit.y}%`, 
                                    left: 0, top: 0 // Reset standard pos
                                }}
                                exit={{ opacity: 0 }}
                                transition={{ duration: 3, ease: "linear" }}
                            >
                                <div className="relative group/unit cursor-pointer hover:scale-110 transition-transform">
                                    {/* Pulse for moving/active */}
                                    {unit.status === 'moving' && (
                                        <span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-40 -m-2 p-4 ${unit.type === 'ambulance' ? 'bg-rose-400' : unit.type === 'fire' ? 'bg-orange-400' : 'bg-blue-400'}`}></span>
                                    )}
                                    
                                    {/* Icon */}
                                    <div className={`w-8 h-8 rounded-full border-2 border-white shadow-lg flex items-center justify-center z-10 relative
                                        ${unit.type === 'ambulance' ? 'bg-rose-500' : unit.type === 'police' ? 'bg-slate-800' : 'bg-orange-500'}`}>
                                        {unit.type === 'ambulance' && <Stethoscope size={14} className="text-white" />}
                                        {unit.type === 'police' && <Shield size={14} className="text-white" />}
                                        {unit.type === 'fire' && <Flame size={14} className="text-white" />}
                                    </div>

                                    {/* Floating Label */}
                                    <div className="absolute top-full left-1/2 -translate-x-1/2 mt-2 px-2 py-1 bg-zinc-900 text-white text-[9px] font-bold rounded opacity-0 group-hover/unit:opacity-100 transition-opacity whitespace-nowrap z-20 pointer-events-none">
                                        {unit.callSign}
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                        </AnimatePresence>
                    </div>

                    {/* Overlay Controls */}
                    <div className="absolute top-6 left-6 z-20">
                        <div className="bg-white/90 backdrop-blur-md px-4 py-2 rounded-2xl border border-zinc-200 shadow-sm flex items-center gap-3">
                            <Radio size={16} className="text-rose-600 animate-pulse" />
                            <span className="text-xs font-bold text-zinc-900 uppercase tracking-wide">Live Dispatch</span>
                        </div>
                    </div>

                    {/* FEATURE 1: MAP FILTERS */}
                    <div className="absolute bottom-16 right-6 flex gap-2 flex-col sm:flex-row z-20">
                         {['all', 'ambulance', 'police', 'fire'].map(type => (
                             <button 
                                key={type}
                                onClick={() => setMapFilter(type)}
                                className={`px-3 py-1.5 rounded-full border shadow-sm flex items-center gap-2 text-[10px] font-bold uppercase transition-all ${
                                    mapFilter === type ? 'bg-zinc-800 text-white border-zinc-900' : 'bg-white/90 backdrop-blur-md text-zinc-500 border-zinc-200 hover:bg-zinc-50'
                                }`}
                             >
                                 {type === 'all' && 'All Units'}
                                 {type === 'ambulance' && <><span className="w-2 h-2 rounded-full bg-rose-500"></span> Med</>}
                                 {type === 'police' && <><span className="w-2 h-2 rounded-full bg-slate-800"></span> Pol</>}
                                 {type === 'fire' && <><span className="w-2 h-2 rounded-full bg-orange-500"></span> Fire</>}
                             </button>
                         ))}
                    </div>

                    {/* FEATURE 2: RADIO COMMS TICKER */}
                    <div className="absolute bottom-0 left-0 w-full bg-zinc-900/90 backdrop-blur-md border-t border-zinc-800 p-2 z-20">
                        <div className="flex items-center gap-4 overflow-hidden">
                            <div className="shrink-0 flex items-center gap-2 text-rose-500 px-2 border-r border-zinc-700">
                                <Mic2 size={12} /> <span className="text-[10px] font-bold uppercase">Ch. 1</span>
                            </div>
                            <motion.div 
                                key={currentChatter} // Re-animate on change
                                initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}
                                className="text-xs font-mono text-zinc-300 whitespace-nowrap"
                            >
                                {currentChatter}
                            </motion.div>
                        </div>
                    </div>

                </motion.div>
            </div>

            {/* RIGHT: SIDEBAR (4 Cols) */}
            <div className="lg:col-span-4 flex flex-col gap-6">
                
                {/* 1. CALL QUEUE */}
                <div className="bg-white border border-zinc-200 rounded-[2rem] p-6 shadow-sm flex-1 relative overflow-hidden flex flex-col">
                    <div className="flex items-center justify-between mb-6 relative z-10">
                        <h3 className="font-bold text-zinc-900 flex items-center gap-2">
                            <PhoneIncoming size={18} className="text-zinc-400" /> Incoming
                        </h3>
                        <span className="text-[10px] font-bold bg-rose-100 text-rose-600 px-2 py-1 rounded-full animate-pulse">
                            {queue.length} LIVE
                        </span>
                    </div>

                    <div className="space-y-4 relative z-10 overflow-y-auto max-h-[400px] pr-2 custom-scrollbar">
                        <AnimatePresence initial={false}>
                        {queue.map((call) => (
                            <motion.div 
                                key={call.id} 
                                layout
                                initial={{ opacity: 0, height: 0 }} 
                                animate={{ opacity: 1, height: 'auto' }}
                                exit={{ opacity: 0, height: 0 }}
                                onClick={() => setSelectedIncident(call)} // Open Modal
                                className="group p-3 rounded-2xl border border-zinc-100 hover:border-rose-100 hover:bg-rose-50/30 transition-all cursor-pointer"
                            >
                                <div className="flex justify-between items-start mb-1">
                                    <div className="flex flex-col">
                                        <span className="text-xs font-bold text-zinc-800">{call.type} Emergency</span>
                                        <span className="text-[10px] text-zinc-400">{call.loc}</span>
                                    </div>
                                    <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded uppercase ${
                                        call.priority === 'Critical' ? 'bg-rose-500 text-white' : 
                                        call.priority === 'High' ? 'bg-orange-100 text-orange-600' : 'bg-zinc-100 text-zinc-500'
                                    }`}>
                                        {call.priority}
                                    </span>
                                </div>
                                <div className="flex items-center justify-between mt-2">
                                     <div className="flex items-center gap-1 text-[10px] text-zinc-500">
                                        <Clock size={10} /> {call.time} ago
                                     </div>
                                     <div className="flex items-center gap-1">
                                        {call.status === 'Pending' && <span className="w-1.5 h-1.5 rounded-full bg-orange-400 animate-pulse"></span>}
                                        <span className={`text-[10px] font-bold ${call.status === 'Pending' ? 'text-orange-500' : 'text-blue-600'}`}>
                                            {call.status}
                                        </span>
                                     </div>
                                </div>
                            </motion.div>
                        ))}
                        </AnimatePresence>
                    </div>
                    
                    {/* Decor */}
                    <div className="absolute top-0 right-0 w-32 h-32 bg-rose-500/5 rounded-full blur-2xl pointer-events-none"></div>
                </div>

                {/* 2. ANALYTICS CARD */}
                <div className="bg-zinc-900 text-white border border-zinc-800 rounded-[2rem] p-6 shadow-sm flex items-center justify-between relative overflow-hidden">
                    <div className="relative z-10">
                         <h4 className="text-sm font-bold text-zinc-300 mb-1">Total Incidents</h4>
                         <div className="flex items-center gap-2 mb-4">
                            <span className="text-[10px] uppercase tracking-widest text-zinc-500">Today</span>
                         </div>
                         <div className="flex gap-4">
                            <div>
                                <div className="text-[10px] text-rose-400 font-bold mb-1">MED</div>
                                <div className="h-1 w-8 bg-zinc-800 rounded-full overflow-hidden"><div className="h-full bg-rose-500 w-[60%]"></div></div>
                            </div>
                            <div>
                                <div className="text-[10px] text-blue-400 font-bold mb-1">POL</div>
                                <div className="h-1 w-8 bg-zinc-800 rounded-full overflow-hidden"><div className="h-full bg-blue-500 w-[30%]"></div></div>
                            </div>
                         </div>
                    </div>
                    
                    <div className="relative z-10 scale-90">
                        <IncidentDonutChart total={124 + queue.length} />
                    </div>

                    {/* Decor */}
                    <div className="absolute bottom-0 left-0 w-full h-1/2 bg-gradient-to-t from-rose-900/20 to-transparent pointer-events-none"></div>
                </div>

            </div>
        </section>

        {/* --- BOTTOM: SLA SECTION --- */}
        <section className="mt-6">
            <div className="bg-white rounded-[2rem] border border-zinc-200 p-8 shadow-sm flex flex-col md:flex-row items-center justify-between gap-6">
                <div>
                    <h3 className="text-lg font-bold text-zinc-900 tracking-tight">SLA Performance</h3>
                    <p className="text-xs text-zinc-500 uppercase tracking-wide">Response Time Targets • Last 24h</p>
                </div>
                <div className="flex-1 w-full h-16 relative">
                     {/* Abstract Chart */}
                     <svg className="w-full h-full overflow-visible" preserveAspectRatio="none">
                         <path d="M0 60 Q 100 20, 200 40 T 400 10 T 600 30" fill="none" stroke="#e11d48" strokeWidth="2" />
                         <motion.path 
                            d="M0 60 Q 100 20, 200 40 T 400 10 T 600 30" 
                            stroke="#e11d48" strokeWidth="4" strokeOpacity="0.2" fill="none"
                            animate={{ d: ["M0 60 Q 100 25, 200 45 T 400 15 T 600 35", "M0 60 Q 100 20, 200 40 T 400 10 T 600 30"] }}
                            transition={{ duration: 2, repeat: Infinity, repeatType: "mirror" }}
                         />
                         <defs>
                            <linearGradient id="grad" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="0%" stopColor="#e11d48" />
                                <stop offset="100%" stopColor="transparent" />
                            </linearGradient>
                         </defs>
                     </svg>
                </div>
                <div className="text-right">
                    <span className="text-3xl font-bold text-emerald-600">98.2%</span>
                    <span className="block text-[10px] text-zinc-400 font-bold uppercase tracking-widest">Within Target</span>
                </div>
            </div>
        </section>

    </PageLayout>
  );
}