import { ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";

const Navbar = ({ theme }) => (
    <nav className="fixed top-6 left-0 right-0 z-50 px-6 flex justify-center">
        <div className="bg-white/80 backdrop-blur-md border border-white/20 shadow-[0_8px_32px_rgba(0,0,0,0.04)] rounded-full px-6 py-3 flex items-center justify-between w-full max-w-4xl transition-all hover:scale-[1.01] duration-500">
            <Link to="/" className="flex items-center gap-4 text-zinc-500 hover:text-zinc-900 transition-colors group">
                <div className="w-10 h-10 bg-zinc-50 border border-zinc-200 flex items-center justify-center rounded-full group-hover:bg-zinc-900 group-hover:border-zinc-900 group-hover:text-white transition-all duration-300">
                    <ArrowLeft size={18} strokeWidth={1.5} />
                </div>
                <div className="flex flex-col">
                    <span className="text-[10px] font-bold tracking-[0.2em] uppercase text-zinc-400">Return to</span>
                    <span className="text-xs font-semibold tracking-wide uppercase text-zinc-800">Main Dashboard</span>
                </div>
            </Link>
            
            <div className="hidden md:flex items-center gap-3 pl-6 border-l border-zinc-200">
                <div className={`w-2 h-2 rounded-full animate-pulse ${theme.bg.replace('bg-', 'bg-').replace('50', '500')}`}></div>
                <span className="text-[10px] font-mono uppercase tracking-widest text-zinc-400">System Online • v.2.4.0</span>
            </div>
        </div>
    </nav>
);
export default Navbar;