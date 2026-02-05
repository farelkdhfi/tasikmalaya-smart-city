import { motion } from "framer-motion";

import Navbar from "./Navbar";

import NoiseBackground from "./NoiseBackground";
import { Activity, Clock } from "lucide-react";

const PageLayout = ({ title, subtitle, bgImage, colorTheme = "zinc", children }) => {
    // Elegant color mapping
    const themes = {
        rose:   { text: 'text-rose-900', accent: 'text-rose-500', bg: 'bg-rose-50', border: 'border-rose-100', gradient: 'from-rose-100/50' },
        blue:   { text: 'text-slate-900', accent: 'text-sky-600', bg: 'bg-sky-50', border: 'border-sky-100', gradient: 'from-sky-100/50' },
        amber:  { text: 'text-amber-950', accent: 'text-amber-600', bg: 'bg-amber-50', border: 'border-amber-100', gradient: 'from-amber-100/50' },
        orange: { text: 'text-orange-950', accent: 'text-orange-600', bg: 'bg-orange-50', border: 'border-orange-100', gradient: 'from-orange-100/50' },
        red:    { text: 'text-red-950', accent: 'text-red-600', bg: 'bg-red-50', border: 'border-red-100', gradient: 'from-red-100/50' },
        zinc:   { text: 'text-zinc-900', accent: 'text-zinc-600', bg: 'bg-zinc-50', border: 'border-zinc-200', gradient: 'from-zinc-100/50' },
    }

    const theme = themes[colorTheme] || themes.zinc

    return (
        <div className="min-h-screen bg-[#FDFDFD] text-zinc-900 font-sans selection:bg-black selection:text-white overflow-x-hidden">
            <NoiseBackground />
            <Navbar theme={theme} />

            {/* Elegant Header with Parallax Feel */}
            <div className="relative pt-40 pb-20 px-6 container mx-auto max-w-6xl z-10">
                <motion.div 
                    initial={{ opacity: 0, y: 40 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
                    className="relative"
                >
                   <div className="flex items-center gap-4 mb-6">
                        <span className={`px-3 py-1 rounded-full text-[10px] font-bold tracking-[0.2em] uppercase border ${theme.border} ${theme.bg} ${theme.accent}`}>
                            {subtitle}
                        </span>
                        <div className="h-[1px] flex-1 bg-gradient-to-r from-zinc-200 to-transparent"></div>
                   </div>
                   
                   <h1 className="text-6xl md:text-8xl font-light tracking-tighter text-zinc-900 mb-6 leading-[0.9]">
                       {title.split(' ').map((word, i) => (
                           <span key={i} className="block">{word}</span>
                       ))}
                   </h1>

                   <div className="flex flex-wrap gap-x-8 gap-y-2 text-[10px] font-mono text-zinc-400 uppercase tracking-widest mt-8">
                        <div className="flex items-center gap-2">
                            <Activity size={12} /> <span>Monitoring Active</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <Clock size={12} /> <span>{new Date().toLocaleTimeString()} WIB</span>
                        </div>
                   </div>
                </motion.div>
                
                {/* Background Decor */}
                <div className={`absolute top-0 right-0 w-[500px] h-[500px] bg-gradient-to-b ${theme.gradient} to-transparent rounded-full blur-[120px] -z-10 opacity-60`}></div>
            </div>

            {/* Main Content */}
            <main className="w-full px-16 relative z-10 pb-20">
                <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2, duration: 0.8 }}
                >
                    {children}
                </motion.div>
            </main>
        </div>
    )
}
export default PageLayout