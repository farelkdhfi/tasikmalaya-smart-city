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

// --- MOCK DATA (Enhanced) ---
const CATEGORIES = [
  { id: 'all', label: 'All Events' },
  { id: 'public', label: 'Public', color: 'bg-blue-500', text: 'text-blue-600', bgSoft: 'bg-blue-50', icon: Users },
  { id: 'culture', label: 'Cultural', color: 'bg-violet-500', text: 'text-violet-600', bgSoft: 'bg-violet-50', icon: Music },
  { id: 'gov', label: 'Government', color: 'bg-slate-600', text: 'text-slate-600', bgSoft: 'bg-slate-50', icon: Landmark },
  { id: 'edu', label: 'Education', color: 'bg-emerald-500', text: 'text-emerald-600', bgSoft: 'bg-emerald-50', icon: Briefcase },
];

// Initial Data with precise dates for logic
const INITIAL_EVENTS = [
  { 
    id: 1, 
    title: 'Tasikmalaya Marathon', 
    dateObj: new Date(2024, 9, 12), // Oct 12 2024
    time: '06:00 AM - 11:00 AM', 
    category: 'public', 
    location: 'Dadaha Stadium Complex', 
    capacity: 6000,
    registered: 5200, 
    impact: 'High Traffic',
    desc: 'Annual city marathon event promoting health and wellness. Several main roads will be closed.',
    image: 'bg-blue-100',
    weather: 'sunny',
    status: 'active'
  },
  { 
    id: 2, 
    title: 'Digital MSME Summit', 
    dateObj: new Date(2024, 9, 15),
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
    dateObj: new Date(2024, 9, 18),
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
    dateObj: new Date(2024, 9, 24),
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

// Feature 3: Toast Notification System
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

// Feature 2: Event Countdown Ticker
const CountdownWidget = ({ nextEvent }) => {
    if (!nextEvent) return null;
    return (
        <div className="bg-gradient-to-r from-violet-600 to-indigo-600 rounded-2xl p-4 text-white shadow-lg shadow-violet-500/20 mb-6 flex items-center justify-between">
            <div className="flex items-center gap-3">
                <div className="p-2 bg-white/10 rounded-lg animate-pulse">
                    <Timer size={20} />
                </div>
                <div>
                    <p className="text-[10px] uppercase font-bold text-violet-200 tracking-wider">Next Event</p>
                    <p className="font-bold text-sm">{nextEvent.title}</p>
                </div>
            </div>
            <div className="text-right">
                <p className="text-xs text-violet-200">Starting in</p>
                <p className="font-mono font-bold text-lg">2d : 14h : 30m</p>
            </div>
        </div>
    );
};

const EventCard = ({ event, onClick }) => {
    const category = CATEGORIES.find(c => c.id === event.category);
    const dateStr = event.dateObj.getDate();
    const monthStr = event.dateObj.toLocaleString('default', { month: 'short' });
    const dayStr = event.dateObj.toLocaleString('default', { weekday: 'short' });
    
    // Feature 5: Live Occupancy Bar Logic
    const occupancy = (event.registered / event.capacity) * 100;
    const occupancyColor = occupancy > 90 ? 'bg-red-500' : occupancy > 70 ? 'bg-orange-500' : 'bg-emerald-500';

    return (
        <motion.div 
            whileHover={{ y: -2, scale: 1.01 }}
            onClick={onClick}
            className={`group flex items-stretch bg-white border rounded-2xl overflow-hidden cursor-pointer hover:shadow-lg hover:shadow-violet-500/5 transition-all relative ${event.status === 'cancelled' ? 'border-red-200 opacity-70 grayscale-[0.5]' : 'border-zinc-200'}`}
        >
            {event.status === 'cancelled' && (
                <div className="absolute inset-0 z-10 bg-white/10 backdrop-blur-[1px] flex items-center justify-center">
                    <span className="bg-red-600 text-white px-3 py-1 rounded-full text-xs font-bold uppercase tracking-widest -rotate-12 shadow-lg border-2 border-white">Cancelled</span>
                </div>
            )}

            {/* Date Column */}
            <div className={`w-24 flex flex-col items-center justify-center border-r border-zinc-100 transition-colors ${category.bgSoft} group-hover:bg-white`}>
                <span className={`text-xs font-bold uppercase mb-0.5 ${category.text}`}>{monthStr}</span>
                <span className={`text-3xl font-bold text-zinc-900`}>{dateStr}</span>
                <span className="text-[10px] font-medium text-zinc-400 mt-1">{dayStr}</span>
            </div>
            
            {/* Content */}
            <div className="flex-1 p-5">
                <div className="flex justify-between items-start mb-2">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wide ${category.bgSoft} ${category.text}`}>
                        {category.label}
                    </span>
                    
                    {/* Feature 1: Weather Forecast Widget */}
                    <div className="flex items-center gap-1.5 text-zinc-400 text-xs font-medium" title="Forecast">
                        {event.weather === 'sunny' && <Sun size={14} className="text-orange-400" />}
                        {event.weather === 'rainy' && <CloudRain size={14} className="text-blue-400" />}
                        {event.weather === 'cloudy' && <Cloud size={14} className="text-zinc-400" />}
                        <span className="text-[10px] uppercase">{event.weather}</span>
                    </div>
                </div>
                
                <h3 className="text-lg font-bold text-zinc-900 mb-2 leading-tight group-hover:text-violet-700 transition-colors">
                    {event.title}
                </h3>
                
                <div className="flex items-center gap-4 text-xs text-zinc-500 mb-3">
                    <span className="flex items-center gap-1.5"><Clock size={12} /> {event.time.split('-')[0]}</span>
                    <span className="flex items-center gap-1.5"><MapPin size={12} /> {event.location.split(' ')[0]}...</span>
                </div>

                {/* Feature 5: Occupancy Bar */}
                <div className="w-full h-1.5 bg-zinc-100 rounded-full overflow-hidden flex items-center">
                    <div className={`h-full ${occupancyColor} transition-all duration-500`} style={{ width: `${occupancy}%` }}></div>
                </div>
                <div className="flex justify-between mt-1">
                    <span className="text-[9px] text-zinc-400 font-bold uppercase tracking-wider">{event.registered} / {event.capacity} Filled</span>
                    {occupancy > 90 && <span className="text-[9px] text-red-500 font-bold uppercase">Almost Full</span>}
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
  
  // State for Dynamic Calendar
  const [currentDate, setCurrentDate] = useState(new Date(2024, 9, 1)); // Oct 2024
  const [events, setEvents] = useState(INITIAL_EVENTS);
  const [selectedDateFilter, setSelectedDateFilter] = useState(null);

  // State for Toast
  const [toast, setToast] = useState(null);

  // LOGIC: Calendar Generation
  const getDaysInMonth = (date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const days = new Date(year, month + 1, 0).getDate();
    const firstDay = new Date(year, month, 1).getDay();
    
    const daysArray = Array(firstDay).fill(null); // Empty slots for previous month
    for (let i = 1; i <= days; i++) {
        daysArray.push(new Date(year, month, i));
    }
    return daysArray;
  };

  const calendarDays = getDaysInMonth(currentDate);

  // LOGIC: Filter
  const filteredEvents = events.filter(e => {
      const matchesCategory = selectedCategory === 'all' || e.category === selectedCategory;
      const matchesSearch = e.title.toLowerCase().includes(searchQuery.toLowerCase()) || e.location.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesDate = selectedDateFilter 
        ? e.dateObj.toDateString() === selectedDateFilter.toDateString() 
        : true;
      return matchesCategory && matchesSearch && matchesDate;
  });

  // Next/Prev Month
  const changeMonth = (offset) => {
      const newDate = new Date(currentDate.setMonth(currentDate.getMonth() + offset));
      setCurrentDate(new Date(newDate));
      setSelectedDateFilter(null); // Reset day filter on month change
  };

  // ACTION: Register
  const handleRegister = () => {
      if(!selectedEvent) return;
      
      if(selectedEvent.registered >= selectedEvent.capacity) {
        setToast({ message: 'Event is fully booked!', type: 'error' });
        return;
      }

      setEvents(prev => prev.map(e => e.id === selectedEvent.id ? {...e, registered: e.registered + 1} : e));
      
      // Update the selected event local state to reflect change immediately in modal
      setSelectedEvent(prev => ({...prev, registered: prev.registered + 1}));
      
      setToast({ message: 'Registration Successful!', type: 'success' });
      
      // Auto close toast
      setTimeout(() => setToast(null), 3000);
  };

  // ACTION: Feature 4 - Toggle Status (Admin)
  const toggleEventStatus = () => {
      if(!selectedEvent) return;
      const newStatus = selectedEvent.status === 'active' ? 'cancelled' : 'active';
      
      setEvents(prev => prev.map(e => e.id === selectedEvent.id ? {...e, status: newStatus} : e));
      setSelectedEvent(prev => ({...prev, status: newStatus}));
      
      setToast({ message: `Event ${newStatus === 'active' ? 'Restored' : 'Cancelled'}`, type: newStatus === 'active' ? 'success' : 'error' });
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

        {/* HEADER CONTROLS */}
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

            <div className="flex bg-white p-1 rounded-2xl border border-zinc-200 shadow-sm">
                <button 
                    onClick={() => setIsAdmin(false)}
                    className={`px-5 py-2 rounded-xl text-xs font-bold uppercase tracking-wide transition-all ${!isAdmin ? 'bg-violet-50 text-violet-700' : 'text-zinc-400 hover:text-zinc-600'}`}
                >
                    Public
                </button>
                <button 
                    onClick={() => setIsAdmin(true)}
                    className={`px-5 py-2 rounded-xl text-xs font-bold uppercase tracking-wide transition-all ${isAdmin ? 'bg-zinc-900 text-white shadow-md' : 'text-zinc-400 hover:text-zinc-600'}`}
                >
                    Admin
                </button>
            </div>
        </div>

        {/* MAIN GRID */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            
            {/* LEFT: CALENDAR (7 cols) */}
            <div className="lg:col-span-7 flex flex-col gap-8">
                <div className="bg-white rounded-[2.5rem] border border-zinc-200 p-8 shadow-sm min-h-[600px] flex flex-col">
                    
                    {/* Calendar Header */}
                    <div className="flex justify-between items-center mb-6">
                        <h2 className="text-2xl font-bold text-zinc-900 tracking-tight">
                            {currentDate.toLocaleString('default', { month: 'long', year: 'numeric' })}
                        </h2>
                        <div className="flex gap-2">
                            <button onClick={() => changeMonth(-1)} className="w-8 h-8 flex items-center justify-center rounded-full border border-zinc-100 hover:bg-zinc-50 text-zinc-400 hover:text-zinc-600 transition-colors"><ChevronLeft size={18} /></button>
                            <button onClick={() => changeMonth(1)} className="w-8 h-8 flex items-center justify-center rounded-full border border-zinc-100 hover:bg-zinc-50 text-zinc-400 hover:text-zinc-600 transition-colors"><ChevronRight size={18} /></button>
                        </div>
                    </div>

                    {/* Category Filter */}
                    <div className="flex gap-2 overflow-x-auto pb-4 scrollbar-hide mb-4">
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
                                <div key={d} className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">{d}</div>
                            ))}
                        </div>
                        <div className="grid grid-cols-7 auto-rows-fr gap-2 h-full min-h-[400px]">
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
                                            if (eventsForDay.length > 0) setSelectedDateFilter(dateString);
                                            else setSelectedDateFilter(null);
                                        }}
                                        className={`
                                            relative p-2 rounded-2xl border transition-all cursor-pointer min-h-[80px] flex flex-col items-start justify-between
                                            ${isSelected 
                                                ? 'bg-violet-50 border-violet-500 ring-1 ring-violet-200 z-10' 
                                                : isToday ? 'bg-blue-50 border-blue-200' : 'bg-white border-zinc-100 hover:border-violet-200 hover:shadow-md'}
                                        `}
                                    >
                                        <span className={`text-sm font-bold ${isSelected ? 'text-violet-700' : 'text-zinc-700'}`}>{dateObj.getDate()}</span>
                                        
                                        <div className="w-full mt-1 flex flex-col gap-1">
                                            {eventsForDay.map(ev => (
                                                <div key={ev.id} className="w-full">
                                                    <div className={`h-1.5 w-8 rounded-full mb-1 ${
                                                        ev.category === 'public' ? 'bg-blue-500' : 
                                                        ev.category === 'culture' ? 'bg-violet-500' : 
                                                        ev.category === 'edu' ? 'bg-emerald-500' : 'bg-slate-500'
                                                    }`}></div>
                                                    <p className="text-[9px] font-semibold text-zinc-500 truncate w-full hidden sm:block">
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
            <div className="lg:col-span-5 flex flex-col gap-6">
                
                <CountdownWidget nextEvent={filteredEvents.find(e => e.status === 'active')} />

                {/* Admin Analytics Card */}
                {isAdmin && (
                    <motion.div 
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="bg-zinc-900 rounded-[2rem] p-8 text-white relative overflow-hidden shadow-lg"
                    >
                        <div className="relative z-10">
                            <div className="flex justify-between items-start mb-6">
                                <div>
                                    <p className="text-violet-300 text-xs font-bold uppercase tracking-wider mb-1">Impact Analytics</p>
                                    <h3 className="text-2xl font-bold">Total Attendance</h3>
                                </div>
                                <div className="p-2 bg-white/10 rounded-xl">
                                    <BarChart3 size={20} />
                                </div>
                            </div>
                            <div className="flex gap-8 items-end">
                                <div>
                                    <span className="text-4xl font-bold tracking-tight">
                                        {(filteredEvents.reduce((acc, curr) => acc + curr.registered, 0) / 1000).toFixed(1)}k
                                    </span>
                                    <span className="text-[10px] block text-zinc-400 uppercase tracking-wider mt-1">Attendees</span>
                                </div>
                                <div className="h-10 w-px bg-white/10"></div>
                                <div>
                                    <span className="text-4xl font-bold tracking-tight">{filteredEvents.length}</span>
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
                    <h3 className="text-lg font-bold text-zinc-900 tracking-tight">
                        {selectedDateFilter ? `Events on ${new Date(selectedDateFilter).toLocaleDateString()}` : 'Upcoming Agenda'}
                    </h3>
                    {selectedDateFilter && (
                        <button onClick={() => setSelectedDateFilter(null)} className="text-xs font-bold text-red-500 uppercase">Clear Filter</button>
                    )}
                </div>

                <div className="space-y-4 max-h-[600px] overflow-y-auto pr-2 custom-scrollbar">
                    {filteredEvents.length > 0 ? (
                        filteredEvents.map((event) => (
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
                    
                    {/* Modal */}
                    <motion.div 
                        initial={{ opacity: 0, scale: 0.95, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: 20 }}
                        className="fixed inset-0 m-auto z-[70] w-full max-w-2xl h-fit max-h-[90vh] overflow-y-auto p-4 no-scrollbar"
                    >
                        <div className="bg-white rounded-[2.5rem] shadow-2xl overflow-hidden relative">
                            
                            {/* Header Image Area */}
                            <div className={`h-48 ${selectedEvent.image} relative ${selectedEvent.status === 'cancelled' && 'grayscale'}`}>
                                <button 
                                    onClick={() => setSelectedEvent(null)}
                                    className="absolute top-6 right-6 p-2 bg-white/40 backdrop-blur-md rounded-full hover:bg-white transition-colors"
                                >
                                    <X size={20} className="text-zinc-900" />
                                </button>
                                <div className="absolute bottom-6 left-8">
                                    <span className="px-3 py-1.5 bg-white/90 backdrop-blur rounded-lg text-[10px] font-bold uppercase tracking-wider text-zinc-900 shadow-sm">
                                        {CATEGORIES.find(c => c.id === selectedEvent.category)?.label}
                                    </span>
                                </div>
                            </div>

                            {/* Body */}
                            <div className="p-8 space-y-8">
                                <div>
                                    <div className="flex justify-between items-start">
                                        <h2 className="text-3xl font-bold text-zinc-900 mb-3 tracking-tight">{selectedEvent.title}</h2>
                                        {selectedEvent.status === 'cancelled' && <span className="text-red-600 font-bold border border-red-200 bg-red-50 px-3 py-1 rounded-lg text-xs uppercase">Cancelled</span>}
                                    </div>
                                    <p className="text-zinc-500 leading-relaxed text-sm">{selectedEvent.desc}</p>
                                </div>

                                {/* Info Grid */}
                                <div className="grid grid-cols-2 gap-4">
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
                                    <div className="w-12 h-12 bg-violet-50 rounded-xl flex items-center justify-center text-violet-600">
                                        <MapPin size={24} />
                                    </div>
                                    <div className="flex-1">
                                        <div className="text-xs font-bold text-zinc-400 uppercase tracking-wider mb-0.5">Location</div>
                                        <div className="font-bold text-zinc-900 text-sm">{selectedEvent.location}</div>
                                    </div>
                                    <button className="text-xs font-bold text-violet-600 hover:underline">Get Directions</button>
                                </div>

                                {/* Action Buttons */}
                                <div className="pt-2">
                                    {isAdmin ? (
                                        <div className="grid grid-cols-2 gap-4">
                                            {/* Feature 4: Admin Status Control */}
                                            <button 
                                                onClick={toggleEventStatus}
                                                className={`py-4 rounded-xl border font-bold transition-colors text-sm uppercase tracking-wide flex items-center justify-center gap-2
                                                ${selectedEvent.status === 'active' 
                                                    ? 'border-red-200 text-red-600 hover:bg-red-50' 
                                                    : 'border-green-200 text-green-600 hover:bg-green-50'}`}
                                            >
                                                {selectedEvent.status === 'active' ? <><Ban size={16}/> Cancel Event</> : <><CheckCircle size={16}/> Restore Event</>}
                                            </button>
                                            <button className="py-4 rounded-xl bg-zinc-900 text-white font-bold shadow-lg hover:bg-zinc-800 transition-colors text-sm uppercase tracking-wide flex items-center justify-center gap-2">
                                                <BarChart3 size={16} /> Analytics
                                            </button>
                                        </div>
                                    ) : (
                                        <button 
                                            onClick={handleRegister}
                                            disabled={selectedEvent.status === 'cancelled' || selectedEvent.registered >= selectedEvent.capacity}
                                            className={`w-full py-4 font-bold rounded-2xl shadow-xl flex items-center justify-center gap-2 transition-all hover:scale-[1.01] text-sm uppercase tracking-wide
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