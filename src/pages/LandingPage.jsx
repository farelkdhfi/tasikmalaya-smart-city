import React, { useEffect, useState, useRef, useMemo } from 'react'
import { Link, useNavigate } from "react-router-dom"
import { Canvas, useFrame } from '@react-three/fiber'
import { 
    Float, 
    Environment, 
    MeshDistortMaterial, 
    ContactShadows, 
    PerspectiveCamera,
    Sphere,
    Torus
} from '@react-three/drei'
import { motion, AnimatePresence } from 'framer-motion' // Added AnimatePresence for smooth mobile menu
import * as THREE from 'three'

// Icons
import {
    Menu, X, Sparkles, ArrowRight, ChevronRight,
    ArrowUpRight, Search, LayoutGrid
} from 'lucide-react'
import { SECTION_DATA } from '../data/sectionData'

// Assets
import LogoImg from '../assets/images/logotasik.png'

// --- SHARED COMPONENTS ---

const SectionHeader = ({ title, subtitle, linkText = "View All", linkTo = "#" }) => (
    <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-6 md:mb-8 px-2 border-b border-zinc-200/60 pb-4">
        <div className="mb-4 md:mb-0">
            <span className="text-xs font-semibold text-blue-600 uppercase tracking-wider mb-1 block">{subtitle}</span>
            <h2 className="text-xl md:text-3xl font-semibold text-zinc-900 tracking-tight">{title}</h2>
        </div>
        <Link to={linkTo} className="hidden md:flex items-center gap-1 text-sm font-medium text-blue-600 hover:text-blue-700 transition-colors group">
            {linkText} <ChevronRight size={16} className="group-hover:translate-x-0.5 transition-transform" />
        </Link>
        {/* Mobile View All Link */}
        <Link to={linkTo} className="flex md:hidden items-center gap-1 text-xs font-medium text-blue-600">
            {linkText} <ChevronRight size={14} />
        </Link>
    </div>
)

