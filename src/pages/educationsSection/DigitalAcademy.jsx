import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  BookOpen, 
  ShieldCheck, 
  Users, 
  Activity, 
  TrendingUp, 
  TrendingDown,
  Layout, 
  Award, 
  FileText, 
  ChevronRight,
  MoreHorizontal,
  Clock,
  Signal,
  PlayCircle,
  Search,
  CheckCircle2,
  ArrowUpRight,
  ArrowRight,
  GraduationCap,
  Video,
  Download,
  Zap,
  Loader2,
  X,
  BellOff,
  Bell,
  Target
} from 'lucide-react';
import { 
  LineChart, Line, ResponsiveContainer, Tooltip, XAxis 
} from 'recharts';

import PageLayout from '../../components/PageLayout'; 

// --- MOCK DATA ---
const INITIAL_COURSES = [
  { id: 1, title: "Digital Citizenship Basics", desc: "Foundational rights and responsibilities in the digital age.", time: "4h 20m", progress: 100, level: "Beginner", category: "Ethics" },
  { id: 2, title: "Smart City Ecosystem", desc: "Mastering Tasikmalaya's digital public service platforms.", time: "6h 15m", progress: 45, level: "Intermediate", category: "Public Service" },
  { id: 3, title: "Data Privacy & Security", desc: "Navigating digital spaces with integrity and safety.", time: "3h 00m", progress: 12, level: "Beginner", category: "Security" },
  { id: 4, title: "Digital Entrepreneurship", desc: "Basics of e-commerce and digital marketing for MSMEs.", time: "8h 30m", progress: 0, level: "Advanced", category: "Business" },
];

const ANALYTICS_DATA = [
  { name: 'Mon', val: 400 }, { name: 'Tue', val: 550 }, { name: 'Wed', val: 900 },
  { name: 'Thu', val: 1100 }, { name: 'Fri', val: 1400 }, { name: 'Sat', val: 1200 }, { name: 'Sun', val: 950 }
];

const INITIAL_RESOURCES = [
    { id: 'r1', name: "2026 Digital Guide.pdf", size: "2.4 MB", type: "PDF", status: 'idle' },
    { id: 'r2', name: "Cybersecurity Checklist.pdf", size: "1.1 MB", type: "PDF", status: 'idle' },
    { id: 'r3', name: "Intro to AI.mp4", size: "150 MB", type: "Video", status: 'idle' },
];

// --- HELPER COMPONENTS ---

