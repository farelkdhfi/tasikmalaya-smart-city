import React, { useEffect, useState } from 'react'
import { Link, useNavigate } from "react-router-dom"
import { Canvas } from '@react-three/fiber'
import { Float, Sparkles as ThreeSparkles, ContactShadows, Environment } from '@react-three/drei'
import { motion, AnimatePresence } from 'framer-motion'

// Icons
import {
    Shield, Phone, Ticket, Flame, AlertTriangle,
    GraduationCap, Leaf, Recycle, Baby, Fingerprint,
    Info, Bus, Ambulance, HeartPulse, Calendar,
    Menu, X, Sparkles, MoveRight, ArrowRight, ChevronRight,
    ArrowUpRight, Circle, Disc, MapPin, Wind,
    BookOpen, Clock
} from 'lucide-react'

// --- DATA ---

const SECTION_DATA = {
    environment: {
        title: "Urban Ecosystem",
        subtitle: "Live Monitoring",
        description: "Real-time environmental controls and city pulse analysis.",
        items: [
            {
                id: 1,
                img: "https://images.unsplash.com/photo-1480714378408-67cf0d13bc1b?q=80&w=2070&auto=format&fit=crop",
                link: '/Information', label: 'City Pulse', icon: Info,
                desc: "Density Feed", stat: "Live"
            },
            {
                id: 2,
                img: "https://images.unsplash.com/photo-1570125909232-eb263c188f7e?q=80&w=2071&auto=format&fit=crop",
                link: '/Transport', label: 'Mobility', icon: Bus,
                desc: "Traffic AI", stat: "98%"
            },
            {
                id: 3,
                img: "https://images.unsplash.com/photo-1584036561566-baf8f5f1b144?q=80&w=2032&auto=format&fit=crop",
                link: '/Emergency', label: 'Response', icon: Ambulance,
                desc: "Rapid Units", stat: "2min"
            },
            {
                id: 4,
                img: "https://images.unsplash.com/photo-1505751172876-fa1923c5c528?q=80&w=2070&auto=format&fit=crop",
                link: '/Health', label: 'E-Health', icon: HeartPulse,
                desc: "Bio-Data", stat: "Secure"
            },
            {
                id: 5,
                img: "https://images.unsplash.com/photo-1543269865-cbf427effbad?q=80&w=2070&auto=format&fit=crop",
                link: '/Calendar', label: 'Events', icon: Calendar,
                desc: "Agenda", stat: "12 Actv"
            },
        ]
    },
    education: {
        title: "Learning Modules",
        subtitle: "Curriculum",
        description: "Select a specific pathway to access materials and certification.",
        items: [
            {
                id: "01",
                img: "https://images.unsplash.com/photo-1523240795612-9a054b0db644?q=80&w=2070&auto=format&fit=crop",
                link: '/education-center', label: 'Digital Academy', icon: GraduationCap,
                desc: "Core competencies for digital citizenship and smart governance.", status: "Open"
            },
            {
                id: "02",
                img: "https://images.unsplash.com/photo-1518531933037-91b2f5f229cc?q=80&w=1527&auto=format&fit=crop",
                link: '/green', label: 'Eco Awareness', icon: Leaf,
                desc: "Sustainability guides, urban farming, and carbon footprint reduction.", status: "New"
            },
            {
                id: "03",
                img: "https://images.unsplash.com/photo-1532996122724-e3c354a0b15b?q=80&w=2070&auto=format&fit=crop",
                link: '/recycling', label: 'Waste Management', icon: Recycle,
                desc: "Smart recycling protocols and schedule for hazardous materials.", status: "Open"
            },
            {
                id: "04",
                img: "https://images.unsplash.com/photo-1485546246426-74dc88dec4d9?q=80&w=2069&auto=format&fit=crop",
                link: '/smart-child', label: 'Child Development', icon: Baby,
                desc: "Parenting resources, health tracking, and safety guidelines.", status: "Updated"
            },
            {
                id: "05",
                img: "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?q=80&w=2070&auto=format&fit=crop",
                link: '/digital-footprints', label: 'Cyber Security', icon: Fingerprint,
                desc: "Protecting your digital identity and personal data privacy.", status: "Premium"
            },
        ]
    },
    security: {
        id: 'security',
        title: "Security Ecosystem",
        subtitle: "Integrated Protection",
        description: "Real-time surveillance and rapid response systems protecting every corner of Tasikmalaya.",
        items: [
            {
                img: "https://images.unsplash.com/photo-1555617766-c94804975da3?q=80&w=2070&auto=format&fit=crop",
                link: '/traffic', label: 'Traffic AI', icon: Ticket,
                span: 'col-span-1 md:col-span-2'
            },
            {
                img: "https://images.unsplash.com/photo-1495542779398-9fec7dc796dd?q=80&w=1978&auto=format&fit=crop",
                link: '/child-protection', label: 'Child Safety', icon: Shield,
                span: 'col-span-1 md:col-span-1 md:row-span-2'
            },
            {
                img: "https://images.unsplash.com/photo-1582139329536-e7284fece509?q=80&w=2000&auto=format&fit=crop",
                link: '/police-call-center', label: 'Police Center', icon: Phone,
                span: 'col-span-1 md:col-span-1'
            },
            {
                img: "https://images.unsplash.com/photo-1589939705384-5185137a7f0f?q=80&w=2070&auto=format&fit=crop",
                link: '/fireman-call-center', label: 'Fire Response', icon: Flame,
                span: 'col-span-1 md:col-span-2'
            },
            {
                img: "https://images.unsplash.com/photo-1599233078028-1f56b77227dc?q=80&w=1929&auto=format&fit=crop",
                link: '/regional-disaster', label: 'Disaster Relief', icon: AlertTriangle,
                span: 'col-span-1 md:col-span-2'
            },
        ]
    }
}

