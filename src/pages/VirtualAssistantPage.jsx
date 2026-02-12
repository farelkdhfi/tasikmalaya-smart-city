import React, { useEffect, useRef, useState, useMemo, Suspense } from 'react' // Added Suspense
import { Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import ReactMarkdown from 'react-markdown'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { 
    Float, 
    Environment, 
    PerspectiveCamera, 
    ContactShadows, 
    MeshDistortMaterial,
    Sphere
} from '@react-three/drei'
import * as THREE from 'three'
import { 
    ArrowLeft, 
    Bot, 
    User, 
    ArrowUp, 
    Sparkles, 
    Cpu,
    Command,
    Loader2 // Added Loader icon
} from 'lucide-react'

// --- LOGIC IMPORT (DO NOT CHANGE) ---
import { request } from "../utils/groq" 

// --- NEW COMPONENT: SCENE READY TRIGGER ---
// Komponen ini hanya akan mount setelah semua aset dalam <Suspense> selesai dimuat
const SceneReady = ({ onLoaded }) => {
    useEffect(() => {
        // Beri sedikit delay agar transisi lebih mulus, atau langsung true
        const timeout = setTimeout(() => {
            onLoaded(true)
        }, 500) 
        return () => clearTimeout(timeout)
    }, [onLoaded])
    return null
}

// --- NEW COMPONENT: LOADING SCREEN ---
const LoadingScreen = () => {
    return (
        <motion.div 
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.8, ease: "easeInOut" }}
            className="fixed inset-0 z-[100] bg-[#F5F5F7] flex flex-col items-center justify-center"
        >
            <div className="relative flex items-center justify-center">
                {/* Pulse Effect */}
                <div className="absolute w-24 h-24 bg-blue-100 rounded-full animate-ping opacity-75"></div>
                <div className="relative bg-white p-4 rounded-2xl shadow-xl shadow-blue-100/50 border border-zinc-100">
                    <Cpu size={32} className="text-gray-600 animate-pulse" />
                </div>
            </div>
            
            <div className="mt-6 flex flex-col items-center gap-2">
                <div className="flex items-center gap-2 text-zinc-400 text-xs font-medium uppercase tracking-wider">
                    <Loader2 size={12} className="animate-spin" />
                    <span>Initializing Core...</span>
                </div>
            </div>
        </motion.div>
    )
}

// --- 3D COMPONENT: LIQUID AI CORE ---
const LiquidCore = ({ state }) => {
    const isThinking = state === 'listening' || state === 'speaking';
    const { viewport } = useThree();
    const isMobile = viewport.width < 5; 
    
    const materialProps = useMemo(() => ({
        color: isThinking ? "#3b82f6" : "#e4e4e7",
        roughness: 0.2,
        metalness: 0.1,
        clearcoat: 1,
        clearcoatRoughness: 0.1,
    }), [isThinking])

    return (
        <Float speed={2} rotationIntensity={1} floatIntensity={0.5}>
            <Sphere args={[1, 64, 64]} scale={isMobile ? 1.3 : 1.8}>
                <MeshDistortMaterial
                    {...materialProps}
                    distort={isThinking ? 0.6 : 0.3} 
                    speed={isThinking ? 4 : 1.5}
                />
            </Sphere>
            
            {isThinking && (
                <mesh scale={isMobile ? 1.6 : 2.2}>
                    <sphereGeometry args={[1, 32, 32]} />
                    <meshBasicMaterial color="#60a5fa" transparent opacity={0.1} side={THREE.BackSide} />
                </mesh>
            )}
        </Float>
    )
}

// --- MODIFIED BACKGROUND SCENE ---
// Menerima prop 'onLoaded' untuk memberi sinyal ke parent
const BackgroundScene = ({ state, onLoaded }) => {
    return (
        <div className="absolute inset-0 z-0 w-full h-full bg-[#F5F5F7]">
            <Canvas dpr={[1, 1.5]} gl={{ antialias: true, toneMapping: THREE.ACESFilmicToneMapping }}>
                <PerspectiveCamera makeDefault position={[0, 0, 8]} fov={45} />
                <ambientLight intensity={0.8} />
                <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} intensity={1} />
                <spotLight position={[-10, -10, -10]} intensity={0.5} color="#blue" />
                
                {/* Suspense membungkus elemen berat (HDR Environment & Mesh) */}
                <Suspense fallback={null}>
                    <LiquidCore state={state} />
                    <ContactShadows position={[0, -2.5, 0]} opacity={0.4} scale={10} blur={2.5} far={4} color="#1d4ed8" />
                    <Environment preset="city" />
                    
                    {/* Trigger ini hanya jalan jika Environment & LiquidCore selesai dimuat */}
                    <SceneReady onLoaded={onLoaded} />
                </Suspense>
            </Canvas>
            <div className="absolute inset-0 bg-gradient-to-b from-[#F5F5F7]/80 via-transparent to-[#F5F5F7] pointer-events-none"></div>
        </div>
    )
}

