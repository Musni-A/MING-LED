import { useEffect, useState, useCallback, useMemo } from "react";
import { getLightWatts } from "../../api/lightAPI";
import { getLightType } from "../../api/lightTypeAPI";
import { Loader2Icon } from "lucide-react";

// ✅ MEMOIZED: Constants outside component
const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
const TIME_FILTERS = ["Week", "Month", "Year"];
const CHART_DATA = [65, 80, 45, 90, 70, 55, 85, 75, 60, 95, 50, 88];
const STOCK_STATUS = [
    { label: "In Stock", pct: "60%", color: "bg-[#0d2145]" },
    { label: "Low Stock", pct: "25%", color: "bg-[#e8192c]" },
    { label: "Out of Stock", pct: "15%", color: "bg-[#f5c800]" },
];
const RECENT_ACTIVITIES = [
    { name: "Riffath", action: "Added 50x LED Strip 5050", time: "2m ago", avatar: "R", color: "bg-[#e8192c]" },
    { name: "Azeem", action: "Updated inventory report", time: "18m ago", avatar: "A", color: "bg-[#0d2145]" },
    { name: "Akkif", action: "Submitted production order #38", time: "1h ago", avatar: "A", color: "bg-[#f5c800]" },
    { name: "Isnas", action: "Completed Q1 stock audit", time: "3h ago", avatar: "I", color: "bg-[#7b9fd4]" },
    { name: "Musni", action: "Deployed dashboard v2.0", time: "5h ago", avatar: "M", color: "bg-[#e8192c]" },
];
const PROGRESS_STATS = [
    { label: "Tasks Done", value: "84%", sub: "42 of 50", color: "#e8192c", bg: "#fff0f0" },
    { label: "Storage", value: "61%", sub: "6.1 GB / 10 GB", color: "#0d2145", bg: "#f0f4ff" },
    { label: "Performance", value: "97%", sub: "Excellent this month", color: "#d4a000", bg: "#fffbf0" },
];