// --- 3D COMPONENT ---
const LandingOrb = () => {
    return (
        <Float speed={2} rotationIntensity={0.5} floatIntensity={0.5}>
            <ThreeSparkles count={40} scale={3} size={4} speed={0.4} opacity={0.5} color="#fbbf24" noise={0.2} />
            <ThreeSparkles count={40} scale={3.5} size={3} speed={0.3} opacity={0.4} color="#22d3ee" noise={0.3} />
            <mesh rotation={[Math.PI / 2, 0, 0]}>
                <torusGeometry args={[2.5, 0.005, 32, 100]} />
                <meshStandardMaterial color="#a1a1aa" transparent opacity={0.2} />
            </mesh>
            <mesh rotation={[Math.PI / 1.5, Math.PI / 4, 0]}>
                <torusGeometry args={[1.8, 0.005, 32, 100]} />
                <meshStandardMaterial color="#d4d4d8" transparent opacity={0.15} />
            </mesh>
        </Float>
    )
}

// --- SHARED UI COMPONENTS ---

const Button = ({ children, primary, onClick, className = "" }) => (
    <motion.button
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        onClick={onClick}
        className={`px-8 py-4 rounded-sm text-xs font-medium uppercase tracking-[0.15em] transition-all duration-300 flex items-center gap-3 border ${primary
                ? 'bg-zinc-900 text-white border-zinc-900 hover:bg-black'
                : 'bg-white text-zinc-900 border-zinc-200 hover:border-zinc-900'
            } ${className}`}
    >
        {children}
    </motion.button>
)

