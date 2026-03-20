export default function PartDetails(){
    return <>
    <div className="bg-white flex flex-row rounded-2xl shadow-2xl">
        <div className="px-6 py-4 flex flex-row justify-between items-center w-full">
            <div className="">
                <h2 className="text-base font-bold">Parts List</h2>
                <p className="text-xs">Total parts</p>
            </div>
            <div className="flex flex-row gap-3">
                <div className="hidden sm:flex items-center gap-2 bg-slate-100 rounded-xl px-3 py-2">
                    <span className="text-slate-400 text-xs">🔍</span>
                    <input
                    placeholder="Search Parts..."
                    className="bg-transparent text-xs outline-none text-slate-600 w-36 placeholder:text-slate-400"
                    />
                </div>
                <button className="bg-[#0d2145] text-white text-xs font-semibold px-4 py-2 rounded-xl hover:opacity-90 transition-opacity">
                    + Add parts
                </button>
            </div>
        </div>
        <div></div>
        <div></div>
        <div></div>
    </div>
    </>
}