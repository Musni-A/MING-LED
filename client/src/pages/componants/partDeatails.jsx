import { useEffect, useState } from "react"
import { getAllLedParts } from "../../api/partsAPI"


export default function PartDetails({setShow}){

    const [parts, setParts] = useState([]);
    const [loading, setLoading] = useState(true)

    useEffect(()=>{
        getAllLedParts()
        .then((res)=>setParts(res.data))
        .catch((err)=>{console.log(err)})
        .finally(()=>setLoading(false))
    },[])

    const [currentPage, setCurrentPage] = useState(1)
      const itemsPerPage = 6
    
      const totalPages = Math.ceil(parts.length / itemsPerPage)
    
      const currentItems = parts.slice(
            (currentPage - 1) * itemsPerPage,
            currentPage * itemsPerPage
        )

    return <>
    <div className="">
        {/* Main Card */}
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
        
        {/* Header Section */}
        <div className="px-4 sm:px-6 py-4 sm:py-5 border-b border-gray-200">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            
            {/* Title Section */}
            <div>
                <h2 className="text-lg sm:text-xl font-bold text-gray-900">
                LED Parts Inventory
                </h2>
                <p className="text-sm text-gray-500 mt-0.5">
                Total parts: 24 items
                </p>
            </div>

            {/* Action Buttons & Search */}
            <div className="flex gap-2 sm:gap-3 justify-end">
                
                {/* Search Bar - Desktop */}
                <div className="hidden sm:flex items-center gap-2 bg-gray-100 rounded-xl px-3 py-2 min-w-50">
                <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                <input 
                    type="text"
                    placeholder="Search parts..." 
                    className="bg-transparent text-sm outline-none text-gray-700 w-full placeholder:text-gray-400"
                />
                </div>

                {/* <div className="flex gap-2"> */}

                    <button className="border-2 border-red-800 bg-red-800/20 text-red-800 text-sm font-semibold px-4 py-2 rounded-xl transition-all duration-300 hover:bg-red-800 hover:text-white shadow-md flex items-center justify-center gap-2">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                    </svg>
                        Issue to Production (-)
                    </button>

                    {/* Add Parts Button */}
                    <button onClick={()=>setShow(true)} className="border-2 border-blue-800 bg-blue-800/20 text-blue-800 text-sm font-semibold px-4 py-2 rounded-xl transition-all duration-300 hover:bg-blue-800 hover:text-white shadow-md flex items-center justify-center gap-2">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                    </svg>
                        Add Parts (+)
                    </button>
                {/* </div> */}
            </div>
            </div>

            {/* Search Bar - Mobile Only */}
            <div className="sm:hidden mt-3">
            <div className="flex items-center gap-2 bg-gray-100 rounded-xl px-3 py-2 w-full">
                <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                <input 
                type="text"
                placeholder="Search parts..." 
                className="bg-transparent text-sm outline-none text-gray-700 w-full placeholder:text-gray-400"
                />
            </div>
            </div>
        </div>

        {/* Desktop Table View (hidden on mobile/tablet) */}
        <div className="hidden lg:block overflow-x-auto">
            <table className="w-full">
            <thead className="bg-gray-50">
                <tr>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Watts</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Bulb Sheet</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Driver</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Lamp Cup</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Bottom Cup</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Color Box</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Cotton Box</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Action</th>
                </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
                {currentItems.map((parts,i)=>(
                    <tr key={i} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap">
                        <span className="inline-flex px-3 py-1 text-sm font-bold bg-blue-100 text-blue-800 rounded-full">{parts.watts}w</span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700 font-bold">{parts.bulbSheet} Pcs</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700 font-bold">{parts.driver} Pcs</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700 font-bold">{parts.lampCup} Pcs</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700 font-bold">{parts.bottomCup} Pcs</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700 font-bold">{parts.colorBox} Pcs</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700 font-bold">{parts.cottonBox} Pcs</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                        <button className=" border-2 text-red-800 px-2 py-1 rounded-[9px] hover:bg-red-800 hover:text-white font-medium text-sm transition-all duration-200 flex items-center gap-1">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                        </svg>
                        Issue
                        </button>
                    </td>
                    </tr>
                ))}
                
            </tbody>
            </table>
        </div>

        {/* Mobile & Tablet Card View (hidden on desktop) */}
        <div className="lg:hidden p-4 space-y-4">
            {/* Card 1 */}
            <div className="bg-gray-50 rounded-xl p-4 shadow-sm border border-gray-200">
            <div className="flex justify-between items-start mb-3">
                <span className="inline-flex px-3 py-1 text-sm font-semibold bg-blue-100 text-blue-800 rounded-full">18w</span>
                <button className="text-red-600 hover:text-red-800 text-sm font-medium flex items-center gap-1">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                </svg>
                Issue
                </button>
            </div>
            <div className="grid grid-cols-2 gap-3 text-sm">
                <div>
                <p className="text-gray-500 text-xs">Bulb Sheet</p>
                <p className="font-medium text-gray-900">LED-18-Sheet</p>
                </div>
                <div>
                <p className="text-gray-500 text-xs">Driver</p>
                <p className="font-medium text-gray-900">1000</p>
                </div>
                <div>
                <p className="text-gray-500 text-xs">Lamp Cup</p>
                <p className="font-medium text-gray-900">LC-18</p>
                </div>
                <div>
                <p className="text-gray-500 text-xs">Bottom Cup</p>
                <p className="font-medium text-gray-900">BC-18</p>
                </div>
                <div>
                <p className="text-gray-500 text-xs">Color Box</p>
                <p className="font-medium text-gray-900">CB-Red</p>
                </div>
                <div>
                <p className="text-gray-500 text-xs">Cotton Box</p>
                <p className="font-medium text-gray-900">CTN-18</p>
                </div>
            </div>
            </div>
        </div>

        
        <div className="px-6 py-3 bg-slate-50 border-t border-slate-100 flex items-center justify-between">
        <span className="text-xs text-slate-400">Showing {parts.length} of {parts.length} employees</span>
        {/* Pagination buttons */}
            <div className="text-xs flex items-center gap-2 justify-center">
                <button className="text-xs px-3 py-1.5 rounded-lg bg-white border border-slate-200 text-slate-500 disabled:opacity-40 disabled:cursor-not-allowed"
                    onClick={() => setCurrentPage(prev => prev - 1)}
                    disabled={currentPage === 1}>
                    ← Prev
                </button>
                {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                    <button className={`text-xs px-3 py-1.5 rounded-lg bg-[#0d2145] text-white font-semibold ${currentPage === page
                    ? "bg-slate-300 text-[#0d2145]"
                    : "bg-slate-900 text-[#0146c5]"  
                  }`}
                        key={page}
                        onClick={() => setCurrentPage(page)}
                        style={{ fontWeight: currentPage === page ? 'bold' : 'normal' }}
                    >
                        {page}
                    </button>
                ))}
                <button className="text-xs px-3 py-1.5 rounded-lg bg-white border border-slate-200 text-slate-500 disabled:opacity-40 disabled:cursor-not-allowed"
                    onClick={() => setCurrentPage(prev => prev + 1)}
                    disabled={currentPage === totalPages}>
                    Next →
                </button>
            </div>
            </div>
      </div>
    </div>
    </>
}