const Navbar = () => {
    const [scrolled, setScrolled] = useState(false)
    const [mobileMenu, setMobileMenu] = useState(false)

    useEffect(() => {
        const handleScroll = () => setScrolled(window.scrollY > 50)
        window.addEventListener('scroll', handleScroll)
        return () => window.removeEventListener('scroll', handleScroll)
    }, [])

    return (
        <header className={`fixed top-0 w-full z-50 transition-all duration-700 ${scrolled ? 'bg-[#fafafa]/80 backdrop-blur-xl border-b border-zinc-200/50 py-4' : 'bg-transparent py-6'
            }`}>
            <div className=" mx-auto px-6 flex justify-between items-center">
                <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-white border border-zinc-200 flex items-center justify-center shadow-sm">
                        <div className="w-1.5 h-1.5 bg-zinc-900 rounded-full"></div>
                    </div>
                    <span className="text-xs font-bold tracking-[0.2em] uppercase text-zinc-900">Tasik.AI</span>
                </div>

                <nav className='hidden md:flex gap-10'>
                    {['Overview', 'Services', 'Intelligence', 'Data'].map((item) => (
                        <a key={item} href="#" className='text-[10px] uppercase tracking-[0.15em] font-medium text-zinc-500 hover:text-zinc-900 transition-colors'>
                            {item}
                        </a>
                    ))}
                </nav>

                <div className="hidden md:block">
                    <button className="text-xs font-medium text-zinc-600 hover:text-zinc-900 transition-colors">Log In</button>
                </div>
                <button className="md:hidden text-zinc-900" onClick={() => setMobileMenu(!mobileMenu)}>
                    {mobileMenu ? <X size={20} /> : <Menu size={20} />}
                </button>
            </div>
        </header>
    )
}

