import React, { useState, useEffect, useCallback } from 'react';
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
  AlertTriangle,
  CheckCircle2
} from 'lucide-react';

// IMPORT PageLayout (Asumsikan sudah ada sesuai instruksi)
import PageLayout from '../../components/PageLayout'; 

// --- UTILS & CONSTANTS ---

const DISTRICT_NAMES = ['Cihideung', 'Tawang', 'Cipedes', 'Indihiang', 'Kawalu'];

// Mapping KPI ID to Log Types for filtering
const KPI_CATEGORY_MAP = {
  1: ['info', 'warning', 'success', 'critical'], // Population (All)
  2: ['warning', 'critical'], // Traffic
  3: ['warning', 'success'], // Air Quality
  4: ['info'], // Transport
  5: ['critical', 'warning'], // Emergency
  6: ['success', 'warning'] // Energy
};

const generateTime = () => {
  const now = new Date();
  return now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
};

// --- SUB-COMPONENTS ---

const SectionHeader = ({ title, subtitle, action }) => (
  // RESPONSIVE: Mengubah layout menjadi flex-col di mobile dan flex-row di desktop (md)
  <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-6 px-2 border-b border-zinc-200/60 pb-4 gap-4 md:gap-0">
    <div>
      <span className="text-xs font-semibold text-blue-600 uppercase tracking-wider mb-1 block">{subtitle}</span>
      {/* RESPONSIVE: Font size adjustments */}
      <h2 className="text-xl md:text-2xl font-semibold text-zinc-900 tracking-tight">{title}</h2>
    </div>
    {/* RESPONSIVE: Menampilkan action di mobile dengan margin atas, sebelumnya hidden */}
    {action && <div className="w-full md:w-auto flex justify-end">{action}</div>}
  </div>
);

