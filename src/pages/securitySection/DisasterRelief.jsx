import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  AlertTriangle, 
  Wind, 
  Waves, 
  Activity, 
  Users, 
  Tent, 
  MapPin, 
  ShieldAlert, 
  Clock, 
  BarChart3, 
  Truck, 
  HeartPulse, 
  Box, 
  ChevronRight, 
  RefreshCw,
  TrendingUp,
  TrendingDown,
  Siren,
  Megaphone,
  Radio,
  Layers,
  Search,
  Plus,
  X,
  Send
} from 'lucide-react';
import { 
  AreaChart, Area, BarChart, Bar, ResponsiveContainer, 
  XAxis, Tooltip, CartesianGrid, YAxis 
} from 'recharts';

import PageLayout from '../../components/PageLayout'; 

// --- INITIAL MOCK DATA ---
const INITIAL_RISK_DATA = {
  '12H': [
    { time: '00:00', val: 20 }, { time: '02:00', val: 25 }, { time: '04:00', val: 35 },
    { time: '06:00', val: 45 }, { time: '08:00', val: 55 }, { time: '10:00', val: 60 },
    { time: '12:00', val: 58 }
  ],
  '24H': [
    { time: '00:00', val: 20 }, { time: '04:00', val: 35 }, { time: '08:00', val: 45 },
    { time: '12:00', val: 60 }, { time: '16:00', val: 55 }, { time: '20:00', val: 40 }
  ],
  '7D': [
    { time: 'Mon', val: 40 }, { time: 'Tue', val: 55 }, { time: 'Wed', val: 65 },
    { time: 'Thu', val: 50 }, { time: 'Fri', val: 45 }, { time: 'Sat', val: 30 },
    { time: 'Sun', val: 25 }
  ]
};

const KPI_DATA = [
  { id: 'alerts', label: 'Active Alerts', sub: 'Regional Warnings', value: '12', trend: +20, icon: Siren, color: 'red', filterKey: 'Warning' },
  { id: 'flood', label: 'Flood Risk', sub: 'Hydro Index', value: 'High', trend: +5, icon: Waves, color: 'blue', filterKey: 'Flood' },
  { id: 'seismic', label: 'Seismic Activity', sub: 'Richter Scale', value: '2.4M', trend: -0.2, icon: Activity, color: 'orange', filterKey: 'Landslide' },
  { id: 'shelter', label: 'Shelter Cap.', sub: 'Occupancy Rate', value: '45%', trend: -12, icon: Tent, color: 'emerald', filterKey: 'Supply' },
];

const ALERTS_DATA = [
  { id: 1, type: "Flood Warning", level: "Critical", location: "Cipedes District", time: "12m ago" },
  { id: 2, type: "Landslide Risk", level: "High", location: "Kawalu Highlands", time: "45m ago" },
  { id: 3, type: "Heavy Rainfall", level: "Medium", location: "Indihiang Area", time: "1h ago" },
  { id: 4, type: "Supply Shortage", level: "Low", location: "Shelter A", time: "2h ago" },
  { id: 5, type: "Road Blocked", level: "Medium", location: "Main Route 4", time: "3h ago" },
];

const RESOURCE_DATA = [
  { type: 'Medics', count: 45, max: 100 },
  { type: 'Rescue', count: 80, max: 150 },
  { type: 'Logistics', count: 30, max: 80 },
  { type: 'Scout', count: 120, max: 200 } // Changed 'Vols' to 'Scout' to match Modal
];

// --- SUB-COMPONENTS ---

