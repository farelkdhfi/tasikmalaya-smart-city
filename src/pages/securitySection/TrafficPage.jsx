import { useEffect, useRef, useState, useMemo } from "react";
// Pastikan import data ini ada, atau gunakan dummy data di bawah jika belum tersedia
import { CAMERA_LIST } from "../../data/cctv"; 
import PageLayout from "../../components/PageLayout";
import StatCard from "../../components/StatCard";
import { Activity, AlertTriangle, Clock, Signal, LayoutGrid, MapPin, Navigation, Maximize2, MousePointerClick, CheckCircle, XCircle } from "lucide-react";
import Card from "../../components/Card";
import Hls from 'hls.js';

// --- SUB-COMPONENT: CCTV PLAYER ---
const CCTVPlayer = ({ url, location, status = "LIVE", isMain = false, isSelected = false, onClick }) => {
    const videoRef = useRef(null);
    const containerRef = useRef(null);
    const [isError, setIsError] = useState(false);
    const [isPlaying, setIsPlaying] = useState(false);
    const [isRecording, setIsRecording] = useState(false); // State untuk tombol REC

    const toggleFullScreen = () => {
        if (!containerRef.current) return;
        if (!document.fullscreenElement) {
            containerRef.current.requestFullscreen().catch(err => console.error(err));
        } else {
            document.exitFullscreen();
        }
    };

    // Simulasi tombol REC
    const toggleRecording = (e) => {
        e.stopPropagation();
        setIsRecording(!isRecording);
    };

    useEffect(() => {
        setIsPlaying(false);
        setIsError(false);
        let hls;

        // Reset video element
        if (videoRef.current) {
            videoRef.current.pause();
            videoRef.current.removeAttribute('src');
            videoRef.current.load();
        }

        const initPlayer = () => {
            if (Hls.isSupported()) {
                hls = new Hls({ enableWorker: true, lowLatencyMode: true });
                hls.loadSource(url);
                hls.attachMedia(videoRef.current);
                hls.on(Hls.Events.MEDIA_ATTACHED, () => {
                    videoRef.current.muted = true;
                    videoRef.current.play().catch(() => {});
                });
                hls.on(Hls.Events.ERROR, (event, data) => {
                    if (data.fatal) {
                        // Simulasi: Jika error fatal, tunggu sebentar lalu set error state
                        // agar UI menampilkan "No Signal"
                        setIsError(true);
                    }
                });
                videoRef.current.onplay = () => setIsPlaying(true);
            } else if (videoRef.current.canPlayType('application/vnd.apple.mpegurl')) {
                videoRef.current.src = url;
                videoRef.current.addEventListener('error', () => setIsError(true));
                videoRef.current.onplay = () => setIsPlaying(true);
            }
        };

        // Simulasi network delay sedikit agar terasa seperti loading real
        const timer = setTimeout(() => {
            try {
                initPlayer();
            } catch (e) {
                setIsError(true);
            }
        }, 800);

        return () => {
            clearTimeout(timer);
            if (hls) hls.destroy();
        };
    }, [url]);

    return (
        <div 
            ref={containerRef}
            onClick={onClick}
            className={`relative bg-black rounded-xl overflow-hidden group border transition-all duration-300
                ${isMain 
                    ? `aspect-video w-full shadow-2xl ${isSelected ? 'border-neutral-500 ring-2 ring-neutral-500/50 z-10' : 'border-zinc-800 opacity-90 hover:opacity-100'}` 
                    : 'aspect-video w-40 opacity-50 hover:opacity-100 hover:scale-105 cursor-pointer border-zinc-800'
                }`}
        >
            {/* Header Overlay */}
            <div className="absolute top-3 left-3 z-20 flex items-center gap-2">
                <div className={`w-1.5 h-1.5 rounded-full ${isError ? 'bg-red-500' : 'bg-emerald-500 animate-pulse'}`}></div>
                {isMain && (
                    <div className="px-1.5 py-0.5 bg-black/40 backdrop-blur-md rounded border border-white/10 text-[8px] font-bold text-white uppercase tracking-widest">
                        {isError ? "OFF" : status}
                    </div>
                )}
            </div>

            {/* Controls (Fullscreen & REC) */}
            <div className="absolute top-3 right-3 z-30 opacity-0 group-hover:opacity-100 transition-opacity flex gap-2">
                {isMain && (
                    <button 
                        onClick={(e) => { e.stopPropagation(); toggleFullScreen(); }}
                        className="p-1 bg-black/60 hover:bg-neutral-600 backdrop-blur rounded text-white transition-colors"
                        title="Fullscreen"
                    >
                        <Maximize2 size={12} />
                    </button>
                )}
                {/* Tombol REC sekarang interaktif */}
                <button 
                    onClick={toggleRecording}
                    className={`px-1.5 py-0.5 backdrop-blur rounded text-[8px] font-bold text-white uppercase tracking-widest flex items-center gap-1 transition-colors
                    ${isRecording ? 'bg-red-600/90' : 'bg-zinc-700/80 hover:bg-zinc-600'}`}
                >
                    {isRecording ? (
                        <><div className="w-1 h-1 bg-white rounded-full animate-pulse"></div> REC</>
                    ) : (
                        <span className="opacity-80">REC</span>
                    )}
                </button>
            </div>

            {/* Error / Loading State */}
            {isError ? (
                <div className="absolute inset-0 flex flex-col items-center justify-center text-red-600 bg-zinc-900 z-10">
                    <Signal size={isMain ? 24 : 16} className="mb-1 opacity-50"/>
                    {isMain && <span className="text-[9px] uppercase tracking-widest font-mono">No Signal</span>}
                </div>
            ) : !isPlaying ? (
                <div className="absolute inset-0 flex items-center justify-center bg-zinc-900 z-10">
                    <Activity className={`text-zinc-700 animate-pulse ${isMain ? 'w-6 h-6' : 'w-4 h-4'}`} />
                </div>
            ) : null}

            {/* Video Element */}
            <video ref={videoRef} className="w-full h-full object-cover transform scale-105" muted playsInline />

            {/* Footer Location */}
            <div className="absolute bottom-0 left-0 w-full p-3 bg-gradient-to-t from-black/90 to-transparent z-20">
                <h4 className={`text-white font-medium ${isMain ? 'text-xl' : 'text-[9px]'}`}>{location}</h4>
                {isMain && isSelected && (
                    <div className="text-[9px] text-neutral-400 font-bold uppercase tracking-widest mt-0.5 flex items-center gap-1">
                        <MousePointerClick size={10} /> Selected Slot
                    </div>
                )}
            </div>
            
            {/* Scanlines Effect */}
            <div className="absolute inset-0 pointer-events-none opacity-10 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] z-10 bg-[length:100%_2px,3px_100%]"></div>
        </div>
    );
};

