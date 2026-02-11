import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Shield, 
  Lock, 
  Wifi, 
  Eye, 
  AlertTriangle, 
  FileWarning, 
  Smartphone, 
  Globe, 
  CheckCircle2,
  XCircle,
  Activity,
  Search,
  ArrowRight,
  ArrowUpRight,
  TrendingDown,
  TrendingUp,
  Server,
  AlertOctagon,
  Terminal,
  Cpu,
  Radar,
  Zap
} from 'lucide-react';
import { 
  AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell, 
  ResponsiveContainer, XAxis, YAxis, Tooltip, CartesianGrid 
} from 'recharts';

import PageLayout from '../../components/PageLayout'; 

// --- UTILS & GENERATORS ---
const getRandom = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;

const THREAT_TYPES = [
    "SQL Injection Attempt", "XSS Payload Detected", "Brute Force: SSH", 
    "Malware Signature: Trojan", "DDoS Packet Flood", "Phishing Link Clicked"
];
const SOURCES = ["192.168.1.105", "Ext: 14.23.110.5", "User: Admin_01", "Gateway_Firewall"];

// --- INITIAL DATA ---
const INITIAL_TREND = Array.from({ length: 15 }, (_, i) => ({ day: i, val: getRandom(10, 40) }));

const INCIDENT_TYPES = [
  { name: 'Phishing', count: 450 }, { name: 'Malware', count: 320 },
  { name: 'Data Leak', count: 150 }, { name: 'Id. Theft', count: 80 }
];

const THREAT_SOURCES = [
  { name: 'Email', value: 45, color: '#6366f1' },
  { name: 'Web', value: 30, color: '#818cf8' },
  { name: 'Network', value: 15, color: '#a5b4fc' },
  { name: 'Ext. Media', value: 10, color: '#c7d2fe' }
];

// --- SUB-COMPONENTS ---

const TrendBadge = ({ value, inverse = false }) => {
    const isPositive = value > 0;
    // Cyber logic: Positive trend in threats is BAD (Red), Negative is GOOD (Green)
    // If inverse=false (default): Green is Positive. 
    // We want: High Threats = Red. So if value > 0, Red.
    
    let colorClass = 'bg-zinc-100 text-zinc-600';
    if (value !== 0) {
        if (inverse) {
             // Inverse: Positive is BAD (Red)
             colorClass = isPositive ? 'bg-rose-50 text-rose-700' : 'bg-emerald-50 text-emerald-700';
        } else {
             // Normal: Positive is GOOD (Green)
             colorClass = isPositive ? 'bg-emerald-50 text-emerald-700' : 'bg-rose-50 text-rose-700';
        }
    }
    
    return (
        <div className={`flex items-center gap-1 text-xs font-medium px-2 py-1 rounded-full ${colorClass}`}>
            {value === 0 ? <Activity size={12} /> : (isPositive ? <TrendingUp size={12} /> : <TrendingDown size={12} />)}
            {Math.abs(value)}%
        </div>
    );
};

const MetricCard = ({ item }) => (
    <motion.div
        layout
        className="bg-white rounded-3xl p-5 h-48 flex flex-col justify-between shadow-sm hover:shadow-xl hover:shadow-indigo-500/5 border border-zinc-100 transition-all duration-300 group relative overflow-hidden"
    >
        <div className="flex justify-between items-start z-10">
            <div className={`w-10 h-10 rounded-2xl flex items-center justify-center transition-colors duration-300 bg-zinc-50 text-zinc-900 group-hover:bg-indigo-600 group-hover:text-white`}>
                <item.icon size={20} />
            </div>
            <div className="w-7 h-7 rounded-full bg-zinc-100 flex items-center justify-center text-zinc-400 group-hover:text-indigo-600 transition-colors">
                <ArrowUpRight size={14} />
            </div>
        </div>
        <div className="z-10 mt-auto">
            <div className="flex justify-between items-end mb-1">
                <h3 className="text-3xl font-bold text-zinc-900 tracking-tight leading-none group-hover:text-indigo-600 transition-colors">
                    {item.value}
                </h3>
                <TrendBadge value={item.trend} inverse={item.label.includes('Incidents') || item.label.includes('Risk')} />
            </div>
            <p className="text-xs text-zinc-500 font-medium uppercase tracking-wide">{item.label}</p>
        </div>
        <div className="absolute -right-4 -bottom-4 opacity-0 group-hover:opacity-5 transition-opacity duration-500 pointer-events-none">
            <item.icon size={100} />
        </div>
    </motion.div>
);