// --- ENVIRONMENT SECTION (EXPANDING CARDS) ---
const EnvironmentSection = () => {
    const data = SECTION_DATA.environment;
    const [activeId, setActiveId] = useState(2);

    return (
        <section className="py-24 md:py-32 bg-[#fafafa] relative border-t border-zinc-200 overflow-hidden">
            {/* Background Decoration */}
            <div className="absolute left-0 top-1/4 w-full h-[1px] bg-zinc-100"></div>

            <div className="mx-auto px-6 md:px-12">
                <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
                    <div>
                        <div className="flex items-center gap-3 mb-4 text-emerald-600/80">
                            <Wind size={16} className="animate-pulse" />
                            <h3 className="text-xs font-bold uppercase tracking-[0.2em]">{data.subtitle}</h3>
                        </div>
                        <h2 className="text-4xl md:text-5xl font-light text-zinc-900 tracking-tighter leading-none">
                            {data.title}
                        </h2>
                    </div>
                    <div className="flex gap-4">
                        <div className="px-4 py-2 border border-zinc-200 rounded-full flex items-center gap-2 bg-white/50 backdrop-blur-sm">
                            <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
                            <span className="text-[10px] font-mono uppercase text-zinc-500">AQI: 45 Good</span>
                        </div>
                        <div className="px-4 py-2 border border-zinc-200 rounded-full flex items-center gap-2 bg-white/50 backdrop-blur-sm">
                            <MapPin size={12} className="text-zinc-400" />
                            <span className="text-[10px] font-mono uppercase text-zinc-500">TSM Central</span>
                        </div>
                    </div>
                </div>

                {/* THE EXPANDING GRID */}
                <div className="flex flex-col md:flex-row h-[600px] md:h-[500px] gap-2 md:gap-4 w-full">
                    {data.items.map((item) => {
                        const isActive = activeId === item.id;
                        return (
                            <motion.div
                                layout
                                key={item.id}
                                onMouseEnter={() => setActiveId(item.id)}
                                transition={{ type: "spring", stiffness: 200, damping: 25 }}
                                className={`relative cursor-pointer rounded-sm overflow-hidden border border-zinc-200 transition-colors duration-500 ease-out
                    ${isActive ? 'md:flex-[3] flex-[3] border-zinc-400 shadow-xl' : 'md:flex-[1] flex-[1] grayscale hover:grayscale-0 bg-white'}
                `}
                            >
                                {/* Pembungkus Link Utama */}
                                <Link to={item.link} className="absolute inset-0 z-10">
                                    <span className="sr-only">Buka {item.label}</span>
                                </Link>

                                {/* Background Image */}
                                <img
                                    src={item.img}
                                    alt={item.label}
                                    className="absolute inset-0 w-full h-full object-cover"
                                />

                                {/* Overlay Gradient */}
                                <div className={`absolute inset-0 transition-all duration-500 ${isActive ? 'bg-gradient-to-t from-zinc-900/90 via-zinc-900/20 to-transparent' : 'bg-zinc-900/40 hover:bg-zinc-900/20'}`}></div>

                                {/* Content Container */}
                                <div className="absolute inset-0 p-6 flex flex-col justify-between pointer-events-none">
                                    {/* Top Bar */}
                                    <div className="flex justify-between items-start">
                                        <div className={`w-10 h-10 rounded-sm flex items-center justify-center backdrop-blur-md border transition-all duration-300
                            ${isActive ? 'bg-white text-zinc-900 border-white' : 'bg-black/30 text-white border-white/20'}
                        `}>
                                            <item.icon size={18} />
                                        </div>

                                        <AnimatePresence>
                                            {isActive && (
                                                <motion.div
                                                    initial={{ opacity: 0, x: 20 }}
                                                    animate={{ opacity: 1, x: 0 }}
                                                    exit={{ opacity: 0 }}
                                                    className="flex items-center gap-2"
                                                >
                                                    <span className="px-2 py-1 bg-emerald-500/20 text-emerald-300 text-[10px] font-bold uppercase tracking-widest rounded-full border border-emerald-500/30 backdrop-blur-md">
                                                        {item.stat}
                                                    </span>
                                                    {/* Tombol dihapus, diganti visual indicator saja jika perlu */}
                                                    <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center">
                                                        <ArrowUpRight size={14} className="text-zinc-900" />
                                                    </div>
                                                </motion.div>
                                            )}
                                        </AnimatePresence>
                                    </div>

                                    {/* Bottom Info */}
                                    <div className="relative overflow-hidden">
                                        <motion.h3
                                            layout="position"
                                            className={`font-medium uppercase tracking-tight text-white mb-1 transition-all duration-300 ${isActive ? 'text-2xl md:text-3xl' : 'text-sm md:text-lg md:-rotate-90 md:origin-bottom-left md:translate-x-8 md:-translate-y-8 md:whitespace-nowrap'}`}
                                        >
                                            {item.label}
                                        </motion.h3>

                                        <AnimatePresence>
                                            {isActive && (
                                                <motion.div
                                                    initial={{ opacity: 0, height: 0 }}
                                                    animate={{ opacity: 1, height: 'auto' }}
                                                    exit={{ opacity: 0, height: 0 }}
                                                >
                                                    <p className="text-zinc-300 text-sm font-light max-w-xs">{item.desc}</p>
                                                </motion.div>
                                            )}
                                        </AnimatePresence>
                                    </div>
                                </div>
                            </motion.div>
                        )
                    })}
                </div>
            </div>
        </section>
    )
}

