import { ChevronRight } from "lucide-react"

const QuickAction = ({ icon, label, sub, isEmergency = false }) => {
    return (
        <button className={`w-full flex items-center gap-4 p-4 border transition-all duration-300 group rounded-xl
            ${isEmergency 
                ? 'bg-red-50/50 border-red-100 hover:bg-red-600 hover:border-red-600 hover:shadow-lg hover:shadow-red-200' 
                : 'bg-white border-zinc-100 hover:border-zinc-300 hover:bg-zinc-50'
            }`}>
            
            <div className={`p-3 rounded-xl transition-colors ${
                isEmergency 
                ? 'bg-red-100 text-red-600 group-hover:bg-white/20 group-hover:text-white' 
                : 'bg-zinc-50 text-zinc-500 group-hover:bg-white group-hover:text-zinc-900 shadow-sm'
            }`}>
                {icon}
            </div>
            
            <div className="text-left flex-1">
                <h5 className={`font-semibold text-sm tracking-wide ${
                    isEmergency 
                    ? 'text-red-900 group-hover:text-white' 
                    : 'text-zinc-900'
                }`}>{label}</h5>
                <p className={`text-[10px] mt-0.5 font-medium ${
                    isEmergency 
                    ? 'text-red-400 group-hover:text-red-100' 
                    : 'text-zinc-400'
                }`}>{sub}</p>
            </div>
            
            <ChevronRight size={16} className={`transform transition-transform group-hover:translate-x-1 ${isEmergency ? 'text-red-300 group-hover:text-white' : 'text-zinc-300 group-hover:text-zinc-900'}`}/>
        </button>
    )
}
export default QuickAction