// --- UI COMPONENTS (UNCHANGED) ---

const Header = () => (
    <div className="fixed top-0 w-full z-50 px-4 md:px-6 py-3 md:py-4 pointer-events-none">
        <div className="max-w-4xl mx-auto pointer-events-auto">
            <div className="bg-white/70 backdrop-blur-xl border border-zinc-200/60 rounded-full px-3 py-2 md:px-4 md:py-3 flex justify-between items-center shadow-sm">
                <Link to="/" className="flex items-center gap-2 text-zinc-600 hover:text-zinc-900 transition-colors group">
                    <div className="w-8 h-8 rounded-full bg-zinc-100 flex items-center justify-center group-hover:bg-zinc-200 transition-colors">
                        <ArrowLeft size={16} />
                    </div>
                    <span className="text-sm font-medium hidden sm:inline">Back</span>
                </Link>

                <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
                    <span className="text-[10px] md:text-xs font-semibold text-zinc-500 uppercase tracking-wider">Tasik.AI Neural v2</span>
                </div>
            </div>
        </div>
    </div>
)

const EmptyState = ({ setInputValue }) => (
    <motion.div 
        initial={{ opacity: 0, y: 20 }} 
        animate={{ opacity: 1, y: 0 }} 
        exit={{ opacity: 0, scale: 0.95 }}
        transition={{ duration: 0.5 }}
        className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none z-10 px-4 mt-10 md:mt-0"
    >
        <div className="text-center space-y-6 md:space-y-8 max-w-lg pointer-events-auto w-full">
             <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 border border-blue-100 mb-2">
                <Sparkles size={12} className="text-blue-600" />
                <span className="text-[10px] font-bold text-blue-600 uppercase tracking-wide">AI Assistant Ready</span>
            </div>

            <h1 className="text-3xl sm:text-4xl md:text-6xl font-semibold tracking-tight text-zinc-900 leading-[1.1]">
                How can I help you <br/>
                <span className="text-zinc-400">in Tasikmalaya?</span>
            </h1>
            
            <div className="grid grid-cols-2 gap-2 md:gap-3 pt-4 w-full px-2 sm:px-0">
                {["Layanan KTP", "Info Cuaca", "Wisata Kuliner", "Pengaduan"].map((tag, i) => (
                    <button 
                        key={i} 
                        onClick={() => setInputValue(tag)} 
                        className="bg-white hover:bg-zinc-50 border border-zinc-200 hover:border-blue-300 text-zinc-600 hover:text-blue-600 px-3 py-3 md:px-4 md:py-3 rounded-2xl text-xs md:text-sm font-medium transition-all shadow-sm text-left flex items-center gap-2 group"
                    >
                        <Command size={14} className="text-zinc-300 group-hover:text-blue-400 shrink-0" />
                        <span className="truncate">{tag}</span>
                    </button>
                ))}
            </div>
        </div>
    </motion.div>
)