// --- NEW DESIGN: EDUCATION SECTION (DIRECTORY STYLE WITH THUMBNAILS) ---
const EducationSection = () => {
    const data = SECTION_DATA.education;
    const [activeIndex, setActiveIndex] = useState(0);

    return (
        <section className="py-24 bg-white relative border-b border-zinc-100">
            <div className="mx-auto px-6 md:px-12">

                {/* Header Compact */}
                <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
                    <div>
                        <div className="flex items-center gap-3 mb-3">
                            <BookOpen size={16} className="text-zinc-400" />
                            <h3 className="text-xs font-bold text-zinc-400 uppercase tracking-[0.2em]">{data.subtitle}</h3>
                        </div>
                        <h2 className="text-3xl md:text-5xl font-light text-zinc-900 tracking-tight">
                            {data.title}
                        </h2>
                    </div>
                    <div className="max-w-md">
                        <p className="text-zinc-500 font-light text-sm md:text-base leading-relaxed">
                            {data.description} All modules are integrated with your City ID profile.
                        </p>
                    </div>
                </div>

                {/* Main Content: Split Layout */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">

                    {/* LEFT: The Menu List with Thumbnails */}
                    <div className="lg:col-span-5 flex flex-col">
                        {data.items.map((item, idx) => (
                            <Link
                                to={item.link}
                                key={idx}
                                onMouseEnter={() => setActiveIndex(idx)}
                                className={`group relative py-4 border-b border-zinc-100 transition-all duration-300 cursor-pointer ${activeIndex === idx ? 'border-zinc-900' : ''}`}
                            >
                                <div className="flex items-center justify-between">
                                    {/* Left side: ID + Image + Text */}
                                    <div className="flex items-center gap-5">
                                        <span className={`text-xs font-mono transition-colors duration-300 ${activeIndex === idx ? 'text-zinc-900 font-bold' : 'text-zinc-300'}`}>
                                            {item.id}
                                        </span>

                                        {/* THUMBNAIL IMAGE ADDED HERE */}
                                        <div className={`relative w-20 h-14 rounded-sm overflow-hidden shrink-0 border transition-all duration-300 ${activeIndex === idx ? 'border-zinc-900 shadow-sm' : 'border-zinc-200 opacity-80 group-hover:opacity-100'}`}>
                                            <img
                                                src={item.img}
                                                alt={item.label}
                                                className={`w-full h-full object-cover transition-all duration-500 ${activeIndex === idx ? 'grayscale-0 scale-110' : 'grayscale group-hover:grayscale-0 scale-100'}`}
                                            />
                                        </div>

                                        <div>
                                            <h3 className={`text-lg font-medium transition-colors duration-300 ${activeIndex === idx ? 'text-zinc-900' : 'text-zinc-500 group-hover:text-zinc-800'}`}>
                                                {item.label}
                                            </h3>
                                        </div>
                                    </div>

                                    {/* Right side: Status & Arrow */}
                                    <div className="flex items-center gap-4 pl-4">
                                        <span className={`text-[10px] uppercase tracking-wider px-2 py-1 rounded-sm border hidden md:inline-block ${activeIndex === idx ? 'border-zinc-900 text-zinc-900' : 'border-transparent text-zinc-400'}`}>
                                            {item.status}
                                        </span>
                                        <ArrowRight size={16} className={`transform transition-all duration-300 ${activeIndex === idx ? 'opacity-100 translate-x-0 text-zinc-900' : 'opacity-0 -translate-x-4 text-zinc-300'}`} />
                                    </div>
                                </div>
                            </Link>
                        ))}

                        <div className="mt-8 pt-4">
                            <a href="#" className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-zinc-900 hover:text-zinc-600 transition-colors border-b border-zinc-900 pb-1">
                                View Full Syllabus <ChevronRight size={14} />
                            </a>
                        </div>
                    </div>

                    {/* RIGHT: The Large Preview Area */}
                    <div className="lg:col-span-7 hidden lg:block sticky top-24">
                        <div className="relative aspect-[16/9] w-full bg-zinc-100 rounded-sm overflow-hidden border border-zinc-200 shadow-sm">
                            <AnimatePresence mode="wait">
                                <motion.div
                                    key={activeIndex}
                                    initial={{ opacity: 0, scale: 1.05 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    exit={{ opacity: 0 }}
                                    transition={{ duration: 0.4, ease: "easeOut" }}
                                    className="absolute inset-0"
                                >
                                    <img
                                        src={data.items[activeIndex].img}
                                        alt={data.items[activeIndex].label}
                                        className="w-full h-full object-cover grayscale"
                                    />
                                    {/* Elegant Overlay */}
                                    <div className="absolute inset-0 bg-zinc-900/20 mix-blend-multiply"></div>
                                    <div className="absolute inset-0 bg-gradient-to-t from-zinc-900/80 via-transparent to-transparent"></div>

                                    {/* Content inside Preview */}
                                    <div className="absolute bottom-0 left-0 p-8 w-full">
                                        <div className="flex items-center gap-3 mb-2 text-white/80">
                                            {React.createElement(data.items[activeIndex].icon, { size: 20 })}
                                            <span className="text-xs font-mono uppercase tracking-widest">Preview Module</span>
                                        </div>
                                        <p className="text-white text-lg font-light leading-relaxed max-w-lg">
                                            {data.items[activeIndex].desc}
                                        </p>
                                        <div className="mt-6 flex items-center gap-4">
                                            <div className="flex items-center gap-2 text-xs text-zinc-300 uppercase tracking-widest">
                                                <Clock size={14} /> 45 Mins
                                            </div>
                                            <div className="h-4 w-[1px] bg-white/20"></div>
                                            <div className="flex items-center gap-2 text-xs text-zinc-300 uppercase tracking-widest">
                                                Certified
                                            </div>
                                        </div>
                                    </div>
                                </motion.div>
                            </AnimatePresence>
                        </div>
                    </div>

                </div>
            </div>
        </section>
    )
}

// --- SECURITY SECTION (KEPT SAME) ---
const BentoCard = ({ item, span }) => {
    const Icon = item.icon || Info
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            whileHover={{ y: -5 }}
            className={`group relative overflow-hidden bg-white border border-zinc-100 ${span || 'col-span-1'} min-h-[240px] md:min-h-[280px] flex flex-col justify-between p-8 cursor-pointer hover:shadow-[0_20px_40px_-15px_rgba(0,0,0,0.05)] transition-all duration-700 ease-out`}
        >
            <Link to={item.link} className="absolute inset-0 z-20" />
            <div className="relative z-10 flex justify-between items-start">
                <div className="w-10 h-10 border border-zinc-100 bg-[#fafafa]/80 backdrop-blur-sm flex items-center justify-center text-zinc-500 group-hover:text-zinc-900 group-hover:border-zinc-300 transition-all duration-500 rounded-sm">
                    <Icon size={18} strokeWidth={1.5} />
                </div>
            </div>
            <div className="relative z-10 mt-auto">
                <h3 className="text-lg font-medium text-zinc-900 tracking-tight mb-1">{item.label}</h3>
                <div className="h-[1px] w-8 bg-zinc-200 group-hover:w-full group-hover:bg-zinc-900 transition-all duration-700"></div>
            </div>
            <div className="absolute inset-0 z-0">
                <div className="absolute inset-0 bg-gradient-to-t from-white/90 via-white/40 to-white/10 group-hover:via-white/20 transition-all duration-700 z-10"></div>
                <img src={item.img} alt={item.label} className="w-full h-full object-cover transform scale-100 group-hover:scale-110 grayscale group-hover:grayscale-0 transition-all duration-1000 ease-out" />
            </div>
        </motion.div>
    )
}

const SecuritySection = () => {
    const data = SECTION_DATA.security;
    return (
        <section className="py-32 bg-white relative border-t border-zinc-100" id="security">
            <div className=" mx-auto px-6 md:px-16">
                <div className="flex flex-col lg:flex-row items-start gap-12 lg:gap-20">
                    <div className="lg:w-1/3 sticky top-32">
                        <div className="flex items-center gap-4 mb-6">
                            <div className="h-[1px] w-12 bg-zinc-300"></div>
                            <h3 className="text-xs font-bold text-zinc-400 uppercase tracking-[0.2em]">{data.subtitle}</h3>
                        </div>
                        <h2 className="text-4xl md:text-5xl font-light text-zinc-900 tracking-tighter mb-8 leading-[1.1]">
                            {data.title}
                        </h2>
                        <p className="text-zinc-500 leading-relaxed font-light mb-10 text-lg">
                            {data.description}
                        </p>
                        <Button className="!px-6 !py-3">
                            Access Module <MoveRight size={16} />
                        </Button>
                    </div>
                    <div className="lg:w-2/3 grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4 w-full auto-rows-[minmax(200px,auto)]">
                        {data.items.map((item, idx) => (
                            <BentoCard key={idx} item={item} span={item.span} />
                        ))}
                    </div>
                </div>
            </div>
        </section>
    )
}

// --- HERO & AI SECTION (KEPT SAME) ---

const Hero = () => {
    return (
        <section className='relative min-h-screen w-full flex flex-col items-center justify-center overflow-hidden pt-20'>
            <div className="absolute inset-0 z-0 pointer-events-none">
                <Canvas camera={{ position: [0, 0, 8], fov: 45 }}>
                    <ambientLight intensity={1} />
                    <spotLight position={[10, 10, 10]} angle={0.5} penumbra={1} intensity={1} color="#ffffff" />
                    <LandingOrb />
                    <ContactShadows position={[0, -3, 0]} opacity={0.2} scale={10} blur={3} far={4} color="#000000" />
                    <Environment preset="dawn" />
                </Canvas>
            </div>
            <div className='relative z-10 flex flex-col items-center text-center max-w-4xl px-6'>
                <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1, ease: "easeOut" }}>
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-zinc-200 bg-white/50 backdrop-blur-sm mb-8">
                        <Sparkles size={12} className="text-amber-400" />
                        <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Tasikmalaya Intelligence System</span>
                    </div>
                    <h1 className='text-6xl md:text-9xl font-light text-zinc-900 tracking-tighter leading-[0.9] mb-8'>
                        Tasikmalaya<span className="font-bold">Smart</span><br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-zinc-900 via-zinc-500 to-zinc-900">City.</span>
                    </h1>
                    <p className='text-lg md:text-xl text-zinc-500 mb-12 max-w-xl mx-auto font-light leading-relaxed'>
                        The nervous system of Tasikmalaya. Real-time data, integrated services, and AI assistance in one porcelain interface.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
                        <Button primary>Initialize System</Button>
                        <a href="#services" className="text-zinc-500 text-xs uppercase tracking-widest hover:text-zinc-900 transition-colors flex items-center gap-2 group">
                            Explore Modules <ChevronRight size={14} className="group-hover:translate-x-1 transition-transform" />
                        </a>
                    </div>
                </motion.div>
            </div>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.5, duration: 1 }} className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 opacity-30">
                <div className="w-[1px] h-12 bg-gradient-to-b from-zinc-900 to-transparent"></div>
            </motion.div>
        </section>
    )
}

