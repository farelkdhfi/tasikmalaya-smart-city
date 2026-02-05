const StatCard = ({ label, value, unit, trend, icon: Icon }) => (
    <div className="bg-white border border-zinc-100 p-6 rounded-2xl group hover:border-zinc-300 transition-all duration-300">
        <div className="flex justify-between items-start mb-4">
            <div className="p-2 bg-zinc-50 rounded-lg text-zinc-400 group-hover:text-zinc-900 group-hover:bg-zinc-100 transition-colors">
                {Icon ? <Icon size={18} strokeWidth={1.5} /> : <Activity size={18} strokeWidth={1.5}/>}
            </div>
            {trend && <span className="text-[10px] font-medium text-emerald-600 bg-emerald-50 px-2 py-1 rounded-full border border-emerald-100">{trend}</span>}
        </div>
        <div>
            <h4 className="text-zinc-400 text-[10px] font-bold uppercase tracking-widest mb-1">{label}</h4>
            <div className="flex items-baseline gap-1">
                <span className="text-3xl font-light text-zinc-900 tracking-tight">{value}</span>
                <span className="text-[10px] font-bold text-zinc-400 uppercase">{unit}</span>
            </div>
        </div>
    </div>
)
export default StatCard