import React, { useState, useEffect, useMemo } from 'react';
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

// Generate initial trend data for the last 7 hours
const generateInitialTrend = () => {
    const data = [];
    const now = new Date();
    for (let i = 6; i >= 0; i--) {
        const d = new Date(now.getTime() - i * 60 * 60 * 1000);
        data.push({
            day: `${d.getHours()}:00`,
            vol: getRandom(300, 450)
        });
    }
    return data;
};

const WASTE_COMPOSITION = [
  { name: 'Organic', value: 55, color: '#22c55e' },
  { name: 'Plastic', value: 20, color: '#3b82f6' },
  { name: 'Paper', value: 15, color: '#fbbf24' },
  { name: 'Metal', value: 5, color: '#94a3b8' },
  { name: 'Residue', value: 5, color: '#ef4444' }
];

// --- SUB-COMPONENTS ---

const TrendBadge = ({ value, invert = false }) => {
    const isPositive = value > 0;
    // Logic: Usually Green is good. If invert=true (e.g. Volume/Trash load), then Negative is good (Green).
    const isGreen = invert ? !isPositive : isPositive;
    
    return (
        <div className={`flex items-center gap-1 text-[10px] md:text-xs font-medium px-2 py-1 rounded-full ${
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
        className="bg-white rounded-3xl p-4 md:p-5 h-40 md:h-48 flex flex-col justify-between shadow-sm hover:shadow-xl hover:shadow-green-500/5 border border-zinc-100 transition-all duration-300 group cursor-pointer relative overflow-hidden"
    >
        <div className="flex justify-between items-start z-10">
            <div className={`w-8 h-8 md:w-10 md:h-10 rounded-2xl flex items-center justify-center transition-colors duration-300 bg-zinc-50 text-zinc-900 group-hover:bg-green-600 group-hover:text-white`}>
                <item.icon size={18} className="md:w-5 md:h-5" />
            </div>
            <div className="w-6 h-6 md:w-7 md:h-7 rounded-full bg-zinc-100 flex items-center justify-center text-zinc-400 group-hover:text-green-600 transition-colors">
                <ArrowUpRight size={12} className="md:w-[14px]" />
            </div>
        </div>
        <div className="z-10 mt-auto">
            <div className="flex justify-between items-end mb-1">
                <h3 className="text-2xl md:text-3xl font-bold text-zinc-900 tracking-tight leading-none group-hover:text-green-600 transition-colors">
                    {item.value}
                </h3>
                <TrendBadge value={item.trend} invert={item.label === 'Daily Volume' || item.label === 'Bin Status'} />
            </div>
            <p className="text-[10px] md:text-xs text-zinc-500 font-medium uppercase tracking-wide">{item.label}</p>
        </div>
        <div className="absolute -right-4 -bottom-4 opacity-0 group-hover:opacity-5 transition-opacity duration-500 pointer-events-none">
            <item.icon size={80} className="md:w-[100px] md:h-[100px]" />
        </div>
    </motion.div>
);

// --- MAIN COMPONENT ---

export default function WasteManagement() {
  // --- STATE MANAGEMENT ---
  const [bins, setBins] = useState(INITIAL_BINS);
  const [trendData, setTrendData] = useState(generateInitialTrend());
  
  // KPI Data structure initialized
  const [kpiData, setKpiData] = useState([
    { id: 1, label: 'Daily Volume', value: 0, trend: 0, icon: Trash2 },
    { id: 2, label: 'Recycling Rate', value: 32, trend: 1.5, icon: Recycle },
    { id: 3, label: 'Organic Proc.', value: 55, trend: 5.2, icon: Sprout },
    { id: 4, label: 'Bin Status', value: 0, trend: 0, icon: BarChart3 },
  ]);

  // Operational States
  const [landfillCap, setLandfillCap] = useState(78.4);
  const [logs, setLogs] = useState(["System initialized..."]);
  const [compostOutput, setCompostOutput] = useState(1240);
  const [isRaining, setIsRaining] = useState(false);
  const [cleanlinessScore, setCleanlinessScore] = useState(84.2);

  // --- LOGIC: HELPER TO ADD LOGS ---
  const addLog = (message) => {
    setLogs(prev => {
        const newLogs = [message, ...prev];
        return newLogs.slice(0, 5); // Keep only last 5 logs
    });
  };

  // --- LOGIC: HANDLE WEATHER TOGGLE ---
  const toggleWeather = () => {
      const newWeather = !isRaining;
      setIsRaining(newWeather);
      addLog(newWeather ? "⚠️ Weather Alert: Heavy rain detected. Ops slowed." : "☀️ Weather Clear: Operations normalized.");
  };

  // --- SIMULATION ENGINE (The Heartbeat) ---
  useEffect(() => {
    const interval = setInterval(() => {
        
        // 1. UPDATE BINS & GENERATE ALERTS
        setBins(currentBins => {
            return currentBins.map(bin => {
                // If raining, bins fill slightly faster (wet waste weight)
                const fillRate = isRaining ? getRandom(2, 6) : getRandom(1, 4);
                let newLevel = bin.level + fillRate;
                let newStatus = 'Normal';
                let actionLog = null;

                // Auto-Empty Logic (Simulation of pickup)
                if (newLevel >= 100) {
                    newLevel = 0; // Empty the bin
                    actionLog = `Truck #40${getRandom(1,9)} emptied ${bin.id}`;
                } else if (newLevel > 80) {
                    newStatus = 'Critical';
                    // Only log if it wasn't critical before (simple check to avoid spam)
                    if (bin.status !== 'Critical') actionLog = `⚠️ Alert: ${bin.id} is critical (>80%)`;
                } else if (newLevel > 50) {
                    newStatus = 'Warning';
                }

                if (actionLog) addLog(actionLog);

                return { ...bin, level: newLevel, status: newStatus };
            });
        });

        // 2. UPDATE TREND CHART (Sliding Window)
        setTrendData(prev => {
            const lastVal = prev[prev.length - 1].vol;
            // Volatility based on weather
            const volatility = isRaining ? getRandom(-10, 40) : getRandom(-20, 30); 
            const newVal = Math.max(200, Math.min(600, lastVal + volatility));
            
            const now = new Date();
            const timeLabel = `${now.getHours()}:${now.getMinutes() < 10 ? '0' : ''}${now.getMinutes()}`;
            
            // Remove first, add new to end
            const newArray = [...prev.slice(1), { day: timeLabel, vol: newVal }];
            return newArray;
        });

        // 3. UPDATE OPERATIONAL METRICS
        setLandfillCap(prev => Math.min(100, prev + 0.005)); // Slow increment
        setCompostOutput(prev => prev + (isRaining ? 1 : getRandom(1, 3))); // Compost slows in rain

    }, 2000); // Tick every 2 seconds

    return () => clearInterval(interval);
  }, [isRaining]); // Re-bind effect if weather changes to adjust logic if needed inside

  // --- DERIVED STATE CALCULATIONS (Reactive Logic) ---
  useEffect(() => {
      // A. Calculate Real-time Cleanliness Score
      // Logic: Start at 100. Deduct points for average fill level and heavily for critical bins.
      const avgFill = bins.reduce((acc, curr) => acc + curr.level, 0) / bins.length;
      const criticalCount = bins.filter(b => b.status === 'Critical').length;
      const warningCount = bins.filter(b => b.status === 'Warning').length;
      
      // Formula: 100 - (20% of avg fill) - (10 pts per critical) - (2 pts per warning)
      let calculatedScore = 100 - (avgFill * 0.2) - (criticalCount * 10) - (warningCount * 2);
      calculatedScore = Math.max(0, Math.min(100, calculatedScore)); // Clamp 0-100
      setCleanlinessScore(calculatedScore);

      // B. Sync KPIs with Simulation Data
      const currentVol = trendData[trendData.length - 1].vol;
      const prevVol = trendData[trendData.length - 2]?.vol || currentVol;
      const volTrend = ((currentVol - prevVol) / prevVol) * 100;

      const avgFillTrend = bins.length > 0 ? (avgFill - 50) / 5 : 0; // Dummy trend calculation based on baseline 50%

      setKpiData(prev => [
        { ...prev[0], value: `${currentVol}t`, trend: volTrend }, // Linked to Chart
        { ...prev[1], value: `32%`, trend: 1.5 }, // Static for now (or make dynamic)
        { ...prev[2], value: `${55 + (isRaining ? 2 : 0)}%`, trend: isRaining ? 12 : 5 }, // Organic proc up when raining (wet waste)
        { ...prev[3], value: `${avgFill.toFixed(0)}%`, trend: avgFillTrend }, // Linked to Bins
      ]);

  }, [bins, trendData, isRaining]);


  return (
    <PageLayout 
        title="Waste Management" 
        subtitle="City Sanitation Dashboard" 
        colorTheme="green"
    >
        {/* HEADER CONTROLS & STATUS */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 md:gap-6 mb-6 md:mb-8">
            <div className="flex flex-wrap items-center gap-3">
                 <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-white border border-green-200 shadow-sm">
                    <div className={`w-2 h-2 rounded-full ${isRaining ? 'bg-amber-500' : 'bg-green-500'} animate-pulse`}></div>
                    <span className="text-[10px] md:text-xs font-semibold text-green-700 uppercase tracking-wide">
                        {isRaining ? 'Fleet: Caution' : 'Fleet: Active'}
                    </span>
                </div>
                
                {/* INTERACTIVE WEATHER TOGGLE */}
                <button 
                    onClick={toggleWeather}
                    className={`flex items-center gap-2 px-3 py-1.5 rounded-full border transition-all duration-300 ${
                        isRaining 
                        ? 'bg-blue-50 border-blue-200 text-blue-700 shadow-inner' 
                        : 'bg-white border-zinc-200 text-zinc-500 hover:bg-zinc-50 shadow-sm'
                    }`}
                >
                    {isRaining ? <CloudRain size={14} className="animate-bounce" /> : <Sun size={14} className="text-orange-400" />}
                    <span className="text-[10px] md:text-xs font-bold uppercase">{isRaining ? 'Mode: Rain (Slow)' : 'Mode: Clear'}</span>
                </button>
            </div>

            {/* DYNAMIC Cleanliness Score Widget */}
            <div className="w-full md:w-auto bg-white p-2 pr-6 rounded-[2rem] border border-zinc-200 shadow-sm flex items-center gap-4 transition-all duration-500">
                <div className={`w-10 h-10 md:w-12 md:h-12 rounded-full flex items-center justify-center border-4 border-white shadow-sm transition-colors duration-500 ${
                    cleanlinessScore > 80 ? 'bg-green-100 text-green-600' : 
                    cleanlinessScore > 60 ? 'bg-orange-100 text-orange-600' : 'bg-red-100 text-red-600'
                }`}>
                    {cleanlinessScore > 80 ? <CheckCircle2 size={18} className="md:w-5 md:h-5" /> : <AlertTriangle size={18} className="md:w-5 md:h-5" />}
                </div>
                <div>
                    <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider">Cleanliness Index</p>
                    <div className="flex items-baseline gap-1">
                        <motion.span 
                            key={cleanlinessScore} // Trigger animation on change
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className={`text-xl md:text-2xl font-bold transition-colors duration-500 ${
                                cleanlinessScore > 80 ? 'text-zinc-900' : 
                                cleanlinessScore > 60 ? 'text-orange-600' : 'text-red-600'
                            }`}
                        >
                            {cleanlinessScore.toFixed(1)}
                        </motion.span>
                        <span className="text-[10px] md:text-xs text-zinc-400 font-medium">/100</span>
                    </div>
                </div>
            </div>
        </div>

        {/* KPI SECTION (Dynamic Data) */}
        <section className="mb-6 md:mb-8">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
                {kpiData.map((kpi) => (
                    <MetricCard key={kpi.id} item={kpi} />
                ))}
            </div>
        </section>

        {/* MAIN GRID */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 md:gap-8 items-start">
            
            {/* LEFT: DATA VISUALIZATION (8 Cols) */}
            <div className="lg:col-span-8 flex flex-col gap-6 md:gap-8">
                
                {/* Volume & Composition Row */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                    
                    {/* Volume Trend (Live Data) */}
                    <div className="bg-white rounded-[2rem] md:rounded-[2.5rem] p-5 md:p-8 shadow-sm border border-zinc-200">
                        <div className="flex justify-between items-center mb-6">
                            <h3 className="text-base md:text-lg font-bold text-zinc-900 tracking-tight">Waste Volume</h3>
                            <div className="p-2 bg-green-50 rounded-full text-green-600">
                                <Scale size={18} />
                            </div>
                        </div>
                        <div className="h-40 md:h-48 w-full">
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
                                    <Area isAnimationActive={true} animationDuration={1000} type="monotone" dataKey="vol" stroke="#16a34a" strokeWidth={3} fillOpacity={1} fill="url(#colorVol)" />
                                </AreaChart>
                            </ResponsiveContainer>
                        </div>
                    </div>

                    {/* Composition Pie */}
                    <div className="bg-white rounded-[2rem] md:rounded-[2.5rem] p-5 md:p-8 shadow-sm border border-zinc-200 relative overflow-hidden flex flex-col">
                        <div className="flex justify-between items-center mb-2 z-10">
                            <h3 className="text-base md:text-lg font-bold text-zinc-900 tracking-tight">Composition</h3>
                            <div className="p-2 bg-blue-50 rounded-full text-blue-600">
                                <BarChart3 size={18} />
                            </div>
                        </div>
                        
                        <div className="flex-1 flex flex-col sm:flex-row items-center justify-between gap-4">
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
                            <div className="flex-1 space-y-2 w-full">
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

                {/* Operations Map Card (Animated Trucks Responsive to Weather) */}
                <div className="bg-white rounded-[2rem] md:rounded-[2.5rem] p-2 shadow-sm border border-zinc-200 relative overflow-hidden h-[250px] md:h-[300px] group">
                      <div className="w-full h-full rounded-[1.5rem] md:rounded-[2rem] bg-zinc-50 relative overflow-hidden">
                        <div className="absolute inset-0 opacity-10 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]"></div>
                        
                        {/* Route Line */}
                        <svg className="absolute inset-0 w-full h-full pointer-events-none">
                            <path d="M 50 150 Q 150 50 250 150 T 450 100" stroke={isRaining ? "#3b82f6" : "#22c55e"} strokeWidth="4" fill="none" strokeDasharray="6 6" className="opacity-60 transition-colors duration-1000 md:hidden" />
                            <path d="M 100 150 Q 300 50 500 150 T 900 100" stroke={isRaining ? "#3b82f6" : "#22c55e"} strokeWidth="4" fill="none" strokeDasharray="6 6" className="opacity-60 transition-colors duration-1000 hidden md:block" />
                        </svg>

                        {/* Animated Trucks - Speed changes based on Weather */}
                        {[
                            {delay: 0, fast: 10, slow: 20}, 
                            {delay: 5, fast: 12, slow: 25}
                        ].map((t, i) => (
                            <motion.div 
                                key={i}
                                className={`absolute p-2 bg-white rounded-full shadow-md border z-10 transition-colors duration-500 ${isRaining ? 'border-blue-200 text-blue-600' : 'border-zinc-100 text-green-600'}`}
                                initial={{ offsetDistance: "0%" }}
                                animate={{ offsetDistance: "100%" }}
                                transition={{ 
                                    duration: isRaining ? t.slow : t.fast, // DYNAMIC SPEED
                                    repeat: Infinity, 
                                    ease: "linear", 
                                    delay: t.delay 
                                }}
                                // Responsive path switching via CSS media queries isn't easy in inline style, simplified for demo: using desktop path logic but it works relatively
                                style={{ offsetPath: 'path("M 100 150 Q 300 50 500 150 T 900 100")', offsetRotate: 'auto' }}
                            >
                                <Truck size={16} />
                            </motion.div>
                        ))}

                        <div className="absolute top-4 left-4 md:top-6 md:left-6 z-20">
                            <div className="bg-white/90 backdrop-blur-md px-3 py-1.5 md:px-4 md:py-2 rounded-2xl border border-zinc-200 shadow-sm flex items-center gap-3">
                                <MapPin size={16} className={isRaining ? "text-blue-600" : "text-green-600"} />
                                <span className="text-[10px] md:text-xs font-bold text-zinc-900 uppercase tracking-wide">
                                    {isRaining ? 'Routing: Heavy Rain' : 'Routing: Optimal'}
                                </span>
                            </div>
                        </div>
                      </div>
                </div>

            </div>

            {/* RIGHT: SMART BINS & WIDGETS (4 Cols) */}
            <div className="lg:col-span-4 flex flex-col gap-4 md:gap-6">
                
                {/* Smart Bin Monitor (Real-time Levels) */}
                <div className="bg-zinc-900 text-white rounded-[2rem] md:rounded-[2.5rem] p-6 md:p-8 shadow-xl shadow-zinc-200">
                    <div className="flex justify-between items-center mb-6">
                        <div>
                            <h3 className="font-bold text-base md:text-lg text-white">Smart Bins</h3>
                            <p className="text-[10px] md:text-xs text-zinc-400">IoT Fill Levels</p>
                        </div>
                        <div className="p-2 bg-white/10 rounded-full animate-pulse">
                            <div className={`w-2 h-2 rounded-full ${isRaining ? 'bg-blue-400' : 'bg-green-400'}`} />
                        </div>
                    </div>

                    <div className="space-y-4">
                        {bins.map((bin, i) => (
                            <div key={i} className="group">
                                <div className="flex justify-between items-center mb-2">
                                    <span className="text-xs md:text-sm font-bold text-zinc-200">{bin.location}</span>
                                    <span className={`text-[9px] font-bold px-2 py-0.5 rounded-md uppercase tracking-wider transition-colors duration-300 ${
                                        bin.status === 'Critical' ? 'bg-red-500/20 text-red-400' : 
                                        bin.status === 'Warning' ? 'bg-orange-500/20 text-orange-400' : 'bg-green-500/20 text-green-400'
                                    }`}>
                                        {bin.status}
                                    </span>
                                </div>
                                <div className="flex items-center gap-3">
                                    <div className="flex-1 bg-white/10 h-2 rounded-full overflow-hidden">
                                        <motion.div 
                                            animate={{ 
                                                width: `${bin.level}%`, 
                                                backgroundColor: bin.level > 80 ? '#ef4444' : bin.level > 50 ? '#f97316' : '#22c55e' 
                                            }}
                                            transition={{ duration: 1 }} // Smooth level transition
                                            className="h-full rounded-full"
                                        />
                                    </div>
                                    <span className="text-xs font-mono text-zinc-400 w-8 text-right">{bin.level.toFixed(0)}%</span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* FEATURE 1: LANDFILL CAPACITY (Slowly Filling) */}
                <div className="bg-orange-50 border border-orange-100 rounded-[2rem] md:rounded-[2.5rem] p-5 md:p-6 shadow-sm relative overflow-hidden">
                    <div className="flex justify-between items-center mb-4 relative z-10">
                        <h4 className="font-bold text-xs md:text-sm text-orange-900 flex items-center gap-2">
                            <AlertOctagon size={16}/> TPA Ciangir Cap.
                        </h4>
                        <span className="text-[10px] md:text-xs font-bold text-orange-600">{landfillCap.toFixed(2)}% Full</span>
                    </div>
                    <div className="w-full bg-orange-200 h-4 rounded-full overflow-hidden relative z-10">
                        <motion.div 
                            animate={{ width: `${landfillCap}%` }} 
                            transition={{ ease: "linear", duration: 0.5 }}
                            className="h-full bg-orange-500 rounded-full"
                        />
                    </div>
                    <p className="text-[9px] md:text-[10px] text-orange-700/60 mt-2 relative z-10">
                        {landfillCap > 90 ? 'CRITICAL: Capacity nearly reached' : 'Projected full capacity in 2.4 years'}
                    </p>
                    <div className="absolute -bottom-10 -right-10 w-32 h-32 bg-orange-200/50 rounded-full blur-2xl"></div>
                </div>

                {/* FEATURE 2: LIVE LOGS (Reactive) */}
                <div className="bg-white border border-zinc-200 rounded-[2rem] md:rounded-[2.5rem] p-5 md:p-6 shadow-sm overflow-hidden h-40 md:h-48">
                    <div className="flex items-center gap-2 mb-4 border-b border-zinc-100 pb-2">
                        <History size={16} className="text-zinc-400"/>
                        <h4 className="font-bold text-xs md:text-sm text-zinc-900">Live Activity</h4>
                    </div>
                    <div className="space-y-3 relative">
                        <AnimatePresence mode='popLayout'>
                        {logs.map((log, i) => (
                            <motion.div 
                                key={`${i}-${log}`} // Unique key for animation
                                layout
                                initial={{ opacity: 0, x: -20 }} 
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: 20 }}
                                className="flex gap-2 items-center"
                            >
                                <div className={`w-1.5 h-1.5 rounded-full shrink-0 ${log.includes('Alert') ? 'bg-red-500' : 'bg-green-500'}`}></div>
                                <p className="text-[10px] md:text-xs text-zinc-500 truncate">{log}</p>
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
                        <p className="text-[9px] font-bold text-yellow-700 uppercase">Top District</p>
                        <p className="font-bold text-zinc-900 text-xs md:text-sm">Cihideung</p>
                    </div>
                    {/* Feature 4: Compost Counter (Increments) */}
                    <div className="bg-emerald-50 border border-emerald-100 rounded-[2rem] p-4 text-center">
                        <Shovel size={20} className="mx-auto text-emerald-600 mb-2" />
                        <p className="text-[9px] font-bold text-emerald-700 uppercase">Compost (kg)</p>
                        <p className="font-bold text-zinc-900 text-xs md:text-sm">{compostOutput.toLocaleString()}</p>
                    </div>
                </div>

            </div>
        </div>
    </PageLayout>
  );
}