import { useEffect, useRef, useState } from "react";
import { CAMERA_LIST } from "../../data/cctv";
import PageLayout from "../PageLayout";
import StatCard from "../StatCard";
import { Activity, AlertTriangle, Clock, Signal, LayoutGrid, MapPin, Navigation, Maximize2, MousePointerClick } from "lucide-react";
import Card from "../Card";
import Hls from 'hls.js';
import img_33 from '../../assets/images/img_33.jpg'

const CCTVPlayer = ({ url, location, status = "LIVE", isMain = false, isSelected = false, onClick }) => {
    const videoRef = useRef(null);
    const containerRef = useRef(null);
    const [isError, setIsError] = useState(false);
    const [isPlaying, setIsPlaying] = useState(false);

    const toggleFullScreen = () => {
        if (!containerRef.current) return;
        if (!document.fullscreenElement) {
            containerRef.current.requestFullscreen().catch(err => console.error(err));
        } else {
            document.exitFullscreen();
        }
    };

    useEffect(() => {
        let hls;
        if (Hls.isSupported()) {
            hls = new Hls({ enableWorker: true, lowLatencyMode: true });
            hls.loadSource(url);
            hls.attachMedia(videoRef.current);
            hls.on(Hls.Events.MEDIA_ATTACHED, () => {
                videoRef.current.muted = true;
                videoRef.current.play().catch(() => {});
            });
            hls.on(Hls.Events.ERROR, (event, data) => {
                if (data.fatal) setIsError(true);
            });
            videoRef.current.onplay = () => setIsPlaying(true);
        } else if (videoRef.current.canPlayType('application/vnd.apple.mpegurl')) {
            videoRef.current.src = url;
            videoRef.current.addEventListener('error', () => setIsError(true));
        }
        return () => hls && hls.destroy();
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
                <div className="px-1.5 py-0.5 bg-red-600/80 backdrop-blur rounded text-[8px] font-bold text-white uppercase tracking-widest flex items-center gap-1">
                    <div className="w-1 h-1 bg-white rounded-full animate-pulse"></div> REC
                </div>
            </div>

            {/* Error / Loading State */}
            {isError ? (
                <div className="absolute inset-0 flex flex-col items-center justify-center text-red-600 bg-zinc-900">
                    <Signal size={isMain ? 24 : 16} className="mb-1 opacity-50"/>
                    {isMain && <span className="text-[9px] uppercase tracking-widest font-mono">No Signal</span>}
                </div>
            ) : !isPlaying ? (
                <div className="absolute inset-0 flex items-center justify-center bg-zinc-900">
                    <Activity className={`text-zinc-700 animate-pulse ${isMain ? 'w-6 h-6' : 'w-4 h-4'}`} />
                </div>
            ) : null}

            {/* Video Element */}
            <video ref={videoRef} className="w-full h-full object-cover" muted playsInline autoPlay />

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

const TrafficPage = () => {
    // State Array berisi 2 kamera untuk slot atas
    const [activeSlots, setActiveSlots] = useState([CAMERA_LIST[0], CAMERA_LIST[1]]);
    
    // State untuk mengetahui slot mana yang sedang di-klik user (0 atau 1)
    const [focusedIndex, setFocusedIndex] = useState(0);

    // Fungsi mengganti kamera
    const handleSelectCamera = (newCam) => {
        const newSlots = [...activeSlots];
        newSlots[focusedIndex] = newCam; // Ganti kamera di slot yang sedang fokus
        setActiveSlots(newSlots);
    };

    return (
        <PageLayout title="Traffic Control" subtitle="Dual Monitor" bgImage={img_33} colorTheme="neutral">
            <div className="flex flex-col gap-6">
                
                {/* Stats Row */}
                <div className="grid grid-cols-4 gap-4">
                    <StatCard label="Congestion" value="Med" unit="LEVEL" trend="-2%" icon={AlertTriangle} />
                    <StatCard label="Active View" value="2" unit="CAMS" icon={LayoutGrid} />
                    <StatCard label="Bandwidth" value="8.4" unit="MBPS" icon={Activity} />
                    
                    <div className="bg-neutral-500 p-4 rounded-xl flex items-center justify-between shadow-lg shadow-neutral-500/20 text-white relative overflow-hidden">
                        <div>
                            <div className="text-2xl font-bold">{CAMERA_LIST.length}</div>
                            <div className="text-[9px] font-bold uppercase tracking-widest opacity-80">Total Feeds</div>
                        </div>
                        <Activity size={24} className="opacity-50" />
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* LEFT COLUMN: Camera Feeds */}
                    <div className="lg:col-span-2 space-y-4">
                        
                        {/* 1. DUAL PLAYER UTAMA (GRID 2 KOLOM) */}
                        <div className="grid grid-cols-2 gap-4">
                            {activeSlots.map((cam, index) => (
                                <div key={index} className="relative">
                                     {/* Indikator Nomor Slot */}
                                    <div className={`absolute -top-2 -left-2 w-6 h-6 z-40 rounded-lg flex items-center justify-center text-[10px] font-bold shadow-lg
                                        ${focusedIndex === index ? 'bg-neutral-500 text-black' : 'bg-zinc-800 text-zinc-500 border border-zinc-700'}`}>
                                        0{index + 1}
                                    </div>
                                    
                                    <CCTVPlayer 
                                        key={`${index}-${cam?.id}`} // Force re-render if cam changes
                                        url={`/api/cctv/${cam.filename}`}
                                        location={cam.name}
                                        isMain={true}
                                        isSelected={focusedIndex === index}
                                        onClick={() => setFocusedIndex(index)} // Klik untuk memilih slot ini
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
                                    // Cek apakah kamera ini sudah tampil di atas
                                    const isActive = activeSlots.some(slot => slot.id === cam.id);
                                    
                                    if(isActive) return null; // Jangan tampilkan yang sudah aktif

                                    return (
                                        <div key={cam.id} className="flex-shrink-0" onClick={() => handleSelectCamera(cam)}>
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
                                <div className="flex items-center gap-2 bg-zinc-50 p-2.5 rounded-lg border border-zinc-200">
                                    <MapPin size={14} className="text-neutral-600" />
                                    <input type="text" placeholder="Start Point" className="bg-transparent text-xs w-full outline-none text-zinc-900 font-medium" />
                                </div>
                                <div className="flex items-center gap-2 bg-zinc-50 p-2.5 rounded-lg border border-zinc-200">
                                    <Navigation size={14} className="text-neutral-600" />
                                    <input type="text" placeholder="End Point" className="bg-transparent text-xs w-full outline-none text-zinc-900 font-medium" />
                                </div>
                                <button className="w-full bg-zinc-900 hover:bg-zinc-800 text-white text-[10px] font-bold uppercase tracking-widest py-3 rounded-lg transition-all shadow-lg shadow-zinc-200/50">
                                    Check Traffic
                                </button>
                            </div>
                        </Card>

                        <div className="bg-neutral-50 border border-neutral-100 p-4 rounded-xl">
                            <h4 className="text-neutral-900 font-bold text-[10px] uppercase tracking-widest mb-3 flex items-center gap-2">
                                <AlertTriangle size={12} /> Priority Alerts
                            </h4>
                            <div className="space-y-2">
                                <div className="flex gap-3 items-start bg-white p-2.5 rounded-lg border border-neutral-100 shadow-sm">
                                    <Clock size={12} className="text-neutral-600 mt-0.5 shrink-0" />
                                    <p className="text-zinc-700 text-[10px] leading-relaxed">
                                        <span className="font-bold text-neutral-900 block">Simpang Lima</span>
                                        Heavy traffic due to traffic light malfunction.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </PageLayout>
    )
}
export default TrafficPage