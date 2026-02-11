import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Heart, 
  Activity, 
  Calendar, 
  Shield, 
  QrCode, 
  Stethoscope, 
  Map, 
  Users, 
  Thermometer, 
  AlertCircle, 
  CheckCircle2, 
  ChevronRight,
  Search,
  FileText,
  User,
  Hospital,
  ArrowRight,
  ArrowUpRight,
  Microscope,
  Pill,
  Syringe,
  Siren,
  Wind,
  Droplet,
  Wifi
} from 'lucide-react';

import PageLayout from '../../components/PageLayout'; 

// --- MOCK DATA GENERATORS ---
const INITIAL_HOSPITALS = [
    { name: 'Tasik General', cap: 92, status: 'Critical' },
    { name: 'City Medical Ctr', cap: 45, status: 'Stable' },
    { name: 'West Wing Clinic', cap: 68, status: 'Moderate' },
    { name: 'Childrens Hosp', cap: 30, status: 'Stable' },
];

const DOCTORS = [
    { name: 'Dr. Sarah', spec: 'General', status: 'Online' },
    { name: 'Dr. James', spec: 'Dental', status: 'Busy' },
    { name: 'Dr. Emily', spec: 'Cardio', status: 'Offline' },
    { name: 'Dr. Michael', spec: 'Vax', status: 'Online' },
];

// --- SUB-COMPONENTS ---

const SectionHeader = ({ icon: Icon, title, action }) => (
    <div className="flex items-center justify-between mb-6 px-2 border-b border-zinc-200/60 pb-4">
        <div className="flex items-center gap-3">
            <div className="p-1.5 bg-teal-50 rounded-lg text-teal-600">
                <Icon size={18} />
            </div>
            <h3 className="text-lg font-bold text-zinc-900 tracking-tight">{title}</h3>
        </div>
        {action && <button className="text-xs font-bold text-teal-600 hover:text-teal-700 uppercase tracking-wider">{action}</button>}
    </div>
);

const TrendBadge = ({ value, invert = false }) => {
    const isPositive = invert ? value < 0 : value > 0;
    return (
        <div className={`flex items-center gap-1 text-xs font-medium px-2 py-1 rounded-full ${
            isPositive ? 'bg-emerald-50 text-emerald-700' : 'bg-red-50 text-red-600'
        }`}>
            {value > 0 ? <ArrowUpRight size={12} /> : <ArrowRight size={12} className="rotate-45" />}
            {Math.abs(value).toFixed(1)}%
        </div>
    );
};

const MetricCard = ({ item }) => (
    <motion.div
        layout
        whileHover={{ y: -4, scale: 1.02 }}
        className="bg-white rounded-3xl p-5 h-48 flex flex-col justify-between shadow-sm hover:shadow-xl hover:shadow-teal-500/5 border border-zinc-100 transition-all duration-300 group cursor-pointer relative overflow-hidden"
    >
        <div className="flex justify-between items-start z-10">
            <div className={`w-10 h-10 rounded-2xl flex items-center justify-center transition-colors duration-300 bg-zinc-50 text-zinc-900 group-hover:bg-teal-600 group-hover:text-white`}>
                <item.icon size={20} />
            </div>
            <div className="w-7 h-7 rounded-full bg-zinc-100 flex items-center justify-center text-zinc-400 group-hover:text-teal-600 transition-colors">
                <ArrowUpRight size={14} />
            </div>
        </div>
        <div className="z-10 mt-auto">
            <div className="flex justify-between items-end mb-1">
                <h3 className="text-3xl font-bold text-zinc-900 tracking-tight leading-none group-hover:text-teal-600 transition-colors">
                    {item.value}
                </h3>
                <TrendBadge value={item.trend} invert={item.label === 'Outbreaks' || item.label === 'Hosp. Capacity'} />
            </div>
            <p className="text-xs text-zinc-500 font-medium uppercase tracking-wide">{item.label}</p>
        </div>
        <div className="absolute -right-4 -bottom-4 opacity-0 group-hover:opacity-5 transition-opacity duration-500 pointer-events-none">
            <item.icon size={100} />
        </div>
    </motion.div>
);

