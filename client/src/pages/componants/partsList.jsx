import { useEffect, useState } from "react"
import LightTypeForm from "./lightTypeForm"
import { getLightType } from "../../api/lightTypeAPI"
import toast from "react-hot-toast"
import LightWatts from "./lightWattsForm"
import UpdateForm from "./updateForm"
import { getLightWatts } from "../../api/lightAPI"
import { Plus, BookmarkPlus, ArrowDownFromLine, LoaderCircle } from 'lucide-react';

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
                {/* <div className="pl-2">
                    <h2 className="text-xl md:text-xl font-bold text-gray-800">Parts Management</h2>
                    <p className="text-xs md:text-sm text-gray-500">Manage product types and their components</p>
                </div> */}
                
                {/* Select Dropdown */}
                <div className="mt-1 px-4 gap-2 flex justify-between items-center border-2 py-1 border-gray-300 rounded-xl bg-white/50 backdrop-blur-sm">
                    <select 
                        className="w-full sm:w-fit bg-white border-gray-200 rounded-xl text-gray-700 font-medium cursor-pointer outline-none transition-all appearance-none"
                        onChange={(e) => {
                            const type = lightTypes.find(t => t.typeName === e.target.value)
                            const watts = lightWatts.filter(w => w.typeName === e.target.value)
                            handleTypeSelect(type, watts)
                        }}
                    >
                        <option value="">Select product type...</option>
                        {lightTypes.map((type) => (
                            <option key={type._id} value={type.typeName}>
                                {type.typeName} ({lightWatts.filter(w => w.typeName === type.typeName).length} variants)
                            </option>
                        ))}
                    </select>
                    <div className="">
                        <ArrowDownFromLine className="w-4 h-4" />
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
                                            <th className="px-4 py-3 text-center text-xs font-semibold text-black uppercase tracking-wider border-l-2 border-gray-300">
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
                                                    <td className="px-4 py-3 whitespace-nowrap text-sm font-semibold text-gray-900 border-l-2 border-r-2 border-gray-300">
                                                        <div className="flex items-center justify-center gap-2">
                                                            <div className="w-2 h-2 rounded-full bg-blue-500"></div>
                                                            <span>{watt.watts}</span>
                                                        </div>
                                                    </td>
                                                    {selectedType.parts.map((part, pIndex) => (
                                                        <td key={pIndex} className="px-3 whitespace-nowrap text-sm text-center border-l-2 border-r-2 border-gray-300">
                                                            {watt.parts[pIndex]?.quantity ? (
                                                                <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-green-100 ">
                                                                    {watt.parts[pIndex].quantity} pcs
                                                                </span>
                                                            ) : (
                                                                <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-red-100">
                                                                    —
                                                                </span>
                                                            )}
                                                        </td>
                                                    ))}
                                                    <td className="px-4 py-3 w-20 whitespace-nowrap text-sm font-semibold text-gray-900 border-l-2 border-r-2 border-gray-300">
                                                        <div className="flex items-center justify-center gap-2">
                                                        <div onClick={()=>{setShowUpdateForm(true); getId(watt._id, index, 'add');}} className="bg-blue-200 px-2 py-0.5 rounded-lg flex items-center justify-center cursor-pointer hover:bg-blue-300 hover:scale-105 duration-200 transition-all">
                                                            <button className="text-blue-600 hover:text-blue-700">
                                                                Add (+)
                                                            </button>
                                                        </div>
                                                        <div onClick={()=>{setShowUpdateForm(true); getId(watt._id, index, 'subtract');}} className="bg-blue-200 px-2 py-0.5 rounded-lg flex items-center justify-center cursor-pointer hover:bg-blue-300 hover:scale-105 duration-200 transition-all">
                                                            <button className="text-blue-600 hover:text-blue-700">
                                                                Sub (-)
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
                                                        <div onClick={()=>{setShowUpdateForm(true); getId(watt._id, wattIndex, 'add');}} className="bg-blue-200 px-2 py-0.5 rounded-lg flex items-center justify-center cursor-pointer hover:bg-blue-300 hover:scale-105 duration-200 transition-all">
                                                            <button className="text-blue-600 hover:text-blue-700">
                                                                Add (+)
                                                            </button>
                                                        </div>
                                                        <div onClick={()=>{setShowUpdateForm(true); getId(watt._id, wattIndex, 'subtract');}} className="bg-blue-200 px-2 py-0.5 rounded-lg flex items-center justify-center cursor-pointer hover:bg-blue-300 hover:scale-105 duration-200 transition-all">
                                                            <button className="text-blue-600 hover:text-blue-700">
                                                                Sub (-)
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