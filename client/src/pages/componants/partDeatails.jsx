import { useEffect, useState } from "react"
import { deleteLedParts, getAllLedParts } from "../../api/partsAPI"
import AddParts from "./addParts";
import { FaTrash, FaTrashAlt } from 'react-icons/fa'; // Font Awesome 5
import  toast, {Toaster} from "react-hot-toast";



export default function PartDetails(){
    const [show, setShow] = useState(false)
    const [button, setButton] = useState(null)
    const [parts, setParts] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(()=>{
        getAllLedParts()
        .then((res)=>setParts(res.data))
        .catch((err)=>{console.log(err)})
        .finally(()=>setLoading(false))
    },[parts])

    const [currentPage, setCurrentPage] = useState(1)
    const itemsPerPage = 6
    const totalPages = Math.ceil(parts.length / itemsPerPage)
    const currentItems = parts.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
    )
    const handleDelete = (part) => {
    toast((t) => (
      <div className="flex flex-col gap-2">
        <p>Delete {part.watts}w {part.tempColor} permanently?</p>
        <div className="flex gap-2 justify-evenly">
          <button
            onClick={() => {
              toast.dismiss(t.id);
              confirmDelete(part._id);
            }}
            className="px-3 py-1 bg-red-600 text-white rounded text-sm"
          >
            Yes, Delete
          </button>
          <button
            onClick={() => toast.dismiss(t.id)}
            className="px-3 py-1 bg-gray-300 rounded text-sm"
          >
            Cancel
          </button>
        </div>
      </div>
    ), {
      duration: 5000,
      position: 'top-center',
    });
  };

  const confirmDelete =  async (id) => {
    try{
        const response = await deleteLedParts(id)
        toast.success(`${response.data.deletedLedParts.watts}w Part deleted successfully!`, {
          position: 'top-right',
          duration: 3000,
        });
    }
    catch(err){
        toast.error(err.name)
    }
  };

    return <>
    <div className="">
        {show &&
          <div onClick={()=>setShow(false)} className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center">
            <div className=" p-6 rounded-xl shadow-2xl border border-gray-200 
         transition-all duration-300 ease-out 
         
         opacity-100 scale-95
         
         popover-open:opacity-100 popover-open:scale-100

         backdrop:transition-all backdrop:duration-300
         backdrop:bg-black/50 backdrop:opacity-0 
         popover-open:backdrop:opacity-100" onClick={(e)=>{e.stopPropagation()}}><AddParts button={button} show={show} setShow={setShow}/></div>
          </div>
        }
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

                    <button onClick={()=>{setShow(true); setButton('update')}} className="border-2 border-red-800 bg-red-800/20 text-red-800 sm:text-sm text-sm font-semibold px-3 py-1 rounded-xl transition-all duration-300 hover:bg-red-800 hover:text-white shadow-md flex items-center justify-center gap-2">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                    </svg>
                        Issue to Production (-)
                    </button>

                    {/* Add Parts Button */}
                    <button onClick={()=>{setShow(true); setButton('add')}} className="border-2 border-blue-800 bg-blue-800/20 text-blue-800 sm:text-sm text-[13px] font-semibold px-3 py-1 rounded-xl transition-all duration-300 hover:bg-blue-800 hover:text-white shadow-md flex items-center justify-center gap-2">
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
            {loading && <div className="flex justify-center"><img className="" src="/loading.gif" alt="" width={150} /></div>}
            {!loading && <table className="w-full">
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
                        <span className={`inline-flex px-3 py-1 text-sm font-bold ${parts.tempColor.charAt(0) == "C" ? 
                            'bg-blue-100 text-blue-800' : 'bg-yellow-100 text-yellow-700' } rounded-xl`}>{parts.watts}w {parts.tempColor}</span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700 font-bold">{parts.bulbSheet} Pcs</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700 font-bold">{parts.driver} Pcs</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700 font-bold">{parts.lampCup} Pcs</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700 font-bold">{parts.bottomCup} Pcs</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700 font-bold">{parts.colorBox} Pcs</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700 font-bold">{parts.cottonBox} Pcs</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex gap-2">
                            <button onClick={()=>{handleDelete(parts)}} className=" border-2 rounded-xl px-2 cursor-pointer hover:bg-[#b10000] border-[#b10000] text-[#b10000] hover:text-white">
                                <FaTrashAlt className="search-icon " />
                            </button>

                            <button className=" cursor-pointer border-2 text-red-800 px-2 py-1 rounded-[9px] hover:bg-red-800 hover:text-white 
                            font-medium text-sm transition-all duration-200 flex items-center gap-1">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                            </svg>
                            Issue
                            </button>
                        </div>
                    </td>
                    </tr>
                ))}
                
            </tbody>
            </table>}
        </div>

        {/* Mobile & Tablet Card View (hidden on desktop) */}
        <div className="lg:hidden p-4 space-y-4">
            {loading && <div className="flex justify-center"><img className="" src="/loading.gif" alt="" width={150} /></div>}
            {!loading && currentItems.map((parts,i)=>(
                <div key={i} className="bg-gray-50 rounded-xl p-4 shadow-sm border border-gray-200">
                <div className="flex justify-between items-start mb-3">
                    <span className={`inline-flex px-3 py-1 text-sm font-semibold ${parts.tempColor.charAt(0) == "C" ? 'bg-blue-100 text-blue-800' : 'bg-yellow-100 text-yellow-700' } bg-blue-100 text-blue-800 rounded-full`}>{parts.watts}w {parts.tempColor}</span>
                    <div className="flex gap-2">
                        <button className=" border-2 rounded-xl px-2 py-1 cursor-pointer hover:bg-[#b10000] border-[#b10000] text-[#b10000] hover:text-white">
                            <FaTrashAlt className="search-icon " />
                        </button>
                        <button className="border-2 px-1 rounded-xl hover:bg-[#b10000] border-[#b10000] text-[#b10000] hover:text-white text-sm font-medium flex items-center gap-1">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                        </svg>
                        Issue
                        </button>
                    </div>
                </div>
            
                    <div className="grid grid-cols-3 gap-3 text-sm">
                        <div>
                        <p className="text-gray-500 text-xs">Bulb Sheet</p>
                        <p className="font-medium text-gray-900">{parts.bulbSheet} Pcs</p>
                        </div>
                        <div>
                        <p className="text-gray-500 text-xs">Driver</p>
                        <p className="font-medium text-gray-900">{parts.driver} Pcs</p>
                        </div>
                        <div>
                        <p className="text-gray-500 text-xs">Lamp Cup</p>
                        <p className="font-medium text-gray-900">{parts.lampCup} Pcs</p>
                        </div>
                        <div>
                        <p className="text-gray-500 text-xs">Bottom Cup</p>
                        <p className="font-medium text-gray-900">{parts.bottomCup} Pcs</p>
                        </div>
                        <div>
                        <p className="text-gray-500 text-xs">Color Box</p>
                        <p className="font-medium text-gray-900">{parts.colorBox}Pcs</p>
                        </div>
                        <div>
                        <p className="text-gray-500 text-xs">Cotton Box</p>
                        <p className="font-medium text-gray-900">{parts.cottonBox} Pcs</p>
                        </div>
                    </div>
                </div>
            ))}
            
        </div>

        
        <div className="px-6 py-3 bg-slate-50 border-t border-slate-100 flex items-center justify-between">
        <span className="text-xs text-slate-400">Showing {parts.length} of {currentItems.length} Parts</span>
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