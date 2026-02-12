import React, { useState, useEffect, useMemo, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ShieldCheck, 
  MapPin, 
  Bell, 
  Camera, 
  Clock, 
  AlertCircle, 
  School, 
  Users, 
  Activity,
  ChevronRight,
  MoreVertical,
  Radio,
  Siren,
  Search,
  ArrowRight,
  AlertTriangle,
  TrendingDown,
  TrendingUp,
  Zap,
  Calendar,
  Send,
  CheckCircle2,
  Loader2
} from 'lucide-react';
import { 
  AreaChart, Area, BarChart, Bar, ResponsiveContainer, 
  XAxis, YAxis, Tooltip, CartesianGrid, ReferenceLine
} from 'recharts';

import PageLayout from '../../components/PageLayout'; 

// --- DATA UTILITIES ---

const GENERATE_TREND_DATA = (period) => {
    if (period === 'Week') {
        return [
            { name: 'Mon', val: 4, pred: 5 }, { name: 'Tue', val: 7, pred: 6 }, 
            { name: 'Wed', val: 5, pred: 5 }, { name: 'Thu', val: 8, pred: 7 }, 
            { name: 'Fri', val: 12, pred: 10 }, { name: 'Sat', val: 9, pred: 11 }, 
            { name: 'Sun', val: 6, pred: 8 }
        ];
    }
    return [
        { name: 'Sep', val: 12, pred: 14 }, { name: 'Oct', val: 10, pred: 11 }, 
        { name: 'Nov', val: 8, pred: 9 }, { name: 'Dec', val: 5, pred: 7 }, 
        { name: 'Jan', val: 6, pred: 5 }, { name: 'Feb', val: 4, pred: 4 }
    ];
};

const INCIDENT_TYPES = [
  { type: 'Traffic', count: 42 },
  { type: 'Stranger', count: 12 },
  { type: 'Infra', count: 28 },
  { type: 'Social', count: 15 }
];

const INITIAL_INCIDENTS = [
  { id: 'INC-291', loc: 'SMPN 1 Tasikmalaya', type: 'Traffic Hazard', status: 'Responding', severity: 'Medium', time: '10m ago' },
  { id: 'INC-290', loc: 'Dadaha Park', type: 'Unattended Minor', status: 'Resolved', severity: 'Low', time: '1h ago' },
  { id: 'INC-289', loc: 'SDN 2 Siluman', type: 'Suspicious Activity', status: 'Investigating', severity: 'High', time: '3h ago' },
  { id: 'INC-288', loc: 'Alun-alun Kota', type: 'Brawl Report', status: 'Pending', severity: 'High', time: '4h ago' },
  { id: 'INC-287', loc: 'Jalan HZ Mustofa', type: 'Traffic Accident', status: 'Resolved', severity: 'Medium', time: '5h ago' }
];

const MOCK_NEW_INCIDENTS = [
    { loc: 'Zone A - North Gate', type: 'Unauthorized Entry', severity: 'High' },
    { loc: 'Zone B - Library', type: 'Lost Item', severity: 'Low' },
    { loc: 'Zone C - Crossing', type: 'Speeding Vehicle', severity: 'Medium' }
];

// --- SUB-COMPONENTS ---

