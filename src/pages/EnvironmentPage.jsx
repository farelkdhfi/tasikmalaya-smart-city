import React from 'react'
import { Link } from "react-router-dom"
import { motion } from 'framer-motion'
// Icons
import { 
    ArrowLeft, Wind, Bus, Heart, Calendar, Map, Thermometer, 
    Droplets, Users, Bell, Navigation, Clock, AlertCircle, Phone, 
    Stethoscope, Activity, MapPin, Search, ChevronRight, 
    Terminal, Scan, Grip, Radio, Siren
} from 'lucide-react'

// Import Layout Baru
import PageLayout from '../components/PageLayout'; 

// --- ASSETS (Placeholder) ---
import img_1 from '../assets/images/img_1.jpg'
import img_2 from '../assets/images/img_2.jpg'
import img_3 from '../assets/images/img_3.jpg'
import img_4 from '../assets/images/img_4.jpg'
import img_5 from '../assets/images/img_5.jpg'

// --- SHARED UTILS (INDUSTRIAL STYLE) ---

const TechBadge = ({ children, status = "default" }) => {
    const styles = {
        default: "border-zinc-200 text-zinc-500",
        active: "border-zinc-900 bg-zinc-900 text-white",
        alert: "border-amber-500 text-amber-600 bg-amber-500/10",
        success: "border-emerald-500 text-emerald-600 bg-emerald-500/10",
        danger: "border-rose-500 text-rose-600 bg-rose-500/10",
    }
    return (
        <span className={`text-[9px] font-mono uppercase tracking-widest px-2 py-1 border ${styles[status] || styles.default}`}>
            {children}
        </span>
    )
}