const AISection = () => {
    const navigate = useNavigate()
    return (
        <section className="py-32 bg-[#fafafa] relative overflow-hidden border-y border-zinc-100">
            <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-amber-100/30 rounded-full blur-[120px] mix-blend-multiply pointer-events-none"></div>
            <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-cyan-100/30 rounded-full blur-[120px] mix-blend-multiply pointer-events-none"></div>
            <div className=" mx-auto px-6 relative z-10">
                <div className="flex flex-col items-center text-center max-w-4xl mx-auto">
                    <motion.div initial={{ scale: 0.8, opacity: 0 }} whileInView={{ scale: 1, opacity: 1 }} transition={{ duration: 0.8 }} className="w-20 h-20 bg-white border border-zinc-100 shadow-xl flex items-center justify-center mb-10 relative overflow-hidden rounded-2xl">
                        <div className="absolute inset-0 bg-gradient-to-tr from-amber-100 via-cyan-100 to-magenta-100 opacity-50"></div>
                        <Sparkles size={32} className="text-zinc-900 relative z-10" strokeWidth={1} />
                    </motion.div>
                    <h2 className="text-5xl md:text-7xl font-light text-zinc-900 tracking-tighter mb-8">
                        Talk to the <span className="font-bold">City.</span>
                    </h2>
                    <p className="text-xl text-zinc-500 mb-12 font-light max-w-2xl leading-relaxed">
                        No more searching through menus. Just ask Tasik AI about traffic, documents, or emergencies. It's like having a city official in your pocket.
                    </p>
                    <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} onClick={() => navigate('virtual-assistant')} className="group relative px-10 py-5 bg-zinc-900 text-white overflow-hidden shadow-2xl rounded-sm">
                        <div className="absolute inset-0 bg-gradient-to-r from-amber-500 via-cyan-500 to-pink-500 opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-xl"></div>
                        <span className="relative z-10 flex items-center gap-4 text-xs font-bold uppercase tracking-[0.2em]">
                            Launch Neural Interface <ArrowRight size={16} />
                        </span>
                    </motion.button>
                </div>
            </div>
        </section>
    )
}

