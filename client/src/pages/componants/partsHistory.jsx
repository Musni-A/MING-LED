import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { 
  Package, 
  Calendar, 
  DollarSign,
  Zap,
  ChevronDown,
  ChevronUp,
  CheckCircle,
  AlertCircle,
  TrendingUp,
  Box,
  Layers,
  ChevronLeft,
  ChevronRight,
  ArrowLeft,
  Plus,
  Minus,
  RefreshCw,
  Filter
} from 'lucide-react';
import { getPartsHistory, getPartsHistoryByDate } from '../../api/partsHistory';

const PartsHistoryViewer = ({ setPartsHistoryViewerOpen }) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [expandedWatt, setExpandedWatt] = useState(null);
  const [filterType, setFilterType] = useState('add'); //'add', 'subtract'
  const [availableDates, setAvailableDates] = useState([]);

  // Fetch data for selected date
  const fetchData = async () => {
    setLoading(true);
    try {
      const response = await getPartsHistoryByDate(selectedDate);
      if (response.data.success) {
        setData(response.data.data);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
      setData(null);
    } finally {
      setLoading(false);
    }
  };

  // Fetch all available dates
  const fetchAvailableDates = async () => {
    try {
      const response = await getPartsHistory();
      if (response.data.success) {
        setAvailableDates(response.data.dates);
      }
    } catch (error) {
      console.error('Error fetching dates:', error);
    }
  };

  useEffect(() => {
    fetchData();
    fetchAvailableDates();
  }, [selectedDate]);

  // Filter data based on arithType
  const getFilteredData = () => {
    if (!data || !data.partsOfWatts) return [];
    if (filterType === 'all') {
      return data.partsOfWatts;
    }
    return data.partsOfWatts.filter(watt => watt.arithType === filterType);
  };

  const filteredWatts = getFilteredData();

  // Toggle expand/collapse
  const toggleExpand = (id) => {
    setExpandedWatt(expandedWatt === id ? null : id);
  };

  // Calculate total parts quantity for a watt
  const getTotalPartsQuantity = (parts) => {
    return parts.reduce((sum, part) => sum + part.quantity, 0);
  };

  // Get stock status color based on arithType
  const getStockStatus = (quantity, arithType) => {
    if (arithType === 'subtract') {
      return { color: 'text-blue-600', bg: 'bg-blue-50', label: 'Sold' };
    }
    if (quantity === 0) return { color: 'text-red-600', bg: 'bg-red-50', label: 'Critical' };
    if (quantity < 10) return { color: 'text-orange-600', bg: 'bg-orange-50', label: 'Low' };
    if (quantity < 50) return { color: 'text-yellow-600', bg: 'bg-yellow-50', label: 'Medium' };
    return { color: 'text-green-600', bg: 'bg-green-50', label: 'Good' };
  };

  // Calculate statistics based on filtered data
  const stats = {
    totalWatts: filteredWatts.length,
    totalParts: filteredWatts.reduce((sum, watt) => sum + (watt.parts?.length || 0), 0),
    totalComponents: filteredWatts.reduce((sum, watt) => sum + getTotalPartsQuantity(watt.parts || []), 0),
    totalValue: filteredWatts.reduce((sum, watt) => sum + (watt.price || 0), 0),
    addCount: data?.partsOfWatts?.filter(w => w.arithType === 'add').length || 0,
    subtractCount: data?.partsOfWatts?.filter(w => w.arithType === 'subtract').length || 0
  };

  // Navigate to previous/next date
  const goToPreviousDate = () => {
    const currentIndex = availableDates.indexOf(selectedDate);
    if (currentIndex > 0) {
      setSelectedDate(availableDates[currentIndex - 1]);
      setExpandedWatt(null);
      setFilterType('all');
    }
  };
  
  const goToNextDate = () => {
    const currentIndex = availableDates.indexOf(selectedDate);
    if (currentIndex < availableDates.length - 1) {
      setSelectedDate(availableDates[currentIndex + 1]);
      setExpandedWatt(null);
      setFilterType('all');
    }
  };

  // Format date for display
  const formatDate = (dateString) => {
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('en-US', options);
  };

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-slate-50 to-slate-100">
      <div className=" mx-auto px-4 py-2">
        
        {/* Header */}
        <div className="mb-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div className='flex items-center gap-3'>
              <div>
                <button
                  onClick={() => setPartsHistoryViewerOpen(false)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    padding: '10px 18px',
                    backgroundColor: '#fff',
                    border: '1px solid #e2e8f0',
                    borderRadius: '12px',
                    cursor: 'pointer',
                    fontSize: '14px',
                    fontWeight: 500,
                    color: '#475569',
                    transition: 'all 0.2s',
                    boxShadow: '0 1px 2px rgba(0,0,0,0.05)',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = '#f1f5f9';
                    e.currentTarget.style.transform = 'translateX(-2px)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = '#fff';
                    e.currentTarget.style.transform = 'translateX(0)';
                  }}
                >
                  <ArrowLeft size={18} />
                  Back
                </button>
              </div>
              <div>
                <h1 className="text-3xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                  Parts History
                </h1>
                <p className="text-slate-500 mt-1">View parts added (add) and removed (subtract)</p>
              </div>
            </div>
            
            {/* Date Selector */}
            <div className="flex items-center gap-3">
              <button
                onClick={goToPreviousDate}
                disabled={availableDates.indexOf(selectedDate) === 0 || availableDates.length === 0}
                className="p-2 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
              >
                <ChevronLeft className="w-4 h-4 text-slate-600" />
              </button>
              
              <div className="relative">
                <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-indigo-500" />
                <input
                  type="date"
                  value={selectedDate}
                  onChange={(e) => {
                    setSelectedDate(e.target.value);
                    setExpandedWatt(null);
                    setFilterType('all');
                  }}
                  className="pl-10 pr-4 py-2 bg-white border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 font-medium text-slate-700"
                />
              </div>
              
              <button
                onClick={goToNextDate}
                disabled={availableDates.indexOf(selectedDate) === availableDates.length - 1 || availableDates.length === 0}
                className="p-2 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
              >
                <ChevronRight className="w-4 h-4 text-slate-600" />
              </button>
              
              <button
                onClick={fetchData}
                className="p-2 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 transition-all"
                title="Refresh"
              >
                <RefreshCw className="w-4 h-4 text-slate-600" />
              </button>
            </div>
          </div>
          
          {/* Filter Buttons */}
          <div className="flex gap-3 mt-4">
            <button
              onClick={() => setFilterType('add')}
              className={`px-4 py-2 rounded-lg font-medium transition-all flex items-center gap-2 ${
                filterType === 'add'
                  ? 'bg-emerald-600 text-white shadow-md'
                  : 'bg-white text-slate-600 hover:bg-slate-50 border border-slate-200'
              }`}
            >
              <Plus className="w-4 h-4" />
              add (Add) ({stats.addCount})
            </button>
            <button
              onClick={() => setFilterType('subtract')}
              className={`px-4 py-2 rounded-lg font-medium transition-all flex items-center gap-2 ${
                filterType === 'subtract'
                  ? 'bg-rose-600 text-white shadow-md'
                  : 'bg-white text-slate-600 hover:bg-slate-50 border border-slate-200'
              }`}
            >
              <Minus className="w-4 h-4" />
              subtract (Remove) ({stats.subtractCount})
            </button>
          </div>
          
          {/* Date Display Banner */}
          {data && (
            <div className="mt-4 bg-gradient-to-r from-indigo-50 to-purple-50 rounded-xl p-3 border border-indigo-100">
              <div className="flex items-center justify-between flex-wrap gap-2">
                <div className="flex items-center gap-2">
                  <Calendar className="w-5 h-5 text-indigo-600" />
                  <span className="font-semibold text-indigo-800">{formatDate(selectedDate)}</span>
                </div>
                <div className="text-sm text-indigo-600">
                  {filteredWatts.length} watt variants • {stats.totalParts} part types
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Loading State */}
        {loading && (
          <div className="flex justify-center items-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
          </div>
        )}

        {/* Stats Cards */}
        {!loading && data && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-sm hover:shadow-md transition-all">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-500">Total Watts</p>
                  <p className="text-2xl font-bold text-slate-800">{stats.totalWatts}</p>
                </div>
                <div className="w-10 h-10 bg-indigo-50 rounded-lg flex items-center justify-center">
                  <Zap className="w-5 h-5 text-indigo-600" />
                </div>
              </div>
            </div>
            
            <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-sm hover:shadow-md transition-all">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-500">Total Part Types</p>
                  <p className="text-2xl font-bold text-slate-800">{stats.totalParts}</p>
                </div>
                <div className="w-10 h-10 bg-purple-50 rounded-lg flex items-center justify-center">
                  <Layers className="w-5 h-5 text-purple-600" />
                </div>
              </div>
            </div>
            
            <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-sm hover:shadow-md transition-all">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-500">Total Components</p>
                  <p className="text-2xl font-bold text-slate-800">{stats.totalComponents.toLocaleString()}</p>
                </div>
                <div className="w-10 h-10 bg-emerald-50 rounded-lg flex items-center justify-center">
                  <Box className="w-5 h-5 text-emerald-600" />
                </div>
              </div>
            </div>
            
            <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-sm hover:shadow-md transition-all">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-500">Total Value</p>
                  <p className="text-2xl font-bold text-emerald-600">${(stats.totalValue * stats.totalComponents).toLocaleString()}</p>
                </div>
                <div className="w-10 h-10 bg-emerald-50 rounded-lg flex items-center justify-center">
                  <TrendingUp className="w-5 h-5 text-emerald-600" />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* No Data Message */}
        {!loading && (!data || filteredWatts.length === 0) && (
          <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center">
            <Package className="w-16 h-16 text-slate-300 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-slate-700 mb-2">No Data Available</h3>
            <p className="text-slate-400">No parts history found for {formatDate(selectedDate)}</p>
            <p className="text-slate-400 text-sm mt-2">Try selecting a different date or filter</p>
          </div>
        )}

        {/* Parts List */}
        {!loading && data && (
          <div className="space-y-4">
            {filteredWatts.map((watt) => {
              const isadd = watt.arithType === 'add';
              const headerBgClass = isadd 
                ? 'bg-gradient-to-br from-emerald-500 to-teal-600'
                : 'bg-gradient-to-br from-rose-500 to-red-600';
              
              return (
                <div key={watt._id} className="bg-white rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition-all">
                  
                  {/* Watt Header - Click to expand */}
                  <div 
                    className="px-6 py-4 cursor-pointer hover:bg-slate-50 transition-colors"
                    onClick={() => toggleExpand(watt._id)}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className={`w-12 h-12 rounded-xl ${headerBgClass} flex items-center justify-center`}>
                          {isadd ? (
                            <Plus className="w-6 h-6 text-white" />
                          ) : (
                            <Minus className="w-6 h-6 text-white" />
                          )}
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <h3 className="text-xl font-bold text-slate-800">{watt.watts}</h3>
                            <span className={`px-2 py-0.5 rounded-full text-xs font-medium border ${
                              isadd 
                                ? 'bg-emerald-100 text-emerald-700 border-emerald-200'
                                : 'bg-rose-100 text-rose-700 border-rose-200'
                            }`}>
                              {isadd ? 'ADDED' : 'REMOVED'}
                            </span>
                          </div>
                          <div className="flex items-center gap-3 mt-1">
                            <span className="text-sm text-slate-500">{watt.typeName}</span>
                            <span className="text-sm font-semibold text-green-600 flex items-center gap-1">
                              <DollarSign className="w-3 h-3" /> {watt.price}
                            </span>
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-6">
                        <div className="text-right">
                          <div className="text-sm text-slate-400">Part Types</div>
                          <div className="font-semibold text-slate-700">{watt.parts?.length || 0}</div>
                        </div>
                        <div className="text-right">
                          <div className="text-sm text-slate-400">{isadd ? 'Added' : 'Removed'}</div>
                          <div className={`font-semibold ${isadd ? 'text-emerald-600' : 'text-rose-600'}`}>
                            {getTotalPartsQuantity(watt.parts || [])} units
                          </div>
                        </div>
                        {expandedWatt === watt._id ? (
                          <ChevronUp className="w-5 h-5 text-slate-400" />
                        ) : (
                          <ChevronDown className="w-5 h-5 text-slate-400" />
                        )}
                      </div>
                    </div>
                  </div>
                  
                  {/* Expanded Details */}
                  {expandedWatt === watt._id && (
                    <div className="border-t border-slate-100 px-6 py-4 bg-slate-50/30">
                      <h4 className="font-semibold text-slate-700 mb-3 flex items-center gap-2">
                        <Package className="w-4 h-4" />
                        {isadd ? 'Components Added to Inventory' : 'Components Removed from Inventory'}
                      </h4>
                      
                      <div className="overflow-x-auto">
                        <table className="w-full">
                          <thead>
                            <tr className="border-b border-slate-200">
                              <th className="text-left py-3 text-sm font-semibold text-slate-600">Component Name</th>
                              <th className="text-left py-3 text-sm font-semibold text-slate-600">Quantity</th>
                              <th className="text-left py-3 text-sm font-semibold text-slate-600">Status</th>
                              <th className="text-left py-3 text-sm font-semibold text-slate-600">Progress</th>
                            </tr>
                          </thead>
                          <tbody>
                            {watt.parts?.map((part, idx) => {
                              const status = getStockStatus(part.quantity, watt.arithType);
                              const percentage = Math.min(100, (part.quantity / 100) * 100);
                              
                              return (
                                <tr key={idx} className="border-b border-slate-100 hover:bg-white/50 transition-colors">
                                  <td className="py-3 font-medium text-slate-700">{part.partsName}</td>
                                  <td className={`py-3 font-semibold ${isadd ? 'text-emerald-600' : 'text-rose-600'}`}>
                                    {isadd ? '+' : '-'}{part.quantity} units
                                  </td>
                                  <td className="py-3">
                                    <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${status.bg} ${status.color}`}>
                                      {status.label === 'Good' || status.label === 'Sold' ? (
                                        <CheckCircle className="w-3 h-3" />
                                      ) : (
                                        <AlertCircle className="w-3 h-3" />
                                      )}
                                      {status.label}
                                    </span>
                                  </td>
                                  <td className="py-3">
                                    <div className="flex items-center gap-2">
                                      <div className="w-32 bg-slate-200 rounded-full h-2">
                                        <div 
                                          className="h-2 rounded-full transition-all"
                                          style={{ 
                                            width: `${percentage}%`,
                                            backgroundColor: isadd ? '#10b981' : '#f43f5e'
                                          }}
                                        />
                                      </div>
                                      <span className="text-xs text-slate-500">{Math.round(percentage)}%</span>
                                    </div>
                                  </td>
                                </tr>
                              );
                            })}
                          </tbody>
                        </table>
                      </div>
                      
                      {/* Footer note */}
                      <div className="mt-4 pt-3 border-t border-slate-200 text-xs text-slate-400 flex items-center justify-between">
                        <span>Total {isadd ? 'Added' : 'Removed'}: {getTotalPartsQuantity(watt.parts || [])} units</span>
                        <span className="text-indigo-500">Click to collapse ↑</span>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
        
        {/* Footer */}
        {!loading && data && filteredWatts.length > 0 && (
          <div className="mt-8 text-center text-sm text-slate-400">
            <p>Parts {filterType === 'subtract' ? 'removed' : filterType === 'add' ? 'added' : 'transactions'} for {formatDate(selectedDate)} • {stats.totalWatts} watt variants • {stats.totalParts} part types</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default PartsHistoryViewer;