const TrendBadge = ({ value, invert = false }) => {
    const isPositive = value > 0;
    const isBad = (isPositive && invert) || (!isPositive && !invert);
    
    return (
        <div className={`flex items-center gap-1 text-xs font-medium px-2 py-1 rounded-full ${
            !isBad ? 'bg-emerald-50 text-emerald-700' : 'bg-orange-50 text-orange-700'
        }`}>
            {isPositive ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
            {Math.abs(value)}%
        </div>
    );
};

const MetricCard = ({ item, isActive, onClick }) => (
    <motion.div
        layout
        onClick={onClick}
        whileHover={{ y: -4, scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        className={`rounded-3xl p-5 h-48 flex flex-col justify-between shadow-sm border transition-all duration-300 group cursor-pointer relative overflow-hidden ${
            isActive 
            ? 'bg-orange-500 border-orange-500 text-white shadow-lg shadow-orange-500/20' 
            : 'bg-white border-zinc-100 hover:shadow-xl hover:shadow-orange-500/5'
        }`}
    >
        <div className="flex justify-between items-start z-10">
            <div className={`w-10 h-10 rounded-2xl flex items-center justify-center transition-colors duration-300 ${
                isActive ? 'bg-white/20 text-white' : 'bg-zinc-50 text-zinc-900 group-hover:bg-orange-600 group-hover:text-white'
            }`}>
                <item.icon size={20} />
            </div>
            <div className={`w-7 h-7 rounded-full flex items-center justify-center transition-colors ${
                isActive ? 'bg-white/20 text-white' : 'bg-zinc-100 text-zinc-400 group-hover:text-orange-600'
            }`}>
                {item.level === 'Critical' ? <AlertTriangle size={14} /> : <Activity size={14} />}
            </div>
        </div>
        <div className="z-10 mt-auto">
            <div className="flex justify-between items-end mb-1">
                <h3 className={`text-3xl font-bold tracking-tight leading-none transition-colors ${
                    isActive ? 'text-white' : 'text-zinc-900 group-hover:text-orange-600'
                }`}>
                    {item.value}
                </h3>
                <div className={`${isActive ? 'opacity-80 brightness-150' : ''}`}>
                    <TrendBadge value={item.trend} invert={item.label !== 'Shelter Cap.'} />
                </div>
            </div>
            <p className={`text-xs font-medium uppercase tracking-wide ${
                isActive ? 'text-orange-100' : 'text-zinc-500'
            }`}>{item.label}</p>
        </div>
        <div className={`absolute -right-4 -bottom-4 transition-opacity duration-500 pointer-events-none ${
            isActive ? 'opacity-10 text-white' : 'opacity-0 group-hover:opacity-5 text-zinc-900'
        }`}>
            <item.icon size={100} />
        </div>
    </motion.div>
);

// --- MODAL: DEPLOY RESOURCES ---
const DeployModal = ({ isOpen, onClose, onDeploy }) => {
    // Internal state for the form logic
    const [selectedType, setSelectedType] = useState('Rescue');
    const [selectedSector, setSelectedSector] = useState('Sector A');

    useEffect(() => {
        if (isOpen) {
            // Reset to defaults on open
            setSelectedType('Rescue');
        }
    }, [isOpen]);

    if (!isOpen) return null;
    
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-zinc-900/40 backdrop-blur-sm p-4">
            <motion.div 
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="bg-white rounded-[2rem] w-full max-w-md p-6 shadow-2xl border border-zinc-100"
            >
                <div className="flex justify-between items-center mb-6">
                    <h3 className="text-lg font-bold text-zinc-900 flex items-center gap-2">
                        <Truck size={20} className="text-orange-600" /> Deploy Unit
                    </h3>
                    <button onClick={onClose} className="p-2 hover:bg-zinc-100 rounded-full text-zinc-400"><X size={20}/></button>
                </div>
                
                <div className="space-y-4">
                    <div>
                        <label className="text-xs font-bold text-zinc-500 uppercase ml-1 block mb-2">Unit Type</label>
                        <div className="grid grid-cols-2 gap-2">
                            {['Medics', 'Rescue', 'Logistics', 'Scout'].map(type => (
                                <button 
                                    key={type} 
                                    onClick={() => setSelectedType(type)}
                                    className={`py-3 px-4 rounded-xl border text-sm font-bold text-left transition-all duration-200 ${
                                        selectedType === type 
                                        ? 'bg-orange-50 border-orange-500 text-orange-700 ring-1 ring-orange-500' 
                                        : 'border-zinc-200 text-zinc-600 hover:bg-zinc-50 hover:border-zinc-300'
                                    }`}
                                >
                                    {type} Team
                                </button>
                            ))}
                        </div>
                    </div>
                    <div>
                        <label className="text-xs font-bold text-zinc-500 uppercase ml-1 block mb-2">Target Sector</label>
                        <select 
                            value={selectedSector}
                            onChange={(e) => setSelectedSector(e.target.value)}
                            className="w-full bg-zinc-50 border border-zinc-200 rounded-xl p-3 text-sm font-medium text-zinc-900 focus:outline-none focus:ring-2 focus:ring-orange-500"
                        >
                            <option value="Sector A">Sector A - Cipedes (Critical)</option>
                            <option value="Sector B">Sector B - Kawalu</option>
                            <option value="Sector C">Sector C - Indihiang</option>
                        </select>
                    </div>
                </div>

                <div className="mt-8 flex gap-3">
                    <button onClick={onClose} className="flex-1 py-3 rounded-xl font-bold text-zinc-500 hover:bg-zinc-50 transition-colors">Cancel</button>
                    <button 
                        onClick={() => { onDeploy(selectedType, selectedSector); onClose(); }} 
                        className="flex-[2] py-3 rounded-xl font-bold text-white bg-orange-600 hover:bg-orange-700 shadow-lg shadow-orange-500/20 flex items-center justify-center gap-2 active:scale-95 transition-transform"
                    >
                        <Send size={16} /> Deploy Now
                    </button>
                </div>
            </motion.div>
        </div>
    );
};

// --- MAIN COMPONENT ---

export default function DisasterRelief() {
  // STATE
  const [activeKpi, setActiveKpi] = useState(null);
  const [timeRange, setTimeRange] = useState('24H');
  const [mapLayer, setMapLayer] = useState('all');
  const [alertQuery, setAlertQuery] = useState('');
  const [alertLevel, setAlertLevel] = useState('Orange');
  const [isDeployOpen, setIsDeployOpen] = useState(false);
  
  // Data States (For Simulation)
  const [resourceData, setResourceData] = useState(RESOURCE_DATA);
  const [riskData, setRiskData] = useState(INITIAL_RISK_DATA);
  const [isLiveMode, setIsLiveMode] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0); // Forces re-render on "refresh"

  // LOGIC: Filter Alerts based on Search AND KPI Selection
  const filteredAlerts = useMemo(() => {
    let result = ALERTS_DATA;
    
    // 1. Filter by Search Query
    if (alertQuery) {
        result = result.filter(a => 
            a.type.toLowerCase().includes(alertQuery.toLowerCase()) || 
            a.location.toLowerCase().includes(alertQuery.toLowerCase())
        );
    }

    // 2. Filter by Active KPI Context
    if (activeKpi) {
        const kpi = KPI_DATA.find(k => k.id === activeKpi);
        if (kpi) {
            result = result.filter(a => a.type.includes(kpi.filterKey));
        }
    }

    return result;
  }, [alertQuery, activeKpi]);

  const toggleAlertLevel = () => {
    const levels = ['Yellow', 'Orange', 'Red'];
    const next = levels[(levels.indexOf(alertLevel) + 1) % levels.length];
    setAlertLevel(next);
  };

  // LOGIC: Handle Deployment from Modal
  const handleDeploy = (type, sector) => {
     setResourceData(prev => prev.map(item => {
        if (item.type === type) {
            // Increase count but cap at max for safety, though UI handles it
            const newCount = Math.min(item.count + 5, item.max); 
            return { ...item, count: newCount };
        }
        return item;
     }));
     
     // Optional: Simulate risk reduction if enough resources deployed
     if (type === 'Rescue' || type === 'Medics') {
         setTimeout(() => {
             setRiskData(prev => ({
                 ...prev,
                 [timeRange]: prev[timeRange].map(d => ({...d, val: Math.max(10, d.val - 2)}))
             }));
         }, 500);
     }
  };

  // LOGIC: Manual Refresh Simulation
  const handleRefresh = () => {
      setRefreshKey(prev => prev + 1);
      // Simulate fetching data
      const randomTrend = Math.floor(Math.random() * 10) - 5;
      setResourceData(prev => prev.map(r => ({...r, count: Math.max(0, r.count + (Math.random() > 0.5 ? 1 : -1))})));
  };

  // LOGIC: Map Marker Click
  const handleMarkerClick = (locationName) => {
      setAlertQuery(locationName); // Filter alerts by this location
      setMapLayer('all'); // Show context
  };

  // EFFECT: Live Mode Simulation
  useEffect(() => {
    let interval;
    if (isLiveMode) {
        interval = setInterval(() => {
            setRiskData(prevData => {
                const currentData = [...prevData[timeRange]];
                // Modify the last data point slightly to simulate live feed
                const lastIdx = currentData.length - 1;
                const variance = Math.floor(Math.random() * 10) - 5;
                const newVal = Math.max(10, Math.min(90, currentData[lastIdx].val + variance));
                
                const newData = [...currentData];
                newData[lastIdx] = { ...newData[lastIdx], val: newVal };
                
                return {
                    ...prevData,
                    [timeRange]: newData
                };
            });
        }, 2000);
    }
    return () => clearInterval(interval);
  }, [isLiveMode, timeRange]);

  // Calculations for Progress Bars
  const getResourcePercent = (type) => {
      const item = resourceData.find(r => r.type === type);
      return item ? (item.count / item.max) * 100 : 0;
  };

  return (
    <PageLayout 
        title="Disaster Relief" 
        subtitle="Emergency Operations" 
        colorTheme="orange"
    >
        <AnimatePresence>
            {isDeployOpen && (
                <DeployModal 
                    isOpen={isDeployOpen} 
                    onClose={() => setIsDeployOpen(false)} 
                    onDeploy={handleDeploy} 
                />
            )}
        </AnimatePresence>

        {/* HEADER CONTROLS */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-8">
            <div className="flex items-center gap-3">
                 <motion.button 
                    whileTap={{ scale: 0.95 }}
                    onClick={toggleAlertLevel}
                    className={`flex items-center gap-2 px-3 py-1.5 rounded-full border shadow-sm transition-colors cursor-pointer select-none ${
                        alertLevel === 'Red' ? 'bg-red-50 border-red-200 text-red-700' :
                        alertLevel === 'Orange' ? 'bg-orange-50 border-orange-200 text-orange-700' :
                        'bg-yellow-50 border-yellow-200 text-yellow-700'
                    }`}
                 >
                    <div className={`w-2 h-2 rounded-full animate-pulse ${
                         alertLevel === 'Red' ? 'bg-red-600' :
                         alertLevel === 'Orange' ? 'bg-orange-600' : 'bg-yellow-500'
                    }`}></div>
                    <span className="text-xs font-bold uppercase tracking-wide">Alert Level: {alertLevel}</span>
                </motion.button>
                
                <button 
                    onClick={handleRefresh}
                    className="text-xs text-zinc-400 font-mono flex items-center gap-1 hover:text-orange-600 transition-colors"
                >
                    <RefreshCw key={refreshKey} size={10} className={`${refreshKey > 0 ? 'animate-spin' : ''}`}/> 
                    Live Update
                </button>
            </div>

            {/* EOC Status Widget */}
            <div className="bg-white p-2 pr-6 rounded-[2rem] border border-zinc-200 shadow-sm flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-orange-100 flex items-center justify-center text-orange-600 border-4 border-white shadow-sm">
                    <ShieldAlert size={20} />
                </div>
                <div>
                    <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider">Ops Center</p>
                    <div className="flex items-baseline gap-1">
                        <span className="text-lg font-bold text-zinc-900">Active</span>
                        <span className="text-xs text-zinc-400 font-medium">• {resourceData.reduce((acc, curr) => acc + curr.count, 0)} Units</span>
                    </div>
                </div>
            </div>
        </div>

        {/* KPI SECTION (INTERACTIVE) */}
        <section className="mb-8">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {KPI_DATA.map((kpi) => (
                    <MetricCard 
                        key={kpi.id} 
                        item={kpi} 
                        isActive={activeKpi === kpi.id}
                        onClick={() => {
                            // Toggle Filter Logic
                            setActiveKpi(activeKpi === kpi.id ? null : kpi.id);
                            if (activeKpi !== kpi.id) setAlertQuery(''); // Clear text search when clicking KPI
                        }}
                    />
                ))}
            </div>
        </section>

        {/* MAIN GRID */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            
            {/* LEFT: MAP & ANALYTICS (8 Cols) */}
            <div className="lg:col-span-8 flex flex-col gap-8">
                
                {/* Hazard Map */}
                <div className="bg-white rounded-[2.5rem] p-2 shadow-sm border border-zinc-200 relative overflow-hidden h-[500px] group">
                      {/* Map Container */}
                      <div className="w-full h-full rounded-[2rem] bg-zinc-100 relative overflow-hidden">
                        <div className="absolute inset-0 opacity-[0.05] bg-[linear-gradient(to_right,#000000_1px,transparent_1px),linear-gradient(to_bottom,#000000_1px,transparent_1px)] bg-[size:40px_40px]"></div>
                        
                        {/* Abstract River/Flood Zone */}
                        <svg className="absolute inset-0 w-full h-full pointer-events-none opacity-30">
                            <path d="M -50 200 Q 150 100 400 300 T 900 400" stroke="#3b82f6" strokeWidth="80" fill="none" strokeLinecap="round" className="blur-3xl" />
                            <path d="M -50 200 Q 150 100 400 300 T 900 400" stroke="#93c5fd" strokeWidth="2" fill="none" strokeDasharray="10 5" />
                        </svg>

                        {/* Topo Lines */}
                        <div className="absolute top-0 right-0 w-96 h-96 border-[40px] border-zinc-200/50 rounded-full -mr-32 -mt-32"></div>

                        {/* Map Layer Controls */}
                        <div className="absolute top-6 left-6 z-20 flex gap-2">
                            <button 
                                onClick={() => setIsLiveMode(!isLiveMode)}
                                className={`px-4 py-2 rounded-2xl border shadow-sm flex items-center gap-3 transition-all ${
                                    isLiveMode 
                                    ? 'bg-red-500 border-red-500 text-white' 
                                    : 'bg-white/90 backdrop-blur-md border-zinc-200 text-zinc-900'
                                }`}
                            >
                                <Radio size={16} className={isLiveMode ? 'animate-pulse' : ''} />
                                <span className="text-xs font-bold uppercase tracking-wide">Live</span>
                            </button>

                            <div className="flex bg-white/90 backdrop-blur-md rounded-2xl border border-zinc-200 shadow-sm p-1">
                                {['all', 'flood', 'seismic'].map((layer) => (
                                    <button
                                        key={layer}
                                        onClick={() => setMapLayer(layer)}
                                        className={`px-3 py-1 rounded-xl text-[10px] font-bold uppercase transition-colors ${
                                            mapLayer === layer ? 'bg-orange-500 text-white shadow-sm' : 'text-zinc-500 hover:bg-zinc-100'
                                        }`}
                                    >
                                        {layer}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Map Markers */}
                        <AnimatePresence>
                            {(mapLayer === 'all' || mapLayer === 'flood') && (
                                <motion.div 
                                    key="marker-flood"
                                    onClick={() => handleMarkerClick("Cipedes")}
                                    className="absolute top-1/3 left-1/4 cursor-pointer z-10 group/marker"
                                    initial={{ scale: 0 }} animate={{ scale: 1 }} exit={{ scale: 0 }}
                                    whileHover={{ scale: 1.1 }}
                                >
                                    <span className="absolute -inset-6 rounded-full bg-red-500/20 animate-ping"></span>
                                    <div className="w-6 h-6 bg-red-500 rounded-full border-2 border-white shadow-lg flex items-center justify-center">
                                        <Waves size={12} className="text-white" />
                                    </div>
                                    <div className="absolute top-8 left-1/2 -translate-x-1/2 bg-white/90 px-3 py-1.5 rounded-xl shadow-sm border border-zinc-100 whitespace-nowrap opacity-0 group-hover/marker:opacity-100 transition-opacity pointer-events-none">
                                        <p className="text-[10px] font-bold text-red-600 uppercase">Flood Zone A</p>
                                        <p className="text-[10px] text-zinc-500">Water Level: 2.4m</p>
                                    </div>
                                </motion.div>
                            )}

                            {(mapLayer === 'all' || mapLayer === 'seismic') && (
                                <motion.div 
                                    key="marker-quake"
                                    onClick={() => handleMarkerClick("Kawalu")}
                                    className="absolute bottom-1/3 right-1/3 cursor-pointer z-10 group/marker"
                                    initial={{ scale: 0 }} animate={{ scale: 1 }} exit={{ scale: 0 }}
                                    transition={{ delay: 0.1 }}
                                    whileHover={{ scale: 1.1 }}
                                >
                                    <div className="w-6 h-6 bg-orange-500 rounded-full border-2 border-white shadow-lg flex items-center justify-center">
                                        <Activity size={12} className="text-white" />
                                    </div>
                                    <div className="absolute top-8 left-1/2 -translate-x-1/2 bg-white/90 px-3 py-1.5 rounded-xl shadow-sm border border-zinc-100 whitespace-nowrap opacity-0 group-hover/marker:opacity-100 transition-opacity pointer-events-none">
                                        <p className="text-[10px] font-bold text-orange-600 uppercase">Landslide Risk</p>
                                        <p className="text-[10px] text-zinc-500">Tremor detected</p>
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>

                        {/* Legend */}
                        <div className="absolute bottom-6 right-6 bg-white/90 backdrop-blur-md p-3 rounded-2xl border border-zinc-200 shadow-sm flex flex-col gap-2">
                            <div className="flex items-center gap-2 text-[10px] font-bold text-zinc-500">
                                <span className="w-2 h-2 bg-red-500 rounded-full"></span> Critical
                            </div>
                            <div className="flex items-center gap-2 text-[10px] font-bold text-zinc-500">
                                <span className="w-2 h-2 bg-orange-500 rounded-full"></span> Warning
                            </div>
                        </div>
                      </div>
                </div>

                {/* Analytics Row */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    
                    {/* Risk Trend (DYNAMIC DATA) */}
                    <div className="bg-white p-6 rounded-[2.5rem] border border-zinc-200 shadow-sm">
                        <div className="flex justify-between items-center mb-6">
                            <div>
                                <h3 className="font-bold text-sm text-zinc-900">Risk Index</h3>
                                <p className="text-[10px] text-zinc-400">Past {timeRange}</p>
                            </div>
                            
                            <div className="flex bg-zinc-50 rounded-lg p-0.5 border border-zinc-100">
                                {['12H', '24H', '7D'].map((range) => (
                                    <button
                                        key={range}
                                        onClick={() => setTimeRange(range)}
                                        className={`px-2 py-1 rounded-md text-[10px] font-bold transition-all ${
                                            timeRange === range 
                                            ? 'bg-white text-orange-600 shadow-sm border border-zinc-100' 
                                            : 'text-zinc-400 hover:text-zinc-600'
                                        }`}
                                    >
                                        {range}
                                    </button>
                                ))}
                            </div>
                        </div>
                        <div className="h-40 w-full">
                            <ResponsiveContainer width="100%" height="100%">
                                <AreaChart data={riskData[timeRange]}>
                                    <defs>
                                        <linearGradient id="colorRisk" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="#f97316" stopOpacity={0.2}/>
                                            <stop offset="95%" stopColor="#f97316" stopOpacity={0}/>
                                        </linearGradient>
                                    </defs>
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f4f4f5" />
                                    <XAxis dataKey="time" axisLine={false} tickLine={false} tick={{fontSize: 10, fill: '#a1a1aa'}} />
                                    <Tooltip contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }} />
                                    <Area 
                                        type="monotone" 
                                        dataKey="val" 
                                        stroke="#f97316" 
                                        strokeWidth={3} 
                                        fillOpacity={1} 
                                        fill="url(#colorRisk)" 
                                        animationDuration={isLiveMode ? 200 : 800}
                                        isAnimationActive={true}
                                    />
                                </AreaChart>
                            </ResponsiveContainer>
                        </div>
                    </div>

                    {/* Resource Chart */}
                    <div className="bg-white p-6 rounded-[2.5rem] border border-zinc-200 shadow-sm">
                        <div className="flex justify-between items-center mb-6">
                            <h3 className="font-bold text-sm text-zinc-900">Deployed Resources</h3>
                            <div className="w-8 h-8 rounded-full bg-zinc-50 flex items-center justify-center text-zinc-400">
                                <Truck size={14} />
                            </div>
                        </div>
                        <div className="h-40 w-full">
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={resourceData} layout="vertical">
                                    <XAxis type="number" hide domain={[0, 'dataMax + 20']} />
                                    <YAxis dataKey="type" type="category" width={60} tick={{fontSize: 10}} axisLine={false} tickLine={false} />
                                    <Tooltip cursor={{fill: 'transparent'}} contentStyle={{ borderRadius: '12px', border: 'none' }} />
                                    <Bar dataKey="count" fill="#ea580c" radius={[0, 4, 4, 0]} barSize={20} animationDuration={500} />
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    </div>

                </div>
            </div>

            {/* RIGHT: ALERTS & STATUS (4 Cols) */}
            <div className="lg:col-span-4 flex flex-col gap-6">
                
                {/* Emergency Status (Dark Card) */}
                <div className={`text-white p-8 rounded-[2.5rem] shadow-xl relative overflow-hidden transition-colors duration-500 ${
                    alertLevel === 'Red' ? 'bg-red-900 shadow-red-900/20' : 
                    alertLevel === 'Orange' ? 'bg-zinc-900 shadow-zinc-900/20' : 'bg-yellow-900 shadow-yellow-900/20'
                }`}>
                    <div className="relative z-10 flex flex-col items-center text-center">
                        <h3 className="font-bold text-lg mb-6 flex items-center gap-2">
                            <Megaphone size={18} className={alertLevel === 'Red' ? 'text-red-400' : 'text-orange-500'} /> 
                            Emergency Broadcast
                        </h3>
                        
                        <div className="w-32 h-32 rounded-full border-[6px] border-white/10 flex items-center justify-center relative mb-6">
                            <div className={`absolute inset-0 border-[6px] rounded-full border-t-transparent border-l-transparent animate-spin-slow ${
                                alertLevel === 'Red' ? 'border-red-500' : 'border-orange-500'
                            }`}></div>
                            <div>
                                <span className={`text-2xl font-bold block tracking-tighter ${
                                    alertLevel === 'Red' ? 'text-red-500' : 'text-orange-500'
                                }`}>ALERT</span>
                                <span className="text-[10px] text-white/50 font-bold uppercase tracking-wider">Level {alertLevel === 'Red' ? '3' : alertLevel === 'Orange' ? '2' : '1'}</span>
                            </div>
                        </div>

                        <div className="w-full space-y-3">
                            <div className="flex justify-between items-center text-xs p-3 bg-white/5 rounded-xl border border-white/5">
                                <span className="text-white/60">Evacuation</span>
                                <span className="text-orange-400 font-bold">Standby</span>
                            </div>
                            <div className="flex justify-between items-center text-xs p-3 bg-white/5 rounded-xl border border-white/5">
                                <span className="text-white/60">Shelters</span>
                                <span className="text-emerald-400 font-bold">Open (3/5)</span>
                            </div>
                        </div>
                    </div>
                    {/* Decor */}
                    <div className={`absolute top-0 right-0 w-64 h-64 blur-[60px] rounded-full pointer-events-none ${
                        alertLevel === 'Red' ? 'bg-red-600/20' : 'bg-orange-600/10'
                    }`}></div>
                </div>

                {/* Early Warning Feed (SEARCHABLE) */}
                <div className="bg-white border border-zinc-200 rounded-[2.5rem] p-6 shadow-sm">
                    <div className="flex flex-col gap-4 mb-6">
                        <div className="flex items-center justify-between px-2">
                            <h3 className="text-lg font-bold text-zinc-900 tracking-tight">Early Warnings</h3>
                            <div className="flex gap-1">
                                <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse"></span>
                                <span className="text-[10px] font-bold text-red-500 uppercase">Live</span>
                            </div>
                        </div>
                        
                        {/* Search Bar */}
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400" size={14} />
                            <input 
                                type="text"
                                placeholder="Filter alerts (e.g. Flood)..."
                                value={alertQuery}
                                onChange={(e) => setAlertQuery(e.target.value)}
                                className="w-full pl-9 pr-4 py-2 bg-zinc-50 border border-zinc-100 rounded-xl text-xs font-bold text-zinc-700 focus:outline-none focus:ring-2 focus:ring-orange-100 transition-all placeholder:font-normal"
                            />
                            {alertQuery && (
                                <button 
                                    onClick={() => setAlertQuery('')}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-600"
                                >
                                    <X size={12}/>
                                </button>
                            )}
                        </div>
                    </div>
                    
                    <div className="space-y-3 overflow-y-auto max-h-[200px] pr-1 scrollbar-hide">
                        {filteredAlerts.length > 0 ? filteredAlerts.map((alert, i) => (
                            <motion.div 
                                layout
                                initial={{ opacity: 0, x: -10 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0 }}
                                transition={{ delay: i * 0.05 }}
                                key={alert.id} 
                                className="relative pl-4 border-l-2 border-zinc-100 group cursor-pointer hover:border-orange-200 transition-colors"
                            >
                                <div className={`absolute left-[-5px] top-1.5 w-2 h-2 rounded-full ${
                                    alert.level === 'Critical' ? 'bg-red-500' : 
                                    alert.level === 'High' ? 'bg-orange-500' : 
                                    alert.level === 'Low' ? 'bg-emerald-500' : 'bg-yellow-400'
                                }`} />
                                
                                <div className="flex justify-between items-start mb-1">
                                    <span className="text-xs font-bold text-zinc-800">{alert.type}</span>
                                    <span className="text-[9px] text-zinc-400">{alert.time}</span>
                                </div>
                                <div className="flex items-center gap-1.5 text-[10px] text-zinc-500">
                                    <MapPin size={10} /> {alert.location}
                                </div>
                                <div className="mt-2 flex">
                                    <span className={`text-[9px] font-bold px-2 py-0.5 rounded border uppercase ${
                                        alert.level === 'Critical' ? 'bg-red-50 text-red-600 border-red-100' : 
                                        alert.level === 'High' ? 'bg-orange-50 text-orange-600 border-orange-100' : 
                                        alert.level === 'Low' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : 'bg-yellow-50 text-yellow-600 border-yellow-100'
                                    }`}>
                                        {alert.level}
                                    </span>
                                </div>
                            </motion.div>
                        )) : (
                            <motion.p initial={{opacity:0}} animate={{opacity:1}} className="text-center text-xs text-zinc-400 py-4 italic">
                                No matching alerts found.
                            </motion.p>
                        )}
                    </div>
                </div>

                {/* Logistics & Actions */}
                <div className="bg-white border border-zinc-200 rounded-[2.5rem] p-6 shadow-sm">
                    <div className="flex items-center justify-between mb-4">
                        <h4 className="font-bold text-sm text-zinc-900">Logistics</h4>
                        <Box size={16} className="text-zinc-400" />
                    </div>
                    <div className="space-y-4 mb-6">
                        {/* Dynamic Progress Bars */}
                        <div>
                            <div className="flex justify-between text-xs mb-1">
                                <span className="text-zinc-500">Relief Packs</span>
                                <span className="font-bold text-zinc-900">{Math.round(getResourcePercent('Logistics'))}% Ready</span>
                            </div>
                            <div className="w-full bg-zinc-100 h-1.5 rounded-full overflow-hidden">
                                <motion.div 
                                    initial={{ width: 0 }}
                                    animate={{ width: `${getResourcePercent('Logistics')}%` }}
                                    transition={{ duration: 1 }}
                                    className="h-full bg-blue-500 rounded-full"
                                ></motion.div>
                            </div>
                        </div>
                        <div>
                            <div className="flex justify-between text-xs mb-1">
                                <span className="text-zinc-500">Rescue Units</span>
                                <span className="font-bold text-zinc-900">{Math.round(getResourcePercent('Rescue'))}% Active</span>
                            </div>
                            <div className="w-full bg-zinc-100 h-1.5 rounded-full overflow-hidden">
                                <motion.div 
                                    initial={{ width: 0 }}
                                    animate={{ width: `${getResourcePercent('Rescue')}%` }}
                                    transition={{ duration: 1 }}
                                    className="h-full bg-emerald-500 rounded-full"
                                ></motion.div>
                            </div>
                        </div>
                    </div>
                    
                    {/* Quick Deploy Button */}
                    <button 
                        onClick={() => setIsDeployOpen(true)}
                        className="w-full py-3 text-xs font-bold text-white bg-zinc-900 rounded-xl hover:bg-orange-600 transition-colors uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg hover:shadow-orange-500/20 active:scale-95 duration-200"
                    >
                        <Plus size={14} /> Quick Deploy
                    </button>
                </div>

            </div>
        </div>
    </PageLayout>
  );
}