const MessageBubble = ({ msg }) => {
    const isUser = msg.role === 'user';
    
    return (
        <motion.div 
            initial={{ opacity: 0, y: 10, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            className={`flex w-full mb-6 md:mb-8 ${isUser ? 'justify-end' : 'justify-start'}`}
        >
            <div className={`flex max-w-[95%] sm:max-w-[90%] md:max-w-[80%] gap-3 md:gap-4 ${isUser ? 'items-end' : 'items-start'} flex-col`}>


                <div className={`flex flex-col ${isUser ? 'items-end' : 'items-start'} min-w-0`}>
                    <div className={`px-4 py-3 md:px-6 md:py-4 rounded-3xl text-[14px] md:text-[15px] leading-6 md:leading-7 shadow-sm border overflow-hidden
                        ${isUser 
                            ? 'bg-zinc-900/50 text-white rounded-tr-sm border-zinc-900/15' 
                            : 'bg-white/50 text-zinc-800 rounded-tl-sm border-zinc-100/15'
                        }`}
                    >
                        <ReactMarkdown
                            components={{
                                p: ({node, ...props}) => <p className="mb-3 md:mb-4 last:mb-0 break-words" {...props} />,
                                ul: ({node, ...props}) => <ul className="list-disc pl-4 md:pl-5 mb-3 md:mb-4 space-y-2 marker:text-zinc-400" {...props} />,
                                ol: ({node, ...props}) => <ol className="list-decimal pl-4 md:pl-5 mb-3 md:mb-4 space-y-2 marker:text-zinc-500 font-medium" {...props} />,
                                li: ({node, ...props}) => <li className="pl-1" {...props} />,
                                strong: ({node, ...props}) => <span className={`font-bold ${isUser ? 'text-white' : 'text-zinc-900'}`} {...props} />,
                                h1: ({node, ...props}) => <h1 className="text-lg md:text-xl font-bold mb-2 md:mb-3 mt-3 md:mt-4" {...props} />,
                                h2: ({node, ...props}) => <h2 className="text-base md:text-lg font-bold mb-2 md:mb-3 mt-3 md:mt-4" {...props} />,
                                h3: ({node, ...props}) => <h3 className="text-sm md:text-base font-bold mb-2 mt-3" {...props} />,
                                code: ({node, inline, ...props}) => (
                                    inline 
                                        ? <code className={`px-1.5 py-0.5 rounded-md text-xs font-mono break-all ${isUser ? 'bg-zinc-800 text-zinc-200' : 'bg-zinc-100 text-zinc-800 border border-zinc-200'}`} {...props} />
                                        : <div className="overflow-x-auto my-4 rounded-lg bg-zinc-900 p-3 md:p-4 text-zinc-100 text-xs font-mono w-full"><code {...props} /></div>
                                ),
                                blockquote: ({node, ...props}) => <blockquote className="border-l-4 border-zinc-200 pl-4 italic text-zinc-500 my-4 text-sm" {...props} />,
                            }}
                        >
                            {msg.text}
                        </ReactMarkdown>
                    </div>
                    <span className="text-[10px] text-zinc-400 font-medium mt-1 md:mt-2 px-1 select-none">
                        {new Date(msg.id).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                    </span>
                </div>
            </div>
        </motion.div>
    )
}

const ChatUI = ({ messages, loading, onSendMessage, hasStarted }) => {
    const [inputValue, setInputValue] = useState("")
    const messagesEndRef = useRef(null) 

    useEffect(() => { 
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
    }, [messages, loading])

    const handleSubmit = (e) => {
        if(e) e.preventDefault();
        if(!inputValue.trim()) return;
        onSendMessage(inputValue);
        setInputValue("");
    }

    return (
        <motion.div 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }} 
            transition={{ duration: 0.5 }}
            className="flex flex-col h-screen w-full relative z-20 font-sans"
        >
            <Header />

            <AnimatePresence>
                {!hasStarted && <EmptyState setInputValue={setInputValue} />}
            </AnimatePresence>

            <div className={`flex-1 overflow-y-auto w-full scrollbar-hide pt-24 md:pt-32 pb-28 md:pb-32 transition-all duration-500 ${hasStarted ? 'bg-white/30 backdrop-blur-sm' : ''}`}>
                <div className="max-w-3xl mx-auto px-3 md:px-6">
                    {messages.map((msg) => (
                        <MessageBubble key={msg.id} msg={msg} />
                    ))}
                    
                    {loading && (
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex justify-start w-full gap-3 md:gap-4 mb-8">
                            <div className="w-7 h-7 md:w-8 md:h-8 rounded-xl bg-gradient-to-br from-blue-600 to-blue-700 flex items-center justify-center shrink-0 shadow-sm mt-1">
                                <Cpu size={14} className="text-white md:w-4 md:h-4"/>
                            </div>
                            <div className="bg-white border border-zinc-100 px-4 md:px-5 py-3 md:py-4 rounded-3xl rounded-tl-sm shadow-sm flex items-center gap-2">
                                <span className="w-1.5 h-1.5 bg-zinc-400 rounded-full animate-bounce [animation-delay:-0.3s]"></span>
                                <span className="w-1.5 h-1.5 bg-zinc-400 rounded-full animate-bounce [animation-delay:-0.15s]"></span>
                                <span className="w-1.5 h-1.5 bg-zinc-400 rounded-full animate-bounce"></span>
                            </div>
                        </motion.div>
                    )}
                    <div ref={messagesEndRef} />
                </div>
            </div>

            <div className="fixed bottom-0 left-0 w-full p-3 md:p-6 z-30 pointer-events-none">
                <div className="max-w-3xl mx-auto pointer-events-auto">
                    <form onSubmit={handleSubmit} className="relative group">
                        <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-100 to-blue-50 rounded-full blur opacity-50 group-hover:opacity-100 transition duration-500"></div>
                        <div className="relative flex items-center bg-white/90 backdrop-blur-xl border border-zinc-200/80 p-1.5 md:p-2 rounded-full shadow-2xl shadow-zinc-200/50">
                            
                            <div className="pl-3 md:pl-4 pr-2">
                                {loading ? (
                                    <div className="animate-spin text-blue-600"><Cpu size={18} className="md:w-5 md:h-5" /></div>
                                ) : (
                                    <Bot size={18} className="text-zinc-400 md:w-5 md:h-5" />
                                )}
                            </div>

                            <input 
                                type="text" 
                                value={inputValue} 
                                onChange={(e) => setInputValue(e.target.value)} 
                                placeholder="Ask about Tasikmalaya..."
                                className="flex-1 bg-transparent border-none outline-none text-zinc-900 placeholder:text-zinc-400 h-10 text-sm md:text-base font-medium"
                                disabled={loading}
                            />
                            
                            <button 
                                type="submit" 
                                disabled={loading || !inputValue.trim()} 
                                className="w-9 h-9 md:w-10 md:h-10 flex items-center justify-center bg-blue-600 text-white rounded-full hover:bg-blue-700 hover:scale-105 active:scale-95 disabled:bg-zinc-200 disabled:scale-100 disabled:cursor-not-allowed transition-all duration-300 shadow-lg shadow-blue-600/20"
                            >
                                <ArrowUp size={16} className="md:w-[18px]" strokeWidth={2.5} />
                            </button>
                        </div>
                    </form>
                    <p className="text-center text-[9px] md:text-[10px] text-zinc-400 mt-2 md:mt-3 font-medium">
                        Tasik.AI can make mistakes. Consider checking important information.
                    </p>
                </div>
            </div>
        </motion.div>
    )
}

// --- MAIN PAGE ---
export default function VirtualAssistantPage() {
    const [messages, setMessages] = useState([]);
    const [orbState, setOrbState] = useState("idle");
    const [loading, setLoading] = useState(false);
    // NEW: State untuk tracking loading 3D
    const [is3DLoaded, setIs3DLoaded] = useState(false); 
    
    const handleSendMessage = async (text) => {
        const userMsg = { id: Date.now(), role: 'user', text: text };
        setMessages(prev => [...prev, userMsg]);
        
        setLoading(true);
        setOrbState("listening");

        try {
            const historyForAI = [...messages, userMsg].map(m => ({
                role: m.role === 'ai' ? 'assistant' : 'user',
                content: m.text
            }));


            const reply = await request(historyForAI);

            const aiMsg = { id: Date.now() + 1, role: 'ai', text: reply };
            setMessages(prev => [...prev, aiMsg]);

        } catch (error) {
            console.error("Error System:", error);
            setMessages(prev => [...prev, { id: Date.now(), role: 'ai', text: "Maaf, terjadi kesalahan pada sistem." }]);
        } finally {
            setLoading(false);
            setOrbState("idle");
        }
    };

    return (
        <div className="w-full h-screen bg-[#F5F5F7] relative overflow-hidden font-sans flex flex-col selection:bg-blue-100 selection:text-blue-900">
            {/* 1. Render Loading Screen jika belum loaded.
               2. BackgroundScene tetap dirender di balik layar agar proses loading berjalan (Canvas harus mounted).
               3. ChatUI hanya muncul jika is3DLoaded === true.
            */}
            
            <AnimatePresence>
                {!is3DLoaded && <LoadingScreen key="loader" />}
            </AnimatePresence>

            {/* Pass setter setIs3DLoaded ke dalam scene */}
            <BackgroundScene state={orbState} onLoaded={setIs3DLoaded} />
            
            {is3DLoaded && (
                <ChatUI 
                    messages={messages} 
                    loading={loading} 
                    onSendMessage={handleSendMessage}
                    hasStarted={messages.length > 0} 
                />
            )}
        </div>
    )
}