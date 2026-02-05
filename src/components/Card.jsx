const Card = ({ title, action, children, className = "", noPadding = false }) => (
    <div className={`bg-white border border-zinc-100 rounded-2xl shadow-[0_4px_20px_-10px_rgba(0,0,0,0.05)] overflow-hidden transition-all duration-300 hover:shadow-[0_10px_30px_-15px_rgba(0,0,0,0.1)] hover:border-zinc-200 ${className}`}>
        {(title || action) && (
            <div className="flex justify-between items-center px-6 py-5 border-b border-zinc-50">
                {title && <h3 className="text-zinc-900 text-[11px] font-bold uppercase tracking-[0.2em]">{title}</h3>}
                {action}
            </div>
        )}
        <div className={noPadding ? '' : 'p-6'}>
            {children}
        </div>
    </div>
)
export default Card