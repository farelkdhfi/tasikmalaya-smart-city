import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Flame, Truck, Droplets, Thermometer, Activity, Clock, TrendingUp, TrendingDown, 
  AlertOctagon, Map as MapIcon, BarChart3, CheckCircle2, AlertTriangle, Users, 
  Wind, ArrowUpRight, MoreHorizontal, Search, Siren, Send, Radio, Layers, X
} from 'lucide-react';
import { 
  AreaChart, Area, BarChart, Bar, ResponsiveContainer, XAxis, YAxis, Tooltip, CartesianGrid, Cell
} from 'recharts';

import PageLayout from '../../components/PageLayout';

// --- UTILS & DATA GENERATORS ---
const generateTimeData = () => {
  const data = [];
  const now = new Date();
  for (let i = 6; i >= 0; i--) {
    const t = new Date(now.getTime() - i * 60 * 60 * 1000);
    data.push({
      time: `${t.getHours()}:00`,
      val: Math.floor(Math.random() * 10) + 2
    });
  }
  return data;
};

const INITIAL_INCIDENTS = [
  { id: 1, type: "Structure Fire", loc: "Jl. Otto Iskandardinata", time: "Now", severity: "high", status: "Active", dispatched: 0, x: 30, y: 40 },
  { id: 2, type: "Brush Fire", loc: "Cibalong Outskirts", time: "15m ago", severity: "med", status: "Active", dispatched: 1, x: 60, y: 70 },
];

// --- SUB-COMPONENTS ---

