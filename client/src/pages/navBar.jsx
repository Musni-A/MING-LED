// import { useState } from "react";
import { Link, useLocation } from "react-router-dom";


export default function NavBar({sidebarOpen, setSidebarOpen}){

  const location = useLocation();

    return<>
    {/* Sidebar */}
      <div className={`
        fixed lg:static inset-y-0 left-0 z-30
        w-64 bg-[#00215e] flex flex-col py-8 px-5 shrink-0
        transform transition-transform duration-300
        ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}
        lg:translate-x-0
      `}>
        {/* Logo */}
        <div className="flex items-center gap-3 mb-10">
          <div className="flex items-end gap-1">
            <div className="w-2 h-8 rounded-full bg-[#e8192c]" />
            <div className="w-2 h-6 rounded-full bg-[#f5c800]" />
            <div className="w-2 h-8 rounded-full bg-[#0011af]" />
          </div>
          <div>
            <div className="text-white font-extrabold text-lg tracking-[0.2em] leading-none">MING</div>
            <div className="text-[#7b9fd4] text-[0.5rem] tracking-[0.3em] mt-0.5">WORTH SPENDING</div>
          </div>
        </div>

        {/* Nav Items */}
        <nav  className="flex flex-col gap-1 flex-1">
          {[
            { icon: "📈",  label: "Dashboard", path : '/dashboard'},
            { icon: "📦", label: "Parts Inventory", path : '/inventory' },
            { icon: "📊", label: "Production Reports", path : '/reports' },
            { icon: "👤✔️", label: "Attendence", path : '/attendence' },
            { icon: "👤", label: "Employee", path : '/employee' },
            { icon: "⚙️", label: "Settings", path : '/settings' }
          ].map(item => (
            <Link key={item.label} to={item.path}>
              <div
                className={`flex items-center gap-3 px-4 py-3 rounded-xl cursor-pointer transition-all ${
                  location.pathname === item.path
                    ? "bg-[#e8192c] text-white"
                    : "text-[#7b9fd4] hover:bg-white/5 hover:text-white"
                }`}
                onClick={() => {
                  setSidebarOpen(false);
                }}
                
              >
                <span className="text-base">{item.icon}</span>
                <span className="text-sm text-blue-200 font-medium">{item.label}</span>
                {location.pathname === item.path && <div className="ml-auto w-1.5 h-1.5 rounded-full bg-white" />}
              </div>
            </Link>
          ))}
        </nav>

        {/* Logout */}
        <Link to='/'>
          <div onClick={()=>localStorage.removeItem('loggedIn')} className="flex items-center gap-3 px-4 py-3 rounded-xl cursor-pointer text-[#7b9fd4] hover:text-white hover:bg-white/5">
            <span>🚪</span>
            <span className="text-sm font-medium">Logout</span>
          </div>
        </Link>
      </div>
    </>;
}