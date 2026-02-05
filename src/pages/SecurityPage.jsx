import React from 'react'
import { Link } from "react-router-dom"
import { motion } from 'framer-motion'
import {
    ArrowLeft, Phone, AlertTriangle, MapPin, Shield, Activity,
    Siren, Zap, Droplets, Flame, Megaphone,
    Navigation, ChevronRight, Clock, MoreHorizontal, LayoutGrid, Radio, Signal,
    FileText, UserCheck, Eye, Lock, ShieldAlert, RadioReceiver
} from 'lucide-react'

// Import PageLayout yang baru Anda buat
import PageLayout from '../components/PageLayout'; 

// --- ASSETS (Placeholder) ---
import img_31 from '../assets/images/img_31.jpg'
import img_32 from '../assets/images/img_32.jpg'
import img_33 from '../assets/images/img_33.jpg'
import img_34 from '../assets/images/img_34.jpg'

// --- LOCAL UI COMPONENTS (Industrial Style Preserved) ---

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

// --- PAGES ---

// 1. CHILD PROTECTION PAGE
export const ChildProtectionPage = () => {
    return (
        <PageLayout title="Child Safeguard" subtitle="Social Services" bgImage={img_31} colorTheme="rose">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                {/* Left: Case Data */}
                <div className="lg:col-span-4 space-y-6">
                    <TechCard title="Case Statistics">
                        <div className="grid grid-cols-2 gap-4 mb-6">
                            <div className="p-4 bg-zinc-50 border border-zinc-100">
                                <div className="text-[9px] font-mono text-zinc-400 uppercase mb-1">Active Cases</div>
                                <div className="text-3xl font-light text-zinc-900">24</div>
                            </div>
                            <div className="p-4 bg-zinc-50 border border-zinc-100">
                                <div className="text-[9px] font-mono text-zinc-400 uppercase mb-1">Safe Houses</div>
                                <div className="text-3xl font-light text-zinc-900">12</div>
                            </div>
                        </div>
                        <button className="w-full bg-zinc-900 text-white p-3 text-center text-[10px] font-bold uppercase tracking-widest hover:bg-black transition-colors">
                            Download Report
                        </button>
                    </TechCard>

                    <TechCard title="Priority Feed">
                        <div className="space-y-4">
                            {[
                                { title: "Missing Child: Cihideung", time: "09:30", type: "CRITICAL", color: "danger" },
                                { title: "School Zone Safety Check", time: "10:15", type: "ROUTINE", color: "default" },
                                { title: "Counseling: Open Slots", time: "11:00", type: "INFO", color: "success" }
                            ].map((item, i) => (
                                <div key={i} className="flex gap-4 items-start border-l-2 border-zinc-100 pl-4 py-1 hover:border-zinc-900 transition-colors">
                                    <div className="flex-1">
                                        <div className="flex justify-between items-center mb-1">
                                            <TechBadge status={item.color}>{item.type}</TechBadge>
                                            <span className="text-[9px] font-mono text-zinc-400">{item.time}</span>
                                        </div>
                                        <p className="text-xs font-medium text-zinc-800 leading-relaxed">{item.title}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </TechCard>
                </div>

                {/* Right: Actions & Resources */}
                <div className="lg:col-span-8 space-y-6">
                    {/* Hero Action Area */}
                    <div className="bg-rose-900/5 border border-rose-100 p-8 relative overflow-hidden group">
                        <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-end gap-8">
                            <div>
                                <div className="flex items-center gap-2 mb-4 text-rose-600">
                                    <ShieldAlert size={20} />
                                    <span className="text-[10px] font-bold uppercase tracking-widest">Confidential Line</span>
                                </div>
                                <h2 className="text-3xl font-light mb-4 max-w-md text-zinc-900 leading-tight">Secure Reporting Protocol</h2>
                                <p className="text-zinc-500 text-xs font-mono max-w-sm mb-8">
                                    IDENTITY_ENCRYPTION: ENABLED<br/>
                                    TRACEABILITY: DISABLED
                                </p>
                                <div className="flex gap-4">
                                    <button className="bg-rose-600 text-white px-6 py-4 text-[10px] font-bold uppercase tracking-widest hover:bg-rose-700 transition-colors shadow-lg shadow-rose-200">
                                        Call Hotline
                                    </button>
                                    <button className="bg-white border border-zinc-200 text-zinc-900 px-6 py-4 text-[10px] font-bold uppercase tracking-widest hover:bg-zinc-50 transition-colors">
                                        Digital Report
                                    </button>
                                </div>
                            </div>
                        </div>
                        {/* Background Deco */}
                        <Shield size={240} className="absolute -right-10 -bottom-10 text-rose-50 opacity-50 rotate-12" strokeWidth={0.5} />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {[
                            { title: "Internet Safety", format: "PDF_MOD", size: "2.4 MB" },
                            { title: "Anti-Bullying", format: "VID_SERIES", size: "128 MB" }
                        ].map((res, i) => (
                            <TechCard key={i} className="cursor-pointer group hover:border-rose-200 transition-colors">
                                <div className="flex justify-between items-start mb-12">
                                    <FileText size={20} className="text-zinc-300 group-hover:text-rose-500 transition-colors"/>
                                    <span className="text-[9px] font-mono text-zinc-400 uppercase">{res.format}</span>
                                </div>
                                <h3 className="text-lg font-medium text-zinc-900 mb-1">{res.title}</h3>
                                <p className="text-[10px] font-mono text-zinc-400">SIZE: {res.size}</p>
                            </TechCard>
                        ))}
                    </div>
                </div>
            </div>
        </PageLayout>
    )
}

// 2. POLICE CENTER PAGE
export const PoliceCenterPage = () => {
    return (
        <PageLayout title="Enforcement Grid" subtitle="Police Center" bgImage={img_32} colorTheme="blue">
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                {/* Sidebar Status */}
                <div className="lg:col-span-1 space-y-6">
                    <div className="bg-slate-900 text-white p-6 text-center border border-slate-800">
                         <div className="text-[9px] font-mono text-slate-500 uppercase mb-4">Threat Level</div>
                         <div className="text-6xl font-black text-sky-500 mb-4 tracking-tighter">LOW</div>
                         <div className="inline-block border border-slate-700 px-3 py-1 rounded-sm text-[9px] font-bold uppercase tracking-widest text-slate-300">
                             Sector Secure
                         </div>
                    </div>
                    
                    <TechCard title="Patrol Status">
                        <div className="space-y-4">
                            <div className="flex justify-between items-center">
                                <span className="text-xs font-bold uppercase text-zinc-500">Units Active</span>
                                <span className="font-mono text-sm text-zinc-900">42</span>
                            </div>
                            <div className="flex justify-between items-center">
                                <span className="text-xs font-bold uppercase text-zinc-500">Avg Response</span>
                                <span className="font-mono text-sm text-sky-600">&lt; 7 MIN</span>
                            </div>
                        </div>
                    </TechCard>
                </div>

                {/* Main Radar Map */}
                <div className="lg:col-span-2 space-y-6">
                    <div className="relative h-80 bg-zinc-100 border border-zinc-200 overflow-hidden group">
                         {/* Fake Map */}
                         <div className="absolute inset-0 bg-[url('https://api.mapbox.com/styles/v1/mapbox/dark-v10/static/108.2207,-7.3274,13,0/800x600?access_token=YOUR_TOKEN')] bg-cover grayscale opacity-20 mix-blend-multiply"></div>
                         {/* Radar */}
                         <div className="absolute inset-0 bg-[conic-gradient(from_0deg,transparent_0_340deg,rgba(14,165,233,0.1)_360deg)] animate-[spin_4s_linear_infinite] rounded-full scale-[1.5] opacity-50"></div>
                         
                         <div className="absolute top-4 left-4 flex gap-2">
                             <TechBadge status="active">LIVE TRACKING</TechBadge>
                             <div className="text-[9px] font-mono bg-white/80 backdrop-blur px-2 py-1 border border-zinc-200">LAT: -7.32 | LON: 108.22</div>
                         </div>
                         <div className="absolute top-1/2 left-1/2 w-2 h-2 bg-sky-500 rounded-full animate-ping"></div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        {['CITY_CTR', 'STATION_HQ'].map((loc, i) => (
                             <div key={i} className="bg-black aspect-video relative overflow-hidden border border-zinc-200 group">
                                 <div className="absolute top-2 left-2 flex items-center gap-2 z-10">
                                     <div className="w-1.5 h-1.5 bg-red-500 animate-pulse rounded-full"></div>
                                     <span className="text-[8px] font-mono text-white/70">REC</span>
                                 </div>
                                 <div className="absolute inset-0 flex items-center justify-center opacity-20 group-hover:opacity-40 transition-opacity">
                                     <Eye className="text-white" size={32} />
                                 </div>
                                 <div className="absolute bottom-2 left-2">
                                     <p className="text-white text-[9px] font-mono uppercase">CAM_0{i+1}: {loc}</p>
                                 </div>
                             </div>
                        ))}
                    </div>
                </div>

                {/* Dispatch */}
                <div className="lg:col-span-1">
                    <TechCard title="Dispatch Console" className="h-full flex flex-col">
                        <div className="flex-1 flex flex-col gap-3 justify-center">
                             <button className="bg-zinc-50 hover:bg-slate-900 hover:text-white border border-zinc-200 p-4 text-left transition-colors group">
                                 <div className="flex justify-between items-center mb-1">
                                     <span className="font-bold text-xs uppercase">Panic Signal</span>
                                     <AlertTriangle size={14} className="text-zinc-400 group-hover:text-white"/>
                                 </div>
                                 <div className="text-[9px] font-mono text-zinc-400 group-hover:text-zinc-300">BROADCAST_SOS</div>
                             </button>
                             <button className="bg-zinc-50 hover:bg-slate-900 hover:text-white border border-zinc-200 p-4 text-left transition-colors group">
                                 <div className="flex justify-between items-center mb-1">
                                     <span className="font-bold text-xs uppercase">Call 110</span>
                                     <Phone size={14} className="text-zinc-400 group-hover:text-white"/>
                                 </div>
                                 <div className="text-[9px] font-mono text-zinc-400 group-hover:text-zinc-300">VOICE_CHANNEL</div>
                             </button>
                        </div>
                    </TechCard>
                </div>
            </div>
        </PageLayout>
    )
}

// 3. FIREFIGHTER PAGE
export const FirefighterPage = () => {
    return (
        <PageLayout title="Fire Command" subtitle="Rapid Response" bgImage={img_33} colorTheme="orange">
             <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                 <div className="space-y-8">
                     {/* Industrial Switch Button */}
                     <div className="border-2 border-dashed border-orange-200 p-2 rounded-sm group cursor-pointer hover:border-orange-500 transition-colors">
                         <div className="bg-gradient-to-br from-orange-600 to-red-600 p-10 relative overflow-hidden shadow-2xl transition-transform active:scale-[0.99]">
                             {/* Warning Stripes */}
                             <div className="absolute top-0 left-0 w-full h-4 bg-[repeating-linear-gradient(45deg,transparent,transparent_10px,rgba(0,0,0,0.2)_10px,rgba(0,0,0,0.2)_20px)]"></div>
                             <div className="absolute bottom-0 left-0 w-full h-4 bg-[repeating-linear-gradient(45deg,transparent,transparent_10px,rgba(0,0,0,0.2)_10px,rgba(0,0,0,0.2)_20px)]"></div>
                             
                             <div className="flex items-center justify-between relative z-10">
                                 <div>
                                     <h3 className="text-6xl font-black text-white tracking-tighter mb-0">113</h3>
                                     <p className="text-orange-100 text-[10px] font-bold uppercase tracking-[0.4em]">Emergency Override</p>
                                 </div>
                                 <div className="w-16 h-16 border-4 border-white/20 rounded-full flex items-center justify-center">
                                     <Phone size={32} className="text-white fill-white" />
                                 </div>
                             </div>
                         </div>
                     </div>

                     <div className="grid grid-cols-2 gap-4">
                         <TechCard className="text-center">
                             <div className="text-[9px] font-mono text-zinc-400 uppercase mb-2">Fleet Status</div>
                             <div className="text-3xl font-light text-zinc-900">100%</div>
                             <TechBadge status="success">READY</TechBadge>
                         </TechCard>
                         <TechCard className="text-center">
                             <div className="text-[9px] font-mono text-zinc-400 uppercase mb-2">Hydrants</div>
                             <div className="text-3xl font-light text-zinc-900">840</div>
                             <TechBadge status="default">MAPPED</TechBadge>
                         </TechCard>
                     </div>

                     <TechCard title="Station Net">
                         <div className="space-y-3">
                             {[
                                 { name: "HQ - CITY CENTER", status: "STANDBY", color: "success" },
                                 { name: "UNIT 2 - INDIHIANG", status: "ON_MISSION", color: "alert" },
                                 { name: "UNIT 3 - KAWALU", status: "STANDBY", color: "success" },
                             ].map((st, i) => (
                                 <div key={i} className="flex justify-between items-center border-b border-zinc-50 pb-2 last:border-0">
                                     <span className="text-xs font-bold uppercase text-zinc-800">{st.name}</span>
                                     <TechBadge status={st.color}>{st.status}</TechBadge>
                                 </div>
                             ))}
                         </div>
                     </TechCard>
                 </div>

                 <div className="space-y-6">
                     <TechCard title="Hazard Protocol: Gas Leak" className="!bg-zinc-900 !text-white !border-zinc-900">
                         <div className="flex items-start gap-4 mb-8">
                             <Flame size={48} className="text-orange-500 animate-pulse"/>
                             <div>
                                 <h3 className="text-lg font-light leading-tight">Protocol 77-B<br/>Active</h3>
                                 <p className="text-[10px] font-mono text-zinc-500 mt-2">DO NOT IGNITE SWITCHES</p>
                             </div>
                         </div>
                         <ol className="space-y-4 font-mono text-xs text-zinc-300">
                             <li className="flex gap-4 border-b border-zinc-800 pb-2">
                                 <span className="text-orange-500">01</span>
                                 <span>Open all ventilation points immediately.</span>
                             </li>
                             <li className="flex gap-4 border-b border-zinc-800 pb-2">
                                 <span className="text-orange-500">02</span>
                                 <span>Evacuate premises to safe distance (50m).</span>
                             </li>
                             <li className="flex gap-4">
                                 <span className="text-orange-500">03</span>
                                 <span>Contact 113 for Hazmat Unit.</span>
                             </li>
                         </ol>
                     </TechCard>
                     
                     {/* Hydrant Map */}
                     <div className="h-64 border border-zinc-200 bg-zinc-50 relative group overflow-hidden">
                         <div className="absolute inset-0 bg-[url('https://api.mapbox.com/styles/v1/mapbox/streets-v11/static/108.2207,-7.3274,14,0/600x400?access_token=YOUR_TOKEN')] bg-cover grayscale opacity-50"></div>
                         <div className="absolute inset-0 flex items-center justify-center">
                             <button className="bg-white border border-zinc-200 px-6 py-3 text-[10px] font-bold uppercase tracking-widest hover:bg-zinc-900 hover:text-white transition-all shadow-lg">
                                 Access Hydrant Map
                             </button>
                         </div>
                     </div>
                 </div>
             </div>
        </PageLayout>
    )
}

// 4. DISASTER RELIEF PAGE
export const DisasterPage = () => {
    return (
        <PageLayout title="BPBD Command" subtitle="Disaster Relief" bgImage={img_34} colorTheme="red">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Main Sensor Dashboard */}
                <div className="lg:col-span-2 space-y-6">
                    <div className="bg-white border border-zinc-200 p-8 relative overflow-hidden group">
                        <div className="absolute top-0 right-0 p-8 opacity-5 grayscale group-hover:grayscale-0 transition-all">
                             <RadioReceiver size={120} />
                        </div>
                        
                        <div className="relative z-10 flex flex-col gap-8">
                            <div>
                                <h2 className="text-2xl font-light text-zinc-900">Early Warning System</h2>
                                <div className="flex items-center gap-2 mt-2">
                                    <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></span>
                                    <span className="text-[10px] font-mono uppercase text-zinc-400">Sensors Online</span>
                                </div>
                            </div>
                            
                            <div className="grid grid-cols-3 gap-4">
                                {[
                                    { label: "Weather", val: "RAIN", status: "CAUTION", color: "alert", icon: Zap },
                                    { label: "Water Lvl", val: "NORM", status: "SAFE", color: "success", icon: Droplets },
                                    { label: "Seismic", val: "STBL", status: "SAFE", color: "success", icon: Activity },
                                ].map((stat, i) => (
                                    <div key={i} className="border border-zinc-100 bg-zinc-50 p-4 text-center hover:border-zinc-300 transition-colors">
                                        <div className="flex justify-center text-zinc-300 mb-3 group-hover:text-zinc-500 transition-colors"><stat.icon size={16}/></div>
                                        <div className="text-lg font-bold text-zinc-900 mb-2">{stat.val}</div>
                                        <TechBadge status={stat.color}>{stat.status}</TechBadge>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    <TechCard title="Live Alert Feed">
                         <div className="space-y-2">
                            {[
                                { date: "14:00", loc: "GALUNGGUNG", event: "MINOR_TREMOR_DETECTED", lvl: "WARNING", color: "alert" },
                                { date: "YESTERDAY", loc: "CIWULAN RIV", event: "WATER_LEVEL_RISING", lvl: "INFO", color: "default" },
                                { date: "YESTERDAY", loc: "CITY_PARK", event: "FALLEN_TREE_CLEARED", lvl: "RESOLVED", color: "success" },
                            ].map((item, i) => (
                                <div key={i} className="flex gap-4 items-center p-3 border-b border-zinc-50 hover:bg-zinc-50 transition-colors">
                                    <div className="text-[9px] font-mono text-zinc-400 w-16 text-right">{item.date}</div>
                                    <div className="w-[1px] h-6 bg-zinc-200"></div>
                                    <div className="flex-1">
                                        <div className="text-[10px] font-bold text-zinc-900 uppercase">{item.event}</div>
                                        <div className="text-[9px] font-mono text-zinc-400">LOC: {item.loc}</div>
                                    </div>
                                    <TechBadge status={item.color}>{item.lvl}</TechBadge>
                                </div>
                            ))}
                         </div>
                    </TechCard>
                </div>

                {/* Map Action */}
                <div className="lg:col-span-1">
                    <div className="h-full bg-zinc-900 text-white p-6 flex flex-col justify-between relative overflow-hidden">
                        <div className="absolute inset-0 bg-[url('https://api.mapbox.com/styles/v1/mapbox/outdoors-v11/static/108.2207,-7.3274,11,0/400x800?access_token=YOUR_TOKEN')] bg-cover opacity-20 mix-blend-overlay"></div>
                        <div className="relative z-10">
                            <h3 className="font-bold text-xs uppercase tracking-widest flex items-center gap-2 mb-2">
                                <MapPin size={14} /> Evacuation Grid
                            </h3>
                            <p className="text-[10px] font-mono text-zinc-500">UPDATED: 2 MINS AGO</p>
                        </div>

                        <div className="relative z-10">
                            <div className="p-4 border border-white/20 bg-white/5 mb-4 backdrop-blur-sm">
                                <div className="text-[9px] font-bold uppercase text-zinc-400 mb-1">Nearest Safe Point</div>
                                <div className="text-lg font-light">GOR SUKAPURA</div>
                                <div className="text-[9px] font-mono text-emerald-400">DIST: 1.2 KM</div>
                            </div>
                            <button className="w-full bg-white text-black py-4 text-[10px] font-bold uppercase tracking-[0.2em] hover:bg-zinc-200 transition-colors">
                                Start Navigation
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </PageLayout>
    )
}