// --- MAIN PAGE COMPONENT ---
const TrafficPage = () => {
    // 1. STATE MANAGEMENT
    const [activeSlots, setActiveSlots] = useState([CAMERA_LIST[0], CAMERA_LIST[1]]);
    const [focusedIndex, setFocusedIndex] = useState(0);
    
    // Stats Simulation State
    const [bandwidth, setBandwidth] = useState(8.4);
    const [congestionLevel, setCongestionLevel] = useState("MED");
    const [activeCamCount, setActiveCamCount] = useState(2);

    // Route Logic State
    const [routeInput, setRouteInput] = useState({ start: "", end: "" });
    const [routeStatus, setRouteStatus] = useState("IDLE"); // IDLE, LOADING, SUCCESS, ERROR
    const [routeResult, setRouteResult] = useState("");

    // Alerts State (Simulasi live feed)
    const [alerts, setAlerts] = useState([
        { id: 1, location: "Simpang Lima", desc: "Heavy traffic due to traffic light malfunction.", time: "Now" }
    ]);

    // 2. LOGIC & EFFECTS
    
    // Fungsi Swap Kamera
    const handleSelectCamera = (newCam) => {
        // Jangan lakukan apa-apa jika kamera sudah ada di salah satu slot
        if (activeSlots.some(slot => slot.id === newCam.id)) return;

        const newSlots = [...activeSlots];
        newSlots[focusedIndex] = newCam; 
        setActiveSlots(newSlots);
        
        // Pindahkan fokus ke slot berikutnya secara otomatis untuk UX yang lebih cepat
        // (Optional, tapi bagus untuk flow)
        // setFocusedIndex((prev) => (prev + 1) % 2); 
    };

    // Simulasi Data Real-time (Bandwidth & Congestion)
    useEffect(() => {
        const interval = setInterval(() => {
            // Random bandwidth fluctuation
            setBandwidth(prev => {
                const noise = (Math.random() - 0.5) * 1.5;
                return Math.max(2.1, Math.min(15.0, (prev + noise))).toFixed(1);
            });

            // Random active cam count fluctuation (simulasi koneksi putus nyambung)
            if (Math.random() > 0.8) {
                setActiveCamCount(prev => Math.random() > 0.5 ? CAMERA_LIST.length : CAMERA_LIST.length - 1);
            }
        }, 2000);

        return () => clearInterval(interval);
    }, []);

    // Simulasi Incoming Alert setiap 15 detik
    useEffect(() => {
        const possibleAlerts = [
            { location: "Jalan Merdeka", desc: "Vehicle breakdown on left lane." },
            { location: "Pintu Tol 1", desc: "Queue extending 2km." },
            { location: "Flyover", desc: "Clear traffic condition." },
            { location: "Pasar Baru", desc: "Pedestrian spillover, caution advised." }
        ];

        const alertInterval = setInterval(() => {
            const randomAlert = possibleAlerts[Math.floor(Math.random() * possibleAlerts.length)];
            const newAlert = {
                id: Date.now(),
                location: randomAlert.location,
                desc: randomAlert.desc,
                time: "Just now"
            };
            
            setAlerts(prev => [newAlert, ...prev].slice(0, 3)); // Keep max 3 alerts
        }, 15000);

        return () => clearInterval(alertInterval);
    }, []);

    // Logic Quick Route
    const handleCheckTraffic = () => {
        if (!routeInput.start || !routeInput.end) {
            setRouteStatus("ERROR");
            setTimeout(() => setRouteStatus("IDLE"), 2000);
            return;
        }

        setRouteStatus("LOADING");
        
        // Simulasi API call 2 detik
        setTimeout(() => {
            const randomTime = Math.floor(Math.random() * (45 - 15) + 15);
            setRouteResult(`${randomTime} MIN • FASTEST`);
            setRouteStatus("SUCCESS");

            // Reset ke IDLE setelah 5 detik agar bisa search lagi
            setTimeout(() => {
                setRouteStatus("IDLE");
                setRouteInput({ start: "", end: "" });
            }, 5000);
        }, 1500);
    };

    return (
        <PageLayout title="Traffic Control" subtitle="Dual Monitor" colorTheme="neutral">
            <div className="flex flex-col gap-4 md:gap-6">
                
                {/* Stats Row - Responsive Grid: 2 kolom di mobile, 4 di desktop */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
                    <StatCard 
                        label="Congestion" 
                        value={congestionLevel} 
                        unit="LEVEL" 
                        trend={congestionLevel === "HIGH" ? "+12%" : "-2%"} 
                        icon={AlertTriangle} 
                        color={congestionLevel === "HIGH" ? "red" : "emerald"}
                    />
                    <StatCard 
                        label="Active View" 
                        value={activeCamCount} 
                        unit="CAMS" 
                        icon={LayoutGrid} 
                    />
                    <StatCard 
                        label="Bandwidth" 
                        value={bandwidth} 
                        unit="MBPS" 
                        icon={Activity}
                        trend={bandwidth > 10 ? "+High" : "Normal"}
                    />
                    
                    <div className="bg-neutral-500 p-4 rounded-xl flex items-center justify-between shadow-lg shadow-neutral-500/20 text-white relative overflow-hidden">
                        <div>
                            <div className="text-2xl font-bold">{CAMERA_LIST.length}</div>
                            <div className="text-[9px] font-bold uppercase tracking-widest opacity-80">Total Feeds</div>
                        </div>
                        <Activity size={24} className="opacity-50" />
                    </div>
                </div>

                {/* Main Content Grid - Stacking di mobile */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-6">
                    {/* LEFT COLUMN: Camera Feeds */}
                    <div className="lg:col-span-2 space-y-4">
                        
                        {/* 1. DUAL PLAYER UTAMA - Stacking di mobile, 2 kolom di tablet/desktop */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {activeSlots.map((cam, index) => (
                                <div key={index} className="relative transition-all duration-300">
                                     {/* Indikator Nomor Slot */}
                                    <div className={`absolute -top-2 -left-2 w-6 h-6 z-40 rounded-lg flex items-center justify-center text-[10px] font-bold shadow-lg transition-colors duration-300
                                        ${focusedIndex === index ? 'bg-neutral-500 text-black' : 'bg-zinc-800 text-zinc-500 border border-zinc-700'}`}>
                                        0{index + 1}
                                    </div>
                                    
                                    <CCTVPlayer 
                                        key={`${index}-${cam?.id}`} // Key ensures full re-render on switch
                                        url={`/api/cctv/${cam?.filename || 'static'}`} // Fallback handling
                                        location={cam?.name || "No Camera"}
                                        isMain={true}
                                        isSelected={focusedIndex === index}
                                        onClick={() => setFocusedIndex(index)}
                                    />
                                </div>
                            ))}
                        </div>

                        {/* 2. LIST KAMERA LAINNYA (HORIZONTAL SCROLL) */}
                        <div className="bg-zinc-900/80 border border-zinc-800 rounded-xl p-4 backdrop-blur-sm">
                            <div className="flex justify-between items-center mb-3">
                                <h4 className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest flex items-center gap-2">
                                    <LayoutGrid size={12}/> Available Feeds
                                </h4>
                                <span className="text-[9px] text-neutral-500 italic">
                                    Click below to swap Screen 0{focusedIndex + 1}
                                </span>
                            </div>
                            
                            <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
                                {CAMERA_LIST.map((cam) => {
                                    // Visual feedback jika kamera sedang aktif
                                    const isActive = activeSlots.some(slot => slot.id === cam.id);
                                    
                                    return (
                                        <div 
                                            key={cam.id} 
                                            className={`flex-shrink-0 transition-all duration-300 ${isActive ? 'opacity-30 grayscale pointer-events-none' : ''}`} 
                                            onClick={() => !isActive && handleSelectCamera(cam)}
                                        >
                                            <CCTVPlayer 
                                                url={`/api/cctv/${cam.filename}`}
                                                location={cam.name}
                                                isMain={false} 
                                            />
                                        </div>
                                    )
                                })}
                            </div>
                        </div>
                    </div>

                    {/* Right Column: Route & Alerts */}
                    <div className="space-y-4">
                        <Card title="Quick Route" className="bg-white/90 backdrop-blur">
                            <div className="space-y-3">
                                <div className="flex items-center gap-2 bg-zinc-50 p-2.5 rounded-lg border border-zinc-200 focus-within:ring-1 focus-within:ring-neutral-400 transition-all">
                                    <MapPin size={14} className="text-neutral-600" />
                                    <input 
                                        type="text" 
                                        value={routeInput.start}
                                        onChange={(e) => setRouteInput({...routeInput, start: e.target.value})}
                                        placeholder="Start Point" 
                                        className="bg-transparent text-xs w-full outline-none text-zinc-900 font-medium placeholder:text-zinc-400" 
                                    />
                                </div>
                                <div className="flex items-center gap-2 bg-zinc-50 p-2.5 rounded-lg border border-zinc-200 focus-within:ring-1 focus-within:ring-neutral-400 transition-all">
                                    <Navigation size={14} className="text-neutral-600" />
                                    <input 
                                        type="text" 
                                        value={routeInput.end}
                                        onChange={(e) => setRouteInput({...routeInput, end: e.target.value})}
                                        placeholder="End Point" 
                                        className="bg-transparent text-xs w-full outline-none text-zinc-900 font-medium placeholder:text-zinc-400" 
                                    />
                                </div>
                                
                                {/* Interactive Button with States */}
                                <button 
                                    onClick={handleCheckTraffic}
                                    disabled={routeStatus === "LOADING" || routeStatus === "SUCCESS"}
                                    className={`w-full text-[10px] font-bold uppercase tracking-widest py-3 rounded-lg transition-all shadow-lg 
                                        ${routeStatus === "LOADING" ? "bg-zinc-700 cursor-wait text-zinc-400" : 
                                          routeStatus === "SUCCESS" ? "bg-emerald-600 text-white shadow-emerald-200" :
                                          routeStatus === "ERROR" ? "bg-red-600 text-white" :
                                          "bg-zinc-900 hover:bg-zinc-800 text-white shadow-zinc-200/50"}`}
                                >
                                    {routeStatus === "LOADING" ? (
                                        <span className="flex items-center justify-center gap-2 animate-pulse">Calculating...</span>
                                    ) : routeStatus === "SUCCESS" ? (
                                        <span className="flex items-center justify-center gap-2"><CheckCircle size={12}/> {routeResult}</span>
                                    ) : routeStatus === "ERROR" ? (
                                        <span className="flex items-center justify-center gap-2"><XCircle size={12}/> Fill All Fields</span>
                                    ) : (
                                        "Check Traffic"
                                    )}
                                </button>
                            </div>
                        </Card>

                        <div className="bg-neutral-50 border border-neutral-100 p-4 rounded-xl">
                            <h4 className="text-neutral-900 font-bold text-[10px] uppercase tracking-widest mb-3 flex items-center gap-2">
                                <AlertTriangle size={12} className="text-red-500" /> Priority Alerts
                            </h4>
                            <div className="space-y-2 max-h-[200px] overflow-y-auto scrollbar-hide">
                                {alerts.map((alert) => (
                                    <div key={alert.id} className="flex gap-3 items-start bg-white p-2.5 rounded-lg border border-neutral-100 shadow-sm animate-in fade-in slide-in-from-right-2 duration-500">
                                        <Clock size={12} className="text-neutral-600 mt-0.5 shrink-0" />
                                        <div className="flex-1">
                                            <p className="text-zinc-700 text-[10px] leading-relaxed">
                                                <span className="font-bold text-neutral-900 block">{alert.location}</span>
                                                {alert.desc}
                                            </p>
                                            <span className="text-[8px] text-zinc-400 mt-1 block">{alert.time}</span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </PageLayout>
    )
}
export default TrafficPage