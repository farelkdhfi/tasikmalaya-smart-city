import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Calendar as CalendarIcon, 
  MapPin, 
  Clock, 
  Users, 
  ChevronLeft, 
  ChevronRight, 
  Plus, 
  X,
  Ticket,
  AlertTriangle,
  Search,
  BarChart3,
  Music,
  Briefcase,
  Landmark,
  ArrowRight,
  Sun,
  CloudRain,
  Cloud,
  CheckCircle,
  Timer,
  Ban
} from 'lucide-react';

import PageLayout from '../../components/PageLayout'; 

// --- UTILS & MOCK DATA GENERATORS ---

const addDays = (date, days) => {
  const result = new Date(date);
  result.setDate(result.getDate() + days);
  return result;
};

const TODAY = new Date();

const CATEGORIES = [
  { id: 'all', label: 'All Events' },
  { id: 'public', label: 'Public', color: 'bg-blue-500', text: 'text-blue-600', bgSoft: 'bg-blue-50', icon: Users },
  { id: 'culture', label: 'Cultural', color: 'bg-violet-500', text: 'text-violet-600', bgSoft: 'bg-violet-50', icon: Music },
  { id: 'gov', label: 'Government', color: 'bg-slate-600', text: 'text-slate-600', bgSoft: 'bg-slate-50', icon: Landmark },
  { id: 'edu', label: 'Education', color: 'bg-emerald-500', text: 'text-emerald-600', bgSoft: 'bg-emerald-50', icon: Briefcase },
];

const INITIAL_EVENTS = [
  { 
    id: 1, 
    title: 'Tasikmalaya Marathon', 
    dateObj: addDays(TODAY, 2),
    time: '06:00 AM - 11:00 AM', 
    category: 'public', 
    location: 'Dadaha Stadium Complex', 
    capacity: 6000,
    registered: 5850, 
    impact: 'High Traffic',
    desc: 'Annual city marathon event promoting health and wellness. Several main roads will be closed.',
    image: 'bg-blue-100',
    weather: 'sunny',
    status: 'active'
  },
  { 
    id: 2, 
    title: 'Digital MSME Summit', 
    dateObj: addDays(TODAY, 5),
    time: '09:00 AM - 04:00 PM', 
    category: 'edu', 
    location: 'Grand Metro Hotel', 
    capacity: 500,
    registered: 450, 
    impact: 'Low Impact',
    desc: 'Workshop for local business owners to adopt digital payment systems and e-commerce.',
    image: 'bg-emerald-100',
    weather: 'cloudy',
    status: 'active'
  },
  { 
    id: 3, 
    title: 'Sunda Wiwitan Night', 
    dateObj: addDays(TODAY, 8),
    time: '07:00 PM - 10:00 PM', 
    category: 'culture', 
    location: 'Alun-Alun City Square', 
    capacity: 1500,
    registered: 1200, 
    impact: 'Moderate Traffic',
    desc: 'A night of traditional music, dance, and art performances celebrating local heritage.',
    image: 'bg-violet-100',
    weather: 'rainy',
    status: 'active'
  },
  { 
    id: 4, 
    title: 'Town Hall Meeting', 
    dateObj: addDays(TODAY, 14),
    time: '01:00 PM - 03:00 PM', 
    category: 'gov', 
    location: 'City Hall Auditorium', 
    capacity: 250,
    registered: 200, 
    impact: 'No Impact',
    desc: 'Public discussion regarding the new smart city infrastructure planning.',
    image: 'bg-slate-200',
    weather: 'sunny',
    status: 'active'
  },
];

// --- HELPER COMPONENTS ---

const Toast = ({ message, type, onClose }) => (
  <motion.div 
    initial={{ opacity: 0, y: -20, x: 20 }}
    animate={{ opacity: 1, y: 0, x: 0 }}
    exit={{ opacity: 0, x: 20 }}
    className={`fixed top-24 right-6 z-[100] px-4 py-3 rounded-xl shadow-lg flex items-center gap-3 border ${
      type === 'success' ? 'bg-white border-green-200 text-green-700' : 'bg-white border-red-200 text-red-700'
    }`}
  >
    {type === 'success' ? <CheckCircle size={18} className="text-green-500"/> : <AlertTriangle size={18} className="text-red-500"/>}
    <span className="text-sm font-bold">{message}</span>
    <button onClick={onClose}><X size={14} className="text-zinc-400 hover:text-zinc-600"/></button>
  </motion.div>
);

