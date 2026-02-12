import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Baby, 
  HeartHandshake, 
  Activity, 
  BookOpen, 
  ShieldCheck, 
  Users, 
  Clock, 
  TrendingUp, 
  TrendingDown,
  AlertCircle,
  Ruler,
  Calendar,
  ChevronRight,
  ArrowUpRight,
  Smile,
  Utensils,
  Search,
  CheckCircle2,
  Filter,
  X,
  Plus,
  Phone,
  MessageCircle
} from 'lucide-react';
import { 
  AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell, 
  ResponsiveContainer, XAxis, Tooltip, CartesianGrid 
} from 'recharts';

import PageLayout from '../../components/PageLayout'; 

// --- MOCK DATASETS (Dynamic Simulation) ---
const DATA_SETS = {
  Enrollment: [
    { month: 'Jan', index: 82 }, { month: 'Feb', index: 85 }, { month: 'Mar', index: 88 },
    { month: 'Apr', index: 86 }, { month: 'May', index: 90 }, { month: 'Jun', index: 94 },
    { month: 'Jul', index: 95 }, { month: 'Aug', index: 93 }, { month: 'Sep', index: 96 }, 
    { month: 'Oct', index: 97 }, { month: 'Nov', index: 98 }, { month: 'Dec', index: 99 }
  ],
  'Health Coverage': [
    { month: 'Jan', index: 70 }, { month: 'Feb', index: 72 }, { month: 'Mar', index: 75 },
    { month: 'Apr', index: 78 }, { month: 'May', index: 80 }, { month: 'Jun', index: 85 },
    { month: 'Jul', index: 88 }, { month: 'Aug', index: 90 }, { month: 'Sep', index: 92 }, 
    { month: 'Oct', index: 95 }, { month: 'Nov', index: 97 }, { month: 'Dec', index: 98 }
  ],
  'Nutrition Score': [
    { month: 'Jan', index: 6.5 }, { month: 'Feb', index: 6.8 }, { month: 'Mar', index: 7.0 },
    { month: 'Apr', index: 7.2 }, { month: 'May', index: 7.5 }, { month: 'Jun', index: 7.8 },
    { month: 'Jul', index: 8.0 }, { month: 'Aug', index: 8.2 }, { month: 'Sep', index: 8.4 }, 
    { month: 'Oct', index: 8.5 }, { month: 'Nov', index: 8.6 }, { month: 'Dec', index: 8.8 }
  ],
  'Immunization': [
    { month: 'Jan', index: 88 }, { month: 'Feb', index: 89 }, { month: 'Mar', index: 85 },
    { month: 'Apr', index: 87 }, { month: 'May', index: 88 }, { month: 'Jun', index: 90 },
    { month: 'Jul', index: 91 }, { month: 'Aug', index: 90 }, { month: 'Sep', index: 91 }, 
    { month: 'Oct', index: 92 }, { month: 'Nov', index: 91 }, { month: 'Dec', index: 91 }
  ]
};

const KPI_DATA_BASE = [
  { id: 'Enrollment', label: 'Enrollment', sub: 'Early Education', value: '94%', trend: +2.1, icon: BookOpen, color: 'blue' },
  { id: 'Health Coverage', label: 'Health Coverage', sub: 'Insurance & Care', value: '98%', trend: +0.5, icon: ShieldCheck, color: 'emerald' },
  { id: 'Nutrition Score', label: 'Nutrition Score', sub: 'City Average', value: '8.5', trend: +4.0, icon: Utensils, color: 'amber' },
  { id: 'Immunization', label: 'Immunization', sub: 'Complete Dose', value: '91%', trend: +1.2, icon: Baby, color: 'rose' },
];

const PARTICIPATION_DATA = [
  { district: 'Cihideung', count: 85 }, { district: 'Tawang', count: 92 },
  { district: 'Cipedes', count: 74 }, { district: 'Indihiang', count: 68 }
];

const AGE_DISTRIBUTION = [
  { name: 'Infant (0-2)', value: 25, color: '#f59e0b' },
  { name: 'Toddler (2-5)', value: 35, color: '#fbbf24' },
  { name: 'School (5+)', value: 40, color: '#d97706' }
];