// --- MAIN COMPONENT ---

export default function CyberSecurity() {
  // STATE
  const [kpiData, setKpiData] = useState([
    { id: 1, label: 'Phishing Blocked', sub: 'Last 24h', value: 1240, trend: -5, icon: FileWarning },
    { id: 2, label: 'Active Incidents', sub: 'Requiring Action', value: 3, trend: 2, icon: AlertOctagon },
    { id: 3, label: 'Account Health', sub: 'IAM Status', value: 98, trend: 1.2, icon: Lock },
    { id: 4, label: 'Network Risk', sub: 'Vulnerability Index', value: 'Low', trend: 0, icon: Wifi },
  ]);

  const [trendData, setTrendData] = useState(INITIAL_TREND);
  const [incidents, setIncidents] = useState([
    { id: 1, type: "Phishing Attempt", source: "SMS Gateway", time: "10m ago", severity: "Medium" },
    { id: 2, type: "Unusual Login", source: "IP: 192.168.x.x", time: "1h ago", severity: "High" },
  ]);

  // NEW FEATURE STATES
  const [terminalLogs, setTerminalLogs] = useState(["> System init...", "> Monitoring active."]); // Feature 1
  const [serverStatus, setServerStatus] = useState([ // Feature 2
      { name: "Firewall", status: "ok" }, { name: "Auth DB", status: "ok" }, { name: "Web Gateway", status: "warn" }, { name: "Backup", status: "ok" }
  ]);
  const [threatLevel, setThreatLevel] = useState("Level 3"); // Feature 3
  const [scanning, setScanning] = useState(true); // Feature 4 (Radar animation state)
  const [actionLoading, setActionLoading] = useState(null); // Feature 5

  // SIMULATION ENGINE
  useEffect(() => {
    const interval = setInterval(() => {
        // 1. Update Charts (Scrolling Effect)
        setTrendData(prev => {
            const newVal = getRandom(5, 50);
            return [...prev.slice(1), { day: prev[prev.length-1].day + 1, val: newVal }];
        });

        // 2. Update KPIs
        setKpiData(prev => prev.map(k => {
            if(k.label === 'Active Incidents') return {...k, value: Math.max(0, k.value + getRandom(-1, 1))};
            if(k.label === 'Phishing Blocked') return {...k, value: k.value + getRandom(0, 5)};
            return k;
        }));

        // 3. Random New Incident & Terminal Log
        if(Math.random() > 0.6) {
            const newThreat = THREAT_TYPES[getRandom(0, THREAT_TYPES.length - 1)];
            const newSource = SOURCES[getRandom(0, SOURCES.length - 1)];
            
            // Add to Incidents List
            const newInc = {
                id: Date.now(),
                type: newThreat,
                source: newSource,
                time: "Just now",
                severity: Math.random() > 0.7 ? "High" : "Medium"
            };
            setIncidents(prev => [newInc, ...prev].slice(0, 5));

            // Add to Terminal
            setTerminalLogs(prev => [`> [WARN] ${newThreat} detected from ${newSource}`, ...prev].slice(0, 8));
        }

        // 4. Update Threat Level based on activity
        setThreatLevel(trendData[trendData.length-1].val > 40 ? "DEFCON 2" : "DEFCON 3");

    }, 2000);

    return () => clearInterval(interval);
  }, [trendData]);

  // Action Handler (Feature 5)
  const handleQuickAction = (action) => {
      setActionLoading(action);
      setTerminalLogs(prev => [`> Initiating ${action}...`, ...prev]);
      setTimeout(() => {
          setActionLoading(null);
          setTerminalLogs(prev => [`> ${action} Completed successfully.`, ...prev]);
      }, 1500);
  };

  return (
    <PageLayout 
        title="Cyber Security" 
        subtitle="Threat Intelligence" 
        colorTheme="blue"
    >
        {/* HEADER CONTROLS */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-8">
            <div className="flex items-center gap-3">
                 <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-white border border-indigo-200 shadow-sm">
                    <div className="w-2 h-2 rounded-full bg-indigo-500 animate-pulse"></div>
                    <span className="text-xs font-semibold text-indigo-700 uppercase tracking-wide">Live Protection Active</span>
                </div>
                
                {/* FEATURE 3: THREAT LEVEL INDICATOR */}
                <div className={`flex items-center gap-2 px-3 py-1.5 rounded-full border shadow-sm ${threatLevel === 'DEFCON 2' ? 'bg-rose-100 border-rose-200 text-rose-700' : 'bg-emerald-100 border-emerald-200 text-emerald-700'}`}>
                    <Activity size={14} />
                    <span className="text-xs font-bold uppercase">{threatLevel}</span>
                </div>
            </div>
            
            {/* System Check Time */}
            <span className="text-xs text-zinc-400 font-mono">Sys Check: {new Date().toLocaleTimeString()}</span>
        </div>

        {/* KPI SECTION */}
        <section className="mb-8">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {kpiData.map((kpi) => (
                    <MetricCard key={kpi.id} item={{...kpi, value: kpi.label === 'Account Health' ? `${kpi.value}%` : kpi.value.toLocaleString()}} />
                ))}
            </div>
        </section>

        {/* MAIN GRID */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            
            {/* LEFT: DATA VISUALIZATION (8 Cols) */}
            <div className="lg:col-span-8 flex flex-col gap-8">
                
                {/* Main Threat Chart */}
                <div className="bg-white rounded-[2.5rem] p-8 shadow-sm border border-zinc-200">
                    <div className="flex justify-between items-center mb-8">
                        <div>
                            <h3 className="text-lg font-bold text-zinc-900 tracking-tight">Traffic Anomaly</h3>
                            <p className="text-xs text-zinc-500 uppercase tracking-wide">Inbound Packet Analysis</p>
                        </div>
                        {/* FEATURE 4: RADAR ANIMATION */}
                        <div className="flex items-center gap-2 px-3 py-1 bg-indigo-50 rounded-full text-indigo-700 text-xs font-bold relative overflow-hidden">
                            <Radar size={14} className={scanning ? "animate-spin" : ""} /> 
                            <span>Scanning...</span>
                        </div>
                    </div>
                    
                    <div className="h-[280px] w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={trendData}>
                                <defs>
                                    <linearGradient id="colorThreat" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3}/>
                                        <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f4f4f5" />
                                <XAxis dataKey="day" hide />
                                <Tooltip 
                                    contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)' }} 
                                    itemStyle={{ color: '#4f46e5', fontWeight: 'bold' }}
                                />
                                <Area 
                                    isAnimationActive={false}
                                    type="monotone" 
                                    dataKey="val" 
                                    stroke="#6366f1" 
                                    strokeWidth={3} 
                                    fillOpacity={1} 
                                    fill="url(#colorThreat)" 
                                />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Secondary Charts Row */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    
                    {/* Incident Types Bar */}
                    <div className="bg-white rounded-[2.5rem] p-6 shadow-sm border border-zinc-200">
                        <div className="flex items-center gap-2 mb-6">
                            <Activity size={16} className="text-indigo-500" />
                            <h4 className="text-sm font-bold text-zinc-900">Incident Breakdown</h4>
                        </div>
                        <div className="h-48">
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={INCIDENT_TYPES} layout="vertical">
                                    <XAxis type="number" hide />
                                    <YAxis dataKey="name" type="category" width={70} tick={{fontSize: 10}} axisLine={false} tickLine={false} />
                                    <Tooltip cursor={{fill: 'transparent'}} contentStyle={{ borderRadius: '12px', border: 'none' }} />
                                    <Bar dataKey="count" radius={[0, 4, 4, 0]} barSize={24}>
                                        {INCIDENT_TYPES.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={`rgba(99, 102, 241, ${1 - (index * 0.2)})`} />
                                        ))}
                                    </Bar>
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    </div>

                    {/* FEATURE 2: SERVER STATUS GRID */}
                    <div className="bg-white rounded-[2.5rem] p-6 shadow-sm border border-zinc-200">
                        <div className="flex items-center gap-2 mb-6">
                            <Server size={16} className="text-indigo-500" />
                            <h4 className="text-sm font-bold text-zinc-900">Infrastructure Health</h4>
                        </div>
                        <div className="grid grid-cols-2 gap-3">
                            {serverStatus.map((srv, i) => (
                                <div key={i} className="p-3 bg-zinc-50 rounded-xl border border-zinc-100 flex items-center justify-between">
                                    <span className="text-xs font-medium text-zinc-600">{srv.name}</span>
                                    <div className={`w-2 h-2 rounded-full ${srv.status === 'ok' ? 'bg-emerald-500' : 'bg-orange-500 animate-pulse'}`}></div>
                                </div>
                            ))}
                        </div>
                        <div className="mt-4 pt-4 border-t border-zinc-100 flex justify-center">
                            <span className="text-[10px] text-zinc-400 font-mono uppercase">All Systems Operational</span>
                        </div>
                    </div>

                </div>
            </div>

            {/* RIGHT: MONITOR & LOGS (4 Cols) */}
            <div className="lg:col-span-4 flex flex-col gap-6">
                
                {/* FEATURE 1: LIVE TERMINAL */}
                <div className="bg-zinc-950 text-green-500 rounded-[2.5rem] p-6 shadow-xl relative overflow-hidden font-mono text-xs border border-zinc-800">
                    <div className="flex items-center gap-2 mb-4 border-b border-zinc-800 pb-2">
                        <Terminal size={14} />
                        <span className="font-bold">SIEM_CONSOLE_V4</span>
                    </div>
                    <div className="space-y-1 h-[150px] overflow-hidden relative">
                        <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 to-transparent pointer-events-none"></div>
                        <AnimatePresence>
                        {terminalLogs.map((log, i) => (
                            <motion.div 
                                key={i}
                                initial={{ opacity: 0, x: -10 }}
                                animate={{ opacity: 1 - (i * 0.1), x: 0 }}
                                className="truncate"
                            >
                                {log}
                            </motion.div>
                        ))}
                        </AnimatePresence>
                    </div>
                </div>

                {/* FEATURE 5: QUICK ACTIONS */}
                <div className="bg-white border border-zinc-200 rounded-[2.5rem] p-6 shadow-sm">
                    <h4 className="font-bold text-zinc-900 mb-4 text-sm">Quick Response</h4>
                    <div className="space-y-3">
                        <button 
                            onClick={() => handleQuickAction('Lockdown Protocol')}
                            className="w-full py-3 px-4 bg-rose-50 text-rose-700 hover:bg-rose-100 rounded-xl flex items-center justify-between transition-colors group"
                        >
                            <span className="text-xs font-bold uppercase flex items-center gap-2">
                                <Lock size={14} /> Global Lockdown
                            </span>
                            {actionLoading === 'Lockdown Protocol' ? <div className="w-4 h-4 border-2 border-rose-500 border-t-transparent rounded-full animate-spin"/> : <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform"/>}
                        </button>
                        <button 
                            onClick={() => handleQuickAction('Flush DNS Cache')}
                            className="w-full py-3 px-4 bg-zinc-50 text-zinc-700 hover:bg-zinc-100 rounded-xl flex items-center justify-between transition-colors group"
                        >
                            <span className="text-xs font-bold uppercase flex items-center gap-2">
                                <Zap size={14} /> Flush DNS
                            </span>
                            {actionLoading === 'Flush DNS Cache' ? <div className="w-4 h-4 border-2 border-zinc-500 border-t-transparent rounded-full animate-spin"/> : <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform"/>}
                        </button>
                    </div>
                </div>

                {/* Incident Log */}
                <div className="bg-white border border-zinc-200 rounded-[2.5rem] p-6 shadow-sm flex-1">
                    <div className="flex items-center justify-between mb-6 px-2">
                        <h3 className="text-lg font-bold text-zinc-900 tracking-tight">Recent Logs</h3>
                        <div className="w-2 h-2 bg-indigo-500 rounded-full animate-ping"></div>
                    </div>
                    
                    <div className="space-y-4">
                        <AnimatePresence>
                        {incidents.map((inc) => (
                            <motion.div 
                                layout
                                key={inc.id} 
                                initial={{ opacity: 0, y: -20 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="flex gap-4 items-start p-2 hover:bg-zinc-50 rounded-2xl transition-colors cursor-pointer group"
                            >
                                <div className={`p-2.5 rounded-xl mt-0.5 shrink-0 ${
                                    inc.severity === 'High' ? 'bg-rose-50 text-rose-500' : 'bg-orange-50 text-orange-500'
                                }`}>
                                    {inc.severity === 'High' ? <AlertTriangle size={16} /> : <Shield size={16} />}
                                </div>
                                <div className="flex-1 min-w-0">
                                    <div className="flex justify-between items-start">
                                        <p className="text-sm font-bold text-zinc-900 truncate">{inc.type}</p>
                                        <span className="text-[10px] text-zinc-400 whitespace-nowrap">{inc.time}</span>
                                    </div>
                                    <p className="text-[11px] text-zinc-500 mt-0.5 flex items-center gap-1">
                                        <Server size={10} /> {inc.source}
                                    </p>
                                </div>
                            </motion.div>
                        ))}
                        </AnimatePresence>
                    </div>
                </div>

            </div>
        </div>
    </PageLayout>
  );
}