const TrendBadge = ({ value }) => {
    const isPositive = value > 0;
    return (
        <div className={`flex items-center gap-1 text-xs font-medium px-2 py-1 rounded-full ${
            isPositive ? 'bg-emerald-50 text-emerald-700' : 'bg-red-50 text-red-700'
        }`}>
            {isPositive ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
            {Math.abs(value).toFixed(1)}%
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
                <ArrowUpRight size={14} />
            </div>
        </div>
        <div className="z-10 mt-auto">
            <div className="flex justify-between items-end mb-1">
                <h3 className="text-3xl font-bold text-zinc-900 tracking-tight leading-none group-hover:text-blue-600 transition-colors">
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

export default function DigitalAcademy() {
  // STATE MANAGEMENT
  const [searchQuery, setSearchQuery] = useState('');
  const [courses, setCourses] = useState(INITIAL_COURSES);
  const [resources, setResources] = useState(INITIAL_RESOURCES);
  
  // Real-time KPI State
  const [kpiData, setKpiData] = useState([
    { id: 1, label: 'Literacy Index', sub: 'Citywide Score', value: 84.2, trend: 2.4, icon: BookOpen },
    { id: 2, label: 'Active Learners', sub: 'Online Now', value: 12400, trend: 12, icon: Users },
    { id: 3, label: 'Completion Rate', sub: 'Avg per Course', value: 67, trend: 5.1, icon: CheckCircle2 },
    { id: 4, label: 'Cyber Awareness', sub: 'Assessment Score', value: 92, trend: 0.8, icon: ShieldCheck },
  ]);

  // New Feature States
  const [showCertificate, setShowCertificate] = useState(null); // Feature 3: Certificate Modal
  const [streak, setStreak] = useState(12); // Feature 1: Streak
  const [focusMode, setFocusMode] = useState(false); // Feature 4: Focus Mode
  const [peerActivity, setPeerActivity] = useState("User_88 just finished 'Cyber Security'..."); // Feature 2: Peer Ticker
  const [studyGoal, setStudyGoal] = useState(5); // Feature 5: Study Goal

  // --- LOGIC: SIMULATION ENGINE ---
  useEffect(() => {
    const interval = setInterval(() => {
        // 1. Simulate KPI Fluctuation
        setKpiData(prev => prev.map(item => {
            if (item.label === 'Active Learners') {
                return { ...item, value: Math.floor(item.value + (Math.random() - 0.5) * 50) };
            }
            return item;
        }));

        // 2. Simulate Peer Activity (Feature 2)
        const names = ['Sarah', 'Budi', 'Dian', 'Reza', 'Siti'];
        const actions = ['started a quiz', 'earned a badge', 'completed a module', 'joined a class'];
        setPeerActivity(`${names[Math.floor(Math.random() * names.length)]} ${actions[Math.floor(Math.random() * actions.length)]}`);

    }, 3000);

    return () => clearInterval(interval);
  }, []);

  // --- LOGIC: ACTIONS ---
  
  const handleProgress = (id) => {
    setCourses(prev => prev.map(c => {
        if(c.id === id) {
            const newProgress = Math.min(100, c.progress + 15);
            if(newProgress === 100 && c.progress < 100) {
                setShowCertificate(c); // Trigger Feature 3
            }
            return { ...c, progress: newProgress };
        }
        return c;
    }));
  };

  const handleDownload = (id) => {
      setResources(prev => prev.map(r => r.id === id ? { ...r, status: 'loading' } : r));
      setTimeout(() => {
          setResources(prev => prev.map(r => r.id === id ? { ...r, status: 'done' } : r));
      }, 2000);
  };

  const filteredCourses = courses.filter(c => 
      c.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
      c.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <PageLayout 
        title="Digital Academy" 
        subtitle="Education Platform" 
        colorTheme="blue"
    >
        {/* FEATURE 3: CERTIFICATE MODAL */}
        <AnimatePresence>
            {showCertificate && (
                <motion.div 
                    initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                    className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4"
                >
                    <motion.div 
                        initial={{ scale: 0.9, y: 20 }} animate={{ scale: 1, y: 0 }}
                        className="bg-white rounded-3xl p-8 max-w-md w-full text-center relative overflow-hidden shadow-2xl"
                    >
                         <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-blue-500 to-indigo-500"></div>
                         <div className="mb-6 flex justify-center">
                             <div className="w-20 h-20 bg-blue-50 rounded-full flex items-center justify-center text-blue-600">
                                 <Award size={40} />
                             </div>
                         </div>
                         <h3 className="text-2xl font-bold text-zinc-900 mb-2">Course Completed!</h3>
                         <p className="text-zinc-500 mb-6">You have successfully mastered <br/><span className="font-bold text-blue-600">{showCertificate.title}</span>.</p>
                         
                         <div className="bg-zinc-50 p-4 rounded-2xl border border-zinc-100 mb-6 text-left flex items-center gap-4">
                             <div className="bg-white p-2 rounded-lg border border-zinc-200 shadow-sm">
                                 <FileText size={24} className="text-blue-500" />
                             </div>
                             <div>
                                 <p className="text-xs font-bold text-zinc-400 uppercase">Certificate ID</p>
                                 <p className="font-mono font-bold text-zinc-800">TSK-{Math.floor(Math.random()*10000)}</p>
                             </div>
                         </div>

                         <div className="flex gap-3">
                             <button onClick={() => setShowCertificate(null)} className="flex-1 py-3 border border-zinc-200 rounded-xl font-bold text-zinc-600 hover:bg-zinc-50">Later</button>
                             <button onClick={() => setShowCertificate(null)} className="flex-1 py-3 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 shadow-lg shadow-blue-500/30">Claim Now</button>
                         </div>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>

        {/* HEADER CONTROLS */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
            <div className="relative w-full md:w-96 group">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400 group-focus-within:text-blue-600 transition-colors" />
                <input 
                    type="text" 
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search courses, modules..." 
                    className="w-full pl-10 pr-4 py-3 bg-white rounded-2xl border border-zinc-200 shadow-sm outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all text-sm"
                />
            </div>
            
            <div className="flex items-center gap-3">
                 {/* FEATURE 2: PEER TICKER */}
                 <div className="hidden lg:flex items-center gap-2 px-4 py-2 rounded-full bg-white border border-zinc-200 shadow-sm">
                    <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
                    <span className="text-xs font-medium text-zinc-500 max-w-[200px] truncate">{peerActivity}</span>
                </div>

                 <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-white border border-blue-200 shadow-sm">
                    <div className="w-2 h-2 rounded-full bg-blue-500 animate-pulse"></div>
                    <span className="text-xs font-semibold text-blue-700 uppercase tracking-wide">Registration Open</span>
                </div>
            </div>
        </div>

        {/* KPI SECTION */}
        <section className="mb-8">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {kpiData.map((kpi) => (
                    <MetricCard key={kpi.id} item={{...kpi, value: kpi.label === 'Active Learners' ? kpi.value.toLocaleString() : kpi.label === 'Completion Rate' ? `${kpi.value}%` : kpi.value}} />
                ))}
            </div>
        </section>

        {/* MAIN GRID */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            
            {/* LEFT: COURSE CURRICULUM (8 Cols) */}
            <div className="lg:col-span-8 flex flex-col gap-8">
                
                {/* Active Learning Hero */}
                <div className="bg-gradient-to-r from-blue-600 to-indigo-700 rounded-[2.5rem] p-8 text-white relative overflow-hidden shadow-lg shadow-blue-500/20">
                    <div className="relative z-10 flex flex-col md:flex-row items-center gap-6">
                        <div className="w-16 h-16 bg-white/10 rounded-2xl flex items-center justify-center backdrop-blur-sm border border-white/20 shrink-0">
                            <BookOpen size={32} className="text-white" />
                        </div>
                        <div className="flex-1">
                            <span className="px-2 py-1 rounded bg-white/20 text-[10px] font-bold uppercase tracking-wider mb-2 inline-block">Continue Learning</span>
                            <h3 className="text-2xl font-bold mb-1">Smart City Ecosystem</h3>
                            <p className="text-blue-100 text-sm mb-4">Module 3: Understanding Digital Public Services</p>
                            <div className="flex items-center gap-4">
                                <button 
                                    onClick={() => handleProgress(2)} // Simulate progress on Smart City course
                                    className="px-6 py-2.5 bg-white text-blue-600 rounded-xl text-xs font-bold uppercase tracking-wider hover:bg-blue-50 transition-colors"
                                >
                                    Resume Course
                                </button>
                                <span className="text-xs font-bold opacity-80">{courses.find(c => c.id === 2)?.progress}% Complete</span>
                            </div>
                        </div>
                        {/* Progress Circle visual (Dynamic) */}
                        <div className="hidden md:block relative w-24 h-24">
                             <svg className="w-full h-full transform -rotate-90">
                                <circle cx="48" cy="48" r="40" stroke="currentColor" strokeWidth="8" fill="transparent" className="text-blue-900/30" />
                                <motion.circle 
                                    initial={{ strokeDashoffset: 251.2 }}
                                    animate={{ strokeDashoffset: 251.2 - (251.2 * courses.find(c => c.id === 2)?.progress / 100) }}
                                    transition={{ duration: 1 }}
                                    cx="48" cy="48" r="40" stroke="currentColor" strokeWidth="8" fill="transparent" strokeDasharray="251.2" className="text-white" strokeLinecap="round" 
                                />
                             </svg>
                             <div className="absolute inset-0 flex items-center justify-center font-bold">{courses.find(c => c.id === 2)?.progress}%</div>
                        </div>
                    </div>
                    {/* Background Decor */}
                    <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -mr-16 -mt-16 pointer-events-none"></div>
                </div>

                {/* Course List */}
                <div>
                    <div className="flex justify-between items-center px-2 mb-4">
                        <h3 className="text-lg font-bold text-zinc-900 tracking-tight">Your Curriculum</h3>
                        <button className="text-xs font-bold text-blue-600 hover:text-blue-700 uppercase tracking-wider">View All Catalog</button>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <AnimatePresence>
                        {filteredCourses.map((course) => (
                            <motion.div 
                                layout
                                key={course.id} 
                                initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                                className="group bg-white border border-zinc-200 rounded-3xl p-6 hover:shadow-md hover:border-blue-200 transition-all duration-300 relative"
                            >
                                <div className="flex justify-between items-start mb-4">
                                    <div className="flex gap-2">
                                        <span className="px-2 py-1 rounded-lg bg-zinc-100 text-zinc-500 text-[10px] font-bold uppercase tracking-wider">{course.level}</span>
                                        <span className="px-2 py-1 rounded-lg bg-blue-50 text-blue-600 text-[10px] font-bold uppercase tracking-wider">{course.category}</span>
                                    </div>
                                    <div 
                                        onClick={() => handleProgress(course.id)}
                                        className="text-zinc-300 group-hover:text-blue-600 transition-colors cursor-pointer hover:scale-110"
                                    >
                                        <PlayCircle size={24} />
                                    </div>
                                </div>
                                
                                <h4 className="text-lg font-bold text-zinc-900 mb-2 group-hover:text-blue-700 transition-colors">{course.title}</h4>
                                <p className="text-sm text-zinc-500 mb-6 line-clamp-2">{course.desc}</p>
                                
                                <div className="space-y-2">
                                    <div className="flex justify-between text-xs font-semibold">
                                        <span className="text-zinc-400 flex items-center gap-1"><Clock size={12} /> {course.time}</span>
                                        <span className={course.progress === 100 ? 'text-emerald-600' : 'text-zinc-700'}>
                                            {course.progress === 100 ? 'Completed' : `${course.progress}%`}
                                        </span>
                                    </div>
                                    <div className="w-full bg-zinc-100 h-2 rounded-full overflow-hidden">
                                        <motion.div 
                                            initial={{ width: 0 }}
                                            animate={{ width: `${course.progress}%` }}
                                            transition={{ duration: 0.5 }}
                                            className={`h-full rounded-full ${course.progress === 100 ? 'bg-emerald-500' : 'bg-blue-600'}`}
                                        />
                                    </div>
                                </div>
                                {course.progress === 100 && (
                                    <div className="absolute top-0 right-0 p-6 pointer-events-none">
                                        <CheckCircle2 size={24} className="text-emerald-500" />
                                    </div>
                                )}
                            </motion.div>
                        ))}
                        </AnimatePresence>
                    </div>
                </div>

            </div>

            {/* RIGHT: PROFILE & ANALYTICS (4 Cols) */}
            <div className="lg:col-span-4 flex flex-col gap-6">
                
                {/* Profile Card */}
                <div className="bg-white border border-zinc-200 rounded-[2.5rem] p-6 text-center relative overflow-hidden shadow-sm">
                    {/* FEATURE 4: FOCUS MODE TOGGLE */}
                    <button 
                        onClick={() => setFocusMode(!focusMode)}
                        className={`absolute top-4 right-4 p-2 rounded-full transition-colors ${focusMode ? 'bg-indigo-600 text-white' : 'bg-zinc-100 text-zinc-400 hover:text-zinc-600'}`}
                        title="Focus Mode"
                    >
                        {focusMode ? <BellOff size={16} /> : <Bell size={16} />}
                    </button>

                    <div className="relative z-10 flex flex-col items-center">
                        <div className="w-24 h-24 p-1 bg-gradient-to-br from-blue-400 to-indigo-400 rounded-full mb-4 relative">
                            <div className="w-full h-full bg-white rounded-full p-1">
                                <div className="w-full h-full rounded-full bg-zinc-100 flex items-center justify-center text-zinc-300 font-bold text-2xl">IMG</div>
                            </div>
                            {/* FEATURE 1: STREAK WIDGET */}
                            <div className="absolute -bottom-2 -right-2 bg-orange-500 text-white text-[10px] font-bold px-2 py-1 rounded-full border-2 border-white flex items-center gap-1 shadow-sm">
                                <Zap size={10} fill="white" /> {streak} Days
                            </div>
                        </div>
                        <h3 className="text-xl font-bold text-zinc-900">Setia Farel</h3>
                        <p className="text-zinc-500 text-xs font-medium uppercase tracking-wider mb-6">Citizen ID: TS-9921</p>
                        
                        <div className="flex w-full gap-2">
                             <div className="flex-1 p-3 bg-zinc-50 rounded-2xl border border-zinc-100">
                                 <Award className="w-6 h-6 text-amber-500 mx-auto mb-1" />
                                 <span className="block text-[10px] font-bold text-zinc-400 uppercase">Rank</span>
                                 <span className="block text-sm font-bold text-zinc-800">Top 10%</span>
                             </div>
                             <div className="flex-1 p-3 bg-zinc-50 rounded-2xl border border-zinc-100">
                                 <GraduationCap className="w-6 h-6 text-blue-500 mx-auto mb-1" />
                                 <span className="block text-[10px] font-bold text-zinc-400 uppercase">Credits</span>
                                 <span className="block text-sm font-bold text-zinc-800">120 XP</span>
                             </div>
                        </div>
                    </div>
                </div>

                {/* FEATURE 5: SMART STUDY GOAL */}
                <div className="bg-indigo-50 border border-indigo-100 rounded-[2.5rem] p-6 relative overflow-hidden">
                    <div className="flex justify-between items-center mb-2">
                        <h4 className="text-sm font-bold text-indigo-900 flex items-center gap-2"><Target size={16}/> Weekly Goal</h4>
                        <span className="text-xs font-bold text-indigo-600">{studyGoal}h Target</span>
                    </div>
                    <div className="flex items-center gap-4">
                        <input 
                            type="range" 
                            min="1" max="20" 
                            value={studyGoal}
                            onChange={(e) => setStudyGoal(e.target.value)}
                            className="w-full h-2 bg-indigo-200 rounded-lg appearance-none cursor-pointer accent-indigo-600"
                        />
                        <span className="text-lg font-bold text-indigo-900 w-8">{studyGoal}</span>
                    </div>
                </div>

                {/* Analytics Chart */}
                <div className="bg-white border border-zinc-200 rounded-[2.5rem] p-6 shadow-sm">
                    <div className="flex justify-between items-center mb-4">
                         <h4 className="text-sm font-bold text-zinc-900">Activity Trend</h4>
                         <span className="text-[10px] font-bold text-zinc-400 uppercase">Last 7 Days</span>
                    </div>
                    <div className="h-40 w-full">
                         <ResponsiveContainer width="100%" height="100%">
                            <LineChart data={ANALYTICS_DATA}>
                                <defs>
                                    <linearGradient id="colorVal" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.8}/>
                                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                                    </linearGradient>
                                </defs>
                                <Tooltip 
                                    contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
                                    itemStyle={{ color: '#3b82f6', fontWeight: 'bold' }}
                                />
                                <Line type="monotone" dataKey="val" stroke="#3b82f6" strokeWidth={3} dot={{r: 4, fill: '#3b82f6', strokeWidth: 2, stroke: '#fff'}} />
                                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fontSize: 10, fill: '#a1a1aa'}} dy={10} />
                            </LineChart>
                         </ResponsiveContainer>
                    </div>
                </div>

                {/* Resource Library (Mini) */}
                <div className="bg-zinc-900 text-white rounded-[2.5rem] p-6 shadow-sm">
                     <div className="flex justify-between items-center mb-4">
                        <h4 className="text-sm font-bold">Resources</h4>
                        <button className="text-[10px] font-bold text-zinc-400 hover:text-white uppercase tracking-wider">See All</button>
                     </div>
                     <div className="space-y-3">
                        {resources.map((res) => (
                            <div key={res.id} className="flex items-center gap-3 p-3 rounded-xl bg-white/5 hover:bg-white/10 transition-colors cursor-pointer group">
                                <div className="p-2 bg-white/10 rounded-lg text-blue-300 group-hover:text-white transition-colors">
                                    {res.type === 'Video' ? <Video size={14} /> : <FileText size={14} />}
                                </div>
                                <div className="flex-1 overflow-hidden">
                                    <p className="text-xs font-bold truncate">{res.name}</p>
                                    <p className="text-[9px] text-zinc-400">{res.size}</p>
                                </div>
                                <div onClick={(e) => { e.stopPropagation(); handleDownload(res.id); }}>
                                    {res.status === 'loading' ? (
                                        <Loader2 size={14} className="text-zinc-500 animate-spin" />
                                    ) : res.status === 'done' ? (
                                        <CheckCircle2 size={14} className="text-emerald-500" />
                                    ) : (
                                        <Download size={14} className="text-zinc-500 group-hover:text-white" />
                                    )}
                                </div>
                            </div>
                        ))}
                     </div>
                </div>

            </div>
        </div>
    </PageLayout>
  );
}