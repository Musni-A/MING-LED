export default function DashboardContent() {
  return (
    <div className="flex-1 sm:px-6 py-4 sm:py-3" style={{background: "#f0f4f8"}}>

      {/* KPI Cards - Responsive Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 lg:gap-5 mb-4 sm:mb-6">
        {[
          { label: "Total Parts", value: "4,821", sub: "+124 this week", icon: "💡", grad: "linear-gradient(135deg,#0d2145,#1a3a6e)", glow: "rgba(13,33,69,0.3)" },
          { label: "Revenue", value: "$92,400", sub: "+18% vs last mo", icon: "💰", grad: "linear-gradient(135deg,#e8192c,#b0001a)", glow: "rgba(232,25,44,0.3)" },
          { label: "Active Orders", value: "38", sub: "12 pending", icon: "📦", grad: "linear-gradient(135deg,#d4a000,#a07800)", glow: "rgba(212,160,0,0.3)" },
          { label: "Employees", value: "24", sub: "3 on leave", icon: "👥", grad: "linear-gradient(135deg,#5b84b1,#3a6091)", glow: "rgba(91,132,177,0.3)" },
        ].map(s => (
          <div key={s.label} 
            className="rounded-xl sm:rounded-2xl p-4 sm:p-5 text-white relative overflow-hidden transform transition-all duration-300 hover:scale-[1.02]"
            style={{background: s.grad, boxShadow: `0 8px 24px ${s.glow}`}}>
            <div className="absolute -right-4 -top-4 w-16 sm:w-20 h-16 sm:h-20 rounded-full"
              style={{background: "rgba(255,255,255,0.07)"}} />
            <div className="text-xl sm:text-2xl mb-2 sm:mb-3">{s.icon}</div>
            <div className="text-xl sm:text-2xl font-black leading-none mb-1">{s.value}</div>
            <div className="text-xs opacity-70 font-medium">{s.label}</div>
            <div className="text-[0.6rem] sm:text-[0.65rem] opacity-50 mt-1">{s.sub}</div>
          </div>
        ))}
      </div>

      {/* Middle row - Responsive */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-5 mb-4 sm:mb-6">

        {/* Bar Chart - Full width on mobile, 2 cols on desktop */}
        <div className="lg:col-span-2 bg-white rounded-xl sm:rounded-2xl p-4 sm:p-6"
          style={{border: "1px solid #e8f0fe", boxShadow: "0 4px 16px rgba(13,33,69,0.06)"}}>
          
          {/* Chart Header - Stack on mobile */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-4 sm:mb-5">
            <div>
              <div className="text-[#0d2145] font-black text-sm sm:text-base">Parts Usage Overview</div>
              <div className="text-slate-400 text-xs mt-0.5">Monthly consumption trend</div>
            </div>
            
            {/* Time filters - Scrollable on mobile */}
            <div className="flex gap-1 sm:gap-2 overflow-x-auto pb-1 sm:pb-0">
              {["Week", "Month", "Year"].map((t, i) => (
                <button key={t} 
                  className="text-xs px-3 py-1.5 rounded-lg font-semibold transition-all whitespace-nowrap"
                  style={i === 1
                    ? {background: "linear-gradient(135deg,#0d2145,#1a3a6e)", color: "#fff"}
                    : {background: "#f0f4f8", color: "#94a3b8"}}>
                  {t}
                </button>
              ))}
            </div>
          </div>

          {/* Bars - Responsive height */}
          <div className="flex items-end gap-1 sm:gap-2 lg:gap-3 h-24 sm:h-28 lg:h-32">
            {[65, 80, 45, 90, 70, 55, 85, 75, 60, 95, 50, 88].map((h, i) => (
              <div key={i} 
                className="flex-1 rounded-t-md sm:rounded-t-lg transition-all duration-300 hover:opacity-80"
                style={{
                  height: `${h}%`,
                  background: i === 9
                    ? "linear-gradient(180deg,#e8192c,#b0001a)"
                    : i % 3 === 0
                      ? "linear-gradient(180deg,#0d2145,#1a3a6e)"
                      : "#e8f0fe",
                  boxShadow: i === 9 ? "0 4px 12px rgba(232,25,44,0.3)" : ""
                }} />
            ))}
          </div>
          
          {/* Month labels - Hide some on mobile */}
          <div className="flex justify-between mt-2">
            {["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"].map((m, i) => (
              <div key={m} 
                className={`text-[0.5rem] sm:text-[0.55rem] text-slate-400 flex-1 text-center ${
                  i % 2 === 0 ? 'hidden sm:block' : ''
                } sm:block`}>
                {m}
              </div>
            ))}
          </div>
        </div>

        {/* Donut Chart - Full width on mobile */}
        <div className="bg-white rounded-xl sm:rounded-2xl p-4 sm:p-6"
          style={{border: "1px solid #e8f0fe", boxShadow: "0 4px 16px rgba(13,33,69,0.06)"}}>
          <div className="text-[#0d2145] font-black text-sm sm:text-base mb-1">Stock Status</div>
          <div className="text-slate-400 text-xs mb-4 sm:mb-5">Current inventory health</div>

          <div className="flex justify-center mb-4 sm:mb-5">
            <div className="relative w-24 h-24 sm:w-28 sm:h-28">
              <svg viewBox="0 0 36 36" className="w-full h-full -rotate-90">
                <circle cx="18" cy="18" r="15.9" fill="none" stroke="#f0f4f8" strokeWidth="3" />
                <circle cx="18" cy="18" r="15.9" fill="none" stroke="#0d2145" strokeWidth="3"
                  strokeDasharray="60 40" />
                <circle cx="18" cy="18" r="15.9" fill="none" stroke="#e8192c" strokeWidth="3"
                  strokeDasharray="25 75" strokeDashoffset="-60" />
                <circle cx="18" cy="18" r="15.9" fill="none" stroke="#f5c800" strokeWidth="3"
                  strokeDasharray="15 85" strokeDashoffset="-85" />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <div className="text-lg sm:text-xl font-black text-[#0d2145]">4.8k</div>
                <div className="text-[0.5rem] sm:text-[0.55rem] text-slate-400">Total</div>
              </div>
            </div>
          </div>

          <div className="space-y-2 sm:space-y-2.5">
            {[
              { label: "In Stock", pct: "60%", color: "bg-[#0d2145]" },
              { label: "Low Stock", pct: "25%", color: "bg-[#e8192c]" },
              { label: "Out of Stock", pct: "15%", color: "bg-[#f5c800]" },
            ].map(s => (
              <div key={s.label} className="flex items-center gap-2">
                <div className={`w-2 sm:w-2.5 h-2 sm:h-2.5 rounded-full shrink-0 ${s.color}`} />
                <div className="text-xs sm:text-xs text-slate-500 flex-1">{s.label}</div>
                <div className="text-xs font-bold text-[#0d2145]">{s.pct}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom row - Responsive */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-5 pb-4 sm:pb-6">

        {/* Recent Activity - Full width on mobile */}
        <div className="lg:col-span-2 bg-white rounded-xl sm:rounded-2xl p-4 sm:p-6"
          style={{border: "1px solid #e8f0fe", boxShadow: "0 4px 16px rgba(13,33,69,0.06)"}}>
          <div className="flex items-center justify-between mb-3 sm:mb-4">
            <div className="text-[#0d2145] font-black text-sm sm:text-base">Recent Activity</div>
            <span className="text-xs text-[#e8192c] font-semibold cursor-pointer hover:underline">View all →</span>
          </div>
          
          <div className="space-y-2 sm:space-y-3">
            {[
              { name: "Riffath", action: "Added 50x LED Strip 5050", time: "2m ago", avatar: "R", color: "bg-[#e8192c]" },
              { name: "Azeem", action: "Updated inventory report", time: "18m ago", avatar: "A", color: "bg-[#0d2145]" },
              { name: "Akkif", action: "Submitted production order #38", time: "1h ago", avatar: "A", color: "bg-[#f5c800]" },
              { name: "Isnas", action: "Completed Q1 stock audit", time: "3h ago", avatar: "I", color: "bg-[#7b9fd4]" },
              { name: "Musni", action: "Deployed dashboard v2.0", time: "5h ago", avatar: "M", color: "bg-[#e8192c]" },
            ].map((a, i) => (
              <div key={i} 
                className="flex items-center gap-2 sm:gap-3 py-2 sm:py-2.5 border-b border-slate-50 last:border-0">
                <div className={`w-7 h-7 sm:w-8 sm:h-8 rounded-lg sm:rounded-xl ${a.color} text-white text-xs font-black flex items-center justify-center shrink-0`}>
                  {a.avatar}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-xs text-[#0d2145] truncate">
                    <span className="font-bold">{a.name}</span>{" "}
                    <span className="hidden sm:inline">{a.action}</span>
                    <span className="sm:hidden">{a.action.substring(0, 15)}...</span>
                  </div>
                </div>
                <div className="text-[0.6rem] sm:text-[0.65rem] text-slate-400 whitespace-nowrap">{a.time}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Progress stats - Grid on mobile, stacked on desktop */}
        <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-1 gap-3 sm:gap-4">
          {[
            { label: "Tasks Done", value: "84%", sub: "42 of 50", color: "#e8192c", bg: "#fff0f0" },
            { label: "Storage", value: "61%", sub: "6.1 GB / 10 GB", color: "#0d2145", bg: "#f0f4ff" },
            { label: "Performance", value: "97%", sub: "Excellent this month", color: "#d4a000", bg: "#fffbf0" },
          ].map(p => (
            <div key={p.label} 
              className="bg-white rounded-xl sm:rounded-2xl p-4 sm:p-5"
              style={{border: "1px solid #e8f0fe", boxShadow: "0 4px 16px rgba(13,33,69,0.06)"}}>
              <div className="flex items-center justify-between mb-2">
                <div className="text-xs text-slate-400 font-semibold uppercase tracking-wide">{p.label}</div>
                <div className="text-base sm:text-lg font-black" style={{color: p.color}}>{p.value}</div>
              </div>
              <div className="w-full rounded-full h-2 mb-2" style={{background: p.bg}}>
                <div className="h-2 rounded-full transition-all duration-500" 
                  style={{width: p.value, background: p.color}} />
              </div>
              <div className="text-xs text-slate-400 truncate">{p.sub}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}