import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Trash2, 
  Recycle, 
  Sprout, 
  TrendingDown, 
  TrendingUp,
  BarChart3, 
  AlertTriangle, 
  MapPin, 
  CheckCircle2, 
  Truck,
  ArrowRight,
  ArrowUpRight,
  Scale,
  Trophy,
  History,
  CloudRain,
  Sun,
  AlertOctagon,
  Shovel
} from 'lucide-react';
import { 
  AreaChart, Area, PieChart, Pie, Cell, 
  ResponsiveContainer, XAxis, Tooltip, CartesianGrid 
} from 'recharts';

import PageLayout from '../../components/PageLayout'; 

// --- UTILS ---
const getRandom = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;

// --- INITIAL DATA ---
const INITIAL_BINS = [
  { id: 'SB-01', location: 'Alun-alun Tasik', level: 45, status: 'Normal' },
  { id: 'SB-04', location: 'Pasar Cikurubuk', level: 88, status: 'Critical' },
  { id: 'SB-12', location: 'Univ. Siliwangi', level: 12, status: 'Normal' },
  { id: 'SB-09', location: 'Station Hub', level: 64, status: 'Warning' },
];

const INITIAL_TREND = [
  { day: '08:00', vol: 350 }, { day: '09:00', vol: 410 }, { day: '10:00', vol: 460 },
  { day: '11:00', vol: 420 }, { day: '12:00', vol: 380 }, { day: '13:00', vol: 360 }, { day: '14:00', vol: 340 }
];

const WASTE_COMPOSITION = [
  { name: 'Organic', value: 55, color: '#22c55e' },
  { name: 'Plastic', value: 20, color: '#3b82f6' },
  { name: 'Paper', value: 15, color: '#fbbf24' },
  { name: 'Metal', value: 5, color: '#94a3b8' },
  { name: 'Residue', value: 5, color: '#ef4444' }
];

const LOG_MESSAGES = [
    "Truck #402 arrived at TPA Ciangir",
    "Bin #SB-04 reached 90% capacity",
    "Community recycling pickup completed",
    "Organic processing unit activated",
    "Route optimized for District 2"
];

// --- SUB-COMPONENTS ---

