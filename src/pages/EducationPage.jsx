import React, { useState } from 'react'
import { Link } from "react-router-dom"
import { motion, AnimatePresence } from 'framer-motion'
import { 
    ArrowLeft, BookOpen, Clock, Video, 
    Leaf, Wind, MapPin, 
    Recycle, Trash2, QrCode, History,
    Baby, Activity, School,
    Fingerprint, CreditCard, FileText, CheckCircle, XCircle, 
    ChevronRight, Terminal, BarChart3, ScanLine, Grip
} from 'lucide-react'

// Import PageLayout Component
import PageLayout from '../components/PageLayout'; 

// --- ASSETS (Placeholder Images) ---
const img_edu = "https://images.unsplash.com/photo-1501504905252-473c47e087f8?q=80&w=2070&auto=format&fit=crop"
const img_green = "https://images.unsplash.com/photo-1518531933037-91b2f5f229cc?q=80&w=2070&auto=format&fit=crop"
const img_recycle = "https://images.unsplash.com/photo-1532996122724-e3c354a0b15b?q=80&w=2070&auto=format&fit=crop"
const img_child = "https://images.unsplash.com/photo-1485546246426-74dc88dec4d9?q=80&w=2069&auto=format&fit=crop"
const img_id = "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?q=80&w=2070&auto=format&fit=crop"
const img_avatar = "https://images.unsplash.com/photo-1518173946687-a4c8892bbd9f?q=80&w=1974&auto=format&fit=crop"

// --- SHARED UTILS (Industrial Style) ---

const TechBadge = ({ children, active }) => (
    <span className={`text-[10px] font-mono uppercase tracking-widest px-2 py-1 border ${
        active ? 'bg-zinc-900 text-white border-zinc-900' : 'bg-transparent text-zinc-500 border-zinc-200'
    }`}>
        {children}
    </span>
)

const TechCard = ({ children, className = "", onClick, label }) => (
    <motion.div 
        whileHover={onClick ? { y: -2 } : {}}
        className={`bg-white border border-zinc-200 p-6 relative group overflow-hidden ${className}`}
        onClick={onClick}
    >
        {label && (
            <div className="absolute top-0 right-0 px-2 py-1 bg-zinc-100 border-l border-b border-zinc-200 text-[9px] font-mono text-zinc-400 uppercase">
                {label}
            </div>
        )}
        {children}
        {/* Corner Accents */}
        <div className="absolute bottom-0 right-0 w-2 h-2 border-r border-b border-zinc-300 opacity-0 group-hover:opacity-100 transition-opacity"></div>
    </motion.div>
)

// --- PAGES ---