const TrendBadge = ({ value, invert = false }) => {
  const isPositive = value > 0;
  const isGood = (isPositive && !invert) || (!isPositive && invert);
  
  if (value === 0) return <div className="bg-zinc-100 text-zinc-500 text-xs px-2 py-1 rounded-full font-bold">Stable</div>;

  return (
    <div className={`flex items-center gap-1 text-xs font-medium px-2 py-1 rounded-full ${
      isGood ? 'bg-emerald-50 text-emerald-700' : 'bg-red-50 text-red-700'
    }`}>
      {isPositive ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
      {Math.abs(value)}%
    </div>
  );
};

const MetricCard = ({ item }) => (
  <motion.div
    layout
    whileHover={{ y: -4, scale: 1.02 }}
    className="bg-white rounded-3xl p-5 h-48 flex flex-col justify-between shadow-sm hover:shadow-xl hover:shadow-red-500/5 border border-zinc-100 transition-all duration-300 group cursor-pointer relative overflow-hidden"
  >
    <div className="flex justify-between items-start z-10">
      <div className={`w-10 h-10 rounded-2xl flex items-center justify-center transition-colors duration-300 bg-zinc-50 text-zinc-900 group-hover:bg-red-600 group-hover:text-white`}>
        <item.icon size={20} />
      </div>
      <div className="w-7 h-7 rounded-full bg-zinc-100 flex items-center justify-center text-zinc-400 group-hover:text-red-600 transition-colors">
        <ArrowUpRight size={14} />
      </div>
    </div>
    <div className="z-10 mt-auto">
      <div className="flex justify-between items-end mb-1">
        <h3 className="text-3xl font-bold text-zinc-900 tracking-tight leading-none group-hover:text-red-600 transition-colors">
          {item.value}
        </h3>
        <TrendBadge value={item.trend} invert={item.label === 'Active Fires' || item.label === 'Avg Response'} />
      </div>
      <p className="text-xs text-zinc-500 font-medium uppercase tracking-wide">{item.label}</p>
    </div>
    <div className="absolute -right-4 -bottom-4 opacity-0 group-hover:opacity-5 transition-opacity duration-500 pointer-events-none">
      <item.icon size={100} />
    </div>
  </motion.div>
);

// --- MAIN COMPONENT ---

export default function FireResponse() {
  // --- STATE ---
  const [incidents, setIncidents] = useState(INITIAL_INCIDENTS);
  const [responseTrend, setResponseTrend] = useState(generateTimeData());
  const [unitsAvailable, setUnitsAvailable] = useState(12);
  const [totalUnits] = useState(20);
  const [weather, setWeather] = useState({ wind: 12, dir: 'NW', temp: 32 });
  const [selectedIncidentId, setSelectedIncidentId] = useState(null);
  const [mapFilters, setMapFilters] = useState({ hydrants: true, grid: true });
  const [broadcastMsg, setBroadcastMsg] = useState("");
  const [alertVisible, setAlertVisible] = useState(false);
  const [kpiStats, setKpiStats] = useState({
    activeFires: 3,
    avgResponse: '6m 12s',
    responseVal: 372, // seconds
    riskIndex: 'Med'
  });

  // Derived state
  const selectedIncident = incidents.find(i => i.id === selectedIncidentId);

  // --- SIMULATION EFFECTS ---

  // 1. Weather & Risk Simulation (Changes every 5s)
  useEffect(() => {
    const interval = setInterval(() => {
      const dirs = ['N', 'NE', 'E', 'SE', 'S', 'SW', 'W', 'NW'];
      const newWind = Math.max(0, weather.wind + (Math.random() > 0.5 ? 2 : -2));
      const newRisk = newWind > 20 ? 'High' : newWind > 10 ? 'Med' : 'Low';
      
      setWeather(prev => ({
        ...prev,
        wind: newWind,
        dir: dirs[Math.floor(Math.random() * dirs.length)]
      }));
      setKpiStats(prev => ({ ...prev, riskIndex: newRisk }));
    }, 5000);
    return () => clearInterval(interval);
  }, [weather.wind]);

  // 2. Response Time & Chart Simulation (Changes every 3s)
  useEffect(() => {
    const interval = setInterval(() => {
      setResponseTrend(prev => {
        const newData = [...prev];
        const lastVal = newData[newData.length - 1].val;
        const nextVal = Math.max(2, Math.min(12, lastVal + (Math.random() > 0.5 ? 1 : -1)));
        newData.shift();
        newData.push({ time: new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}), val: nextVal });
        return newData;
      });
      
      // Randomly adjust Avg Response text slightly
      const sec = kpiStats.responseVal + (Math.random() > 0.5 ? 5 : -5);
      setKpiStats(prev => ({
        ...prev,
        responseVal: sec,
        avgResponse: `${Math.floor(sec / 60)}m ${sec % 60}s`
      }));

    }, 3000);
    return () => clearInterval(interval);
  }, [kpiStats.responseVal]);

  // --- HANDLERS ---

  const handleDispatch = (id) => {
    if (unitsAvailable > 0) {
      setUnitsAvailable(prev => prev - 1);
      setIncidents(prev => prev.map(inc => 
        inc.id === id ? { ...inc, dispatched: inc.dispatched + 1, status: "Responding" } : inc
      ));
      // Trigger Alert
      setBroadcastMsg(`Unit dispatched to Incident #${id}`);
      setAlertVisible(true);
      setTimeout(() => setAlertVisible(false), 3000);
    }
  };

  const handleResolve = (id) => {
     setIncidents(prev => prev.filter(i => i.id !== id));
     setSelectedIncidentId(null);
     // Return units (simplified logic)
     setUnitsAvailable(prev => Math.min(totalUnits, prev + 1));
  };

  const handleBroadcast = () => {
    setBroadcastMsg("ALL STATIONS: GENERAL ALERT BROADCAST");
    setAlertVisible(true);
    setTimeout(() => setAlertVisible(false), 4000);
  };

  const toggleRestock = () => {
    if (unitsAvailable < totalUnits) {
      setUnitsAvailable(prev => Math.min(totalUnits, prev + 1));
    }
  };

  const KPI_DATA = [
    { id: 1, label: 'Active Fires', sub: 'Confirmed Reports', value: incidents.length, trend: incidents.length > 2 ? +10 : -5, icon: Flame },
    { id: 2, label: 'Avg Response', sub: 'Dispatch Time', value: kpiStats.avgResponse, trend: -4, icon: Clock },
    { id: 3, label: 'Risk Index', sub: 'FDR Level', value: kpiStats.riskIndex, trend: kpiStats.riskIndex === 'High' ? +20 : 0, icon: Thermometer },
    { id: 4, label: 'Units Deployed', sub: 'Active Fleet', value: `${totalUnits - unitsAvailable}/${totalUnits}`, trend: +85, icon: Truck },
  ];

  return (
    <PageLayout 
        title="Fire Response" 
        subtitle="Emergency Command" 
        colorTheme="red"
    >
        {/* FITUR BARU 3: BROADCAST ALERT SYSTEM (Toast) */}
        <AnimatePresence>
          {alertVisible && (
            <motion.div 
              initial={{ opacity: 0, y: -50 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -50 }}
              className="fixed top-6 left-1/2 -translate-x-1/2 z-50 bg-zinc-900 text-white px-6 py-3 rounded-full shadow-2xl flex items-center gap-3 border border-red-500/50"
            >
              <Radio className="text-red-500 animate-pulse" size={18} />
              <span className="font-bold tracking-wide text-sm">{broadcastMsg}</span>
            </motion.div>
          )}
        </AnimatePresence>

        {/* HEADER CONTROLS */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-8">
            <div className="flex items-center gap-3">
                 <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-red-50 border border-red-200 shadow-sm animate-pulse">
                    <div className="w-2 h-2 rounded-full bg-red-600"></div>
                    <span className="text-xs font-bold text-red-700 uppercase tracking-wide">Incident Active</span>
                </div>
                <span className="text-xs text-zinc-400 font-mono">Synced: {new Date().toLocaleTimeString()}</span>
            </div>

            <div className="flex gap-4">
              {/* Feature Broadcast Trigger */}
              <button onClick={handleBroadcast} className="bg-white p-2 px-4 rounded-[2rem] border border-zinc-200 shadow-sm flex items-center gap-2 text-zinc-600 hover:text-red-600 hover:border-red-200 transition-all font-bold text-xs uppercase tracking-wider">
                 <Radio size={16} /> Broadcast
              </button>

              {/* Fire Danger Widget (Dynamic) */}
              <div className="bg-white p-2 pr-6 rounded-[2rem] border border-zinc-200 shadow-sm flex items-center gap-4">
                  <div className={`w-12 h-12 rounded-full flex items-center justify-center border-4 border-white shadow-sm transition-colors duration-500 ${kpiStats.riskIndex === 'High' ? 'bg-red-100 text-red-600' : 'bg-orange-100 text-orange-600'}`}>
                      <Flame size={20} fill="currentColor" />
                  </div>
                  <div>
                      <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider">Fire Danger Rating</p>
                      <div className="flex items-baseline gap-1">
                          <span className="text-lg font-bold text-zinc-900 uppercase">{kpiStats.riskIndex}</span>
                          <span className="text-xs text-zinc-400 font-medium">• {weather.temp}°C</span>
                      </div>
                  </div>
              </div>
            </div>
        </div>

        {/* KPI SECTION */}
        <section className="mb-8">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {KPI_DATA.map((kpi) => (
                    <MetricCard key={kpi.id} item={kpi} />
                ))}
            </div>
        </section>

        {/* MAIN GRID */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            
            {/* LEFT: MAP & ANALYTICS (8 Cols) */}
            <div className="lg:col-span-8 flex flex-col gap-8">
                
                {/* Tactical Map */}
                <div className="bg-white rounded-[2.5rem] p-2 shadow-sm border border-zinc-200 relative overflow-hidden h-[500px] group">
                      {/* Map Container */}
                      <div className="w-full h-full rounded-[2rem] bg-zinc-100 relative overflow-hidden select-none">
                        
                        {/* City Grid (Toggleable via Filters) */}
                        {mapFilters.grid && (
                          <div className="absolute inset-0 opacity-[0.05] bg-[linear-gradient(to_right,#000000_1px,transparent_1px),linear-gradient(to_bottom,#000000_1px,transparent_1px)] bg-[size:40px_40px]"></div>
                        )}
                        
                        <div className="absolute top-1/4 left-1/4 w-32 h-32 border-2 border-zinc-200 rotate-45"></div>
                        <div className="absolute bottom-1/3 right-1/4 w-48 h-48 border-2 border-zinc-200 rounded-full"></div>
                        
                        {/* Map Overlay Info & FITUR BARU 2: Map Filters */}
                        <div className="absolute top-6 left-6 z-20 flex flex-col gap-2">
                            <div className="bg-white/90 backdrop-blur-md px-4 py-2 rounded-2xl border border-zinc-200 shadow-sm flex flex-col gap-1 w-max">
                                <h3 className="text-sm font-bold text-zinc-900 flex items-center gap-2">
                                    <MapIcon size={16} className="text-red-600" /> Tactical View
                                </h3>
                                {/* FITUR BARU 4: Dynamic Wind */}
                                <div className="flex items-center gap-2 text-[10px] text-zinc-500">
                                    <Wind size={12} style={{ transform: `rotate(${weather.dir === 'N' ? 0 : weather.dir === 'E' ? 90 : 180}deg)`}}/> 
                                    Wind: {weather.dir} {weather.wind}km/h
                                </div>
                            </div>

                            {/* Filter Controls */}
                            <div className="flex gap-2">
                               <button 
                                onClick={() => setMapFilters(prev => ({...prev, hydrants: !prev.hydrants}))}
                                className={`p-2 rounded-xl border transition-colors ${mapFilters.hydrants ? 'bg-blue-500 text-white border-blue-600' : 'bg-white text-zinc-400 border-zinc-200'}`}>
                                 <Droplets size={14} />
                               </button>
                               <button 
                                onClick={() => setMapFilters(prev => ({...prev, grid: !prev.grid}))}
                                className={`p-2 rounded-xl border transition-colors ${mapFilters.grid ? 'bg-zinc-800 text-white border-zinc-900' : 'bg-white text-zinc-400 border-zinc-200'}`}>
                                 <Layers size={14} />
                               </button>
                            </div>
                        </div>

                        {/* Hydrants (Toggleable) */}
                        {mapFilters.hydrants && [...Array(5)].map((_, i) => (
                            <div key={i} className="absolute w-2 h-2 bg-blue-500 rounded-full shadow-sm border border-white" 
                                style={{ top: `${20 + i * 15}%`, left: `${15 + i * 12}%` }} />
                        ))}

                        {/* FITUR BARU 1: Interactive Markers */}
                        {incidents.map((inc) => (
                          <motion.div 
                            key={inc.id}
                            className="absolute cursor-pointer z-10 group/marker"
                            style={{ top: `${inc.y}%`, left: `${inc.x}%` }}
                            initial={{ scale: 0 }} animate={{ scale: 1 }}
                            onClick={() => setSelectedIncidentId(inc.id)}
                          >
                            <span className="absolute -inset-8 rounded-full bg-red-500/10 animate-ping"></span>
                            <span className="absolute -inset-4 rounded-full bg-red-500/20 animate-pulse"></span>
                            <div className={`w-8 h-8 rounded-full border-2 border-white shadow-xl flex items-center justify-center transition-transform hover:scale-110 ${selectedIncidentId === inc.id ? 'bg-zinc-900 scale-125' : 'bg-red-600'}`}>
                                <Flame size={14} className="text-white fill-white" />
                            </div>
                            
                            {/* Tooltip */}
                            <div className="absolute top-10 left-1/2 -translate-x-1/2 bg-zinc-900 text-white px-3 py-2 rounded-xl shadow-lg whitespace-nowrap opacity-0 group-hover/marker:opacity-100 transition-opacity z-20 pointer-events-none">
                                <p className="text-[10px] font-bold uppercase text-red-400">{inc.type}</p>
                                <p className="text-[10px] text-zinc-300">{inc.loc}</p>
                            </div>
                          </motion.div>
                        ))}

                        {/* SELECTED INCIDENT PANEL (Overlay) */}
                        <AnimatePresence>
                        {selectedIncident && (
                          <motion.div 
                            initial={{ y: 100, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            exit={{ y: 100, opacity: 0 }}
                            className="absolute bottom-4 left-4 right-4 bg-white/95 backdrop-blur-xl p-4 rounded-3xl border border-zinc-200 shadow-xl z-30 flex justify-between items-center"
                          >
                             <div>
                                <h4 className="font-bold text-zinc-900">{selectedIncident.type}</h4>
                                <p className="text-xs text-zinc-500 flex items-center gap-2">
                                  {selectedIncident.loc} 
                                  <span className="w-1 h-1 bg-zinc-300 rounded-full"></span> 
                                  {selectedIncident.dispatched} Unit(s) on scene
                                </p>
                             </div>
                             <div className="flex gap-2">
                                <button 
                                  onClick={() => handleResolve(selectedIncident.id)}
                                  className="px-4 py-2 bg-emerald-50 text-emerald-600 rounded-xl text-xs font-bold uppercase hover:bg-emerald-100 border border-emerald-100"
                                >
                                  Resolve
                                </button>
                                <button 
                                  onClick={() => handleDispatch(selectedIncident.id)}
                                  disabled={unitsAvailable === 0}
                                  className="px-4 py-2 bg-red-600 text-white rounded-xl text-xs font-bold uppercase hover:bg-red-700 shadow-lg shadow-red-500/30 flex items-center gap-2 disabled:opacity-50"
                                >
                                  <Truck size={14} /> Dispatch +1
                                </button>
                                <button onClick={() => setSelectedIncidentId(null)} className="p-2 hover:bg-zinc-100 rounded-xl">
                                  <X size={16} />
                                </button>
                             </div>
                          </motion.div>
                        )}
                        </AnimatePresence>

                        {/* Legend */}
                        <div className="absolute bottom-6 right-6 bg-white/90 backdrop-blur-md p-3 rounded-2xl border border-zinc-200 shadow-sm flex gap-4">
                            <div className="flex items-center gap-2 text-[10px] font-bold text-zinc-500">
                                <span className="w-2 h-2 bg-red-600 rounded-full animate-pulse"></span> Active Fire
                            </div>
                            <div className="flex items-center gap-2 text-[10px] font-bold text-zinc-500">
                                <span className="w-2 h-2 bg-blue-500 rounded-full"></span> Hydrant
                            </div>
                        </div>
                      </div>
                </div>

                {/* Analytics Row */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    
                    {/* Causes Chart */}
                    <div className="bg-white p-6 rounded-[2.5rem] border border-zinc-200 shadow-sm">
                        <h3 className="font-bold text-sm text-zinc-900 mb-6">Incident Causes</h3>
                        <div className="h-40 w-full">
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={[
                                    { name: 'Electrical', val: 65 },
                                    { name: 'Negligence', val: 40 },
                                    { name: 'Arson', val: 20 },
                                    { name: 'Natural', val: 15 },
                                ]} layout="vertical">
                                    <XAxis type="number" hide />
                                    <YAxis dataKey="name" type="category" width={70} tick={{fontSize: 10}} axisLine={false} tickLine={false} />
                                    <Tooltip cursor={{fill: 'transparent'}} contentStyle={{ borderRadius: '12px', border: 'none' }} />
                                    <Bar dataKey="val" radius={[0, 4, 4, 0]} barSize={20}>
                                        {[0,1,2,3].map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={index === 0 ? '#ef4444' : '#e4e4e7'} />
                                        ))}
                                    </Bar>
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    </div>

                    {/* Response Trend (Live) */}
                    <div className="bg-white p-6 rounded-[2.5rem] border border-zinc-200 shadow-sm">
                        <div className="flex justify-between items-center mb-6">
                            <h3 className="font-bold text-sm text-zinc-900">Response Time</h3>
                            <span className="text-[10px] font-bold bg-blue-50 text-blue-600 px-2 py-1 rounded-md flex items-center gap-1">
                              <span className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-pulse"></span> Live
                            </span>
                        </div>
                        <div className="h-40 w-full">
                            <ResponsiveContainer width="100%" height="100%">
                                <AreaChart data={responseTrend}>
                                    <defs>
                                        <linearGradient id="colorRes" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.2}/>
                                            <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                                        </linearGradient>
                                    </defs>
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f4f4f5" />
                                    <XAxis dataKey="time" axisLine={false} tickLine={false} tick={{fontSize: 10, fill: '#a1a1aa'}} />
                                    <Tooltip contentStyle={{ borderRadius: '12px', border: 'none' }} />
                                    <Area type="monotone" dataKey="val" stroke="#3b82f6" strokeWidth={3} fillOpacity={1} fill="url(#colorRes)" animationDuration={1000} />
                                </AreaChart>
                            </ResponsiveContainer>
                        </div>
                    </div>

                </div>
            </div>

            {/* RIGHT: RESOURCES & LOGS (4 Cols) */}
            <div className="lg:col-span-4 flex flex-col gap-6">
                
                {/* Resource Status */}
                <div className="bg-zinc-900 text-white rounded-[2.5rem] p-8 shadow-xl shadow-zinc-200 relative overflow-hidden">
                    <div className="relative z-10">
                        <div className="flex justify-between items-center mb-6">
                            <h3 className="font-bold text-lg">Station HQ</h3>
                            <div className="p-2 bg-white/10 rounded-full">
                                <Truck size={16} className="text-red-400" />
                            </div>
                        </div>

                        <div className="space-y-6">
                            <div>
                                <div className="flex justify-between text-xs mb-2">
                                    <span className="text-zinc-400 font-bold uppercase">Fire Trucks</span>
                                    <span className={`font-bold ${unitsAvailable < 5 ? 'text-red-400' : 'text-emerald-400'}`}>
                                      {unitsAvailable}/{totalUnits} Ready
                                    </span>
                                </div>
                                <div className="flex gap-1 h-1.5 overflow-hidden rounded-full bg-zinc-800">
                                    {[...Array(totalUnits)].map((_, i) => (
                                        <motion.div 
                                          key={i} 
                                          initial={false}
                                          animate={{ backgroundColor: i < unitsAvailable ? '#10b981' : '#3f3f46' }}
                                          className="flex-1 rounded-full" 
                                        />
                                    ))}
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-3">
                              <div className="flex flex-col items-center justify-center p-3 bg-white/5 rounded-2xl border border-white/5">
                                <span className="text-2xl font-bold mb-1">{40 - unitsAvailable}</span>
                                <span className="text-[10px] text-zinc-500 uppercase">On Duty</span>
                              </div>
                              {/* FITUR BARU 5: Quick Restock Button */}
                              <button 
                                onClick={toggleRestock}
                                className="flex flex-col items-center justify-center p-3 bg-red-600/20 hover:bg-red-600/30 transition-colors rounded-2xl border border-red-500/20 cursor-pointer group"
                              >
                                <span className="text-xs font-bold text-red-400 group-hover:text-red-300 flex items-center gap-1">
                                  <Truck size={12} /> Restock
                                </span>
                                <span className="text-[10px] text-red-500/70 uppercase">+1 Unit</span>
                              </button>
                            </div>

                            <div className="flex items-center justify-between p-3 bg-white/5 rounded-2xl border border-white/5">
                                <div className="flex items-center gap-3">
                                    <div className="bg-orange-500/20 p-2 rounded-xl text-orange-400">
                                        <CheckCircle2 size={16} />
                                    </div>
                                    <div>
                                        <p className="text-xs font-bold text-zinc-300">Equipment</p>
                                        <p className="text-[10px] text-zinc-500">Readiness</p>
                                    </div>
                                </div>
                                <span className="text-lg font-bold">98%</span>
                            </div>
                        </div>
                    </div>
                    {/* Decor */}
                    <div className="absolute top-0 right-0 w-64 h-64 bg-red-600/10 blur-[60px] rounded-full pointer-events-none"></div>
                </div>

                {/* Incident Log (Interactive) */}
                <div className="bg-white border border-zinc-200 rounded-[2.5rem] p-6 shadow-sm flex-1 flex flex-col">
                    <div className="flex items-center justify-between mb-6 px-2">
                        <h3 className="text-lg font-bold text-zinc-900 tracking-tight">Live Log</h3>
                        <div className="flex gap-1">
                            <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse"></span>
                            <span className="text-[10px] font-bold text-red-500 uppercase">Real-time</span>
                        </div>
                    </div>
                    
                    <div className="space-y-4 flex-1 overflow-auto max-h-[400px] pr-2 custom-scrollbar">
                        <AnimatePresence initial={false}>
                        {incidents.map((inc) => (
                            <motion.div 
                                key={inc.id} 
                                layout
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, height: 0 }}
                                onClick={() => setSelectedIncidentId(inc.id)}
                                className={`flex gap-4 items-start p-3 rounded-2xl transition-colors cursor-pointer group border-l-2 ${selectedIncidentId === inc.id ? 'bg-red-50 border-red-500' : 'hover:bg-zinc-50 border-transparent hover:border-red-200'}`}
                            >
                                <div className={`mt-1 w-2.5 h-2.5 rounded-full shrink-0 ${
                                    inc.severity === 'high' ? 'bg-red-500 animate-pulse' : 
                                    inc.severity === 'med' ? 'bg-orange-400' : 'bg-emerald-400'
                                }`} />
                                
                                <div className="flex-1 min-w-0">
                                    <div className="flex justify-between items-start">
                                        <p className="text-sm font-bold text-zinc-900 truncate group-hover:text-red-600 transition-colors">{inc.type}</p>
                                        <span className="text-[10px] text-zinc-400 whitespace-nowrap">{inc.time}</span>
                                    </div>
                                    <div className="flex justify-between items-center mt-1">
                                        <p className="text-[11px] text-zinc-500 truncate">{inc.loc}</p>
                                        <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded border uppercase ${
                                            inc.status === 'Responding' ? 'bg-red-50 text-red-600 border-red-100' : 
                                            inc.status === 'Active' ? 'bg-orange-50 text-orange-600 border-orange-100' : 
                                            'bg-zinc-50 text-zinc-500 border-zinc-100'
                                        }`}>{inc.status}</span>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                        {incidents.length === 0 && (
                          <div className="text-center py-10 text-zinc-400 text-xs italic">
                            All clear. No active incidents.
                          </div>
                        )}
                        </AnimatePresence>
                    </div>

                    <button className="w-full mt-6 py-3 text-xs font-bold text-zinc-500 bg-zinc-50 border border-zinc-100 rounded-xl hover:bg-zinc-100 transition-colors uppercase tracking-wider flex items-center justify-center gap-2">
                        <MoreHorizontal size={16} /> View History
                    </button>
                </div>

            </div>
        </div>
    </PageLayout>
  );
}