// Feature: Real-time Countdown
const CountdownWidget = ({ nextEvent }) => {
  const [timeLeft, setTimeLeft] = useState('');

  useEffect(() => {
    if (!nextEvent) return;

    const interval = setInterval(() => {
      const now = new Date();
      const diff = nextEvent.dateObj - now;

      if (diff <= 0) {
        setTimeLeft('Event Started');
        return;
      }

      const days = Math.floor(diff / (1000 * 60 * 60 * 24));
      const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((diff % (1000 * 60)) / 1000);

      setTimeLeft(`${days}d : ${hours}h : ${minutes}m : ${seconds}s`);
    }, 1000);

    return () => clearInterval(interval);
  }, [nextEvent]);

  if (!nextEvent) return null;

  return (
    <div className="bg-gradient-to-r from-violet-600 to-indigo-600 rounded-2xl p-4 text-white shadow-lg shadow-violet-500/20 mb-6 flex flex-col sm:flex-row items-center justify-between gap-4 sm:gap-0">
      <div className="flex items-center gap-3 w-full sm:w-auto">
        <div className="p-2 bg-white/10 rounded-lg animate-pulse shrink-0">
          <Timer size={20} />
        </div>
        <div>
          <p className="text-[10px] uppercase font-bold text-violet-200 tracking-wider">Next Event</p>
          <p className="font-bold text-sm truncate max-w-[200px]">{nextEvent.title}</p>
        </div>
      </div>
      <div className="text-left sm:text-right w-full sm:w-32 bg-white/10 sm:bg-transparent p-2 sm:p-0 rounded-lg sm:rounded-none">
        <p className="text-xs text-violet-200">Starting in</p>
        <p className="font-mono font-bold text-sm md:text-lg tabular-nums">{timeLeft || "Calculating..."}</p>
      </div>
    </div>
  );
};

