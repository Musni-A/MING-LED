import { useEffect, useState, useCallback, useMemo } from "react";
import { getLightWatts } from "../../api/lightAPI";
import { getLightType } from "../../api/lightTypeAPI";
import { Loader2Icon } from "lucide-react";

export default function DashboardContent() {
    const [wattsData, setWattsData] = useState([]);
    const [typeData, setTypeData] = useState([]);
    const [loading, setLoading] = useState(true); // Default: Month

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
        console.log('API call made at:', new Date().toISOString());
    }, [fetchData]);

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