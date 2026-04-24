import { useEffect, useState } from "react"
import LightTypeForm from "./lightTypeForm"
import { getLightType, deleteLightType } from "../../api/lightTypeAPI"
import toast from "react-hot-toast"
import LightWatts from "./lightWattsForm"
import UpdateForm from "./updateForm"
import { deleteLightWatts, getLightWatts } from "../../api/lightAPI"
import { 
  PlusSquare, 
  Plus, 
  MinusSquareIcon, 
  BookmarkPlus, 
  LoaderCircle, 
  Trash2Icon, 
  Search, 
  X,
  AlertTriangle,
  Package,
  TrendingUp,
  TrendingDown,
  CheckCircle,
  XCircle,
  Eye,
  Factory,
  Settings,
  Gauge,
  Zap
} from 'lucide-react';

export default function PartsList() {
  const [showTypeForm, setTypeShowForm] = useState(false)
  const [showForm, setShowForm] = useState(false)
  const [showUpdateForm, setShowUpdateForm] = useState(false)
  const [lightTypes, setLightTypes] = useState([])
  const [lightWatts, setLightWatts] = useState([])
  const [selectedType, setSelectedType] = useState(null)
  const [typeId, setTypeId] = useState(null)
  const [selectedWatts, setSelectedWatts] = useState(null)
  const [selectedWattsId, setSelectedWattsId] = useState(null)
  const [arithType, setArithType] = useState(null)
  const [getIndex, setGetIndex] = useState(null)
  const [loading, setLoading] = useState(true)
  const [lastSelectedTypeName, setLastSelectedTypeName] = useState(null)
  const [searchWatts, setSearchWatts] = useState('')
  const [dashboardView, setDashboardView] = useState(true)
  const [selectedFilter, setSelectedFilter] = useState('all')
  const [getWatt, setGetWatt] = useState('')

  const fetchData = async () => {
    try {
      const typesRes = await getLightType()
      setLightTypes(typesRes.data)
      
      const wattsRes = await getLightWatts()
      setLightWatts(wattsRes.data)
      
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

  // Calculate stock levels for each watt
  const calculateStockLevels = (watts) => {
    if (!watts || !watts.parts) return { totalStock: 0, lowStockItems: 0, outOfStockItems: 0, partStock: {} }
    
    let totalStock = 0
    let lowStockItems = 0
    let outOfStockItems = 0
    let partStock = {}
    
    watts.parts.forEach((part, index) => {
      const quantity = part?.quantity || 0
      totalStock += quantity
      if (quantity === 0) {
        outOfStockItems++
      } else if (quantity < 10) {
        lowStockItems++
      }
      partStock[`part_${index}`] = quantity
    })
    
    return { totalStock, lowStockItems, outOfStockItems, partStock }
  }

  // Calculate how many full products can be made
  const calculateProductionCapacity = (watts) => {
    if (!watts || !watts.parts || !selectedType?.parts) return { maxProducts: 0, limitingPart: null, productsByPart: {} }
    
    let productsByPart = {}
    let minProducts = Infinity
    let limitingPart = null
    
    selectedType.parts.forEach((part, index) => {
      const availableQuantity = watts.parts[index]?.quantity || 0
      const requiredQuantity = part.quantity || 1
      
      // Calculate how many products can be made with this part
      const possibleProducts = Math.floor(availableQuantity / requiredQuantity)
      productsByPart[part.partsName] = possibleProducts
      
      if (possibleProducts < minProducts) {
        minProducts = possibleProducts
        limitingPart = part.partsName
      }
    })
    
    return {
      maxProducts: minProducts === Infinity ? 0 : minProducts,
      limitingPart,
      productsByPart
    }
  }

  // Get stock status for a watt
  const getStockStatus = (watts) => {
    const { totalStock, lowStockItems, outOfStockItems } = calculateStockLevels(watts)
    const productionCapacity = calculateProductionCapacity(watts)
    
    if (productionCapacity.maxProducts === 0) {
      return { 
        status: 'cannot-produce', 
        label: 'Cannot Produce', 
        color: 'bg-red-100 text-red-700', 
        icon: XCircle,
        priority: 1
      }
    } else if (productionCapacity.maxProducts < 10) {
      return { 
        status: 'low-production', 
        label: 'Low Production', 
        color: 'bg-orange-100 text-orange-700', 
        icon: AlertTriangle,
        priority: 2
      }
    }
    return { 
      status: 'good-production', 
      label: 'Good Production', 
      color: 'bg-green-100 text-green-700', 
      icon: CheckCircle,
      priority: 3
    }
  }

  // Filter watts based on stock status
  const getFilteredWatts = () => {
    if (!selectedWatts) return []
    
    return selectedWatts.filter(watt => {
      const productionCapacity = calculateProductionCapacity(watt)
      if (selectedFilter === 'all') return true
      if (selectedFilter === 'low-stock') return productionCapacity.maxProducts > 0 && productionCapacity.maxProducts < 10
      if (selectedFilter === 'out-of-stock') return productionCapacity.maxProducts === 0
      return true
    })
  }

  const filteredWatts = getFilteredWatts().filter(watt => 
    watt.watts.toString().includes(searchWatts)
  )

  // Calculate dashboard statistics
  const dashboardStats = {
    totalTypes: lightTypes.length,
    totalWatts: selectedWatts?.length || 0,
    totalStock: selectedWatts?.reduce((sum, watt) => sum + calculateStockLevels(watt).totalStock, 0) || 0,
    totalProductionCapacity: selectedWatts?.reduce((sum, watt) => sum + calculateProductionCapacity(watt).maxProducts, 0) || 0,
    criticalStockCount: selectedWatts?.filter(w => calculateProductionCapacity(w).maxProducts === 0).length || 0,
    lowProductionCount: selectedWatts?.filter(w => {
      const capacity = calculateProductionCapacity(w)
      return capacity.maxProducts > 0 && capacity.maxProducts < 10
    }).length || 0,
    goodProductionCount: selectedWatts?.filter(w => calculateProductionCapacity(w).maxProducts >= 10).length || 0
  }

  const handleOnTypeDelete = (typeName) => {
    toast(
      (t) => (
        <div className="flex flex-col gap-2">
          <p>Delete {typeName} permanently?</p>
          <div className="flex gap-2 justify-evenly">
            <button onClick={() => { toast.dismiss(t.id); confirmDeleteType(typeId); }} className="px-3 py-1 bg-red-600 text-white rounded text-sm">Yes, Delete</button>
            <button onClick={() => toast.dismiss(t.id)} className="px-3 py-1 bg-gray-300 rounded text-sm">Cancel</button>
          </div>
        </div>
      ), { duration: 5000, position: "top-center" }
    );
  }

  const handleTypeSelect = (type, watts) => {
    setSelectedType(type)
    setSelectedWatts(watts)
    setLastSelectedTypeName(type?.typeName || null)
    setSearchWatts('')
    setSelectedFilter('all')
  }

  const handleOnDelete = (id, watts) => {
    toast(
      (t) => (
        <div className="flex flex-col gap-2">
          <p>Delete {watts} permanently?</p>
          <div className="flex gap-2 justify-evenly">
            <button onClick={() => { toast.dismiss(t.id); confirmDelete(id); }} className="px-3 py-1 bg-red-600 text-white rounded text-sm">Yes, Delete</button>
            <button onClick={() => toast.dismiss(t.id)} className="px-3 py-1 bg-gray-300 rounded text-sm">Cancel</button>
          </div>
        </div>
      ), { duration: 5000, position: "top-center" }
    );
  }

  const confirmDelete = async (id) => {
    try {
      await deleteLightWatts(id);
      await fetchData();
      toast.success("Deleted successfully!", { position: "top-right", duration: 1000 });
    } catch (err) {
      const errorMessage = err?.response?.data?.message || err?.message || "Failed to delete watts";
      toast.error(errorMessage, { duration: 1000 });
    }
  };

  const confirmDeleteType = async (id) => {
    try {
      await deleteLightType(id);
      await fetchData();
      toast.success("Deleted successfully!", { position: "top-right", duration: 1000 });
    } catch (err) {
      const errorMessage = err?.response?.data?.message || err?.message || "Failed to delete light type";
      toast.error(errorMessage, { duration: 1000 });
    }
  };

  const getId = (id, index, arithType) => {
    setSelectedWattsId(id)
    setGetIndex(index)
    setArithType(arithType)
  }

  return (
    <>
      {/* Modal Overlays */}
      {showTypeForm && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <LightTypeForm setTypeShowForm={setTypeShowForm} fetchData={fetchData} lightTypes={lightTypes} />
        </div>
      )}

      {showForm && (
        <div onClick={() => setShowForm(false)} className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div onClick={(e) => e.stopPropagation()} className="max-h-[90vh] overflow-y-auto w-full max-w-xl">
            <LightWatts setShowForm={setShowForm} showForm={showForm} fetchData={fetchData} lightWatts={lightWatts} lightTypes={lightTypes} handleTypeSelect={handleTypeSelect} />
          </div>
        </div>
      )}

      {showUpdateForm && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <UpdateForm getWatt={getWatt} setShowUpdateForm={setShowUpdateForm} fetchData={fetchData} selectedWattsId={selectedWattsId} arithType={arithType} getIndex={getIndex} selectedWatts={selectedWatts} selectedType={selectedType} />
        </div>
      )}

      {/* Main Container */}
      <div className="bg-gradient-to-br from-gray-50 to-white shadow-xl w-full overflow-y-auto border border-gray-100">
        
        {/* Header Section */}
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 p-4 border-gray-200 border-b-2 bg-white/50 backdrop-blur-sm">
          <div className="flex items-center gap-4">
            <div className="hidden sm:flex w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 items-center justify-center shadow-md shadow-blue-200">
              <Factory className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-800">Production Dashboard</h1>
              <p className="text-sm text-gray-500">Track stock levels and production capacity</p>
            </div>
          </div>
          
          <div className="flex gap-2 w-full lg:w-auto">
            <div className="flex-1 lg:flex-none">
              <div className="relative">
                <select 
                  className="w-full lg:w-64 pl-4 pr-10 py-2.5 bg-white border-2 border-gray-200 rounded-xl text-gray-700 font-medium cursor-pointer hover:border-blue-400 focus:border-blue-500 focus:ring-4 focus:ring-blue-100 outline-none transition-all appearance-none text-sm shadow-sm"
                  onChange={(e) => {
                    const type = lightTypes.find(t => t.typeName === e.target.value)
                    const watts = lightWatts.filter(w => w.typeName === e.target.value)
                    handleTypeSelect(type, watts)
                    setTypeId(type?._id)
                  }}
                  value={selectedType?.typeName || ""}
                >
                  <option value="">📦 Select product type...</option>
                  {lightTypes.map((type) => (
                    <option key={type._id} value={type.typeName}>
                      {type.typeName} • {lightWatts.filter(w => w.typeName === type.typeName).length} variants
                    </option>
                  ))}
                </select>
                <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none">
                  <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
              </div>
            </div>
            
            <button onClick={() => setShowForm(true)} className="bg-gradient-to-r from-blue-500 to-blue-600 hover:opacity-90 text-white px-4 py-2.5 rounded-xl font-medium shadow-md hover:shadow-lg transition-all flex items-center gap-2">
              <Plus className="w-4 h-4" />
              <span className="hidden sm:inline">New Watts</span>
            </button>
            <button onClick={() => setTypeShowForm(true)} className="bg-white border-2 border-gray-300 hover:border-gray-400 hover:bg-gray-50 text-gray-700 px-4 py-2.5 rounded-xl font-medium shadow-sm hover:shadow transition-all flex items-center gap-2">
              <BookmarkPlus className="w-4 h-4" />
              <span className="hidden sm:inline">New Type</span>
            </button>
          </div>
        </div>

        {/* Production Statistics Cards */}
        {selectedType && selectedWatts && (
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4 p-4 bg-gradient-to-r from-blue-50/50 to-purple-50/50 border-b border-gray-200">
            <div className="bg-white rounded-xl p-4 shadow-sm border-l-4 border-blue-500">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-gray-500">Total Variants</p>
                  <p className="text-2xl font-bold text-gray-800">{dashboardStats.totalWatts}</p>
                </div>
                <Gauge className="w-8 h-8 text-blue-400 opacity-50" />
              </div>
            </div>
            <div className="bg-white rounded-xl p-4 shadow-sm border-l-4 border-green-500">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-gray-500">Total Stock (pcs)</p>
                  <p className="text-2xl font-bold text-green-600">{dashboardStats.totalStock}</p>
                </div>
                <Package className="w-8 h-8 text-green-400 opacity-50" />
              </div>
            </div>
            <div className="bg-white rounded-xl p-4 shadow-sm border-l-4 border-purple-500">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-gray-500">Total Production Capacity</p>
                  <p className="text-2xl font-bold text-purple-600">{dashboardStats.totalProductionCapacity}</p>
                </div>
                <Factory className="w-8 h-8 text-purple-400 opacity-50" />
              </div>
              <p className="text-xs text-gray-500 mt-1">units can be produced</p>
            </div>
            <div className="bg-white rounded-xl p-4 shadow-sm border-l-4 border-orange-500">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-gray-500">Low Production</p>
                  <p className="text-2xl font-bold text-orange-600">{dashboardStats.lowProductionCount}</p>
                </div>
                <AlertTriangle className="w-8 h-8 text-orange-400 opacity-50" />
              </div>
              <p className="text-xs text-orange-600 mt-1">&lt; 10 units possible</p>
            </div>
            <div className="bg-white rounded-xl p-4 shadow-sm border-l-4 border-red-500">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-gray-500">Cannot Produce</p>
                  <p className="text-2xl font-bold text-red-600">{dashboardStats.criticalStockCount}</p>
                </div>
                <XCircle className="w-8 h-8 text-red-400 opacity-50" />
              </div>
              <p className="text-xs text-red-600 mt-1">Missing parts</p>
            </div>
          </div>
        )}

        {/* Content Area */}
        <div className="">
          {loading ? (
            <div className="flex justify-center items-center py-12">
              <LoaderCircle className="w-12 h-12 text-blue-400 animate-spin" />
            </div>
          ) : (
            <>
              {selectedType && selectedWatts && (
                <>
                  {/* Search and Filter Bar */}
                  <div className="p-4 border-b border-gray-200">
                    <div className="flex flex-col sm:flex-row gap-3">
                      <div className="flex-1 relative">
                        <input
                          type="text"
                          placeholder="🔍 Search watts..."
                          value={searchWatts}
                          onChange={(e) => setSearchWatts(e.target.value)}
                          className="w-full px-4 py-2.5 pl-10 pr-10 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-gray-50 hover:bg-white transition-all"
                        />
                        <Search className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
                        {searchWatts && (
                          <button onClick={() => setSearchWatts('')} className="absolute right-3 top-2.5 text-gray-400 hover:text-gray-600">
                            <X className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                      <div className="flex gap-2 flex-wrap">
                        <button
                          onClick={() => setSelectedFilter('all')}
                          className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                            selectedFilter === 'all' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                          }`}
                        >
                          All
                        </button>
                        <button
                          onClick={() => setSelectedFilter('low-stock')}
                          className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                            selectedFilter === 'low-stock' ? 'bg-orange-600 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                          }`}
                        >
                          <span className="flex items-center gap-1">
                            <AlertTriangle className="w-3 h-3" />
                            Low Production
                          </span>
                        </button>
                        <button
                          onClick={() => setSelectedFilter('out-of-stock')}
                          className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                            selectedFilter === 'out-of-stock' ? 'bg-red-600 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                          }`}
                        >
                          <span className="flex items-center gap-1">
                            <XCircle className="w-3 h-3" />
                            Cannot Produce
                          </span>
                        </button>
                        <button
                          onClick={() => setDashboardView(!dashboardView)}
                          className="px-4 py-2 rounded-lg text-sm font-medium bg-gray-100 text-gray-600 hover:bg-gray-200 transition-all"
                          title={dashboardView ? 'Switch to Table View' : 'Switch to Dashboard View'}
                        >
                          {dashboardView ? <Eye className="w-4 h-4" /> : <Package className="w-4 h-4" />}
                        </button>
                      </div>
                    </div>
                    {searchWatts && (
                      <div className="mt-2 text-xs text-gray-500">
                        Found {filteredWatts.length} result{filteredWatts.length !== 1 ? 's' : ''}
                      </div>
                    )}
                  </div>

                  {/* Production Dashboard Card View */}
                  {dashboardView && (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-4">
                      {filteredWatts.map((watt, index) => {
                        const productionCapacity = calculateProductionCapacity(watt)
                        const stockStatus = getStockStatus(watt)
                        const StatusIcon = stockStatus.icon
                        const isProductionPossible = productionCapacity.maxProducts > 0
                        
                        return (
                          <div key={index} className={`bg-white rounded-xl border-2 shadow-sm hover:shadow-md transition-all overflow-hidden ${
                            !isProductionPossible ? 'border-red-200 bg-red-50/30' : 
                            productionCapacity.maxProducts < 10 ? 'border-orange-200' : 'border-green-200'
                          }`}>
                            {/* Header */}
                            <div className={`px-4 py-3 ${stockStatus.color.replace('text-', 'bg-').replace('700', '50')} border-b`}>
                              <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                  <Zap className="w-5 h-5 text-yellow-500" />
                                  <span className="font-bold text-lg">{watt.watts}</span>
                                </div>
                                <span className={`px-2 py-1 text-xs rounded-full ${stockStatus.color}`}>
                                  {stockStatus.label}
                                </span>
                              </div>
                            </div>
                            
                            <div className="p-4">
                              {/* Production Capacity Highlight */}
                              <div className="mb-4 p-3 rounded-lg bg-gradient-to-r from-purple-50 to-blue-50">
                                <div className="flex items-center justify-between">
                                  <div className="flex items-center gap-2">
                                    <Factory className="w-5 h-5 text-purple-600" />
                                    <span className="text-sm font-medium text-gray-700">Production Capacity:</span>
                                  </div>
                                  <div className="text-right">
                                    <span className={`text-2xl font-bold ${
                                      productionCapacity.maxProducts === 0 ? 'text-red-600' :
                                      productionCapacity.maxProducts < 10 ? 'text-orange-600' : 'text-green-600'
                                    }`}>
                                      {productionCapacity.maxProducts}
                                    </span>
                                    <span className="text-sm text-gray-500"> units</span>
                                  </div>
                                </div>
                                {productionCapacity.limitingPart && productionCapacity.maxProducts > 0 && (
                                  <p className="text-xs text-gray-500 mt-1">
                                    Limited by: <span className="font-medium">{productionCapacity.limitingPart}</span>
                                  </p>
                                )}
                                {productionCapacity.maxProducts === 0 && (
                                  <p className="text-xs text-red-600 mt-1">
                                    ⚠️ Missing required parts - cannot produce
                                  </p>
                                )}
                              </div>

                              {/* Parts Stock Levels */}
                              <div className="space-y-3">
                                <p className="text-xs font-medium text-gray-500 uppercase tracking-wider">Parts Stock:</p>
                                {selectedType.parts.map((part, pIndex) => {
                                  const quantity = watt.parts[pIndex]?.quantity || 0
                                  const requiredQty = part.quantity || 1
                                  const possibleProducts = Math.floor(quantity / requiredQty)
                                  const isLimiting = productionCapacity.limitingPart === part.partsName
                                  
                                  return (
                                    <div key={pIndex} className="space-y-1">
                                      <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-2">
                                          <div className={`w-2 h-2 rounded-full ${
                                            possibleProducts === 0 ? 'bg-red-500' : 
                                            possibleProducts < 10 ? 'bg-orange-500' : 'bg-green-500'
                                          }`}></div>
                                          <span className={`text-sm ${isLimiting ? 'font-bold text-purple-700' : 'text-gray-600'}`}>
                                            {part.partsName}
                                            {isLimiting && <span className="ml-1 text-xs text-purple-500">(Limiting)</span>}
                                          </span>
                                        </div>
                                        <div className="text-right">
                                          <span className={`text-sm font-medium ${
                                            possibleProducts === 0 ? 'text-red-600' : 
                                            possibleProducts < 10 ? 'text-orange-600' : 'text-gray-800'
                                          }`}>
                                            {quantity} / {requiredQty}
                                          </span>
                                          <span className="text-xs text-gray-400 ml-1">
                                            → {possibleProducts} units
                                          </span>
                                        </div>
                                      </div>
                                      <div className="w-full bg-gray-200 rounded-full h-1.5">
                                        <div 
                                          className={`h-1.5 rounded-full ${
                                            possibleProducts === 0 ? 'bg-red-500' : 
                                            possibleProducts < 10 ? 'bg-orange-500' : 'bg-green-500'
                                          }`}
                                          style={{ width: `${Math.min(100, (quantity / requiredQty / 50) * 100)}%` }}
                                        />
                                      </div>
                                    </div>
                                  )
                                })}
                              </div>
                              
                              {/* Action Buttons */}
                              <div className="flex gap-2 mt-4 pt-3 border-t border-gray-100">
                                <button 
                                  onClick={() => { setShowUpdateForm(true); getId(watt._id, index, 'add'); setGetWatt(watt.watts)}} 
                                  className="flex-1 bg-blue-500 hover:bg-blue-600 text-white py-2 rounded-lg text-sm font-medium transition-all flex items-center justify-center gap-1"
                                >
                                  <PlusSquare className="w-4 h-4" />
                                  Add Stock
                                </button>
                                <button 
                                  onClick={() => { setShowUpdateForm(true); getId(watt._id, index, 'subtract'); setGetWatt(watt.watts) }} 
                                  className="flex-1 bg-yellow-500 hover:bg-yellow-600 text-white py-2 rounded-lg text-sm font-medium transition-all flex items-center justify-center gap-1"
                                  disabled={productionCapacity.maxProducts === 0}
                                >
                                  <MinusSquareIcon className="w-4 h-4" />
                                  Remove
                                </button>
                                <button 
                                  onClick={() => {handleOnDelete(watt._id, watt.watts)}} 
                                  className="flex-1 bg-red-500 hover:bg-red-600 text-white py-2 rounded-lg text-sm font-medium transition-all flex items-center justify-center gap-1"
                                >
                                  <Trash2Icon className="w-4 h-4" />
                                  Delete
                                </button>
                              </div>
                            </div>
                          </div>
                        )
                      })}
                      
                      {filteredWatts.length === 0 && (
                        <div className="col-span-full text-center py-12">
                          <div className="inline-flex p-4 bg-gray-100 rounded-full mb-4">
                            <Factory className="w-8 h-8 text-gray-400" />
                          </div>
                          <h3 className="text-lg font-semibold text-gray-800 mb-2">
                            {searchWatts ? 'No Matching Watts' : 'No Watts Found'}
                          </h3>
                          <p className="text-gray-500 text-sm">
                            {searchWatts ? `No results found for "${searchWatts}"` : 'Add watt variants for this product type'}
                          </p>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Table View with Production Column */}
                  {!dashboardView && (
                    <div className="overflow-x-auto">
                      <table className="w-full text-sm">
                        <thead>
                          <tr className="border-b-2 border-t-2 border-gray-300 bg-gray-100">
                            <th className="px-4 py-3 text-center text-xs font-semibold text-black uppercase tracking-wider border-l-2 border-gray-300 sticky left-0 bg-gray-100 z-20 w-24">Watts</th>
                            {selectedType.parts.map((part, index) => (
                              <th key={index} className="px-4 py-3 border-l-2 border-gray-300 text-center text-xs font-semibold text-black uppercase tracking-wider">{part.partsName}</th>
                            ))}
                            <th className="px-4 py-3 border-l-2 border-gray-300 text-center text-xs font-semibold text-black uppercase tracking-wider bg-purple-50">
                              <div className="flex items-center justify-center gap-1">
                                <Factory className="w-3 h-3" />
                                Production
                              </div>
                            </th>
                            <th className="px-4 py-3 text-center border-l-2 border-r-2 border-gray-300 text-xs font-semibold text-black uppercase tracking-wider">Action</th>
                          </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                          {filteredWatts.map((watt, index) => {
                            const productionCapacity = calculateProductionCapacity(watt)
                            return (
                              <tr key={index} className={`hover:bg-blue-50/30 transition-colors ${index % 2 === 0 ? 'bg-white' : 'bg-gray-50/50'} ${productionCapacity.maxProducts === 0 ? 'bg-red-50/20' : productionCapacity.maxProducts < 10 ? 'bg-orange-50/20' : ''}`}>
                                <td className="px-4 py-3 whitespace-nowrap text-sm font-semibold text-gray-900 border-l-2 border-r-2 border-gray-300 text-center sticky left-0 bg-inherit z-10">
                                  <div className="flex items-center justify-center gap-2">
                                    <div className={`w-2 h-2 rounded-full ${
                                      productionCapacity.maxProducts === 0 ? 'bg-red-500' : 
                                      productionCapacity.maxProducts < 10 ? 'bg-orange-500' : 'bg-green-500'
                                    }`}></div>
                                    <span>{watt.watts}</span>
                                  </div>
                                </td>
                                {selectedType.parts.map((part, pIndex) => {
                                  const quantity = watt.parts[pIndex]?.quantity || 0
                                  const requiredQty = part.quantity || 1
                                  const possibleProducts = Math.floor(quantity / requiredQty)
                                  return (
                                    <td key={pIndex} className="px-3 whitespace-nowrap text-sm text-center border-l-2 border-r-2 border-gray-300">
                                      {quantity > 0 ? (
                                        <div className="flex flex-col items-center">
                                          <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                                            possibleProducts === 0 ? 'bg-red-100 text-red-800' :
                                            possibleProducts < 10 ? 'bg-orange-100 text-orange-800' : 'bg-green-100 text-green-800'
                                          }`}>
                                            {quantity} / {requiredQty}
                                          </span>
                                          <span className="text-xs text-gray-400 mt-0.5">→ {possibleProducts} units</span>
                                        </div>
                                      ) : (
                                        <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold bg-red-100 text-red-600">—</span>
                                      )}
                                     </td>
                                  )
                                })}
                                <td className="px-4 py-3 whitespace-nowrap text-center border-l-2 border-gray-300 bg-purple-50/50">
                                  <div className="flex flex-col items-center">
                                    <span className={`text-lg font-bold ${
                                      productionCapacity.maxProducts === 0 ? 'text-red-600' :
                                      productionCapacity.maxProducts < 10 ? 'text-orange-600' : 'text-green-600'
                                    }`}>
                                      {productionCapacity.maxProducts}
                                    </span>
                                    <span className="text-xs text-gray-500">units</span>
                                    {productionCapacity.limitingPart && productionCapacity.maxProducts > 0 && (
                                      <span className="text-xs text-gray-400">(Limited by {productionCapacity.limitingPart})</span>
                                    )}
                                  </div>
                                </td>
                                <td className="px-4 py-3 w-28 whitespace-nowrap text-sm font-semibold text-gray-900 border-l-2 border-r-2 border-gray-300">
                                  <div className="flex items-center justify-center gap-1">
                                    <button onClick={() => { setShowUpdateForm(true); getId(watt._id, index, 'add'); setGetWatt(watt.watts)}} className="bg-blue-100 p-1.5 rounded-lg hover:bg-blue-200 transition-all">
                                      <PlusSquare className="w-5 h-5 text-blue-600" />
                                    </button>
                                    <button onClick={() => { setShowUpdateForm(true); getId(watt._id, index, 'subtract'); setGetWatt(watt.watts) }} className="bg-yellow-100 p-1.5 rounded-lg hover:bg-yellow-200 transition-all">
                                      <MinusSquareIcon className="w-5 h-5 text-yellow-600" />
                                    </button>
                                    <button onClick={() => handleOnDelete(watt._id, watt.watts)} className="bg-red-100 p-1.5 rounded-lg hover:bg-red-200 transition-all">
                                      <Trash2Icon className="w-5 h-5 text-red-600" />
                                    </button>
                                  </div>
                                </td>
                              </tr>
                            )
                          })}
                          {filteredWatts.length === 0 && (
                            <tr>
                              <td colSpan={selectedType.parts.length + 3} className="px-4 py-8 text-center text-gray-500">
                                <div className="flex flex-col items-center gap-2">
                                  <Factory className="w-12 h-12 text-gray-300" />
                                  <span>{searchWatts ? 'No matching watts found' : 'No watts defined for this product type'}</span>
                                </div>
                               </td>
                              </tr>
                            )}
                          </tbody>
                        </table>
                      </div>
                    )}
                  </>
                )}

                {/* Empty States */}
                {!selectedType && lightTypes.length > 0 && (
                  <div className="text-center py-12">
                    <div className="inline-flex p-4 bg-blue-50 rounded-full mb-4">
                      <Factory className="w-8 h-8 text-blue-500" />
                    </div>
                    <h3 className="text-lg font-semibold text-gray-800 mb-2">Select a Product Type</h3>
                    <p className="text-gray-500 text-sm">Choose a product type from the dropdown above to view production capacity</p>
                  </div>
                )}

                {lightTypes.length === 0 && !loading && (
                  <div className="text-center py-12">
                    <div className="inline-flex p-4 bg-gray-100 rounded-full mb-4">
                      <Factory className="w-8 h-8 text-gray-400" />
                    </div>
                    <h3 className="text-lg font-semibold text-gray-800 mb-2">No Product Types Found</h3>
                    <p className="text-gray-500 text-sm mb-4">Get started by creating your first light type</p>
                    <button onClick={() => setTypeShowForm(true)} className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-2.5 rounded-xl font-medium shadow-md hover:shadow-lg transition-all">
                      Create Light Type
                    </button>
                  </div>
                )}
              </>
            )}
          </div>

          {/* Footer Stats with Production Summary */}
          {selectedType && selectedWatts && (
            <div className="px-4 py-3 bg-gray-50 border-t border-gray-200 text-xs text-gray-500 flex flex-wrap justify-between items-center gap-2">
              <span>Showing {filteredWatts.length} of {selectedWatts.length} watt variants</span>
              <div className="flex items-center gap-4 flex-wrap">
                <span className="flex items-center gap-1">
                  <div className="w-2 h-2 rounded-full bg-green-500"></div>
                  Good Production: {dashboardStats.goodProductionCount}
                </span>
                <span className="flex items-center gap-1">
                  <div className="w-2 h-2 rounded-full bg-orange-500"></div>
                  Low Production: {dashboardStats.lowProductionCount}
                </span>
                <span className="flex items-center gap-1">
                  <div className="w-2 h-2 rounded-full bg-red-500"></div>
                  Cannot Produce: {dashboardStats.criticalStockCount}
                </span>
                <span className="flex items-center gap-1 font-medium text-purple-600">
                  <Factory className="w-3 h-3" />
                  Total Production: {dashboardStats.totalProductionCapacity} units
                </span>
              </div>
            </div>
          )}
        </div>
      </>
    )
  }