// import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Repeat2Icon, BookCheck, LayoutDashboard, Settings, UserCheck, User, LogOut } from 'lucide-react';

export default function NavBar({sidebarOpen, setSidebarOpen}){

  const location = useLocation();

  const userDepartment = localStorage.getItem('userDepartment')
  const userRole = localStorage.getItem('userRole')


    return<>
    {/* Sidebar */}
      <div className={`
        fixed lg:static h-screen inset-y-0 left-0 z-30
        w-64 bg-linear-to-r from-blue-900 to-blue-950 flex flex-col py-8 sm:pb-8 pb-12 px-5 shrink-0
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
        <nav className="flex flex-col gap-1 flex-1">
          {[
            // Everyone can see Dashboard
            { 
              icon: <LayoutDashboard />, 
              label: "Dashboard", 
              path: '/dashboard',
              showFor: ['Admin', 'Manager', 'Assembler', 'Inventory', 'HR', 'Assist-Accountant']
            },
            
            // Only Admin and Inventory can see Parts Inventory
            { 
              icon: <Repeat2Icon />, 
              label: "Parts Inventory", 
              path: '/inventory',
              showFor: ['Admin', 'Inventory', 'Assist-Accountant']  // Assembler NOT included
            },
            
            // Admin and Manager can see Production Reports
            { 
              icon: <BookCheck />, 
              label: "Production Reports", 
              path: '/reports',
              showFor: ['Admin', 'Manager', 'Assist-Accountant']
            },
            
            // Everyone except Inventory can see Attendance
            { 
              icon: <UserCheck />, 
              label: "Attendance", 
              path: '/Attendence',
              showFor: ['Admin', 'Manager', 'Assembler', 'HR']
            },
            
            // Only Admin and HR can see Employee management
            { 
              icon: <User />, 
              label: "Employee", 
              path: '/employee',
              showFor: ['Admin', 'HR', 'Assist-Accountant']  // Assembler NOT included
            },
            
            // Everyone can see Settings
            { 
              icon: <Settings />, 
              label: "Settings", 
              path: '/settings',
              showFor: ['Admin', 'Manager', 'Assembler', 'Inventory', 'HR']
            }
          ]
          .filter(item => item.showFor.includes(userDepartment))
          .map(item => (
            <Link key={item.label} to={item.path}>
              <div
                className={`flex items-center gap-3 px-4 py-3 rounded-xl cursor-pointer transition-all ${
                  location.pathname === item.path
                    ? "font-bold text-base cursor-pointer border-none bg-linear-to-r from-[#e8192c] to-[#c0001f] shadow-[0_8px_24px_rgba(232,25,44,0.3)] hover:opacity-90 transition-opacity"
                    : "text-[#fff200] hover:bg-white/5 hover:text-white"
                }`}
                onClick={() => setSidebarOpen(false)}
              >
                <span className="text-base">{item.icon}</span>
                <span className="text-sm text-white font-medium">{item.label}</span>
                {location.pathname === item.path && <div className="ml-auto w-1.5 h-1.5 rounded-full bg-white" />}
              </div>
            </Link>
          ))}
        </nav>

        {/* Logout */}
        <Link to='/'>
          <div onClick={()=>localStorage.removeItem('loggedIn')} className="flex items-center gap-3 px-4 py-3 rounded-xl cursor-pointer text-[#7b9fd4] hover:text-white hover:bg-white/5">
            <span><LogOut /></span>
            <span className="text-sm font-medium">Logout</span>
          </div>
        </Link>
      </div>
    </>;
}