const TrendBadge = ({ value }) => {
  const isPositive = value > 0;
  return (
    <div className={`flex items-center gap-1 text-[10px] md:text-xs font-medium px-2 py-1 rounded-full ${
      isPositive ? 'bg-zinc-100 text-zinc-600' : 'bg-green-50 text-green-700'
    }`}>
      {isPositive ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
      {Math.abs(value).toFixed(1)}%
    </div>
  );
};

const MetricCard = ({ item, isSelected, onClick }) => (
  <motion.div
    layout
    onClick={() => onClick(item.id)}
    initial={{ opacity: 0, scale: 0.9 }}
    animate={{ 
      opacity: 1, 
      scale: 1,
      ring: isSelected ? 2 : 0,
      borderColor: isSelected ? '#2563eb' : '#f4f4f5'
    }}
    whileHover={{ y: -4, scale: 1.02 }}
    whileTap={{ scale: 0.98 }}
    // RESPONSIVE: Tinggi card sedikit lebih kecil di mobile jika perlu, tapi h-48 biasanya oke
    className={`bg-white rounded-3xl p-4 md:p-5 h-44 md:h-48 flex flex-col justify-between shadow-sm hover:shadow-xl hover:shadow-blue-500/5 border transition-all duration-300 group cursor-pointer relative overflow-hidden ${isSelected ? 'ring-2 ring-blue-500 ring-offset-2' : 'border-zinc-100'}`}
  >
    <div className="flex justify-between items-start z-10">
      <div className={`w-8 h-8 md:w-10 md:h-10 rounded-2xl flex items-center justify-center transition-colors duration-300 ${isSelected ? 'bg-blue-600 text-white' : 'bg-zinc-50 text-zinc-900 group-hover:bg-blue-600 group-hover:text-white'}`}>
        <item.icon size={18} className="md:w-5 md:h-5" />
      </div>
      <div className={`w-6 h-6 md:w-7 md:h-7 rounded-full flex items-center justify-center transition-colors ${isSelected ? 'bg-blue-100 text-blue-600' : 'bg-zinc-100 text-zinc-400 group-hover:text-blue-600'}`}>
        <ArrowUpRight size={12} className="md:w-[14px] md:h-[14px]" />
      </div>
    </div>
    <div className="z-10 mt-auto">
      <div className="flex justify-between items-end mb-1">
        {/* RESPONSIVE: Font size dynamic */}
        <h3 className={`text-2xl md:text-3xl font-bold tracking-tight leading-none transition-colors ${isSelected ? 'text-blue-600' : 'text-zinc-900 group-hover:text-blue-600'}`}>
          {item.value}
        </h3>
        <TrendBadge value={item.trend} />
      </div>
      <p className="text-[10px] md:text-xs text-zinc-500 font-medium uppercase tracking-wide truncate">{item.subtitle}</p>
    </div>
    <div className="absolute -right-4 -bottom-4 opacity-0 group-hover:opacity-5 transition-opacity duration-500 pointer-events-none">
      <item.icon size={80} className="md:w-[100px] md:h-[100px]" />
    </div>
  </motion.div>
);

const ActivityRow = ({ log, isLast, onResolve }) => (
  <motion.div 
    layout
    initial={{ opacity: 0, x: -20, backgroundColor: "#ffffff" }}
    animate={{ opacity: 1, x: 0, backgroundColor: log.isNew ? "#eff6ff" : "#ffffff" }}
    exit={{ opacity: 0, x: 20 }}
    whileHover={{ backgroundColor: "rgba(250, 250, 250, 1)" }}
    className={`flex items-start md:items-center p-3 md:p-4 transition-colors duration-500 cursor-pointer group ${!isLast ? 'border-b border-zinc-100' : ''}`}
  >
    <div className="w-14 md:w-16 shrink-0 flex flex-col items-center justify-center gap-1 mr-3 md:mr-4 pt-1 md:pt-0">
      <span className="text-[10px] font-bold text-zinc-400 whitespace-nowrap">{log.time}</span>
      <div className={`w-2 h-2 rounded-full ${
        log.type === 'warning' ? 'bg-orange-400' : 
        log.type === 'critical' ? 'bg-red-500 animate-pulse' : 
        log.type === 'success' ? 'bg-green-500' : 'bg-blue-500'
      }`}></div>
    </div>
    <div className="flex-grow min-w-0">
      <h4 className="text-sm font-semibold text-zinc-900 group-hover:text-blue-600 transition-colors truncate">{log.title}</h4>
      <p className="text-xs text-zinc-500 mt-0.5 line-clamp-2 md:line-clamp-1">{log.desc}</p>
    </div>
    <div className="text-zinc-300 group-hover:text-blue-600 group-hover:translate-x-1 transition-all pl-2 shrink-0">
      {(log.type === 'critical' || log.type === 'warning') ? (
       <button 
          onClick={(e) => { e.stopPropagation(); onResolve(log.id, log.districtName); }}
          className="text-[10px] font-bold uppercase border border-zinc-200 px-2 py-1 md:px-3 md:py-1.5 rounded bg-white text-zinc-500 hover:bg-blue-50 hover:border-blue-200 hover:text-blue-600 transition-all shadow-sm active:scale-95"
       >
         Action
       </button>
      ) : (
       <ChevronRight size={16} />
      )}
    </div>
  </motion.div>
);

// --- MODAL COMPONENT ---
const DistrictDetailModal = ({ district, onClose, onReportIncident }) => {
  const [isReporting, setIsReporting] = useState(false);
  const [reportSuccess, setReportSuccess] = useState(false);

  const trafficRate = React.useMemo(() => Math.floor(Math.random() * 40) + 20, []);
  const safetyIndex = React.useMemo(() => district.status === 'High Density' ? 45 : 98, [district.status]);

  const handleReportClick = () => {
    setIsReporting(true);
    setTimeout(() => {
        onReportIncident(district.name);
        setIsReporting(false);
        setReportSuccess(true);
        setTimeout(onClose, 1500);
    }, 800);
  };

  if (!district) return null;

  return (
    <motion.div 
      initial={{ opacity: 0 }} 
      animate={{ opacity: 1 }} 
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-zinc-900/60 backdrop-blur-sm p-4"
      onClick={onClose}
    >
      <motion.div 
        initial={{ scale: 0.9, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.9, y: 20 }}
        // RESPONSIVE: Width adjustment w-[95%] for mobile, max-w-md for desktop
        className="bg-white rounded-3xl w-[95%] md:w-full max-w-md shadow-2xl border border-white/50 overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="h-32 md:h-40 bg-zinc-900 relative flex items-center justify-center overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-blue-900/40 via-zinc-900 to-zinc-900"></div>
          <div className="absolute inset-0 opacity-20 bg-[url('https://grainy-gradients.vercel.app/noise.svg')]"></div>
          
          <div className="z-10 flex flex-col items-center">
            <Video className="text-white/80 mb-2 animate-pulse" size={28} />
            <span className="text-[10px] md:text-xs font-mono text-green-400 bg-green-900/30 px-2 py-0.5 rounded border border-green-500/30">● LIVE FEED - CAM {Math.floor(Math.random() * 99)}</span>
          </div>
          <button onClick={onClose} className="absolute top-4 right-4 text-white/70 hover:text-white bg-black/20 hover:bg-black/40 p-2 rounded-full transition-all">
            <X size={18} />
          </button>
        </div>
        <div className="p-5 md:p-6">
          <div className="flex justify-between items-start mb-4">
            <div>
              <h3 className="text-xl md:text-2xl font-bold text-zinc-900">{district.name}</h3>
              <p className="text-xs md:text-sm text-zinc-500">District ID: #{district.id}</p>
            </div>
            <span className={`px-2 py-1 md:px-3 md:py-1 rounded-full text-[10px] md:text-xs font-bold transition-colors duration-300 ${
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
                <span className="text-xs md:text-sm font-medium text-zinc-700">Traffic Flow</span>
              </div>
              <span className="text-xs md:text-sm font-bold text-zinc-900">{trafficRate} cars/min</span>
            </div>
            <div className="flex justify-between items-center p-3 bg-zinc-50 rounded-xl border border-zinc-100">
              <div className="flex items-center gap-3">
                <ShieldCheck size={16} className={district.status === 'High Density' ? "text-red-500" : "text-green-500"} />
                <span className="text-xs md:text-sm font-medium text-zinc-700">Safety Index</span>
              </div>
              <span className={`text-xs md:text-sm font-bold ${district.status === 'High Density' ? "text-red-600" : "text-zinc-900"}`}>{safetyIndex}% Secure</span>
            </div>
          </div>

          <button 
            disabled={isReporting || reportSuccess || district.status === 'High Density'}
            onClick={handleReportClick}
            className={`w-full mt-6 py-3 rounded-xl font-medium text-sm transition-all flex justify-center items-center gap-2 ${
                reportSuccess ? 'bg-green-600 text-white' :
                district.status === 'High Density' ? 'bg-zinc-200 text-zinc-400 cursor-not-allowed' :
                'bg-zinc-900 text-white hover:bg-zinc-800 hover:scale-[1.02] active:scale-[0.98]'
            }`}
          >
            {isReporting ? (
                <RefreshCw className="animate-spin" size={16} />
            ) : reportSuccess ? (
                <><CheckCircle2 size={16} /> Report Submitted</>
            ) : district.status === 'High Density' ? (
                <><AlertTriangle size={16} /> Incident Active</>
            ) : (
                <><AlertTriangle size={16} /> Report Incident</>
            )}
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
  const [selectedKpiFilter, setSelectedKpiFilter] = useState(null);
  const [userProfileOpen, setUserProfileOpen] = useState(false);

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
    { id: 1, time: '10:42 AM', title: 'Traffic Congestion', desc: 'High density detected at JL. KHZ Mustofa.', type: 'warning', districtName: 'Cihideung' },
    { id: 2, time: '10:38 AM', title: 'Public Transport', desc: 'Unit #402 arrived at Dadaha Terminal.', type: 'info', districtName: 'Tawang' },
    { id: 3, time: '10:30 AM', title: 'Air Quality Update', desc: 'Index improved in Cipedes District.', type: 'success', districtName: 'Cipedes' },
  ]);

  const [districts, setDistricts] = useState([
    { id: 101, name: 'Cihideung', status: 'High Density', x: '40%', y: '30%' },
    { id: 102, name: 'Tawang', status: 'Moderate', x: '60%', y: '45%' },
    { id: 103, name: 'Cipedes', status: 'Low Traffic', x: '30%', y: '60%' },
    { id: 104, name: 'Indihiang', status: 'Low Traffic', x: '70%', y: '25%' },
    { id: 105, name: 'Kawalu', status: 'Low Traffic', x: '20%', y: '40%' },
  ]);

  useEffect(() => {
    setIsClient(true);
  }, []);

  // --- ACTIONS & INTEGRATION LOGIC ---

  const refreshData = useCallback(() => {
    setKpiData(prev => prev.map(item => {
      const change = (Math.random() - 0.5) * 5; 
      let newValue = item.format === 'percent' 
        ? Math.min(100, Math.max(0, Math.round(item.value + change)))
        : Math.round(item.value + change);
      
      return {
        ...item,
        value: newValue,
        trend: Number((item.trend + (Math.random() - 0.5)).toFixed(1))
      };
    }));
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      refreshData();

      if (Math.random() > 0.8) {
          const randomDist = districts[Math.floor(Math.random() * districts.length)];
          const newLog = {
              id: Date.now(),
              time: generateTime(),
              title: 'Routine Patrol',
              desc: `Sector patrol completed in ${randomDist.name}. Status normal.`,
              type: 'info',
              districtName: randomDist.name,
              isNew: true
          };
          setLogs(prev => [newLog, ...prev].slice(0, 50));
          setTimeout(() => {
              setLogs(prev => prev.map(l => l.id === newLog.id ? {...l, isNew: false} : l));
          }, 2000);
      }
    }, 4000);

    return () => clearInterval(interval);
  }, [districts, refreshData]);

  const handleResolveAlert = (id, districtName) => {
      setLogs(prev => prev.map(log => {
          if (log.id === id) {
              return { ...log, title: 'Dispatching Unit...', desc: 'System automatically assigning nearest patrol.', type: 'info', isNew: true };
          }
          return log;
      }));

      setTimeout(() => {
          setLogs(prev => prev.map(log => {
              if (log.id === id) {
                  return { ...log, title: 'Issue Resolved', desc: 'Team successfully managed the situation.', type: 'success', isNew: true };
              }
              return log;
          }));

          if(districtName) {
              setDistricts(prev => prev.map(d => 
                  d.name === districtName ? { ...d, status: 'Low Traffic' } : d
              ));
              setKpiData(prev => prev.map(k => 
                  (k.title === 'Traffic Load' || k.title === 'Emergency') 
                  ? { ...k, trend: k.trend - 5 } 
                  : k
              ));
          }
      }, 2500);
  };

  const handleReportIncident = (districtName) => {
      const newLog = {
          id: Date.now(),
          time: generateTime(),
          title: 'Manual Alert Reported',
          desc: `Citizen reported disturbance in ${districtName}.`,
          type: 'critical',
          districtName: districtName,
          isNew: true
      };
      setLogs(prev => [newLog, ...prev]);

      setDistricts(prev => prev.map(d => 
          d.name === districtName ? { ...d, status: 'High Density' } : d
      ));

      setKpiData(prev => prev.map(k => 
          k.id === 5 ? { ...k, value: k.value + 1, trend: k.trend + 10 } : k 
      ));
  };

  const handleAIAnalysis = () => {
      setSearchQuery('Cihideung');
      const target = districts.find(d => d.name === 'Cihideung');
      if(target) setSelectedDistrict(target);
      
      const aiLog = {
          id: Date.now(),
          time: generateTime(),
          title: 'AI Prediction Verified',
          desc: 'Analyst reviewed congestion data for Cihideung.',
          type: 'success',
          districtName: 'Cihideung',
          isNew: true
      };
      setLogs(prev => [aiLog, ...prev]);
  };

  const handleLoadMoreLogs = () => {
      const historicalLogs = [
          { id: 991, time: '09:15 AM', title: 'Morning Shift Start', desc: 'All units checked in.', type: 'info' },
          { id: 992, time: '08:45 AM', title: 'System Maintenance', desc: 'Database optimization complete.', type: 'success' },
          { id: 993, time: '08:30 AM', title: 'Weather Warning', desc: 'Heavy rain predicted for afternoon.', type: 'warning' },
      ];
      setLogs(prev => [...prev, ...historicalLogs]);
  };

  const filteredLogs = logs.filter(l => {
      const matchesSearch = l.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                            l.desc.toLowerCase().includes(searchQuery.toLowerCase());
      
      const matchesKPI = selectedKpiFilter 
        ? KPI_CATEGORY_MAP[selectedKpiFilter]?.includes(l.type)
        : true;

      return matchesSearch && matchesKPI;
  });

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
            onReportIncident={handleReportIncident}
          />
        )}
      </AnimatePresence>

      {/* --- Utility / Filter Bar --- */}
      {/* RESPONSIVE: Stack vertically on mobile, row on desktop */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 md:mb-10 gap-4">
        <div className="flex flex-wrap items-center gap-2 md:gap-3">
           <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-white border border-green-200 shadow-sm transition-transform hover:scale-105 cursor-help" title="All Systems Operational">
            <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
            <span className="text-[10px] md:text-xs font-semibold text-green-700 uppercase tracking-wide">System Online</span>
          </div>
          {selectedKpiFilter && (
             <button 
                onClick={() => setSelectedKpiFilter(null)}
                className="flex items-center gap-1 px-3 py-1.5 rounded-full bg-blue-100 border border-blue-200 text-blue-700 text-[10px] md:text-xs font-semibold hover:bg-blue-200 transition-colors"
             >
                Filter Active <X size={12} />
             </button>
          )}
        </div>

        <div className="flex items-center gap-3 w-full md:w-auto">
          <div className="relative group w-full md:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400 group-focus-within:text-blue-600 transition-colors" size={16} />
            <input 
              type="text" 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search district or logs..." 
              className="w-full bg-white border border-zinc-200 rounded-full py-2 pl-10 pr-4 text-xs md:text-sm outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all shadow-sm"
            />
          </div>
          {/* User Profile Toggle */}
          <div 
            onClick={() => setUserProfileOpen(!userProfileOpen)}
            className="w-10 h-10 rounded-full bg-white border border-zinc-200 flex items-center justify-center hover:border-blue-300 cursor-pointer transition-colors shadow-sm shrink-0 overflow-hidden relative"
          >
            {userProfileOpen ? (
                <div className="absolute inset-0 bg-zinc-900 text-white flex items-center justify-center text-[10px] font-bold">ADM</div>
            ) : (
                <div className="w-full h-full bg-zinc-100 flex items-center justify-center text-zinc-400 text-xs">IMG</div>
            )}
          </div>
        </div>
      </div>

      {/* --- KPI SECTION --- */}
      <section className="mb-8 md:mb-12">
        <SectionHeader 
          title="Real-time Metrics" 
          subtitle="Overview" 
          action={
            <button onClick={refreshData} className="flex items-center gap-1 text-sm font-medium text-blue-600 hover:text-blue-700 transition-colors group">
              Refresh Data <RefreshCw size={14} className="group-hover:rotate-180 transition-transform duration-500" />
            </button>
          }
        />
        {/* RESPONSIVE: Grid columns 2 for mobile, 3 for tablet, 6 for desktop */}
        <motion.div layout className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 md:gap-4">
          {kpiData.map((kpi) => (
            <MetricCard 
                key={kpi.id} 
                item={{...kpi, value: kpi.format === 'percent' ? `${kpi.value}%` : kpi.value.toLocaleString()}} 
                isSelected={selectedKpiFilter === kpi.id}
                onClick={setSelectedKpiFilter}
            />
          ))}
        </motion.div>
      </section>

      {/* --- BENTO GRID LAYOUT --- */}
      {/* RESPONSIVE: Single column on mobile, 3 on Desktop */}
      <section className="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-6">
        
        {/* COLUMN 1 & 2: MAP & AI */}
        <div className="lg:col-span-2 flex flex-col gap-4 md:gap-6">
          
          {/* MAP WIDGET */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            // RESPONSIVE: Tinggi peta disesuaikan (320px di mobile, 420px di desktop)
            className="bg-white rounded-[2rem] md:rounded-[2.5rem] p-2 shadow-sm border border-zinc-200 relative overflow-hidden h-[320px] md:h-[420px] group"
          >
            <div className="w-full h-full rounded-[1.5rem] md:rounded-[2rem] bg-zinc-50 relative overflow-hidden">
              {/* Fake Map Elements */}
              <div className="absolute inset-0 opacity-30 bg-[radial-gradient(#cbd5e1_1px,transparent_1px)] [background-size:20px_20px]"></div>
              
              <div className="absolute top-1/4 left-1/3 w-48 h-48 md:w-64 md:h-64 bg-blue-200/40 rounded-full blur-[60px] md:blur-[80px]"></div>
              <div className="absolute bottom-1/4 right-1/4 w-48 h-48 md:w-64 md:h-64 bg-indigo-200/40 rounded-full blur-[60px] md:blur-[80px]"></div>

              <div className="absolute top-4 left-4 md:top-6 md:left-6 z-20 pointer-events-none">
                <span className="px-3 py-1 rounded-full bg-white/60 backdrop-blur-md border border-white/40 text-[10px] md:text-xs font-semibold text-blue-600 shadow-sm mb-2 inline-block">
                  LIVE MAP
                </span>
                <h3 className="text-lg md:text-xl font-bold text-zinc-900 tracking-tight">District Heatmap</h3>
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
                        <div className={`w-10 h-10 md:w-12 md:h-12 rounded-full animate-ping absolute ${
                            district.status === 'High Density' ? 'bg-red-500/20' : 'bg-blue-500/10'
                        }`}></div>
                        <div className={`w-3 h-3 md:w-4 md:h-4 rounded-full border-[3px] border-white shadow-lg relative z-10 transition-transform group-hover/marker:scale-125 ${
                            district.status === 'High Density' ? 'bg-red-500' : 
                            district.status === 'Moderate' ? 'bg-orange-500' : 'bg-blue-600'
                        }`}></div>
                        
                        <div className="absolute bottom-full mb-3 left-1/2 -translate-x-1/2 px-3 py-2 md:px-4 md:py-2 bg-white/90 backdrop-blur-xl rounded-2xl shadow-xl border border-white/50 text-center min-w-[100px] md:min-w-[120px] opacity-0 group-hover/marker:opacity-100 transition-all transform translate-y-2 group-hover/marker:translate-y-0 z-30 pointer-events-none hidden md:block">
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
            // RESPONSIVE: Stack vertical on mobile, row on tablet/desktop
            className="bg-gradient-to-r from-zinc-50 to-white border border-zinc-200 rounded-3xl p-6 md:p-8 shadow-sm relative overflow-hidden flex flex-col md:flex-row items-start md:items-center justify-between gap-4"
          >
            <div className="relative z-10 max-w-lg">
              <div className="flex items-center gap-2 mb-3">
                <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center">
                  <Sparkles size={16} className="text-blue-600" />
                </div>
                <span className="text-xs font-bold text-blue-600 uppercase tracking-widest">AI Prediction</span>
              </div>
              <h4 className="text-base md:text-lg font-bold text-zinc-900 mb-2">High Congestion Alert</h4>
              <p className="text-xs md:text-sm text-zinc-500 leading-relaxed">
                Traffic in <strong className="text-zinc-900">Cihideung District</strong> is projected to increase by 25% within the hour. Rerouting protocols suggested.
              </p>
            </div>
            
            <button 
                onClick={handleAIAnalysis}
                className="w-full md:w-auto bg-zinc-900 text-white px-6 py-3 rounded-full text-xs font-medium hover:bg-zinc-800 transition-colors shadow-lg shadow-zinc-900/10 flex items-center justify-center gap-2 shrink-0 active:scale-95"
            >
              View Analysis <ArrowUpRight size={14} />
            </button>

            <div className="absolute right-0 top-1/2 -translate-y-1/2 w-32 h-32 bg-blue-500/10 blur-[50px] pointer-events-none"></div>
          </motion.div>

        </div>

        {/* COLUMN 3: ACTIVITY FEED */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-3xl border border-zinc-200 shadow-sm overflow-hidden h-full flex flex-col relative min-h-[400px]">
            <div className="p-4 md:p-6 border-b border-zinc-100 flex justify-between items-center bg-white sticky top-0 z-10">
              <div className="flex items-center gap-2">
                <h3 className="text-base md:text-lg font-bold text-zinc-900 tracking-tight">Recent Activity</h3>
                <span className="bg-blue-100 text-blue-700 text-[10px] font-bold px-2 py-0.5 rounded-full">{filteredLogs.length}</span>
              </div>
              <MoreHorizontal size={20} className="text-zinc-400 hover:text-zinc-900 cursor-pointer" />
            </div>
            
            <div className="flex-grow overflow-y-auto max-h-[350px] md:max-h-[500px] lg:max-h-none custom-scrollbar">
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
                <div className="p-8 text-center flex flex-col items-center gap-2">
                    <Search className="text-zinc-300" size={32} />
                    <p className="text-zinc-400 text-sm">No logs match your filter.</p>
                    <button onClick={() => {setSearchQuery(''); setSelectedKpiFilter(null)}} className="text-blue-600 text-xs font-bold hover:underline">Clear Filters</button>
                </div>
              )}
            </div>

            <div className="p-4 bg-zinc-50 border-t border-zinc-100 text-center sticky bottom-0">
              <span 
                onClick={handleLoadMoreLogs}
                className="text-xs font-semibold text-blue-600 hover:text-blue-700 cursor-pointer transition-colors block p-2"
              >
                View System Logs
              </span>
            </div>
          </div>
        </div>
      </section>
    </PageLayout>
  );
}