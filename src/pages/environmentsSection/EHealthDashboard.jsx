import React, { useState, useEffect, useMemo } from 'react';
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
  Wifi,
  X,
  Clock
} from 'lucide-react';

import PageLayout from '../../components/PageLayout'; 

// --- MOCK DATA GENERATORS ---
const INITIAL_HOSPITALS = [
  { name: 'Tasik General', cap: 92, status: 'Critical' },
  { name: 'City Medical Ctr', cap: 45, status: 'Stable' },
  { name: 'West Wing Clinic', cap: 68, status: 'Moderate' },
  { name: 'Childrens Hosp', cap: 30, status: 'Stable' },
];

const INITIAL_DOCTORS = [
  { id: 1, name: 'Dr. Sarah', spec: 'General', status: 'Online' },
  { id: 2, name: 'Dr. James', spec: 'Dental', status: 'Busy' },
  { id: 3, name: 'Dr. Emily', spec: 'Cardio', status: 'Offline' },
  { id: 4, name: 'Dr. Michael', spec: 'Vax', status: 'Online' },
];

// --- SUB-COMPONENTS ---

const SectionHeader = ({ icon: Icon, title, action, onAction }) => (
  <div className="flex items-center justify-between mb-4 md:mb-6 px-2 border-b border-zinc-200/60 pb-4">
    <div className="flex items-center gap-3">
      <div className="p-1.5 bg-teal-50 rounded-lg text-teal-600">
        <Icon size={18} />
      </div>
      <h3 className="text-base md:text-lg font-bold text-zinc-900 tracking-tight">{title}</h3>
    </div>
    {action && (
        <button 
            onClick={onAction} 
            className="text-[10px] md:text-xs font-bold text-teal-600 hover:text-teal-700 uppercase tracking-wider"
        >
            {action}
        </button>
    )}
  </div>
);

