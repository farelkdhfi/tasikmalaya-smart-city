import React, { useState, useEffect, useRef } from 'react';
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
  Maximize2,
  RefreshCw
} from 'lucide-react';

import PageLayout from '../../components/PageLayout'; 

// --- HELPER: Randomizer & Generators ---
const getRandomInt = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;

const generateIncident = () => {
    const types = ['Vehicle Stall', 'Minor Collision', 'Traffic Light Error', 'Pothole Reported', 'Construction Work'];
    const locs = ['JL. RE Martadinata', 'Simpang Lima', 'Dadaha Junction', 'Lingkar Gentong', 'Pasar Wetan'];
    return `${types[getRandomInt(0, 4)]} at ${locs[getRandomInt(0, 4)]}`;
};

// --- SUB-COMPONENTS ---

const SectionHeader = ({ title, subtitle, rightElement }) => (
    // RESPONSIVE: Stack vertical on mobile, row on desktop (md)
    <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-6 px-2 border-b border-zinc-200/60 pb-4 gap-4 md:gap-0">
        <div>
            <span className="text-xs font-semibold text-orange-600 uppercase tracking-wider mb-1 block">{subtitle}</span>
            <h2 className="text-xl md:text-2xl font-semibold text-zinc-900 tracking-tight">{title}</h2>
        </div>
        <div className="w-full md:w-auto">
            {rightElement}
        </div>
    </div>
);

