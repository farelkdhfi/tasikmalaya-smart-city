import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Car, 
  Bus, 
  AlertTriangle, 
  Zap, 
  TrendingUp, 
  TrendingDown, 
  Clock, 
  Video, 
  MoreHorizontal,
  ArrowRight,
  ArrowUpRight,
  X,
  CloudRain,
  Siren,
  Radio,
  Activity,
  Maximize2
} from 'lucide-react';

import PageLayout from '../../components/PageLayout'; 

// --- HELPER: Randomizer ---
const getRandomInt = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;

// --- SUB-COMPONENTS ---

const SectionHeader = ({ title, subtitle, rightElement }) => (
    <div className="flex justify-between items-end mb-6 px-2 border-b border-zinc-200/60 pb-4">
        <div>
            <span className="text-xs font-semibold text-orange-600 uppercase tracking-wider mb-1 block">{subtitle}</span>
            <h2 className="text-2xl font-semibold text-zinc-900 tracking-tight">{title}</h2>
        </div>
        {rightElement}
    </div>
);

const TrendBadge = ({ value }) => {
    const isBad = value > 0; 
    return (
        <div className={`flex items-center gap-1 text-xs font-medium px-2 py-1 rounded-full ${
            isBad ? 'bg-orange-50 text-orange-700' : 'bg-emerald-50 text-emerald-700'
        }`}>
            {isBad ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
            {Math.abs(value).toFixed(1)}%
        </div>
    );
};

const MetricCard = ({ item }) => (
    <motion.div
        layout
        whileHover={{ y: -4, scale: 1.02 }}
        className="bg-white rounded-3xl p-5 h-48 flex flex-col justify-between shadow-sm hover:shadow-xl hover:shadow-orange-500/5 border border-zinc-100 transition-all duration-300 group cursor-pointer relative overflow-hidden"
    >
        <div className="flex justify-between items-start z-10">
            <div className={`w-10 h-10 rounded-2xl flex items-center justify-center transition-colors duration-300 ${item.status === 'Critical' ? 'bg-red-50 text-red-600' : 'bg-zinc-50 text-zinc-900 group-hover:bg-orange-600 group-hover:text-white'}`}>
                <item.icon size={20} />
            </div>
            <div className="w-7 h-7 rounded-full bg-zinc-100 flex items-center justify-center text-zinc-400 group-hover:text-orange-600 transition-colors">
                <ArrowUpRight size={14} />
            </div>
        </div>
        <div className="z-10 mt-auto">
            <div className="flex justify-between items-end mb-1">
                <h3 className="text-3xl font-bold text-zinc-900 tracking-tight leading-none group-hover:text-orange-600 transition-colors">
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

// --- MODAL CCTV (NEW FEATURE 2) ---
const CCTVModal = ({ camId, onClose }) => (
    <motion.div 
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center bg-zinc-900/60 backdrop-blur-sm p-4"
    >
        <motion.div 
            initial={{ scale: 0.9 }} animate={{ scale: 1 }}
            className="bg-zinc-900 border border-zinc-700 w-full max-w-2xl rounded-3xl overflow-hidden shadow-2xl"
        >
            <div className="p-4 border-b border-zinc-800 flex justify-between items-center">
                <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
                    <span className="text-white font-mono text-sm tracking-wider">LIVE FEED: {camId}</span>
                </div>
                <button onClick={onClose} className="text-zinc-400 hover:text-white"><X size={20}/></button>
            </div>
            <div className="aspect-video bg-black relative flex items-center justify-center overflow-hidden group">
                 {/* Simulated Traffic Animation */}
                 <div className="absolute inset-0 opacity-20 bg-[url('https://grainy-gradients.vercel.app/noise.svg')]"></div>
                 <div className="absolute top-1/2 left-0 w-full h-24 bg-zinc-800 transform -skew-x-12"></div>
                 <motion.div 
                    animate={{ x: [-200, 800] }} 
                    transition={{ repeat: Infinity, duration: 3, ease: "linear" }}
                    className="absolute top-1/2 left-0 w-16 h-8 bg-white blur-md"
                 ></motion.div>
                 <motion.div 
                    animate={{ x: [-200, 800] }} 
                    transition={{ repeat: Infinity, duration: 2.5, delay: 0.5, ease: "linear" }}
                    className="absolute top-[55%] left-0 w-16 h-8 bg-red-500 blur-md"
                 ></motion.div>
                 
                 <div className="absolute bottom-4 left-4 text-xs font-mono text-green-500">
                     BITRATE: 4500kbps <br/> FPS: 60
                 </div>
                 <div className="absolute top-4 right-4 bg-zinc-800/80 px-2 py-1 rounded text-[10px] text-white">
                     AI RECOGNITION ACTIVE
                 </div>
            </div>
        </motion.div>
    </motion.div>
);

// --- MAIN COMPONENT ---

export default function MobilityDashboard() {
  // STATE MANAGEMENT
  const [currentTime, setCurrentTime] = useState(new Date());
  const [stats, setStats] = useState([
    { id: 1, label: 'Congestion', sub: 'City Index', value: 68, trend: 12, status: 'High', color: 'text-orange-600', icon: Car, unit: '%' },
    { id: 2, label: 'Avg Speed', sub: 'Km per Hour', value: 24, trend: -4, status: 'Slow', color: 'text-zinc-600', icon: Clock, unit: '' },
    { id: 3, label: 'Incidents', sub: 'Active Reports', value: 3, trend: 1, status: 'Critical', color: 'text-red-600', icon: AlertTriangle, unit: '' },
    { id: 4, label: 'Signal eff.', sub: 'Green Wave', value: 94, trend: 2.5, status: 'Optimal', color: 'text-emerald-600', icon: Zap, unit: '%' },
  ]);
  
  const [buses, setBuses] = useState([
    { id: '01', name: 'Dadaha Loop', status: 'On Time', load: 45, next: 120, code: 'R-01' }, // next in seconds
    { id: '02', name: 'Indihiang Exp', status: 'Delayed', load: 82, next: 720, code: 'R-02' },
    { id: '03', name: 'Kawalu Conn.', status: 'On Time', load: 20, next: 300, code: 'R-03' },
  ]);

  const [aiSuggestions, setAiSuggestions] = useState([
    { id: 1, type: 'Signal', title: 'Extend Green Light', desc: '+15s at Hz. Mustofa Intersection to clear southbound backlog.', impact: 'High' },
    { id: 2, type: 'Route', title: 'Divert Heavy Vehicles', desc: 'Reroute trucks via Lingkar Gentong due to stall.', impact: 'Med' },
  ]);

  const [activeLayer, setActiveLayer] = useState('Density');
  const [selectedCam, setSelectedCam] = useState(null);
  
  // NEW FEATURES STATE
  const [isEmergencyMode, setIsEmergencyMode] = useState(false); // Feature 3
  const [isRaining, setIsRaining] = useState(true); // Feature 1
  const [incidents, setIncidents] = useState(['Accident at JL. RE Martadinata', 'Signal Fail at Simpang Lima']); // Feature 5
  
  // SIMULATION ENGINE
  useEffect(() => {
    const interval = setInterval(() => {
        // 1. Update Time
        setCurrentTime(new Date());

        // 2. Simulate Stats
        setStats(prev => prev.map(stat => {
            const change = (Math.random() - 0.5) * 2;
            let newVal = stat.value + change;
            
            // Logic: If raining, speed drops, congestion rises
            if (isRaining && stat.label === 'Avg Speed') newVal -= 0.5;
            if (isRaining && stat.label === 'Congestion') newVal += 0.5;
            if (isEmergencyMode && stat.label === 'Signal eff.') newVal += 1;

            return {
                ...stat,
                value: Math.max(0, Math.min(stat.unit === '%' ? 100 : 200, Math.round(newVal))),
                trend: stat.trend + (Math.random() - 0.5)
            };
        }));

        // 3. Simulate Bus Movement
        setBuses(prev => prev.map(bus => {
            let nextTime = bus.next - 5;
            let status = bus.status;
            let load = bus.load + getRandomInt(-2, 2);
            
            if (nextTime <= 0) {
                nextTime = getRandomInt(600, 1200); // Reset schedule
                status = 'Arriving';
            } else if (nextTime < 60) {
                status = 'Docking';
            } else {
                status = bus.next > 600 ? 'Delayed' : 'On Time';
            }

            return { ...bus, next: nextTime, status, load: Math.min(100, Math.max(0, load)) };
        }));

    }, 2000); // Tick every 2s

    return () => clearInterval(interval);
  }, [isRaining, isEmergencyMode]);

  const formatTime = (seconds) => {
      const m = Math.floor(seconds / 60);
      return m < 1 ? '< 1 min' : `${m} min`;
  };

  const handleApplyAI = (id) => {
      setAiSuggestions(prev => prev.filter(item => item.id !== id));
      // Logic: Improve stats temporarily
      setStats(prev => prev.map(s => s.label === 'Congestion' ? {...s, value: s.value - 5} : s));
  };

  return (
    <PageLayout 
        title="Urban Mobility Network" 
        subtitle="Traffic Control" 
        colorTheme="orange"
    >
        <AnimatePresence>
            {selectedCam && <CCTVModal camId={selectedCam} onClose={() => setSelectedCam(null)} />}
        </AnimatePresence>

        {/* --- KPI SECTION & FEATURE 1 (WEATHER) --- */}
        <section className="mb-8">
            <SectionHeader 
                title="System Overview" 
                subtitle="Metrics" 
                rightElement={
                    // FEATURE 1: WEATHER WIDGET
                    <div className="flex items-center gap-4 bg-white px-4 py-2 rounded-2xl border border-zinc-200 shadow-sm">
                        <div 
                            className={`flex items-center gap-2 cursor-pointer ${isRaining ? 'text-blue-500' : 'text-orange-500'}`}
                            onClick={() => setIsRaining(!isRaining)}
                        >
                            {isRaining ? <CloudRain size={18} /> : <Zap size={18} />}
                            <div className="text-right">
                                <p className="text-xs font-bold text-zinc-900">{isRaining ? 'Rainy' : 'Clear'}</p>
                                <p className="text-[10px] text-zinc-400">24°C • Hum 82%</p>
                            </div>
                        </div>
                        <div className="w-px h-6 bg-zinc-100"></div>
                        <div className="text-zinc-400 text-xs font-mono">{currentTime.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</div>
                    </div>
                }
            />
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {stats.map((stat) => (
                    <MetricCard key={stat.id} item={{...stat, value: `${stat.value}${stat.unit}`}} />
                ))}
            </div>
        </section>

        {/* --- BENTO GRID LAYOUT --- */}
        <section className="grid grid-cols-1 lg:grid-cols-12 gap-6 min-h-[600px]">
            
            {/* LEFT: INTERACTIVE MAP (8 Cols) */}
            <div className="lg:col-span-8 flex flex-col gap-6">
                
                <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-white rounded-[2.5rem] shadow-sm border border-zinc-200 relative overflow-hidden h-full min-h-[500px] group flex flex-col"
                >
                    {/* Map Container */}
                    <div className="absolute inset-0 bg-zinc-100 flex-grow">
                         {/* Grid Pattern */}
                        <div className="absolute inset-0 opacity-[0.07] bg-[linear-gradient(to_right,#000000_1px,transparent_1px),linear-gradient(to_bottom,#000000_1px,transparent_1px)] bg-[size:32px_32px]"></div>
                        
                        {/* FEATURE 3: DYNAMIC ROAD STYLES BASED ON EMERGENCY MODE */}
                        {/* Main Road */}
                        <div className="absolute top-1/2 left-0 w-full h-4 bg-zinc-200 transition-colors duration-500"></div>
                        <motion.div 
                            animate={{ 
                                width: isEmergencyMode ? '100%' : '70%',
                                backgroundColor: isEmergencyMode ? '#10b981' : '#fb923c' // Green for emergency corridor
                            }}
                            className="absolute top-1/2 left-0 h-4 shadow-lg transition-all duration-1000"
                        ></motion.div>
                        
                        {/* Vertical Roads */}
                        <div className="absolute top-0 left-1/3 w-4 h-full bg-zinc-200"></div>
                        <div className={`absolute top-0 left-1/3 w-4 h-full bg-emerald-400/50 ${activeLayer !== 'Density' && 'opacity-20'}`}></div>
                        
                        <div className="absolute top-0 right-1/4 w-4 h-full bg-zinc-200"></div>
                        
                        {/* Pulsing Hotspots (Based on Layer) */}
                        {activeLayer === 'Density' && (
                            <div className="absolute top-[48%] left-[65%] w-32 h-32 bg-orange-500/20 rounded-full blur-3xl animate-pulse"></div>
                        )}
                    </div>

                    {/* Controls Overlay */}
                    <div className="absolute top-6 left-6 z-20 flex flex-col gap-2">
                         <div className="bg-white/80 backdrop-blur-md p-1.5 rounded-xl border border-white/50 shadow-sm inline-flex flex-col gap-1">
                            {['Density', 'CCTV', 'Public'].map((layer) => (
                                <button 
                                    key={layer} 
                                    onClick={() => setActiveLayer(layer)}
                                    className={`px-3 py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-wider text-left transition-colors ${activeLayer === layer ? 'bg-zinc-900 text-white' : 'hover:bg-zinc-100 text-zinc-500'}`}
                                >
                                    {layer}
                                </button>
                            ))}
                         </div>
                         
                         {/* FEATURE 3 CONTROLLER */}
                         <button 
                            onClick={() => setIsEmergencyMode(!isEmergencyMode)}
                            className={`flex items-center gap-2 px-3 py-2 rounded-xl text-[10px] font-bold uppercase border transition-all ${
                                isEmergencyMode ? 'bg-green-500 border-green-600 text-white animate-pulse' : 'bg-white border-zinc-200 text-zinc-500'
                            }`}
                         >
                            <Siren size={14} /> {isEmergencyMode ? 'VIP Corridor ON' : 'VIP Mode Off'}
                         </button>
                    </div>

                    {/* Camera Markers (Interactive) */}
                     {[
                        { x: '33%', y: '50%', id: 'CAM-01' }, 
                        { x: '70%', y: '49%', id: 'CAM-02', alert: true }, 
                        { x: '45%', y: '20%', id: 'CAM-03' }
                      ].map((pos, i) => (
                         <motion.div 
                           key={i}
                           whileHover={{ scale: 1.2 }}
                           onClick={() => setSelectedCam(pos.id)}
                           className="absolute cursor-pointer z-20 group/cam"
                           style={{ left: pos.x, top: pos.y }}
                         >
                           <div className={`w-8 h-8 rounded-full flex items-center justify-center shadow-lg border-2 border-white transition-colors ${pos.alert ? 'bg-red-500 animate-pulse' : 'bg-zinc-900'}`}>
                               <Video size={12} className="text-white" />
                           </div>
                           <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-3 py-2 bg-zinc-900 text-white text-[10px] rounded-lg opacity-0 group-hover/cam:opacity-100 transition-opacity whitespace-nowrap">
                               <span className="font-bold">{pos.id}</span> • Click to View
                           </div>
                         </motion.div>
                    ))}

                    {/* FEATURE 5: LIVE INCIDENT TICKER */}
                    <div className="absolute bottom-0 left-0 w-full bg-zinc-900 text-white py-2 overflow-hidden z-30">
                        <div className="flex items-center gap-4 px-4">
                            <div className="flex items-center gap-1 text-[10px] font-bold uppercase text-red-400 shrink-0">
                                <Radio size={12} className="animate-pulse"/> Live Incidents:
                            </div>
                            <div className="whitespace-nowrap flex gap-8 animate-marquee text-xs font-mono text-zinc-300">
                                {incidents.map((inc, i) => (
                                    <span key={i}>• {inc}</span>
                                ))}
                                <span>• Low Visibility reported on Jalur Selatan due to Rain</span>
                            </div>
                        </div>
                    </div>

                </motion.div>
            </div>

            {/* RIGHT: SIDEBAR (4 Cols) */}
            <div className="lg:col-span-4 flex flex-col gap-6">
                
                {/* 1. AI Suggestion Card */}
                <div className="bg-gradient-to-br from-orange-50 to-white border border-orange-100 rounded-[2rem] p-6 shadow-sm relative overflow-hidden flex flex-col">
                    <div className="flex items-center justify-between mb-4 relative z-10">
                        <div className="flex items-center gap-2">
                            <div className="p-2 bg-orange-100 rounded-lg text-orange-600">
                                <Zap size={16} />
                            </div>
                            <h3 className="font-bold text-zinc-900">AI Actions</h3>
                        </div>
                        {/* FEATURE 4: SIGNAL OVERRIDE */}
                        <button className="text-[10px] font-bold bg-white border border-zinc-200 px-2 py-1 rounded text-zinc-500 hover:text-orange-600 hover:border-orange-200 transition-colors">
                            Manual Override
                        </button>
                    </div>

                    <div className="space-y-3 relative z-10">
                         <AnimatePresence>
                         {aiSuggestions.map((ai) => (
                            <motion.div 
                                key={ai.id}
                                exit={{ opacity: 0, height: 0, marginBottom: 0 }}
                                onClick={() => handleApplyAI(ai.id)}
                                className="bg-white p-4 rounded-2xl shadow-sm border border-orange-100/50 hover:border-orange-300 transition-colors cursor-pointer group relative"
                            >
                                <div className="flex justify-between items-center mb-1">
                                    <span className="text-[10px] font-bold text-orange-600 bg-orange-50 px-2 py-0.5 rounded uppercase">{ai.type}</span>
                                    <ArrowRight size={14} className="text-zinc-300 group-hover:text-orange-600 transition-colors" />
                                </div>
                                <h4 className="text-sm font-bold text-zinc-900">{ai.title}</h4>
                                <p className="text-xs text-zinc-500 mt-1 leading-relaxed">{ai.desc}</p>
                                <div className="absolute inset-0 bg-orange-500/5 opacity-0 group-hover:opacity-100 transition-opacity rounded-2xl"></div>
                            </motion.div>
                         ))}
                         </AnimatePresence>
                         {aiSuggestions.length === 0 && (
                             <div className="text-center py-4 text-xs text-zinc-400">All systems optimized.</div>
                         )}
                    </div>
                    {/* Decor */}
                    <div className="absolute -top-10 -right-10 w-40 h-40 bg-orange-200/20 rounded-full blur-3xl pointer-events-none"></div>
                </div>

                {/* 2. Bus Monitor */}
                <div className="bg-white border border-zinc-200 rounded-[2rem] p-6 shadow-sm flex-1">
                    <div className="flex items-center justify-between mb-6">
                        <h3 className="font-bold text-zinc-900 flex items-center gap-2">
                            <Bus size={18} className="text-zinc-400" /> Transit
                        </h3>
                        <MoreHorizontal size={18} className="text-zinc-300 cursor-pointer" />
                    </div>

                    <div className="space-y-6">
                        {buses.map((bus) => (
                            <div key={bus.id} className="group">
                                <div className="flex justify-between items-center mb-1">
                                    <div>
                                        <span className="text-xs font-bold text-zinc-400 mr-2">{bus.code}</span>
                                        <span className="text-sm font-semibold text-zinc-800">{bus.name}</span>
                                    </div>
                                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                                        bus.status === 'On Time' ? 'bg-zinc-100 text-zinc-600' : 
                                        bus.status === 'Delayed' ? 'bg-red-50 text-red-600' : 'bg-blue-50 text-blue-600'
                                    }`}>
                                        {bus.status}
                                    </span>
                                </div>
                                
                                <div className="flex items-center justify-between text-[10px] text-zinc-400 font-mono uppercase tracking-wider mb-1.5">
                                    <span>Load: {bus.load}%</span>
                                    <span>ETA: {formatTime(bus.next)}</span>
                                </div>

                                <div className="h-1.5 w-full bg-zinc-100 rounded-full overflow-hidden">
                                    <motion.div 
                                        layout
                                        className={`h-full rounded-full transition-all duration-1000 ${bus.load > 80 ? 'bg-red-500' : 'bg-zinc-800'}`} 
                                        style={{ width: `${bus.load}%` }}
                                    ></motion.div>
                                </div>
                            </div>
                        ))}
                    </div>
                    
                    {/* Alert Box */}
                    <div className="mt-6 p-4 bg-zinc-50 rounded-2xl border border-zinc-100 flex gap-3">
                         <div className="shrink-0 text-orange-500">
                             <AlertTriangle size={18} />
                         </div>
                         <div>
                             <p className="text-xs font-bold text-zinc-800">Hub Maintenance</p>
                             <p className="text-[10px] text-zinc-500 mt-0.5">Dadaha Terminal B is currently under repair. Expect delays.</p>
                         </div>
                    </div>
                </div>

            </div>
        </section>

        {/* --- BOTTOM: CHART SECTION --- */}
        <section className="mt-6">
            <div className="bg-white rounded-[2rem] border border-zinc-200 p-8 shadow-sm">
                <div className="flex flex-col md:flex-row md:items-end justify-between mb-4">
                    <div>
                        <h3 className="text-lg font-bold text-zinc-900 tracking-tight">Traffic Density Trends</h3>
                        <p className="text-xs text-zinc-500 uppercase tracking-wide">7-Day Analysis • City Center</p>
                    </div>
                </div>
                {/* Visual Chart Placeholder (Data Logic would go here in real chart lib) */}
                <div className="relative h-40 w-full mt-4">
                    <div className="absolute inset-0 grid grid-cols-6 grid-rows-4 gap-4 opacity-30">
                         {[...Array(5)].map((_, i) => <div key={i} className="border-t border-zinc-200 w-full absolute" style={{top: `${i*25}%`}}></div>)}
                    </div>
                    <svg className="absolute inset-0 w-full h-full overflow-visible" preserveAspectRatio="none">
                        <path d="M0 80 Q 50 60, 100 90 T 200 70 T 300 85 T 400 40" fill="none" stroke="#e4e4e7" strokeWidth="2" strokeDasharray="4 4"/>
                        {/* Animated Path based on stats */}
                        <motion.path 
                            d="M0 90 Q 50 70, 100 110 T 200 60 T 300 75 T 400 30" 
                            fill="none" 
                            stroke="#ea580c" 
                            strokeWidth="3" 
                            className="drop-shadow-lg"
                            animate={{ d: isEmergencyMode ? "M0 90 Q 50 80, 100 120 T 200 90 T 300 100 T 400 60" : "M0 90 Q 50 70, 100 110 T 200 60 T 300 75 T 400 30" }}
                            transition={{ duration: 1 }}
                        />
                    </svg>
                    <div className="absolute bottom-0 left-0 w-full flex justify-between text-[10px] text-zinc-400 font-mono uppercase tracking-wider mt-2 pt-2">
                        <span>06:00</span><span>09:00</span><span>12:00</span><span>15:00</span><span>18:00</span><span>21:00</span>
                    </div>
                </div>
            </div>
        </section>

    </PageLayout>
  );
}