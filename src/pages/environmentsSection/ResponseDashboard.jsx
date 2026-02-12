import React, { useState, useEffect, useCallback } from 'react';
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

// --- UTILS & CONSTANTS ---
const UNIT_TYPES = ['ambulance', 'police', 'fire'];

// Mapping Location Name to Map Coordinates (0-100%)
const LOCATION_COORDS = {
    'Cihideung Blk A': { x: 20, y: 30 },
    'Pasar Wetan': { x: 70, y: 25 },
    'Simpang Lima': { x: 50, y: 50 },
    'Dadaha Park': { x: 80, y: 80 },
    'Alun-alun': { x: 30, y: 70 },
    'Mitra Batik': { x: 15, y: 15 },
    'Hz Mustofa': { x: 60, y: 60 },
    'Sector 4': { x: 90, y: 20 }
};

const LOCATIONS = Object.keys(LOCATION_COORDS);
const PRIORITIES = ['Low', 'Medium', 'High', 'Critical'];

const RADIO_CHATTER = [
    "Unit 104, proceed to Sector 4.",
    "Dispatch, we have a 10-23 at location.",
    "Fire command requesting backup at Hz Mustofa.",
    "Suspect fled on foot, heading north.",
    "Patient stabilized, en route to hospital.",
    "Traffic control needed at intersection.",
    "All units, be advised: Heavy rain in sector 2.",
    "Code 4, situation under control.",
    "ETA 2 minutes to target."
];

// Helper to calculate distance between two points
const getDistance = (x1, y1, x2, y2) => Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2));

// --- SUB-COMPONENTS ---

const SectionHeader = ({ title, subtitle, extraContent }) => (
    // RESPONSIVE: Stack vertical on mobile, row on desktop (md)
    <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-6 px-2 border-b border-zinc-200/60 pb-4 gap-4 md:gap-0">
        <div>
            <span className="text-xs font-semibold text-rose-600 uppercase tracking-wider mb-1 block">{subtitle}</span>
            <h2 className="text-xl md:text-2xl font-semibold text-zinc-900 tracking-tight">{title}</h2>
        </div>
        <div className="w-full md:w-auto">
            {extraContent}
        </div>
    </div>
);