const TechCard = ({ title, children, className = "", noBorder = false }) => (
    <div className={`bg-white p-6 relative group overflow-hidden ${noBorder ? '' : 'border border-zinc-200'} ${className}`}>
        {title && (
            <div className="flex justify-between items-center mb-6 border-b border-zinc-100 pb-2">
                <h3 className="text-zinc-900 text-[10px] font-bold uppercase tracking-[0.15em]">{title}</h3>
                <div className="w-1 h-1 bg-zinc-300 rounded-full"></div>
            </div>
        )}
        {children}
        {/* Corner Decor */}
        {!noBorder && <div className="absolute top-0 left-0 w-0 h-0 border-t-[3px] border-l-[3px] border-zinc-900 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>}
    </div>
)

// --- INDIVIDUAL PAGES (RE-ENGINEERED with NEW LAYOUT) ---

// 1. PAGE: City Info -> "Urban Metrics"
export const CityInfoPage = () => {
    return (
        <PageLayout title="Urban Metrics" subtitle="City Overview" bgImage={img_1} colorTheme="zinc">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                
                {/* Weather & AQI - Raw Data Style */}
                <div className="lg:col-span-2 space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <TechCard className="!bg-zinc-900 !text-white !border-zinc-900">
                            <div className="flex justify-between items-start mb-8">
                                <div className="text-[10px] font-mono uppercase text-zinc-500">Weather_Stn_01</div>
                                <Thermometer size={16} className="text-zinc-500" />
                            </div>
                            <div className="flex items-end gap-4 mb-4">
                                <span className="text-6xl font-light tracking-tighter">28°</span>
                                <span className="text-sm font-mono text-zinc-400 mb-2">CLOUDY</span>
                            </div>
                            <div className="w-full h-[1px] bg-zinc-700 mb-4"></div>
                            <div className="flex justify-between items-center">
                                <span className="text-[10px] font-bold uppercase tracking-widest">Air Quality</span>
                                <TechBadge status="success">AQI 45 GOOD</TechBadge>
                            </div>
                        </TechCard>

                        <TechCard>
                            <div className="flex justify-between items-start mb-8">
                                <div className="text-[10px] font-mono uppercase text-zinc-400">Census_Realtime</div>
                                <Users size={16} className="text-zinc-300" />
                            </div>
                            <div className="text-4xl font-light text-zinc-900 tracking-tighter mb-2">731,600</div>
                            <div className="text-[10px] text-zinc-500 font-mono uppercase mb-6">Total Population Density</div>
                            
                            <div className="flex gap-2">
                                <div className="flex-1 border border-zinc-100 p-2 text-center">
                                    <div className="text-[8px] uppercase text-zinc-400">Growth</div>
                                    <div className="text-xs font-bold text-emerald-600">+1.2%</div>
                                </div>
                                <div className="flex-1 border border-zinc-100 p-2 text-center">
                                    <div className="text-[8px] uppercase text-zinc-400">Zone</div>
                                    <div className="text-xs font-bold text-zinc-900">HIGH</div>
                                </div>
                            </div>
                        </TechCard>
                    </div>

                    <TechCard title="Digital Map Interface" className="!p-0 min-h-[300px]">
                        <div className="absolute inset-0 grayscale opacity-80 hover:opacity-100 transition-opacity duration-700 bg-[url('https://api.mapbox.com/styles/v1/mapbox/light-v10/static/108.2207,-7.3274,13,0/800x400?access_token=YOUR_TOKEN')] bg-cover"></div>
                        <div className="absolute inset-0 bg-zinc-900/10 pointer-events-none"></div>
                        <div className="absolute bottom-6 left-6">
                            <button className="bg-zinc-900 text-white px-6 py-3 text-[10px] font-bold uppercase tracking-[0.2em] hover:bg-black transition-colors flex items-center gap-3">
                                <Scan size={14} /> Initialize Map
                            </button>
                        </div>
                    </TechCard>
                </div>

                {/* News Feed - Terminal Style */}
                <TechCard title="Broadcast Log">
                    <ul className="space-y-0 divide-y divide-zinc-100">
                        {[
                            { title: "Road Maint. Sector 4", time: "02H AGO", tag: "TRAFFIC", urgent: true },
                            { title: "Culinary Fest. Setup", time: "1D AGO", tag: "EVENT", urgent: false },
                            { title: "Mobile Service Unit", time: "2D AGO", tag: "SERVICE", urgent: false },
                            { title: "Net_Infra Upgrade", time: "3D AGO", tag: "SYSTEM", urgent: false },
                        ].map((news, i) => (
                            <li key={i} className="py-4 group cursor-pointer hover:bg-zinc-50 -mx-4 px-4 transition-colors">
                                <div className="flex justify-between items-center mb-1">
                                    <div className={`text-[9px] font-mono font-bold ${news.urgent ? 'text-amber-600' : 'text-zinc-400'}`}>
                                        [{news.tag}]
                                    </div>
                                    <div className="text-[9px] font-mono text-zinc-300">{news.time}</div>
                                </div>
                                <h4 className="text-sm font-medium text-zinc-800 group-hover:text-black">{news.title}</h4>
                            </li>
                        ))}
                    </ul>
                </TechCard>
            </div>
        </PageLayout>
    )
}

// 2. PAGE: Smart Transport -> "Mobility Grid"
export const TransportPage = () => {
    return (
        <PageLayout title="Mobility Grid" subtitle="Transport Network" bgImage={img_2} colorTheme="blue">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Route Planner - Input Fields */}
                <TechCard title="Vector Plotter" className="h-fit">
                    <div className="space-y-4">
                        <div className="space-y-1">
                            <label className="text-[9px] font-bold uppercase text-zinc-400">Origin Point</label>
                            <div className="flex items-center border border-zinc-200 p-3 bg-zinc-50 focus-within:border-zinc-900 focus-within:bg-white transition-all">
                                <MapPin size={14} className="text-zinc-400 mr-3"/>
                                <input type="text" placeholder="COORD_A" className="bg-transparent w-full text-xs font-mono outline-none uppercase placeholder:text-zinc-300"/>
                            </div>
                        </div>
                        <div className="space-y-1">
                            <label className="text-[9px] font-bold uppercase text-zinc-400">Destination</label>
                            <div className="flex items-center border border-zinc-200 p-3 bg-zinc-50 focus-within:border-zinc-900 focus-within:bg-white transition-all">
                                <Navigation size={14} className="text-zinc-400 mr-3"/>
                                <input type="text" placeholder="COORD_B" className="bg-transparent w-full text-xs font-mono outline-none uppercase placeholder:text-zinc-300"/>
                            </div>
                        </div>
                        <button className="w-full bg-zinc-900 text-white py-4 text-[10px] font-bold uppercase tracking-[0.2em] hover:bg-black mt-2">
                            Calculate Route
                        </button>
                    </div>
                </TechCard>

                {/* Live Data */}
                <div className="lg:col-span-2 space-y-6">
                    <div className="grid grid-cols-1 gap-3">
                        {[
                            { route: "K-01 PANCASILA - INDIHIANG", time: "5 MIN", status: "ON_TIME", ok: true },
                            { route: "K-02 DADAHA - MANGKUBUMI", time: "12 MIN", status: "DELAYED", ok: false },
                            { route: "F-A STASIUN - CIKURUBUK", time: "ARRIVING", status: "NEAR", ok: true },
                        ].map((item, i) => (
                            <div key={i} className="bg-white border border-zinc-200 p-4 flex justify-between items-center hover:border-zinc-900 transition-colors group cursor-pointer">
                                <div className="flex items-center gap-4">
                                    <div className="w-8 h-8 bg-zinc-100 flex items-center justify-center border border-zinc-200">
                                        <Bus size={14} className="text-zinc-500"/>
                                    </div>
                                    <div>
                                        <h4 className="text-xs font-bold uppercase tracking-wide text-zinc-900 mb-1">{item.route}</h4>
                                        <TechBadge status={item.ok ? 'success' : 'alert'}>{item.status}</TechBadge>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <div className="text-xl font-light text-zinc-900">{item.time}</div>
                                    <div className="text-[8px] font-mono text-zinc-400 uppercase">Est. Arrival</div>
                                </div>
                            </div>
                        ))}
                    </div>

                    <TechCard title="Parking Capacity">
                        <div className="space-y-6 pt-2">
                            {[
                                { loc: "MAYASARI PLAZA", slots: 45, max: 200, pct: 22 },
                                { loc: "ASIA PLAZA", slots: 12, max: 350, pct: 90, crit: true },
                                { loc: "TRANSMART", slots: 120, max: 250, pct: 48 },
                            ].map((park, i) => (
                                <div key={i}>
                                    <div className="flex justify-between text-xs mb-2">
                                        <span className="text-zinc-900 font-bold uppercase">{park.loc}</span>
                                        <span className="text-zinc-500 font-mono text-[10px]">{park.slots}/{park.max} AVAIL</span>
                                    </div>
                                    <div className="w-full h-[2px] bg-zinc-100">
                                        <div className={`h-full ${park.crit ? 'bg-rose-500' : 'bg-zinc-900'}`} style={{ width: `${100 - (park.slots/park.max)*100}%` }}></div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </TechCard>
                </div>
            </div>
        </PageLayout>
    )
}

// 3. PAGE: Emergency -> "Response Unit"
export const EmergencyPage = () => {
    return (
        <PageLayout title="Emergency Response" subtitle="SOS Protocol" bgImage={img_3} colorTheme="red">
            <div className="flex flex-col items-center justify-center py-12">
                
                {/* Industrial SOS Button */}
                <div className="relative group cursor-pointer mb-16">
                    <div className="absolute inset-0 bg-rose-500/20 rounded-full blur-[60px] opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                    
                    {/* Outer Ring */}
                    <div className="w-64 h-64 rounded-full border border-dashed border-rose-300 flex items-center justify-center animate-[spin_10s_linear_infinite] opacity-50"></div>
                    
                    {/* The Button */}
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48 bg-rose-600 hover:bg-rose-700 rounded-full flex flex-col items-center justify-center shadow-2xl transition-all active:scale-95 border-4 border-rose-800 ring-4 ring-rose-500/30">
                        <Siren size={48} className="text-white mb-2 animate-pulse" />
                        <span className="text-3xl font-black text-white tracking-tighter">S.O.S</span>
                        <span className="text-[9px] font-mono text-rose-200 uppercase mt-1 tracking-widest">Hold 3s to Trigger</span>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full max-w-3xl px-4">
                    <button className="bg-white border border-zinc-200 p-6 flex items-center gap-6 hover:border-zinc-900 hover:bg-zinc-50 transition-all group text-left">
                        <div className="w-12 h-12 bg-zinc-100 border border-zinc-200 flex items-center justify-center group-hover:bg-white group-hover:border-zinc-900">
                            <Stethoscope size={20} className="text-zinc-500 group-hover:text-zinc-900"/>
                        </div>
                        <div>
                            <h3 className="text-zinc-900 font-bold text-sm uppercase tracking-wider">Medical Dispatch</h3>
                            <p className="text-zinc-500 text-[10px] font-mono">CHANNEL: 119</p>
                        </div>
                    </button>
                    
                    <button className="bg-white border border-zinc-200 p-6 flex items-center gap-6 hover:border-zinc-900 hover:bg-zinc-50 transition-all group text-left">
                        <div className="w-12 h-12 bg-zinc-100 border border-zinc-200 flex items-center justify-center group-hover:bg-white group-hover:border-zinc-900">
                            <Radio size={20} className="text-zinc-500 group-hover:text-zinc-900"/>
                        </div>
                        <div>
                            <h3 className="text-zinc-900 font-bold text-sm uppercase tracking-wider">Security Force</h3>
                            <p className="text-zinc-500 text-[10px] font-mono">CHANNEL: 110</p>
                        </div>
                    </button>
                </div>
                
                <div className="mt-12 flex items-center gap-2 px-4 py-2 bg-zinc-900 text-white rounded-sm">
                    <MapPin size={12} className="animate-pulse text-emerald-400"/>
                    <span className="text-[10px] font-mono">LOC_LOCKED: [-7.3274, 108.2207]</span>
                </div>
            </div>
        </PageLayout>
    )
}

// 4. PAGE: E-Health -> "Bio-Data"
export const HealthPage = () => {
    return (
        <PageLayout title="Bio Services" subtitle="Health Grid" bgImage={img_4} colorTheme="emerald">
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                
                {/* Sidebar Info */}
                <div className="space-y-6 lg:col-span-1">
                    <TechCard className="text-center">
                        <div className="w-16 h-16 bg-zinc-100 border border-zinc-200 mx-auto mb-6 flex items-center justify-center">
                            <Activity size={24} className="text-zinc-900"/>
                        </div>
                        <h3 className="text-sm font-bold uppercase leading-tight mb-2">RSUD dr. Soekardjo</h3>
                        <p className="text-[10px] text-zinc-500 font-mono mb-6">CENTRAL_REFERRAL_UNIT</p>
                        <TechBadge status="success">24H OPEN</TechBadge>
                    </TechCard>
                    
                    <TechCard title="Queue Telemetry">
                        <div className="space-y-4">
                            <div className="flex justify-between items-center pb-2 border-b border-zinc-50">
                                <span className="text-[10px] font-bold uppercase text-zinc-500">General Poly</span>
                                <span className="text-zinc-900 font-mono font-bold text-sm">14 PAX</span>
                            </div>
                            <div className="flex justify-between items-center">
                                <span className="text-[10px] font-bold uppercase text-zinc-500">Dental Poly</span>
                                <span className="text-zinc-900 font-mono font-bold text-sm">03 PAX</span>
                            </div>
                        </div>
                    </TechCard>
                </div>

                {/* Main Data */}
                <div className="lg:col-span-3 space-y-6">
                    <TechCard title="Occupancy Rates (BOR)">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            {[
                                { type: "ICU UNIT", used: 12, total: 15, crit: true },
                                { type: "VIP WARD", used: 8, total: 20, crit: false },
                                { type: "CLASS I", used: 45, total: 50, crit: true },
                            ].map((bed, i) => (
                                <div key={i} className="border border-zinc-200 p-4 bg-zinc-50">
                                    <h4 className="text-[10px] text-zinc-500 font-bold uppercase mb-2">{bed.type}</h4>
                                    <div className="flex items-baseline gap-1 mb-3">
                                        <span className="text-2xl font-light text-zinc-900">{bed.used}</span>
                                        <span className="text-xs font-mono text-zinc-400">/{bed.total}</span>
                                    </div>
                                    <div className="w-full h-1 bg-zinc-200">
                                        <div className={`h-full ${bed.crit ? 'bg-amber-500' : 'bg-emerald-500'}`} style={{ width: `${(bed.used/bed.total)*100}%` }}></div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </TechCard>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="bg-zinc-900 text-white p-8 relative overflow-hidden group">
                            <div className="absolute top-0 right-0 p-4 opacity-20 group-hover:opacity-40 transition-opacity">
                                <Phone size={64} />
                            </div>
                            <h3 className="text-xl font-light mb-2">Telemedicine<br/>Interface</h3>
                            <p className="text-zinc-400 text-[10px] font-mono mb-8 max-w-[200px]">CONNECT DIRECTLY WITH SPECIALIST UNITS VIA VIDEO LINK.</p>
                            <button className="border border-white/20 bg-white/5 text-white px-6 py-3 text-[10px] font-bold uppercase tracking-widest hover:bg-white hover:text-black transition-colors">
                                Initialize Call
                            </button>
                        </div>
                        
                        <TechCard title="Pharm. Network">
                            <ul className="space-y-3">
                                {[
                                    { name: "APOTEK K-24", dist: "0.5 KM", open: true },
                                    { name: "KIMIA FARMA", dist: "1.2 KM", open: true },
                                    { name: "APOTEK SEHAT", dist: "2.4 KM", open: false },
                                ].map((phar, i) => (
                                    <li key={i} className="flex justify-between items-center border-b border-zinc-50 pb-2 last:border-0">
                                        <span className="text-xs font-bold uppercase text-zinc-900">{phar.name}</span>
                                        <div className="text-right">
                                            <TechBadge status={phar.open ? 'success' : 'danger'}>
                                                {phar.open ? 'OPEN' : 'CLOSED'}
                                            </TechBadge>
                                            <div className="text-[8px] font-mono text-zinc-400 mt-0.5">{phar.dist}</div>
                                        </div>
                                    </li>
                                ))}
                            </ul>
                        </TechCard>
                    </div>
                </div>
            </div>
        </PageLayout>
    )
}

// 5. PAGE: Events -> "Cultural Agenda"
export const EventsPage = () => {
    return (
        <PageLayout title="Cultural Agenda" subtitle="Events Log" bgImage={img_5} colorTheme="amber">
            {/* Featured Event - Magazine/Industrial Layout */}
            <div className="relative h-[400px] mb-12 border border-zinc-200 group overflow-hidden bg-zinc-900">
                <img src={img_5} alt="Feature" className="absolute inset-0 w-full h-full object-cover opacity-60 grayscale group-hover:grayscale-0 group-hover:opacity-80 transition-all duration-700 mix-blend-overlay" />
                <div className="absolute inset-0 bg-gradient-to-t from-zinc-900 via-transparent to-transparent"></div>
                
                <div className="absolute bottom-0 left-0 p-8 md:p-12 w-full">
                    <div className="flex items-center gap-4 mb-4">
                        <TechBadge status="active">MONTHLY HIGHLIGHT</TechBadge>
                        <div className="h-[1px] flex-1 bg-white/20"></div>
                    </div>
                    <h2 className="text-4xl md:text-6xl font-light text-white mb-4 tracking-tighter leading-none">
                        TASIKMALAYA<br/><span className="font-bold">OCTOBER FEST</span>
                    </h2>
                    <div className="flex flex-col md:flex-row gap-8 items-start md:items-end justify-between">
                        <p className="text-zinc-300 text-sm max-w-md leading-relaxed font-light">
                            Grand cultural convergence. Embroidery exhibition, legendary culinary archive, and creative costume parade.
                        </p>
                        <button className="bg-white text-black px-8 py-4 text-[10px] font-bold uppercase tracking-[0.2em] hover:bg-zinc-200 transition-colors">
                            Acquire Access
                        </button>
                    </div>
                </div>
            </div>

            {/* Event Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-1">
                {[
                    { title: "Wayang Golek Night", date: "12 AUG", loc: "DADAHA PARK", cat: "CULTURE" },
                    { title: "Tech Startup Meetup", date: "15 AUG", loc: "CREATIVE HUB", cat: "TECH" },
                    { title: "Car Free Day", date: "SUNDAY", loc: "HZ MUSTOFA", cat: "PUBLIC" },
                    { title: "Food Bazaar", date: "20-22 AUG", loc: "ALUN-ALUN", cat: "FOOD" },
                    { title: "Art Exhibition", date: "ALL MTH", loc: "CITY GALLERY", cat: "ART" },
                    { title: "Charity Run 5K", date: "01 SEP", loc: "CITY HALL", cat: "SPORT" },
                ].map((evt, i) => (
                    <div key={i} className="bg-white border border-zinc-200 p-6 hover:bg-zinc-900 hover:text-white transition-all group cursor-pointer h-full flex flex-col justify-between min-h-[180px]">
                        <div>
                            <div className="flex justify-between items-start mb-6">
                                <span className="text-[10px] font-mono border border-zinc-200 px-2 py-1 group-hover:border-zinc-700 group-hover:text-zinc-400">{evt.cat}</span>
                                <span className="text-xl font-bold tracking-tighter">{evt.date}</span>
                            </div>
                            <h3 className="text-lg font-medium uppercase leading-tight max-w-[80%]">{evt.title}</h3>
                        </div>
                        <div className="flex items-center gap-2 text-[10px] font-mono text-zinc-400 mt-4 group-hover:text-zinc-500">
                            <MapPin size={12}/> {evt.loc}
                        </div>
                    </div>
                ))}
            </div>
        </PageLayout>
    )
}