const TrendBadge = ({ value }) => {
    const isBad = value > 0; 
    return (
        <div className={`flex items-center gap-1 text-[10px] md:text-xs font-medium px-2 py-1 rounded-full ${
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
        // RESPONSIVE: Adjust padding and height for mobile
        className="bg-white rounded-3xl p-4 md:p-5 h-40 md:h-48 flex flex-col justify-between shadow-sm hover:shadow-xl hover:shadow-orange-500/5 border border-zinc-100 transition-all duration-300 group cursor-pointer relative overflow-hidden"
    >
        <div className="flex justify-between items-start z-10">
            <div className={`w-8 h-8 md:w-10 md:h-10 rounded-2xl flex items-center justify-center transition-colors duration-300 ${item.status === 'Critical' ? 'bg-red-50 text-red-600' : 'bg-zinc-50 text-zinc-900 group-hover:bg-orange-600 group-hover:text-white'}`}>
                <item.icon size={18} className="md:w-5 md:h-5" />
            </div>
            <div className="w-6 h-6 md:w-7 md:h-7 rounded-full bg-zinc-100 flex items-center justify-center text-zinc-400 group-hover:text-orange-600 transition-colors">
                <ArrowUpRight size={12} className="md:w-[14px]" />
            </div>
        </div>
        <div className="z-10 mt-auto">
            <div className="flex justify-between items-end mb-1">
                {/* RESPONSIVE: Smaller text on mobile */}
                <h3 className="text-2xl md:text-3xl font-bold text-zinc-900 tracking-tight leading-none group-hover:text-orange-600 transition-colors">
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

// --- MODAL CCTV ---
const CCTVModal = ({ camId, onClose }) => {
    const [detection, setDetection] = useState("Scanning...");
    
    useEffect(() => {
        const interval = setInterval(() => {
            const objects = ['Sedan', 'Truck', 'Motorcycle', 'Pedestrian', 'Bus'];
            const conf = getRandomInt(85, 99);
            setDetection(`ID: ${objects[getRandomInt(0, 4)]} (${conf}%)`);
        }, 1500);
        return () => clearInterval(interval);
    }, []);

    return (
        <motion.div 
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-zinc-900/60 backdrop-blur-sm p-4"
        >
            <motion.div 
                initial={{ scale: 0.9 }} animate={{ scale: 1 }}
                // RESPONSIVE: Ensure modal fits on mobile width
                className="bg-zinc-900 border border-zinc-700 w-[95%] md:w-full max-w-2xl rounded-3xl overflow-hidden shadow-2xl"
            >
                <div className="p-4 border-b border-zinc-800 flex justify-between items-center">
                    <div className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
                        <span className="text-white font-mono text-xs md:text-sm tracking-wider">LIVE FEED: {camId}</span>
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
                     
                     <div className="absolute bottom-4 left-4 text-[10px] md:text-xs font-mono text-green-500">
                         BITRATE: {getRandomInt(4000, 5000)}kbps <br/> FPS: 60
                     </div>
                     <div className="absolute top-4 right-4 bg-zinc-800/80 px-2 py-1 rounded text-[10px] text-white flex flex-col items-end">
                         <span>AI RECOGNITION ACTIVE</span>
                         <span className="text-orange-400">{detection}</span>
                     </div>
                </div>
            </motion.div>
        </motion.div>
    );
};

// --- MAIN COMPONENT ---

export default function MobilityDashboard() {
  // STATE MANAGEMENT
  const [currentTime, setCurrentTime] = useState(new Date());
  
  // Dashboard Core Metrics
  const [stats, setStats] = useState([
    { id: 1, label: 'Congestion', sub: 'City Index', value: 68, trend: 1.2, status: 'High', color: 'text-orange-600', icon: Car, unit: '%' },
    { id: 2, label: 'Avg Speed', sub: 'Km per Hour', value: 24, trend: -0.4, status: 'Slow', color: 'text-zinc-600', icon: Clock, unit: '' },
    { id: 3, label: 'Incidents', sub: 'Active Reports', value: 3, trend: 0, status: 'Critical', color: 'text-red-600', icon: AlertTriangle, unit: '' },
    { id: 4, label: 'Signal eff.', sub: 'Green Wave', value: 94, trend: 0.5, status: 'Optimal', color: 'text-emerald-600', icon: Zap, unit: '%' },
  ]);
  
  const [buses, setBuses] = useState([
    { id: '01', name: 'Dadaha Loop', status: 'On Time', load: 45, next: 120, code: 'R-01' }, 
    { id: '02', name: 'Indihiang Exp', status: 'Delayed', load: 82, next: 720, code: 'R-02' },
    { id: '03', name: 'Kawalu Conn.', status: 'On Time', load: 20, next: 300, code: 'R-03' },
  ]);

  const [aiSuggestions, setAiSuggestions] = useState([
    { id: 1, type: 'Signal', title: 'Extend Green Light', desc: '+15s at Hz. Mustofa Intersection to clear southbound backlog.', impact: 'High' },
    { id: 2, type: 'Route', title: 'Divert Heavy Vehicles', desc: 'Reroute trucks via Lingkar Gentong due to stall.', impact: 'Med' },
  ]);

  // Interactive UI State
  const [activeLayer, setActiveLayer] = useState('Density');
  const [selectedCam, setSelectedCam] = useState(null);
  const [isEmergencyMode, setIsEmergencyMode] = useState(false);
  const [isRaining, setIsRaining] = useState(false); // Default false to show toggle effect
  const [manualOverride, setManualOverride] = useState(false);
  const [incidents, setIncidents] = useState(['Accident at JL. RE Martadinata', 'Signal Fail at Simpang Lima']);
  
  // Chart Data State (Simulated History)
  const [historyData, setHistoryData] = useState([50, 55, 60, 58, 65, 70, 68]);

  // --- SIMULATION ENGINE ---
  useEffect(() => {
    const interval = setInterval(() => {
        // 1. Update Time
        setCurrentTime(new Date());

        // 2. Simulate Stats Logic
        setStats(prev => prev.map(stat => {
            let change = (Math.random() - 0.5) * 1.5; // Base fluctuation
            let newVal = stat.value;

            // -- Logic: RAIN EFFECT --
            if (isRaining) {
                if (stat.label === 'Avg Speed') change -= 0.8; // Speed drops
                if (stat.label === 'Congestion') change += 0.8; // Congestion rises
            } else {
                // Recovery when not raining
                if (stat.label === 'Avg Speed' && stat.value < 40) change += 0.5;
                if (stat.label === 'Congestion' && stat.value > 30) change -= 0.5;
            }

            // -- Logic: EMERGENCY MODE --
            if (isEmergencyMode) {
                if (stat.label === 'Congestion') change -= 1.5; // Clearing traffic aggressively
                if (stat.label === 'Signal eff.') newVal = 100; // Locked at max
            }

            // -- Logic: MANUAL OVERRIDE --
            if (manualOverride && stat.label === 'Signal eff.') {
                newVal = 100; // Locked manually
            }

            // Apply value changes
            if (!isEmergencyMode && !manualOverride || stat.label !== 'Signal eff.') {
                newVal += change;
            }

            // Clamping
            newVal = Math.max(0, Math.min(stat.unit === '%' ? 100 : 120, newVal));

            return {
                ...stat,
                value: Math.round(newVal * 10) / 10, // 1 decimal place
                trend: stat.trend + (Math.random() - 0.5) * 0.2
            };
        }));

        // 3. Update Chart History (Push new congestion value)
        setHistoryData(prev => {
            const currentCongestion = stats.find(s => s.label === 'Congestion').value;
            const newData = [...prev.slice(1), currentCongestion];
            return newData;
        });

        // 4. Simulate Bus Movement
        setBuses(prev => prev.map(bus => {
            let nextTime = bus.next - 2; // Tick down faster
            let status = bus.status;
            let load = bus.load;
            
            // Random passenger load change
            if (Math.random() > 0.7) load += getRandomInt(-3, 5);

            if (nextTime <= 0) {
                nextTime = getRandomInt(600, 1200); // Reset schedule loop
                status = 'Arriving';
                load = getRandomInt(10, 30); // Reset load
            } else if (nextTime < 60) {
                status = 'Docking';
            } else {
                status = bus.next > 900 ? 'Delayed' : 'On Time';
            }

            return { 
                ...bus, 
                next: nextTime, 
                status, 
                load: Math.min(100, Math.max(0, load)) 
            };
        }));

        // 5. Incident Generator (Rare event)
        if (Math.random() > 0.95) {
            const currentCongestion = stats.find(s => s.label === 'Congestion').value;
            if (currentCongestion > 80 && incidents.length < 5) {
                setIncidents(prev => [...prev, generateIncident()]);
                // Update incident count metric
                 setStats(prev => prev.map(s => s.label === 'Incidents' ? {...s, value: s.value + 1} : s));
            } else if (currentCongestion < 60 && incidents.length > 1) {
                setIncidents(prev => prev.slice(1)); // Clear solved incidents
                 setStats(prev => prev.map(s => s.label === 'Incidents' ? {...s, value: Math.max(0, s.value - 1)} : s));
            }
        }

    }, 1000); // Tick every 1s for responsiveness

    return () => clearInterval(interval);
  }, [isRaining, isEmergencyMode, manualOverride, incidents.length, stats]);

  // --- ACTIONS ---

  const formatTime = (seconds) => {
      const m = Math.floor(seconds / 60);
      return m < 1 ? '< 1 min' : `${m} min`;
  };

  const handleApplyAI = (id) => {
      setAiSuggestions(prev => prev.filter(item => item.id !== id));
      // Logic: Improve stats instantly
      setStats(prev => prev.map(s => {
        if (s.label === 'Congestion') return {...s, value: s.value - 8, trend: -5};
        if (s.label === 'Signal eff.') return {...s, value: Math.min(100, s.value + 5), trend: 2};
        return s;
      }));
  };

  const handleManualOverride = () => {
      setManualOverride(!manualOverride);
  };

  const handleRefreshBuses = () => {
      // Simulator reset
      setBuses(prev => prev.map(b => ({...b, status: 'Syncing...', next: getRandomInt(60, 300)})));
  };

  // --- DYNAMIC CHART PATH GENERATOR ---
  const generateChartPath = (data, isEmergency) => {
      // Map data values (0-100) to SVG coordinate space (0-100 height)
      // Height is inverted (0 is top)
      const points = data.map((val, i) => {
          const x = i * (400 / (data.length - 1));
          const y = 140 - (val * 1.2); // Scaling to fit container
          return `${x} ${y}`;
      });
      
      // Construct smooth curve
      let d = `M ${points[0]}`;
      for (let i = 1; i < points.length; i++) {
          const [x, y] = points[i].split(' ');
          const [prevX, prevY] = points[i-1].split(' ');
          // Simple smoothing using cubic bezier control points
          const cp1x = parseFloat(prevX) + (parseFloat(x) - parseFloat(prevX)) / 2;
          const cp1y = prevY;
          const cp2x = parseFloat(prevX) + (parseFloat(x) - parseFloat(prevX)) / 2;
          const cp2y = y;
          d += ` C ${cp1x} ${cp1y}, ${cp2x} ${cp2y}, ${x} ${y}`;
      }
      return d;
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
        <section className="mb-6 md:mb-8">
            <SectionHeader 
                title="System Overview" 
                subtitle="Metrics" 
                rightElement={
                    // FEATURE 1: WEATHER WIDGET
                    <div className="flex items-center justify-between md:justify-start gap-4 bg-white px-4 py-2 rounded-2xl border border-zinc-200 shadow-sm transition-all duration-300 w-full md:w-auto">
                        <div 
                            className={`flex items-center gap-2 cursor-pointer select-none transition-colors duration-300 ${isRaining ? 'text-blue-600' : 'text-orange-500'}`}
                            onClick={() => setIsRaining(!isRaining)}
                            title="Click to toggle Weather Simulation"
                        >
                            <motion.div
                                key={isRaining ? "rain" : "sun"}
                                initial={{ scale: 0.5, opacity: 0 }}
                                animate={{ scale: 1, opacity: 1 }}
                            >
                                {isRaining ? <CloudRain size={18} /> : <Zap size={18} />}
                            </motion.div>
                            <div className="text-right">
                                <p className="text-xs font-bold text-zinc-900">{isRaining ? 'Rainy' : 'Clear'}</p>
                                <p className="text-[10px] text-zinc-400">
                                    {isRaining ? '21°C • Hum 92%' : '28°C • Hum 45%'}
                                </p>
                            </div>
                        </div>
                        <div className="w-px h-6 bg-zinc-100"></div>
                        <div className="text-zinc-400 text-xs font-mono">{currentTime.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit', second:'2-digit'})}</div>
                    </div>
                }
            />
            {/* RESPONSIVE: Grid cols 2 on mobile, 4 on tablet/desktop */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
                {stats.map((stat) => (
                    <MetricCard key={stat.id} item={{...stat, value: `${Math.round(stat.value)}${stat.unit}`}} />
                ))}
            </div>
        </section>

        {/* --- BENTO GRID LAYOUT --- */}
        <section className="grid grid-cols-1 lg:grid-cols-12 gap-4 md:gap-6 min-h-[600px]">
            
            {/* LEFT: INTERACTIVE MAP (8 Cols Desktop, Full on Mobile) */}
            <div className="lg:col-span-8 flex flex-col gap-6">
                
                <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    // RESPONSIVE: Smaller height on mobile (400px)
                    className="bg-white rounded-[2rem] md:rounded-[2.5rem] shadow-sm border border-zinc-200 relative overflow-hidden h-full min-h-[400px] md:min-h-[500px] group flex flex-col"
                >
                    {/* Map Container */}
                    <div className="absolute inset-0 bg-zinc-100 flex-grow">
                         {/* Grid Pattern */}
                        <div className="absolute inset-0 opacity-[0.07] bg-[linear-gradient(to_right,#000000_1px,transparent_1px),linear-gradient(to_bottom,#000000_1px,transparent_1px)] bg-[size:32px_32px]"></div>
                        
                        {/* FEATURE 3: DYNAMIC ROAD STYLES BASED ON EMERGENCY MODE */}
                        {/* Main Road Horizontal */}
                        <div className="absolute top-1/2 left-0 w-full h-4 bg-zinc-200 transition-colors duration-500"></div>
                        <motion.div 
                            animate={{ 
                                width: isEmergencyMode ? '100%' : '100%',
                                backgroundColor: isEmergencyMode ? '#10b981' : '#fb923c',
                                opacity: isEmergencyMode ? 1 : 0.8
                            }}
                            className="absolute top-1/2 left-0 h-4 shadow-lg transition-all duration-1000"
                        >
                            {/* Moving Traffic Dots Animation inside the road */}
                            <div className="w-full h-full overflow-hidden relative">
                                <motion.div 
                                    className="absolute top-0 bottom-0 w-full bg-[repeating-linear-gradient(90deg,transparent,transparent_20px,rgba(255,255,255,0.4)_20px,rgba(255,255,255,0.4)_40px)]"
                                    animate={{ x: [-40, 0] }}
                                    transition={{ repeat: Infinity, duration: isEmergencyMode ? 0.2 : 1, ease: "linear" }}
                                />
                            </div>
                        </motion.div>
                        
                        {/* Vertical Roads */}
                        <div className="absolute top-0 left-1/3 w-4 h-full bg-zinc-200"></div>
                        {/* Heatmap overlay on vertical road only if Density Layer is active */}
                        <div className={`absolute top-0 left-1/3 w-4 h-full bg-orange-400/50 transition-opacity duration-500 ${activeLayer === 'Density' ? 'opacity-100' : 'opacity-0'}`}></div>
                        
                        <div className="absolute top-0 right-1/4 w-4 h-full bg-zinc-200"></div>
                        <div className={`absolute top-0 right-1/4 w-4 h-full bg-orange-400/30 transition-opacity duration-500 ${activeLayer === 'Density' ? 'opacity-100' : 'opacity-0'}`}></div>
                        
                        {/* Pulsing Hotspots (Only visible in Density Layer) */}
                        <AnimatePresence>
                            {activeLayer === 'Density' && (
                                <>
                                    <motion.div initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}} className="absolute top-[48%] left-[65%] w-32 h-32 bg-orange-500/30 rounded-full blur-3xl animate-pulse"></motion.div>
                                    <motion.div initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}} className="absolute top-[20%] left-[30%] w-24 h-24 bg-red-500/20 rounded-full blur-3xl animate-pulse"></motion.div>
                                </>
                            )}
                        </AnimatePresence>
                        
                        {/* Public Transport Layer Dots */}
                        <AnimatePresence>
                            {activeLayer === 'Public' && (
                                <>
                                    <motion.div 
                                        animate={{ y: [0, 400] }} 
                                        transition={{ repeat: Infinity, duration: 8, ease: "linear" }}
                                        className="absolute top-0 left-[34%] w-3 h-3 bg-blue-500 rounded-full border-2 border-white z-10 shadow-sm"
                                    />
                                    <motion.div 
                                        animate={{ x: [0, 600] }} 
                                        transition={{ repeat: Infinity, duration: 12, ease: "linear" }}
                                        className="absolute top-[51%] left-0 w-3 h-3 bg-blue-500 rounded-full border-2 border-white z-10 shadow-sm"
                                    />
                                </>
                            )}
                        </AnimatePresence>
                    </div>

                    {/* Controls Overlay */}
                    <div className="absolute top-4 left-4 md:top-6 md:left-6 z-20 flex flex-col gap-2">
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
                         
                         {/* FEATURE 3 CONTROLLER: Emergency Mode */}
                         <button 
                            onClick={() => setIsEmergencyMode(!isEmergencyMode)}
                            className={`flex items-center gap-2 px-3 py-2 rounded-xl text-[10px] font-bold uppercase border transition-all shadow-sm ${
                                isEmergencyMode ? 'bg-emerald-500 border-emerald-600 text-white animate-pulse' : 'bg-white border-zinc-200 text-zinc-500 hover:text-emerald-600'
                            }`}
                         >
                            <Siren size={14} /> {isEmergencyMode ? 'VIP ON' : 'VIP Off'}
                         </button>
                    </div>

                    {/* Camera Markers (Interactive - Only Show in CCTV Layer) */}
                    <AnimatePresence>
                    {(activeLayer === 'CCTV' || activeLayer === 'Density') && [
                        { x: '33%', y: '50%', id: 'CAM-01' }, 
                        { x: '70%', y: '49%', id: 'CAM-02', alert: true }, 
                        { x: '45%', y: '20%', id: 'CAM-03' }
                      ].map((pos, i) => (
                          <motion.div 
                           key={i}
                           initial={{ scale: 0 }}
                           animate={{ scale: 1 }}
                           exit={{ scale: 0 }}
                           whileHover={{ scale: 1.2 }}
                           onClick={() => setSelectedCam(pos.id)}
                           className="absolute cursor-pointer z-20 group/cam"
                           style={{ left: pos.x, top: pos.y }}
                          >
                            <div className={`w-8 h-8 rounded-full flex items-center justify-center shadow-lg border-2 border-white transition-colors ${pos.alert && incidents.length > 0 ? 'bg-red-500 animate-pulse' : 'bg-zinc-900'}`}>
                                <Video size={12} className="text-white" />
                            </div>
                            <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-3 py-2 bg-zinc-900 text-white text-[10px] rounded-lg opacity-0 group-hover/cam:opacity-100 transition-opacity whitespace-nowrap pointer-events-none hidden md:block">
                                <span className="font-bold">{pos.id}</span> • Click to View
                            </div>
                          </motion.div>
                    ))}
                    </AnimatePresence>

                    {/* FEATURE 5: LIVE INCIDENT TICKER */}
                    <div className="absolute bottom-0 left-0 w-full bg-zinc-900 text-white py-2 overflow-hidden z-30">
                        <div className="flex items-center gap-4 px-4">
                            <div className="flex items-center gap-1 text-[10px] font-bold uppercase text-red-400 shrink-0">
                                <Radio size={12} className="animate-pulse"/> Live ({incidents.length}):
                            </div>
                            {/* Simple CSS Marquee simulated via text content */}
                            <div className="whitespace-nowrap flex gap-8 animate-marquee text-xs font-mono text-zinc-300 w-full overflow-hidden">
                                <motion.div 
                                    animate={{ x: ["100%", "-100%"] }} 
                                    transition={{ repeat: Infinity, duration: 20, ease: "linear" }}
                                    className="flex gap-8"
                                >
                                    {incidents.map((inc, i) => (
                                        <span key={i} className="flex items-center gap-2"><AlertTriangle size={10} className="text-yellow-400"/> {inc}</span>
                                    ))}
                                    {isRaining && <span className="flex items-center gap-2 text-blue-300"><CloudRain size={10}/> Low Visibility Reported</span>}
                                    {isEmergencyMode && <span className="flex items-center gap-2 text-emerald-400"><Siren size={10}/> VIP Protocol Active - Corridors Clearing</span>}
                                </motion.div>
                            </div>
                        </div>
                    </div>

                </motion.div>
            </div>

            {/* RIGHT: SIDEBAR (4 Cols Desktop, Full on Mobile) */}
            <div className="lg:col-span-4 flex flex-col gap-6">
                
                {/* 1. AI Suggestion Card */}
                <div className="bg-gradient-to-br from-orange-50 to-white border border-orange-100 rounded-[2rem] p-6 shadow-sm relative overflow-hidden flex flex-col">
                    <div className="flex flex-wrap items-center justify-between mb-4 relative z-10 gap-2">
                        <div className="flex items-center gap-2">
                            <div className="p-2 bg-orange-100 rounded-lg text-orange-600">
                                <Zap size={16} />
                            </div>
                            <h3 className="font-bold text-zinc-900">AI Actions</h3>
                        </div>
                        {/* FEATURE 4: SIGNAL OVERRIDE BUTTON */}
                        <button 
                            onClick={handleManualOverride}
                            className={`text-[10px] font-bold border px-2 py-1 rounded transition-colors ${
                                manualOverride 
                                ? 'bg-orange-600 text-white border-orange-600' 
                                : 'bg-white border-zinc-200 text-zinc-500 hover:text-orange-600 hover:border-orange-200'
                            }`}
                        >
                            {manualOverride ? 'Override Active' : 'Manual Override'}
                        </button>
                    </div>

                    <div className="space-y-3 relative z-10">
                         <AnimatePresence>
                         {aiSuggestions.map((ai) => (
                            <motion.div 
                                key={ai.id}
                                layout
                                exit={{ opacity: 0, height: 0, marginBottom: 0, scale: 0.9 }}
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
                             <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-8 text-xs text-zinc-400 border border-dashed border-zinc-200 rounded-2xl">
                                 <div className="mb-2"><Activity size={20} className="mx-auto opacity-50"/></div>
                                 All systems optimized. <br/> No critical actions required.
                             </motion.div>
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
                        <div onClick={handleRefreshBuses} title="Sync Schedule">
                             <RefreshCw size={16} className="text-zinc-300 hover:text-orange-500 cursor-pointer transition-colors" />
                        </div>
                    </div>

                    <div className="space-y-6">
                        {buses.map((bus) => (
                            <div key={bus.id} className="group">
                                <div className="flex justify-between items-center mb-1">
                                    <div>
                                        <span className="text-xs font-bold text-zinc-400 mr-2">{bus.code}</span>
                                        <span className="text-sm font-semibold text-zinc-800">{bus.name}</span>
                                    </div>
                                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full transition-colors duration-500 ${
                                        bus.status === 'On Time' ? 'bg-zinc-100 text-zinc-600' : 
                                        bus.status === 'Delayed' ? 'bg-red-50 text-red-600' : 
                                        bus.status === 'Docking' ? 'bg-blue-50 text-blue-600' : 'bg-emerald-50 text-emerald-600'
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
                                        animate={{ width: `${bus.load}%` }}
                                    ></motion.div>
                                </div>
                            </div>
                        ))}
                    </div>
                    
                    {/* Alert Box */}
                    {buses.some(b => b.status === 'Delayed') && (
                        <div className="mt-6 p-4 bg-orange-50 rounded-2xl border border-orange-100 flex gap-3 animate-pulse">
                             <div className="shrink-0 text-orange-600">
                                 <AlertTriangle size={18} />
                             </div>
                             <div>
                                 <p className="text-xs font-bold text-zinc-800">Delays Detected</p>
                                 <p className="text-[10px] text-zinc-500 mt-0.5">Heavy traffic affecting R-02 route via North Blvd.</p>
                             </div>
                        </div>
                    )}
                </div>

            </div>
        </section>

        {/* --- BOTTOM: CHART SECTION --- */}
        <section className="mt-6">
            <div className="bg-white rounded-[2rem] border border-zinc-200 p-4 md:p-8 shadow-sm">
                <div className="flex flex-col md:flex-row md:items-end justify-between mb-4 gap-2 md:gap-0">
                    <div>
                        <h3 className="text-lg font-bold text-zinc-900 tracking-tight">Traffic Density Trends</h3>
                        <p className="text-xs text-zinc-500 uppercase tracking-wide">Real-time Analysis • 1s Interval</p>
                    </div>
                    <div className="flex gap-2">
                        <div className="flex items-center gap-1 text-[10px] text-zinc-400 uppercase">
                             <div className="w-2 h-2 rounded-full bg-orange-500"></div> Current
                        </div>
                        <div className="flex items-center gap-1 text-[10px] text-zinc-400 uppercase">
                             <div className="w-2 h-2 rounded-full bg-zinc-200"></div> Avg
                        </div>
                    </div>
                </div>
                {/* Visual Chart Placeholder - NOW FUNCTIONAL */}
                <div className="relative h-32 md:h-40 w-full mt-4">
                    <div className="absolute inset-0 grid grid-cols-6 grid-rows-4 gap-4 opacity-30">
                         {[...Array(5)].map((_, i) => <div key={i} className="border-t border-zinc-200 w-full absolute" style={{top: `${i*25}%`}}></div>)}
                    </div>
                    <svg className="absolute inset-0 w-full h-full overflow-visible" preserveAspectRatio="none" viewBox="0 0 400 140">
                        {/* Static Average Line */}
                        <path d="M0 80 Q 50 60, 100 90 T 200 70 T 300 85 T 400 40" fill="none" stroke="#e4e4e7" strokeWidth="2" strokeDasharray="4 4"/>
                        {/* Dynamic Real-time Line */}
                        <motion.path 
                            d={generateChartPath(historyData)}
                            fill="none" 
                            stroke={isEmergencyMode ? "#10b981" : "#ea580c"}
                            strokeWidth="3" 
                            className="drop-shadow-lg"
                            animate={{ d: generateChartPath(historyData) }}
                            transition={{ duration: 0.5, ease: "linear" }}
                        />
                        {/* Area Fill (Gradient) */}
                        <linearGradient id="chartGrad" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="0%" stopColor={isEmergencyMode ? "#10b981" : "#ea580c"} stopOpacity="0.2"/>
                            <stop offset="100%" stopColor={isEmergencyMode ? "#10b981" : "#ea580c"} stopOpacity="0"/>
                        </linearGradient>
                        <motion.path 
                             d={`${generateChartPath(historyData)} L 400 140 L 0 140 Z`}
                             fill="url(#chartGrad)"
                             stroke="none"
                             transition={{ duration: 0.5, ease: "linear" }}
                        />
                    </svg>
                    <div className="absolute bottom-0 left-0 w-full flex justify-between text-[10px] text-zinc-400 font-mono uppercase tracking-wider mt-2 pt-2">
                        <span>T-60s</span><span className="hidden md:inline">T-50s</span><span>T-40s</span><span className="hidden md:inline">T-30s</span><span>T-20s</span><span className="hidden md:inline">T-10s</span><span>NOW</span>
                    </div>
                </div>
            </div>
        </section>

    </PageLayout>
  );
}