const TrendBadge = ({ value, invert = false }) => {
    const isBad = invert ? value < 0 : value > 0; 
    return (
        <div className={`flex items-center gap-1 text-[10px] md:text-xs font-medium px-2 py-1 rounded-full ${
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
        // RESPONSIVE: Adjust padding and height for mobile
        className="bg-white rounded-3xl p-4 md:p-5 h-40 md:h-48 flex flex-col justify-between shadow-sm hover:shadow-xl hover:shadow-rose-500/5 border border-zinc-100 transition-all duration-300 group cursor-pointer relative overflow-hidden"
    >
        <div className="flex justify-between items-start z-10">
            <div className={`w-8 h-8 md:w-10 md:h-10 rounded-2xl flex items-center justify-center transition-colors duration-300 ${item.status === 'Critical' || item.status === 'Alert' ? 'bg-rose-50 text-rose-600' : 'bg-zinc-50 text-zinc-900 group-hover:bg-rose-600 group-hover:text-white'}`}>
                <item.icon size={18} className="md:w-5 md:h-5" />
            </div>
            <div className="w-6 h-6 md:w-7 md:h-7 rounded-full bg-zinc-100 flex items-center justify-center text-zinc-400 group-hover:text-rose-600 transition-colors">
                <ArrowUpRight size={12} className="md:w-[14px]" />
            </div>
        </div>
        <div className="z-10 mt-auto">
            <div className="flex justify-between items-end mb-1">
                {/* RESPONSIVE: Adjust font size */}
                <h3 className="text-2xl md:text-3xl font-bold text-zinc-900 tracking-tight leading-none group-hover:text-rose-600 transition-colors">
                    {item.value}
                </h3>
                <TrendBadge value={item.trend} invert={item.label === 'Avg Response' || item.label === 'Unit Avail.'} />
            </div>
            <p className="text-[10px] md:text-xs text-zinc-500 font-medium uppercase tracking-wide truncate">{item.label}</p>
        </div>
        <div className="absolute -right-4 -bottom-4 opacity-0 group-hover:opacity-5 transition-opacity duration-500 pointer-events-none">
            <item.icon size={80} className="md:w-[100px] md:h-[100px]" />
        </div>
    </motion.div>
);

const IncidentDonutChart = ({ total, queue }) => {
    // Calculate percentages for visual segments
    const medCount = queue.filter(q => q.type === 'Medical').length;
    const polCount = queue.filter(q => q.type === 'Police').length;
    
    // Simple visual representation lengths (approximate for demo)
    const medLength = (medCount / (total || 1)) * 100;
    const polLength = (polCount / (total || 1)) * 100;
    
    return (
      <div className="relative w-28 h-28 md:w-32 md:h-32 flex items-center justify-center">
        <svg viewBox="0 0 36 36" className="w-full h-full transform -rotate-90">
          <path d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="#f4f4f5" strokeWidth="4" />
          
          <motion.path 
            initial={{ strokeDasharray: "0, 100" }} 
            animate={{ strokeDasharray: `${medLength}, 100` }} 
            transition={{ duration: 1 }}
            d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831" 
            fill="none" stroke="#e11d48" strokeWidth="4" strokeLinecap="round" 
          />
          <motion.path 
            initial={{ strokeDasharray: "0, 100" }} 
            animate={{ strokeDasharray: `${polLength}, 100`, strokeDashoffset: -medLength }} 
            transition={{ duration: 1 }}
            d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831" 
            fill="none" stroke="#3b82f6" strokeWidth="4" strokeLinecap="round" 
          />
        </svg>
        <div className="absolute flex flex-col items-center">
          <span className="text-xl md:text-2xl font-bold text-zinc-900 tracking-tighter">{total}</span>
          <span className="text-[8px] md:text-[9px] uppercase text-zinc-400 font-bold tracking-widest">Total</span>
        </div>
      </div>
    );
};

// --- MAIN COMPONENT ---

export default function ResponseDashboard() {
  // --- CORE STATE ---
  const [currentTime, setCurrentTime] = useState(new Date());
  
  // Controls & Filters
  const [mapFilter, setMapFilter] = useState('all'); 
  const [threatLevel, setThreatLevel] = useState('Low'); 
  const [isRaining, setIsRaining] = useState(false); 
  const [selectedIncident, setSelectedIncident] = useState(null); 
  const [currentChatter, setCurrentChatter] = useState(RADIO_CHATTER[0]); 

  // Data Models
  const [queue, setQueue] = useState([
    { id: 'CSE-01', type: 'Medical', loc: 'Cihideung Blk A', status: 'Pending', unit: '--', time: 2, priority: 'High', notes: 'Patient complaining of chest pain.' },
    { id: 'CSE-02', type: 'Fire', loc: 'Pasar Wetan', status: 'Pending', unit: '--', time: 5, priority: 'Critical', notes: 'Smoke reported from 2nd floor shop.' },
  ]);

  const [units, setUnits] = useState([
    { id: 'u1', type: 'ambulance', x: 20, y: 30, status: 'idle', callSign: 'MED-04', target: null },
    { id: 'u2', type: 'police', x: 60, y: 20, status: 'idle', callSign: 'POL-01', target: null },
    { id: 'u3', type: 'fire', x: 40, y: 70, status: 'idle', callSign: 'FIRE-02', target: null },
    { id: 'u4', type: 'police', x: 80, y: 50, status: 'idle', callSign: 'POL-09', target: null },
    { id: 'u5', type: 'ambulance', x: 10, y: 80, status: 'idle', callSign: 'MED-12', target: null },
  ]);

  const [completedToday, setCompletedToday] = useState(124);

  // --- ACTIONS ---

  // Dispatch Logic: Finds nearest available unit and assigns it
  const handleDispatch = (incident) => {
    // 1. Identify required unit type
    const requiredType = incident.type === 'Medical' ? 'ambulance' : incident.type === 'Fire' ? 'fire' : 'police';
    
    // 2. Find available units of that type
    const availableUnits = units.filter(u => u.type === requiredType && u.status === 'idle');

    if (availableUnits.length === 0) {
        setCurrentChatter(`DISPATCH FAIL: No ${requiredType} units available!`);
        return; // Fail gracefully
    }

    // 3. Find nearest unit
    const incidentCoords = LOCATION_COORDS[incident.loc] || { x: 50, y: 50 };
    let nearestUnit = availableUnits[0];
    let minDist = 9999;

    availableUnits.forEach(u => {
        const dist = getDistance(u.x, u.y, incidentCoords.x, incidentCoords.y);
        if (dist < minDist) {
            minDist = dist;
            nearestUnit = u;
        }
    });

    // 4. Update Unit State
    setUnits(prev => prev.map(u => {
        if (u.id === nearestUnit.id) {
            return { 
                ...u, 
                status: 'moving', // En route
                target: incidentCoords,
                assignedTo: incident.id
            };
        }
        return u;
    }));

    // 5. Update Queue State
    setQueue(prev => prev.map(q => {
        if (q.id === incident.id) {
            return { ...q, status: 'Dispatched', unit: nearestUnit.callSign };
        }
        return q;
    }));

    // 6. UI Feedback
    setSelectedIncident(null);
    setCurrentChatter(`Dispatching ${nearestUnit.callSign} to ${incident.loc}.`);
  };


  // --- SIMULATION ENGINE ---
  useEffect(() => {
    const tickRate = 1000; // 1 second updates
    const interval = setInterval(() => {
        setCurrentTime(new Date());

        // 1. UNIT MOVEMENT LOGIC
        setUnits(prevUnits => prevUnits.map(u => {
            const speed = isRaining ? 1.5 : 3.0; // Weather impact

            // If unit has a target (Responding to call)
            if (u.target) {
                const dx = u.target.x - u.x;
                const dy = u.target.y - u.y;
                const distance = Math.sqrt(dx * dx + dy * dy);

                // Arrived at scene?
                if (distance < 2) {
                    return { ...u, x: u.target.x, y: u.target.y, status: 'on_scene' }; // Stop at location
                }

                // Move towards target (Vector math)
                const moveX = (dx / distance) * speed;
                const moveY = (dy / distance) * speed;
                return { ...u, x: u.x + moveX, y: u.y + moveY };
            } 
            
            // If idle, Patrol slowly (Random walk)
            if (u.status === 'idle') {
                return {
                    ...u,
                    x: Math.max(5, Math.min(95, u.x + (Math.random() - 0.5) * 2)),
                    y: Math.max(5, Math.min(95, u.y + (Math.random() - 0.5) * 2))
                };
            }

            return u;
        }));

        // 2. INCIDENT LIFECYCLE MANAGEMENT
        setQueue(prevQueue => {
            let newQueue = prevQueue.map(q => {
                // Increment time
                const updatedQ = { ...q, time: typeof q.time === 'number' ? q.time + 1 : 1 };

                // Logic: On Scene -> Resolved
                if (q.status === 'Dispatched') {
                   // Check if assigned unit has arrived
                   const assignedUnit = units.find(u => u.callSign === q.unit);
                   if (assignedUnit && assignedUnit.status === 'on_scene') {
                       // Unit arrived, update status
                       if (Math.random() > 0.8) return { ...updatedQ, status: 'On Scene' }; // Chance to switch
                   }
                }

                if (q.status === 'On Scene') {
                    // Chance to resolve
                    if (Math.random() > 0.9) return { ...updatedQ, status: 'Resolved' };
                }

                return updatedQ;
            });

            // Filter out resolved cases and free up units
            const resolved = newQueue.filter(q => q.status === 'Resolved');
            if (resolved.length > 0) {
                resolved.forEach(r => {
                    setCompletedToday(prev => prev + 1);
                    setCurrentChatter(`${r.unit} reports incident at ${r.loc} clear.`);
                    // Free up unit
                    setUnits(prevUnits => prevUnits.map(u => 
                        u.callSign === r.unit ? { ...u, status: 'idle', target: null, assignedTo: null } : u
                    ));
                });
            }

            return newQueue.filter(q => q.status !== 'Resolved');
        });

        // 3. NEW INCIDENT SPAWNER
        // Spawn chance multiplier based on Threat Level
        const spawnChance = threatLevel === 'High' ? 0.4 : 0.1;
        
        if (Math.random() < spawnChance && queue.length < 8) {
            const types = ['Medical', 'Fire', 'Police'];
            const chosenType = types[Math.floor(Math.random() * types.length)];
            const chosenLoc = LOCATIONS[Math.floor(Math.random() * LOCATIONS.length)];
            
            const newCall = {
                id: `CSE-${Math.floor(Math.random() * 9000) + 1000}`,
                type: chosenType,
                loc: chosenLoc,
                status: 'Pending',
                unit: '--',
                time: 0, // Minutes ago
                priority: threatLevel === 'High' ? 'Critical' : PRIORITIES[Math.floor(Math.random() * PRIORITIES.length)],
                notes: `Reported incident at ${chosenLoc}. Response requested.`
            };
            setQueue(prev => [newCall, ...prev]);
            setCurrentChatter(`ALERT: New ${chosenType} Incident at ${chosenLoc}`);
        }

        // 4. CHATTER UPDATE
        if(Math.random() > 0.85) {
            setCurrentChatter(RADIO_CHATTER[Math.floor(Math.random() * RADIO_CHATTER.length)]);
        }

    }, tickRate);

    return () => clearInterval(interval);
  }, [units, queue.length, threatLevel, isRaining]); // Depend on state for logic calc

  // --- DERIVED METRICS ---
  const activeCases = queue.length;
  const criticalCount = queue.filter(q => q.priority === 'Critical').length;
  const availableUnitsCount = units.filter(u => u.status === 'idle').length;
  
  // Calculate Avg Response based on current load + weather
  const baseResponseTime = 8;
  const loadFactor = activeCases * 0.5;
  const weatherFactor = isRaining ? 3 : 0;
  const calculatedResponse = Math.floor(baseResponseTime + loadFactor + weatherFactor);
  const responseTimeDisplay = `0${Math.floor(calculatedResponse/60)}:${(calculatedResponse%60).toString().padStart(2, '0')}`;

  const metrics = [
    { id: 1, label: 'Active Cases', value: activeCases, trend: activeCases - 2, status: activeCases > 5 ? 'Alert' : 'Normal', icon: Siren },
    { id: 2, label: 'Avg Response', value: responseTimeDisplay, trend: isRaining ? 15 : -5, status: isRaining ? 'Warning' : 'Optimal', icon: Clock },
    { id: 3, label: 'Unit Avail.', value: availableUnitsCount, trend: availableUnitsCount - 3, status: availableUnitsCount < 2 ? 'Critical' : 'Good', icon: Truck },
    { id: 4, label: 'Critical', value: criticalCount, trend: criticalCount, status: criticalCount > 0 ? 'Critical' : 'Normal', icon: AlertOctagon },
  ];

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
                    className="fixed inset-0 z-50 flex items-center justify-center bg-black/20 backdrop-blur-sm pointer-events-auto p-4"
                    onClick={() => setSelectedIncident(null)}
                >
                    <div className="bg-white rounded-3xl p-6 shadow-2xl w-[95%] md:w-full max-w-sm border border-zinc-200" onClick={e => e.stopPropagation()}>
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
                                    <span className="block text-zinc-400 font-bold uppercase text-[9px]">Status</span>
                                    <span className={`font-semibold ${selectedIncident.status === 'Pending' ? 'text-orange-500' : 'text-blue-600'}`}>{selectedIncident.status}</span>
                                </div>
                            </div>
                            {/* ACTION BUTTON - Only active if pending */}
                            {selectedIncident.status === 'Pending' ? (
                                <button 
                                    onClick={() => handleDispatch(selectedIncident)}
                                    className="w-full py-3 bg-zinc-900 text-white rounded-xl font-bold text-sm hover:bg-zinc-800 transition-colors shadow-lg shadow-zinc-200"
                                >
                                    Dispatch Nearest Unit
                                </button>
                            ) : (
                                <button disabled className="w-full py-3 bg-zinc-100 text-zinc-400 rounded-xl font-bold text-sm cursor-not-allowed">
                                    Unit Assigned: {selectedIncident.unit}
                                </button>
                            )}
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
                <div className="flex flex-wrap md:flex-nowrap items-center gap-2 md:gap-4 w-full md:w-auto">
                    {/* FEATURE 3: THREAT LEVEL */}
                    <div 
                        onClick={() => setThreatLevel(prev => prev === 'Low' ? 'High' : 'Low')}
                        className={`flex items-center gap-2 px-3 py-1.5 rounded-full border cursor-pointer transition-all hover:scale-105 active:scale-95 ${threatLevel === 'High' ? 'bg-rose-100 border-rose-200 text-rose-700 animate-pulse' : 'bg-zinc-100 border-zinc-200 text-zinc-600'}`}
                    >
                        <Activity size={14} />
                        <span className="text-xs font-bold uppercase">Threat: {threatLevel}</span>
                    </div>

                    {/* FEATURE 4: WEATHER WIDGET */}
                    <div 
                        onClick={() => setIsRaining(!isRaining)}
                        className={`flex items-center gap-2 px-3 py-1.5 rounded-full border cursor-pointer transition-colors hover:bg-opacity-80 active:scale-95 ${isRaining ? 'bg-blue-50 border-blue-200' : 'bg-white border-zinc-200'}`}
                    >
                        {isRaining ? <CloudRain size={16} className="text-blue-500" /> : <Sun size={16} className="text-orange-500" />}
                        <span className="text-xs font-bold text-zinc-700">{isRaining ? 'Rainy' : 'Clear'}</span>
                    </div>
                    
                    <div className="text-right ml-auto md:ml-0">
                        <div className="text-zinc-900 font-bold text-sm">{currentTime.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</div>
                        <div className="text-zinc-400 text-[10px] font-bold uppercase">System Live</div>
                    </div>
                </div>
            }
        />

        {/* --- KPI SECTION --- */}
        <section className="mb-6 md:mb-8">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
                {metrics.map((stat) => (
                    <MetricCard key={stat.id} item={stat} />
                ))}
            </div>
        </section>

        {/* --- MAIN GRID LAYOUT --- */}
        <section className="grid grid-cols-1 lg:grid-cols-12 gap-4 md:gap-6 min-h-[600px]">
            
            {/* LEFT: DISPATCH MAP (8 Cols Desktop, Full Mobile) */}
            <div className="lg:col-span-8 flex flex-col gap-6">
                
                <motion.div 
                    layout
                    className="bg-zinc-50 rounded-[2rem] md:rounded-[2.5rem] shadow-sm border border-zinc-200 relative overflow-hidden h-full min-h-[400px] md:min-h-[500px] group"
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
                                    // Map 0-100 coords to % styles
                                    left: `${unit.x}%`, 
                                    top: `${unit.y}%` 
                                }}
                                transition={{ 
                                    duration: 1, // Smooth transition for 1s tick
                                    ease: "linear" // Linear movement
                                }}
                            >
                                <div className="relative group/unit cursor-pointer hover:scale-110 transition-transform -translate-x-1/2 -translate-y-1/2">
                                    {/* Pulse for moving/active */}
                                    {(unit.status === 'moving' || unit.status === 'on_scene') && (
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
                                        {unit.callSign} • {unit.status}
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                        </AnimatePresence>
                        
                        {/* Incident Markers (Destination Points) */}
                        {queue.map(q => {
                             const coords = LOCATION_COORDS[q.loc];
                             if(!coords || q.status === 'Resolved') return null;
                             return (
                                <motion.div 
                                    key={`marker-${q.id}`}
                                    className="absolute -translate-x-1/2 -translate-y-1/2"
                                    style={{ left: `${coords.x}%`, top: `${coords.y}%` }}
                                    initial={{ scale: 0 }} animate={{ scale: 1 }} exit={{ scale: 0 }}
                                >
                                    <div className={`w-4 h-4 rounded-full border-2 border-white shadow-sm ${q.status === 'Pending' ? 'bg-rose-500 animate-pulse' : 'bg-zinc-400'}`}></div>
                                </motion.div>
                             )
                        })}
                    </div>

                    {/* Overlay Controls */}
                    <div className="absolute top-4 left-4 md:top-6 md:left-6 z-20">
                        <div className="bg-white/90 backdrop-blur-md px-3 py-1.5 md:px-4 md:py-2 rounded-2xl border border-zinc-200 shadow-sm flex items-center gap-2 md:gap-3">
                            <Radio size={16} className="text-rose-600 animate-pulse" />
                            <span className="text-[10px] md:text-xs font-bold text-zinc-900 uppercase tracking-wide">Live Dispatch</span>
                        </div>
                    </div>

                    {/* FEATURE 1: MAP FILTERS */}
                    <div className="absolute bottom-16 right-4 md:right-6 flex gap-2 flex-col sm:flex-row z-20 items-end sm:items-center">
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

            {/* RIGHT: SIDEBAR (4 Cols Desktop, Full Mobile) */}
            <div className="lg:col-span-4 flex flex-col gap-6">
                
                {/* 1. CALL QUEUE */}
                <div className="bg-white border border-zinc-200 rounded-[2rem] p-6 shadow-sm flex-1 relative overflow-hidden flex flex-col min-h-[400px]">
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
                        {queue.length === 0 ? (
                            <div className="text-center text-zinc-400 py-10 text-xs">No active incidents.</div>
                        ) : (
                            queue.map((call) => (
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
                                            <Clock size={10} /> {call.time}m ago
                                         </div>
                                         <div className="flex items-center gap-1">
                                            {call.status === 'Pending' && <span className="w-1.5 h-1.5 rounded-full bg-orange-400 animate-pulse"></span>}
                                            <span className={`text-[10px] font-bold ${call.status === 'Pending' ? 'text-orange-500' : 'text-blue-600'}`}>
                                                {call.status}
                                            </span>
                                         </div>
                                    </div>
                                </motion.div>
                            ))
                        )}
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
                                <div className="h-1 w-8 bg-zinc-800 rounded-full overflow-hidden">
                                    <motion.div 
                                        className="h-full bg-rose-500" 
                                        animate={{ width: `${(queue.filter(q => q.type==='Medical').length / (queue.length || 1)) * 100}%`}}
                                    />
                                </div>
                            </div>
                            <div>
                                <div className="text-[10px] text-blue-400 font-bold mb-1">POL</div>
                                <div className="h-1 w-8 bg-zinc-800 rounded-full overflow-hidden">
                                    <motion.div 
                                        className="h-full bg-blue-500" 
                                        animate={{ width: `${(queue.filter(q => q.type==='Police').length / (queue.length || 1)) * 100}%`}}
                                    />
                                </div>
                            </div>
                         </div>
                    </div>
                    
                    <div className="relative z-10 scale-90">
                        <IncidentDonutChart total={completedToday + queue.length} queue={queue} />
                    </div>

                    {/* Decor */}
                    <div className="absolute bottom-0 left-0 w-full h-1/2 bg-gradient-to-t from-rose-900/20 to-transparent pointer-events-none"></div>
                </div>

            </div>
        </section>

        {/* --- BOTTOM: SLA SECTION --- */}
        <section className="mt-6">
            <div className="bg-white rounded-[2rem] border border-zinc-200 p-8 shadow-sm flex flex-col md:flex-row items-center justify-between gap-6">
                <div className="w-full md:w-auto text-center md:text-left">
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
                <div className="w-full md:w-auto text-center md:text-right">
                    <span className="text-3xl font-bold text-emerald-600">98.2%</span>
                    <span className="block text-[10px] text-zinc-400 font-bold uppercase tracking-widest">Within Target</span>
                </div>
            </div>
        </section>

    </PageLayout>
  );
}