const TrendBadge = ({ value, invert = false }) => {
    const isPositive = value > 0;
    // Logic: Usually Green is good. If invert=true (e.g. Volume), then Negative is good (Green).
    const isGreen = invert ? !isPositive : isPositive;
    
    return (
        <div className={`flex items-center gap-1 text-xs font-medium px-2 py-1 rounded-full ${
            isGreen ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'
        }`}>
            {isPositive ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
            {Math.abs(value).toFixed(1)}%
        </div>
    );
};

const MetricCard = ({ item }) => (
    <motion.div
        layout
        className="bg-white rounded-3xl p-5 h-48 flex flex-col justify-between shadow-sm hover:shadow-xl hover:shadow-green-500/5 border border-zinc-100 transition-all duration-300 group cursor-pointer relative overflow-hidden"
    >
        <div className="flex justify-between items-start z-10">
            <div className={`w-10 h-10 rounded-2xl flex items-center justify-center transition-colors duration-300 bg-zinc-50 text-zinc-900 group-hover:bg-green-600 group-hover:text-white`}>
                <item.icon size={20} />
            </div>
            <div className="w-7 h-7 rounded-full bg-zinc-100 flex items-center justify-center text-zinc-400 group-hover:text-green-600 transition-colors">
                <ArrowUpRight size={14} />
            </div>
        </div>
        <div className="z-10 mt-auto">
            <div className="flex justify-between items-end mb-1">
                <h3 className="text-3xl font-bold text-zinc-900 tracking-tight leading-none group-hover:text-green-600 transition-colors">
                    {item.value}
                </h3>
                <TrendBadge value={item.trend} invert={item.label === 'Daily Volume' || item.label === 'Bin Status'} />
            </div>
            <p className="text-xs text-zinc-500 font-medium uppercase tracking-wide">{item.label}</p>
        </div>
        <div className="absolute -right-4 -bottom-4 opacity-0 group-hover:opacity-5 transition-opacity duration-500 pointer-events-none">
            <item.icon size={100} />
        </div>
    </motion.div>
);

// --- MAIN COMPONENT ---

export default function WasteManagement() {
  // STATE
  const [kpiData, setKpiData] = useState([
    { id: 1, label: 'Daily Volume', sub: 'Total Collected', value: 342, trend: -12, icon: Trash2 },
    { id: 2, label: 'Recycling Rate', sub: 'Diversion %', value: 32, trend: 8, icon: Recycle },
    { id: 3, label: 'Organic Proc.', sub: 'Composting', value: 55, trend: 15, icon: Sprout },
    { id: 4, label: 'Bin Status', sub: 'Avg Fill Level', value: 64, trend: 2.1, icon: BarChart3 },
  ]);
  
  const [bins, setBins] = useState(INITIAL_BINS);
  const [trendData, setTrendData] = useState(INITIAL_TREND);
  
  // New Feature States
  const [landfillCap, setLandfillCap] = useState(78); // Feature 1: Landfill Capacity
  const [logs, setLogs] = useState([LOG_MESSAGES[0]]); // Feature 2: Live Logs
  const [compostOutput, setCompostOutput] = useState(1240); // Feature 4: Compost Counter
  const [isRaining, setIsRaining] = useState(false); // Feature 5: Weather Ops

  // SIMULATION ENGINE
  useEffect(() => {
    const interval = setInterval(() => {
        // 1. KPI Fluctuation
        setKpiData(prev => prev.map(k => {
            const noise = (Math.random() - 0.5) * 2;
            return { ...k, value: Number((k.value + noise).toFixed(1)) };
        }));

        // 2. Bin Logic (Fill & Empty)
        setBins(prev => prev.map(bin => {
            let newLevel = bin.level + getRandom(1, 5);
            let newStatus = 'Normal';
            
            if (newLevel > 95) {
                // Trigger Emptying
                newLevel = 0;
                setLogs(l => [`Bin #${bin.id} emptied automatically`, ...l].slice(0, 4));
            } else if (newLevel > 80) {
                newStatus = 'Critical';
            } else if (newLevel > 50) {
                newStatus = 'Warning';
            }

            return { ...bin, level: newLevel, status: newStatus };
        }));

        // 3. Trend Chart Scrolling
        setTrendData(prev => {
            const newVal = Math.max(300, Math.min(500, prev[prev.length - 1].vol + getRandom(-30, 30)));
            const now = new Date();
            const timeLabel = `${now.getHours()}:${now.getMinutes() < 10 ? '0' : ''}${now.getMinutes()}`;
            return [...prev.slice(1), { day: timeLabel, vol: newVal }];
        });

        // 4. Update New Features
        setLandfillCap(prev => Math.min(100, prev + 0.01)); // Slowly filling
        setCompostOutput(prev => prev + getRandom(0, 3));
        
        // Random Log
        if(Math.random() > 0.7) {
            setLogs(l => [LOG_MESSAGES[getRandom(0, LOG_MESSAGES.length - 1)], ...l].slice(0, 4));
        }

    }, 2000);

    return () => clearInterval(interval);
  }, []);

  return (
    <PageLayout 
        title="Waste Management" 
        subtitle="City Sanitation" 
        colorTheme="green"
    >
        {/* HEADER CONTROLS & NEW FEATURE (WEATHER) */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-8">
            <div className="flex items-center gap-3">
                 <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-white border border-green-200 shadow-sm">
                    <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
                    <span className="text-xs font-semibold text-green-700 uppercase tracking-wide">Fleet Active</span>
                </div>
                {/* FEATURE 5: WEATHER OPS STATUS */}
                <button 
                    onClick={() => setIsRaining(!isRaining)}
                    className={`flex items-center gap-2 px-3 py-1.5 rounded-full border transition-colors ${isRaining ? 'bg-blue-50 border-blue-200 text-blue-700' : 'bg-white border-zinc-200 text-zinc-500'}`}
                >
                    {isRaining ? <CloudRain size={14} /> : <Sun size={14} />}
                    <span className="text-xs font-bold uppercase">{isRaining ? 'Ops: Slow (Rain)' : 'Ops: Normal'}</span>
                </button>
            </div>

            {/* Cleanliness Score Widget */}
            <div className="bg-white p-2 pr-6 rounded-[2rem] border border-zinc-200 shadow-sm flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center text-green-600 border-4 border-white shadow-sm">
                    <CheckCircle2 size={20} />
                </div>
                <div>
                    <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider">Cleanliness Index</p>
                    <div className="flex items-baseline gap-1">
                        <span className="text-2xl font-bold text-zinc-900">84.2</span>
                        <span className="text-xs text-zinc-400 font-medium">/100</span>
                    </div>
                </div>
            </div>
        </div>

        {/* KPI SECTION */}
        <section className="mb-8">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {kpiData.map((kpi) => (
                    <MetricCard key={kpi.id} item={{...kpi, value: kpi.label === 'Daily Volume' ? `${kpi.value.toFixed(0)}t` : `${kpi.value.toFixed(0)}%`}} />
                ))}
            </div>
        </section>

        {/* MAIN GRID */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            
            {/* LEFT: DATA VISUALIZATION (8 Cols) */}
            <div className="lg:col-span-8 flex flex-col gap-8">
                
                {/* Volume & Composition Row */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    
                    {/* Volume Trend */}
                    <div className="bg-white rounded-[2.5rem] p-8 shadow-sm border border-zinc-200">
                        <div className="flex justify-between items-center mb-6">
                            <h3 className="text-lg font-bold text-zinc-900 tracking-tight">Waste Volume</h3>
                            <div className="p-2 bg-green-50 rounded-full text-green-600">
                                <Scale size={18} />
                            </div>
                        </div>
                        <div className="h-48 w-full">
                            <ResponsiveContainer width="100%" height="100%">
                                <AreaChart data={trendData}>
                                    <defs>
                                        <linearGradient id="colorVol" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="#16a34a" stopOpacity={0.2}/>
                                            <stop offset="95%" stopColor="#16a34a" stopOpacity={0}/>
                                        </linearGradient>
                                    </defs>
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f4f4f5" />
                                    <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{fontSize: 10, fill: '#a1a1aa'}} />
                                    <Tooltip contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }} />
                                    <Area isAnimationActive={false} type="monotone" dataKey="vol" stroke="#16a34a" strokeWidth={3} fillOpacity={1} fill="url(#colorVol)" />
                                </AreaChart>
                            </ResponsiveContainer>
                        </div>
                    </div>

                    {/* Composition Pie */}
                    <div className="bg-white rounded-[2.5rem] p-8 shadow-sm border border-zinc-200 relative overflow-hidden flex flex-col">
                        <div className="flex justify-between items-center mb-2 z-10">
                            <h3 className="text-lg font-bold text-zinc-900 tracking-tight">Composition</h3>
                            <div className="p-2 bg-blue-50 rounded-full text-blue-600">
                                <BarChart3 size={18} />
                            </div>
                        </div>
                        
                        <div className="flex-1 flex items-center justify-between gap-4">
                            <div className="h-40 w-40 relative shrink-0">
                                <ResponsiveContainer width="100%" height="100%">
                                    <PieChart>
                                        <Pie 
                                            data={WASTE_COMPOSITION} innerRadius={35} outerRadius={55} 
                                            paddingAngle={5} dataKey="value" stroke="none"
                                        >
                                            {WASTE_COMPOSITION.map((entry, index) => (
                                                <Cell key={`cell-${index}`} fill={entry.color} />
                                            ))}
                                        </Pie>
                                        <Tooltip contentStyle={{ borderRadius: '12px', border: 'none' }} />
                                    </PieChart>
                                </ResponsiveContainer>
                                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                                    <span className="text-[10px] font-bold text-zinc-400">TYPE</span>
                                </div>
                            </div>
                            <div className="flex-1 space-y-2">
                                {WASTE_COMPOSITION.slice(0,4).map((item, i) => (
                                    <div key={i} className="flex items-center justify-between text-xs">
                                        <div className="flex items-center gap-2">
                                            <span className="w-2 h-2 rounded-full" style={{ backgroundColor: item.color }} />
                                            <span className="text-zinc-600 font-medium">{item.name}</span>
                                        </div>
                                        <span className="font-bold text-zinc-900">{item.value}%</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Operations Map Card (Animated Trucks) */}
                <div className="bg-white rounded-[2.5rem] p-2 shadow-sm border border-zinc-200 relative overflow-hidden h-[300px] group">
                      <div className="w-full h-full rounded-[2rem] bg-zinc-50 relative overflow-hidden">
                        <div className="absolute inset-0 opacity-10 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]"></div>
                        
                        {/* Route Line */}
                        <svg className="absolute inset-0 w-full h-full pointer-events-none">
                            <path d="M 100 150 Q 300 50 500 150 T 900 100" stroke="#22c55e" strokeWidth="4" fill="none" strokeDasharray="6 6" className="opacity-60" />
                        </svg>

                        {/* Animated Trucks */}
                        {[{delay:0, duration:10}, {delay:5, duration:12}].map((t, i) => (
                            <motion.div 
                                key={i}
                                className="absolute p-2 bg-white rounded-full shadow-md border border-zinc-100 text-green-600 z-10"
                                initial={{ offsetDistance: "0%" }}
                                animate={{ offsetDistance: "100%" }}
                                transition={{ duration: t.duration, repeat: Infinity, ease: "linear", delay: t.delay }}
                                style={{ offsetPath: 'path("M 100 150 Q 300 50 500 150 T 900 100")', offsetRotate: 'auto' }}
                            >
                                <Truck size={16} />
                            </motion.div>
                        ))}

                        <div className="absolute top-6 left-6 z-20">
                            <div className="bg-white/90 backdrop-blur-md px-4 py-2 rounded-2xl border border-zinc-200 shadow-sm flex items-center gap-3">
                                <MapPin size={16} className="text-green-600" />
                                <span className="text-xs font-bold text-zinc-900 uppercase tracking-wide">Fleet Tracking</span>
                            </div>
                        </div>
                      </div>
                </div>

            </div>

            {/* RIGHT: SMART BINS & WIDGETS (4 Cols) */}
            <div className="lg:col-span-4 flex flex-col gap-6">
                
                {/* Smart Bin Monitor */}
                <div className="bg-zinc-900 text-white rounded-[2.5rem] p-8 shadow-xl shadow-zinc-200">
                    <div className="flex justify-between items-center mb-6">
                        <div>
                            <h3 className="font-bold text-lg text-white">Smart Bins</h3>
                            <p className="text-xs text-zinc-400">IoT Fill Levels</p>
                        </div>
                        <div className="p-2 bg-white/10 rounded-full animate-pulse">
                            <div className="w-2 h-2 bg-green-400 rounded-full" />
                        </div>
                    </div>

                    <div className="space-y-4">
                        {bins.map((bin, i) => (
                            <div key={i} className="group">
                                <div className="flex justify-between items-center mb-2">
                                    <span className="text-sm font-bold text-zinc-200">{bin.location}</span>
                                    <span className={`text-[9px] font-bold px-2 py-0.5 rounded-md uppercase tracking-wider ${
                                        bin.status === 'Critical' ? 'bg-red-500/20 text-red-400' : 
                                        bin.status === 'Warning' ? 'bg-orange-500/20 text-orange-400' : 'bg-green-500/20 text-green-400'
                                    }`}>
                                        {bin.status}
                                    </span>
                                </div>
                                <div className="flex items-center gap-3">
                                    <div className="flex-1 bg-white/10 h-2 rounded-full overflow-hidden">
                                        <motion.div 
                                            animate={{ width: `${bin.level}%`, backgroundColor: bin.level > 80 ? '#ef4444' : bin.level > 60 ? '#f97316' : '#22c55e' }}
                                            transition={{ duration: 0.5 }}
                                            className="h-full rounded-full"
                                        />
                                    </div>
                                    <span className="text-xs font-mono text-zinc-400 w-8 text-right">{bin.level}%</span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* FEATURE 1: LANDFILL CAPACITY */}
                <div className="bg-orange-50 border border-orange-100 rounded-[2.5rem] p-6 shadow-sm relative overflow-hidden">
                    <div className="flex justify-between items-center mb-4 relative z-10">
                        <h4 className="font-bold text-sm text-orange-900 flex items-center gap-2">
                            <AlertOctagon size={16}/> TPA Ciangir Cap.
                        </h4>
                        <span className="text-xs font-bold text-orange-600">{landfillCap.toFixed(1)}% Full</span>
                    </div>
                    <div className="w-full bg-orange-200 h-4 rounded-full overflow-hidden relative z-10">
                        <motion.div 
                            animate={{ width: `${landfillCap}%` }} 
                            className="h-full bg-orange-500 rounded-full"
                        />
                    </div>
                    <p className="text-[10px] text-orange-700/60 mt-2 relative z-10">Projected full capacity in 2.4 years</p>
                    <div className="absolute -bottom-10 -right-10 w-32 h-32 bg-orange-200/50 rounded-full blur-2xl"></div>
                </div>

                {/* FEATURE 2: LIVE LOGS */}
                <div className="bg-white border border-zinc-200 rounded-[2.5rem] p-6 shadow-sm overflow-hidden">
                    <div className="flex items-center gap-2 mb-4 border-b border-zinc-100 pb-2">
                        <History size={16} className="text-zinc-400"/>
                        <h4 className="font-bold text-sm text-zinc-900">Live Activity</h4>
                    </div>
                    <div className="space-y-3">
                        <AnimatePresence>
                        {logs.map((log, i) => (
                            <motion.div 
                                key={i} 
                                initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}
                                className="flex gap-2 items-center"
                            >
                                <div className="w-1.5 h-1.5 rounded-full bg-green-500"></div>
                                <p className="text-xs text-zinc-500 truncate">{log}</p>
                            </motion.div>
                        ))}
                        </AnimatePresence>
                    </div>
                </div>

                {/* FEATURE 3 & 4 GRID */}
                <div className="grid grid-cols-2 gap-4">
                    {/* Feature 3: Leaderboard */}
                    <div className="bg-yellow-50 border border-yellow-100 rounded-[2rem] p-4 text-center">
                        <Trophy size={20} className="mx-auto text-yellow-600 mb-2" />
                        <p className="text-[10px] font-bold text-yellow-700 uppercase">Top District</p>
                        <p className="font-bold text-zinc-900 text-sm">Cihideung</p>
                    </div>
                    {/* Feature 4: Compost Counter */}
                    <div className="bg-emerald-50 border border-emerald-100 rounded-[2rem] p-4 text-center">
                        <Shovel size={20} className="mx-auto text-emerald-600 mb-2" />
                        <p className="text-[10px] font-bold text-emerald-700 uppercase">Compost (kg)</p>
                        <p className="font-bold text-zinc-900 text-sm">{compostOutput}</p>
                    </div>
                </div>

            </div>
        </div>
    </PageLayout>
  );
}