const TrendBadge = ({ value, invert = false }) => {
  const isPositive = invert ? value < 0 : value > 0;
  return (
    <div className={`flex items-center gap-1 text-[10px] md:text-xs font-medium px-2 py-1 rounded-full ${
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
    // RESPONSIVE: Height and padding adjustments
    className="bg-white rounded-3xl p-4 md:p-5 h-40 md:h-48 flex flex-col justify-between shadow-sm hover:shadow-xl hover:shadow-teal-500/5 border border-zinc-100 transition-all duration-300 group cursor-pointer relative overflow-hidden"
  >
    <div className="flex justify-between items-start z-10">
      <div className={`w-8 h-8 md:w-10 md:h-10 rounded-2xl flex items-center justify-center transition-colors duration-300 bg-zinc-50 text-zinc-900 group-hover:bg-teal-600 group-hover:text-white`}>
        <item.icon size={18} className="md:w-5 md:h-5" />
      </div>
      <div className="w-6 h-6 md:w-7 md:h-7 rounded-full bg-zinc-100 flex items-center justify-center text-zinc-400 group-hover:text-teal-600 transition-colors">
        <ArrowUpRight size={12} className="md:w-[14px]" />
      </div>
    </div>
    <div className="z-10 mt-auto">
      <div className="flex justify-between items-end mb-1">
        {/* RESPONSIVE: Text size */}
        <h3 className="text-2xl md:text-3xl font-bold text-zinc-900 tracking-tight leading-none group-hover:text-teal-600 transition-colors">
          {item.value}
        </h3>
        <TrendBadge value={item.trend} invert={item.label === 'Outbreaks' || item.label === 'Hosp. Capacity'} />
      </div>
      <p className="text-[10px] md:text-xs text-zinc-500 font-medium uppercase tracking-wide truncate">{item.label}</p>
    </div>
    <div className="absolute -right-4 -bottom-4 opacity-0 group-hover:opacity-5 transition-opacity duration-500 pointer-events-none">
      <item.icon size={80} className="md:w-[100px] md:h-[100px]" />
    </div>
  </motion.div>
);

// --- MODAL FOR BOOKING ---
const BookingModal = ({ doctor, onClose, onConfirm }) => {
    if (!doctor) return null;
    return (
        <motion.div 
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4"
        >
            <motion.div 
                initial={{ scale: 0.9, y: 20 }} animate={{ scale: 1, y: 0 }}
                // RESPONSIVE: Width adjustment
                className="bg-white rounded-3xl p-5 md:p-6 w-full max-w-sm shadow-2xl"
            >
                <div className="flex justify-between items-center mb-6">
                    <h3 className="text-lg md:text-xl font-bold">Confirm Booking</h3>
                    <button onClick={onClose} className="p-2 bg-zinc-100 rounded-full hover:bg-zinc-200"><X size={16}/></button>
                </div>
                <div className="mb-6 bg-teal-50 p-4 rounded-2xl flex items-center gap-4">
                    <div className="w-12 h-12 bg-teal-200 rounded-full flex items-center justify-center text-teal-800 font-bold text-lg">
                        {doctor.name.charAt(4)}
                    </div>
                    <div>
                        <p className="font-bold text-zinc-900">{doctor.name}</p>
                        <p className="text-xs text-zinc-500">{doctor.spec} Specialist</p>
                    </div>
                </div>
                <div className="space-y-3 mb-6">
                    <div className="flex justify-between text-sm">
                        <span className="text-zinc-500">Date</span>
                        <span className="font-bold">Tomorrow, 10:00 AM</span>
                    </div>
                    <div className="flex justify-between text-sm">
                        <span className="text-zinc-500">Platform</span>
                        <span className="font-bold">Video Telemedicine</span>
                    </div>
                </div>
                <button 
                    onClick={() => onConfirm(doctor)}
                    className="w-full py-3 bg-teal-600 hover:bg-teal-700 text-white font-bold rounded-xl active:scale-95 transition-transform"
                >
                    Confirm Schedule
                </button>
            </motion.div>
        </motion.div>
    );
};

// --- VIEWS ---

const CitizenView = ({ 
    aqi, 
    appointments, 
    doctors, 
    records,
    onBookAppointment, 
    onSOS, 
    sosState 
}) => {
  const [aiInput, setAiInput] = useState({ age: '', symptoms: '' });
  const [aiResult, setAiResult] = useState(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [selectedDocForBooking, setSelectedDocForBooking] = useState(null);

  const handleAiCheck = () => {
    if(!aiInput.symptoms) return;
    setIsAnalyzing(true);
    setTimeout(() => {
      setIsAnalyzing(false);
      // Simple logic for simulation
      const text = aiInput.symptoms.toLowerCase();
      let res = { level: 'Low Risk', rec: 'Symptoms suggest mild seasonal allergies due to current Air Quality.' };
      
      if(text.includes('chest') || text.includes('heart') || text.includes('pain')) {
          res = { level: 'High Risk', rec: 'Potential cardiac issue detected. Please initiate SOS or visit ER immediately.' };
      } else if (text.includes('fever') || text.includes('hot')) {
          res = { level: 'Moderate Risk', rec: 'Signs of viral infection. Hydrate and monitor temperature.' };
      }

      setAiResult(res);
      setAiInput({ age: '', symptoms: '' }); // Reset input
    }, 2000);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 md:gap-6 min-h-[600px] relative">
      <AnimatePresence>
        {selectedDocForBooking && (
            <BookingModal 
                doctor={selectedDocForBooking} 
                onClose={() => setSelectedDocForBooking(null)}
                onConfirm={(d) => {
                    onBookAppointment(d);
                    setSelectedDocForBooking(null);
                }}
            />
        )}
      </AnimatePresence>
      
      {/* LEFT: ID & VITALS (4 Cols) */}
      <div className="lg:col-span-4 flex flex-col gap-4 md:gap-6">
        
        {/* Digital ID Card with SOS */}
        <motion.div 
          layout
          animate={{ 
            backgroundColor: sosState.active ? '#ef4444' : '#14b8a6',
            backgroundImage: sosState.active ? 'none' : 'linear-gradient(to bottom right, #14b8a6, #059669)'
          }}
          // RESPONSIVE: Height auto on mobile with min-height to fit content, fixed on desktop
          className={`relative h-auto min-h-[220px] md:h-64 rounded-[2rem] p-5 md:p-8 text-white shadow-xl overflow-hidden group transition-colors duration-500 ${!sosState.active && 'bg-gradient-to-br from-teal-500 to-emerald-600 shadow-teal-200/50'}`}
        >
          {!sosState.active ? (
            <>
              <div className="absolute top-0 right-0 w-32 md:w-48 h-32 md:h-48 bg-white/10 rounded-bl-full blur-2xl"></div>
              <div className="absolute bottom-0 left-0 w-24 md:w-32 h-24 md:h-32 bg-teal-400/20 rounded-tr-full blur-xl"></div>
              <div className="relative z-10 flex flex-col h-full justify-between gap-4">
                <div className="flex justify-between items-start">
                  <Shield className="w-8 h-8 md:w-10 md:h-10 opacity-90" />
                  <button 
                    onClick={() => onSOS(true)}
                    className="flex items-center gap-2 bg-red-500/20 backdrop-blur-md px-3 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-wider cursor-pointer hover:bg-red-500 hover:text-white transition-colors border border-red-500/30"
                  >
                    <Siren size={12} /> SOS
                  </button>
                </div>
                <div>
                  <p className="text-teal-100 text-[10px] md:text-xs font-bold uppercase tracking-widest mb-1">Universal Health ID</p>
                  <h2 className="text-2xl md:text-3xl font-bold tracking-tight mb-2 md:mb-4 flex items-center gap-3">
                    ALEXANDER S. <div className="w-2 h-2 rounded-full bg-white animate-pulse"></div>
                  </h2>
                  <div className="flex gap-6 md:gap-8 text-xs">
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
            <div className="relative z-10 flex flex-col h-full justify-center items-center text-center py-6">
              <motion.div 
                animate={{ scale: [1, 1.2, 1] }} 
                transition={{ repeat: Infinity, duration: 1 }}
                className="w-16 h-16 md:w-20 md:h-20 bg-white rounded-full flex items-center justify-center text-red-600 mb-4"
              >
                <Siren size={32} className="md:w-10 md:h-10" />
              </motion.div>
              <h2 className="text-xl md:text-2xl font-bold mb-2">EMERGENCY MODE</h2>
              <p className="text-white/80 text-sm mb-6">
                 {sosState.status === 'searching' ? 'Locating nearest unit...' : 
                  sosState.status === 'dispatched' ? 'Ambulance en route!' : 
                  'Unit Arrived.'}
              </p>
              {sosState.status === 'searching' && (
                  <button 
                    onClick={() => onSOS(false)}
                    className="px-6 py-2 bg-white/20 border border-white/50 rounded-full text-xs font-bold uppercase hover:bg-white hover:text-red-600 transition-colors"
                  >
                    Cancel SOS
                  </button>
              )}
            </div>
          )}
        </motion.div>

        {/* Vitals Cards */}
        <div className="grid grid-cols-2 gap-4">
          <div className="p-4 md:p-5 bg-blue-50 rounded-[2rem] border border-blue-100 relative overflow-hidden">
            <div className="text-[10px] text-blue-600 font-bold uppercase tracking-wider mb-2">Air Quality</div>
            <div className="flex items-center gap-2 text-blue-900 font-bold text-xl md:text-2xl">
              <Wind size={20} className="text-blue-500"/> {aqi}
            </div>
            <div className="text-[10px] text-blue-400 mt-1">PM 2.5 • {aqi > 50 ? 'Moderate' : 'Good'}</div>
          </div>
          <div className="p-4 md:p-5 bg-purple-50 rounded-[2rem] border border-purple-100">
            <div className="text-[10px] text-purple-600 font-bold uppercase tracking-wider mb-2">Insurance</div>
            <div className="text-purple-900 font-bold text-sm md:text-base">Active Premium</div>
            <div className="text-[10px] text-purple-400 mt-1">Next Bill: Mar 01</div>
          </div>
        </div>

        {/* AI Checker Card */}
        <div className="bg-gradient-to-b from-white to-teal-50/50 border border-teal-100 rounded-[2rem] p-5 md:p-6 shadow-sm flex-1">
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
                  disabled={isAnalyzing}
                />
                <textarea 
                  placeholder="Describe symptoms..." 
                  className="w-full p-3 bg-white border border-zinc-200 rounded-xl text-sm outline-none focus:border-teal-500 focus:ring-1 focus:ring-teal-500 transition-all min-h-[100px] resize-none"
                  value={aiInput.symptoms}
                  onChange={(e) => setAiInput({...aiInput, symptoms: e.target.value})}
                  disabled={isAnalyzing}
                ></textarea>
              </div>
              <button 
                onClick={handleAiCheck}
                disabled={isAnalyzing || !aiInput.symptoms}
                className={`w-full py-3 bg-zinc-900 text-white font-bold rounded-xl hover:bg-zinc-800 transition-all text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg shadow-zinc-900/10 ${isAnalyzing ? 'opacity-80' : ''}`}
              >
                {isAnalyzing ? <span className="animate-pulse">Processing...</span> : <>Run Analysis <ChevronRight size={14} /></>}
              </button>
            </div>
          ) : (
            <motion.div 
              initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
              className="h-full flex flex-col"
            >
              <div className={`p-4 rounded-2xl border mb-4 flex-1 ${aiResult.level === 'High Risk' ? 'bg-red-50 border-red-100' : 'bg-emerald-50 border-emerald-100'}`}>
                <div className="flex items-center gap-2 mb-3">
                  <div className={`p-1 rounded-full ${aiResult.level === 'High Risk' ? 'bg-red-100 text-red-600' : 'bg-emerald-100 text-emerald-600'}`}>
                    <CheckCircle2 size={14} />
                  </div>
                  <span className={`text-xs font-bold uppercase ${aiResult.level === 'High Risk' ? 'text-red-700' : 'text-emerald-700'}`}>Analysis Complete</span>
                </div>
                <div className="text-lg md:text-xl font-bold text-zinc-900 mb-2">{aiResult.level}</div>
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
      <div className="lg:col-span-8 flex flex-col gap-4 md:gap-6">
        
        {/* Upcoming Visits */}
        <div className="bg-white border border-zinc-200 rounded-[2rem] p-5 md:p-8 shadow-sm min-h-[200px]">
          <SectionHeader icon={Stethoscope} title="Upcoming Visits" action="See All" />
          <div className="space-y-4">
            {appointments.length === 0 ? (
                <div className="text-center py-8 text-zinc-400 text-sm">No upcoming appointments.</div>
            ) : (
                appointments.map(app => (
                    <motion.div layout key={app.id} className="group flex flex-row items-center gap-4 md:gap-6 p-4 border border-zinc-100 rounded-2xl hover:border-teal-100 hover:bg-teal-50/30 transition-all cursor-pointer">
                    <div className="text-center min-w-[60px] p-2 md:p-3 bg-zinc-50 rounded-xl group-hover:bg-white transition-colors shrink-0">
                        <span className="block text-[10px] md:text-xs font-bold text-teal-600 uppercase tracking-wider mb-0.5">{app.date.split(' ')[0]}</span>
                        <span className="block text-xl md:text-2xl font-bold text-zinc-900 leading-none">{app.date.split(' ')[1]}</span>
                    </div>
                    <div className="flex-1 min-w-0">
                        <h4 className="font-bold text-zinc-900 text-base md:text-lg mb-1 truncate">{app.doctor}</h4>
                        <div className="flex flex-wrap items-center gap-2 md:gap-3 text-xs text-zinc-500 font-medium">
                        <span className="flex items-center gap-1"><Activity size={12} className="text-teal-500" /> {app.type}</span>
                        <span className="hidden sm:inline w-1 h-1 bg-zinc-300 rounded-full"></span>
                        <span className="flex items-center gap-1"><Hospital size={12} className="text-teal-500" /> {app.hospital}</span>
                        <span className="hidden sm:inline w-1 h-1 bg-zinc-300 rounded-full"></span>
                        <span className="flex items-center gap-1"><Clock size={12} className="text-teal-500" /> {app.time}</span>
                        </div>
                    </div>
                    <div className="w-8 h-8 md:w-10 md:h-10 rounded-full border border-zinc-200 flex items-center justify-center text-zinc-300 group-hover:border-teal-200 group-hover:text-teal-600 transition-all shrink-0">
                        <ChevronRight size={18} className="md:w-5 md:h-5" />
                    </div>
                    </motion.div>
                ))
            )}
          </div>
        </div>

        {/* Booking & Services Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6 flex-1">
           {/* Booking */}
          <div className="bg-white border border-zinc-200 rounded-[2rem] p-5 md:p-8 shadow-sm flex flex-col">
            <SectionHeader icon={Calendar} title="Quick Booking" />
            <div className="flex-1 flex flex-col gap-4">
               <div className="grid grid-cols-2 gap-3">
                {doctors.map((doc, i) => (
                  <div 
                    key={doc.id} 
                    onClick={() => doc.status === 'Online' && setSelectedDocForBooking(doc)}
                    className={`p-3 rounded-xl border transition-all text-center relative overflow-hidden ${
                        doc.status === 'Online' 
                        ? 'bg-zinc-50 cursor-pointer hover:bg-teal-50 hover:border-teal-200' 
                        : 'bg-zinc-100 opacity-60 cursor-not-allowed border-transparent'
                    }`}
                  >
                    <div className="text-xs md:text-sm font-medium text-zinc-700">{doc.spec}</div>
                    <div className="text-[10px] text-zinc-400">{doc.name}</div>
                    <div className={`absolute top-2 right-2 w-2 h-2 rounded-full ${doc.status === 'Online' ? 'bg-green-500' : doc.status === 'Busy' ? 'bg-orange-500' : 'bg-zinc-300'}`}></div>
                  </div>
                ))}
               </div>
               <div className="mt-auto pt-4 text-center">
                 <p className="text-xs text-zinc-400 mb-2">Select an available specialist above</p>
                 <button className="w-full py-3 bg-zinc-100 text-zinc-400 font-bold rounded-xl text-xs uppercase tracking-wider flex items-center justify-center gap-2 cursor-default">
                   <Wifi size={14} /> Schedule Online
                 </button>
               </div>
            </div>
          </div>

          {/* Records */}
          <div className="bg-zinc-900 text-white rounded-[2rem] p-5 md:p-8 shadow-sm relative overflow-hidden flex flex-col">
            <div className="relative z-10">
              <h3 className="text-lg font-bold mb-6 flex items-center gap-2">
                <FileText size={18} className="text-teal-400" /> Medical Records
              </h3>
              <div className="space-y-4 max-h-[250px] overflow-y-auto pr-2 custom-scrollbar">
                {records.map((rec, i) => (
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
  <div className="space-y-6 md:space-y-8">
    
    {/* KPI SECTION */}
    <section className="grid grid-cols-2 md:grid-cols-3 gap-3 md:gap-4">
      {stats.map((stat, i) => (
        <MetricCard key={i} item={stat} />
      ))}
    </section>

    {/* ANALYTICS GRID */}
    <section className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      
      {/* HEATMAP & TRACKER */}
      <div className="lg:col-span-2">
        {/* RESPONSIVE: Map height reduced on mobile */}
        <div className="bg-white rounded-[2.5rem] p-2 shadow-sm border border-zinc-200 relative overflow-hidden h-[350px] md:h-[500px] group">
           {/* Map Container */}
           <div className="w-full h-full rounded-[2rem] bg-zinc-50 relative overflow-hidden">
             {/* Grid */}
             <div className="absolute inset-0 opacity-20 bg-[radial-gradient(#cbd5e1_1px,transparent_1px)] [background-size:20px_20px]"></div>
             
             {/* Heat Zones */}
             <motion.div animate={{ scale: [1, 1.1, 1], opacity: [0.5, 0.7, 0.5] }} transition={{ duration: 4, repeat: Infinity }} className="absolute top-1/4 left-1/3 w-48 md:w-64 h-48 md:h-64 bg-red-400/20 rounded-full blur-[60px] md:blur-[80px] mix-blend-multiply"></motion.div>
             <motion.div animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.5, 0.3] }} transition={{ duration: 5, repeat: Infinity }} className="absolute top-1/2 left-1/2 w-32 md:w-48 h-32 md:h-48 bg-teal-400/20 rounded-full blur-[40px] md:blur-[60px] mix-blend-multiply"></motion.div>

             {/* Controls Overlay */}
             <div className="absolute top-4 left-4 md:top-6 md:left-6 z-20">
               <div className="bg-white/90 backdrop-blur-md px-3 py-1.5 md:px-4 md:py-2 rounded-2xl border border-zinc-200 shadow-sm flex items-center gap-3">
                 <Map size={16} className="text-teal-600" />
                 <span className="text-[10px] md:text-xs font-bold text-zinc-900 uppercase tracking-wide">Live Response Map</span>
               </div>
             </div>

             {/* Hospital Markers */}
             {[{x:'30%',y:'40%', n:'Central'}, {x:'60%',y:'25%', n:'North'}, {x:'50%',y:'70%', n:'East'}].map((h,i) => (
               <div key={i} className="absolute group/marker cursor-pointer" style={{left:h.x, top:h.y}}>
                 <div className="relative flex items-center justify-center">
                   <div className="w-3 h-3 md:w-4 md:h-4 bg-white border-[3px] border-teal-500 rounded-full shadow-lg relative z-10"></div>
                   <div className="absolute top-full left-1/2 -translate-x-1/2 mt-2 md:mt-3 bg-zinc-900 text-white text-[9px] md:text-[10px] px-2 py-1 md:px-3 md:py-1.5 rounded-lg opacity-0 group-hover/marker:opacity-100 transition-all whitespace-nowrap z-20">
                     <span className="font-bold">{h.n} Hospital</span>
                   </div>
                 </div>
               </div>
             ))}

             {/* SOS Target (User Home) - Only visible when Active */}
             <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-0">
                 <div className="w-4 h-4 bg-blue-500/10 rounded-full border border-blue-200 flex items-center justify-center">
                    <div className="w-1 h-1 bg-blue-500 rounded-full"></div>
                 </div>
             </div>

             {/* Live Ambulance Markers */}
             {ambulances.map((amb) => (
               <motion.div 
                 key={amb.id}
                 className="absolute z-10"
                 animate={{ left: `${amb.x}%`, top: `${amb.y}%` }}
                 transition={{ duration: 2, ease: "linear" }}
               >
                 <div className="relative flex items-center justify-center group/amb">
                   <div className={`w-6 h-6 md:w-8 md:h-8 rounded-full flex items-center justify-center shadow-md border border-white text-white transition-colors duration-300 ${amb.status === 'dispatched' ? 'bg-red-600 animate-pulse' : amb.status === 'busy' ? 'bg-orange-500' : 'bg-blue-500'}`}>
                     <Siren size={12} className="md:w-[14px] md:h-[14px]" />
                   </div>
                   <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-1 px-2 py-1 bg-black/80 text-white text-[9px] rounded opacity-0 group-hover/amb:opacity-100 whitespace-nowrap">
                     Unit {amb.id} - {amb.status.toUpperCase()}
                   </div>
                 </div>
               </motion.div>
             ))}
           </div>
        </div>
      </div>

      {/* RIGHT COLUMN (1 Col) */}
      <div className="lg:col-span-1 flex flex-col gap-6">
        {/* Hospital List */}
        <div className="bg-white border border-zinc-200 rounded-[2.5rem] p-5 md:p-6 shadow-sm flex-1 flex flex-col">
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

        {/* Blood Bank Inventory */}
        <div className="bg-red-50 border border-red-100 rounded-[2.5rem] p-5 md:p-6 shadow-sm">
          <SectionHeader icon={Droplet} title="Blood Bank Levels" />
          {/* RESPONSIVE: 2 cols on mobile, 4 on desktop */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 md:gap-2">
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
  
  // SHARED DATA STATE
  const [hospitals, setHospitals] = useState(INITIAL_HOSPITALS);
  const [doctors, setDoctors] = useState(INITIAL_DOCTORS);
  const [appointments, setAppointments] = useState([
    { id: 101, doctor: 'Dr. Sarah', type: 'Checkup', date: 'Feb 14', time: '10:00 AM', hospital: 'Central General' }
  ]);
  const [records, setRecords] = useState([
    { date: 'Jan 10, 2024', name: 'Annual Physical', res: 'Normal' },
    { date: 'Nov 05, 2023', name: 'Flu Vaccine', res: 'Done' }
  ]);
  
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
  
  // Emergency State
  const [sosState, setSosState] = useState({ active: false, status: 'idle' });

  // ACTIONS
  const handleBookAppointment = (doctor) => {
    const newApp = {
        id: Date.now(),
        doctor: doctor.name,
        type: doctor.spec,
        date: 'Feb 13',
        time: '10:00 AM',
        hospital: 'City Medical'
    };
    setAppointments(prev => [newApp, ...prev]);
    // Set doctor to busy
    setDoctors(prev => prev.map(d => d.id === doctor.id ? {...d, status: 'Busy'} : d));
  };

  const handleSOS = (isActive) => {
      if(isActive) {
          setSosState({ active: true, status: 'searching' });
          // Simulate System Dispatch
          setTimeout(() => {
             // Find free ambulance
             const freeUnit = ambulances.find(a => a.status === 'free');
             if(freeUnit) {
                 setSosState({ active: true, status: 'dispatched' });
                 setAmbulances(prev => prev.map(a => a.id === freeUnit.id ? {...a, status: 'dispatched'} : a));
             }
          }, 1500);
      } else {
          setSosState({ active: false, status: 'idle' });
      }
  };

  // SIMULATION ENGINE
  useEffect(() => {
    const interval = setInterval(() => {
        // 1. Update Hospital Capacity & Blood Bank (Random fluctuation)
        setHospitals(prev => prev.map(h => ({
            ...h,
            cap: Math.min(100, Math.max(10, h.cap + Math.floor(Math.random() * 5) - 2))
        })));
        setBloodBank(prev => {
            const type = Object.keys(prev)[Math.floor(Math.random() * 4)];
            return { ...prev, [type]: Math.min(100, Math.max(10, prev[type] + Math.floor(Math.random() * 5) - 2)) };
        });

        // 2. AMBULANCE LOGIC (The "Brain")
        setAmbulances(prev => prev.map(a => {
            // Target coordinates
            let targetX = a.x;
            let targetY = a.y;

            if (a.status === 'free') {
                // Wander randomly
                targetX = Math.min(90, Math.max(10, a.x + (Math.random() * 10 - 5)));
                targetY = Math.min(90, Math.max(10, a.y + (Math.random() * 10 - 5)));
            } else if (a.status === 'dispatched') {
                // Move towards User (Center: 50, 50)
                const dx = 50 - a.x;
                const dy = 50 - a.y;
                const dist = Math.sqrt(dx*dx + dy*dy);
                
                if (dist < 5) {
                    // Arrived!
                    return { ...a, x: 50, y: 50, status: 'arrived_scene' }; // Temporary status
                } else {
                    // Move closer (fast)
                    targetX = a.x + (dx / dist) * 5; 
                    targetY = a.y + (dy / dist) * 5;
                }
            }

            return { ...a, x: targetX, y: targetY };
        }));

        // 3. Handle Arrival & Reset
        setAmbulances(prev => {
            const arrivedUnit = prev.find(a => a.status === 'arrived_scene');
            if (arrivedUnit) {
                // Logic to reset SOS and add record
                setSosState({ active: true, status: 'arrived' }); // Keep UI red but show arrived
                
                // Add record only once
                if(!records.some(r => r.name === 'Emergency Response')) {
                    setRecords(r => [{ date: 'Just Now', name: 'Emergency Response', res: 'Stabilized' }, ...r]);
                }

                // After delay, reset unit to 'busy' then 'free' logic could be added here
                // For this demo, we let it sit there briefly
            }
            return prev;
        });

    }, 2000);

    return () => clearInterval(interval);
  }, [records]);

  return (
    <PageLayout 
        title="Smart Health Platform" 
        subtitle="E-Health System" 
        colorTheme="teal"
    >
        {/* View Toggle Switch */}
        <div className="flex justify-end mb-6 md:mb-8">
            <div className="bg-white p-1 rounded-2xl shadow-sm border border-zinc-200 inline-flex">
                <button 
                    onClick={() => setViewMode('citizen')}
                    className={`flex items-center gap-2 px-4 md:px-6 py-2 md:py-2.5 rounded-xl text-[10px] md:text-xs font-bold uppercase tracking-wider transition-all ${viewMode === 'citizen' ? 'bg-teal-50 text-teal-700 shadow-sm' : 'text-zinc-400 hover:text-zinc-600'}`}
                >
                    <User size={14} /> Citizen
                </button>
                <button 
                    onClick={() => setViewMode('admin')}
                    className={`flex items-center gap-2 px-4 md:px-6 py-2 md:py-2.5 rounded-xl text-[10px] md:text-xs font-bold uppercase tracking-wider transition-all ${viewMode === 'admin' ? 'bg-zinc-900 text-white shadow-sm' : 'text-zinc-400 hover:text-zinc-600'}`}
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
                    <CitizenView 
                        aqi={aqi} 
                        appointments={appointments}
                        doctors={doctors}
                        records={records}
                        onBookAppointment={handleBookAppointment}
                        onSOS={handleSOS}
                        sosState={sosState}
                    />
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