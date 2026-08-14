import { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  Repeat2Icon,
  BookCheck,
  Settings,
  UserCheck,
  PackageCheckIcon,
  User,
  LogOut,
  ChevronRight,
  X,
  Bell,
  HelpCircle,
  LayoutDashboard,
  CalendarCheck,
  Wifi,
  TrendingUp
} from "lucide-react";

export default function NavBar({ sidebarOpen, setSidebarOpen }) {
  const location = useLocation();
  const navigate = useNavigate();

  const userDepartment = localStorage.getItem("userDepartment");
  const jobRole = localStorage.getItem("jobRole");
  const userName = localStorage.getItem("name") || "User";

  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const [deviceStatus, setDeviceStatus] = useState(null);

  // Close sidebar when clicking outside on mobile
  useEffect(() => {
    if (sidebarOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }
    return () => {
      document.body.style.overflow = "auto";
    };
  }, [sidebarOpen]);


  const handleLogout = () => {
    localStorage.removeItem("loggedIn");
    localStorage.removeItem("userDepartment");
    localStorage.removeItem("jobRole");
    localStorage.removeItem("name");
    localStorage.removeItem("userName");
    navigate("/");
  };

  const navItems = [
    // Dashboard - Unified View
    
    // Stock Management - Finishing Goods
    {
      icon: <PackageCheckIcon size={20} />,
      label: "Finishing Goods",
      path: "/finishedGoods",
      showFor: ["Admin", "Manager", "Finishing Goods Store keeper", "HR", "Assist-Accountant"],
      badge: null,
    },
    // Stock Management - Parts Inventory
    {
      icon: <Repeat2Icon size={20} />,
      label: "Parts Inventory",
      path: "/inventory",
      showFor: ["Admin", "Componant Parts Store keeper", "Assist-Accountant"],
      badge: null,
    },
    // Stock Reports
    {
      icon: <TrendingUp size={20} />,
      label: "Reports",
      path: "/reports",
      showFor: ["Admin", "Manager", "Assist-Accountant"],
      badge: null,
    },
    // Employee Management
    {
      icon: <User size={20} />,
      label: "Employee",
      path: "/employee",
      showFor: ["Admin", "HR", "Assist-Accountant"],
      badge: null,
    },
    // Device Sync (Admin only)
    {
      icon: <Wifi size={20} />,
      label: "Device Sync",
      path: "/settings",
      showFor: ["Admin", "Manager"],
      badge: deviceStatus?.connected ? "Online" : "Offline",
    },
  ];

  const filteredItems = navItems.filter((item) =>
    item.showFor.includes(jobRole)
  );

  // Get role badge color
  const getRoleBadgeColor = () => {
    switch (jobRole) {
      case "Admin":
        return "bg-red-500/20 text-red-300 border-red-500/30";
      case "Manager":
        return "bg-blue-500/20 text-blue-300 border-blue-500/30";
      case "HR":
        return "bg-purple-500/20 text-purple-300 border-purple-500/30";
      case "Finishing Goods Store keeper":
        return "bg-amber-500/20 text-amber-300 border-amber-500/30";
      case "Componant Parts Store keeper":
        return "bg-emerald-500/20 text-emerald-300 border-emerald-500/30";
      case "Assist-Accountant":
        return "bg-cyan-500/20 text-cyan-300 border-cyan-500/30";
      default:
        return "bg-slate-500/20 text-slate-300 border-slate-500/30";
    }
  };

  return (
    <>
      {/* Mobile Backdrop */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-20 lg:hidden transition-opacity duration-300"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`
          fixed lg:static h-screen inset-y-0 left-0 z-30
          w-64 bg-gradient-to-b from-blue-900 via-blue-950 to-slate-900
          flex flex-col shrink-0
          transform transition-all duration-300 ease-in-out
          shadow-2xl border-r border-white/5
          ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}
          lg:translate-x-0
        `}
      >
        {/* Decorative gradient blob */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-20 left-0 w-32 h-32 bg-red-500/10 rounded-full blur-3xl pointer-events-none" />

        {/* Mobile Close Button */}
        <button
          onClick={() => setSidebarOpen(false)}
          className="lg:hidden absolute top-4 right-4 p-2 rounded-lg text-slate-300 hover:bg-white/10 hover:text-white transition-colors z-10"
          aria-label="Close sidebar"
        >
          <X size={20} />
        </button>

        {/* Logo */}
        <div className="px-5 pt-8 pb-6 relative">
          <Link to="/" className="flex items-center gap-3 group">
            <div className="flex items-end gap-0.5 transition-transform group-hover:scale-110 duration-300">
              <div className="w-2.5 h-8 rounded-full bg-[#e8192c] shadow-lg shadow-red-500/50" />
              <div className="w-2.5 h-6 rounded-full bg-[#f5c800] shadow-lg shadow-yellow-500/50" />
              <div className="w-2.5 h-8 rounded-full bg-[#0011af] shadow-lg shadow-blue-500/50" />
            </div>
            <div>
              <div className="text-white font-extrabold text-lg tracking-[0.15em] leading-none">
                MING
              </div>
              <div className="text-[#7b9fd4] text-[0.55rem] tracking-[0.25em] mt-1 font-semibold">
                LED SYSTEMS
              </div>
            </div>
          </Link>
        </div>

        {/* User Profile Card */}
        <div className="mx-4 mb-6 px-3 py-1 rounded-xl bg-white/5 border border-white/10 backdrop-blur-sm relative">
          <div className="flex items-center gap-3">
            <div className="relative">
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#e8192c] to-[#c0001f] flex items-center justify-center text-white font-bold text-sm shadow-lg">
                {userName.charAt(0).toUpperCase()}
              </div>
              <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-500 rounded-full border border-blue-950" />
            </div>
            <div className="flex flex-row justify-between w-60">
              <div className="text-white font-semibold text-sm truncate">
                {userName}
              </div>
              <div
                className={`inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-semibold border ${getRoleBadgeColor()} mt-0.5`}
              >
                {userDepartment || "Guest"}
              </div>
            </div>
          </div>
        </div>

        {/* Section Label */}
        <div className="px-5 mb-2">
          <span className="text-[10px] font-bold tracking-[0.2em] text-slate-400 uppercase">
            Main Menu
          </span>
        </div>

        {/* Nav Items */}
        <nav className="flex flex-col gap-1 flex-1 px-3 overflow-y-auto custom-scrollbar">
          {filteredItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <Link key={item.label} to={item.path}>
                <div
                  className={`
                    relative flex items-center gap-3 px-4 py-3 rounded-xl cursor-pointer
                    transition-all duration-200 group overflow-hidden
                    ${
                      isActive
                        ? "bg-gradient-to-r from-[#e8192c] to-[#c0001f] text-white font-semibold shadow-lg shadow-red-500/30"
                        : "text-slate-200 hover:bg-white/10 hover:text-white hover:translate-x-1"
                    }
                  `}
                  onClick={() => setSidebarOpen(false)}
                >
                  {/* Active indicator bar */}
                  {isActive && (
                    <span className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 bg-white rounded-r-full" />
                  )}

                  <span
                    className={`transition-all duration-200 ${
                      isActive
                        ? "text-white"
                        : "text-slate-300 group-hover:text-white group-hover:scale-110"
                    }`}
                  >
                    {item.icon}
                  </span>
                  <span className="text-sm font-medium flex-1">
                    {item.label}
                  </span>

                  {item.badge && (
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                      item.badge === "Online" 
                        ? "bg-green-500 text-green-950"
                        : item.badge === "Offline"
                        ? "bg-red-500 text-red-950"
                        : "bg-yellow-500 text-yellow-950"
                    }`}>
                      {item.badge}
                    </span>
                  )}

                  {isActive && (
                    <ChevronRight
                      size={16}
                      className="animate-pulse"
                    />
                  )}
                </div>
              </Link>
            );
          })}

          {filteredItems.length === 0 && (
            <div className="text-center text-slate-400 text-xs py-4 px-4">
              No menu items available for your role
            </div>
          )}
        </nav>

        {/* Quick Actions */}
        <div className="px-3 py-2 border-t border-white/10">
          <div className="flex items-center justify-around gap-1">
            <button
              className="flex-1 flex items-center justify-center p-2.5 rounded-lg text-slate-300 hover:bg-white/10 hover:text-white transition-all duration-200 group"
              title="Notifications"
            >
              <Bell
                size={18}
                className="group-hover:scale-110 transition-transform"
              />
            </button>
            <Link to="/settings" className="flex-1">
              <button
                className="w-full flex items-center justify-center p-2.5 rounded-lg text-slate-300 hover:bg-white/10 hover:text-white transition-all duration-200 group"
                title="Settings"
              >
                <Settings
                  size={18}
                  className="group-hover:rotate-90 transition-transform duration-300"
                />
              </button>
            </Link>
            <button
              className="flex-1 flex items-center justify-center p-2.5 rounded-lg text-slate-300 hover:bg-white/10 hover:text-white transition-all duration-200 group"
              title="Help"
            >
              <HelpCircle
                size={18}
                className="group-hover:scale-110 transition-transform"
              />
            </button>
          </div>
        </div>

        {/* Logout */}
        <div className="px-3 pb-6 pt-2 border-t border-white/10">
          <button
            onClick={() => setShowLogoutConfirm(true)}
            className="w-full flex items-center gap-3 px-4 md:mb-0 mb-14 py-3 rounded-xl cursor-pointer text-slate-300 hover:text-white hover:bg-red-500/20 hover:border-red-500/30 border border-transparent transition-all duration-200 group"
          >
            <LogOut
              size={20}
              className="group-hover:translate-x-1 transition-transform"
            />
            <span className="text-sm font-medium">Logout</span>
          </button>
        </div>
      </aside>

      {/* Logout Confirmation Modal */}
      {showLogoutConfirm && (
        <div
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fadeIn"
          onClick={() => setShowLogoutConfirm(false)}
        >
          <div
            className="bg-white rounded-2xl shadow-2xl max-w-sm w-full p-6 animate-scaleIn"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-center w-14 h-14 mx-auto mb-4 rounded-full bg-red-100">
              <LogOut className="text-red-600" size={24} />
            </div>
            <h3 className="text-lg font-bold text-center text-gray-900 mb-2">
              Confirm Logout
            </h3>
            <p className="text-sm text-center text-gray-600 mb-6">
              Are you sure you want to log out? You'll need to sign in again to
              access your account.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setShowLogoutConfirm(false)}
                className="flex-1 px-4 py-2.5 rounded-lg border border-gray-300 text-gray-700 font-medium hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleLogout}
                className="flex-1 px-4 py-2.5 rounded-lg bg-gradient-to-r from-red-600 to-red-700 text-white font-medium hover:from-red-700 hover:to-red-800 transition-all shadow-lg shadow-red-500/30"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Custom Styles */}
      <style>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(255, 255, 255, 0.1);
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: rgba(255, 255, 255, 0.2);
        }
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes scaleIn {
          from { opacity: 0; transform: scale(0.9); }
          to { opacity: 1; transform: scale(1); }
        }
        .animate-fadeIn {
          animation: fadeIn 0.2s ease-out;
        }
        .animate-scaleIn {
          animation: scaleIn 0.25s ease-out;
        }
      `}</style>
    </>
  );
}