const PARENTING_MODULES = [
    { id: 1, title: "Early Childhood Nutrition", desc: "Balancing macro-nutrients for ages 0-3.", age: "0-3 Yrs", time: "45m", cat: "Health" },
    { id: 2, title: "Positive Parenting", desc: "Behavioral guidance without conflict.", age: "All Ages", time: "1h 20m", cat: "Psych" },
    { id: 3, title: "Digital Exposure Mgmt", desc: "Setting healthy screen time boundaries.", age: "3-12 Yrs", time: "30m", cat: "Lifestyle" },
    { id: 4, title: "Sleep Training 101", desc: "Methods to ensure deep sleep.", age: "0-2 Yrs", time: "50m", cat: "Health" },
    { id: 5, title: "Motor Skills Development", desc: "Activities to boost physical coordination.", age: "2-5 Yrs", time: "40m", cat: "Health" },
    { id: 6, title: "Emotional Intelligence", desc: "Helping kids understand their feelings.", age: "4-8 Yrs", time: "55m", cat: "Psych" },
];

// --- SUB-COMPONENTS ---

const MetricCard = ({ item, isActive, onClick }) => (
    <motion.div
        layout
        onClick={onClick}
        whileHover={{ y: -4, scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        className={`rounded-3xl p-5 h-48 flex flex-col justify-between shadow-sm border transition-all duration-300 group cursor-pointer relative overflow-hidden ${
            isActive 
            ? 'bg-amber-500 border-amber-500 text-white shadow-amber-500/30 shadow-lg' 
            : 'bg-white border-zinc-100 hover:shadow-xl hover:shadow-amber-500/5'
        }`}
    >
        <div className="flex justify-between items-start z-10">
            <div className={`w-10 h-10 rounded-2xl flex items-center justify-center transition-colors duration-300 ${
                isActive ? 'bg-white/20 text-white' : 'bg-zinc-50 text-zinc-900 group-hover:bg-amber-500 group-hover:text-white'
            }`}>
                <item.icon size={20} />
            </div>
            <div className={`w-7 h-7 rounded-full flex items-center justify-center transition-colors ${
                isActive ? 'bg-white/20 text-white' : 'bg-zinc-100 text-zinc-400 group-hover:text-amber-600'
            }`}>
                <ArrowUpRight size={14} />
            </div>
        </div>
        <div className="z-10 mt-auto">
            <div className="flex justify-between items-end mb-1">
                <h3 className={`text-3xl font-bold tracking-tight leading-none transition-colors ${
                    isActive ? 'text-white' : 'text-zinc-900 group-hover:text-amber-600'
                }`}>
                    {item.value}
                </h3>
                {/* Custom badge style for active state */}
                <div className={`flex items-center gap-1 text-xs font-medium px-2 py-1 rounded-full ${
                    isActive ? 'bg-white/20 text-white' : (item.trend > 0 ? 'bg-amber-50 text-amber-700' : 'bg-zinc-100 text-zinc-600')
                }`}>
                      {item.trend > 0 ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
                      {Math.abs(item.trend)}%
                </div>
            </div>
            <p className={`text-xs font-medium uppercase tracking-wide ${isActive ? 'text-amber-100' : 'text-zinc-500'}`}>
                {item.label}
            </p>
        </div>
        <div className={`absolute -right-4 -bottom-4 transition-opacity duration-500 pointer-events-none ${
            isActive ? 'opacity-10 text-white' : 'opacity-0 group-hover:opacity-5 text-zinc-900'
        }`}>
            <item.icon size={100} />
        </div>
    </motion.div>
);

// --- MODAL COMPONENT (NEW FEATURE 2: GROWTH UPDATE) ---
const UpdateGrowthModal = ({ isOpen, onClose, currentData, onSave }) => {
    const [height, setHeight] = useState(currentData.height);
    const [weight, setWeight] = useState(currentData.weight);

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-zinc-900/40 backdrop-blur-sm p-4">
            <motion.div 
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className="bg-white rounded-[2rem] w-full max-w-sm p-6 shadow-2xl relative"
            >
                <div className="flex justify-between items-center mb-6">
                    <h3 className="text-lg font-bold text-zinc-900">Update Measurements</h3>
                    <button onClick={onClose} className="p-2 hover:bg-zinc-100 rounded-full text-zinc-500">
                        <X size={20} />
                    </button>
                </div>
                
                <div className="space-y-4">
                    <div>
                        <label className="text-xs font-bold text-zinc-500 uppercase ml-1 block mb-2">Height (cm)</label>
                        <div className="relative">
                            <input 
                                type="number" 
                                value={height}
                                onChange={(e) => setHeight(Number(e.target.value))}
                                className="w-full bg-zinc-50 border border-zinc-200 rounded-xl p-4 text-lg font-bold text-zinc-900 focus:outline-none focus:ring-2 focus:ring-amber-500 transition-all"
                            />
                            <Ruler className="absolute right-4 top-1/2 -translate-y-1/2 text-zinc-400" size={20} />
                        </div>
                    </div>
                    <div>
                        <label className="text-xs font-bold text-zinc-500 uppercase ml-1 block mb-2">Weight (kg)</label>
                        <div className="relative">
                            <input 
                                type="number" 
                                value={weight}
                                onChange={(e) => setWeight(Number(e.target.value))}
                                className="w-full bg-zinc-50 border border-zinc-200 rounded-xl p-4 text-lg font-bold text-zinc-900 focus:outline-none focus:ring-2 focus:ring-amber-500 transition-all"
                            />
                            <Activity className="absolute right-4 top-1/2 -translate-y-1/2 text-zinc-400" size={20} />
                        </div>
                    </div>
                </div>

                <button 
                    onClick={() => { onSave(height, weight); onClose(); }}
                    className="w-full mt-8 bg-amber-500 hover:bg-amber-600 text-white font-bold py-4 rounded-xl transition-colors shadow-lg shadow-amber-500/20 active:scale-95"
                >
                    Save Records
                </button>
            </motion.div>
        </div>
    );
};

// --- MAIN COMPONENT ---

export default function ChildDevelopment() {
  // STATE MANAGEMENT
  const [activeKpi, setActiveKpi] = useState('Enrollment'); 
  const [timeRange, setTimeRange] = useState('1Y'); 
  const [searchQuery, setSearchQuery] = useState(''); 
  const [chartData, setChartData] = useState(DATA_SETS['Enrollment']);
  
  // Growth State
  const [growthData, setGrowthData] = useState({ height: 85, weight: 12 });
  const [isGrowthModalOpen, setIsGrowthModalOpen] = useState(false);

  // Wellbeing Score (Dynamic Calculation based on Growth)
  const wellbeingScore = useMemo(() => {
     // Simple simulation: base 80 + adjustments based on 'healthy' growth ranges
     const hScore = Math.min((growthData.height / 120) * 10, 10);
     const wScore = Math.min((growthData.weight / 30) * 10, 10);
     return (75 + hScore + wScore).toFixed(1);
  }, [growthData]);

  // Daily Milestones State
  const [milestones, setMilestones] = useState([
      { id: 1, text: "Morning Vitamin D", done: true },
      { id: 2, text: "Read 2 Books", done: false },
      { id: 3, text: "Sensory Play (30m)", done: false },
      { id: 4, text: "No Screen Time before 5PM", done: false },
  ]);

  // Effect untuk update chart saat KPI atau Time Range berubah
  useEffect(() => {
    let data = DATA_SETS[activeKpi] || DATA_SETS['Enrollment'];
    
    // Logika Filtering Sederhana untuk Time Range
    if (timeRange === '6M') {
        data = data.slice(6); // Ambil 6 bulan terakhir
    }
    setChartData(data);
  }, [activeKpi, timeRange]);

  // Handler Growth Update
  const handleSaveGrowth = (h, w) => {
      setGrowthData({ height: h, weight: w });
  };

  // Handler Milestone Toggle
  const toggleMilestone = (id) => {
      setMilestones(prev => prev.map(m => 
          m.id === id ? { ...m, done: !m.done } : m
      ));
  };

  // Filter Modules
  const filteredModules = PARENTING_MODULES.filter(m => 
      m.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      m.cat.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <PageLayout 
        title="Child Development" 
        subtitle="Generasi Emas" 
        colorTheme="amber"
    >
        <AnimatePresence>
            {isGrowthModalOpen && (
                <UpdateGrowthModal 
                    isOpen={isGrowthModalOpen} 
                    onClose={() => setIsGrowthModalOpen(false)}
                    currentData={growthData}
                    onSave={handleSaveGrowth}
                />
            )}
        </AnimatePresence>

        {/* HEADER CONTROLS */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-8">
            <div className="flex items-center gap-3">
                 <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-white border border-amber-200 shadow-sm">
                    <div className="w-2 h-2 rounded-full bg-amber-500 animate-pulse"></div>
                    <span className="text-xs font-semibold text-amber-700 uppercase tracking-wide">Stunting Prevention Active</span>
                </div>
            </div>

            {/* Wellbeing Score Widget */}
            <div className="bg-white p-2 pr-6 rounded-[2rem] border border-zinc-200 shadow-sm flex items-center gap-4 hover:shadow-md transition-shadow">
                <div className="w-12 h-12 rounded-full bg-amber-100 flex items-center justify-center text-amber-600 border-4 border-white shadow-sm">
                    <Smile size={24} />
                </div>
                <div>
                    <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider">Wellbeing Index</p>
                    <div className="flex items-baseline gap-1">
                        <motion.span 
                            key={wellbeingScore} // Animate when score changes
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="text-2xl font-bold text-zinc-900"
                        >
                            {wellbeingScore}
                        </motion.span>
                        <span className="text-xs text-zinc-400 font-medium">/100</span>
                    </div>
                </div>
            </div>
        </div>

        {/* KPI SECTION (INTERACTIVE) */}
        <section className="mb-8">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {KPI_DATA_BASE.map((kpi) => (
                    <MetricCard 
                        key={kpi.id} 
                        item={kpi} 
                        isActive={activeKpi === kpi.id}
                        onClick={() => setActiveKpi(kpi.id)}
                    />
                ))}
            </div>
        </section>

        {/* MAIN GRID */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            
            {/* LEFT: DATA VISUALIZATION (8 Cols) */}
            <div className="lg:col-span-8 flex flex-col gap-8">
                
                {/* Health Trend Chart (DYNAMIC) */}
                <div className="bg-white rounded-[2.5rem] p-8 shadow-sm border border-zinc-200">
                    <div className="flex justify-between items-center mb-8">
                        <div>
                            <h3 className="text-lg font-bold text-zinc-900 tracking-tight">{activeKpi} Trends</h3>
                            <p className="text-xs text-zinc-500 uppercase tracking-wide">
                                Data for {timeRange === '1Y' ? 'Past 12 Months' : 'Past 6 Months'}
                            </p>
                        </div>
                        
                        {/* Time Range Selector */}
                        <div className="flex bg-zinc-100 rounded-full p-1 border border-zinc-200">
                            {['6M', '1Y'].map((range) => (
                                <button
                                    key={range}
                                    onClick={() => setTimeRange(range)}
                                    className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all ${
                                        timeRange === range 
                                        ? 'bg-white text-zinc-900 shadow-sm' 
                                        : 'text-zinc-500 hover:text-zinc-700'
                                    }`}
                                >
                                    {range}
                                </button>
                            ))}
                        </div>
                    </div>
                    
                    <div className="h-[280px] w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={chartData}>
                                <defs>
                                    <linearGradient id="colorHealth" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.2}/>
                                        <stop offset="95%" stopColor="#f59e0b" stopOpacity={0}/>
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f4f4f5" />
                                <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{fontSize: 12, fill: '#a1a1aa'}} dy={10} />
                                <Tooltip 
                                    contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)' }} 
                                    itemStyle={{ color: '#d97706', fontWeight: 'bold' }}
                                />
                                <Area 
                                    type="monotone" 
                                    dataKey="index" 
                                    stroke="#f59e0b" 
                                    strokeWidth={3} 
                                    fillOpacity={1} 
                                    fill="url(#colorHealth)" 
                                    animationDuration={1000}
                                />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Secondary Charts Row */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    
                    {/* Participation Bar */}
                    <div className="bg-white rounded-[2.5rem] p-6 shadow-sm border border-zinc-200">
                        <div className="flex items-center gap-2 mb-6">
                            <Users size={16} className="text-amber-500" />
                            <h4 className="text-sm font-bold text-zinc-900">Program Participation</h4>
                        </div>
                        <div className="h-48">
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={PARTICIPATION_DATA}>
                                    <Tooltip cursor={{fill: 'transparent'}} contentStyle={{ borderRadius: '12px', border: 'none' }} />
                                    <Bar dataKey="count" radius={[6, 6, 6, 6]}>
                                        {PARTICIPATION_DATA.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={entry.count > 80 ? '#f59e0b' : '#e4e4e7'} />
                                        ))}
                                    </Bar>
                                    <XAxis dataKey="district" axisLine={false} tickLine={false} tick={{fontSize: 10, fill: '#a1a1aa'}} dy={10} />
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    </div>

                    {/* Age Demographics Pie */}
                    <div className="bg-white rounded-[2.5rem] p-6 shadow-sm border border-zinc-200 relative overflow-hidden">
                        <div className="flex items-center gap-2 mb-2 relative z-10">
                            <Baby size={16} className="text-amber-500" />
                            <h4 className="text-sm font-bold text-zinc-900">Age Distribution</h4>
                        </div>
                        <div className="h-48 relative z-10">
                            <ResponsiveContainer width="100%" height="100%">
                                <PieChart>
                                    <Pie 
                                        data={AGE_DISTRIBUTION} 
                                        innerRadius={50} 
                                        outerRadius={70} 
                                        paddingAngle={5} 
                                        dataKey="value"
                                        stroke="none"
                                    >
                                        {AGE_DISTRIBUTION.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={entry.color} />
                                        ))}
                                    </Pie>
                                    <Tooltip contentStyle={{ borderRadius: '12px', border: 'none' }} />
                                </PieChart>
                            </ResponsiveContainer>
                            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                                <span className="text-[10px] font-bold text-zinc-400 uppercase text-center">Child<br/>Pop.</span>
                            </div>
                        </div>
                        
                        <div className="flex justify-center gap-3 text-[9px] font-bold uppercase text-zinc-400 relative z-10">
                            <div className="flex items-center gap-1"><div className="w-2 h-2 rounded-full bg-amber-500"></div> 0-2</div>
                            <div className="flex items-center gap-1"><div className="w-2 h-2 rounded-full bg-amber-400"></div> 2-5</div>
                            <div className="flex items-center gap-1"><div className="w-2 h-2 rounded-full bg-amber-700"></div> 5+</div>
                        </div>
                    </div>

                </div>

                {/* Modules List (FILTERABLE) */}
                <div className="bg-white border border-zinc-200 rounded-[2.5rem] p-6 shadow-sm min-h-[400px]">
                    <div className="flex flex-col md:flex-row md:items-center justify-between mb-6 px-2 gap-4">
                        <h3 className="text-lg font-bold text-zinc-900 tracking-tight">Parenting Modules</h3>
                        
                        {/* Search Bar */}
                        <div className="relative w-full md:w-64 group">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400 group-focus-within:text-amber-500 transition-colors" size={16} />
                            <input 
                                type="text"
                                placeholder="Find topics..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full pl-10 pr-4 py-2 bg-zinc-50 border border-zinc-200 rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-amber-200 transition-all"
                            />
                        </div>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <AnimatePresence>
                        {filteredModules.length > 0 ? (
                            filteredModules.map((mod, i) => (
                                <motion.div 
                                    layout
                                    initial={{ opacity: 0, scale: 0.9 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    exit={{ opacity: 0, scale: 0.9 }}
                                    key={mod.id} 
                                    className="group bg-zinc-50 hover:bg-white border border-zinc-100 hover:border-amber-200 p-4 rounded-2xl transition-all cursor-pointer flex flex-col justify-between"
                                >
                                    <div>
                                        <div className="flex justify-between items-start mb-2">
                                            <span className="px-2 py-1 rounded-md bg-amber-100 text-amber-700 text-[9px] font-bold uppercase tracking-wider">
                                                {mod.cat}
                                            </span>
                                            <div className="flex items-center gap-1 text-[10px] text-zinc-400">
                                                <Clock size={10} /> {mod.time}
                                            </div>
                                        </div>
                                        <h4 className="font-bold text-zinc-900 mb-1 group-hover:text-amber-600 transition-colors text-sm">{mod.title}</h4>
                                        <p className="text-xs text-zinc-500 line-clamp-1">{mod.desc}</p>
                                    </div>
                                    <div className="mt-4 flex items-center justify-between">
                                        <span className="text-[10px] font-bold text-zinc-400">{mod.age}</span>
                                        <ChevronRight size={14} className="text-zinc-300 group-hover:text-amber-500" />
                                    </div>
                                </motion.div>
                            ))
                        ) : (
                            <div className="col-span-2 text-center py-8 text-zinc-400 text-sm">
                                No modules found matching "{searchQuery}"
                            </div>
                        )}
                        </AnimatePresence>
                    </div>
                </div>

            </div>

            {/* RIGHT: TOOLS & SUPPORT (4 Cols) */}
            <div className="lg:col-span-4 flex flex-col gap-6">
                
                {/* Growth Tracker Widget (INTERACTIVE) */}
                <div className="bg-white border border-zinc-200 rounded-[2.5rem] p-8 shadow-lg shadow-amber-500/5 relative overflow-hidden group">
                    <div className="flex items-center justify-between mb-6 relative z-10">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-amber-100 flex items-center justify-center text-amber-600">
                                <Ruler size={20} />
                            </div>
                            <div>
                                <h3 className="font-bold text-sm text-zinc-900">Growth Tracker</h3>
                                <p className="text-[10px] text-zinc-400 uppercase tracking-wide">Live Assessment</p>
                            </div>
                        </div>
                        {/* Edit Button */}
                        <button 
                            onClick={() => setIsGrowthModalOpen(true)}
                            className="w-8 h-8 rounded-full bg-zinc-50 hover:bg-amber-500 hover:text-white flex items-center justify-center text-zinc-400 transition-colors active:scale-95"
                        >
                            <Plus size={16} />
                        </button>
                    </div>

                    <div className="space-y-6 relative z-10">
                        {/* Height Bar - Logic: Max 120cm for visual */}
                        <div>
                            <div className="flex justify-between text-xs font-bold mb-1">
                                <span className="text-zinc-500">Height</span>
                                <span className="text-amber-600">{growthData.height} cm</span>
                            </div>
                            <div className="h-2 w-full bg-zinc-100 rounded-full overflow-hidden">
                                <motion.div 
                                    initial={{ width: 0 }}
                                    animate={{ width: `${Math.min((growthData.height / 120) * 100, 100)}%` }}
                                    transition={{ duration: 1 }}
                                    className="h-full bg-amber-500 rounded-full" 
                                />
                            </div>
                        </div>
                        {/* Weight Bar - Logic: Max 30kg for visual */}
                        <div>
                            <div className="flex justify-between text-xs font-bold mb-1">
                                <span className="text-zinc-500">Weight</span>
                                <span className="text-amber-600">{growthData.weight} kg</span>
                            </div>
                            <div className="h-2 w-full bg-zinc-100 rounded-full overflow-hidden">
                                <motion.div 
                                    initial={{ width: 0 }}
                                    animate={{ width: `${Math.min((growthData.weight / 30) * 100, 100)}%` }}
                                    transition={{ duration: 1 }}
                                    className="h-full bg-amber-300 rounded-full" 
                                />
                            </div>
                        </div>
                        
                        <div className="p-4 bg-amber-50/80 rounded-2xl border border-amber-100 flex items-start gap-3">
                            <Calendar size={16} className="text-amber-600 mt-0.5 shrink-0" />
                            <div>
                                <p className="text-xs font-bold text-amber-900">Next Immunization</p>
                                <p className="text-[10px] text-amber-700/80 mt-0.5 leading-snug">
                                    Measles Booster due in 12 days. Visit Puskesmas Tawang.
                                </p>
                            </div>
                        </div>
                    </div>
                    {/* Decor */}
                    <div className="absolute top-0 right-0 w-32 h-32 bg-amber-200/20 rounded-full blur-3xl pointer-events-none"></div>
                </div>

                {/* DAILY MILESTONES (INTERACTIVE) */}
                <div className="bg-white border border-zinc-200 rounded-[2.5rem] p-6 shadow-sm">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="font-bold text-sm text-zinc-900">Daily Checklist</h3>
                        <span className={`text-[10px] font-bold px-2 py-1 rounded-lg transition-colors ${
                            milestones.every(m => m.done) ? 'bg-emerald-100 text-emerald-600' : 'bg-amber-50 text-amber-600'
                        }`}>
                            {milestones.filter(m => m.done).length}/{milestones.length}
                        </span>
                    </div>
                    <div className="space-y-2">
                        {milestones.map((item) => (
                            <motion.div 
                                key={item.id}
                                layout
                                onClick={() => toggleMilestone(item.id)} 
                                className={`p-3 rounded-xl border flex items-center gap-3 cursor-pointer transition-all select-none ${
                                    item.done 
                                    ? 'bg-amber-50 border-amber-200' 
                                    : 'bg-white border-zinc-100 hover:border-zinc-200 hover:bg-zinc-50'
                                }`}
                            >
                                <div className={`w-5 h-5 rounded-full flex items-center justify-center border transition-colors ${
                                    item.done ? 'bg-amber-500 border-amber-500 text-white' : 'bg-transparent border-zinc-300'
                                }`}>
                                    {item.done && <CheckCircle2 size={12} />}
                                </div>
                                <span className={`text-xs font-medium transition-colors ${item.done ? 'text-amber-900 line-through decoration-amber-300' : 'text-zinc-600'}`}>
                                    {item.text}
                                </span>
                            </motion.div>
                        ))}
                    </div>
                </div>

                {/* Community Support (Dark) */}
                <div className="bg-zinc-900 text-white rounded-[2.5rem] p-8 shadow-sm">
                    <div className="flex items-center justify-between mb-6">
                        <h3 className="font-bold text-sm">Community Support</h3>
                        <ShieldCheck size={16} className="text-amber-400" />
                    </div>
                    <div className="space-y-3">
                        <div className="bg-white/5 hover:bg-white/10 p-3 rounded-2xl flex items-center gap-3 transition-colors cursor-pointer border border-white/5">
                            <div className="p-2 bg-amber-500 rounded-xl text-white">
                                <Users size={14} />
                            </div>
                            <div>
                                <p className="text-xs font-bold">Parenting Workshop</p>
                                <p className="text-[10px] text-zinc-400">Feb 24 • City Hall</p>
                            </div>
                        </div>
                        <div className="bg-white/5 hover:bg-white/10 p-3 rounded-2xl flex items-center gap-3 transition-colors cursor-pointer border border-white/5">
                            <div className="p-2 bg-zinc-700 rounded-xl text-white">
                                <AlertCircle size={14} />
                            </div>
                            <div>
                                <p className="text-xs font-bold">Report Issue</p>
                                <p className="text-[10px] text-zinc-400">Child Protection</p>
                            </div>
                        </div>
                    </div>
                </div>

            </div>
        </div>

        {/* FLOATING QUICK ACTIONS */}
        <div className="fixed bottom-8 right-8 flex flex-col gap-3 z-40">
            <motion.button 
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                className="w-12 h-12 bg-white text-zinc-900 rounded-full shadow-lg border border-zinc-100 flex items-center justify-center hover:bg-zinc-50"
                title="Consultation"
            >
                <MessageCircle size={20} className="text-amber-600" />
            </motion.button>
            <motion.button 
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                className="w-14 h-14 bg-rose-500 text-white rounded-full shadow-xl shadow-rose-500/30 flex items-center justify-center hover:bg-rose-600"
                title="Emergency Hotline"
            >
                <Phone size={24} />
            </motion.button>
        </div>

    </PageLayout>
  );
}