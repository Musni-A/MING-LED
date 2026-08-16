import { Link, useLocation } from "react-router-dom";

export default function TopBar( {setSidebarOpen} ){

  const location = useLocation();

  const userName = localStorage.getItem('name')
  const userRole = localStorage.getItem('jobRole')
  const firstLetterOfUserName = userName ? userName.charAt(0).toUpperCase() : '';
  const date = new Date();


    return <>
    {/* Top bar */}
        <div className="bg-white border-b border-slate-200 px-4 md:px-8 py-3 flex items-center justify-between shrink-0 gap-3 shadow-sm">
          <div className="flex items-center gap-3 min-w-0">
            {/* Hamburger */}
            <button
              className="lg:hidden hover:bg-slate-100 rounded-lg flex flex-col gap-1.5 p-2 shrink-0 transition-colors"
              onClick={() => setSidebarOpen(true)}
            >
              <div className="w-5 h-0.5 bg-[#0d2145] rounded" />
              <div className="w-5 h-0.5 bg-[#0d2145] rounded" />
              <div className="w-5 h-0.5 bg-[#0d2145] rounded" />
            </button>
            <div className="min-w-0">
              <h1 className="text-base md:text-xl font-bold text-[#0d2145] truncate">Hello, {userName} 👋</h1>
              <p className="text-xs text-slate-500 mt-0.5 hidden sm:block">{date.toLocaleDateString()}</p>
            </div>
          </div>

          <div className="flex items-center gap-2 md:gap-4 shrink-0">
            {/* Notification Bell */}
            <div className="relative cursor-pointer hover:scale-110 transition-transform">
              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-slate-100 to-slate-50 flex items-center justify-center text-base hover:from-slate-200 hover:to-slate-100 transition-colors shadow-sm">🔔</div>
              <div className="absolute -top-2 -right-2 w-5 h-5 rounded-full bg-gradient-to-br from-[#e8192c] to-[#c0001f] text-white text-[0.65rem] flex items-center justify-center font-bold shadow-md">3</div>
            </div>
            {/* Avatar */}
            <Link to={'/profile'}>
              <div className={`flex items-center gap-2 cursor-pointer px-3 py-2 rounded-xl transition-all duration-200 ${location.pathname == '/profile' ? 'bg-gradient-to-r from-[#e8192c] to-[#c0001f] shadow-lg shadow-red-500/20' : 'hover:bg-slate-100'}`}>
                <div className={`w-9 h-9 rounded-full flex items-center justify-center text-white font-bold text-sm shrink-0 ${location.pathname == '/profile' ? 'bg-white/20' : 'bg-[#0d2145]'}`}>{ firstLetterOfUserName }</div>
                <div className="hidden sm:block">
                  <div className={`text-xs font-semibold ${location.pathname == '/profile' ? 'text-white' : 'text-[#0d2145]'}`}>{userName}</div>
                  <div className={`text-[0.65rem] ${location.pathname == '/profile' ? 'text-yellow-100' : 'text-slate-500'}`}>{userRole}</div>
                </div>
              </div>
            </Link>
          </div>
        </div>
    </>
}