const TrendBadge = ({ value, invert = false }) => {
    const isPositive = value > 0;
    const isGood = invert ? !isPositive : isPositive;
    
    return (
        <div className={`flex items-center gap-1 text-xs font-medium px-2 py-1 rounded-full ${
            isGood ? 'bg-emerald-50 text-emerald-700' : 'bg-rose-50 text-rose-700'
        }`}>
            {isPositive ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
            {Math.abs(value)}%
        </div>
    );
};

const MetricCard = ({ item }) => (
    <motion.div
        layout
        whileHover={{ y: -4, scale: 1.02 }}
        className="bg-white rounded-3xl p-5 h-48 flex flex-col justify-between shadow-sm hover:shadow-xl hover:shadow-blue-500/5 border border-zinc-100 transition-all duration-300 group cursor-pointer relative overflow-hidden"
    >
        <div className="flex justify-between items-start z-10">
            <div className={`w-10 h-10 rounded-2xl flex items-center justify-center transition-colors duration-300 bg-zinc-50 text-zinc-900 group-hover:bg-blue-600 group-hover:text-white`}>
                <item.icon size={20} />
            </div>
            <div className="w-7 h-7 rounded-full bg-zinc-100 flex items-center justify-center text-zinc-400 group-hover:text-blue-600 transition-colors">
                <ArrowRight size={14} className="-rotate-45" />
            </div>
        </div>
        <div className="z-10 mt-auto">
            <div className="flex justify-between items-end mb-1">
                <h3 className="text-3xl font-bold text-zinc-900 tracking-tight leading-none group-hover:text-blue-600 transition-colors">
                    {item.value}
                </h3>
                <TrendBadge value={item.trend} invert={item.label.includes('Alerts') || item.label.includes('Incidents')} />
            </div>
            <p className="text-xs text-zinc-500 font-medium uppercase tracking-wide">{item.label}</p>
        </div>
        <div className="absolute -right-4 -bottom-4 opacity-0 group-hover:opacity-5 transition-opacity duration-500 pointer-events-none">
            <item.icon size={100} />
        </div>
    </motion.div>
);

// --- MAIN COMPONENT ---

export default function ChildSafety() {
    // -- STATE MANAGEMENT --
    const [currentTime, setCurrentTime] = useState(new Date());
    
    // KPI Data
    const [kpiData, setKpiData] = useState([
        { id: 1, label: 'Active Alerts', sub: 'Real-time', value: '2', trend: -50, icon: Siren, color: 'rose' },
        { id: 2, label: 'Zone Coverage', sub: 'School Areas', value: '94%', trend: 2.1, icon: MapPin, color: 'blue' },
        { id: 3, label: 'Monthly Incidents', sub: 'Total Reports', value: '18', trend: -12, icon: Activity, color: 'amber' },
        { id: 4, label: 'CCTV Uptime', sub: 'Network Status', value: '99.8%', trend: 0, icon: Camera, color: 'emerald' },
    ]);

    // Core Interaction States
    const [incidents, setIncidents] = useState(INITIAL_INCIDENTS);
    const [searchTerm, setSearchTerm] = useState('');
    const [timeFrame, setTimeFrame] = useState('Month'); 
    const [showPrediction, setShowPrediction] = useState(false);
    const [selectedZone, setSelectedZone] = useState(null);
    const [broadcastMode, setBroadcastMode] = useState(false);
    const [schoolStatsOpen, setSchoolStatsOpen] = useState(false);
    
    // Feature States (Map Cam, Systems)
    const [camConnecting, setCamConnecting] = useState(false);
    const [camLive, setCamLive] = useState(false);
    const [systemFluctuation, setSystemFluctuation] = useState({ network: 99.8, compliance: 92.0 });

    // Derived Data
    const chartData = useMemo(() => GENERATE_TREND_DATA(timeFrame), [timeFrame]);
    
    const filteredIncidents = incidents.filter(inc => 
        inc.type.toLowerCase().includes(searchTerm.toLowerCase()) || 
        inc.loc.toLowerCase().includes(searchTerm.toLowerCase())
    );

    // -- SIMULATION LOGIC --

    // 1. Clock Sync
    useEffect(() => {
        const timer = setInterval(() => setCurrentTime(new Date()), 1000);
        return () => clearInterval(timer);
    }, []);

    // 2. Live Data Fluctuation (Simulating environment changes)
    useEffect(() => {
        const interval = setInterval(() => {
            // Fluctuate CCTV Uptime slightly
            const randomNet = (99.0 + Math.random()).toFixed(1);
            setSystemFluctuation(prev => ({
                ...prev,
                network: parseFloat(randomNet)
            }));

            setKpiData(prev => prev.map(item => {
                if (item.label === 'CCTV Uptime') return { ...item, value: randomNet + '%' };
                if (item.label === 'Active Alerts' && !broadcastMode) {
                    // Randomly fluctuate alert count if not in emergency mode
                    return Math.random() > 0.7 ? { ...item, value: Math.floor(Math.random() * 3).toString() } : item;
                }
                return item;
            }));
        }, 2500);
        return () => clearInterval(interval);
    }, [broadcastMode]);

    // 3. Emergency Broadcast Logic
    useEffect(() => {
        if (broadcastMode) {
            // Trigger Critical State
            setKpiData(prev => prev.map(item => 
                item.label === 'Active Alerts' ? { ...item, value: '5', trend: 100 } : item
            ));

            // Add a critical incident if one doesn't exist recently
            const criticalIncident = {
                id: `INC-${Math.floor(Math.random() * 1000)}`,
                loc: 'ALL ZONES',
                type: 'EMERGENCY BROADCAST',
                status: 'Open',
                severity: 'High',
                time: 'Just now'
            };
            setIncidents(prev => [criticalIncident, ...prev]);
        } else {
            // Reset logic
            setKpiData(prev => prev.map(item => 
                item.label === 'Active Alerts' ? { ...item, value: '2', trend: -20 } : item
            ));
        }
    }, [broadcastMode]);

    // 4. Incident Generator (Randomly adds incidents over time)
    useEffect(() => {
        const generator = setInterval(() => {
            if (Math.random() > 0.85 && !broadcastMode) { // 15% chance every 8s
                const mock = MOCK_NEW_INCIDENTS[Math.floor(Math.random() * MOCK_NEW_INCIDENTS.length)];
                const newInc = {
                    id: `INC-${Math.floor(Math.random() * 9000) + 1000}`,
                    loc: mock.loc,
                    type: mock.type,
                    status: 'Pending',
                    severity: mock.severity,
                    time: 'Just now'
                };
                setIncidents(prev => [newInc, ...prev.slice(0, 19)]); // Keep last 20
            }
        }, 8000);
        return () => clearInterval(generator);
    }, [broadcastMode]);

    // -- HANDLERS --

    const handleDispatch = (id) => {
        // Optimistic UI update simulating dispatch process
        setIncidents(prev => prev.map(inc => {
            if (inc.id === id) {
                return { ...inc, status: 'Dispatched', severity: 'Medium' }; // Intermediate state
            }
            return inc;
        }));

        // Simulate network delay to "Responding"
        setTimeout(() => {
            setIncidents(prev => prev.map(inc => 
                inc.id === id ? { ...inc, status: 'Responding' } : inc
            ));
        }, 1500);
    };

    const handleZoneClick = (zoneId) => {
        setSelectedZone(zoneId);
        setCamLive(false); // Reset cam state on new zone selection
        setCamConnecting(false);
    };

    const connectToCam = () => {
        setCamConnecting(true);
        setTimeout(() => {
            setCamConnecting(false);
            setCamLive(true);
        }, 2000); // 2 second connection simulation
    };

    const handleDownloadProtocol = () => {
        alert("Downloading Secure PDF: Tasikmalaya_SmartCity_Protocol_v4.pdf");
    };

    return (
        <PageLayout 
            title="Child Safety" 
            subtitle="Protection Monitor" 
            colorTheme="blue"
        >
            <div className={`transition-all duration-500 ${broadcastMode ? 'ring-4 ring-rose-500/20 rounded-[3rem] p-2' : ''}`}>
            
            {/* HEADER CONTROLS */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-8">
                <div className="flex items-center gap-3">
                     <div className={`flex items-center gap-2 px-3 py-1.5 rounded-full border shadow-sm transition-colors ${broadcastMode ? 'bg-rose-600 border-rose-700 text-white' : 'bg-white border-blue-200'}`}>
                        <div className={`w-2 h-2 rounded-full animate-pulse ${broadcastMode ? 'bg-white' : 'bg-blue-500'}`}></div>
                        <span className={`text-xs font-semibold uppercase tracking-wide ${broadcastMode ? 'text-white' : 'text-blue-700'}`}>
                            {broadcastMode ? 'EMERGENCY MODE' : 'Safe Zones Active'}
                        </span>
                    </div>
                    <span className="text-xs text-zinc-400 font-mono">Synced: {currentTime.toLocaleTimeString('id-ID', {hour: '2-digit', minute:'2-digit', second:'2-digit'})} WIB</span>
                </div>

                <div className="flex items-center gap-4">
                    {/* NEW FEATURE 1: Emergency Broadcast */}
                    <button 
                        onClick={() => setBroadcastMode(!broadcastMode)}
                        className={`flex items-center gap-2 px-4 py-2 rounded-full border text-xs font-bold uppercase tracking-wider transition-all shadow-sm hover:shadow-md active:scale-95 ${
                            broadcastMode 
                            ? 'bg-rose-100 text-rose-600 border-rose-200 animate-pulse' 
                            : 'bg-white text-zinc-500 border-zinc-200 hover:border-rose-200 hover:text-rose-500'
                        }`}
                    >
                        <Siren size={16} />
                        {broadcastMode ? 'Deactivate Alarm' : 'Broadcast Alert'}
                    </button>

                    {/* EXISTING: Monitored Schools Widget */}
                    <div 
                        onClick={() => setSchoolStatsOpen(!schoolStatsOpen)}
                        className={`p-2 pr-6 rounded-[2rem] border shadow-sm flex items-center gap-4 cursor-pointer transition-all hover:bg-zinc-50 ${schoolStatsOpen ? 'bg-blue-50 border-blue-200 ring-2 ring-blue-100' : 'bg-white border-zinc-200'}`}
                    >
                        <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 border-4 border-white shadow-sm">
                            <School size={20} />
                        </div>
                        <div>
                            <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider">Monitored Schools</p>
                            <div className="flex items-baseline gap-1">
                                <span className="text-2xl font-bold text-zinc-900">412</span>
                                <span className="text-xs text-zinc-400 font-medium">Institutions</span>
                                <motion.div 
                                    animate={{ rotate: schoolStatsOpen ? 180 : 0 }}
                                    className="ml-1"
                                >
                                    <ChevronRight size={12} className="text-zinc-300" />
                                </motion.div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Feature 5 Detail View */}
            <AnimatePresence>
                {schoolStatsOpen && (
                    <motion.div 
                        initial={{ height: 0, opacity: 0, marginBottom: 0 }}
                        animate={{ height: 'auto', opacity: 1, marginBottom: 24 }}
                        exit={{ height: 0, opacity: 0, marginBottom: 0 }}
                        className="overflow-hidden bg-blue-50 rounded-3xl border border-blue-100 shadow-inner"
                    >
                        <div className="p-4 flex justify-between items-center text-sm text-blue-800">
                            <div className="flex items-center gap-2">
                                <Activity size={16} />
                                <span className="font-bold ml-2">School Server Status Detail</span>
                            </div>
                            <div className="flex gap-6">
                                <span className="flex items-center gap-1.5"><div className="w-2 h-2 rounded-full bg-emerald-500"></div> Online: <b>408</b></span>
                                <span className="flex items-center gap-1.5 text-amber-700"><div className="w-2 h-2 rounded-full bg-amber-500"></div> Maintenance: <b>4</b></span>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* KPI SECTION */}
            <section className="mb-8">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {kpiData.map((kpi) => (
                        <MetricCard key={kpi.id} item={kpi} />
                    ))}
                </div>
            </section>

            {/* MAIN GRID */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                
                {/* LEFT: MAP & ANALYTICS (8 Cols) */}
                <div className="lg:col-span-8 flex flex-col gap-8">
                    
                    {/* Safe Zone Map (Interactive) */}
                    <div className="bg-white rounded-[2.5rem] p-2 shadow-sm border border-zinc-200 relative overflow-hidden h-[450px] group">
                          {/* Map Container */}
                          <div className="w-full h-full rounded-[2rem] bg-zinc-100 relative overflow-hidden">
                            <div className="absolute inset-0 opacity-[0.05] bg-[linear-gradient(to_right,#000000_1px,transparent_1px),linear-gradient(to_bottom,#000000_1px,transparent_1px)] bg-[size:40px_40px]"></div>
                            
                            {/* Map Overlay Text */}
                            <div className="absolute top-6 left-6 z-20 pointer-events-none">
                                <div className="bg-white/90 backdrop-blur-md px-4 py-2 rounded-2xl border border-zinc-200 shadow-sm pointer-events-auto">
                                    <h3 className="text-sm font-bold text-zinc-900 flex items-center gap-2">
                                        <ShieldCheck size={16} className="text-blue-600" /> Safe Zone Intel
                                    </h3>
                                    <div className="mt-2 space-y-1">
                                        <div className="flex items-center gap-2 text-[10px] font-medium text-zinc-600"><span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span> Secure: 382</div>
                                        <div className="flex items-center gap-2 text-[10px] font-medium text-zinc-600"><span className="w-2 h-2 rounded-full bg-amber-500"></span> Warning: 28</div>
                                    </div>
                                </div>
                            </div>

                            {/* Detailed Info Panel (Shows on click) */}
                            <AnimatePresence>
                                {selectedZone && (
                                    <motion.div 
                                        initial={{ x: 20, opacity: 0 }}
                                        animate={{ x: 0, opacity: 1 }}
                                        exit={{ x: 20, opacity: 0 }}
                                        className="absolute top-6 right-6 z-30 w-56 bg-white/95 backdrop-blur-md p-4 rounded-2xl border border-zinc-200 shadow-xl"
                                    >
                                        <div className="flex justify-between items-start mb-3">
                                            <h4 className="font-bold text-sm text-zinc-900">{selectedZone}</h4>
                                            <button onClick={() => setSelectedZone(null)} className="text-zinc-400 hover:text-zinc-900 transition-colors bg-zinc-100 w-6 h-6 rounded-full flex items-center justify-center">&times;</button>
                                        </div>
                                        <div className="space-y-3">
                                            <div className="grid grid-cols-2 gap-2">
                                                <div className="bg-zinc-50 p-2 rounded-xl border border-zinc-100">
                                                    <span className="text-[9px] text-zinc-400 block uppercase">Density</span>
                                                    <span className="text-xs font-bold text-zinc-700">Low</span>
                                                </div>
                                                <div className="bg-zinc-50 p-2 rounded-xl border border-zinc-100">
                                                    <span className="text-[9px] text-zinc-400 block uppercase">Patrols</span>
                                                    <span className="text-xs font-bold text-emerald-600">Active</span>
                                                </div>
                                            </div>
                                            
                                            {camLive ? (
                                                <div className="w-full aspect-video bg-zinc-900 rounded-lg flex items-center justify-center relative overflow-hidden group/cam">
                                                    <img src="/api/placeholder/200/120" alt="Live Feed" className="opacity-50 absolute inset-0 w-full h-full object-cover" />
                                                    <div className="z-10 flex flex-col items-center gap-1">
                                                        <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
                                                        <span className="text-[9px] text-white font-mono tracking-widest uppercase">Live Feed</span>
                                                    </div>
                                                </div>
                                            ) : (
                                                <button 
                                                    onClick={connectToCam}
                                                    disabled={camConnecting}
                                                    className={`w-full py-2 px-3 text-[10px] font-bold rounded-xl flex items-center justify-center gap-2 transition-all ${
                                                        camConnecting 
                                                        ? 'bg-zinc-100 text-zinc-400' 
                                                        : 'bg-blue-50 text-blue-600 hover:bg-blue-100 hover:scale-[1.02]'
                                                    }`}
                                                >
                                                    {camConnecting ? (
                                                        <><Loader2 size={12} className="animate-spin" /> Connecting...</>
                                                    ) : (
                                                        <><Camera size={12} /> View Cam Feed</>
                                                    )}
                                                </button>
                                            )}
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>

                            {/* Interactive Map Elements (Clickable Zones) */}
                            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full">
                                {/* Zone 1 */}
                                <button 
                                    onClick={() => handleZoneClick('Zone A - North')}
                                    className={`absolute top-1/3 left-1/3 w-24 h-24 rounded-full border-2 transition-all flex items-center justify-center group/zone focus:outline-none ${
                                        selectedZone === 'Zone A - North' 
                                        ? 'border-emerald-500 bg-emerald-500/20 scale-110' 
                                        : 'border-emerald-400/50 bg-emerald-400/10 hover:bg-emerald-400/20'
                                    }`}
                                >
                                    <div className="w-3 h-3 bg-emerald-500 rounded-full animate-ping absolute"></div>
                                    <div className="w-3 h-3 bg-emerald-500 rounded-full relative z-10"></div>
                                    <span className="absolute -bottom-6 bg-white px-2 py-1 rounded-md text-[9px] font-bold shadow-sm opacity-0 group-hover/zone:opacity-100 transition-opacity whitespace-nowrap z-20">Zone A</span>
                                </button>

                                {/* Zone 2 */}
                                <button 
                                    onClick={() => handleZoneClick('Zone B - Central')}
                                    className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48 rounded-full border transition-all flex items-center justify-center group/zone focus:outline-none ${
                                        selectedZone === 'Zone B - Central'
                                        ? 'border-blue-500 bg-blue-500/10 scale-105'
                                        : 'border-blue-300 bg-blue-500/5 hover:bg-blue-500/10'
                                    }`}
                                >
                                    <div className={`w-4 h-4 rounded-full shadow-lg shadow-blue-500/30 flex items-center justify-center transition-colors ${selectedZone === 'Zone B - Central' ? 'bg-blue-700' : 'bg-blue-600'}`}>
                                        <School size={10} className="text-white mx-auto mt-0.5" />
                                    </div>
                                </button>

                                {/* Zone 3 (Alert) */}
                                <button 
                                    onClick={() => handleZoneClick('Zone C - East (Warning)')}
                                    className={`absolute bottom-1/4 right-1/3 w-16 h-16 rounded-full border-2 transition-all flex items-center justify-center group/zone focus:outline-none ${
                                        selectedZone === 'Zone C - East (Warning)'
                                        ? 'border-amber-500 bg-amber-500/20 scale-110'
                                        : 'border-amber-400/50 bg-amber-400/10 hover:bg-amber-400/20'
                                    }`}
                                >
                                    <div className="w-2 h-2 bg-amber-500 rounded-full relative z-10"></div>
                                    <span className="absolute -bottom-6 bg-white px-2 py-1 rounded-md text-[9px] font-bold shadow-sm opacity-0 group-hover/zone:opacity-100 transition-opacity text-amber-600 whitespace-nowrap z-20">Zone C</span>
                                </button>
                            </div>
                          </div>
                    </div>

                    {/* Analytics Row */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        
                        {/* Incident Trend (With NEW FEATURES 2 & 3) */}
                        <div className="bg-white p-6 rounded-[2.5rem] border border-zinc-200 shadow-sm">
                            <div className="flex justify-between items-start mb-6">
                                <div>
                                    <h3 className="font-bold text-sm text-zinc-900">Incident Trend</h3>
                                    <div className="flex items-center gap-2 mt-1">
                                        {/* NEW FEATURE 3: AI Prediction Toggle */}
                                        <label className="flex items-center gap-1 cursor-pointer group">
                                            <div className={`w-6 h-3 rounded-full p-0.5 transition-colors ${showPrediction ? 'bg-purple-500' : 'bg-zinc-200 group-hover:bg-zinc-300'}`} onClick={() => setShowPrediction(!showPrediction)}>
                                                <div className={`w-2 h-2 rounded-full bg-white transition-transform ${showPrediction ? 'translate-x-3' : 'translate-x-0'}`} />
                                            </div>
                                            <span className={`text-[9px] font-bold uppercase transition-colors ${showPrediction ? 'text-purple-600' : 'text-zinc-400'}`}>AI Pred.</span>
                                        </label>
                                    </div>
                                </div>
                                {/* NEW FEATURE 2: Timeframe Selector */}
                                <div className="flex bg-zinc-100 rounded-lg p-1">
                                    {['Week', 'Month'].map(t => (
                                        <button 
                                            key={t}
                                            onClick={() => setTimeFrame(t)}
                                            className={`px-3 py-1 text-[10px] font-bold rounded-md transition-all ${timeFrame === t ? 'bg-white shadow-sm text-zinc-900' : 'text-zinc-400 hover:text-zinc-600'}`}
                                        >
                                            {t}
                                        </button>
                                    ))}
                                </div>
                            </div>
                            <div className="h-40 w-full">
                                <ResponsiveContainer width="100%" height="100%">
                                    <AreaChart data={chartData}>
                                        <defs>
                                            <linearGradient id="colorInc" x1="0" y1="0" x2="0" y2="1">
                                                <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.2}/>
                                                <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                                            </linearGradient>
                                        </defs>
                                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f4f4f5" />
                                        <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fontSize: 10, fill: '#a1a1aa'}} />
                                        <Tooltip contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }} />
                                        <Area type="monotone" dataKey="val" stroke="#3b82f6" strokeWidth={3} fillOpacity={1} fill="url(#colorInc)" animationDuration={1000} />
                                        {/* Prediction Line */}
                                        {showPrediction && (
                                            <Area type="monotone" dataKey="pred" stroke="#a855f7" strokeWidth={2} strokeDasharray="5 5" fill="transparent" animationDuration={1000} />
                                        )}
                                    </AreaChart>
                                </ResponsiveContainer>
                            </div>
                        </div>

                        {/* Incident Types */}
                        <div className="bg-white p-6 rounded-[2.5rem] border border-zinc-200 shadow-sm">
                            <div className="flex justify-between items-center mb-6">
                                <h3 className="font-bold text-sm text-zinc-900">Type Breakdown</h3>
                                <button className="text-zinc-400 hover:text-blue-600 rounded-full p-1 hover:bg-zinc-50 transition-colors"><MoreVertical size={16} /></button>
                            </div>
                            <div className="h-40 w-full">
                                <ResponsiveContainer width="100%" height="100%">
                                    <BarChart data={INCIDENT_TYPES} layout="vertical">
                                        <XAxis type="number" hide />
                                        <YAxis dataKey="type" type="category" width={60} tick={{fontSize: 10}} axisLine={false} tickLine={false} />
                                        <Tooltip cursor={{fill: 'transparent'}} contentStyle={{ borderRadius: '12px', border: 'none' }} />
                                        <Bar dataKey="count" fill="#3b82f6" radius={[0, 4, 4, 0]} barSize={20} />
                                    </BarChart>
                                </ResponsiveContainer>
                            </div>
                        </div>

                    </div>
                </div>

                {/* RIGHT: SYSTEM & INCIDENTS (4 Cols) */}
                <div className="lg:col-span-4 flex flex-col gap-6">
                    
                    {/* System Infrastructure (Dark Mode) */}
                    <div className="bg-zinc-900 text-white p-8 rounded-[2.5rem] shadow-xl shadow-zinc-200 relative overflow-hidden transition-all duration-700">
                        <div className="relative z-10">
                            <div className="flex justify-between items-center mb-6">
                                <h3 className="font-bold text-lg">System Status</h3>
                                <div className="p-2 bg-white/10 rounded-full animate-pulse">
                                    <div className={`w-2 h-2 rounded-full transition-colors duration-300 ${broadcastMode ? 'bg-rose-500' : 'bg-emerald-400'}`} />
                                </div>
                            </div>

                            <div className="space-y-4">
                                {[
                                    { title: "CCTV Network", status: "Operational", val: systemFluctuation.network },
                                    { title: "Compliance", status: "High", val: systemFluctuation.compliance },
                                    { title: "Panic System", status: broadcastMode ? "ACTIVE" : "Ready", val: 100 },
                                ].map((sys, i) => (
                                    <div key={i} className={`p-4 rounded-2xl border transition-all duration-300 ${broadcastMode && sys.title === 'Panic System' ? 'bg-rose-500/20 border-rose-500/50 scale-105' : 'bg-white/5 border-white/5'}`}>
                                        <div className="flex justify-between items-end mb-2">
                                            <div>
                                                <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-tight">{sys.title}</p>
                                                <p className={`text-sm font-bold transition-colors ${broadcastMode && sys.title === 'Panic System' ? 'text-rose-400 animate-pulse' : 'text-white'}`}>{sys.status}</p>
                                            </div>
                                            <span className="text-xs font-mono text-blue-300">{sys.val}%</span>
                                        </div>
                                        <div className="w-full h-1 bg-zinc-800 rounded-full overflow-hidden">
                                            <div className={`h-full rounded-full transition-all duration-1000 ease-out ${broadcastMode && sys.title === 'Panic System' ? 'bg-rose-500' : 'bg-blue-500'}`} style={{width: `${sys.val}%`}} />
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                        {/* Decor */}
                        <div className={`absolute top-0 right-0 w-64 h-64 blur-[60px] rounded-full pointer-events-none transition-colors duration-1000 ${broadcastMode ? 'bg-rose-600/30' : 'bg-blue-600/10'}`}></div>
                    </div>

                    {/* Incident Log (Functional Search & Actions) */}
                    <div className="bg-white border border-zinc-200 rounded-[2.5rem] p-6 shadow-sm flex-1 flex flex-col h-[500px]">
                        <div className="flex items-center gap-2 mb-4 bg-zinc-50 p-2 rounded-xl border border-zinc-100 focus-within:border-blue-300 focus-within:ring-2 focus-within:ring-blue-100 transition-all">
                            <Search size={16} className="text-zinc-400 ml-1" />
                            <input 
                                type="text" 
                                placeholder="Search Incidents..." 
                                className="bg-transparent text-sm w-full outline-none text-zinc-700 placeholder:text-zinc-400"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>
                        
                        <div className="space-y-4 overflow-y-auto pr-2 scrollbar-hide flex-1">
                            <AnimatePresence initial={false}>
                                {filteredIncidents.length > 0 ? filteredIncidents.map((inc) => (
                                    <motion.div 
                                        layout
                                        initial={{ opacity: 0, x: -20, height: 0 }}
                                        animate={{ opacity: 1, x: 0, height: 'auto' }}
                                        exit={{ opacity: 0, scale: 0.9, height: 0 }}
                                        transition={{ duration: 0.3 }}
                                        key={inc.id} 
                                        className="flex gap-4 items-start p-2 hover:bg-zinc-50 rounded-2xl transition-colors cursor-pointer group border-l-2 border-transparent hover:border-blue-200 relative overflow-hidden shrink-0"
                                    >
                                        <div className={`p-2.5 rounded-xl mt-0.5 shrink-0 transition-colors ${
                                            inc.severity === 'High' ? 'bg-rose-50 text-rose-500' : 
                                            inc.severity === 'Medium' ? 'bg-amber-50 text-amber-500' : 'bg-emerald-50 text-emerald-500'
                                        }`}>
                                            {inc.severity === 'High' ? <AlertTriangle size={16} /> : <ShieldCheck size={16} />}
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <div className="flex justify-between items-start">
                                                <p className="text-sm font-bold text-zinc-900 truncate">{inc.type}</p>
                                                <span className={`text-[9px] px-1.5 py-0.5 rounded-md font-bold uppercase tracking-wide transition-colors ${
                                                    inc.status === 'Resolved' ? 'bg-zinc-100 text-zinc-500' : 
                                                    inc.status === 'Dispatched' ? 'bg-indigo-50 text-indigo-600' :
                                                    inc.status === 'Responding' ? 'bg-blue-100 text-blue-700' :
                                                    'bg-blue-50 text-blue-600'
                                                }`}>{inc.status}</span>
                                            </div>
                                            <p className="text-[11px] text-zinc-500 mt-0.5 flex items-center gap-1 truncate">
                                                <MapPin size={10} /> {inc.loc}
                                            </p>
                                            
                                            {/* NEW FEATURE 4: Quick Actions (Dispatch) */}
                                            <div className="flex justify-between items-center mt-2 h-6">
                                                <p className="text-[10px] text-zinc-400">{inc.time}</p>
                                                <AnimatePresence mode="wait">
                                                    {inc.status === 'Pending' && (
                                                        <motion.button 
                                                            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                                                            onClick={(e) => { e.stopPropagation(); handleDispatch(inc.id); }}
                                                            className="flex items-center gap-1 bg-zinc-900 text-white text-[9px] px-2 py-1 rounded-lg hover:bg-zinc-700 transition-colors active:scale-95"
                                                        >
                                                            Dispatch <Send size={8} />
                                                        </motion.button>
                                                    )}
                                                    {inc.status === 'Dispatched' && (
                                                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex items-center gap-1 text-[9px] text-zinc-500">
                                                            <Loader2 size={8} className="animate-spin" /> Notifying...
                                                        </motion.div>
                                                    )}
                                                    {(inc.status === 'Responding' || inc.status === 'Resolved') && (
                                                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-emerald-500">
                                                            <CheckCircle2 size={12} />
                                                        </motion.div>
                                                    )}
                                                </AnimatePresence>
                                            </div>
                                        </div>
                                    </motion.div>
                                )) : (
                                    <div className="text-center py-8 text-zinc-400 text-xs">No incidents found</div>
                                )}
                            </AnimatePresence>
                        </div>

                        <button className="w-full mt-4 pt-4 py-3 text-xs font-bold text-blue-600 bg-blue-50 border border-blue-100 rounded-xl hover:bg-blue-100 transition-colors uppercase tracking-wider shrink-0">
                            View Full Log
                        </button>
                    </div>

                    {/* Protocol Link */}
                    <div className="bg-gradient-to-br from-blue-600 to-indigo-600 p-6 rounded-[2.5rem] text-white shadow-lg shadow-blue-200 relative overflow-hidden group">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2 group-hover:scale-110 transition-transform duration-500"></div>
                        
                        <div className="flex items-center gap-3 mb-2 relative z-10">
                            <AlertCircle size={20} className="text-blue-200" />
                            <h4 className="font-bold text-sm">Security Protocols</h4>
                        </div>
                        <p className="text-[10px] text-blue-100 leading-relaxed mb-4 relative z-10">Official Tasikmalaya Smart City child protection guidelines.</p>
                        <button 
                            onClick={handleDownloadProtocol}
                            className="flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider hover:gap-2 transition-all relative z-10 hover:text-blue-200"
                        >
                            Download PDF <ArrowRight size={12} />
                        </button>
                    </div>

                </div>
            </div>
            </div>
        </PageLayout>
    );
}