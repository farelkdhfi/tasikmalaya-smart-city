import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Leaf, 
  Wind, 
  Droplets, 
  Recycle, 
  Map, 
  Users, 
  Download, 
  ArrowUpRight, 
  ArrowDownRight,
  Clock,
  Info,
  Zap,
  Sprout,
  Trash2,
  TrendingDown,
  TrendingUp,
  CloudRain,
  Sun,
  AlertTriangle,
  Waves,
  TreeDeciduous,
  CheckCircle,
  Loader2
} from 'lucide-react';
import { 
  BarChart, Bar, PieChart, Pie, Cell, 
  ResponsiveContainer, XAxis, Tooltip, CartesianGrid, Area, AreaChart 
} from 'recharts';

import PageLayout from '../../components/PageLayout'; 

// --- UTILS ---
const getRandom = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;

// --- INITIAL DATA ---
const INITIAL_EMISSION = [
  { name: '10:00', value: 420 }, { name: '10:05', value: 390 }, { name: '10:10', value: 380 }, 
  { name: '10:15', value: 360 }, { name: '10:20', value: 390 }, { name: '10:25', value: 350 },
  { name: '10:30', value: 310 }, { name: '10:35', value: 290 }, { name: '10:40', value: 280 }, 
  { name: '10:45', value: 260 }, { name: '10:50', value: 250 }, { name: '10:55', value: 230 }
];

const INITIAL_DISTRICTS = [
  { name: 'Cihideung', rate: 72 }, { name: 'Cipedes', rate: 65 },
  { name: 'Tawang', rate: 88 }, { name: 'Indihiang', rate: 54 }
];

const INITIAL_MODULES = [
    { id: 1, title: "Energy Efficiency 101", cat: "Infrastructure", time: "2h 15m", progress: 100 },
    { id: 2, title: "Water Conservation", cat: "Resources", time: "1h 30m", progress: 65 },
    { id: 3, title: "Zero Waste Lifestyle", cat: "Waste Mgt", time: "3h 00m", progress: 20 },
];

const EXTRA_MODULES = [
    { id: 4, title: "Urban Farming Basics", cat: "Agriculture", time: "4h 10m", progress: 0 },
    { id: 5, title: "Smart Grid Systems", cat: "Tech", time: "1h 45m", progress: 10 },
];

// --- SUB-COMPONENTS ---

