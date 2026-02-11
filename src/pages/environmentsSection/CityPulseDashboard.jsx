import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Activity, 
  Wind, 
  Users, 
  Car, 
  Zap, 
  Ambulance, 
  RefreshCw, 
  ArrowUpRight, 
  TrendingUp, 
  TrendingDown, 
  Sparkles, 
  MoreHorizontal, 
  ChevronRight, 
  Search,
  X,
  Video,
  ShieldCheck,
  AlertTriangle
} from 'lucide-react';

// IMPORT PageLayout yang sudah Anda miliki
import PageLayout from '../../components/PageLayout'; 

// --- UTILS & MOCK DATA GENERATORS ---

const DISTRICT_NAMES = ['Cihideung', 'Tawang', 'Cipedes', 'Indihiang', 'Kawalu'];
const LOG_TYPES = ['info', 'warning', 'success', 'critical'];
const LOG_MESSAGES = [
    { title: 'Traffic Congestion', desc: 'High density detected at main intersection.', type: 'warning' },
    { title: 'Public Transport', desc: 'Unit arrived at terminal on schedule.', type: 'info' },
    { title: 'Air Quality Alert', desc: 'PM2.5 levels rising in industrial zone.', type: 'warning' },
    { title: 'Emergency Call', desc: 'Medical assistance required immediately.', type: 'critical' },
    { title: 'Grid Stabilized', desc: 'Power load balanced successfully.', type: 'success' },
    { title: 'Patrol Update', desc: 'Sector 4 patrol completed. No issues.', type: 'info' },
];

const generateTime = () => {
    const now = new Date();
    return now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
};

// --- SUB-COMPONENTS ---

const SectionHeader = ({ title, subtitle, action }) => (
    <div className="flex justify-between items-end mb-6 px-2 border-b border-zinc-200/60 pb-4">
        <div>
            <span className="text-xs font-semibold text-blue-600 uppercase tracking-wider mb-1 block">{subtitle}</span>
            <h2 className="text-2xl font-semibold text-zinc-900 tracking-tight">{title}</h2>
        </div>
        {action && <div className="hidden md:block">{action}</div>}
    </div>
);

