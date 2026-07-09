import { useEffect, useState } from "react"
import LightTypeForm from "./lightTypeForm"
import { getLightType, deleteLightType } from "../../api/lightTypeAPI"
import toast from "react-hot-toast"
import LightWatts from "./lightWattsForm"
import UpdateForm from "./updateForm"
import { deleteLightWatts, getLightWatts } from "../../api/lightAPI"
import {
  PlusSquare, Plus, MinusSquareIcon, BookmarkPlus, LoaderCircle,
  Trash2Icon, Search, X, AlertTriangle, Package, CheckCircle,
  XCircle, Eye, Factory, Gauge, Zap, ChevronDown, LayoutGrid,
  Table2, TrendingUp, Settings2, AlertCircle, DollarSign,
  History
} from 'lucide-react';

const TRANSLATIONS = {
  deleteWatts:          "Delete Watts Variant",
  deleteType:           "Delete Light Type",
  deleteConfirmPrefix:  "Are you sure you want to permanently delete ",
  deleteConfirmSuffix:  "? This action is irreversible.",
  cancel:               "Cancel",
  yesDelete:            "Yes, Delete",
  deleting:             "Deleting...",
};

export default function PartsList({setPartsHistoryViewerOpen ,partsHistoryViewerOpen}) {
  const [showTypeForm,    setTypeShowForm]    = useState(false);
  const [showForm,        setShowForm]        = useState(false);
  const [showUpdateForm,  setShowUpdateForm]  = useState(false);
  const [lightTypes,      setLightTypes]      = useState([]);
  const [lightWatts,      setLightWatts]      = useState([]);
  const [selectedType,    setSelectedType]    = useState(null);
  const [typeId,          setTypeId]          = useState(null);
  const [selectedWatts,   setSelectedWatts]   = useState(null);
  const [selectedWattsId, setSelectedWattsId] = useState(null);
  const [arithType,       setArithType]       = useState(null);
  const [getIndex,        setGetIndex]        = useState(null);
  const [loading,         setLoading]         = useState(true);
  const [lastSelectedTypeName, setLastSelectedTypeName] = useState(null);
  const [searchWatts,     setSearchWatts]     = useState('');
  const [dashboardView,   setDashboardView]   = useState(true);
  const [selectedFilter,  setSelectedFilter]  = useState('all');
  const [getWatt,         setGetWatt]         = useState('');

  // Delete modal states (same as UserList)
  const [isDeletingWatts, setIsDeletingWatts] = useState(null);
  const [isDeletingType,  setIsDeletingType]  = useState(null);
  const [deleteId,        setDeleteId]        = useState(null);

  const fetchData = async () => {
    try {
      const typesRes = await getLightType();
      setLightTypes(typesRes.data);
      const wattsRes = await getLightWatts();
      setLightWatts(wattsRes.data);
      if (lastSelectedTypeName) {
        const type  = typesRes.data.find(t => t.typeName === lastSelectedTypeName);
        const watts = wattsRes.data.filter(w => w.typeName === lastSelectedTypeName);
        if (type) { setSelectedType(type); setSelectedWatts(watts); }
      }
    } catch (err) {
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchData(); }, []);

  // ── Calculation helpers ────────────────────────────────────────────────────
  const calculateProductionCapacity = (watts) => {
    if (!watts?.parts || !selectedType?.parts) return { maxProducts: 0, limitingPart: null, productsByPart: {} };
    let minProducts = Infinity, limitingPart = null, productsByPart = {};
    selectedType.parts.forEach((part, i) => {
      const available = watts.parts[i]?.quantity || 0;
      const required  = part.quantity || 1;
      const possible  = Math.floor(available / required);
      productsByPart[part.partsName] = possible;
      if (possible < minProducts) { minProducts = possible; limitingPart = part.partsName; }
    });
    return { maxProducts: minProducts === Infinity ? 0 : minProducts, limitingPart, productsByPart };
  };

  const getStockStatus = (watts) => {
    const { maxProducts } = calculateProductionCapacity(watts);
    if (maxProducts === 0)   return { label:'Cannot Produce', color:'text-red-700 bg-red-50 border-red-200',   dot:'bg-red-500',    border:'border-red-200',    headerBg:'from-red-50 to-red-50/50',   icon: XCircle,       priority:1 };
    if (maxProducts < 10)    return { label:'Low Production',  color:'text-orange-700 bg-orange-50 border-orange-200', dot:'bg-orange-500', border:'border-orange-200', headerBg:'from-orange-50 to-orange-50/50', icon: AlertTriangle,  priority:2 };
    return                          { label:'Good Production', color:'text-green-700 bg-green-50 border-green-200',  dot:'bg-green-500',  border:'border-green-200',  headerBg:'from-green-50 to-green-50/50',   icon: CheckCircle,   priority:3 };
  };

  const dashboardStats = {
    totalTypes:             lightTypes.length,
    totalWatts:             selectedWatts?.length || 0,
    totalStock:             selectedWatts?.reduce((s, w) => s + (w.parts?.reduce((a, p) => a + (p?.quantity||0), 0)||0), 0) || 0,
    totalProductionCapacity:selectedWatts?.reduce((s, w) => s + calculateProductionCapacity(w).maxProducts, 0) || 0,
    criticalStockCount:     selectedWatts?.filter(w => calculateProductionCapacity(w).maxProducts === 0).length || 0,
    lowProductionCount:     selectedWatts?.filter(w => { const c = calculateProductionCapacity(w); return c.maxProducts > 0 && c.maxProducts < 10; }).length || 0,
    goodProductionCount:    selectedWatts?.filter(w => calculateProductionCapacity(w).maxProducts >= 10).length || 0,
  };

  const filteredWatts = (selectedWatts || [])
    .filter(w => {
      const cap = calculateProductionCapacity(w);
      if (selectedFilter === 'low-stock')   return cap.maxProducts > 0 && cap.maxProducts < 10;
      if (selectedFilter === 'out-of-stock') return cap.maxProducts === 0;
      return true;
    })
    .filter(w => w.watts.toString().includes(searchWatts));

  // ── Delete handlers (same pattern as UserList) ─────────────────────────────
  const confirmDeleteWatts = async (id) => {
    setDeleteId(id);
    try {
      await deleteLightWatts(id);
      toast.success("Watts variant deleted successfully!", { position:"top-right", duration:2000 });
      setIsDeletingWatts(null);
    } catch (err) {
      toast.error(err?.response?.data?.message || err?.message || "Failed to delete");
    } finally {
      await fetchData();
      setDeleteId(null);
    }
  };

  const confirmDeleteType = async (id) => {
    setDeleteId(id);
    try {
      await deleteLightType(id);
      toast.success("Light type deleted successfully!", { position:"top-right", duration:2000 });
      setIsDeletingType(null);
      setSelectedType(null);
      setSelectedWatts(null);
    } catch (err) {
      toast.error(err?.response?.data?.message || err?.message || "Failed to delete");
    } finally {
      await fetchData();
      setDeleteId(null);
    }
  };

  const handleTypeSelect = (type, watts) => {
    setSelectedType(type);
    setSelectedWatts(watts);
    setLastSelectedTypeName(type?.typeName || null);
    setSearchWatts('');
    setSelectedFilter('all');
  };

  const getId = (id, index, aType) => {
    setSelectedWattsId(id);
    setGetIndex(index);
    setArithType(aType);
  };

  return (
    <>
      {/* ── Modals ── */}
      {showTypeForm && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <LightTypeForm setTypeShowForm={setTypeShowForm} fetchData={fetchData} lightTypes={lightTypes} />
        </div>
      )}
      {showForm && (
        <div onClick={() => setShowForm(false)} className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div onClick={e => e.stopPropagation()} className="max-h-[90vh] overflow-y-auto w-full max-w-xl">
            <LightWatts setShowForm={setShowForm} showForm={showForm} fetchData={fetchData} lightWatts={lightWatts} lightTypes={lightTypes} handleTypeSelect={handleTypeSelect} />
          </div>
        </div>
      )}
      {showUpdateForm && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <UpdateForm getWatt={getWatt} setShowUpdateForm={setShowUpdateForm} fetchData={fetchData} selectedWattsId={selectedWattsId} arithType={arithType} getIndex={getIndex} selectedWatts={selectedWatts} selectedType={selectedType} />
        </div>
      )}

      {/* ── Delete Watts Modal (same as UserList) ── */}
      {isDeletingWatts && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          onClick={() => setIsDeletingWatts(null)}>
          <div onClick={e => e.stopPropagation()}
            className="bg-white rounded-2xl border border-slate-200 shadow-2xl p-6 max-w-sm w-full text-center">
            <div className="w-12 h-12 bg-red-50 text-red-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <AlertTriangle className="w-6 h-6 animate-pulse" />
            </div>
            <h3 className="font-bold text-slate-800 text-base mb-1">{TRANSLATIONS.deleteWatts}</h3>
            <p className="text-xs text-slate-400 leading-relaxed px-2 mb-6">
              {TRANSLATIONS.deleteConfirmPrefix}
              <span className="font-semibold text-slate-700">{isDeletingWatts.watts}W</span>
              {TRANSLATIONS.deleteConfirmSuffix}
            </p>
            <div className="flex items-center justify-center gap-3">
              <button onClick={() => setIsDeletingWatts(null)} disabled={deleteId !== null}
                className="px-4 py-2 rounded-xl text-slate-500 hover:bg-slate-100 text-xs font-bold transition-all disabled:opacity-50 cursor-pointer">
                {TRANSLATIONS.cancel}
              </button>
              <button onClick={() => confirmDeleteWatts(isDeletingWatts._id)} disabled={deleteId !== null}
                className="px-4 py-2 rounded-xl bg-red-600 hover:bg-red-700 text-white text-xs font-bold shadow-md transition-all flex items-center gap-2 cursor-pointer disabled:opacity-50">
                {deleteId === isDeletingWatts._id ? (
                  <><LoaderCircle className="w-3.5 h-3.5 animate-spin" />{TRANSLATIONS.deleting}</>
                ) : TRANSLATIONS.yesDelete}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── Delete Type Modal ── */}
      {isDeletingType && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          onClick={() => setIsDeletingType(null)}>
          <div onClick={e => e.stopPropagation()}
            className="bg-white rounded-2xl border border-slate-200 shadow-2xl p-6 max-w-sm w-full text-center">
            <div className="w-12 h-12 bg-red-50 text-red-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <AlertTriangle className="w-6 h-6 animate-pulse" />
            </div>
            <h3 className="font-bold text-slate-800 text-base mb-1">{TRANSLATIONS.deleteType}</h3>
            <p className="text-xs text-slate-400 leading-relaxed px-2 mb-6">
              {TRANSLATIONS.deleteConfirmPrefix}
              <span className="font-semibold text-slate-700">{isDeletingType.typeName}</span>
              {TRANSLATIONS.deleteConfirmSuffix}
            </p>
            <div className="flex items-center justify-center gap-3">
              <button onClick={() => setIsDeletingType(null)} disabled={deleteId !== null}
                className="px-4 py-2 rounded-xl text-slate-500 hover:bg-slate-100 text-xs font-bold transition-all disabled:opacity-50 cursor-pointer">
                {TRANSLATIONS.cancel}
              </button>
              <button onClick={() => confirmDeleteType(isDeletingType._id)} disabled={deleteId !== null}
                className="px-4 py-2 rounded-xl bg-red-600 hover:bg-red-700 text-white text-xs font-bold shadow-md transition-all flex items-center gap-2 cursor-pointer disabled:opacity-50">
                {deleteId === isDeletingType._id ? (
                  <><LoaderCircle className="w-3.5 h-3.5 animate-spin" />{TRANSLATIONS.deleting}</>
                ) : TRANSLATIONS.yesDelete}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── Main Container ── */}
      <div className="w-full max-w-full mx-auto">
        <div className="bg-white/80 backdrop-blur-md h-full">

          {/* Header */}
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 p-6 border-b border-slate-300 bg-gradient-to-b from-white to-slate-50/50">
            <div className="flex items-center gap-2.5">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-600 to-indigo-700 flex items-center justify-center shadow-lg shadow-blue-500/20 text-white">
                <Factory className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-xl font-bold bg-gradient-to-r from-slate-800 to-slate-900 bg-clip-text text-transparent">
                  Production Dashboard
                </h2>
                <p className="text-xs text-slate-400 mt-0.5 font-medium">
                  Track stock levels and production capacity
                </p>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              {/* Type selector */}
              <div className="relative flex-1 sm:flex-initial min-w-[220px]">
                <select
                  className="w-full pl-4 pr-10 py-2.5 bg-slate-100/80 hover:bg-white focus:bg-white text-sm rounded-xl outline-none text-slate-700 border border-transparent focus:border-blue-400 focus:ring-2 focus:ring-blue-100 transition-all shadow-inner appearance-none cursor-pointer font-medium"
                  onChange={e => {
                    const type  = lightTypes.find(t => t.typeName === e.target.value);
                    const watts = lightWatts.filter(w => w.typeName === e.target.value);
                    handleTypeSelect(type, watts);
                    setTypeId(type?._id);
                  }}
                  value={selectedType?.typeName || ""}
                >
                  <option value="">📦 Select product type...</option>
                  {lightTypes.map(type => (
                    <option key={type._id} value={type.typeName}>
                      {type.typeName} • {lightWatts.filter(w => w.typeName === type.typeName).length} variants
                    </option>
                  ))}
                </select>
                <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
              </div>

              {selectedType && (
                <button 
                  disabled
                  onClick={() => setIsDeletingType(selectedType)}
                  className="p-2.5 disabled:cursor-not-allowed rounded-xl bg-red-50 hover:bg-red-100 text-red-500 hover:text-red-600 border border-red-100 transition-all"
                  title="Delete this light type">
                  <Trash2Icon className="w-4 h-4" />
                </button>
              )}

              <button onClick={() => setShowForm(true)}
                className="bg-gradient-to-r from-blue-600 to-indigo-700 hover:from-blue-700 hover:to-indigo-800 text-white px-4 py-2.5 rounded-xl text-sm font-semibold shadow-lg shadow-blue-600/10 hover:shadow-blue-600/20 transition-all flex items-center gap-2 hover:scale-[1.02] cursor-pointer">
                <Plus className="w-4 h-4" />
                <span className="hidden sm:inline">New Watts</span>
              </button>
              <button onClick={() => setTypeShowForm(true)}
                className="bg-white border border-slate-200 hover:border-slate-300 hover:bg-slate-50 text-slate-700 px-4 py-2.5 rounded-xl text-sm font-semibold shadow-sm hover:shadow transition-all flex items-center gap-2 cursor-pointer">
                <BookmarkPlus className="w-4 h-4" />
                <span className="hidden sm:inline">New Type</span>
              </button>
              <button onClick={()=>{
                setPartsHistoryViewerOpen(true)
              }}>
                <History/>
              </button>
            </div>
          </div>

          {/* Stats Bar */}
          {selectedType && selectedWatts && (
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4 p-5 bg-gradient-to-r from-blue-50/50 to-purple-50/50 border-b border-slate-100">
              {[
                { label:"Total Variants",       value:dashboardStats.totalWatts,              color:"border-blue-500",   icon:<Gauge className="w-7 h-7 text-blue-300"  />, textColor:"text-gray-800"    },
                { label:"Total Stock (pcs)",     value:dashboardStats.totalStock,              color:"border-green-500",  icon:<Package className="w-7 h-7 text-green-300"/>, textColor:"text-green-600"   },
                { label:"Production Capacity",   value:dashboardStats.totalProductionCapacity, color:"border-purple-500", icon:<Factory className="w-7 h-7 text-purple-300"/>,textColor:"text-purple-600"  },
                { label:"Low Production",        value:dashboardStats.lowProductionCount,      color:"border-orange-500", icon:<AlertTriangle className="w-7 h-7 text-orange-300"/>,textColor:"text-orange-600"},
                { label:"Cannot Produce",        value:dashboardStats.criticalStockCount,      color:"border-red-500",    icon:<XCircle className="w-7 h-7 text-red-300"  />, textColor:"text-red-600"     },
              ].map(s => (
                <div key={s.label} className={`bg-white rounded-xl p-4 shadow-sm border-l-4 ${s.color}`}>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs text-gray-500 mb-1">{s.label}</p>
                      <p className={`text-2xl font-bold ${s.textColor}`}>{s.value}</p>
                    </div>
                    {s.icon}
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Filter & Search Bar */}
          {selectedType && selectedWatts && (
            <div className="px-6 py-3 border-b border-slate-100 bg-slate-50/20 flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-2 flex-wrap">
                {/* Filter pills */}
                {[
                  { key:'all',          label:'All',            count: selectedWatts.length },
                  { key:'out-of-stock', label:'Cannot Produce', count: dashboardStats.criticalStockCount },
                  { key:'low-stock',    label:'Low Production', count: dashboardStats.lowProductionCount  },
                ].map(f => (
                  <button key={f.key}
                    onClick={() => { setSelectedFilter(f.key); }}
                    className={`px-3 py-1.5 rounded-full text-xs font-semibold tracking-wide transition-all flex items-center gap-1.5 shrink-0 ${
                      selectedFilter === f.key
                        ? "bg-[#0d2145] text-white shadow-md"
                        : "bg-white text-slate-500 border border-slate-200/80 hover:bg-slate-50"
                    }`}>
                    {f.label}
                    <span className={`text-[10px] px-1.5 py-0.5 rounded-full ${selectedFilter === f.key ? "bg-white/20 text-white" : "bg-slate-100 text-slate-400"}`}>
                      {f.count}
                    </span>
                  </button>
                ))}

                {/* Search */}
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
                  <input
                    value={searchWatts}
                    onChange={e => setSearchWatts(e.target.value)}
                    placeholder="Search watts..."
                    className="bg-slate-100/80 focus:bg-white text-sm pl-9 pr-8 py-2 rounded-xl outline-none text-slate-700 placeholder:text-slate-400 border border-transparent focus:border-blue-400 focus:ring-2 focus:ring-blue-100 transition-all w-36"
                  />
                  {searchWatts && (
                    <button onClick={() => setSearchWatts('')}
                      className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600">
                      <X className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-[11px] font-medium text-slate-400">
                  Showing {filteredWatts.length} of {selectedWatts.length} variants
                </span>
                {/* View toggle */}
                <button onClick={() => setDashboardView(!dashboardView)}
                  className="p-2 rounded-lg bg-white border border-slate-200 text-slate-500 hover:bg-slate-50 transition-colors shadow-sm"
                  title={dashboardView ? 'Table View' : 'Card View'}>
                  {dashboardView ? <Table2 className="w-4 h-4" /> : <LayoutGrid className="w-4 h-4" />}
                </button>
              </div>
            </div>
          )}

          {/* Content */}
          <div>
            {loading ? (
              <div className="flex flex-col items-center justify-center py-20 gap-3">
                <LoaderCircle className="animate-spin text-blue-600" size={40} />
                <span className="text-sm font-semibold text-slate-500 animate-pulse">Loading production data...</span>
              </div>
            ) : (
              <>
                {/* Empty — no type selected */}
                {!selectedType && lightTypes.length > 0 && (
                  <div className="flex flex-col items-center justify-center py-20 text-center px-4">
                    <div className="w-16 h-16 rounded-full bg-blue-50 flex items-center justify-center mb-4 border border-blue-100">
                      <Factory className="w-7 h-7 text-blue-400" />
                    </div>
                    <h3 className="text-base font-bold text-slate-800">Select a Product Type</h3>
                    <p className="text-xs text-slate-400 max-w-[280px] mt-1 leading-relaxed">
                      Choose a product type from the dropdown above to view production capacity
                    </p>
                  </div>
                )}

                {/* Empty — no types at all */}
                {lightTypes.length === 0 && (
                  <div className="flex flex-col items-center justify-center py-20 text-center px-4">
                    <div className="w-16 h-16 rounded-full bg-slate-50 flex items-center justify-center mb-4 border border-slate-100">
                      <Factory className="w-7 h-7 text-slate-400" />
                    </div>
                    <h3 className="text-base font-bold text-slate-800">No Product Types Found</h3>
                    <p className="text-xs text-slate-400 max-w-[280px] mt-1 leading-relaxed">
                      Get started by creating your first light type
                    </p>
                    <button onClick={() => setTypeShowForm(true)}
                      className="mt-4 bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-xl text-xs font-bold shadow-md transition-all">
                      Create Light Type
                    </button>
                  </div>
                )}

                {/* Card View */}
                {selectedType && selectedWatts && dashboardView && (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-5">
                    {filteredWatts.map((watt, index) => {
                      const cap    = calculateProductionCapacity(watt);
                      const status = getStockStatus(watt);
                      return (
                        <div key={index}
                          className={`bg-white rounded-xl border-2 shadow-sm hover:shadow-md transition-all overflow-hidden ${status.border}`}>

                          {/* Card Header */}
                          <div className={`px-4 py-3 bg-gradient-to-r ${status.headerBg} border-b ${status.border} flex items-center justify-between`}>
                            <div className="flex items-center gap-2">
                              <Zap className="w-5 h-5 text-yellow-500" />
                              <span className="font-black text-xl text-slate-800">{watt.watts}</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <span className={`px-2.5 py-1 text-xs font-semibold rounded-full border ${status.color}`}>
                                {status.label}
                              </span>
                              {/* Delete button — same style as UserList */}
                              <button
                                disabled
                                onClick={() => setIsDeletingWatts(watt)}
                                className="text-red-400 disabled:cursor-not-allowed disabled:opacity-40 bg-white p-1.5 rounded-lg transition-all border border-slate-200"
                                title="Delete watts variant">
                                <Trash2Icon className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </div>

                          <div className="p-4">
                            {/* Production Capacity Highlight */}
                            <div className="mb-4 p-3 rounded-xl bg-gradient-to-r from-purple-50 to-blue-50 border border-purple-100/50">
                              <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                  <DollarSign className="w-4 h-4 text-purple-600" />
                                  <span className="text-xs font-semibold text-gray-600">Total value :-</span>
                                </div>
                                <div className="text-right">
                                  <span className={`text-2xl font-black ${
                                    cap.maxProducts === 0 ? 'text-red-600' :
                                    cap.maxProducts < 10  ? 'text-orange-600' : 'text-green-600'
                                  }`}>{cap.maxProducts*watt.price}</span>
                                  <span className="text-xs text-gray-400 ml-1">LKR</span>
                                </div>
                              </div>
                              <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                  <Factory className="w-4 h-4 text-purple-600" />
                                  <span className="text-xs font-semibold text-gray-600">Production Capacity :-</span>
                                </div>
                                <div className="text-right">
                                  <span className={`text-2xl font-black ${
                                    cap.maxProducts === 0 ? 'text-red-600' :
                                    cap.maxProducts < 10  ? 'text-orange-600' : 'text-green-600'
                                  }`}>{cap.maxProducts}</span>
                                  <span className="text-xs text-gray-400 ml-1">units</span>
                                </div>
                              </div>
                              {cap.limitingPart && cap.maxProducts > 0 && (
                                <p className="text-xs text-gray-400 mt-1">
                                  Limited by: <span className="font-semibold text-purple-700">{cap.limitingPart}</span>
                                </p>
                              )}
                              {cap.maxProducts === 0 && (
                                <p className="text-xs text-red-600 mt-1 flex items-center gap-1">
                                  <AlertCircle className="w-3 h-3" /> Missing required parts
                                </p>
                              )}
                            </div>

                            {/* Parts stock */}
                            <div className="space-y-2.5 mb-4">
                              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Parts Stock</p>
                              {selectedType.parts.map((part, pIndex) => {
                                const qty        = watt.parts[pIndex]?.quantity || 0;
                                const required   = part.quantity || 1;
                                const possible   = Math.floor(qty / required);
                                const isLimiting = cap.limitingPart === part.partsName;
                                return (
                                  <div key={pIndex} className="space-y-1">
                                    <div className="flex items-center justify-between">
                                      <div className="flex items-center gap-1.5">
                                        <div className={`w-2 h-2 rounded-full shrink-0 ${
                                          possible === 0 ? 'bg-red-500' : possible < 10 ? 'bg-orange-500' : 'bg-green-500'
                                        }`} />
                                        <span className={`text-xs ${isLimiting ? 'font-bold text-purple-700' : 'text-slate-600'}`}>
                                          {part.partsName}
                                          {isLimiting && <span className="ml-1 text-[10px] text-purple-400">(limiting)</span>}
                                        </span>
                                      </div>
                                      <span className={`text-xs font-semibold ${
                                        possible === 0 ? 'text-red-600' : possible < 10 ? 'text-orange-600' : 'text-slate-700'
                                      }`}>
                                        {qty} / {required}
                                        <span className="text-slate-400 font-normal ml-1">→ {possible}</span>
                                      </span>
                                    </div>
                                    <div className="w-full bg-slate-100 rounded-full h-1.5">
                                      <div className={`h-1.5 rounded-full transition-all ${
                                        possible === 0 ? 'bg-red-500' : possible < 10 ? 'bg-orange-500' : 'bg-green-500'
                                      }`} style={{ width:`${Math.min(100, (qty / required / 50) * 100)}%` }} />
                                    </div>
                                  </div>
                                );
                              })}
                            </div>

                            {/* Action Buttons */}
                            <div className="flex gap-2 pt-3 border-t border-slate-100">
                              <button
                                onClick={() => { setShowUpdateForm(true); getId(watt._id, index, 'add'); setGetWatt(watt.watts); }}
                                className="flex-1 text-blue-600 hover:bg-blue-50 border-2 border-blue-400 py-2 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1 shadow-sm">
                                <PlusSquare className="w-3.5 h-3.5" /> Add Stock
                              </button>
                              <button
                                onClick={() => { setShowUpdateForm(true); getId(watt._id, index, 'subtract'); setGetWatt(watt.watts); }}
                                disabled={cap.maxProducts === 0}
                                className="flex-1 border-2 border-amber-500 text-amber-600 disabled:text-amber-500 hover:bg-amber-50 disabled:opacity-40 disabled:cursor-not-allowed py-2 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1 shadow-sm">
                                <MinusSquareIcon className="w-3.5 h-3.5" /> Remove
                              </button>
                            </div>
                          </div>
                        </div>
                      );
                    })}

                    {filteredWatts.length === 0 && (
                      <div className="col-span-full flex flex-col items-center justify-center py-16 text-center">
                        <div className="w-14 h-14 rounded-full bg-slate-50 flex items-center justify-center mb-3 border border-slate-100">
                          <Factory className="w-6 h-6 text-slate-400" />
                        </div>
                        <h3 className="text-sm font-bold text-slate-700">No variants found</h3>
                        <p className="text-xs text-slate-400 mt-1">
                          {searchWatts ? `No results for "${searchWatts}"` : 'Add watt variants for this product type'}
                        </p>
                      </div>
                    )}
                  </div>
                )}

                {/* Table View */}
                {selectedType && selectedWatts && !dashboardView && (
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="bg-slate-50/50 border-b border-slate-100">
                          <th className="px-5 py-3.5 text-left text-xs font-bold text-slate-500 uppercase tracking-wider sticky left-0 bg-slate-50/50 z-10">Watts</th>
                          {selectedType.parts.map((part, i) => (
                            <th key={i} className="px-5 py-3.5 text-center text-xs font-bold text-slate-500 uppercase tracking-wider">{part.partsName}</th>
                          ))}
                          <th className="px-5 py-3.5 text-center text-xs font-bold text-purple-600 uppercase tracking-wider bg-purple-50/40">
                            <div className="flex items-center justify-center gap-1"><Factory className="w-3 h-3" /> Production</div>
                          </th>
                          <th className="px-5 py-3.5 text-center text-xs font-bold text-slate-500 uppercase tracking-wider">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100/60">
                        {filteredWatts.map((watt, index) => {
                          const cap = calculateProductionCapacity(watt);
                          return (
                            <tr key={index} className="hover:bg-slate-50/70 transition-colors group">
                              <td className="px-5 py-4 sticky left-0 bg-white group-hover:bg-slate-50/70 z-10">
                                <div className="flex items-center gap-2">
                                  <div className={`w-2 h-2 rounded-full ${cap.maxProducts === 0 ? 'bg-red-500' : cap.maxProducts < 10 ? 'bg-orange-500' : 'bg-green-500'}`} />
                                  <span className="font-bold text-slate-800">{watt.watts}</span>
                                </div>
                              </td>
                              {selectedType.parts.map((part, pIndex) => {
                                const qty      = watt.parts[pIndex]?.quantity || 0;
                                const required = part.quantity || 1;
                                const possible = Math.floor(qty / required);
                                return (
                                  <td key={pIndex} className="px-5 py-4 text-center">
                                    {qty > 0 ? (
                                      <div className="flex flex-col items-center gap-0.5">
                                        <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${
                                          possible === 0 ? 'bg-red-100 text-red-700' :
                                          possible < 10  ? 'bg-orange-100 text-orange-700' : 'bg-green-100 text-green-700'
                                        }`}>{qty} / {required}</span>
                                        <span className="text-[10px] text-slate-400">→ {possible} units</span>
                                      </div>
                                    ) : (
                                      <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-red-100 text-red-600">—</span>
                                    )}
                                  </td>
                                );
                              })}
                              <td className="px-5 py-4 text-center bg-purple-50/30">
                                <span className={`text-lg font-black ${
                                  cap.maxProducts === 0 ? 'text-red-600' : cap.maxProducts < 10 ? 'text-orange-600' : 'text-green-600'
                                }`}>{cap.maxProducts}</span>
                                <div className="text-[10px] text-slate-400">units</div>
                              </td>
                              <td className="px-5 py-4">
                                <div className="flex items-center justify-center gap-2">
                                  <button onClick={() => { setShowUpdateForm(true); getId(watt._id, index, 'add'); setGetWatt(watt.watts); }}
                                    className="text-slate-500 hover:text-blue-600 bg-slate-100 hover:bg-blue-50 p-2 rounded-lg transition-all cursor-pointer" title="Add stock">
                                    <PlusSquare className="w-3.5 h-3.5" />
                                  </button>
                                  <button onClick={() => { setShowUpdateForm(true); getId(watt._id, index, 'subtract'); setGetWatt(watt.watts); }}
                                    disabled={cap.maxProducts === 0}
                                    className="text-slate-500 hover:text-amber-600 bg-slate-100 hover:bg-amber-50 p-2 rounded-lg transition-all cursor-pointer disabled:opacity-40" title="Remove stock">
                                    <MinusSquareIcon className="w-3.5 h-3.5" />
                                  </button>
                                  {/* Same delete button style as UserList */}
                                  <button onClick={() => setIsDeletingWatts(watt)}
                                    className="text-slate-500 hover:text-red-600 bg-slate-100 hover:bg-red-50 p-2 rounded-lg transition-all cursor-pointer" title="Delete variant">
                                    <Trash2Icon className="w-3.5 h-3.5" />
                                  </button>
                                </div>
                              </td>
                            </tr>
                          );
                        })}
                        {filteredWatts.length === 0 && (
                          <tr>
                            <td colSpan={selectedType.parts.length + 3} className="px-4 py-12 text-center">
                              <Factory className="w-10 h-10 text-slate-300 mx-auto mb-2" />
                              <p className="text-sm text-slate-500">No matching variants found</p>
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                )}
              </>
            )}
          </div>

          {/* Footer */}
          {selectedType && selectedWatts && (
            <div className="px-6 py-4 bg-slate-50 border-t border-slate-100 flex flex-wrap items-center justify-between gap-2">
              <span className="text-xs font-semibold text-slate-400">
                Showing {filteredWatts.length} of {selectedWatts.length} watt variants
              </span>
              <div className="flex items-center gap-4 flex-wrap text-xs text-slate-500">
                <span className="flex items-center gap-1"><div className="w-2 h-2 rounded-full bg-green-500" /> Good: {dashboardStats.goodProductionCount}</span>
                <span className="flex items-center gap-1"><div className="w-2 h-2 rounded-full bg-orange-500" /> Low: {dashboardStats.lowProductionCount}</span>
                <span className="flex items-center gap-1"><div className="w-2 h-2 rounded-full bg-red-500" /> Critical: {dashboardStats.criticalStockCount}</span>
                <span className="flex items-center gap-1 font-semibold text-purple-600">
                  <Factory className="w-3 h-3" /> Total: {dashboardStats.totalProductionCapacity} units
                </span>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}