const Footer = () => {
    return (
        <footer className='bg-[#fafafa] pt-24 pb-12 border-t border-zinc-200 text-zinc-900'>
            <div className=" mx-auto px-6">
                <div className="grid grid-cols-2 md:grid-cols-6 gap-12 mb-20">
                    <div className="col-span-2 md:col-span-2">
                        <h2 className="text-sm font-bold uppercase tracking-[0.2em] mb-6">Tasik.AI</h2>
                        <p className="text-xs text-zinc-500 leading-relaxed max-w-xs font-light">
                            A digital infrastructure project by Tasikmalaya City Government. Integrating data for a smarter tomorrow.
                        </p>
                    </div>
                    {[
                        { title: 'Platform', links: ['Overview', 'Intelligence', 'Modules', 'Roadmap'] },
                        { title: 'Services', links: ['Public Safety', 'Education', 'Health', 'Transport'] },
                        { title: 'Support', links: ['Documentation', 'API Status', 'Contact', 'Legal'] },
                        { title: 'Social', links: ['Instagram', 'Twitter', 'GitHub', 'LinkedIn'] },
                    ].map((col, idx) => (
                        <div key={idx} className="flex flex-col gap-4">
                            <h4 className="text-[10px] font-bold uppercase tracking-widest text-zinc-400">{col.title}</h4>
                            {col.links.map(link => (
                                <a key={link} href="#" className="text-xs font-medium text-zinc-600 hover:text-zinc-900 transition-colors">{link}</a>
                            ))}
                        </div>
                    ))}
                </div>
                <div className="pt-8 border-t border-zinc-200 flex flex-col md:flex-row justify-between items-center text-[10px] text-zinc-400 uppercase tracking-widest gap-6">
                    <p>© 2026 Tasikmalaya Smart City. All systems nominal.</p>
                    <div className="flex gap-8">
                        <a href="#" className="hover:text-zinc-900">Privacy</a>
                        <a href="#" className="hover:text-zinc-900">Terms</a>
                        <a href="#" className="hover:text-zinc-900">Sitemap</a>
                    </div>
                </div>
            </div>
        </footer>
    )
}

// --- MAIN LAYOUT ---

const LandingPage = () => {
    return (
        <div className="bg-[#fafafa] min-h-screen text-zinc-900 font-sans antialiased selection:bg-zinc-200 selection:text-black">
            {/* Global Noise Texture Overlay */}
            <div className="fixed inset-0 opacity-[0.03] pointer-events-none mix-blend-multiply z-50" style={{ backgroundImage: 'url("https://grainy-gradients.vercel.app/noise.svg")' }}></div>

            <Navbar />

            <main>
                <Hero />
                <EnvironmentSection />
                <EducationSection />
                <AISection />
                <SecuritySection />
            </main>

            <Footer />
        </div>
    )
}

export default LandingPage