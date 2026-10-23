function MetricCard({title , value , description}){
    return(
        <div className="rounded-xl border border-slade-700 bg-slade-900 p-5">
            <p className="text-sm text-slate-400">{title}</p>
            <h2 className="mt-3 text-3xl font-bold text-white">{value}</h2>
            <p className="mt-2 text-sm text-cyan-400">{description}</p>
        </div>
    )
}
export default MetricCard;