const Navbar = () => {
    const [scrolled, setScrolled] = useState(false)
    const [mobileMenu, setMobileMenu] = useState(false)

    useEffect(() => {
        const handleScroll = () => setScrolled(window.scrollY > 20)
        window.addEventListener('scroll', handleScroll)
        return () => window.removeEventListener('scroll', handleScroll)
    }, [])

    // Prevent body scroll when mobile menu is open
    useEffect(() => {
        if (mobileMenu) {
            document.body.style.overflow = 'hidden'
        } else {
            document.body.style.overflow = 'unset'
        }
    }, [mobileMenu])

    return (
        <>
            <header className={`fixed top-0 w-full z-50 transition-all duration-300 ${scrolled ? 'bg-white/80 backdrop-blur-xl border-b border-zinc-200/50 py-3' : 'bg-transparent py-4 md:py-5'
                }`}>
                <div className="max-w-6xl mx-auto px-4 md:px-6 flex justify-between items-center">
                    <div className="flex items-center gap-2 text-zinc-900 z-50 relative">
                        <div className="w-6 h-6 flex items-center justify-center">
                            <img src={LogoImg} alt="Logo" className="h-full" />
                        </div>
                        <span className="text-base md:text-lg font-medium tracking-tight">Kota Tasikmalaya</span>
                    </div>

                    {/* Desktop Nav */}
                    <nav className='hidden md:flex items-center gap-6'>
                        {['Overview', 'Services', 'Intelligence', 'Data'].map((item) => (
                            <a key={item} href="#" className='text-sm font-medium text-zinc-500 hover:text-zinc-900 transition-colors'>
                                {item}
                            </a>
                        ))}
                    </nav>

                    {/* Desktop Actions */}
                    <div className="hidden md:flex gap-3 items-center">
                        <div className="w-8 h-8 rounded-full bg-zinc-100 flex items-center justify-center hover:bg-zinc-200 cursor-pointer transition-colors">
                            <Search size={16} className="text-zinc-500" />
                        </div>
                        <button className="bg-zinc-900 text-white px-4 py-2 rounded-full text-xs font-medium hover:bg-zinc-800 transition-colors shadow-lg shadow-zinc-900/10">
                            My Account
                        </button>
                    </div>

                    {/* Mobile Toggle */}
                    <button className="md:hidden text-zinc-900 z-50 relative p-2" onClick={() => setMobileMenu(!mobileMenu)}>
                        {mobileMenu ? <X size={24} /> : <Menu size={24} />}
                    </button>
                </div>
            </header>

            {/* Mobile Menu Overlay */}
            <AnimatePresence>
                {mobileMenu && (
                    <motion.div 
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        transition={{ duration: 0.2 }}
                        className="fixed inset-0 bg-white z-40 pt-24 px-6 md:hidden flex flex-col"
                    >
                        <nav className="flex flex-col gap-6">
                            {['Overview', 'Services', 'Intelligence', 'Data'].map((item) => (
                                <a 
                                    key={item} 
                                    href="#" 
                                    className='text-2xl font-semibold text-zinc-800 border-b border-zinc-100 pb-4'
                                    onClick={() => setMobileMenu(false)}
                                >
                                    {item}
                                </a>
                            ))}
                        </nav>
                        <div className="mt-8 flex flex-col gap-4">
                            <button className="w-full bg-zinc-100 text-zinc-900 py-3 rounded-xl font-medium flex items-center justify-center gap-2">
                                <Search size={18} /> Search
                            </button>
                            <button className="w-full bg-zinc-900 text-white py-3 rounded-xl font-medium shadow-lg">
                                My Account
                            </button>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    )
}

// --- WIDGET STYLE NAVIGATION (ENVIRONMENT) ---
const EnvironmentSection = () => {
    const data = SECTION_DATA.environment;

    return (
        <section className="py-16 md:py-24 bg-[#F5F5F7]">
            <div className="max-w-6xl mx-auto px-4 md:px-6">
                <SectionHeader title={data.title} subtitle={data.subtitle} linkTo="/environment-dashboard" />

                {/* Grid Responsif: 1 kolom (Mobile) -> 2 kolom (SM) -> 3 kolom (MD) -> 5 kolom (LG) */}
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
                    {data.items.map((item) => (
                        <Link to={item.link} key={item.id} className="block group">
                            <motion.div
                                whileHover={{ y: -4, scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                className="bg-white rounded-3xl p-4 h-40 md:h-56 flex flex-col justify-between shadow-sm hover:shadow-xl hover:shadow-blue-500/5 border border-zinc-100 transition-all duration-300 relative overflow-hidden"
                            >
                                {/* Header: Icon & Arrow */}
                                <div className="flex justify-between items-start z-10">
                                    <div className="w-10 h-10 rounded-2xl bg-zinc-50 flex items-center justify-center text-blue-600 group-hover:bg-blue-600 group-hover:text-white transition-colors duration-300">
                                        <item.icon size={20} />
                                    </div>
                                    <div className="w-7 h-7 rounded-full bg-zinc-100 flex items-center justify-center text-zinc-400 group-hover:text-blue-600 transition-colors">
                                        <ArrowUpRight size={14} />
                                    </div>
                                </div>

                                {/* Content: Label & Desc */}
                                <div className="z-10 mt-auto">
                                    <h3 className="text-base md:text-lg font-semibold text-zinc-900 leading-tight mb-1 group-hover:text-blue-600 transition-colors">
                                        {item.label}
                                    </h3>
                                    <p className="text-xs text-zinc-500 font-medium line-clamp-2">{item.desc}</p>
                                </div>

                                {/* Subtle Background Image */}
                                <div className="absolute inset-0 opacity-0 group-hover:opacity-10 transition-opacity duration-500 pointer-events-none">
                                    <img src={item.img} alt="" className="w-full h-full object-cover grayscale" />
                                </div>
                            </motion.div>
                        </Link>
                    ))}
                </div>
            </div>
        </section>
    )
}

// --- LIST STYLE NAVIGATION (EDUCATION) ---
const EducationSection = () => {
    const data = SECTION_DATA.education;

    return (
        <section className="py-16 md:py-24 bg-white">
            <div className="max-w-6xl mx-auto px-4 md:px-6">
                <SectionHeader title={data.title} subtitle={data.subtitle} linkTo="/education-hub" />

                <div className="bg-white rounded-3xl border border-zinc-200 shadow-sm overflow-hidden">
                    {data.items.map((item, idx) => (
                        <Link to={item.link} key={idx} className="block group">
                            <div className={`relative flex items-center p-4 md:p-6 hover:bg-zinc-50 transition-colors duration-200 ${idx !== data.items.length - 1 ? 'border-b border-zinc-100' : ''}`}>
                                
                                {/* Thumbnail / Icon */}
                                <div className="w-12 h-12 md:w-14 md:h-14 rounded-xl overflow-hidden bg-zinc-100 shrink-0 border border-zinc-100 group-hover:border-zinc-300 transition-colors">
                                    <img src={item.img} alt="" className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-300" />
                                </div>

                                {/* Text Content */}
                                <div className="ml-4 md:ml-5 flex-grow min-w-0">
                                    <div className="flex flex-wrap items-center gap-2 mb-1">
                                        <h3 className="text-sm md:text-base font-semibold text-zinc-900 group-hover:text-blue-600 transition-colors truncate">
                                            {item.label}
                                        </h3>
                                        {item.status === "New" && (
                                            <span className="px-2 py-0.5 rounded-full bg-blue-100 text-blue-700 text-[10px] font-bold uppercase shrink-0">New</span>
                                        )}
                                    </div>
                                    <p className="text-xs md:text-sm text-zinc-500 truncate md:whitespace-normal">{item.desc}</p>
                                </div>

                                {/* Action Area */}
                                <div className="flex items-center gap-4 pl-2">
                                    <span className="hidden md:block text-xs font-medium text-zinc-400 bg-zinc-50 px-3 py-1 rounded-full border border-zinc-100 whitespace-nowrap">
                                        Module {item.id}
                                    </span>
                                    <div className="w-6 h-6 md:w-8 md:h-8 rounded-full flex items-center justify-center text-zinc-300 group-hover:text-blue-600 group-hover:translate-x-1 transition-all shrink-0">
                                        <ChevronRight size={18} className="md:w-5 md:h-5" />
                                    </div>
                                </div>
                            </div>
                        </Link>
                    ))}
                    
                    {/* View All Footer in the Card */}
                    <Link to="/education-center" className="block bg-zinc-50 p-4 text-center border-t border-zinc-100 hover:bg-zinc-100 transition-colors">
                        <span className="text-sm font-medium text-blue-600">View Full Syllabus</span>
                    </Link>
                </div>
            </div>
        </section>
    )
}

// --- BENTO GRID NAVIGATION (SECURITY) ---
const SecuritySection = () => {
    const data = SECTION_DATA.security;
    return (
        <section className="py-16 md:py-24 bg-[#F5F5F7]" id="security">
            <div className="max-w-6xl mx-auto px-4 md:px-6">
                <SectionHeader title={data.title} subtitle={data.subtitle} linkTo="/security-dashboard" />

                {/* Grid Bento Responsif */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 auto-rows-[180px] md:auto-rows-[200px]">
                    {data.items.map((item, idx) => (
                        <Link 
                            to={item.link} 
                            key={idx} 
                            // Logic Class: Mobile selalu col-span-1, Desktop (md) mengikuti properti item.span
                            className={`group relative block w-full ${item.span ? `md:${item.span}` : 'md:col-span-1'}`}
                        >
                            <motion.div
                                whileHover={{ scale: 1.01 }}
                                whileTap={{ scale: 0.99 }}
                                className="w-full h-full bg-white rounded-3xl p-5 md:p-6 shadow-sm border border-zinc-200/60 overflow-hidden flex flex-col justify-between hover:shadow-lg hover:border-blue-200 transition-all duration-300"
                            >
                                {/* Top: Icon & Indicator */}
                                <div className="flex justify-between items-start z-20">
                                    <div className="w-10 h-10 rounded-full bg-zinc-50 flex items-center justify-center text-zinc-900 group-hover:bg-blue-600 group-hover:text-white transition-colors duration-300">
                                        <item.icon size={18} />
                                    </div>
                                    <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-white/80 backdrop-blur rounded-full p-1.5 shadow-sm">
                                        <ArrowUpRight size={14} className="text-blue-600" />
                                    </div>
                                </div>

                                {/* Bottom: Label */}
                                <div className="z-20">
                                    <h3 className="text-base md:text-lg font-bold text-zinc-900 leading-tight group-hover:text-blue-600 transition-colors">
                                        {item.label}
                                    </h3>
                                    <p className="text-[10px] md:text-xs text-zinc-400 mt-1 font-medium">Access Service</p>
                                </div>

                                {/* Background Image: Very Subtle */}
                                <div className="absolute inset-0 z-0 opacity-0 group-hover:opacity-10 transition-opacity duration-500">
                                    <img src={item.img} alt="" className="w-full h-full object-cover grayscale" />
                                </div>
                                <div className="absolute inset-0 bg-gradient-to-t from-white via-white/50 to-transparent z-10 pointer-events-none"></div>
                            </motion.div>
                        </Link>
                    ))}
                </div>
            </div>
        </section>
    )
}

// --- OPTIMIZED ELEGANT 3D ELEMENTS (UPSCALED) ---
const ElegantShapes = () => {
    // Optimization: Memoize materials to prevent recreation on re-renders
    const lightBlueMaterial = useMemo(() => new THREE.MeshPhysicalMaterial({
        color: "#3b82f6",
        roughness: 0.2,
        metalness: 0.1,
        clearcoat: 1,
        clearcoatRoughness: 0.1,
    }), [])

    const glassMaterial = useMemo(() => new THREE.MeshPhysicalMaterial({
        roughness: 0.15,
        transmission: 0.95,
        thickness: 2,
        color: "#ffffff",
        ior: 1.5,
        transparent: true,
        opacity: 0.8,
    }), [])

    const ceramicMaterial = useMemo(() => new THREE.MeshStandardMaterial({
        color: "#f4f4f5",
        roughness: 0.3,
        metalness: 0.8,
    }), [])

    return (
        <>
            <PerspectiveCamera makeDefault position={[0, 0, 14]} fov={50} />
            
            <ambientLight intensity={0.8} />
            <spotLight position={[20, 20, 20]} angle={0.15} penumbra={1} intensity={1} />
            <Environment preset="city" />

            {/* Main Floating Liquid Sphere */}
            <Float speed={2} rotationIntensity={1} floatIntensity={1.5} floatingRange={[-1, 1]}>
                <mesh position={[8, -3, -5]} scale={5.5} material={lightBlueMaterial}>
                    <sphereGeometry args={[1, 32, 32]} />
                    <MeshDistortMaterial
                        color="#3b82f6"
                        envMapIntensity={1}
                        clearcoat={1}
                        clearcoatRoughness={0.1}
                        metalness={0.1}
                        roughness={0.2}
                        distort={0.3} 
                        speed={1.5}
                    />
                </mesh>
            </Float>

            {/* Glassy Torus */}
            <Float speed={3} rotationIntensity={1.5} floatIntensity={1} floatingRange={[-0.5, 0.5]}>
                <Torus 
                    position={[-9, 4, -10]} 
                    args={[5, 1.5, 16, 48]} 
                    rotation={[1, 0.5, 0]} 
                    material={glassMaterial}
                />
            </Float>

            {/* Small Satellite Sphere */}
            <Float speed={1.5} rotationIntensity={2} floatIntensity={2}>
                <Sphere position={[-6, -6, -2]} args={[1.8, 24, 24]} material={ceramicMaterial}>
                </Sphere>
            </Float>
            
            {/* Background Sphere */}
            <Float speed={1} rotationIntensity={0.5} floatIntensity={0.5}>
                 <Sphere position={[10, 8, -15]} args={[2.5, 24, 24]}>
                    <meshPhysicalMaterial
                        color="#93c5fd"
                        roughness={0}
                        transmission={0.6}
                        thickness={1}
                    />
                </Sphere>
            </Float>

            {/* Optimized Shadows */}
            <ContactShadows 
                position={[0, -9, 0]} 
                opacity={0.3} 
                scale={60} 
                blur={3} 
                far={10} 
                resolution={512} 
                color="#1d4ed8" 
                frames={1} 
            />
        </>
    )
}


// --- HERO SECTION ---
const Hero = () => {
    const navigate = useNavigate()
    return (
        <section className='relative pt-24 pb-12 md:pt-32 md:pb-20 w-full overflow-hidden bg-[#F5F5F7] min-h-[90vh] md:min-h-0 flex items-center justify-center'>
            {/* 3D Background - Optimized */}
            <div className="absolute inset-0 z-0 pointer-events-none">
                <Canvas 
                    dpr={[1, 1.5]} 
                    gl={{ antialias: true, stencil: false, powerPreference: "high-performance" }}
                    camera={{ position: [0, 0, 14], fov: 50 }} 
                >
                      <ElegantShapes />
                </Canvas>
                
                {/* Gradient Overlays */}
                <div className="absolute inset-0 bg-gradient-to-b from-[#F5F5F7]/20 via-transparent to-[#F5F5F7] z-10"></div>
                <div className="absolute inset-0 bg-white/30 backdrop-blur-[1px] z-0"></div>
            </div>

            <div className='relative z-10 max-w-4xl mx-auto px-4 md:px-6 text-center mt-8 md:mt-0'>
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/80 backdrop-blur-md border border-zinc-200 shadow-sm mb-6">
                        <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
                        <span className="text-[10px] md:text-xs font-semibold text-zinc-600 uppercase tracking-wide">System Online</span>
                    </div>
                    
                    {/* Typography Responsif */}
                    <h1 className='text-4xl sm:text-5xl md:text-7xl font-bold text-zinc-900 tracking-tight mb-4 md:mb-6 leading-[1.1]'>
                        Tasikmalaya <br />
                        <span className="text-zinc-400 font-medium">Smart City.</span>
                    </h1>
                    
                    <p className='text-base md:text-lg text-zinc-500 mb-8 md:mb-10 max-w-xs md:max-w-2xl mx-auto leading-relaxed'>
                        Access all municipal services, real-time data monitoring, and educational resources from one central dashboard.
                    </p>

                    <div className="flex flex-col sm:flex-row gap-3 md:gap-4 justify-center items-center w-full sm:w-auto">
                        <button onClick={() => navigate('/virtual-assistant')} className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 text-white px-6 md:px-8 py-3 md:py-4 rounded-full text-sm font-semibold shadow-lg shadow-blue-600/20 transition-all hover:scale-105 flex items-center justify-center gap-2">
                            Initialize AI <ArrowRight size={16} />
                        </button>
                        <button onClick={() => navigate('/traffic')} className="w-full sm:w-auto bg-white/80 backdrop-blur-sm hover:bg-white text-zinc-900 border border-zinc-200 px-6 md:px-8 py-3 md:py-4 rounded-full text-sm font-semibold transition-all flex items-center justify-center gap-2 shadow-sm">
                            View CCTV
                        </button>
                    </div>
                </motion.div>
            </div>
        </section>
    )
}

// --- AI SECTION ---
const AISection = () => {
    const navigate = useNavigate()
    
    return (
        <section className="py-16 md:py-24 bg-white border-t border-zinc-100">
            <div className="max-w-4xl mx-auto px-4 md:px-6 text-center">
                <div className="bg-gradient-to-b from-zinc-50 to-white border border-zinc-100 rounded-[2rem] md:rounded-[3rem] p-6 md:p-12 shadow-sm relative overflow-hidden">
                      {/* Decorative blur */}
                      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-48 md:w-64 h-24 md:h-32 bg-blue-100 blur-[60px] md:blur-[80px] opacity-50 pointer-events-none"></div>

                    <div className="relative z-10">
                        <div className="w-12 h-12 md:w-16 md:h-16 bg-white rounded-2xl shadow-md border border-zinc-100 flex items-center justify-center mx-auto mb-4 md:mb-6">
                            <Sparkles size={20} className="md:w-6 md:h-6 text-blue-600" />
                        </div>
                        <h2 className="text-2xl md:text-4xl font-bold text-zinc-900 tracking-tight mb-3 md:mb-4">
                            Need Assistance?
                        </h2>
                        <p className="text-sm md:text-base text-zinc-500 mb-6 md:mb-8 max-w-lg mx-auto">
                            Use the virtual assistant to quickly navigate services or ask questions about city protocols.
                        </p>
                        
                        <button 
                            onClick={() => navigate('virtual-assistant')}
                            className="bg-zinc-900 text-white px-6 md:px-8 py-3 rounded-full font-medium text-xs md:text-sm shadow-xl shadow-zinc-900/10 hover:bg-zinc-800 transition-all hover:scale-105 flex items-center gap-2 mx-auto"
                        >
                           <div className="w-2 h-2 rounded-full bg-blue-400"></div> Launch Assistant
                        </button>
                    </div>
                </div>
            </div>
        </section>
    )
}

// --- FOOTER ---
const Footer = () => {
    return (
        <footer className='bg-white pt-12 md:pt-20 pb-8 md:pb-10 text-zinc-900 border-t border-zinc-200'>
            <div className="max-w-6xl mx-auto px-6">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-10 mb-12 md:mb-16">
                    <div className="col-span-2 md:col-span-1">
                        <div className="flex items-center gap-2 mb-4">
                             <div className="w-6 h-6 flex items-center justify-center">
                                <img src={LogoImg} alt="Logo" className="w-4 h-4" />
                            </div>
                            <span className="font-bold text-sm">Kota Tasikmalaya</span>
                        </div>
                        <p className="text-xs text-zinc-500 leading-relaxed">
                            Official Smart City Dashboard. <br/>Integrated municipal services.
                        </p>
                    </div>
                    {[
                        { title: 'Navigation', links: ['Home', 'Dashboard', 'Services', 'Map'] },
                        { title: 'Resources', links: ['Documentation', 'API', 'Support', 'Status'] },
                        { title: 'Legal', links: ['Privacy', 'Terms', 'Cookie Policy', 'Licenses'] },
                    ].map((col, idx) => (
                        <div key={idx} className="flex flex-col gap-3">
                            <h4 className="text-xs font-bold text-zinc-400 uppercase tracking-wider">{col.title}</h4>
                            {col.links.map(link => (
                                <a key={link} href="#" className="text-sm font-medium text-zinc-600 hover:text-blue-600 transition-colors">{link}</a>
                            ))}
                        </div>
                    ))}
                </div>
                <div className="pt-6 md:pt-8 border-t border-zinc-100 flex flex-col md:flex-row justify-between items-center text-xs text-zinc-400 gap-2 md:gap-0">
                    <p>© 2026 Tasikmalaya Smart City.</p>
                    <p>v2.4.0 (Stable)</p>
                </div>
            </div>
        </footer>
    )
}

// --- MAIN LAYOUT ---
const LandingPage = () => {
    return (
        <div className="bg-[#F5F5F7] min-h-screen text-zinc-900 font-sans antialiased selection:bg-blue-100 selection:text-blue-900">
            <Navbar />
            <main>
                <Hero />
                <EnvironmentSection />
                <EducationSection />
                <SecuritySection />
                <AISection />
            </main>
            <Footer />
        </div>
    )
}

export default LandingPage