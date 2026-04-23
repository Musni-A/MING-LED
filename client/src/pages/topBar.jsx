import { Link, useLocation } from "react-router-dom";

export default function TopBar( {setSidebarOpen} ){

  const location = useLocation();

  const userName = localStorage.getItem('name')
  const userRole = localStorage.getItem('jobRole')
  const firstLetterOfUserName = userName[0];
  const date = new Date();


    return <>
    {/* Top bar */}
        <div className="bg-white border-b overflow-hidden border-slate-300  px-4 md:px-8 py-2 flex items-center justify-between shrink-0 gap-3">
          <div className="flex items-center gap-3 min-w-0">
            {/* Hamburger */}
            <button
              className="lg:hidden hover:bg-slate-400 rounded flex flex-col gap-1.5 p-2 shrink-0"
              onClick={() => setSidebarOpen(true)}
            >
              <div className="w-5 h-0.5 bg-[#0d2145] rounded" />
              <div className="w-5 h-0.5 bg-[#0d2145] rounded" />
              <div className="w-5 h-0.5 bg-[#0d2145] rounded" />
            </button>
            <div className="min-w-0">
              <h1 className="text-base md:text-xl font-bold text-[#0d2145] truncate">Hello, {userName} 👋</h1>
              <p className="text-xs text-slate-400 mt-0.5 hidden sm:block">{date.toLocaleDateString()}</p>
            </div>
          </div>

          <div className="flex items-center gap-2 md:gap-4 shrink-0">
            {/* Search — hidden on mobile */}
            {/* <div className="hidden md:flex items-center gap-2 bg-slate-100 rounded-xl px-4 py-2">
              <span className="text-slate-400 text-sm">🔍</span>
              <input placeholder="Search..." className="bg-transparent text-sm outline-none text-slate-600 w-32 lg:w-40 placeholder:text-slate-400" />
            </div> */}
            {/* Bell */}
            <div className="relative cursor-pointer">
              <div className="w-9 h-9 rounded-xl bg-slate-100 flex items-center justify-center text-base">🔔</div>
              <div className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-[#e8192c] text-white text-[0.5rem] flex items-center justify-center font-bold">3</div>
            </div>
            {/* Avatar */}
            <Link to={'/profile'}>
              <div className={`${location.pathname == '/profile' ? ' bg-red-600 hover:' : 'bg-slate-200 hover:bg-slate-300'} flex items-center gap-2 cursor-pointer sm:px-3 sm:py-2 rounded-2xl transition-all duration-300`}>
                <div className={`${location.pathname == '/profile' ? ' border-3 border-red-600' : ''} w-9 h-9 rounded-full bg-[#0d2145] flex items-center justify-center text-white font-bold text-sm shrink-0`}>{ firstLetterOfUserName }</div>
                <div className="hidden sm:block">
                  <div className={`${location.pathname == '/profile' ? 'text-white' : 'text-[#0d2145]'} text-xs font-semibold`}>{userName}</div>
                  <div className={`${location.pathname == '/profile' ? 'text-yellow-100' : 'text-slate-400'} text-[0.6rem] text-slate-400`}>{userRole}</div>
                </div>
              </div>
            </Link>
          </div>
        </div>
    </>
}