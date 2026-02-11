import React, { useState, useEffect } from 'react';
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
  TreeDeciduous
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

const MODULES = [
    { title: "Energy Efficiency 101", cat: "Infrastructure", time: "2h 15m", progress: 100 },
    { title: "Water Conservation", cat: "Resources", time: "1h 30m", progress: 65 },
    { title: "Zero Waste Lifestyle", cat: "Waste Mgt", time: "3h 00m", progress: 20 },
];

const ALERTS = [
    { id: 1, type: 'warning', msg: 'High PM2.5 detected in Industrial Zone' },
    { id: 2, type: 'info', msg: 'Solar output exceeds grid demand' },
];

// --- SUB-COMPONENTS ---

const TrendBadge = ({ value }) => {
    // Green is good (positive recycling or negative carbon)
    // Simplified logic for visual consistency: Green = Positive Outcome
    const isGood = value > 0; 
    
    return (
        <div className={`flex items-center gap-1 text-xs font-medium px-2 py-1 rounded-full ${
            isGood ? 'bg-emerald-50 text-emerald-700' : 'bg-red-50 text-red-700'
        }`}>
            {isGood ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
            {Math.abs(value).toFixed(1)}%
        </div>
    );
};

const MetricCard = ({ item }) => (
    <motion.div
        layout
        className="bg-white rounded-3xl p-5 h-48 flex flex-col justify-between shadow-sm hover:shadow-xl hover:shadow-emerald-500/5 border border-zinc-100 transition-all duration-300 group relative overflow-hidden"
    >
        <div className="flex justify-between items-start z-10">
            <div className={`w-10 h-10 rounded-2xl flex items-center justify-center transition-colors duration-300 bg-zinc-50 text-zinc-900 group-hover:bg-emerald-600 group-hover:text-white`}>
                <item.icon size={20} />
            </div>
            <div className="w-7 h-7 rounded-full bg-zinc-100 flex items-center justify-center text-zinc-400 group-hover:text-emerald-600 transition-colors">
                <ArrowUpRight size={14} />
            </div>
        </div>
        <div className="z-10 mt-auto">
            <div className="flex justify-between items-end mb-1">
                <h3 className="text-3xl font-bold text-zinc-900 tracking-tight leading-none group-hover:text-emerald-600 transition-colors">
                    {item.value}
                </h3>
                <TrendBadge value={item.trend} />
            </div>
            <p className="text-xs text-zinc-500 font-medium uppercase tracking-wide">{item.label}</p>
        </div>
        <div className="absolute -right-4 -bottom-4 opacity-0 group-hover:opacity-5 transition-opacity duration-500 pointer-events-none">
            <item.icon size={100} />
        </div>
    </motion.div>
);

// --- MAIN COMPONENT ---

export default function EcoAwareness() {
  // STATE
  const [time, setTime] = useState(new Date());
  
  // Real-time Data States
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

  // New Feature States
  const [gridLoad, setGridLoad] = useState(65); // Feature 1: Grid Load
  const [weather, setWeather] = useState({ temp: 28, aqi: 45, cond: 'Sunny' }); // Feature 2: Weather
  const [alerts, setAlerts] = useState(ALERTS); // Feature 3: Alerts
  const [waterLevel, setWaterLevel] = useState(78); // Feature 4: Reservoir
  const [treesSaved, setTreesSaved] = useState(1420); // Feature 5: Carbon Counter

  // SIMULATION ENGINE
  useEffect(() => {
    const interval = setInterval(() => {
        setTime(new Date());

        // 1. Live KPI Fluctuation
        setKpiData(prev => prev.map(k => {
            const noise = (Math.random() - 0.5) * 0.1;
            return { ...k, value: Number((k.value + noise).toFixed(2)), trend: Number((k.trend + noise * 10).toFixed(1)) };
        }));

        // 2. Energy Mix Balancing (Must sum to 100)
        setEnergyMix(prev => {
            const solarChange = getRandom(-2, 2);
            let newSolar = Math.max(10, Math.min(50, prev[0].value + solarChange));
            let newHydro = prev[1].value; 
            let newGrid = 100 - newSolar - newHydro;
            
            // Adjust grid/hydro slightly if grid gets too low/high
            if (newGrid < 10) { newHydro -= 2; newGrid += 2; }
            
            return [
                { ...prev[0], value: newSolar },
                { ...prev[1], value: newHydro },
                { ...prev[2], value: newGrid }
            ];
        });

        // 3. Emission Chart Scrolling
        setEmissionData(prev => {
            const newVal = Math.max(200, Math.min(500, prev[prev.length - 1].value + getRandom(-20, 20)));
            const newTime = new Date(); 
            const timeLabel = `${newTime.getHours()}:${newTime.getMinutes() < 10 ? '0'+newTime.getMinutes() : newTime.getMinutes()}`;
            return [...prev.slice(1), { name: timeLabel, value: newVal }];
        });

        // 4. District Data Fluctuation
        setDistrictData(prev => prev.map(d => ({...d, rate: Math.max(0, Math.min(100, d.rate + getRandom(-2, 2))) })));

        // 5. New Features Simulation
        setGridLoad(prev => Math.max(20, Math.min(95, prev + getRandom(-3, 3))));
        setWaterLevel(prev => Math.max(40, Math.min(90, prev + (Math.random() - 0.5))));
        setTreesSaved(prev => prev + (Math.random() > 0.5 ? 1 : 0)); // Increment occasionally
        
        // Random Weather Change
        if(Math.random() > 0.95) {
            setWeather(prev => ({
                temp: prev.temp + getRandom(-1, 1),
                aqi: Math.max(10, Math.min(150, prev.aqi + getRandom(-5, 5))),
                cond: Math.random() > 0.5 ? 'Sunny' : 'Cloudy'
            }));
        }

    }, 2000);

    return () => clearInterval(interval);
  }, []);

  return (
    <PageLayout 
        title="Eco Awareness" 
        subtitle="Environmental Intelligence" 
        colorTheme="emerald"
    >
        {/* HEADER CONTROLS & FEATURE 2 (WEATHER) */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-8">
            <div className="flex items-center gap-3">
                 <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-white border border-emerald-200 shadow-sm">
                    <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
                    <span className="text-xs font-semibold text-emerald-700 uppercase tracking-wide">Live Sensor Data</span>
                </div>
                <span className="text-xs text-zinc-400 font-mono">Last Sync: {time.toLocaleTimeString()}</span>
            </div>

            <div className="flex gap-4">
                {/* FEATURE 2: WEATHER & AQI WIDGET */}
                <div className="bg-white p-2 px-4 rounded-2xl border border-zinc-200 shadow-sm flex items-center gap-3">
                    <div className={`p-2 rounded-full ${weather.cond === 'Sunny' ? 'bg-orange-100 text-orange-500' : 'bg-blue-100 text-blue-500'}`}>
                        {weather.cond === 'Sunny' ? <Sun size={16} /> : <CloudRain size={16} />}
                    </div>
                    <div>
                        <div className="flex items-center gap-2">
                            <span className="text-sm font-bold text-zinc-900">{weather.temp}°C</span>
                            <span className={`text-[10px] px-1.5 rounded font-bold ${weather.aqi < 50 ? 'bg-emerald-100 text-emerald-700' : 'bg-yellow-100 text-yellow-700'}`}>
                                AQI {weather.aqi}
                            </span>
                        </div>
                        <p className="text-[10px] text-zinc-400 font-medium uppercase">{weather.cond}</p>
                    </div>
                </div>

                {/* Eco Score Widget */}
                <div className="bg-white p-2 pr-6 rounded-2xl border border-zinc-200 shadow-sm flex items-center gap-4">
                    <div className="w-10 h-10 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600 border-2 border-white shadow-sm">
                        <Leaf size={18} fill="currentColor" />
                    </div>
                    <div>
                        <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider">Eco Score</p>
                        <div className="flex items-baseline gap-1">
                            <span className="text-xl font-bold text-zinc-900">88</span>
                            <span className="text-[10px] text-zinc-400 font-medium">/100</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        {/* KPI SECTION */}
        <section className="mb-8">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {kpiData.map((kpi) => (
                    <MetricCard key={kpi.id} item={{...kpi, value: kpi.label === 'Recycling Rate' || kpi.label === 'Renewable Mix' ? `${kpi.value}%` : kpi.value}} />
                ))}
            </div>
        </section>

        {/* MAIN GRID */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            
            {/* LEFT: DATA VISUALIZATION (8 Cols) */}
            <div className="lg:col-span-8 flex flex-col gap-8">
                
                {/* Main Emission Chart */}
                <div className="bg-white rounded-[2.5rem] p-8 shadow-sm border border-zinc-200">
                    <div className="flex justify-between items-center mb-8">
                        <div>
                            <h3 className="text-lg font-bold text-zinc-900 tracking-tight">Emission Trends</h3>
                            <p className="text-xs text-zinc-500 uppercase tracking-wide">Real-time CO2 Monitor</p>
                        </div>
                        {/* FEATURE 5: CARBON COUNTER */}
                        <div className="flex items-center gap-3 px-4 py-2 bg-emerald-50 rounded-2xl border border-emerald-100">
                            <div className="p-1.5 bg-emerald-200 rounded-full text-emerald-800">
                                <TreeDeciduous size={16} />
                            </div>
                            <div>
                                <span className="block text-xl font-bold text-emerald-800 leading-none">{treesSaved.toLocaleString()}</span>
                                <span className="text-[9px] font-bold text-emerald-600 uppercase tracking-wider">Trees Saved</span>
                            </div>
                        </div>
                    </div>
                    
                    <div className="h-[300px] w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={emissionData}>
                                <defs>
                                    <linearGradient id="colorVal" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#10b981" stopOpacity={0.2}/>
                                        <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f4f4f5" />
                                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fontSize: 12, fill: '#a1a1aa'}} dy={10} />
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
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    
                    {/* Recycling Bar Chart */}
                    <div className="bg-white rounded-[2.5rem] p-6 shadow-sm border border-zinc-200">
                        <div className="flex items-center gap-2 mb-6">
                            <Trash2 size={16} className="text-blue-500" />
                            <h4 className="text-sm font-bold text-zinc-900">Recycling by District</h4>
                        </div>
                        <div className="h-48">
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={districtData}>
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
                    <div className="bg-white rounded-[2.5rem] p-6 shadow-sm border border-zinc-200 relative overflow-hidden">
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
                                        isAnimationActive={false} // Disable enter animation for smoother updates
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
            <div className="lg:col-span-4 flex flex-col gap-6">
                
                {/* FEATURE 1: REAL-TIME GRID LOAD */}
                <div className="bg-zinc-900 text-white rounded-[2.5rem] p-6 shadow-sm relative overflow-hidden">
                    <div className="flex justify-between items-center mb-4 relative z-10">
                        <div className="flex items-center gap-2">
                            <Zap size={18} className="text-yellow-400" />
                            <h4 className="font-bold text-sm">Grid Load</h4>
                        </div>
                        <span className={`text-xs font-bold px-2 py-1 rounded ${gridLoad > 85 ? 'bg-red-500 text-white' : 'bg-zinc-800 text-zinc-400'}`}>
                            {gridLoad}%
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
                <div className="bg-blue-50 border border-blue-100 rounded-[2.5rem] p-6 shadow-sm relative overflow-hidden">
                    <div className="flex items-center gap-2 mb-4 relative z-10">
                        <Waves size={18} className="text-blue-500" />
                        <h4 className="font-bold text-sm text-blue-900">Reservoir Level</h4>
                    </div>
                    <div className="flex items-end gap-2 relative z-10">
                        <span className="text-4xl font-bold text-blue-900">{waterLevel.toFixed(1)}m</span>
                        <span className="text-xs text-blue-600 font-medium mb-1">/ 100m Max</span>
                    </div>
                    {/* Liquid Visualization */}
                    <div className="absolute bottom-0 left-0 w-full bg-blue-200/30 h-24">
                        <motion.div 
                            animate={{ height: `${waterLevel}%` }}
                            className="absolute bottom-0 left-0 w-full bg-blue-400/30 border-t border-blue-400/50"
                        />
                    </div>
                </div>

                {/* FEATURE 3: ECO-ALERT FEED */}
                <div className="bg-white border border-zinc-200 rounded-[2.5rem] p-6 shadow-sm">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="text-sm font-bold text-zinc-900">Live Alerts</h3>
                        <div className="w-2 h-2 rounded-full bg-red-500 animate-ping"></div>
                    </div>
                    <div className="space-y-3">
                        {alerts.map((alert) => (
                            <div key={alert.id} className="flex gap-3 items-start p-3 bg-zinc-50 rounded-2xl">
                                <AlertTriangle size={16} className={alert.type === 'warning' ? 'text-red-500' : 'text-blue-500'} />
                                <p className="text-xs text-zinc-600 leading-snug">{alert.msg}</p>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Learning Modules (Static but styled) */}
                <div className="bg-white border border-zinc-200 rounded-[2.5rem] p-6 shadow-sm">
                    <div className="flex items-center justify-between mb-6 px-2">
                        <h3 className="text-lg font-bold text-zinc-900 tracking-tight">Eco Learning</h3>
                        <button className="text-xs font-bold text-emerald-600 hover:text-emerald-700 uppercase tracking-wider">View All</button>
                    </div>
                    <div className="space-y-4">
                        {MODULES.map((module, i) => (
                            <div key={i} className="group bg-zinc-50 hover:bg-white border border-zinc-100 hover:border-emerald-200 p-4 rounded-2xl transition-all cursor-pointer">
                                <div className="flex justify-between items-start mb-2">
                                    <span className="px-2 py-1 rounded-md bg-emerald-100 text-emerald-700 text-[9px] font-bold uppercase tracking-wider">
                                        {module.cat}
                                    </span>
                                    <div className="flex items-center gap-1 text-[10px] text-zinc-400">
                                        <Clock size={10} /> {module.time}
                                    </div>
                                </div>
                                <h4 className="font-bold text-zinc-900 mb-3 group-hover:text-emerald-700 transition-colors text-sm">{module.title}</h4>
                                <div className="w-full bg-zinc-200 h-1.5 rounded-full overflow-hidden">
                                    <div className="bg-emerald-500 h-full rounded-full" style={{ width: `${module.progress}%` }} />
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Download Policy */}
                <div className="bg-zinc-900 text-white rounded-[2.5rem] p-8 relative overflow-hidden shadow-lg text-center">
                    <div className="relative z-10">
                        <div className="w-10 h-10 bg-emerald-500/20 rounded-xl flex items-center justify-center text-emerald-400 mb-4 mx-auto">
                            <Download size={20} />
                        </div>
                        <h4 className="font-bold text-lg mb-2">2026 Framework</h4>
                        <button className="text-xs font-bold bg-white text-zinc-900 hover:bg-zinc-100 px-4 py-2 rounded-xl transition-colors uppercase tracking-wider w-full justify-center">
                            Download PDF
                        </button>
                    </div>
                    <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-emerald-600/20 blur-[50px] rounded-full pointer-events-none"></div>
                </div>

            </div>
        </div>
    </PageLayout>
  );
}