export default function DashboardContent() {
    const [wattsData, setWattsData] = useState([]);
    const [typeData, setTypeData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedTimeFilter, setSelectedTimeFilter] = useState(1); // Default: Month

    // ✅ MEMOIZED: Process data once
    const processedData = useMemo(() => {
        if (!typeData.length || !wattsData.length) return { typeStats: [], allWattStats: null };
        
        // Calculate stats per type
        const typeStats = typeData
            .filter(type => type.typeName !== "Panel Common Parts")
            .map(type => {
                const typeWatts = wattsData.filter(watt => watt.typeName === type.typeName);
                const wattCount = typeWatts.length;
                
                // Calculate total parts and lowest quantity per watt
                const wattsWithStats = typeWatts.map(watt => ({
                    ...watt,
                    lowestQuantity: watt.parts?.length ? Math.min(...watt.parts.map(p => p.quantity)) : 0,
                    totalParts: watt.parts?.reduce((sum, p) => sum + (p.quantity || 0), 0) || 0
                }));
                
                const totalParts = wattsWithStats.reduce((sum, w) => sum + w.totalParts, 0);
                
                return {
                    ...type,
                    typeWatts: wattsWithStats,
                    wattCount,
                    totalParts
                };
            });
        
        // Calculate overall stats for mobile view
        const allWattStats = wattsData.map(watt => ({
            ...watt,
            lowestQuantity: watt.parts?.length ? Math.min(...watt.parts.map(p => p.quantity)) : 0
        }));
        
        return { typeStats, allWattStats };
    }, [typeData, wattsData]);

    // ✅ OPTIMIZED: Fetch data
    const fetchData = useCallback(async () => {
        setLoading(true);
        try {
            const [wattsResponse, typeResponse] = await Promise.all([
                getLightWatts(),
                getLightType()
            ]);
            
            // Handle paginated responses
            const watts = wattsResponse.data?.data || wattsResponse.data || [];
            const types = typeResponse.data?.data || typeResponse.data || [];
            
            setWattsData(watts);
            setTypeData(types);
        } catch (err) {
            console.error("Failed to fetch dashboard data:", err);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    // ✅ MEMOIZED: Chart data based on filter
    const chartBars = useMemo(() => {
        // Could filter/modify CHART_DATA based on selectedTimeFilter
        return CHART_DATA;
    }, [selectedTimeFilter]);

    if (loading) {
        return (
            <div className="flex-1 flex items-center justify-center" style={{ background: "#e0edfa" }}>
                <Loader2Icon className="animate-spin text-blue-500" size={48} />
            </div>
        );
    }

    const { typeStats, allWattStats } = processedData;

    return (
        <div className="flex-1 sm:px-6 px-2 py-4 sm:py-3" style={{ background: "#e0edfa" }}>
            
            {/* KPI Cards - Desktop */}
            <div className="hidden sm:grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5 mb-6">
                {typeStats.map((type) => (
                    <DashboardCard key={type._id} type={type} />
                ))}
            </div>

            {/* Mobile Wattages View */}
            <div className="sm:hidden mb-7 border-t-8 border-blue-500 relative bg-gradient-to-br from-white to-gray-50/80 rounded-2xl p-5 shadow-2xl transition-all duration-300 overflow-hidden">
                <div className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">
                    Available Wattages
                </div>
                
                <div className="grid grid-cols-3 gap-4">
                    {allWattStats?.map((watt) => (
                        <MobileWattItem key={watt._id} watt={watt} />
                    ))}
                </div>
            </div>

            {/* Middle Row - Charts */}
            <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5 mb-4 sm:mb-6">
                {/* Bar Chart */}
                <BarChart 
                    chartData={chartBars} 
                    selectedFilter={selectedTimeFilter}
                    onFilterChange={setSelectedTimeFilter}
                />
                
                {/* Donut Chart */}
                <DonutChart stockStatus={STOCK_STATUS} />
            </div>

            {/* Bottom Row */}
            <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5 sm:pb-6">
                {/* Recent Activity */}
                <RecentActivity activities={RECENT_ACTIVITIES} />
                
                {/* Progress Stats */}
                <ProgressStats stats={PROGRESS_STATS} />
            </div>
        </div>
    );
}

// ============================================
// ✅ EXTRACTED COMPONENTS (Better performance)
// ============================================

// Dashboard Card Component
const DashboardCard = ({ type }) => {
    const { typeName, typeWatts, wattCount, totalParts } = type;
    
    return (
        <div className="group border-b-8 border-blue-500 relative bg-linear-to-br from-white to-gray-50/80 rounded-2xl p-5 shadow-2xl hover:shadow-2xl hover:border-blue-400/30 transition-all duration-300 overflow-hidden">
            {/* Animated Background */}
            <div className="absolute inset-0 bg-linear-to-r from-blue-500/0 via-blue-500/0 to-purple-500/0 group-hover:from-blue-500/5 group-hover:via-blue-500/3 group-hover:to-purple-500/5 transition-all duration-700" />
            <div className="absolute top-0 left-0 right-0 h-1 bg-linear-to-r from-blue-500 via-blue-400 to-purple-400 transform origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-500" />
            
            {/* Header */}
            <div className="relative flex items-start justify-between mb-4">
                <div className="flex-1">
                    <h3 className="font-bold text-sm sm:text-base text-gray-800 group-hover:text-blue-600 transition-colors duration-300 pr-2">
                        {typeName}
                    </h3>
                    <div className="flex items-center gap-2 mt-1">
                        <div className="flex items-center gap-1">
                            <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
                            <span className="text-xs text-gray-500 font-medium">
                                {wattCount} variant{wattCount !== 1 ? 's' : ''}
                            </span>
                        </div>
                    </div>
                </div>
                
                <div className="w-10 h-10 rounded-xl bg-linear-to-br from-blue-500 to-blue-600 sm:flex hidden items-center justify-center shadow-md shadow-blue-500/20">
                    <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                </div>
            </div>

            {/* Wattages */}
            <div className="relative">
                {wattCount > 0 ? (
                    <>
                        <div className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">
                            Available Wattages
                        </div>
                        <div className="grid grid-cols-2 gap-2">
                            {typeWatts.map((watt) => (
                                <WattageItem key={watt._id} watt={watt} />
                            ))}
                        </div>
                    </>
                ) : (
                    <EmptyWattageState />
                )}
            </div>

            {/* Footer */}
            {wattCount > 0 && (
                <div className="relative mt-4 pt-3 border-t border-gray-200/60">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-1.5">
                            <svg className="w-3.5 h-3.5 text-blue-500" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M4 5a2 2 0 012-2 3 3 0 003 3h2a3 3 0 003-3 2 2 0 012 2v11a2 2 0 01-2 2H6a2 2 0 01-2-2V5zm3 4a1 1 0 000 2h.01a1 1 0 100-2H7zm3 0a1 1 0 000 2h3a1 1 0 100-2h-3zm-3 4a1 1 0 100 2h.01a1 1 0 100-2H7zm3 0a1 1 0 100 2h3a1 1 0 100-2h-3z" clipRule="evenodd" />
                            </svg>
                            <span className="text-xs text-gray-500">Total: {totalParts} parts</span>
                        </div>
                        <button className="text-xs font-medium text-blue-600 hover:text-blue-700 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                            View All →
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

// Wattage Item Component
const WattageItem = ({ watt }) => {
    const lowestQuantity = watt.lowestQuantity;
    
    return (
        <div className="group/watt relative">
            <div className="px-1 py-1 bg-linear-to-r from-blue-50 to-indigo-50 rounded-lg border border-blue-200/50 hover:border-blue-400 hover:shadow-md transition-all duration-300">
                <div className="flex items-center gap-1.5">
                    <div className="w-1.5 h-1.5 rounded-full bg-blue-500 group-hover/watt:bg-blue-600 transition-colors" />
                    <p className="text-[10px] truncate sm:text-xs font-semibold text-gray-700 group-hover/watt:text-blue-600 transition-colors">
                        {watt.watts} :- {lowestQuantity}
                    </p>
                </div>
            </div>
            
            {/* Tooltip */}
            <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-3 py-1.5 bg-gray-900 text-white text-xs rounded-lg opacity-0 group-hover/watt:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-10">
                {lowestQuantity} Possible to produce
                <div className="absolute top-full left-1/2 -translate-x-1/2 -mt-0.5 border-4 border-transparent border-t-gray-900" />
            </div>
        </div>
    );
};

// Empty Wattage State
const EmptyWattageState = () => (
    <div className="text-center py-6">
        <div className="w-12 h-12 mx-auto mb-2 rounded-full bg-gray-100 flex items-center justify-center">
            <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
        </div>
        <p className="text-sm text-gray-400 font-medium">No wattages yet</p>
    </div>
);

// Mobile Watt Item
const MobileWattItem = ({ watt }) => {
    const lowestQuantity = watt.lowestQuantity;
    const isLow = lowestQuantity < 100;
    
    return (
        <div className="flex items-center gap-2 py-1 bg-blue-200 rounded-lg hover:bg-blue-50 transition-colors group/item">
            <div className="w-1.5 h-1.5 rounded-full ml-1 bg-blue-500 group-hover/item:bg-blue-600 transition-colors" />
            <div className="text-sm font-medium">
                <span className="text-gray-700">{watt.watts}</span>
                <span className="text-gray-400 mx-1">•</span>
                <span className={`font-semibold ${isLow ? 'text-red-500' : 'text-green-600'}`}>
                    {lowestQuantity}
                </span>
            </div>
        </div>
    );
};

// Bar Chart Component
const BarChart = ({ chartData, selectedFilter, onFilterChange }) => (
    <div className="lg:col-span-2 bg-white rounded-xl sm:rounded-2xl p-4 sm:p-6"
        style={{ border: "1px solid #e8f0fe", boxShadow: "0 4px 16px rgba(13,33,69,0.06)" }}>
        
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-4 sm:mb-5">
            <div>
                <div className="text-[#0d2145] font-black text-sm sm:text-base">Parts Usage Overview</div>
                <div className="text-slate-400 text-xs mt-0.5">Monthly consumption trend</div>
            </div>
            
            <div className="flex gap-1 sm:gap-2 overflow-x-auto pb-1 sm:pb-0">
                {TIME_FILTERS.map((filter, i) => (
                    <button
                        key={filter}
                        onClick={() => onFilterChange(i)}
                        className="text-xs px-3 py-1.5 rounded-lg font-semibold transition-all whitespace-nowrap"
                        style={selectedFilter === i
                            ? { background: "linear-gradient(135deg,#0d2145,#1a3a6e)", color: "#fff" }
                            : { background: "#f0f4f8", color: "#94a3b8" }}
                    >
                        {filter}
                    </button>
                ))}
            </div>
        </div>

        <div className="flex items-end gap-1 sm:gap-2 lg:gap-3 h-24 sm:h-28 lg:h-32">
            {chartData.map((height, i) => (
                <div
                    key={i}
                    className="flex-1 rounded-t-md sm:rounded-t-lg transition-all duration-300 hover:opacity-80"
                    style={{
                        height: `${height}%`,
                        background: i === 9
                            ? "linear-gradient(180deg,#e8192c,#b0001a)"
                            : i % 3 === 0
                                ? "linear-gradient(180deg,#0d2145,#1a3a6e)"
                                : "#e8f0fe",
                        boxShadow: i === 9 ? "0 4px 12px rgba(232,25,44,0.3)" : ""
                    }}
                />
            ))}
        </div>
        
        <div className="flex justify-between mt-2">
            {MONTHS.map((month, i) => (
                <div
                    key={month}
                    className={`text-[0.5rem] sm:text-[0.55rem] text-slate-400 flex-1 text-center ${i % 2 === 0 ? 'hidden sm:block' : ''} sm:block`}
                >
                    {month}
                </div>
            ))}
        </div>
    </div>
);

// Donut Chart Component
const DonutChart = ({ stockStatus }) => (
    <div className="bg-white rounded-xl sm:rounded-2xl p-4 sm:p-6"
        style={{ border: "1px solid #e8f0fe", boxShadow: "0 4px 16px rgba(13,33,69,0.06)" }}>
        <div className="text-[#0d2145] font-black text-sm sm:text-base mb-1">Stock Status</div>
        <div className="text-slate-400 text-xs mb-4 sm:mb-5">Current inventory health</div>

        <div className="flex justify-center mb-4 sm:mb-5">
            <div className="relative w-24 h-24 sm:w-28 sm:h-28">
                <svg viewBox="0 0 36 36" className="w-full h-full -rotate-90">
                    <circle cx="18" cy="18" r="15.9" fill="none" stroke="#f0f4f8" strokeWidth="3" />
                    <circle cx="18" cy="18" r="15.9" fill="none" stroke="#0d2145" strokeWidth="3" strokeDasharray="60 40" />
                    <circle cx="18" cy="18" r="15.9" fill="none" stroke="#e8192c" strokeWidth="3" strokeDasharray="25 75" strokeDashoffset="-60" />
                    <circle cx="18" cy="18" r="15.9" fill="none" stroke="#f5c800" strokeWidth="3" strokeDasharray="15 85" strokeDashoffset="-85" />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <div className="text-lg sm:text-xl font-black text-[#0d2145]">4.8k</div>
                    <div className="text-[0.5rem] sm:text-[0.55rem] text-slate-400">Total</div>
                </div>
            </div>
        </div>

        <div className="space-y-2 sm:space-y-2.5">
            {stockStatus.map((s) => (
                <div key={s.label} className="flex items-center gap-2">
                    <div className={`w-2 sm:w-2.5 h-2 sm:h-2.5 rounded-full shrink-0 ${s.color}`} />
                    <div className="text-xs sm:text-xs text-slate-500 flex-1">{s.label}</div>
                    <div className="text-xs font-bold text-[#0d2145]">{s.pct}</div>
                </div>
            ))}
        </div>
    </div>
);

// Recent Activity Component
const RecentActivity = ({ activities }) => (
    <div className="lg:col-span-2 bg-white rounded-xl sm:rounded-2xl p-4 sm:p-6"
        style={{ border: "1px solid #e8f0fe", boxShadow: "0 4px 16px rgba(13,33,69,0.06)" }}>
        <div className="flex items-center justify-between mb-3 sm:mb-4">
            <div className="text-[#0d2145] font-black text-sm sm:text-base">Recent Activity</div>
            <span className="text-xs text-[#e8192c] font-semibold cursor-pointer hover:underline">View all →</span>
        </div>
        
        <div className="space-y-2 sm:space-y-3">
            {activities.map((activity, i) => (
                <div
                    key={i}
                    className="flex items-center gap-2 sm:gap-3 py-2 sm:py-2.5 border-b border-slate-50 last:border-0"
                >
                    <div className={`w-7 h-7 sm:w-8 sm:h-8 rounded-lg sm:rounded-xl ${activity.color} text-white text-xs font-black flex items-center justify-center shrink-0`}>
                        {activity.avatar}
                    </div>
                    <div className="flex-1 min-w-0">
                        <div className="text-xs text-[#0d2145] truncate">
                            <span className="font-bold">{activity.name}</span>{" "}
                            <span className="hidden sm:inline">{activity.action}</span>
                            <span className="sm:hidden">{activity.action.substring(0, 15)}...</span>
                        </div>
                    </div>
                    <div className="text-[0.6rem] sm:text-[0.65rem] text-slate-400 whitespace-nowrap">{activity.time}</div>
                </div>
            ))}
        </div>
    </div>
);

// Progress Stats Component
const ProgressStats = ({ stats }) => (
    <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-1 gap-3 sm:gap-4">
        {stats.map((stat) => (
            <div
                key={stat.label}
                className="bg-white rounded-xl sm:rounded-2xl p-4 sm:p-5"
                style={{ border: "1px solid #e8f0fe", boxShadow: "0 4px 16px rgba(13,33,69,0.06)" }}
            >
                <div className="flex items-center justify-between mb-2">
                    <div className="text-xs text-slate-400 font-semibold uppercase tracking-wide">{stat.label}</div>
                    <div className="text-base sm:text-lg font-black" style={{ color: stat.color }}>{stat.value}</div>
                </div>
                <div className="w-full rounded-full h-2 mb-2" style={{ background: stat.bg }}>
                    <div
                        className="h-2 rounded-full transition-all duration-500"
                        style={{ width: stat.value, background: stat.color }}
                    />
                </div>
                <div className="text-xs text-slate-400 truncate">{stat.sub}</div>
            </div>
        ))}
    </div>
);