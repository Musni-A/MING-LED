import { useEffect, useState } from "react"
import LightTypeForm from "./lightTypeForm"
import { getLightType } from "../../api/lightTypeAPI"
import toast from "react-hot-toast"
import LightWatts from "./lightWattsForm"
import UpdateForm from "./updateForm"
import { deleteLightWatts, getLightWatts } from "../../api/lightAPI"
import { PlusSquare, Plus, MinusSquareIcon, BookmarkPlus, ArrowDownFromLine, LoaderCircle, Trash2Icon } from 'lucide-react';

export default function PartsList(){
    
    const [showTypeForm, setTypeShowForm] = useState(false)
    const [showForm, setShowForm] = useState(false)
    const [showUpdateForm, setShowUpdateForm] = useState(false)
    const [lightTypes, setLightTypes] = useState([])
    const [lightWatts, setLightWatts] = useState([])
    const [selectedType, setSelectedType] = useState(null)
    const [selectedWatts, setSelectedWatts] = useState(null)
    const [selectedWattsId, setSelectedWattsId] = useState(null)
    const [arithType, setArithType] = useState(null)
    const [getIndex, setGetIndex] = useState(null)
    const [loading, setLoading] = useState(true)
    const [lastSelectedTypeName, setLastSelectedTypeName] = useState(null)
    const [deleteId, setDeleteId] = useState(null);

    const fetchData = async () => {
        try {
            const typesRes = await getLightType()
            setLightTypes(typesRes.data)
            
            const wattsRes = await getLightWatts()
            setLightWatts(wattsRes.data)
            
            // If there was a previously selected type, re-select it
            if (lastSelectedTypeName) {
                const type = typesRes.data.find(t => t.typeName === lastSelectedTypeName)
                const watts = wattsRes.data.filter(w => w.typeName === lastSelectedTypeName)
                if (type) {
                    setSelectedType(type)
                    setSelectedWatts(watts)
                }
            }
        } catch (err) {
            toast.error(err.message)
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchData();
    }, [])

    const handleTypeSelect = (type, watts) => {
        setSelectedType(type)
        setSelectedWatts(watts)
        setLastSelectedTypeName(type?.typeName || null) // Save the selection
    }

    const handleOnDelete = (id, watts)=>{
        toast(
        (t) => (
            <div className="flex flex-col gap-2">
            <p>Delete {watts} permanently?</p>
            <div className="flex gap-2 justify-evenly">
                <button
                onClick={() => {
                    toast.dismiss(t.id);
                    confirmDelete(id);
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
        ),
        {
            duration: 5000,
            position: "top-center",
        }
        );
    }
    const confirmDelete = async (id) => {
    setDeleteId(id);
    try {
      const response = await deleteLightWatts(id);
      await fetchData();
      // ✅ Fix: Access the message correctly
      const successMessage = response?.data?.deleteUser?.name 
        ? `${response.name} deleted successfully!`
        : "deleted successfully!";
      toast.success(successMessage, {
        position: "top-right",
        duration: 1000,
      });
    } catch (err) {
      // ✅ Fix: Convert error to string
      const errorMessage = err?.response?.data?.message || err?.message || "Failed to delete user";
      toast.error(errorMessage);
    } finally {
      setDeleteId(null);
    }
  };

    const getId = (id, index, arithType) => {
        setSelectedWattsId(id)
        setGetIndex(index)
        setArithType(arithType)
    }


    return <>
            {/* Modal Overlays */}
            {showTypeForm && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                    <LightTypeForm 
                        setTypeShowForm={setTypeShowForm} 
                        fetchData={fetchData} 
                        lightTypes={lightTypes}
                    />
                </div>
            )}

            {showForm && (
                <div 
                    onClick={() => setShowForm(false)} 
                    className={`fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4 transition-all duration-300 ${showForm ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
                >
                    <div onClick={(e) => e.stopPropagation()} className="max-h-[90vh] overflow-y-auto w-full max-w-xl">
                        <LightWatts 
                            setShowForm={setShowForm} 
                            showForm={showForm} 
                            fetchData={fetchData} 
                            lightWatts={lightWatts} 
                            lightTypes={lightTypes} 
                            handleTypeSelect={handleTypeSelect}
                        />
                    </div>
                </div>
            )}
            {showUpdateForm && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                    <UpdateForm setShowUpdateForm={setShowUpdateForm} fetchData={fetchData} selectedWattsId={selectedWattsId} arithType={arithType} getIndex={getIndex} selectedWatts={selectedWatts} selectedType={selectedType}/>
                </div>
            )}
            {/* Rest of your component remains the same */}
            {/* ... */}

    {/* Main Container */}
    <div className="bg-linear-to-br h-fit from-gray-50 to-white md:m-2 sm:rounded-2xl shadow-xl w-full overflow-hidden border border-gray-100">
        {/* Header Section */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 p-2 border-b-2 border-gray-300 bg-white/50 backdrop-blur-sm">
            <div className="w-full gap-8 justify-between items-center sm:flex sm:w-auto">
            <div className="mt-1 w-full sm:w-auto">
                <div className="flex items-center gap-3">
                    {/* Icon Badge */}
                    <div className="hidden sm:flex w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 items-center justify-center shadow-md shadow-blue-200">
                        <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                        </svg>
                    </div>
                    <div className=" border-2 hover:bg-red-600  transition-all duration-300  hover:text-white text-red-600 border-red-600 p-1.5 rounded-xl">
                        <Trash2Icon />
                    </div>

                    {/* Select Container */}
                    <div className="relative flex-1">
                        <select 
                        className="w-full sm:w-64 pl-4 pr-10 py-2.5 bg-white border-2 border-gray-200 rounded-xl text-gray-700 font-medium cursor-pointer hover:border-blue-400 focus:border-blue-500 focus:ring-4 focus:ring-blue-100 outline-none transition-all appearance-none text-sm shadow-sm"
                        onChange={(e) => {
                            const type = lightTypes.find(t => t.typeName === e.target.value)
                            const watts = lightWatts.filter(w => w.typeName === e.target.value)
                            handleTypeSelect(type, watts)
                        }}
                        >
                        <option value="">📦 Select product type...</option>
                        {lightTypes.map((type) => (
                            <option key={type._id} value={type.typeName}>
                            {type.typeName} • {lightWatts.filter(w => w.typeName === type.typeName).length} variants
                            </option>
                        ))}
                        </select>
                        
                        {/* Arrow */}
                        <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none">
                        <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                        </svg>
                        </div>
                    </div>
                </div>
            </div>
            </div>
            
            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
                <button 
                    onClick={()=>setShowForm(true)} 
                    className="w-full sm:w-auto bg-linear-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white px-2 py-1 rounded-xl font-medium shadow-md hover:shadow-lg transition-all duration-200 flex items-center justify-center gap-2"
                >
                    <Plus className="w-4 h-4" />
                    New Watts
                </button>
                <button 
                    onClick={()=>setTypeShowForm(true)} 
                    className="w-full sm:w-auto bg-white border-2 border-gray-300 hover:border-gray-400 hover:bg-gray-50 text-gray-700 px-2 mr-5 py-1 rounded-xl font-medium shadow-sm hover:shadow transition-all duration-200 flex items-center justify-center gap-2"
                >
                    <BookmarkPlus className="w-4 h-4" />
                    New Light Type
                </button>
            </div>
        </div>

        {/* Content Area */}
        <div className="sm:max-h-125 overflow-y-auto">
            {loading ? (
                <div className="flex justify-center items-center py-12">
                    <LoaderCircle className="w-12 h-12 text-blue-400 animate-spin" />
                </div>
            ) : (
                <>
                    {selectedType && selectedWatts && (
                        <>
                            {/* Desktop: Table View (Hidden on mobile) */}
                            <div className="hidden md:block overflow-y-auto shadow-sm">
                                <table className="w-full text-sm">
                                    <thead>
                                        <tr className="border-b-2 border-gray-300 bg-gray-100">
                                            <th className="px-4 py-3 text-center text-xs font-semibold text-black uppercase tracking-wider border-l-2 border-gray-300 sticky left-0 bg-gray-100 z-20 w-24">
                                                <div className="flex flex-col items-center gap-1">
                                                    <span className="font-bold text-black">Watts</span>
                                                </div>
                                            </th>
                                            {selectedType.parts.map((part, index) => (
                                                <th key={index} className="px-4 py-3 border-l-2 border-gray-300 text-center text-xs font-semibold text-black uppercase tracking-wider">
                                                    <div className="flex flex-col items-center gap-1">
                                                        <span className="font-bold text-black">{part.partsName}</span>
                                                    </div>
                                                </th>
                                            ))}
                                            <th className="px-4 py-3 text-center border-l-2 border-r-2 border-gray-300 text-xs font-semibold text-black uppercase tracking-wider">
                                                <div className="flex flex-col items-center gap-1">
                                                    <span className="font-bold text-black">Action</span>
                                                </div>
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody className="bg-white divide-y divide-gray-200">
                                        {selectedWatts.length > 0 ? (
                                            selectedWatts.map((watt, index) => (
                                                <tr key={index} className={`hover:bg-blue-50/30 transition-colors ${index % 2 === 0 ? 'bg-white' : 'bg-gray-50/50'}`}>
                                                    <td className="px-4 py-3 whitespace-nowrap text-sm font-semibold text-gray-900 border-l-2 border-r-2 border-gray-300 text-center sticky left-0 bg-inherit z-10">
                                                        <div className="flex items-center justify-center gap-2">
                                                            <div className="w-2 h-2 rounded-full bg-blue-500"></div>
                                                            <span>{watt.watts}</span>
                                                        </div>
                                                    </td>
                                                    {selectedType.parts.map((part, pIndex) => (
                                                        <td key={pIndex} className="px-3 whitespace-nowrap text-sm text-center border-l-2 border-r-2 border-gray-300">
                                                            {watt.parts[pIndex]?.quantity ? (
                                                                <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-300/20 text-blue-800">
                                                                    {watt.parts[pIndex].quantity} pcs
                                                                </span>
                                                            ) : (
                                                                <span className="inline-flex items-center px-3 py-1 rounded-full text-xs  font-bold bg-red-100">
                                                                    —
                                                                </span>
                                                            )}
                                                        </td>
                                                    ))}
                                                    <td className="px-4 py-3 w-20 whitespace-nowrap text-sm font-semibold text-gray-900 border-l-2 border-r-2 border-gray-300">
                                                        <div className="flex items-center justify-center gap-2">
                                                            <div onClick={()=>{setShowUpdateForm(true); getId(watt._id, index, 'add');}} className="bg-blue-200 p-0.5 rounded-lg flex items-center justify-center cursor-pointer hover:bg-blue-300 hover:scale-105 duration-200 transition-all">
                                                                <button className="text-blue-600 hover:text-blue-700">
                                                                    <PlusSquare className="w-6 h-6 text-blue-600" />
                                                                </button>
                                                            </div>
                                                            <div onClick={()=>{setShowUpdateForm(true); getId(watt._id, index, 'subtract');}} className="bg-yellow-200 p-0.5 rounded-lg flex items-center justify-center cursor-pointer hover:bg-yellow-300 hover:scale-105 duration-200 transition-all">
                                                                <button className="text-blue-600 hover:text-blue-700">
                                                                    <MinusSquareIcon className="w-6 h-6 text-yellow-600" />
                                                                </button>
                                                            </div>
                                                            <div onClick={()=>{handleOnDelete(watt._id, watt.watts)}} className="bg-red-200 p-0.5 rounded-lg flex items-center justify-center cursor-pointer hover:bg-red-300 hover:scale-105 duration-200 transition-all">
                                                                <button className="text-blue-600 hover:text-blue-700">
                                                                    <Trash2Icon className="w-6 h-6 text-red-600" />
                                                                </button>
                                                            </div>
                                                        </div>
                                                    </td>
                                                </tr>
                                            ))
                                        ) : (
                                            <tr>
                                                <td colSpan={selectedType.parts.length + 1} className="px-4 py-8 text-center text-gray-500">
                                                    <div className="flex flex-col items-center gap-2">
                                                        <svg className="w-12 h-12 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                                        </svg>
                                                        <span>No watts defined for this product type</span>
                                                        <button 
                                                            onClick={()=>setShowForm(true)}
                                                            className="mt-2 text-blue-600 hover:text-blue-700 font-medium text-sm"
                                                        >
                                                            + Add your first watts
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>

                            {/* Mobile: Card View (Visible only on mobile) */}
                            <div className="md:hidden space-y-4">
                                {selectedWatts.length > 0 ? (
                                    selectedWatts.map((watt, wattIndex) => (
                                        <div key={wattIndex} className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
                                            {/* Watt Header */}
                                            <div className="bg-linear-to-r from-blue-500 to-blue-600 px-4 py-3">
                                                <div className="flex items-center justify-between">
                                                    <div className="flex items-center gap-2">
                                                        <div className="flex items-center gap-2">
                                                            <div className="w-3 h-3 rounded-full bg-white"></div>
                                                            <span className="text-lg font-bold text-white">{watt.watts}</span>
                                                        </div>
                                                    </div>
                                                    <div className="flex items-center gap-2">
                                                        <div onClick={()=>{setShowUpdateForm(true); getId(watt._id, wattIndex, 'add');}} className="bg-blue-200 p-0.5 rounded-lg flex items-center justify-center cursor-pointer hover:bg-blue-300 hover:scale-105 duration-200 transition-all">
                                                            <button className="text-blue-600 hover:text-blue-700">
                                                                <PlusSquare className="w-6 h-6 text-blue-600" />
                                                            </button>
                                                        </div>
                                                        <div onClick={()=>{setShowUpdateForm(true); getId(watt._id, wattIndex, 'subtract');}} className="bg-yellow-200 p-0.5 rounded-lg flex items-center justify-center cursor-pointer hover:bg-blue-300 hover:scale-105 duration-200 transition-all">
                                                            <button className="text-blue-600 hover:text-blue-700">
                                                                <MinusSquareIcon className="w-6 h-6 text-yellow-600" />
                                                            </button>
                                                        </div>
                                                        <div onClick={()=>{handleOnDelete(watt._id, watt.watts)}} className="bg-red-200 p-0.5 rounded-lg flex items-center justify-center cursor-pointer hover:bg-blue-300 hover:scale-105 duration-200 transition-all">
                                                            <button className="text-blue-600 hover:text-blue-700">
                                                                <Trash2Icon className="w-6 h-6 text-red-600" />
                                                            </button>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                            
                                            {/* Parts List */}
                                            <div className="divide-y divide-gray-100">
                                                {selectedType.parts.map((part, pIndex) => (
                                                    <div key={pIndex} className="flex items-center justify-between px-4 py-3 hover:bg-gray-50 transition-colors">
                                                        <div className="flex items-center gap-3">
                                                            <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center">
                                                                <span className="text-xs font-bold text-gray-600">{pIndex + 1}</span>
                                                            </div>
                                                            <span className="text-sm font-medium text-gray-700">{part.partsName}</span>
                                                        </div>
                                                        <div>
                                                            {watt.parts[pIndex]?.quantity ? (
                                                                <span className="inline-flex items-center px-3 py-1.5 rounded-lg text-sm font-semibold bg-green-100 text-green-700">
                                                                    {watt.parts[pIndex].quantity} pcs
                                                                </span>
                                                            ) : (
                                                                <span className="inline-flex items-center px-3 py-1.5 rounded-lg text-sm font-medium bg-gray-100 text-gray-500">
                                                                    —
                                                                </span>
                                                            )}
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    ))
                                ) : (
                                    <div className="text-center py-12">
                                        <div className="inline-flex p-4 bg-gray-100 rounded-full mb-4">
                                            <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                            </svg>
                                        </div>
                                        <h3 className="text-lg font-semibold text-gray-800 mb-2">No Watts Found</h3>
                                        <p className="text-gray-500 text-sm mb-4">Add watt variants for this product type</p>
                                        <button 
                                            onClick={()=>setShowForm(true)}
                                            className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-2.5 rounded-xl font-medium"
                                        >
                                            Add Watts
                                        </button>
                                    </div>
                                )}
                            </div>
                        </>
                    )}

                    {/* Empty States */}
                    {!selectedType && lightTypes.length > 0 && (
                        <div className="text-center py-12">
                            <div className="inline-flex p-4 bg-blue-50 rounded-full mb-4">
                                <svg className="w-8 h-8 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 15l-2 5L9 9l11 4-5 2zm0 0l5 5M7.188 2.239l.777 2.897M5.136 7.965l-2.898-.777M13.95 4.05l-2.122 2.122m-5.657 5.656l-2.12 2.122" />
                                </svg>
                            </div>
                            <h3 className="text-lg font-semibold text-gray-800 mb-2">Select a Product Type</h3>
                            <p className="text-gray-500 text-sm">Choose a product type from the dropdown above to view its parts and quantities</p>
                        </div>
                    )}

                    {lightTypes.length === 0 && !loading && (
                        <div className="text-center py-12">
                            <div className="inline-flex p-4 bg-gray-100 rounded-full mb-4">
                                <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
                                </svg>
                            </div>
                            <h3 className="text-lg font-semibold text-gray-800 mb-2">No Product Types Found</h3>
                            <p className="text-gray-500 text-sm mb-4">Get started by creating your first light type</p>
                            <button 
                                onClick={()=>setTypeShowForm(true)}
                                className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-2.5 rounded-xl font-medium shadow-md hover:shadow-lg transition-all duration-200"
                            >
                                Create Light Type
                            </button>
                        </div>
                    )}
                </>
            )}
        </div>

        {/* Footer Stats */}
        {selectedType && selectedWatts && (
            <div className="px-4 md:px-6 py-3 bg-gray-50 border-t border-gray-200 text-xs text-gray-500 flex justify-between items-center">
                <span>Showing {selectedWatts.length} watt variants</span>
                <span>Total Parts: {selectedType.parts.length}</span>
            </div>
        )}
    </div>
    </>
}