const EventCard = ({ event, onClick }) => {
  const category = CATEGORIES.find(c => c.id === event.category);
  const dateStr = event.dateObj.getDate();
  const monthStr = event.dateObj.toLocaleString('default', { month: 'short' });
  const dayStr = event.dateObj.toLocaleString('default', { weekday: 'short' });
  
  // Logic: Live Occupancy
  const occupancy = (event.registered / event.capacity) * 100;
  const occupancyColor = occupancy >= 100 ? 'bg-red-600' : occupancy > 90 ? 'bg-orange-500' : 'bg-emerald-500';

  return (
    <motion.div 
      whileHover={{ y: -2, scale: 1.01 }}
      onClick={onClick}
      className={`group flex items-stretch bg-white border rounded-2xl overflow-hidden cursor-pointer hover:shadow-lg hover:shadow-violet-500/5 transition-all relative ${event.status === 'cancelled' ? 'border-red-200 opacity-70 grayscale-[0.8]' : 'border-zinc-200'}`}
    >
      {event.status === 'cancelled' && (
        <div className="absolute inset-0 z-10 bg-white/10 backdrop-blur-[1px] flex items-center justify-center pointer-events-none">
          <span className="bg-red-600 text-white px-3 py-1 rounded-full text-xs font-bold uppercase tracking-widest -rotate-12 shadow-lg border-2 border-white">Cancelled</span>
        </div>
      )}

      {/* Date Column - Responsive Width */}
      <div className={`w-20 md:w-24 flex flex-col items-center justify-center border-r border-zinc-100 transition-colors ${category.bgSoft} group-hover:bg-white shrink-0`}>
        <span className={`text-[10px] md:text-xs font-bold uppercase mb-0.5 ${category.text}`}>{monthStr}</span>
        <span className={`text-2xl md:text-3xl font-bold text-zinc-900`}>{dateStr}</span>
        <span className="text-[9px] md:text-[10px] font-medium text-zinc-400 mt-1">{dayStr}</span>
      </div>
      
      {/* Content - Responsive Padding */}
      <div className="flex-1 p-3 md:p-5 min-w-0">
        <div className="flex justify-between items-start mb-2">
          <span className={`px-2 py-0.5 rounded text-[9px] md:text-[10px] font-bold uppercase tracking-wide truncate ${category.bgSoft} ${category.text}`}>
            {category.label}
          </span>
          
          <div className="flex items-center gap-1.5 text-zinc-400 text-xs font-medium shrink-0" title="Forecast">
            {event.weather === 'sunny' && <Sun size={14} className="text-orange-400" />}
            {event.weather === 'rainy' && <CloudRain size={14} className="text-blue-400" />}
            {event.weather === 'cloudy' && <Cloud size={14} className="text-zinc-400" />}
            <span className="text-[10px] uppercase hidden sm:inline">{event.weather}</span>
          </div>
        </div>
        
        <h3 className="text-sm md:text-lg font-bold text-zinc-900 mb-2 leading-tight group-hover:text-violet-700 transition-colors truncate">
          {event.title}
        </h3>
        
        <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 text-xs text-zinc-500 mb-3">
          <span className="flex items-center gap-1.5"><Clock size={12} /> {event.time.split('-')[0]}</span>
          <span className="flex items-center gap-1.5 truncate"><MapPin size={12} /> {event.location.split(' ')[0]}...</span>
        </div>

        {/* Occupancy Bar */}
        <div className="w-full h-1.5 bg-zinc-100 rounded-full overflow-hidden flex items-center">
          <motion.div 
            initial={{ width: 0 }}
            animate={{ width: `${occupancy}%` }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            className={`h-full ${occupancyColor}`} 
          />
        </div>
        <div className="flex justify-between mt-1">
          <span className="text-[9px] text-zinc-400 font-bold uppercase tracking-wider">{event.registered} / {event.capacity} Filled</span>
          {occupancy >= 100 && <span className="text-[9px] text-red-600 font-bold uppercase">Sold Out</span>}
        </div>
      </div>
    </motion.div>
  )
};

// --- MAIN COMPONENT ---

export default function CityEventsDashboard() {
  const [isAdmin, setIsAdmin] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  
  // State for Dynamic Data
  const [currentDate, setCurrentDate] = useState(new Date()); 
  const [events, setEvents] = useState(INITIAL_EVENTS);
  const [selectedDateFilter, setSelectedDateFilter] = useState(null);
  const [toast, setToast] = useState(null);

  // LOGIC: Calendar Generation
  const getDaysInMonth = (date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const days = new Date(year, month + 1, 0).getDate();
    const firstDay = new Date(year, month, 1).getDay();
    
    const daysArray = Array(firstDay).fill(null); 
    for (let i = 1; i <= days; i++) {
      daysArray.push(new Date(year, month, i));
    }
    return daysArray;
  };

  const calendarDays = getDaysInMonth(currentDate);

  // LOGIC: Filtering
  const filteredEvents = events.filter(e => {
      const matchesCategory = selectedCategory === 'all' || e.category === selectedCategory;
      const matchesSearch = e.title.toLowerCase().includes(searchQuery.toLowerCase()) || e.location.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesDate = selectedDateFilter 
        ? e.dateObj.toDateString() === selectedDateFilter
        : true;
      return matchesCategory && matchesSearch && matchesDate;
  });

  // LOGIC: Sorting (Nearest date first)
  const sortedEvents = [...filteredEvents].sort((a, b) => a.dateObj - b.dateObj);
  const nextActiveEvent = sortedEvents.find(e => e.status === 'active' && e.dateObj > new Date());

  // Handler: Change Month
  const changeMonth = (offset) => {
      const newDate = new Date(currentDate.setMonth(currentDate.getMonth() + offset));
      setCurrentDate(new Date(newDate));
      setSelectedDateFilter(null); 
  };

  // Handler: Register Event
  const handleRegister = () => {
      if(!selectedEvent) return;
      
      if(selectedEvent.registered >= selectedEvent.capacity) {
        setToast({ message: 'Event is fully booked!', type: 'error' });
        setTimeout(() => setToast(null), 3000);
        return;
      }

      // Update State Logic
      const updatedEvents = events.map(e => 
          e.id === selectedEvent.id ? {...e, registered: e.registered + 1} : e
      );
      setEvents(updatedEvents);
      setSelectedEvent(prev => ({...prev, registered: prev.registered + 1}));
      
      setToast({ message: 'Registration Successful!', type: 'success' });
      setTimeout(() => setToast(null), 3000);
  };

  // Handler: Admin Toggle Status
  const toggleEventStatus = () => {
      if(!selectedEvent) return;
      const newStatus = selectedEvent.status === 'active' ? 'cancelled' : 'active';
      
      const updatedEvents = events.map(e => 
          e.id === selectedEvent.id ? {...e, status: newStatus} : e
      );
      setEvents(updatedEvents);
      setSelectedEvent(prev => ({...prev, status: newStatus}));
      
      setToast({ 
          message: `Event ${newStatus === 'active' ? 'Restored' : 'Cancelled'}`, 
          type: newStatus === 'active' ? 'success' : 'error' 
      });
      setTimeout(() => setToast(null), 3000);
  };

  return (
    <PageLayout 
      title="City Agenda & Events" 
      subtitle="Public Relations" 
      colorTheme="violet"
    >
      <AnimatePresence>
        {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
      </AnimatePresence>

      {/* HEADER CONTROLS - RESPONSIVE STACK */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
        <div className="relative w-full md:w-96 group">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400 group-focus-within:text-violet-600 transition-colors" />
          <input 
            type="text" 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search events, locations..." 
            className="w-full pl-10 pr-4 py-3 bg-white rounded-2xl border border-zinc-200 shadow-sm outline-none focus:border-violet-500 focus:ring-1 focus:ring-violet-500 transition-all text-sm"
          />
        </div>

        <div className="flex w-full md:w-auto bg-white p-1 rounded-2xl border border-zinc-200 shadow-sm">
          <button 
            onClick={() => setIsAdmin(false)}
            className={`flex-1 md:flex-none px-5 py-2 rounded-xl text-xs font-bold uppercase tracking-wide transition-all ${!isAdmin ? 'bg-violet-50 text-violet-700' : 'text-zinc-400 hover:text-zinc-600'}`}
          >
            Public
          </button>
          <button 
            onClick={() => setIsAdmin(true)}
            className={`flex-1 md:flex-none px-5 py-2 rounded-xl text-xs font-bold uppercase tracking-wide transition-all ${isAdmin ? 'bg-zinc-900 text-white shadow-md' : 'text-zinc-400 hover:text-zinc-600'}`}
          >
            Admin
          </button>
        </div>
      </div>

      {/* MAIN GRID */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-start">
        
        {/* LEFT: CALENDAR (7 cols) */}
        <div className="lg:col-span-7 flex flex-col gap-6 lg:gap-8 order-2 lg:order-1">
          <div className="bg-white rounded-[2rem] md:rounded-[2.5rem] border border-zinc-200 p-4 md:p-8 shadow-sm min-h-[400px] md:min-h-[600px] flex flex-col">
            
            {/* Calendar Header */}
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl md:text-2xl font-bold text-zinc-900 tracking-tight">
                {currentDate.toLocaleString('default', { month: 'long', year: 'numeric' })}
              </h2>
              <div className="flex gap-2">
                <button onClick={() => changeMonth(-1)} className="w-8 h-8 flex items-center justify-center rounded-full border border-zinc-100 hover:bg-zinc-50 text-zinc-400 hover:text-zinc-600 transition-colors"><ChevronLeft size={18} /></button>
                <button onClick={() => changeMonth(1)} className="w-8 h-8 flex items-center justify-center rounded-full border border-zinc-100 hover:bg-zinc-50 text-zinc-400 hover:text-zinc-600 transition-colors"><ChevronRight size={18} /></button>
              </div>
            </div>

            {/* Category Filter - Scrollable on mobile */}
            <div className="flex gap-2 overflow-x-auto pb-4 scrollbar-hide mb-4 -mx-4 px-4 md:mx-0 md:px-0">
              {CATEGORIES.map(cat => (
                <button 
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.id)}
                  className={`whitespace-nowrap px-4 py-2 rounded-full text-[10px] font-bold uppercase tracking-wider border transition-all
                    ${selectedCategory === cat.id 
                    ? 'bg-zinc-900 text-white border-zinc-900' 
                    : 'bg-white text-zinc-500 border-zinc-200 hover:border-zinc-300'}`}
                >
                  {cat.label}
                </button>
              ))}
            </div>

            {/* Calendar Grid */}
            <div className="flex-1">
              <div className="grid grid-cols-7 mb-2 text-center border-b border-zinc-100 pb-2">
                {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(d => (
                  <div key={d} className="text-[9px] md:text-[10px] font-bold text-zinc-400 uppercase tracking-widest">{d}</div>
                ))}
              </div>
              <div className="grid grid-cols-7 auto-rows-fr gap-1 md:gap-2 h-full min-h-[300px] md:min-h-[400px]">
                {calendarDays.map((dateObj, i) => {
                  if (!dateObj) return <div key={i}></div>;
                  
                  const dateString = dateObj.toDateString();
                  const eventsForDay = events.filter(e => e.dateObj.toDateString() === dateString);
                  const isSelected = selectedDateFilter === dateString;
                  const isToday = new Date().toDateString() === dateString;

                  return (
                    <motion.div 
                      key={i}
                      whileHover={{ scale: 1.05 }}
                      onClick={() => {
                        if (eventsForDay.length > 0) setSelectedDateFilter(isSelected ? null : dateString);
                        else setSelectedDateFilter(null);
                      }}
                      className={`
                        relative p-1 md:p-2 rounded-xl md:rounded-2xl border transition-all cursor-pointer min-h-[50px] md:min-h-[80px] flex flex-col items-center md:items-start justify-between
                        ${isSelected 
                          ? 'bg-violet-50 border-violet-500 ring-1 ring-violet-200 z-10' 
                          : isToday ? 'bg-blue-50 border-blue-200' : 'bg-white border-zinc-100 hover:border-violet-200 hover:shadow-md'}
                      `}
                    >
                      <span className={`text-xs md:text-sm font-bold ${isSelected ? 'text-violet-700' : 'text-zinc-700'}`}>{dateObj.getDate()}</span>
                      
                      <div className="w-full mt-1 flex flex-col gap-1 items-center md:items-start">
                        {eventsForDay.map((ev, idx) => (
                          <div key={ev.id} className="w-full flex justify-center md:justify-start">
                            <div className={`h-1.5 w-1.5 md:w-8 rounded-full mb-1 ${
                              ev.category === 'public' ? 'bg-blue-500' : 
                              ev.category === 'culture' ? 'bg-violet-500' : 
                              ev.category === 'edu' ? 'bg-emerald-500' : 'bg-slate-500'
                            }`}></div>
                            <p className="text-[9px] font-semibold text-zinc-500 truncate w-full hidden md:block">
                              {ev.title}
                            </p>
                          </div>
                        ))}
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT: EVENT LIST / ADMIN (5 cols) */}
        <div className="lg:col-span-5 flex flex-col gap-6 order-1 lg:order-2">
          
          <CountdownWidget nextEvent={nextActiveEvent} />

          {/* Admin Analytics Card */}
          {isAdmin && (
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-zinc-900 rounded-[2rem] p-6 md:p-8 text-white relative overflow-hidden shadow-lg"
            >
              <div className="relative z-10">
                <div className="flex justify-between items-start mb-6">
                  <div>
                    <p className="text-violet-300 text-xs font-bold uppercase tracking-wider mb-1">Impact Analytics</p>
                    <h3 className="text-xl md:text-2xl font-bold">Total Attendance</h3>
                  </div>
                  <div className="p-2 bg-white/10 rounded-xl">
                    <BarChart3 size={20} />
                  </div>
                </div>
                <div className="flex gap-4 md:gap-8 items-end flex-wrap">
                  <div>
                    <span className="text-3xl md:text-4xl font-bold tracking-tight">
                      {(filteredEvents.reduce((acc, curr) => acc + curr.registered, 0) / 1000).toFixed(1)}k
                    </span>
                    <span className="text-[10px] block text-zinc-400 uppercase tracking-wider mt-1">Attendees</span>
                  </div>
                  <div className="h-10 w-px bg-white/10 hidden md:block"></div>
                  <div>
                    <span className="text-3xl md:text-4xl font-bold tracking-tight">{filteredEvents.length}</span>
                    <span className="text-[10px] block text-zinc-400 uppercase tracking-wider mt-1">Events</span>
                  </div>
                </div>
                <div className="mt-6 pt-6 border-t border-white/10 flex gap-4">
                  <button className="flex items-center gap-2 px-4 py-2 bg-violet-600 hover:bg-violet-700 rounded-xl text-xs font-bold uppercase tracking-wider transition-colors">
                    <Plus size={14} /> New Event
                  </button>
                </div>
              </div>
              {/* Decor */}
              <div className="absolute top-0 right-0 w-64 h-64 bg-violet-600/20 rounded-full blur-3xl pointer-events-none -mr-16 -mt-16"></div>
            </motion.div>
          )}

          <div className="flex justify-between items-center px-2">
            <h3 className="text-base md:text-lg font-bold text-zinc-900 tracking-tight">
              {selectedDateFilter ? `Events on ${new Date(selectedDateFilter).toLocaleDateString()}` : 'Upcoming Agenda'}
            </h3>
            {selectedDateFilter && (
              <button onClick={() => setSelectedDateFilter(null)} className="text-xs font-bold text-red-500 uppercase hover:underline">Clear Filter</button>
            )}
          </div>

          <div className="space-y-4 max-h-[600px] overflow-y-auto pr-2 custom-scrollbar">
            {sortedEvents.length > 0 ? (
              sortedEvents.map((event) => (
                <EventCard key={event.id} event={event} onClick={() => setSelectedEvent(event)} />
              ))
            ) : (
              <div className="text-center py-10 text-zinc-400 text-sm">No events found.</div>
            )}
          </div>

        </div>
      </div>

      {/* EVENT DETAIL MODAL */}
      <AnimatePresence>
        {selectedEvent && (
          <>
            {/* Backdrop */}
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedEvent(null)}
              className="fixed inset-0 bg-zinc-900/60 backdrop-blur-sm z-[60]"
            />
            
            {/* Modal - Responsive Width & Padding */}
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="fixed inset-0 m-auto z-[70] w-[95%] md:w-full max-w-2xl h-fit max-h-[90vh] overflow-y-auto p-0 md:p-4 no-scrollbar rounded-[2.5rem]"
            >
              <div className="bg-white rounded-[2rem] md:rounded-[2.5rem] shadow-2xl overflow-hidden relative">
                
                {/* Header Image Area */}
                <div className={`h-40 md:h-48 ${selectedEvent.image} relative ${selectedEvent.status === 'cancelled' && 'grayscale'}`}>
                  <button 
                    onClick={() => setSelectedEvent(null)}
                    className="absolute top-4 right-4 md:top-6 md:right-6 p-2 bg-white/40 backdrop-blur-md rounded-full hover:bg-white transition-colors"
                  >
                    <X size={20} className="text-zinc-900" />
                  </button>
                  <div className="absolute bottom-4 left-6 md:bottom-6 md:left-8">
                    <span className="px-3 py-1.5 bg-white/90 backdrop-blur rounded-lg text-[10px] font-bold uppercase tracking-wider text-zinc-900 shadow-sm">
                      {CATEGORIES.find(c => c.id === selectedEvent.category)?.label}
                    </span>
                  </div>
                </div>

                {/* Body */}
                <div className="p-6 md:p-8 space-y-6 md:space-y-8">
                  <div>
                    <div className="flex flex-col md:flex-row justify-between items-start gap-2">
                      <h2 className="text-2xl md:text-3xl font-bold text-zinc-900 mb-2 md:mb-3 tracking-tight leading-tight">{selectedEvent.title}</h2>
                      {selectedEvent.status === 'cancelled' && <span className="text-red-600 font-bold border border-red-200 bg-red-50 px-3 py-1 rounded-lg text-xs uppercase shrink-0">Cancelled</span>}
                    </div>
                    <p className="text-zinc-500 leading-relaxed text-sm">{selectedEvent.desc}</p>
                  </div>

                  {/* Info Grid - Responsive Cols */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 md:gap-4">
                    <div className="p-4 bg-zinc-50 rounded-2xl border border-zinc-100">
                      <div className="text-zinc-400 text-[10px] font-bold uppercase mb-1 flex items-center gap-1.5"><CalendarIcon size={12} /> Date</div>
                      <div className="font-bold text-zinc-900 text-sm">{selectedEvent.dateObj.toDateString()}</div>
                    </div>
                    <div className="p-4 bg-zinc-50 rounded-2xl border border-zinc-100">
                      <div className="text-zinc-400 text-[10px] font-bold uppercase mb-1 flex items-center gap-1.5"><Clock size={12} /> Time</div>
                      <div className="font-bold text-zinc-900 text-sm">{selectedEvent.time}</div>
                    </div>
                    <div className="p-4 bg-zinc-50 rounded-2xl border border-zinc-100">
                      <div className="text-zinc-400 text-[10px] font-bold uppercase mb-1 flex items-center gap-1.5"><Users size={12} /> Capacity</div>
                      <div className="font-bold text-zinc-900 text-sm">{selectedEvent.registered} / {selectedEvent.capacity}</div>
                    </div>
                    <div className={`p-4 rounded-2xl border ${selectedEvent.impact.includes('High') ? 'bg-red-50 border-red-100' : 'bg-emerald-50 border-emerald-100'}`}>
                      <div className={`text-[10px] font-bold uppercase mb-1 flex items-center gap-1.5 ${selectedEvent.impact.includes('High') ? 'text-red-500' : 'text-emerald-600'}`}>
                        <AlertTriangle size={12} /> Traffic Impact
                      </div>
                      <div className={`font-bold text-sm ${selectedEvent.impact.includes('High') ? 'text-red-700' : 'text-emerald-700'}`}>
                        {selectedEvent.impact}
                      </div>
                    </div>
                  </div>

                  {/* Location */}
                  <div className="flex items-center gap-4 p-4 rounded-2xl border border-zinc-200 bg-white">
                    <div className="w-12 h-12 bg-violet-50 rounded-xl flex items-center justify-center text-violet-600 shrink-0">
                      <MapPin size={24} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-xs font-bold text-zinc-400 uppercase tracking-wider mb-0.5">Location</div>
                      <div className="font-bold text-zinc-900 text-sm truncate">{selectedEvent.location}</div>
                    </div>
                    <button className="text-xs font-bold text-violet-600 hover:underline shrink-0">Get Directions</button>
                  </div>

                  {/* Action Buttons */}
                  <div className="pt-2">
                    {isAdmin ? (
                      <div className="grid grid-cols-2 gap-4">
                        <button 
                          onClick={toggleEventStatus}
                          className={`py-4 rounded-xl border font-bold transition-colors text-xs md:text-sm uppercase tracking-wide flex items-center justify-center gap-2
                          ${selectedEvent.status === 'active' 
                            ? 'border-red-200 text-red-600 hover:bg-red-50' 
                            : 'border-green-200 text-green-600 hover:bg-green-50'}`}
                        >
                          {selectedEvent.status === 'active' ? <><Ban size={16}/> Cancel Event</> : <><CheckCircle size={16}/> Restore Event</>}
                        </button>
                        <button className="py-4 rounded-xl bg-zinc-900 text-white font-bold shadow-lg hover:bg-zinc-800 transition-colors text-xs md:text-sm uppercase tracking-wide flex items-center justify-center gap-2">
                          <BarChart3 size={16} /> Analytics
                        </button>
                      </div>
                    ) : (
                      <button 
                        onClick={handleRegister}
                        disabled={selectedEvent.status === 'cancelled' || selectedEvent.registered >= selectedEvent.capacity}
                        className={`w-full py-4 font-bold rounded-2xl shadow-xl flex items-center justify-center gap-2 transition-all hover:scale-[1.01] text-xs md:text-sm uppercase tracking-wide
                        ${selectedEvent.status === 'cancelled' || selectedEvent.registered >= selectedEvent.capacity
                          ? 'bg-zinc-200 text-zinc-400 cursor-not-allowed shadow-none'
                          : 'bg-violet-600 hover:bg-violet-700 text-white shadow-violet-200'}`}
                      >
                        <Ticket size={18} /> 
                        {selectedEvent.status === 'cancelled' ? 'Event Cancelled' : 
                         selectedEvent.registered >= selectedEvent.capacity ? 'Sold Out' : 'Register for Event'}
                      </button>
                    )}
                  </div>

                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

    </PageLayout>
  );
}