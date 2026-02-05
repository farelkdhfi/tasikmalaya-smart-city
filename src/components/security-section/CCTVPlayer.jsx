import { useEffect, useRef, useState } from "react";
import Hls from 'hls.js';
import { Activity, Signal } from "lucide-react";


const CCTVPlayer = ({ url, location, status = "LIVE" }) => {
    const videoRef = useRef(null);
    const [isError, setIsError] = useState(false);
    const [isPlaying, setIsPlaying] = useState(false);

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
        <div className="relative bg-black aspect-video rounded-xl overflow-hidden group shadow-inner border border-zinc-800">
            {/* Minimal Overlay UI */}
            <div className="absolute top-4 left-4 z-20 flex items-center gap-2">
                <div className={`w-2 h-2 rounded-full ${isError ? 'bg-red-500' : 'bg-emerald-500 animate-pulse'}`}></div>
                <div className="px-2 py-0.5 bg-black/40 backdrop-blur-md rounded border border-white/10 text-[9px] font-bold text-white uppercase tracking-widest">
                    {isError ? "OFFLINE" : status}
                </div>
            </div>

            <div className="absolute top-4 right-4 z-20 opacity-0 group-hover:opacity-100 transition-opacity">
                <div className="px-2 py-0.5 bg-red-600/80 backdrop-blur rounded text-[9px] font-bold text-white uppercase tracking-widest flex items-center gap-1">
                    <div className="w-1.5 h-1.5 bg-white rounded-full animate-pulse"></div> REC
                </div>
            </div>

            {/* Content */}
            {isError ? (
                <div className="absolute inset-0 flex flex-col items-center justify-center text-red-600 bg-zinc-900">
                    <Signal size={32} className="mb-2 opacity-50"/>
                    <span className="text-[10px] uppercase tracking-widest font-mono">Signal Lost</span>
                </div>
            ) : !isPlaying ? (
                <div className="absolute inset-0 flex items-center justify-center bg-zinc-900">
                    <Activity className="text-zinc-700 animate-pulse" />
                </div>
            ) : null}

            <video ref={videoRef} className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity duration-500" muted playsInline autoPlay />

            {/* Footer Location */}
            <div className="absolute bottom-0 left-0 w-full p-4 bg-gradient-to-t from-black/90 to-transparent z-20">
                <h4 className="text-white font-medium text-xs tracking-wide font-mono">{location}</h4>
            </div>
            
            {/* Scanlines Effect */}
            <div className="absolute inset-0 pointer-events-none opacity-10 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] z-10 bg-[length:100%_2px,3px_100%]"></div>
        </div>
    );
};
export default CCTVPlayer;