const TrendBadge = ({ value }) => {
    const isPositive = value > 0;
    return (
        <div className={`flex items-center gap-1 text-xs font-medium px-2 py-1 rounded-full ${
            isPositive ? 'bg-zinc-100 text-zinc-600' : 'bg-green-50 text-green-700'
        }`}>
            {isPositive ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
            {Math.abs(value).toFixed(1)}%
        </div>
    );
};

const MetricCard = ({ item }) => (
    <motion.div
        layout
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        whileHover={{ y: -4, scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        className="bg-white rounded-3xl p-5 h-48 flex flex-col justify-between shadow-sm hover:shadow-xl hover:shadow-blue-500/5 border border-zinc-100 transition-all duration-300 group cursor-pointer relative overflow-hidden"
    >
        <div className="flex justify-between items-start z-10">
            <div className="w-10 h-10 rounded-2xl bg-zinc-50 flex items-center justify-center text-zinc-900 group-hover:bg-blue-600 group-hover:text-white transition-colors duration-300">
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
            <p className="text-xs text-zinc-500 font-medium uppercase tracking-wide">{item.subtitle}</p>
        </div>
        <div className="absolute -right-4 -bottom-4 opacity-0 group-hover:opacity-5 transition-opacity duration-500 pointer-events-none">
            <item.icon size={100} />
        </div>
    </motion.div>
);

const ActivityRow = ({ log, isLast, onResolve }) => (
    <motion.div 
        layout
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: 20 }}
        whileHover={{ backgroundColor: "rgba(250, 250, 250, 1)" }}
        onClick={() => (log.type === 'critical' || log.type === 'warning') && onResolve(log.id)}
        className={`flex items-center p-4 transition-colors duration-200 cursor-pointer group ${!isLast ? 'border-b border-zinc-100' : ''}`}
    >
        <div className="w-16 shrink-0 flex flex-col items-center justify-center gap-1 mr-4">
            <span className="text-[10px] font-bold text-zinc-400">{log.time}</span>
            <div className={`w-2 h-2 rounded-full ${
                log.type === 'warning' ? 'bg-orange-400' : 
                log.type === 'critical' ? 'bg-red-500 animate-pulse' : 
                log.type === 'success' ? 'bg-green-500' : 'bg-blue-500'
            }`}></div>
        </div>
        <div className="flex-grow">
            <h4 className="text-sm font-semibold text-zinc-900 group-hover:text-blue-600 transition-colors">{log.title}</h4>
            <p className="text-xs text-zinc-500 mt-0.5">{log.desc}</p>
        </div>
        <div className="text-zinc-300 group-hover:text-blue-600 group-hover:translate-x-1 transition-all">
            {(log.type === 'critical' || log.type === 'warning') ? (
               <span className="text-[10px] font-bold uppercase border border-zinc-200 px-2 py-1 rounded bg-white text-zinc-500 group-hover:border-blue-200 group-hover:text-blue-600">
                 Action
               </span>
            ) : (
               <ChevronRight size={16} />
            )}
        </div>
    </motion.div>
);

// --- MODAL COMPONENT (FEATURE 2) ---
const DistrictDetailModal = ({ district, onClose }) => {
    if (!district) return null;
    return (
        <motion.div 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }} 
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-zinc-900/40 backdrop-blur-sm p-4"
            onClick={onClose}
        >
            <motion.div 
                initial={{ scale: 0.9, y: 20 }}
                animate={{ scale: 1, y: 0 }}
                exit={{ scale: 0.9, y: 20 }}
                className="bg-white rounded-3xl w-full max-w-md shadow-2xl border border-white/50 overflow-hidden"
                onClick={(e) => e.stopPropagation()}
            >
                <div className="h-40 bg-zinc-900 relative flex items-center justify-center overflow-hidden">
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-blue-900/40 via-zinc-900 to-zinc-900"></div>
                     {/* Simulated CCTV Noise */}
                    <div className="absolute inset-0 opacity-20 bg-[url('https://grainy-gradients.vercel.app/noise.svg')]"></div>
                    
                    <div className="z-10 flex flex-col items-center">
                        <Video className="text-white/80 mb-2 animate-pulse" size={32} />
                        <span className="text-xs font-mono text-green-400 bg-green-900/30 px-2 py-0.5 rounded border border-green-500/30">● LIVE FEED - CAM 04</span>
                    </div>
                    <button onClick={onClose} className="absolute top-4 right-4 text-white/70 hover:text-white bg-black/20 hover:bg-black/40 p-2 rounded-full transition-all">
                        <X size={18} />
                    </button>
                </div>
                <div className="p-6">
                    <div className="flex justify-between items-start mb-4">
                        <div>
                            <h3 className="text-2xl font-bold text-zinc-900">{district.name}</h3>
                            <p className="text-sm text-zinc-500">District ID: #{Math.floor(Math.random() * 1000)}</p>
                        </div>
                        <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                            district.status === 'High Density' ? 'bg-red-50 text-red-600' :
                            district.status === 'Moderate' ? 'bg-orange-50 text-orange-600' :
                            'bg-green-50 text-green-600'
                        }`}>
                            {district.status}
                        </span>
                    </div>
                    
                    <div className="space-y-3">
                        <div className="flex justify-between items-center p-3 bg-zinc-50 rounded-xl border border-zinc-100">
                            <div className="flex items-center gap-3">
                                <Car size={16} className="text-blue-500" />
                                <span className="text-sm font-medium text-zinc-700">Traffic Flow</span>
                            </div>
                            <span className="text-sm font-bold text-zinc-900">{Math.floor(Math.random() * 50) + 20} cars/min</span>
                        </div>
                        <div className="flex justify-between items-center p-3 bg-zinc-50 rounded-xl border border-zinc-100">
                            <div className="flex items-center gap-3">
                                <ShieldCheck size={16} className="text-green-500" />
                                <span className="text-sm font-medium text-zinc-700">Safety Index</span>
                            </div>
                            <span className="text-sm font-bold text-zinc-900">98% Secure</span>
                        </div>
                    </div>

                    <button className="w-full mt-6 bg-zinc-900 text-white py-3 rounded-xl font-medium text-sm hover:bg-zinc-800 transition-colors flex justify-center items-center gap-2">
                        <AlertTriangle size={16} /> Report Incident
                    </button>
                </div>
            </motion.div>
        </motion.div>
    );
}

// --- MAIN PAGE COMPONENT ---

export default function CityPulseDashboard() {
  const [isClient, setIsClient] = useState(false);
  
  // State for Features
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDistrict, setSelectedDistrict] = useState(null);
  
  // Dynamic Data State
  const [kpiData, setKpiData] = useState([
    { id: 1, title: 'Population', subtitle: 'Density / km²', value: 1240, trend: 2.4, icon: Users, format: 'number' },
    { id: 2, title: 'Traffic Load', subtitle: 'Congestion Rate', value: 78, trend: 12.5, icon: Car, format: 'percent' },
    { id: 3, title: 'Air Quality', subtitle: 'AQI Index', value: 42, trend: -5.1, icon: Wind, format: 'number' },
    { id: 4, title: 'Transport', subtitle: 'Occupancy Rate', value: 86, trend: 3.2, icon: Activity, format: 'percent' },
    { id: 5, title: 'Emergency', subtitle: 'Active Cases', value: 14, trend: -1, icon: Ambulance, format: 'number' },
    { id: 6, title: 'Energy Grid', subtitle: 'Load Capacity', value: 64, trend: -0.8, icon: Zap, format: 'percent' },
  ]);

  const [logs, setLogs] = useState([
    { id: 1, time: '10:42 AM', title: 'Traffic Congestion', desc: 'High density detected at JL. KHZ Mustofa.', type: 'warning' },
    { id: 2, time: '10:38 AM', title: 'Public Transport', desc: 'Unit #402 arrived at Dadaha Terminal.', type: 'info' },
    { id: 3, time: '10:30 AM', title: 'Air Quality Update', desc: 'Index improved in Cipedes District.', type: 'success' },
  ]);

  const [districts, setDistricts] = useState([
    { name: 'Cihideung', status: 'High Density', x: '40%', y: '30%' },
    { name: 'Tawang', status: 'Moderate', x: '60%', y: '45%' },
    { name: 'Cipedes', status: 'Low Traffic', x: '30%', y: '60%' },
  ]);

  useEffect(() => {
    setIsClient(true);
  }, []);

  // SIMULATION ENGINE (Feature 1)
  useEffect(() => {
    const interval = setInterval(() => {
        // 1. Simulate KPI Fluctuation
        setKpiData(prev => prev.map(item => {
            const change = (Math.random() - 0.5) * 5; // Small fluctuation
            let newValue = item.format === 'percent' 
                ? Math.min(100, Math.max(0, Math.round(item.value + change)))
                : Math.round(item.value + change);
            
            return {
                ...item,
                value: newValue,
                trend: Number((item.trend + (Math.random() - 0.5)).toFixed(1))
            };
        }));

        // 2. Simulate Random Log Entry (30% chance every tick)
        if (Math.random() > 0.7) {
            const randomMsg = LOG_MESSAGES[Math.floor(Math.random() * LOG_MESSAGES.length)];
            const newLog = {
                id: Date.now(),
                time: generateTime(),
                title: randomMsg.title,
                desc: randomMsg.desc,
                type: randomMsg.type
            };
            setLogs(prev => [newLog, ...prev].slice(0, 10)); // Keep last 10
        }

    }, 3500); // Update every 3.5 seconds

    return () => clearInterval(interval);
  }, []);

  // HANDLER: Dispatch Unit (Feature 3)
  const handleResolveAlert = (id) => {
      // Find the log
      const logIndex = logs.findIndex(l => l.id === id);
      if(logIndex === -1) return;

      // Optimistic update to show "Dispatching"
      const newLogs = [...logs];
      newLogs[logIndex] = { ...newLogs[logIndex], title: 'Dispatching Unit...', desc: 'System automatically assigning nearest patrol.', type: 'info' };
      setLogs(newLogs);

      // Simulate resolution delay
      setTimeout(() => {
          setLogs(prev => prev.map(log => {
              if (log.id === id) {
                  return { ...log, title: 'Issue Resolved', desc: 'Team successfully managed the situation.', type: 'success' };
              }
              return log;
          }));
      }, 2000);
  };

  // HANDLER: Filtered Data
  const filteredLogs = logs.filter(l => 
      l.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
      l.desc.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredDistricts = districts.filter(d => 
      d.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <PageLayout 
        title="Tasikmalaya Smart City" 
        subtitle="Command Center" 
        colorTheme="blue"
    >
        <AnimatePresence>
            {selectedDistrict && (
                <DistrictDetailModal 
                    district={selectedDistrict} 
                    onClose={() => setSelectedDistrict(null)} 
                />
            )}
        </AnimatePresence>

        {/* --- Utility / Filter Bar --- */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-4">
            <div className="flex items-center gap-3">
                 <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-white border border-green-200 shadow-sm">
                    <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
                    <span className="text-xs font-semibold text-green-700 uppercase tracking-wide">System Online</span>
                </div>
            </div>

            <div className="flex items-center gap-3 w-full md:w-auto">
                <div className="relative group w-full md:w-64">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400 group-focus-within:text-blue-600 transition-colors" size={16} />
                    <input 
                        type="text" 
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder="Search district data..." 
                        className="w-full bg-white border border-zinc-200 rounded-full py-2 pl-10 pr-4 text-sm outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all shadow-sm"
                    />
                </div>
                {/* Profile Icon Placeholder */}
                <div className="w-10 h-10 rounded-full bg-white border border-zinc-200 flex items-center justify-center hover:border-blue-300 cursor-pointer transition-colors shadow-sm shrink-0 overflow-hidden">
                    <div className="w-full h-full bg-zinc-100 flex items-center justify-center text-zinc-400 text-xs">IMG</div>
                </div>
            </div>
        </div>

        {/* --- KPI SECTION --- */}
        <section className="mb-12">
            <SectionHeader 
                title="Real-time Metrics" 
                subtitle="Overview" 
                action={
                    <button onClick={() => window.location.reload()} className="flex items-center gap-1 text-sm font-medium text-blue-600 hover:text-blue-700 transition-colors group">
                        Refresh Data <RefreshCw size={14} className="group-hover:rotate-180 transition-transform duration-500" />
                    </button>
                }
            />
            <motion.div layout className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                {kpiData.map((kpi) => (
                    <MetricCard key={kpi.id} item={{...kpi, value: kpi.format === 'percent' ? `${kpi.value}%` : kpi.value.toLocaleString()}} />
                ))}
            </motion.div>
        </section>

        {/* --- BENTO GRID LAYOUT --- */}
        <section className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            
            {/* COLUMN 1 & 2: MAP & AI */}
            <div className="lg:col-span-2 flex flex-col gap-6">
                
                {/* MAP WIDGET */}
                <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-white rounded-[2.5rem] p-2 shadow-sm border border-zinc-200 relative overflow-hidden h-[420px] group"
                >
                    <div className="w-full h-full rounded-[2rem] bg-zinc-50 relative overflow-hidden">
                        {/* Fake Map Elements */}
                        <div className="absolute inset-0 opacity-30 bg-[radial-gradient(#cbd5e1_1px,transparent_1px)] [background-size:20px_20px]"></div>
                        
                        <div className="absolute top-1/4 left-1/3 w-64 h-64 bg-blue-200/40 rounded-full blur-[80px]"></div>
                        <div className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-indigo-200/40 rounded-full blur-[80px]"></div>

                        <div className="absolute top-6 left-6 z-20 pointer-events-none">
                            <span className="px-3 py-1 rounded-full bg-white/60 backdrop-blur-md border border-white/40 text-xs font-semibold text-blue-600 shadow-sm mb-2 inline-block">
                                LIVE MAP
                            </span>
                            <h3 className="text-xl font-bold text-zinc-900 tracking-tight">District Heatmap</h3>
                        </div>

                        {/* Interactive Markers */}
                        <AnimatePresence>
                        {filteredDistricts.map((district, i) => (
                             <motion.div
                                key={district.name}
                                layout
                                initial={{ scale: 0, opacity: 0 }}
                                animate={{ scale: 1, opacity: 1 }}
                                exit={{ scale: 0, opacity: 0 }}
                                onClick={() => setSelectedDistrict(district)}
                                className="absolute cursor-pointer group/marker"
                                style={{ left: district.x, top: district.y }}
                             >
                                <div className="relative flex items-center justify-center">
                                    <div className={`w-12 h-12 rounded-full animate-ping absolute ${
                                        district.status === 'High Density' ? 'bg-red-500/20' : 'bg-blue-500/10'
                                    }`}></div>
                                    <div className={`w-4 h-4 rounded-full border-[3px] border-white shadow-lg relative z-10 transition-transform group-hover/marker:scale-125 ${
                                        district.status === 'High Density' ? 'bg-red-500' : 
                                        district.status === 'Moderate' ? 'bg-orange-500' : 'bg-blue-600'
                                    }`}></div>
                                    
                                    <div className="absolute bottom-full mb-3 left-1/2 -translate-x-1/2 px-4 py-2 bg-white/90 backdrop-blur-xl rounded-2xl shadow-xl border border-white/50 text-center min-w-[120px] opacity-0 group-hover/marker:opacity-100 transition-all transform translate-y-2 group-hover/marker:translate-y-0 z-30">
                                        <p className="text-xs font-bold text-zinc-900">{district.name}</p>
                                        <p className="text-[10px] text-zinc-500 font-medium">{district.status}</p>
                                        <p className="text-[10px] text-blue-600 font-bold mt-1">Click for CCTV</p>
                                    </div>
                                </div>
                             </motion.div>
                        ))}
                        </AnimatePresence>
                    </div>
                </motion.div>

                {/* AI INSIGHT CARD */}
                <motion.div 
                    whileHover={{ scale: 1.005 }}
                    className="bg-gradient-to-r from-zinc-50 to-white border border-zinc-200 rounded-3xl p-8 shadow-sm relative overflow-hidden flex flex-col md:flex-row items-start md:items-center justify-between gap-4"
                >
                    <div className="relative z-10 max-w-lg">
                        <div className="flex items-center gap-2 mb-3">
                            <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center">
                                <Sparkles size={16} className="text-blue-600" />
                            </div>
                            <span className="text-xs font-bold text-blue-600 uppercase tracking-widest">AI Prediction</span>
                        </div>
                        <h4 className="text-lg font-bold text-zinc-900 mb-2">High Congestion Alert</h4>
                        <p className="text-sm text-zinc-500 leading-relaxed">
                            Traffic in <strong className="text-zinc-900">Cihideung District</strong> is projected to increase by 25% within the hour. Rerouting protocols suggested.
                        </p>
                    </div>
                    
                    <button className="bg-zinc-900 text-white px-6 py-3 rounded-full text-xs font-medium hover:bg-zinc-800 transition-colors shadow-lg shadow-zinc-900/10 flex items-center gap-2 shrink-0">
                        View Analysis <ArrowUpRight size={14} />
                    </button>

                    <div className="absolute right-0 top-1/2 -translate-y-1/2 w-32 h-32 bg-blue-500/10 blur-[50px] pointer-events-none"></div>
                </motion.div>

            </div>

            {/* COLUMN 3: ACTIVITY FEED */}
            <div className="lg:col-span-1">
                <div className="bg-white rounded-3xl border border-zinc-200 shadow-sm overflow-hidden h-full flex flex-col relative">
                    <div className="p-6 border-b border-zinc-100 flex justify-between items-center bg-white sticky top-0 z-10">
                        <div className="flex items-center gap-2">
                            <h3 className="text-lg font-bold text-zinc-900 tracking-tight">Recent Activity</h3>
                            <span className="bg-blue-100 text-blue-700 text-[10px] font-bold px-2 py-0.5 rounded-full">{logs.length}</span>
                        </div>
                        <MoreHorizontal size={20} className="text-zinc-400 hover:text-zinc-900 cursor-pointer" />
                    </div>
                    
                    <div className="flex-grow overflow-y-auto max-h-[500px] lg:max-h-none custom-scrollbar">
                        <AnimatePresence initial={false}>
                            {filteredLogs.map((log, idx) => (
                                <ActivityRow 
                                    key={log.id} 
                                    log={log} 
                                    isLast={idx === filteredLogs.length - 1} 
                                    onResolve={handleResolveAlert}
                                />
                            ))}
                        </AnimatePresence>
                        {filteredLogs.length === 0 && (
                            <div className="p-8 text-center text-zinc-400 text-sm">No logs match your search.</div>
                        )}
                    </div>

                    <div className="p-4 bg-zinc-50 border-t border-zinc-100 text-center sticky bottom-0">
                        <span className="text-xs font-semibold text-blue-600 hover:text-blue-700 cursor-pointer transition-colors">View System Logs</span>
                    </div>
                </div>
            </div>
        </section>
    </PageLayout>
  );
}