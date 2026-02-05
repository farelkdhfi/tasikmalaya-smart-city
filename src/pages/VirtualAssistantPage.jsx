import React, { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import ReactMarkdown from 'react-markdown'
import { Canvas, useFrame } from '@react-three/fiber'
import { Float, Environment, PerspectiveCamera, ContactShadows, Sparkles as ThreeSparkles } from '@react-three/drei'
import * as THREE from 'three'
// Import Lucide Icons
import { ArrowLeft, Bot, User, MoveRight, Sparkles } from 'lucide-react'

// Ganti path ini sesuai lokasi file groq.js Anda
import { request } from "../utils/groq" 

// ==========================================
// 1. COMPONENTS: 3D HOLOGRAPHIC JEWEL
// ==========================================

const HolographicCore = ({ state }) => {
    const groupRef = useRef()
    const outerRingRef = useRef()
    const innerRingRef = useRef()

    useFrame((stateThree, delta) => {
        const time = stateThree.clock.getElapsedTime();
        const isThinking = state === 'listening' || state === 'speaking';
        
        const speedMultiplier = isThinking ? 2.0 : 0.4; 
        
        // Rotasi Cincin Halus
        if (outerRingRef.current) {
            outerRingRef.current.rotation.x += delta * 0.1 * speedMultiplier;
            outerRingRef.current.rotation.y += delta * 0.05 * speedMultiplier;
        }
        if (innerRingRef.current) {
            innerRingRef.current.rotation.x -= delta * 0.15 * speedMultiplier;
            innerRingRef.current.rotation.z += delta * 0.1 * speedMultiplier;
        }
    })

    // Config untuk State Aktif vs Idle
    const isActive = state === 'listening' || state === 'speaking';
    const activeScale = isActive ? 1.4 : 0.8;
    const activeSpeed = isActive ? 1.2 : 0.2;
    // Opacity rendah agar tidak mengganggu chat
    const particleOpacity = isActive ? 0.6 : 0.3; 

    return (
        <Float speed={2} rotationIntensity={0.5} floatIntensity={0.5}>
            <group ref={groupRef} scale={1.8}>
                
                {/* --- LAYER 1: GOLD (Luxury Accent) --- */}
                <ThreeSparkles
                    count={isActive ? 60 : 30}
                    scale={activeScale}
                    size={isActive ? 5 : 3}
                    speed={activeSpeed}
                    opacity={particleOpacity}
                    color="#fbbf24" // Amber/Gold
                    noise={0.5} 
                />

                {/* --- LAYER 2: CYAN (Modern Tech) --- */}
                 <ThreeSparkles
                    count={isActive ? 60 : 30}
                    scale={activeScale * 0.9} // Sedikit lebih kecil
                    size={isActive ? 5 : 3}
                    speed={activeSpeed * 0.8}
                    opacity={particleOpacity}
                    color="#22d3ee" // Cyan
                    noise={0.5} 
                />

                {/* --- LAYER 3: MAGENTA (Depth) --- */}
                <ThreeSparkles
                    count={isActive ? 60 : 30}
                    scale={activeScale * 1.1} // Sedikit lebih besar
                    size={isActive ? 5 : 3}
                    speed={activeSpeed * 1.2}
                    opacity={particleOpacity}
                    color="#e879f9" // Soft Purple/Pink
                    noise={0.5} 
                />

                {/* Glow Halus di Tengah (Putih Bersih) */}
                 <pointLight 
                    distance={5} 
                    intensity={isActive ? 2 : 0.5} 
                    color="#ffffff"
                    decay={2}
                />

                {/* 2. Inner Ring: Transparan/Ghost */}
                <mesh ref={innerRingRef}>
                    <torusGeometry args={[1.0, 0.005, 16, 100]} />
                    <meshStandardMaterial 
                        color="#a1a1aa" 
                        roughness={0} 
                        metalness={1} 
                        transparent={true}
                        opacity={0.3} // Sangat tipis
                    />
                </mesh>

                {/* 3. Outer Ring: Transparan/Ghost */}
                <group ref={outerRingRef}>
                     <mesh rotation={[Math.PI / 2, 0, 0]}>
                        <torusGeometry args={[1.6, 0.005, 16, 100]} />
                        <meshStandardMaterial 
                            color="#d4d4d8" 
                            roughness={0}
                            metalness={1}
                            transparent={true}
                            opacity={0.2} // Lebih tipis lagi
                        />
                    </mesh>
                </group>

                {/* 4. Atmosphere: Debu halus background */}
                <ThreeSparkles 
                    count={30} 
                    scale={5} 
                    size={2} 
                    speed={0.1} 
                    opacity={0.1} 
                    color="#52525b" 
                />
            </group>
        </Float>
    )
}

const BackgroundScene = ({ state }) => {
    return (
        <div className="absolute inset-0 z-0 w-full h-full bg-[#fafafa]">
            <Canvas gl={{ antialias: true, toneMapping: THREE.ACESFilmicToneMapping }}>
                <PerspectiveCamera makeDefault position={[0, 0, 7]} fov={45} />
                
                <color attach="background" args={['#fafafa']} /> 
                <fog attach="fog" args={['#fafafa', 5, 20]} />

                {/* Lighting: Soft Studio */}
                <ambientLight intensity={1} />
                <spotLight position={[10, 10, 10]} angle={0.5} penumbra={1} intensity={1} color="#ffffff" />
                <spotLight position={[-10, 0, -5]} angle={0.5} intensity={0.5} color="#e2e8f0" /> 
                
                <HolographicCore state={state} />
                
                {/* Shadow sangat tipis */}
                <ContactShadows position={[0, -2.5, 0]} opacity={0.15} scale={10} blur={3} far={4} color="#000000" />

                <Environment preset="dawn" />
            </Canvas>
             {/* Vignette Putih Pudar untuk blending */}
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_20%,#fafafa_100%)] pointer-events-none"></div>
        </div>
    )
}

// ==========================================
// 2. COMPONENTS: UI (Light & Clean)
// ==========================================

const ChatInterface = ({ onStateChange }) => {
    const [messages, setMessages] = useState([]) 
    const [hasStarted, setHasStarted] = useState(false)
    const [loading, setLoading] = useState(false)
    const [inputValue, setInputValue] = useState("")
    const messagesEndRef = useRef(null) 

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
    }

    useEffect(() => { scrollToBottom() }, [messages, loading])

    const submit = async () => {
        if (!inputValue.trim()) return;
        
        const prompt = inputValue;
        setInputValue(""); 
        if (!hasStarted) setHasStarted(true); 

        const userMsg = { id: Date.now(), role: 'user', text: prompt };
        setMessages(prev => [...prev, userMsg]);
        
        setLoading(true);
        onStateChange("listening");

        try {
            const historyForAI = messages.concat(userMsg).map(m => ({
                role: m.role === 'ai' ? 'assistant' : 'user',
                content: m.text
            }));
            
            const reply = await request(historyForAI);
            
            const aiMsg = { id: Date.now() + 1, role: 'ai', text: reply };
            setMessages(prev => [...prev, aiMsg]);
            
        } catch (error) {
            console.error(error);
            setMessages(prev => [...prev, { id: Date.now(), role: 'ai', text: "Maaf, koneksi terputus." }]);
        } finally {
            setLoading(false);
            onStateChange("idle");
        }
    }

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
    }
    const messageVariants = {
        hidden: { opacity: 0, y: 10 },
        visible: { opacity: 1, y: 0, transition: { type: "tween", ease: "easeOut", duration: 0.3 } }
    }

    return (
        <div className="flex flex-col h-screen w-full relative z-20 text-zinc-900 font-sans selection:bg-zinc-200 selection:text-black">
            
            {/* --- Header --- */}
            <div className="absolute top-0 w-full p-8 flex justify-between items-start z-50 pointer-events-none">
                <div className="pointer-events-auto">
                    <Link to="/" className="group flex items-center gap-3 opacity-60 hover:opacity-100 transition-all duration-300">
                        <div className="w-8 h-8 rounded-full border border-zinc-200 flex items-center justify-center bg-white/80 backdrop-blur shadow-sm group-hover:border-zinc-400 transition-colors">
                            <ArrowLeft size={14} className="text-zinc-700" />
                        </div>
                        <span className="text-xs font-medium tracking-[0.2em] uppercase text-zinc-600">Return</span>
                    </Link>
                </div>
                <div className="flex flex-col items-end opacity-40">
                     <div className="w-10 h-[2px] bg-zinc-900 mb-1"></div>
                     <span className="text-[10px] font-mono font-bold tracking-widest uppercase text-zinc-900">Tasik.AI</span>
                </div>
            </div>

            {/* --- Hero Section --- */}
            <AnimatePresence>
                {!hasStarted && (
                    <motion.div 
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0, scale: 0.95, filter: "blur(10px)" }}
                        transition={{ duration: 0.6 }}
                        className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none z-10"
                    >
                        <div className="text-center space-y-8">
                            <motion.div 
                                initial={{ y: 20, opacity: 0 }}
                                animate={{ y: 0, opacity: 1 }}
                                transition={{ delay: 0.2 }}
                                className="flex flex-col items-center gap-4"
                            >
                                <h1 className="text-5xl md:text-8xl font-light tracking-tighter text-zinc-900">
                                    Tasik<span className="font-bold">Intelligence</span>
                                </h1>
                                <div className="h-[1px] w-24 bg-zinc-300"></div>
                                <p className="text-sm md:text-base text-zinc-500 font-mono tracking-widest uppercase">
                                    City Database • Neural Interface v2
                                </p>
                            </motion.div>
                            
                            <motion.div 
                                initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}
                                className="flex flex-wrap justify-center gap-4 pt-8 pointer-events-auto"
                            >
                                {["Layanan KTP", "Kuliner Lokal", "Cuaca", "Wisata"].map((tag, i) => (
                                    <button 
                                        key={i}
                                        onClick={() => setInputValue(tag)}
                                        className="px-5 py-2 bg-white border border-zinc-200 text-zinc-500 hover:text-zinc-900 hover:border-zinc-400 hover:shadow-md text-xs tracking-wide uppercase transition-all duration-300 rounded-sm"
                                    >
                                        {tag}
                                    </button>
                                ))}
                            </motion.div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>


            {/* --- Chat Stream --- */}
            <div className={`flex-1 overflow-y-auto px-4 md:px-0 py-24 scrollbar-hide transition-all duration-700 ${hasStarted ? 'opacity-100' : 'opacity-0'}`}>
                <motion.div 
                    variants={containerVariants}
                    initial="hidden"
                    animate="visible"
                    className="max-w-2xl mx-auto w-full flex flex-col gap-10 pb-4"
                >
                    {messages.map((msg) => (
                        <motion.div 
                            key={msg.id}
                            variants={messageVariants}
                            layout
                            className={`flex w-full ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                        >
                            <div className={`flex max-w-[90%] md:max-w-[85%] gap-5 ${msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
                                
                                <div className={`w-8 h-8 flex items-center justify-center shrink-0 rounded-full border ${
                                    msg.role === 'user' 
                                    ? 'border-zinc-200 bg-zinc-100' 
                                    : 'border-zinc-200 bg-white shadow-sm'
                                }`}>
                                    {msg.role === 'user' 
                                        ? <User size={14} className="text-zinc-500"/> 
                                        : <Bot size={14} className="text-zinc-900"/>
                                    }
                                </div>

                                <div className={`flex flex-col ${msg.role === 'user' ? 'items-end' : 'items-start'}`}>
                                    <div className={`relative px-4 py-3 md:px-0 md:py-2 text-base md:text-lg font-medium leading-relaxed tracking-wide ${
                                        msg.role === 'user' 
                                        ? 'text-zinc-500 text-right' 
                                        : 'text-zinc-900'
                                    }`}>
                                        <div className="prose prose-zinc prose-p:font-light prose-p:text-zinc-700 prose-headings:font-normal prose-headings:text-zinc-900 prose-strong:text-zinc-900 prose-strong:font-bold prose-code:text-xs prose-code:font-mono prose-code:bg-zinc-100 prose-code:px-1 prose-code:py-0.5 prose-code:rounded-sm prose-code:text-zinc-600">
                                            <ReactMarkdown 
                                                components={{
                                                    p: ({node, ...props}) => <p className="mb-4 last:mb-0" {...props} />
                                                }}
                                            >
                                                {msg.text}
                                            </ReactMarkdown>
                                        </div>
                                    </div>
                                    <span className="text-[9px] text-zinc-400 font-mono tracking-widest uppercase mt-1">
                                        {msg.role === 'user' ? 'You' : 'System'} • {new Date(msg.id).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                                    </span>
                                </div>
                            </div>
                        </motion.div>
                    ))}

                    {loading && (
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex w-full justify-start pl-14">
                           <div className="flex items-center gap-2">
                                <div className="h-[1px] w-4 bg-zinc-300"></div>
                                <span className="text-xs font-mono text-zinc-400 animate-pulse uppercase tracking-widest">Processing</span>
                           </div>
                        </motion.div>
                    )}
                    <div ref={messagesEndRef} className="h-4" />
                </motion.div>
            </div>

            {/* --- Input Area --- */}
            <div className="fixed bottom-0 left-0 w-full p-8 flex justify-center z-30 bg-gradient-to-t from-[#fafafa] via-[#fafafa] to-transparent">
                <div className="max-w-2xl w-full relative">
                    <div className="relative flex items-center bg-white border border-zinc-200 focus-within:border-zinc-400 focus-within:shadow-lg transition-all duration-500 rounded-sm p-1 shadow-[0_4px_20px_rgba(0,0,0,0.03)]">
                        <div className={`pl-4 pr-3 transition-colors duration-300 ${loading ? 'text-zinc-900 animate-pulse' : 'text-zinc-400'}`}>
                            <Sparkles size={18} strokeWidth={1.5} />
                        </div>
                        <input
                            type="text"
                            value={inputValue}
                            onChange={(e) => setInputValue(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && submit()}
                            onFocus={() => { if(!loading) onStateChange("listening") }}
                            onBlur={() => { if(!loading) onStateChange("idle") }}
                            placeholder={hasStarted ? "Ketik instruksi..." : "Mulai percakapan..."}
                            className="flex-1 bg-transparent border-none outline-none text-zinc-800 placeholder:text-zinc-400 h-12 text-sm font-light tracking-wide"
                            disabled={loading}
                        />
                        <button
                            onClick={submit}
                            disabled={loading || !inputValue.trim()}
                            className={`w-10 h-10 flex items-center justify-center transition-all duration-300 border border-transparent ${
                                loading || !inputValue.trim()
                                ? 'text-zinc-300 cursor-not-allowed' 
                                : 'text-white bg-zinc-900 hover:bg-black rounded-sm'
                            }`}
                        >
                            <MoveRight size={18} />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}

// ==========================================
// 3. MAIN EXPORTS
// ==========================================

export const MainAi = () => {
    return (
        <section className='min-h-screen flex flex-col items-center justify-center w-full bg-[#fafafa] relative overflow-hidden font-sans text-zinc-900'>
            
            <div className="absolute inset-0 opacity-[0.03] pointer-events-none mix-blend-multiply" style={{ backgroundImage: 'url("https://grainy-gradients.vercel.app/noise.svg")' }}></div>

            <div className="relative z-10 flex flex-col items-center max-w-4xl px-6 text-center">
                
                <motion.div
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ duration: 1.2, ease: "circOut" }}
                    className="mb-12"
                >
                    <div className="w-20 h-20 border border-zinc-300 rotate-45 flex items-center justify-center">
                        <div className="w-12 h-12 border border-zinc-400 rotate-45 flex items-center justify-center bg-white shadow-xl">
                            <div className="w-2 h-2 bg-zinc-900 rounded-full"></div>
                        </div>
                    </div>
                </motion.div>

                <motion.h1
                    initial={{ y: 30, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ duration: 0.8 }}
                    className='text-6xl md:text-8xl font-light tracking-tighter mb-8'
                >
                    Tasikmalaya<br/>
                    <span className="font-bold">Intelligence.</span>
                </motion.h1>
                
                <motion.p 
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.2, duration: 0.8 }}
                    className='text-lg text-zinc-500 max-w-lg mx-auto mb-16 font-light leading-relaxed'
                >
                    Sistem kecerdasan kota terintegrasi. Akses data publik, layanan, dan wawasan dalam antarmuka yang jernih dan elegan.
                </motion.p>
                
                <motion.div
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.4 }}
                >
                    <Link to='/virtualAst'>
                        <button className='group relative px-10 py-4 border border-zinc-200 bg-white hover:border-zinc-900 hover:bg-zinc-900 hover:text-white transition-all duration-500 ease-out uppercase text-xs tracking-[0.2em] font-medium shadow-sm'>
                            <span className="flex items-center gap-4">
                                Initialize System
                                <ChevronRight size={14} className="group-hover:translate-x-1 transition-transform"/>
                            </span>
                        </button>
                    </Link>
                </motion.div>
            </div>
            
            <div className="absolute bottom-10 w-full flex justify-between px-10 opacity-40 text-zinc-500">
               <span className="text-[10px] font-mono tracking-widest uppercase">SYS.STATUS: ONLINE</span>
               <span className="text-[10px] font-mono tracking-widest uppercase">V 2.6.0 (HOLO)</span>
            </div>
        </section>
    )
}

export const VirtualAssistantPage = () => {
    const [orbState, setOrbState] = useState("idle");

    return (
        <div className="w-full h-screen bg-[#fafafa] relative overflow-hidden font-sans flex flex-col">
            <BackgroundScene state={orbState} />
            <ChatInterface onStateChange={setOrbState} />
        </div>
    )
}

export default MainAi;