// 1. EDU CENTER
export const EducationCenterPage = () => {
    return (
        <PageLayout title="Knowledge Base" subtitle="Curriculum" bgImage={img_edu} colorTheme="blue">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                {/* Left: Active Status */}
                <div className="lg:col-span-8 space-y-6">
                    <TechCard className="!p-8 bg-zinc-900 text-white !border-zinc-900" label="STATUS: ACTIVE">
                        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
                            <div>
                                <h2 className="text-2xl font-light mb-2">Resume Protocol</h2>
                                <p className="text-zinc-400 text-sm font-mono max-w-md">
                                     User_Session: Active<br/>
                                     Modules_In_Queue: 2<br/>
                                     Next_Action: Complete "Digital Marketing"
                                </p>
                            </div>
                            <button className="px-6 py-3 bg-white text-zinc-900 text-xs font-bold uppercase tracking-[0.15em] hover:bg-zinc-200 transition-colors">
                                Initialize
                            </button>
                        </div>
                        
                        {/* Technical Progress Bars */}
                        <div className="mt-12 space-y-6">
                            {[
                                { name: "Digital Marketing for SMEs", val: 75 },
                                { name: "Basic English Conversation", val: 30 }
                            ].map((item, i) => (
                                <div key={i}>
                                    <div className="flex justify-between text-[10px] font-mono uppercase mb-2 text-zinc-400">
                                        <span>{item.name}</span>
                                        <span>{item.val}% COMPLETED</span>
                                    </div>
                                    <div className="w-full h-[1px] bg-zinc-700">
                                        <div className="h-full bg-white relative" style={{ width: `${item.val}%` }}>
                                            <div className="absolute right-0 top-1/2 -translate-y-1/2 w-1 h-3 bg-white"></div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </TechCard>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {[
                            { title: "Intro to Coding", provider: "Tasik Digital", dur: "4W" },
                            { title: "Financial Literacy", provider: "Bank Indonesia", dur: "2D" },
                            { title: "Urban Farming 101", provider: "Dinas Pertanian", dur: "1W" },
                            { title: "Content Creator", provider: "Creative Hub", dur: "OD" },
                        ].map((course, i) => (
                            <TechCard key={i} className="cursor-pointer hover:border-zinc-900 transition-colors group">
                                <div className="flex justify-between items-start mb-4">
                                    <div className="w-8 h-8 border border-zinc-200 flex items-center justify-center text-zinc-400 group-hover:text-zinc-900 group-hover:border-zinc-900 transition-all">
                                        <BookOpen size={14} />
                                    </div>
                                    <span className="text-[10px] font-mono text-zinc-400">{course.dur}</span>
                                </div>
                                <h4 className="text-sm font-bold uppercase tracking-wide text-zinc-900 mb-1">{course.title}</h4>
                                <p className="text-xs text-zinc-500 font-mono">_PROV: {course.provider}</p>
                            </TechCard>
                        ))}
                    </div>
                </div>

                {/* Right: Library Data */}
                <div className="lg:col-span-4 space-y-4">
                    <TechCard label="ARCHIVE">
                        <div className="flex items-end justify-between mb-4">
                            <h3 className="text-sm font-bold uppercase text-zinc-500">Total Assets</h3>
                            <BookOpen size={16} className="text-zinc-300"/>
                        </div>
                        <div className="text-5xl font-light text-zinc-900 tracking-tighter">12.5k</div>
                        <div className="w-full h-[1px] bg-zinc-100 my-4"></div>
                        <button className="w-full py-3 border border-zinc-200 text-xs font-bold uppercase tracking-widest hover:bg-zinc-900 hover:text-white transition-all">
                            Access Library
                        </button>
                    </TechCard>

                    <div className="relative aspect-[4/5] bg-zinc-900 p-6 flex flex-col justify-between overflow-hidden group cursor-pointer">
                        <img src={img_edu} alt="webinar" className="absolute inset-0 w-full h-full object-cover opacity-40 mix-blend-overlay grayscale group-hover:scale-105 transition-transform duration-700" />
                        <div className="relative z-10 flex justify-between items-start">
                             <span className="text-[10px] text-white bg-red-600 px-2 py-0.5 font-bold uppercase tracking-widest animate-pulse">Live</span>
                             <Video size={16} className="text-white"/>
                        </div>
                        <div className="relative z-10">
                            <h3 className="text-white text-xl font-light leading-tight mb-2">AI for Future<br/>Workforce</h3>
                            <p className="text-zinc-400 text-[10px] font-mono uppercase">Streaming in 00:45:00</p>
                        </div>
                    </div>
                </div>
            </div>
        </PageLayout>
    )
}

// 2. GREEN LIVING
export const GreenLivingPage = () => {
    return (
        <PageLayout title="Eco Metrics" subtitle="Sustainability" bgImage={img_green} colorTheme="zinc">
             <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                <div className="space-y-6">
                    <TechCard label="CARBON_INDEX">
                         <div className="flex flex-row items-end gap-8 mb-8">
                             <div>
                                 <span className="text-[10px] font-mono text-zinc-400 uppercase block mb-2">Calculated Score</span>
                                 <div className="text-8xl font-light text-zinc-900 tracking-tighter leading-none">80</div>
                             </div>
                             <div className="pb-2">
                                 <div className="flex items-center gap-2 text-emerald-600 mb-1">
                                     <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
                                     <span className="text-xs font-bold uppercase tracking-widest">Optimal</span>
                                 </div>
                                 <p className="text-[10px] text-zinc-500 max-w-[120px]">Environmental impact remains within nominal parameters.</p>
                             </div>
                         </div>
                         <div className="grid grid-cols-2 border-t border-zinc-200">
                             <div className="p-4 border-r border-zinc-200">
                                 <div className="text-[10px] text-zinc-400 uppercase mb-1">CO2 Offset</div>
                                 <div className="text-xl font-mono text-zinc-900">12.4 KG</div>
                             </div>
                             <div className="p-4">
                                 <div className="text-[10px] text-zinc-400 uppercase mb-1">Flora Contrib.</div>
                                 <div className="text-xl font-mono text-zinc-900">02 UNIT</div>
                             </div>
                         </div>
                    </TechCard>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                         <TechCard className="hover:bg-zinc-50 transition-colors cursor-pointer group" label="GUIDE">
                             <Leaf size={20} className="text-zinc-400 mb-4 group-hover:text-emerald-600 transition-colors"/>
                             <h3 className="text-sm font-bold uppercase tracking-wide mb-2">Urban Farming</h3>
                             <p className="text-xs text-zinc-500 leading-relaxed mb-4">Hydroponic protocols for high-density living zones.</p>
                             <div className="w-6 h-[1px] bg-zinc-300 group-hover:w-full group-hover:bg-emerald-600 transition-all"></div>
                         </TechCard>
                         <TechCard className="hover:bg-zinc-50 transition-colors cursor-pointer group" label="PROTOCOL">
                             <Wind size={20} className="text-zinc-400 mb-4 group-hover:text-sky-600 transition-colors"/>
                             <h3 className="text-sm font-bold uppercase tracking-wide mb-2">Energy Saver</h3>
                             <p className="text-xs text-zinc-500 leading-relaxed mb-4">Grid consumption optimization techniques.</p>
                             <div className="w-6 h-[1px] bg-zinc-300 group-hover:w-full group-hover:bg-sky-600 transition-all"></div>
                         </TechCard>
                    </div>
                </div>

                <div className="relative border border-zinc-200 bg-zinc-100 h-full min-h-[400px]">
                    {/* Abstract Map UI */}
                    <div className="absolute inset-0 opacity-20" style={{backgroundImage: 'radial-gradient(#000 1px, transparent 1px)', backgroundSize: '20px 20px'}}></div>
                    <div className="absolute top-6 left-6 z-10 bg-white border border-zinc-200 px-4 py-2">
                         <span className="text-[10px] font-bold uppercase tracking-widest flex items-center gap-2">
                             <MapPin size={10}/> Sector Map
                         </span>
                    </div>
                    
                    {/* Map Pins */}
                    <div className="absolute top-1/3 left-1/4 w-32 p-2 bg-zinc-900 text-white text-[10px] font-mono leading-tight">
                         COMM_GARDEN_01<br/>
                         STAT: OPEN
                    </div>
                    <div className="absolute bottom-1/3 right-1/4 w-4 h-4 border border-zinc-900 rounded-full flex items-center justify-center">
                        <div className="w-1 h-1 bg-zinc-900 rounded-full"></div>
                    </div>

                    <div className="absolute bottom-6 left-6 right-6">
                        <button className="w-full py-4 bg-zinc-900 text-white text-xs font-bold uppercase tracking-[0.2em] hover:bg-black transition-colors flex items-center justify-center gap-3">
                            <ScanLine size={14} /> Locate Nearest
                        </button>
                    </div>
                </div>
             </div>
        </PageLayout>
    )
}

// 3. SMART RECYCLE
export const RecyclePage = () => {
    return (
        <PageLayout title="Waste Management" subtitle="Smart Recycle" bgImage={img_recycle} colorTheme="zinc">
             <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                 {/* Left: Data Table style */}
                 <div className="lg:col-span-8 space-y-8">
                     {/* Big Stats Row */}
                     <div className="grid grid-cols-3 gap-0 border border-zinc-200 bg-white">
                         <div className="p-6 border-r border-zinc-200">
                             <div className="text-[10px] text-zinc-400 uppercase font-mono mb-2">Total Points</div>
                             <div className="text-3xl md:text-4xl font-light text-zinc-900">2,450</div>
                         </div>
                         <div className="p-6 border-r border-zinc-200">
                             <div className="text-[10px] text-zinc-400 uppercase font-mono mb-2">Mass Recycled</div>
                             <div className="text-3xl md:text-4xl font-light text-zinc-900">15.2<span className="text-lg font-mono text-zinc-400 ml-1">kg</span></div>
                         </div>
                         <div className="p-6">
                             <div className="text-[10px] text-zinc-400 uppercase font-mono mb-2">District Rank</div>
                             <div className="text-3xl md:text-4xl font-light text-zinc-900">#05</div>
                         </div>
                     </div>

                     <div className="border border-zinc-200 bg-white p-6">
                         <div className="flex justify-between items-center mb-6">
                             <h3 className="text-xs font-bold uppercase tracking-widest text-zinc-900">Transaction Log</h3>
                             <History size={14} className="text-zinc-400"/>
                         </div>
                         
                         <div className="w-full text-left">
                             <div className="grid grid-cols-12 text-[10px] text-zinc-400 uppercase font-mono border-b border-zinc-100 pb-2 mb-2">
                                 <div className="col-span-1">Type</div>
                                 <div className="col-span-5">Item Descriptor</div>
                                 <div className="col-span-4">Location / Date</div>
                                 <div className="col-span-2 text-right">Value</div>
                             </div>
                             
                             {[
                                 { type: "PET", desc: "Polyethylene Terephthalate (2kg)", loc: "Central Depot", date: "Today", pts: 200 },
                                 { type: "PAP", desc: "Cardboard Fiber (5kg)", loc: "Pickup Unit 04", date: "Yesterday", pts: 500 },
                                 { type: "ELC", desc: "E-Waste / Smartphone", loc: "Drop Box A-1", date: "12 Aug", pts: 1000 },
                             ].map((row, i) => (
                                 <div key={i} className="grid grid-cols-12 text-xs py-3 border-b border-zinc-50 items-center font-mono hover:bg-zinc-50 transition-colors">
                                     <div className="col-span-1 text-zinc-400">{row.type}</div>
                                     <div className="col-span-5 text-zinc-900 font-bold truncate pr-2">{row.desc}</div>
                                     <div className="col-span-4 text-zinc-500">{row.loc} <span className="opacity-50">/ {row.date}</span></div>
                                     <div className="col-span-2 text-right text-emerald-600">+{row.pts}</div>
                                 </div>
                             ))}
                         </div>
                     </div>
                 </div>

                 {/* Right: ID & Actions */}
                 <div className="lg:col-span-4 space-y-4">
                     <div className="bg-zinc-900 text-white p-6 aspect-square flex flex-col items-center justify-center text-center relative overflow-hidden group">
                         {/* Scanlines */}
                         <div className="absolute inset-0 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] z-10 bg-[length:100%_4px,3px_100%] pointer-events-none"></div>
                         
                         <div className="bg-white p-3 rounded-sm mb-6 z-20">
                             <QrCode size={80} className="text-black"/>
                         </div>
                         <div className="z-20">
                            <h3 className="text-sm font-bold uppercase tracking-widest mb-1">Waste ID</h3>
                            <p className="text-[10px] text-zinc-500 font-mono">SCAN_FOR_ENTRY</p>
                         </div>
                     </div>

                     <TechCard label="SCHEDULE">
                         <div className="flex items-start gap-4">
                             <div className="flex flex-col items-center">
                                 <div className="text-[10px] font-bold uppercase text-zinc-400">Next</div>
                                 <div className="text-2xl font-light text-zinc-900">WED</div>
                             </div>
                             <div className="w-[1px] h-10 bg-zinc-200"></div>
                             <div>
                                 <div className="text-xs font-bold uppercase text-zinc-900">Organic Collection</div>
                                 <div className="text-[10px] font-mono text-zinc-500 mt-1">0700 - 0900 HRS</div>
                             </div>
                         </div>
                     </TechCard>
                 </div>
             </div>
        </PageLayout>
    )
}

// 4. SMART CHILD
export const SmartChildPage = () => {
    return (
        <PageLayout title="Child Development" subtitle="Parenting" bgImage={img_child} colorTheme="rose">
             <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                 {/* Profile "Dossier" */}
                 <div className="lg:col-span-1">
                     <div className="border border-zinc-200 bg-white p-6 sticky top-24">
                         <div className="aspect-[3/4] bg-zinc-100 mb-4 overflow-hidden relative grayscale">
                             <img src={img_avatar} alt="subject" className="w-full h-full object-cover mix-blend-multiply" />
                             <div className="absolute bottom-0 left-0 right-0 bg-zinc-900/10 p-2 backdrop-blur-sm">
                                 <span className="text-[9px] font-mono uppercase text-zinc-900">IMG_REF_2026</span>
                             </div>
                         </div>
                         <h2 className="text-lg font-bold uppercase tracking-wide text-zinc-900">Budi Santoso</h2>
                         <div className="flex items-center gap-2 mb-6">
                            <span className="w-2 h-2 bg-emerald-500 rounded-full"></span>
                            <span className="text-xs font-mono text-zinc-500">AGE: 05 YRS</span>
                         </div>
                         
                         <div className="space-y-4 border-t border-zinc-200 pt-4">
                             <div className="flex justify-between items-center text-xs">
                                 <span className="text-zinc-400 uppercase font-bold">Height</span>
                                 <span className="font-mono">110 CM</span>
                             </div>
                             <div className="flex justify-between items-center text-xs">
                                 <span className="text-zinc-400 uppercase font-bold">Weight</span>
                                 <span className="font-mono">18 KG</span>
                             </div>
                         </div>
                         <button className="w-full mt-6 py-2 border border-zinc-200 text-[10px] font-bold uppercase tracking-widest hover:border-zinc-900 transition-colors">
                             Edit Data
                         </button>
                     </div>
                 </div>

                 {/* Data Grid */}
                 <div className="lg:col-span-3 space-y-6">
                     <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                         <TechCard label="VACCINE_LOG">
                             <div className="flex justify-between items-center mb-6">
                                 <div className="flex items-center gap-2">
                                     <Baby size={16} className="text-zinc-400"/>
                                     <h3 className="text-xs font-bold uppercase tracking-widest">Immunization</h3>
                                 </div>
                                 <TechBadge active>Complete</TechBadge>
                             </div>
                             
                             <div className="space-y-0 border-l border-zinc-200 pl-4 ml-2">
                                 {[
                                     { name: "BCG / DPT-1", status: "ADMINISTERED", date: "2019" },
                                     { name: "Polio-4", status: "ADMINISTERED", date: "2020" },
                                     { name: "Measles / Rubella", status: "SCHEDULED", date: "OCT 2024", pending: true },
                                 ].map((vax, i) => (
                                     <div key={i} className="relative pb-6 last:pb-0">
                                         <div className={`absolute -left-[21px] top-1 w-2 h-2 border border-white rounded-full ${vax.pending ? 'bg-amber-400' : 'bg-zinc-900'}`}></div>
                                         <div className="flex justify-between items-start">
                                             <span className={`text-xs font-bold uppercase ${vax.pending ? 'text-amber-600' : 'text-zinc-900'}`}>{vax.name}</span>
                                             <span className="text-[10px] font-mono text-zinc-400">{vax.date}</span>
                                         </div>
                                     </div>
                                 ))}
                             </div>
                         </TechCard>

                         <TechCard label="ZONING">
                             <div className="flex items-center gap-2 mb-6">
                                 <School size={16} className="text-zinc-400"/>
                                 <h3 className="text-xs font-bold uppercase tracking-widest">Edu Allocation</h3>
                             </div>
                             
                             <div className="space-y-3">
                                 <div className="p-3 border border-zinc-900 bg-zinc-50">
                                     <div className="flex justify-between mb-1">
                                          <span className="text-[9px] font-mono text-zinc-500 uppercase">Primary Target</span>
                                          <span className="text-[9px] font-mono text-zinc-900 font-bold">0.8 KM</span>
                                     </div>
                                     <div className="text-sm font-bold uppercase">SDN 1 Tasikmalaya</div>
                                 </div>
                                 <div className="p-3 border border-zinc-200 opacity-60">
                                     <div className="flex justify-between mb-1">
                                          <span className="text-[9px] font-mono text-zinc-500 uppercase">Alternative</span>
                                          <span className="text-[9px] font-mono text-zinc-900 font-bold">1.5 KM</span>
                                     </div>
                                     <div className="text-sm font-bold uppercase">SDN Galunggung</div>
                                 </div>
                             </div>
                         </TechCard>
                     </div>

                     <div className="border border-zinc-200 bg-gradient-to-r from-zinc-50 to-white p-6 flex items-center justify-between">
                         <div className="flex items-center gap-4">
                             <Activity size={24} className="text-zinc-300"/>
                             <div>
                                 <h3 className="text-sm font-bold uppercase tracking-widest text-zinc-900">NutriCheck System</h3>
                                 <p className="text-[10px] font-mono text-zinc-500">PERIODIC HEALTH ASSESSMENT REQUIRED</p>
                             </div>
                         </div>
                         <button className="px-6 py-3 bg-zinc-900 text-white text-[10px] font-bold uppercase tracking-[0.2em] hover:bg-black">
                             Initiate
                         </button>
                     </div>
                 </div>
             </div>
        </PageLayout>
    )
}

// 5. DIGITAL IDENTITY
export const DigitalIdentityPage = () => {
    return (
        <PageLayout title="Digital Identity" subtitle="Citizen Data" bgImage={img_id} colorTheme="zinc">
             <div className="flex flex-col items-center">
                 {/* The Card Component - Industrial Style */}
                 <motion.div 
                    initial={{ rotateX: 10, opacity: 0 }}
                    animate={{ rotateX: 0, opacity: 1 }}
                    transition={{ duration: 0.8 }}
                    className="w-full max-w-md aspect-[1.58/1] bg-zinc-900 text-white p-6 relative overflow-hidden shadow-2xl mb-12 border border-zinc-700"
                    style={{ background: 'radial-gradient(circle at 50% 0%, #333 0%, #111 100%)' }}
                 >
                     {/* Holographic strip simulation */}
                     <div className="absolute top-8 left-0 w-full h-12 bg-white/5 skew-y-3 pointer-events-none"></div>
                     <div className="absolute bottom-4 right-4 text-[200px] font-bold text-white/5 leading-none -z-0 pointer-events-none">ID</div>

                     <div className="relative z-10 flex justify-between items-start mb-8">
                         <div className="flex items-center gap-3">
                             <Fingerprint size={32} className="text-zinc-500"/>
                             <div className="flex flex-col">
                                 <span className="text-[8px] font-mono uppercase text-zinc-500 tracking-widest">Tasik.AI System</span>
                                 <span className="text-sm font-bold uppercase tracking-widest">Citizen ID</span>
                             </div>
                         </div>
                         <div className="w-8 h-8 border border-zinc-600 flex items-center justify-center bg-zinc-800">
                             <div className="w-4 h-4 bg-emerald-500 rounded-sm shadow-[0_0_10px_#10b981]"></div>
                         </div>
                     </div>

                     <div className="relative z-10 flex gap-6 items-end">
                         <div className="w-20 h-24 bg-zinc-800 border border-zinc-600 overflow-hidden relative grayscale">
                              <img src="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80" className="w-full h-full object-cover mix-blend-luminosity opacity-80" />
                              <div className="absolute inset-0 bg-[linear-gradient(transparent_50%,rgba(0,0,0,0.5)_50%)] bg-[length:100%_4px]"></div>
                         </div>
                         <div className="flex-1 space-y-2">
                             <div>
                                 <div className="text-[8px] font-mono text-zinc-500 uppercase">Subject Name</div>
                                 <div className="text-lg font-bold uppercase tracking-wider text-zinc-100">Alexander Doe</div>
                             </div>
                             <div>
                                 <div className="text-[8px] font-mono text-zinc-500 uppercase">NIK / ID String</div>
                                 <div className="font-mono text-sm tracking-[0.2em] text-zinc-300">3278 0102 9900 1234</div>
                             </div>
                         </div>
                     </div>
                 </motion.div>

                 {/* Access Logs Table */}
                 <div className="w-full max-w-4xl grid grid-cols-1 md:grid-cols-2 gap-8">
                     <TechCard label="ACCESS_LOGS">
                         <div className="flex items-center gap-2 mb-6 text-zinc-400">
                             <Activity size={16}/>
                             <h3 className="text-xs font-bold uppercase tracking-widest">Recent Activity</h3>
                         </div>
                         <div className="space-y-4">
                             {[
                                 { svc: "RSUD Health Data", time: "00:01", status: "AUTH", ok: true },
                                 { svc: "Tax Payment Portal", time: "(-1D)", status: "AUTH", ok: true },
                                 { svc: "Bank Loan Check", time: "12/08", status: "DENIED", ok: false },
                             ].map((log, i) => (
                                 <div key={i} className="flex justify-between items-center text-xs border-b border-zinc-100 pb-3 last:border-0">
                                     <span className="font-bold text-zinc-900">{log.svc}</span>
                                     <div className="flex items-center gap-3">
                                         <div className="text-right">
                                             <div className={`text-[10px] font-bold ${log.ok ? 'text-emerald-600' : 'text-amber-600'}`}>{log.status}</div>
                                             <div className="text-[9px] font-mono text-zinc-400">{log.time}</div>
                                         </div>
                                         {log.ok ? <CheckCircle size={12} className="text-emerald-500"/> : <XCircle size={12} className="text-amber-500"/>}
                                     </div>
                                 </div>
                             ))}
                         </div>
                     </TechCard>

                     <TechCard label="DOCUMENTS">
                         <div className="flex items-center gap-2 mb-6 text-zinc-400">
                             <FileText size={16}/>
                             <h3 className="text-xs font-bold uppercase tracking-widest">Document Wallet</h3>
                         </div>
                         <div className="grid grid-cols-2 gap-3">
                             {['SIM A', 'BPJS Kesehatan', 'NPWP', 'Akta Lahir'].map((doc, i) => (
                                 <button key={i} className="p-4 border border-zinc-200 bg-zinc-50 hover:bg-zinc-900 hover:text-white hover:border-zinc-900 transition-all text-left group">
                                     <div className="mb-2 text-zinc-400 group-hover:text-zinc-500">
                                         <CreditCard size={14}/>
                                     </div>
                                     <div className="text-[10px] font-bold uppercase tracking-wide">{doc}</div>
                                     <div className="text-[8px] font-mono text-zinc-400 mt-1 opacity-0 group-hover:opacity-100 transition-opacity">VIEW_DATA</div>
                                 </button>
                             ))}
                         </div>
                     </TechCard>
                 </div>
             </div>
        </PageLayout>
    )
}