// --- VIEWS ---

const CitizenView = ({ aqi }) => {
    const [aiInput, setAiInput] = useState({ age: '', symptoms: '' });
    const [aiResult, setAiResult] = useState(null);
    const [isAnalyzing, setIsAnalyzing] = useState(false);
    const [sosMode, setSosMode] = useState(false); // Feature 1 State

    const handleAiCheck = () => {
        setIsAnalyzing(true);
        setTimeout(() => {
            setIsAnalyzing(false);
            setAiResult({ level: 'Low Risk', rec: 'Symptoms suggest mild seasonal allergies due to current Air Quality.' });
        }, 2000);
    };

    return (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 min-h-[600px]">
            
            {/* LEFT: ID & VITALS (4 Cols) */}
            <div className="lg:col-span-4 flex flex-col gap-6">
                
                {/* Digital ID Card (Updated with Feature 1: SOS) */}
                <motion.div 
                    layout
                    animate={{ 
                        backgroundColor: sosMode ? '#ef4444' : '#14b8a6',
                        backgroundImage: sosMode ? 'none' : 'linear-gradient(to bottom right, #14b8a6, #059669)'
                    }}
                    className={`relative h-64 rounded-[2rem] p-8 text-white shadow-xl overflow-hidden group transition-colors duration-500 ${!sosMode && 'bg-gradient-to-br from-teal-500 to-emerald-600 shadow-teal-200/50'}`}
                >
                    {!sosMode ? (
                        <>
                            <div className="absolute top-0 right-0 w-48 h-48 bg-white/10 rounded-bl-full blur-2xl"></div>
                            <div className="absolute bottom-0 left-0 w-32 h-32 bg-teal-400/20 rounded-tr-full blur-xl"></div>
                            <div className="relative z-10 flex flex-col h-full justify-between">
                                <div className="flex justify-between items-start">
                                    <Shield className="w-10 h-10 opacity-90" />
                                    <button 
                                        onClick={() => setSosMode(true)}
                                        className="flex items-center gap-2 bg-red-500/20 backdrop-blur-md px-3 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-wider cursor-pointer hover:bg-red-500 hover:text-white transition-colors border border-red-500/30"
                                    >
                                        <Siren size={12} /> SOS
                                    </button>
                                </div>
                                <div>
                                    <p className="text-teal-100 text-xs font-bold uppercase tracking-widest mb-1">Universal Health ID</p>
                                    <h2 className="text-3xl font-bold tracking-tight mb-4 flex items-center gap-3">
                                        ALEXANDER S. <div className="w-2 h-2 rounded-full bg-white animate-pulse"></div>
                                    </h2>
                                    <div className="flex gap-8 text-xs">
                                        <div>
                                            <span className="block opacity-60 mb-0.5">ID Number</span>
                                            <span className="font-mono text-sm tracking-wider">8829-1029-38</span>
                                        </div>
                                        <div>
                                            <span className="block opacity-60 mb-0.5">Blood Type</span>
                                            <span className="font-bold text-sm">O+</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </>
                    ) : (
                        <div className="relative z-10 flex flex-col h-full justify-center items-center text-center">
                            <motion.div 
                                animate={{ scale: [1, 1.2, 1] }} 
                                transition={{ repeat: Infinity, duration: 1 }}
                                className="w-20 h-20 bg-white rounded-full flex items-center justify-center text-red-600 mb-4"
                            >
                                <Siren size={40} />
                            </motion.div>
                            <h2 className="text-2xl font-bold mb-2">EMERGENCY MODE</h2>
                            <p className="text-white/80 text-sm mb-6">Broadcasting location to nearest medical unit...</p>
                            <button 
                                onClick={() => setSosMode(false)}
                                className="px-6 py-2 bg-white/20 border border-white/50 rounded-full text-xs font-bold uppercase hover:bg-white hover:text-red-600 transition-colors"
                            >
                                Cancel SOS
                            </button>
                        </div>
                    )}
                </motion.div>

                {/* Vitals Cards (Updated with Feature 2: Air Quality) */}
                <div className="grid grid-cols-2 gap-4">
                    <div className="p-5 bg-blue-50 rounded-[2rem] border border-blue-100 relative overflow-hidden">
                        <div className="text-[10px] text-blue-600 font-bold uppercase tracking-wider mb-2">Air Quality</div>
                        <div className="flex items-center gap-2 text-blue-900 font-bold text-2xl">
                            <Wind size={20} className="text-blue-500"/> {aqi}
                        </div>
                        <div className="text-[10px] text-blue-400 mt-1">PM 2.5 • {aqi > 50 ? 'Moderate' : 'Good'}</div>
                    </div>
                    <div className="p-5 bg-purple-50 rounded-[2rem] border border-purple-100">
                        <div className="text-[10px] text-purple-600 font-bold uppercase tracking-wider mb-2">Insurance</div>
                        <div className="text-purple-900 font-bold">Active Premium</div>
                        <div className="text-[10px] text-purple-400 mt-1">Next Bill: Mar 01</div>
                    </div>
                </div>

                {/* AI Checker Card */}
                <div className="bg-gradient-to-b from-white to-teal-50/50 border border-teal-100 rounded-[2rem] p-6 shadow-sm flex-1">
                    <SectionHeader icon={Activity} title="AI Symptom Check" />
                    
                    {!aiResult ? (
                        <div className="space-y-4">
                            <p className="text-xs text-zinc-500 leading-relaxed">Describe your symptoms to get an instant AI preliminary assessment.</p>
                            <div className="space-y-3">
                                <input 
                                    type="text" 
                                    placeholder="Age" 
                                    className="w-full p-3 bg-white border border-zinc-200 rounded-xl text-sm outline-none focus:border-teal-500 focus:ring-1 focus:ring-teal-500 transition-all"
                                    value={aiInput.age}
                                    onChange={(e) => setAiInput({...aiInput, age: e.target.value})}
                                />
                                <textarea 
                                    placeholder="Describe symptoms..." 
                                    className="w-full p-3 bg-white border border-zinc-200 rounded-xl text-sm outline-none focus:border-teal-500 focus:ring-1 focus:ring-teal-500 transition-all min-h-[100px] resize-none"
                                    value={aiInput.symptoms}
                                    onChange={(e) => setAiInput({...aiInput, symptoms: e.target.value})}
                                ></textarea>
                            </div>
                            <button 
                                onClick={handleAiCheck}
                                disabled={isAnalyzing}
                                className="w-full py-3 bg-zinc-900 text-white font-bold rounded-xl hover:bg-zinc-800 transition-all text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg shadow-zinc-900/10"
                            >
                                {isAnalyzing ? <span className="animate-pulse">Processing...</span> : <>Run Analysis <ChevronRight size={14} /></>}
                            </button>
                        </div>
                    ) : (
                        <motion.div 
                            initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                            className="h-full flex flex-col"
                        >
                            <div className="p-4 bg-emerald-50 rounded-2xl border border-emerald-100 mb-4 flex-1">
                                <div className="flex items-center gap-2 mb-3">
                                    <div className="p-1 bg-emerald-100 rounded-full text-emerald-600">
                                        <CheckCircle2 size={14} />
                                    </div>
                                    <span className="text-xs font-bold text-emerald-700 uppercase">Analysis Complete</span>
                                </div>
                                <div className="text-xl font-bold text-zinc-900 mb-2">{aiResult.level}</div>
                                <p className="text-xs text-zinc-600 leading-relaxed">{aiResult.rec}</p>
                            </div>
                            <button 
                                onClick={() => setAiResult(null)}
                                className="w-full py-3 bg-white border border-zinc-200 text-zinc-600 font-bold rounded-xl hover:bg-zinc-50 text-xs uppercase tracking-wider"
                            >
                                Check Another
                            </button>
                        </motion.div>
                    )}
                </div>
            </div>

            {/* RIGHT: APPOINTMENTS & SERVICES (8 Cols) */}
            <div className="lg:col-span-8 flex flex-col gap-6">
                
                {/* Upcoming Visits */}
                <div className="bg-white border border-zinc-200 rounded-[2rem] p-8 shadow-sm">
                    <SectionHeader icon={Stethoscope} title="Upcoming Visits" action="See All" />
                    <div className="space-y-4">
                        {[{ id: 1, doctor: 'Dr. Sarah Wilson', type: 'Cardiologist', date: 'Feb 14', time: '10:00 AM', hospital: 'Central General' }].map(app => (
                            <div key={app.id} className="group flex items-center gap-6 p-4 border border-zinc-100 rounded-2xl hover:border-teal-100 hover:bg-teal-50/30 transition-all cursor-pointer">
                                <div className="text-center min-w-[60px] p-3 bg-zinc-50 rounded-xl group-hover:bg-white transition-colors">
                                    <span className="block text-xs font-bold text-teal-600 uppercase tracking-wider mb-0.5">{app.date.split(' ')[0]}</span>
                                    <span className="block text-2xl font-bold text-zinc-900 leading-none">{app.date.split(' ')[1]}</span>
                                </div>
                                <div className="flex-1">
                                    <h4 className="font-bold text-zinc-900 text-lg mb-1">{app.doctor}</h4>
                                    <div className="flex items-center gap-3 text-xs text-zinc-500 font-medium">
                                        <span className="flex items-center gap-1"><Activity size={12} className="text-teal-500" /> {app.type}</span>
                                        <span className="w-1 h-1 bg-zinc-300 rounded-full"></span>
                                        <span className="flex items-center gap-1"><Hospital size={12} className="text-teal-500" /> {app.hospital}</span>
                                    </div>
                                </div>
                                <div className="w-10 h-10 rounded-full border border-zinc-200 flex items-center justify-center text-zinc-300 group-hover:border-teal-200 group-hover:text-teal-600 transition-all">
                                    <ChevronRight size={20} />
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Booking & Services Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 flex-1">
                     {/* Booking (Updated with Feature 3: Doctor Availability) */}
                    <div className="bg-white border border-zinc-200 rounded-[2rem] p-8 shadow-sm flex flex-col">
                        <SectionHeader icon={Calendar} title="Quick Booking" />
                        <div className="flex-1 flex flex-col gap-4">
                             <div className="grid grid-cols-2 gap-3">
                                {DOCTORS.map((doc, i) => (
                                    <div key={i} className="p-3 bg-zinc-50 rounded-xl cursor-pointer hover:bg-zinc-100 border border-transparent hover:border-zinc-200 transition-all text-center relative overflow-hidden">
                                        <div className="text-sm font-medium text-zinc-700">{doc.spec}</div>
                                        <div className="text-[10px] text-zinc-400">{doc.name}</div>
                                        <div className={`absolute top-2 right-2 w-2 h-2 rounded-full ${doc.status === 'Online' ? 'bg-green-500' : doc.status === 'Busy' ? 'bg-orange-500' : 'bg-zinc-300'}`}></div>
                                    </div>
                                ))}
                             </div>
                             <div className="mt-auto pt-4">
                                <button className="w-full py-3 bg-teal-600 hover:bg-teal-700 text-white font-bold rounded-xl shadow-lg shadow-teal-600/20 transition-all text-xs uppercase tracking-wider flex items-center justify-center gap-2">
                                    <Wifi size={14} /> Schedule Online
                                </button>
                             </div>
                        </div>
                    </div>

                    {/* Records */}
                    <div className="bg-zinc-900 text-white rounded-[2rem] p-8 shadow-sm relative overflow-hidden flex flex-col">
                        <div className="relative z-10">
                            <h3 className="text-lg font-bold mb-6 flex items-center gap-2">
                                <FileText size={18} className="text-teal-400" /> Medical Records
                            </h3>
                            <div className="space-y-4">
                                {[
                                    { date: 'Jan 10, 2024', name: 'Annual Physical', res: 'Normal' },
                                    { date: 'Nov 05, 2023', name: 'Flu Vaccine', res: 'Done' }
                                ].map((rec, i) => (
                                    <div key={i} className="flex items-center justify-between p-3 rounded-xl bg-white/5 hover:bg-white/10 transition-colors cursor-pointer border border-white/5">
                                        <div>
                                            <div className="text-sm font-bold text-zinc-100">{rec.name}</div>
                                            <div className="text-[10px] text-zinc-400 font-mono mt-0.5">{rec.date}</div>
                                        </div>
                                        <span className="text-[10px] font-bold bg-teal-500/20 text-teal-300 px-2 py-1 rounded">
                                            {rec.res}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        </div>
                        <div className="absolute top-0 right-0 w-48 h-48 bg-teal-500/10 rounded-full blur-3xl pointer-events-none"></div>
                        <div className="absolute bottom-0 left-0 w-32 h-32 bg-purple-500/10 rounded-full blur-3xl pointer-events-none"></div>
                    </div>
                </div>

            </div>
        </div>
    );
};

const AdminView = ({ stats, hospitals, ambulances, bloodBank }) => (
    <div className="space-y-8">
        
        {/* KPI SECTION (Dynamic) */}
        <section className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {stats.map((stat, i) => (
                <MetricCard key={i} item={stat} />
            ))}
        </section>

        {/* ANALYTICS GRID */}
        <section className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            
            {/* HEATMAP & TRACKER (2 Cols) (Updated with Feature 4: Ambulance Tracker) */}
            <div className="lg:col-span-2">
                <div className="bg-white rounded-[2.5rem] p-2 shadow-sm border border-zinc-200 relative overflow-hidden h-[500px] group">
                     {/* Map Container */}
                     <div className="w-full h-full rounded-[2rem] bg-zinc-50 relative overflow-hidden">
                        {/* Grid */}
                        <div className="absolute inset-0 opacity-20 bg-[radial-gradient(#cbd5e1_1px,transparent_1px)] [background-size:20px_20px]"></div>
                        
                        {/* Heat Zones (Animated) */}
                        <motion.div animate={{ scale: [1, 1.1, 1], opacity: [0.5, 0.7, 0.5] }} transition={{ duration: 4, repeat: Infinity }} className="absolute top-1/4 left-1/3 w-64 h-64 bg-red-400/20 rounded-full blur-[80px] mix-blend-multiply"></motion.div>
                        <motion.div animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.5, 0.3] }} transition={{ duration: 5, repeat: Infinity }} className="absolute top-1/2 left-1/2 w-48 h-48 bg-teal-400/20 rounded-full blur-[60px] mix-blend-multiply"></motion.div>

                        {/* Controls Overlay */}
                        <div className="absolute top-6 left-6 z-20">
                            <div className="bg-white/90 backdrop-blur-md px-4 py-2 rounded-2xl border border-zinc-200 shadow-sm flex items-center gap-3">
                                <Map size={16} className="text-teal-600" />
                                <span className="text-xs font-bold text-zinc-900 uppercase tracking-wide">Live Response Map</span>
                            </div>
                        </div>

                        {/* Hospital Markers */}
                        {[{x:'30%',y:'40%', n:'Central'}, {x:'60%',y:'25%', n:'North'}, {x:'50%',y:'70%', n:'East'}].map((h,i) => (
                            <div key={i} className="absolute group/marker cursor-pointer" style={{left:h.x, top:h.y}}>
                                <div className="relative flex items-center justify-center">
                                    <div className="w-4 h-4 bg-white border-[3px] border-teal-500 rounded-full shadow-lg relative z-10"></div>
                                    <div className="absolute top-full left-1/2 -translate-x-1/2 mt-3 bg-zinc-900 text-white text-[10px] px-3 py-1.5 rounded-lg opacity-0 group-hover/marker:opacity-100 transition-all whitespace-nowrap z-20">
                                        <span className="font-bold">{h.n} Hospital</span>
                                    </div>
                                </div>
                            </div>
                        ))}

                        {/* Feature 4: Live Ambulance Markers */}
                        {ambulances.map((amb) => (
                            <motion.div 
                                key={amb.id}
                                className="absolute z-10"
                                animate={{ left: `${amb.x}%`, top: `${amb.y}%` }}
                                transition={{ duration: 3, ease: "linear" }}
                            >
                                <div className="relative flex items-center justify-center group/amb">
                                    <div className={`w-8 h-8 rounded-full flex items-center justify-center shadow-md border border-white text-white ${amb.status === 'busy' ? 'bg-red-500' : 'bg-blue-500'}`}>
                                        <Siren size={14} />
                                    </div>
                                    <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-1 px-2 py-1 bg-black/80 text-white text-[9px] rounded opacity-0 group-hover/amb:opacity-100 whitespace-nowrap">
                                        Unit {amb.id}
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                     </div>
                </div>
            </div>

            {/* RIGHT COLUMN (1 Col) */}
            <div className="lg:col-span-1 flex flex-col gap-6">
                {/* Hospital List (Dynamic) */}
                <div className="bg-white border border-zinc-200 rounded-[2.5rem] p-6 shadow-sm flex-1 flex flex-col">
                    <SectionHeader icon={Hospital} title="Capacity Monitor" />
                    <div className="flex-1 overflow-y-auto space-y-5 pr-2 custom-scrollbar">
                        {hospitals.map((h, i) => (
                            <div key={i} className="group">
                                <div className="flex justify-between items-center mb-2">
                                    <span className="font-bold text-sm text-zinc-700">{h.name}</span>
                                    <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${h.cap > 90 ? 'bg-red-50 text-red-600' : 'bg-teal-50 text-teal-600'}`}>
                                        {h.cap}%
                                    </span>
                                </div>
                                <div className="h-2 w-full bg-zinc-100 rounded-full overflow-hidden">
                                    <motion.div 
                                        layout
                                        className={`h-full rounded-full transition-colors duration-500 ${h.cap > 90 ? 'bg-red-500' : h.cap > 75 ? 'bg-orange-400' : 'bg-teal-500'}`} 
                                        style={{width: `${h.cap}%`}}
                                    ></motion.div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Feature 5: Blood Bank Inventory */}
                <div className="bg-red-50 border border-red-100 rounded-[2.5rem] p-6 shadow-sm">
                    <SectionHeader icon={Droplet} title="Blood Bank Levels" />
                    <div className="grid grid-cols-4 gap-2">
                        {Object.entries(bloodBank).map(([type, level]) => (
                            <div key={type} className="flex flex-col items-center">
                                <div className="relative h-16 w-8 bg-red-100 rounded-full overflow-hidden border border-red-200">
                                    <motion.div 
                                        animate={{ height: `${level}%` }}
                                        className="absolute bottom-0 w-full bg-red-500"
                                    ></motion.div>
                                </div>
                                <span className="mt-2 text-xs font-bold text-zinc-700">{type}</span>
                                <span className="text-[10px] text-zinc-500">{level}%</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

        </section>
    </div>
);

// --- MAIN PAGE ---

export default function EHealthDashboard() {
  const [viewMode, setViewMode] = useState('citizen');
  
  // REAL-TIME STATE
  const [hospitals, setHospitals] = useState(INITIAL_HOSPITALS);
  const [aqi, setAqi] = useState(42);
  const [stats, setStats] = useState([
    { label: 'Hosp. Capacity', sub: 'Avg Occupancy', value: '72%', trend: -2, status: 'Normal', color: 'text-blue-600', icon: Hospital },
    { label: 'Vaccination', sub: 'Population Rate', value: '89.4%', trend: 0.5, status: 'Excellent', color: 'text-emerald-600', icon: Syringe },
    { label: 'Outbreaks', sub: 'Active Clusters', value: '2', trend: -1, status: 'Low Risk', color: 'text-orange-600', icon: AlertCircle },
  ]);
  const [ambulances, setAmbulances] = useState([
      { id: '101', x: 20, y: 30, status: 'free' },
      { id: '104', x: 60, y: 60, status: 'busy' },
      { id: '109', x: 80, y: 20, status: 'free' },
  ]);
  const [bloodBank, setBloodBank] = useState({ 'A+': 70, 'B+': 45, 'O+': 85, 'AB-': 20 });

  // SIMULATION ENGINE
  useEffect(() => {
    const interval = setInterval(() => {
        // 1. Update Hospital Capacity
        setHospitals(prev => prev.map(h => ({
            ...h,
            cap: Math.min(100, Math.max(10, h.cap + Math.floor(Math.random() * 5) - 2))
        })));

        // 2. Update Stats
        setStats(prev => prev.map(s => {
            if(s.label === 'Hosp. Capacity') return {...s, value: `${Math.floor(Math.random() * 5) + 70}%`};
            return s;
        }));

        // 3. Update AQI (Feature 2)
        setAqi(prev => Math.min(150, Math.max(20, prev + Math.floor(Math.random() * 5) - 2)));

        // 4. Move Ambulances (Feature 4)
        setAmbulances(prev => prev.map(a => ({
            ...a,
            x: Math.min(90, Math.max(10, a.x + (Math.random() * 10 - 5))),
            y: Math.min(90, Math.max(10, a.y + (Math.random() * 10 - 5))),
        })));

        // 5. Update Blood Bank (Feature 5)
        setBloodBank(prev => {
            const type = Object.keys(prev)[Math.floor(Math.random() * 4)];
            return { ...prev, [type]: Math.min(100, Math.max(10, prev[type] + Math.floor(Math.random() * 5) - 2)) };
        });

    }, 3000);

    return () => clearInterval(interval);
  }, []);

  return (
    <PageLayout 
        title="Smart Health Platform" 
        subtitle="E-Health System" 
        colorTheme="teal"
    >
        {/* View Toggle Switch */}
        <div className="flex justify-end mb-8">
            <div className="bg-white p-1 rounded-2xl shadow-sm border border-zinc-200 inline-flex">
                <button 
                    onClick={() => setViewMode('citizen')}
                    className={`flex items-center gap-2 px-6 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-all ${viewMode === 'citizen' ? 'bg-teal-50 text-teal-700 shadow-sm' : 'text-zinc-400 hover:text-zinc-600'}`}
                >
                    <User size={14} /> Citizen
                </button>
                <button 
                    onClick={() => setViewMode('admin')}
                    className={`flex items-center gap-2 px-6 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-all ${viewMode === 'admin' ? 'bg-zinc-900 text-white shadow-sm' : 'text-zinc-400 hover:text-zinc-600'}`}
                >
                    <Shield size={14} /> Admin
                </button>
            </div>
        </div>

        {/* CONTENT AREA */}
        <AnimatePresence mode="wait">
            <motion.div
                key={viewMode}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.3 }}
            >
                {viewMode === 'citizen' ? (
                    <CitizenView aqi={aqi} />
                ) : (
                    <AdminView 
                        stats={stats} 
                        hospitals={hospitals} 
                        ambulances={ambulances}
                        bloodBank={bloodBank}
                    />
                )}
            </motion.div>
        </AnimatePresence>

    </PageLayout>
  );
}