const TrendBadge = ({ value }) => {
    const isGood = value > 0; 
    return (
        <div className={`flex items-center gap-1 text-[10px] md:text-xs font-medium px-2 py-1 rounded-full ${
            isGood ? 'bg-emerald-50 text-emerald-700' : 'bg-red-50 text-red-700'
        }`}>
            {isGood ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
            {Math.abs(value).toFixed(1)}%
        </div>
    );
};

const MetricCard = ({ item, onClick }) => (
    <motion.div
        layout
        onClick={onClick}
        // RESPONSIVE: Height & Padding adjustments
        className="bg-white rounded-3xl p-4 md:p-5 h-40 md:h-48 flex flex-col justify-between shadow-sm hover:shadow-xl hover:shadow-emerald-500/5 border border-zinc-100 transition-all duration-300 group relative overflow-hidden cursor-pointer"
    >
        <div className="flex justify-between items-start z-10">
            <div className={`w-8 h-8 md:w-10 md:h-10 rounded-2xl flex items-center justify-center transition-colors duration-300 bg-zinc-50 text-zinc-900 group-hover:bg-emerald-600 group-hover:text-white`}>
                <item.icon size={18} className="md:w-5 md:h-5" />
            </div>
            <div className="w-6 h-6 md:w-7 md:h-7 rounded-full bg-zinc-100 flex items-center justify-center text-zinc-400 group-hover:text-emerald-600 transition-colors">
                <ArrowUpRight size={12} className="md:w-[14px]" />
            </div>
        </div>
        <div className="z-10 mt-auto">
            <div className="flex justify-between items-end mb-1">
                {/* RESPONSIVE: Font size */}
                <h3 className="text-2xl md:text-3xl font-bold text-zinc-900 tracking-tight leading-none group-hover:text-emerald-600 transition-colors">
                    {item.value}
                </h3>
                <TrendBadge value={item.trend} />
            </div>
            <p className="text-[10px] md:text-xs text-zinc-500 font-medium uppercase tracking-wide truncate">{item.label}</p>
        </div>
        <div className="absolute -right-4 -bottom-4 opacity-0 group-hover:opacity-5 transition-opacity duration-500 pointer-events-none">
            <item.icon size={80} className="md:w-[100px] md:h-[100px]" />
        </div>
    </motion.div>
);

// --- MAIN COMPONENT ---

export default function EcoAwareness() {
  // --- STATE MANAGEMENT ---
  const [time, setTime] = useState(new Date());
  
  // Feature States
  const [weather, setWeather] = useState({ temp: 28, aqi: 45, cond: 'Sunny' });
  const [gridLoad, setGridLoad] = useState(65);
  const [waterLevel, setWaterLevel] = useState(78);
  const [treesSaved, setTreesSaved] = useState(1420);
  
  // Data States
  const [kpiData, setKpiData] = useState([
    { id: 1, label: 'Carbon Index', sub: 'Tons CO2e', value: 2.4, trend: -12, icon: Wind },
    { id: 2, label: 'Recycling Rate', sub: 'Citywide', value: 68, trend: 5.2, icon: Recycle },
    { id: 3, label: 'Renewable Mix', sub: 'Solar & Hydro', value: 32, trend: 8.0, icon: Zap },
    { id: 4, label: 'Water Quality', sub: 'Purity Index', value: 0.82, trend: -2.1, icon: Droplets },
  ]);
  
  const [emissionData, setEmissionData] = useState(INITIAL_EMISSION);
  const [districtData, setDistrictData] = useState(INITIAL_DISTRICTS);
  const [energyMix, setEnergyMix] = useState([
    { name: 'Solar', value: 35, color: '#fbbf24' }, 
    { name: 'Hydro', value: 25, color: '#3b82f6' },
    { name: 'Grid', value: 40, color: '#e2e8f0' }
  ]);

  // Interactive States
  const [alerts, setAlerts] = useState([
    { id: 1, type: 'warning', msg: 'High PM2.5 detected in Industrial Zone' }
  ]);
  const [modules, setModules] = useState(INITIAL_MODULES);
  const [showAllModules, setShowAllModules] = useState(false);
  const [downloadStatus, setDownloadStatus] = useState('idle'); // idle, loading, success
  const [activeLearningId, setActiveLearningId] = useState(null);

  // --- LOGIC ENGINE ---
  
  // 1. Central Simulation Loop (The Brain)
  useEffect(() => {
    const interval = setInterval(() => {
        setTime(new Date());

        // A. Weather Dynamics
        const isSunny = weather.cond === 'Sunny';
        
        // B. Update Renewable Energy Mix based on Weather
        setEnergyMix(prev => {
            const targetSolar = isSunny ? 45 : 15;
            const currentSolar = prev[0].value;
            const newSolar = currentSolar + (targetSolar - currentSolar) * 0.1; 
            
            const hydro = prev[1].value;
            const newGrid = 100 - newSolar - hydro;

            return [
                { ...prev[0], value: newSolar },
                { ...prev[1], value: hydro },
                { ...prev[2], value: newGrid }
            ];
        });

        // C. Update Water Level based on Weather
        setWaterLevel(prev => {
            const change = isSunny ? -0.05 : 0.2; 
            return Math.max(40, Math.min(98, prev + change + (Math.random() - 0.5) * 0.1));
        });

        // D. Grid Load Simulation
        setGridLoad(prev => {
            const baseLoad = 60;
            const noise = getRandom(-2, 2);
            const weatherLoad = isSunny ? 0 : 10; 
            return Math.min(98, Math.max(30, prev + (baseLoad + weatherLoad - prev) * 0.1 + noise));
        });

        // E. KPI Fluctuation
        setKpiData(prev => prev.map(k => {
            const noise = (Math.random() - 0.5) * 0.1;
            let val = k.value;
            if (k.label === 'Carbon Index') {
                val = energyMix[2].value > 50 ? val + 0.01 : val - 0.01;
            }
            return { ...k, value: Number((val + noise).toFixed(2)), trend: Number((k.trend + noise * 5).toFixed(1)) };
        }));

        // F. Emission Chart Scrolling
        setEmissionData(prev => {
            const baseEmission = gridLoad * 4; 
            const newVal = Math.max(200, Math.min(500, baseEmission + getRandom(-20, 20)));
            const newTime = new Date(); 
            const timeLabel = `${newTime.getHours()}:${newTime.getMinutes() < 10 ? '0'+newTime.getMinutes() : newTime.getMinutes()}`;
            return [...prev.slice(1), { name: timeLabel, value: newVal }];
        });

        // G. Auto-Generate Alerts
        if (gridLoad > 90 && !alerts.find(a => a.msg.includes('Grid Load'))) {
            addAlert({ id: Date.now(), type: 'warning', msg: 'Critical: High Grid Load detected' });
        }
        if (weather.aqi > 100 && !alerts.find(a => a.msg.includes('Air Quality'))) {
            addAlert({ id: Date.now(), type: 'warning', msg: 'Warning: Poor Air Quality Index' });
        }

        // H. Trees Saved Incrementor
        setTreesSaved(prev => prev + (Math.random() > 0.7 ? 1 : 0));

        // I. Random Weather Change (Rare event)
        if(Math.random() > 0.98) {
            setWeather(prev => ({
                temp: prev.cond === 'Sunny' ? prev.temp - 2 : prev.temp + 2,
                aqi: Math.max(10, Math.min(150, prev.aqi + getRandom(-10, 10))),
                cond: prev.cond === 'Sunny' ? 'Cloudy' : 'Sunny'
            }));
        }

    }, 1500);

    return () => clearInterval(interval);
  }, [weather, energyMix, alerts, gridLoad]);

  // 2. Learning Progress Simulation
  useEffect(() => {
    if (!activeLearningId) return;

    const learnInterval = setInterval(() => {
        setModules(prev => prev.map(m => {
            if (m.id === activeLearningId) {
                if (m.progress >= 100) {
                    setActiveLearningId(null); // Finish
                    return { ...m, progress: 100 };
                }
                return { ...m, progress: m.progress + 2 };
            }
            return m;
        }));
    }, 100);

    return () => clearInterval(learnInterval);
  }, [activeLearningId]);


  // --- HANDLERS ---

  const addAlert = (newAlert) => {
      setAlerts(prev => [newAlert, ...prev].slice(0, 4)); // Keep max 4
  };

  const handleDismissAlert = (id) => {
      setAlerts(prev => prev.filter(a => a.id !== id));
  };

  const handleDownload = () => {
      if (downloadStatus !== 'idle') return;
      setDownloadStatus('loading');
      setTimeout(() => {
          setDownloadStatus('success');
          setTimeout(() => setDownloadStatus('idle'), 3000);
      }, 2000);
  };

  const handleModuleClick = (id) => {
      const module = modules.find(m => m.id === id);
      if (module.progress < 100) {
          setActiveLearningId(id);
      }
  };

  const toggleModules = () => {
      if (showAllModules) {
          setModules(INITIAL_MODULES);
      } else {
          setModules([...INITIAL_MODULES, ...EXTRA_MODULES]);
      }
      setShowAllModules(!showAllModules);
  };

  const handleDistrictHover = (data) => {
      if (data && data.activePayload) {
          const rate = data.activePayload[0].payload.rate;
          setKpiData(prev => prev.map(k => 
              k.label === 'Recycling Rate' ? { ...k, value: rate, trend: 0 } : k
          ));
      }
  };

  // --- RENDER ---

  return (
    <PageLayout 
        title="Eco Awareness" 
        subtitle="Environmental Intelligence" 
        colorTheme="emerald"
    >
        {/* HEADER CONTROLS & FEATURE 2 (WEATHER) */}
        {/* RESPONSIVE: Stack vertical on mobile, row on large screens */}
        <div className="flex flex-col xl:flex-row justify-between items-start xl:items-center gap-4 xl:gap-6 mb-6 md:mb-8">
            <div className="flex flex-wrap items-center gap-3">
                 <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-white border border-emerald-200 shadow-sm">
                    <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
                    <span className="text-[10px] md:text-xs font-semibold text-emerald-700 uppercase tracking-wide">Live Sensor Data</span>
                </div>
                <span className="text-[10px] md:text-xs text-zinc-400 font-mono">Last Sync: {time.toLocaleTimeString()}</span>
            </div>

            {/* Widgets Container */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 w-full xl:w-auto">
                {/* FEATURE 2: WEATHER & AQI WIDGET */}
                <motion.div 
                    whileHover={{ scale: 1.02 }}
                    className="bg-white p-2 px-3 md:px-4 rounded-2xl border border-zinc-200 shadow-sm flex items-center gap-3 cursor-pointer w-full"
                    onClick={() => setWeather(prev => ({ ...prev, cond: prev.cond === 'Sunny' ? 'Cloudy' : 'Sunny' }))} 
                >
                    <div className={`p-2 rounded-full transition-colors duration-500 shrink-0 ${weather.cond === 'Sunny' ? 'bg-orange-100 text-orange-500' : 'bg-blue-100 text-blue-500'}`}>
                        {weather.cond === 'Sunny' ? <Sun size={16} /> : <CloudRain size={16} />}
                    </div>
                    <div>
                        <div className="flex items-center gap-2">
                            <span className="text-sm font-bold text-zinc-900">{weather.temp.toFixed(1)}°C</span>
                            <span className={`text-[10px] px-1.5 rounded font-bold transition-colors ${weather.aqi < 50 ? 'bg-emerald-100 text-emerald-700' : 'bg-yellow-100 text-yellow-700'}`}>
                                AQI {weather.aqi}
                            </span>
                        </div>
                        <p className="text-[10px] text-zinc-400 font-medium uppercase">{weather.cond}</p>
                    </div>
                </motion.div>

                {/* Eco Score Widget */}
                <div className="bg-white p-2 pr-6 rounded-2xl border border-zinc-200 shadow-sm flex items-center gap-4 w-full">
                    <div className="w-10 h-10 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600 border-2 border-white shadow-sm shrink-0">
                        <Leaf size={18} fill="currentColor" />
                    </div>
                    <div>
                        <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider">Eco Score</p>
                        <div className="flex items-baseline gap-1">
                            <span className="text-lg md:text-xl font-bold text-zinc-900">{Math.round((kpiData[1].value + kpiData[2].value)/2)}</span>
                            <span className="text-[10px] text-zinc-400 font-medium">/100</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        {/* KPI SECTION */}
        <section className="mb-6 md:mb-8">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
                {kpiData.map((kpi) => (
                    <MetricCard 
                        key={kpi.id} 
                        item={{...kpi, value: kpi.label === 'Recycling Rate' || kpi.label === 'Renewable Mix' ? `${kpi.value.toFixed(0)}%` : kpi.value}} 
                        onClick={() => {}} 
                    />
                ))}
            </div>
        </section>

        {/* MAIN GRID */}
        {/* RESPONSIVE: Single col on mobile, 12 cols on Desktop */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 md:gap-8 items-start">
            
            {/* LEFT: DATA VISUALIZATION (8 Cols) */}
            <div className="lg:col-span-8 flex flex-col gap-6 md:gap-8">
                
                {/* Main Emission Chart */}
                <div className="bg-white rounded-[2rem] md:rounded-[2.5rem] p-4 md:p-8 shadow-sm border border-zinc-200">
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 sm:gap-0 mb-6 md:mb-8">
                        <div>
                            <h3 className="text-base md:text-lg font-bold text-zinc-900 tracking-tight">Emission Trends</h3>
                            <p className="text-xs text-zinc-500 uppercase tracking-wide">Real-time CO2 Monitor</p>
                        </div>
                        {/* FEATURE 5: CARBON COUNTER */}
                        <div className="flex items-center gap-3 px-3 py-2 md:px-4 md:py-2 bg-emerald-50 rounded-2xl border border-emerald-100 self-end sm:self-auto">
                            <div className="p-1.5 bg-emerald-200 rounded-full text-emerald-800">
                                <TreeDeciduous size={16} />
                            </div>
                            <div>
                                <span className="block text-lg md:text-xl font-bold text-emerald-800 leading-none">{treesSaved.toLocaleString()}</span>
                                <span className="text-[9px] font-bold text-emerald-600 uppercase tracking-wider">Trees Saved</span>
                            </div>
                        </div>
                    </div>
                    
                    <div className="h-[250px] md:h-[300px] w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={emissionData}>
                                <defs>
                                    <linearGradient id="colorVal" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#10b981" stopOpacity={0.2}/>
                                        <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f4f4f5" />
                                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fontSize: 10, fill: '#a1a1aa'}} dy={10} />
                                <Tooltip 
                                    contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)' }} 
                                    itemStyle={{ color: '#059669', fontWeight: 'bold' }}
                                />
                                <Area isAnimationActive={false} type="monotone" dataKey="value" stroke="#10b981" strokeWidth={3} fillOpacity={1} fill="url(#colorVal)" />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Secondary Charts Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                    
                    {/* Recycling Bar Chart */}
                    <div className="bg-white rounded-[2rem] md:rounded-[2.5rem] p-5 md:p-6 shadow-sm border border-zinc-200">
                        <div className="flex items-center gap-2 mb-4 md:mb-6">
                            <Trash2 size={16} className="text-blue-500" />
                            <h4 className="text-sm font-bold text-zinc-900">Recycling by District</h4>
                        </div>
                        <div className="h-48">
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={districtData} onMouseMove={handleDistrictHover}>
                                    <Tooltip cursor={{fill: 'transparent'}} contentStyle={{ borderRadius: '12px', border: 'none' }} />
                                    <Bar dataKey="rate" radius={[6, 6, 6, 6]}>
                                        {districtData.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={entry.rate > 80 ? '#10b981' : '#e2e8f0'} />
                                        ))}
                                    </Bar>
                                    <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fontSize: 10, fill: '#a1a1aa'}} dy={10} />
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    </div>

                    {/* Energy Pie Chart */}
                    <div className="bg-white rounded-[2rem] md:rounded-[2.5rem] p-5 md:p-6 shadow-sm border border-zinc-200 relative overflow-hidden">
                        <div className="flex items-center justify-between mb-2 relative z-10">
                            <div className="flex items-center gap-2">
                                <Zap size={16} className="text-yellow-500" />
                                <h4 className="text-sm font-bold text-zinc-900">Energy Mix</h4>
                            </div>
                            <span className="text-[10px] font-bold text-zinc-400 bg-zinc-100 px-2 py-1 rounded">LIVE</span>
                        </div>
                        <div className="h-48 relative z-10">
                            <ResponsiveContainer width="100%" height="100%">
                                <PieChart>
                                    <Pie 
                                        data={energyMix} 
                                        innerRadius={50} 
                                        outerRadius={70} 
                                        paddingAngle={5} 
                                        dataKey="value"
                                        stroke="none"
                                        isAnimationActive={false} 
                                    >
                                        {energyMix.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={entry.color} />
                                        ))}
                                    </Pie>
                                </PieChart>
                            </ResponsiveContainer>
                            {/* Center Label */}
                            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-center pointer-events-none">
                                <span className="text-[10px] font-bold text-zinc-400 uppercase">Renewable</span>
                                <div className="text-xl font-bold text-zinc-900">{(energyMix[0].value + energyMix[1].value).toFixed(0)}%</div>
                            </div>
                        </div>
                        
                        <div className="flex justify-center gap-4 text-[10px] font-bold uppercase text-zinc-400 relative z-10">
                            <div className="flex items-center gap-1"><div className="w-2 h-2 rounded-full bg-yellow-400"></div> Solar</div>
                            <div className="flex items-center gap-1"><div className="w-2 h-2 rounded-full bg-blue-500"></div> Hydro</div>
                            <div className="flex items-center gap-1"><div className="w-2 h-2 rounded-full bg-zinc-200"></div> Grid</div>
                        </div>
                    </div>

                </div>
            </div>

            {/* RIGHT: WIDGETS & POLICY (4 Cols) */}
            <div className="lg:col-span-4 flex flex-col gap-4 md:gap-6">
                
                {/* FEATURE 1: REAL-TIME GRID LOAD */}
                <div className="bg-zinc-900 text-white rounded-[2rem] md:rounded-[2.5rem] p-5 md:p-6 shadow-sm relative overflow-hidden">
                    <div className="flex justify-between items-center mb-4 relative z-10">
                        <div className="flex items-center gap-2">
                            <Zap size={18} className="text-yellow-400" />
                            <h4 className="font-bold text-sm">Grid Load</h4>
                        </div>
                        <span className={`text-xs font-bold px-2 py-1 rounded ${gridLoad > 85 ? 'bg-red-500 text-white' : 'bg-zinc-800 text-zinc-400'}`}>
                            {gridLoad.toFixed(0)}%
                        </span>
                    </div>
                    {/* Load Bar */}
                    <div className="w-full bg-zinc-800 h-3 rounded-full overflow-hidden relative z-10 mb-2">
                        <motion.div 
                            animate={{ width: `${gridLoad}%`, backgroundColor: gridLoad > 85 ? '#ef4444' : gridLoad > 60 ? '#eab308' : '#10b981' }}
                            className="h-full rounded-full"
                        />
                    </div>
                    <p className="text-[10px] text-zinc-500 relative z-10">Capacity: 450MW / 600MW</p>
                    {/* Decor */}
                    <div className="absolute top-0 right-0 w-32 h-32 bg-yellow-500/10 blur-[40px] rounded-full pointer-events-none"></div>
                </div>

                {/* FEATURE 4: RESERVOIR LEVEL */}
                <div className="bg-blue-50 border border-blue-100 rounded-[2rem] md:rounded-[2.5rem] p-5 md:p-6 shadow-sm relative overflow-hidden transition-colors">
                    <div className="flex items-center gap-2 mb-4 relative z-10">
                        <Waves size={18} className="text-blue-500" />
                        <h4 className="font-bold text-sm text-blue-900">Reservoir Level</h4>
                    </div>
                    <div className="flex items-end gap-2 relative z-10">
                        <span className="text-3xl md:text-4xl font-bold text-blue-900">{waterLevel.toFixed(1)}m</span>
                        <span className="text-xs text-blue-600 font-medium mb-1">/ 100m Max</span>
                    </div>
                    {/* Liquid Visualization */}
                    <div className="absolute bottom-0 left-0 w-full bg-blue-200/30 h-24">
                        <motion.div 
                            animate={{ height: `${waterLevel}%` }}
                            transition={{ type: 'spring', damping: 20 }}
                            className="absolute bottom-0 left-0 w-full bg-blue-400/30 border-t border-blue-400/50"
                        />
                    </div>
                </div>

                {/* FEATURE 3: ECO-ALERT FEED */}
                <div className="bg-white border border-zinc-200 rounded-[2rem] md:rounded-[2.5rem] p-5 md:p-6 shadow-sm min-h-[160px]">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="text-sm font-bold text-zinc-900">Live Alerts</h3>
                        {alerts.length > 0 && <div className="w-2 h-2 rounded-full bg-red-500 animate-ping"></div>}
                    </div>
                    <div className="space-y-3">
                        <AnimatePresence>
                            {alerts.length === 0 ? (
                                <motion.p initial={{opacity:0}} animate={{opacity:1}} className="text-xs text-zinc-400 italic text-center py-4">All systems normal.</motion.p>
                            ) : (
                                alerts.map((alert) => (
                                    <motion.div 
                                        key={alert.id}
                                        initial={{ opacity: 0, y: -10, height: 0 }}
                                        animate={{ opacity: 1, y: 0, height: 'auto' }}
                                        exit={{ opacity: 0, height: 0 }}
                                        onClick={() => handleDismissAlert(alert.id)}
                                        className="flex gap-3 items-start p-3 bg-zinc-50 hover:bg-red-50 rounded-2xl cursor-pointer group transition-colors"
                                    >
                                        <AlertTriangle size={16} className={`shrink-0 ${alert.type === 'warning' ? 'text-red-500' : 'text-blue-500'}`} />
                                        <p className="text-xs text-zinc-600 leading-snug group-hover:text-zinc-900">{alert.msg}</p>
                                    </motion.div>
                                ))
                            )}
                        </AnimatePresence>
                    </div>
                </div>

                {/* Learning Modules */}
                <div className="bg-white border border-zinc-200 rounded-[2rem] md:rounded-[2.5rem] p-5 md:p-6 shadow-sm">
                    <div className="flex items-center justify-between mb-4 md:mb-6 px-1">
                        <h3 className="text-base md:text-lg font-bold text-zinc-900 tracking-tight">Eco Learning</h3>
                        <button 
                            onClick={toggleModules}
                            className="text-[10px] md:text-xs font-bold text-emerald-600 hover:text-emerald-700 uppercase tracking-wider"
                        >
                            {showAllModules ? 'Show Less' : 'View All'}
                        </button>
                    </div>
                    <div className="space-y-4 max-h-[300px] overflow-y-auto pr-2 custom-scrollbar">
                        <AnimatePresence>
                            {modules.map((module) => (
                                <motion.div 
                                    key={module.id} 
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    onClick={() => handleModuleClick(module.id)}
                                    className={`group bg-zinc-50 hover:bg-white border border-zinc-100 hover:border-emerald-200 p-4 rounded-2xl transition-all cursor-pointer ${activeLearningId === module.id ? 'ring-2 ring-emerald-400' : ''}`}
                                >
                                    <div className="flex justify-between items-start mb-2">
                                        <span className="px-2 py-1 rounded-md bg-emerald-100 text-emerald-700 text-[9px] font-bold uppercase tracking-wider">
                                            {module.cat}
                                        </span>
                                        <div className="flex items-center gap-1 text-[10px] text-zinc-400">
                                            <Clock size={10} /> {module.time}
                                        </div>
                                    </div>
                                    <div className="flex justify-between items-center mb-3">
                                        <h4 className="font-bold text-zinc-900 group-hover:text-emerald-700 transition-colors text-xs md:text-sm">{module.title}</h4>
                                        {module.progress === 100 && <CheckCircle size={14} className="text-emerald-500 shrink-0"/>}
                                    </div>
                                    <div className="w-full bg-zinc-200 h-1.5 rounded-full overflow-hidden">
                                        <motion.div 
                                            initial={{ width: `${module.progress}%` }}
                                            animate={{ width: `${module.progress}%` }}
                                            className="bg-emerald-500 h-full rounded-full" 
                                        />
                                    </div>
                                    <p className="text-[9px] text-right mt-1 text-zinc-400">
                                        {activeLearningId === module.id ? 'Learning...' : module.progress === 100 ? 'Completed' : `${module.progress}%`}
                                    </p>
                                </motion.div>
                            ))}
                        </AnimatePresence>
                    </div>
                </div>

                {/* Download Policy */}
                <div className="bg-zinc-900 text-white rounded-[2rem] md:rounded-[2.5rem] p-6 md:p-8 relative overflow-hidden shadow-lg text-center">
                    <div className="relative z-10">
                        <div className="w-10 h-10 bg-emerald-500/20 rounded-xl flex items-center justify-center text-emerald-400 mb-4 mx-auto">
                            {downloadStatus === 'success' ? <CheckCircle size={20} /> : <Download size={20} />}
                        </div>
                        <h4 className="font-bold text-lg mb-2">2026 Framework</h4>
                        
                        <button 
                            onClick={handleDownload}
                            disabled={downloadStatus !== 'idle'}
                            className={`text-xs font-bold px-4 py-3 rounded-xl transition-all uppercase tracking-wider w-full flex justify-center items-center gap-2 ${
                                downloadStatus === 'success' ? 'bg-emerald-500 text-white' : 
                                downloadStatus === 'loading' ? 'bg-zinc-700 text-zinc-300' : 
                                'bg-white text-zinc-900 hover:bg-zinc-100'
                            }`}
                        >
                            {downloadStatus === 'loading' ? (
                                <><Loader2 size={14} className="animate-spin" /> Processing</>
                            ) : downloadStatus === 'success' ? (
                                'Downloaded!'
                            ) : (
                                'Download PDF'
                            )}
                        </button>

                    </div>
                    <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-emerald-600/20 blur-[50px] rounded-full pointer-events-none"></div>
                </div>

            </div>
        </div>
    </PageLayout>
  );
}