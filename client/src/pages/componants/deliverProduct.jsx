import React, { useState, useMemo, useEffect } from 'react';
import { RefreshCcw ,ArrowLeft, Search, Download, TrendingUp, TrendingDown, Package, Truck, Calendar, BarChart3, ChevronLeft, ChevronRight, Filter, X } from 'lucide-react';
import { getFinishingGoodsHistory } from '../../api/finishingGoodsHistory';
import { fetchLightWattsData } from '../commonFun/fetchData';
import { fetchFinishingGoodsHistoryData } from '../commonFun/fetchData';
import toast from 'react-hot-toast';

const WideTableComponent = ({ setShowDeliveryHistory, showDeliveryHistory }) => {
  const [finishingGoodsHistory, setFinishingGoodsHistory] = useState([]);
  const [lightWatts, setLightWatts] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [hoveredCol, setHoveredCol] = useState(null);
  const [hoveredRow, setHoveredRow] = useState(null);
  const [selectedDistributor, setSelectedDistributor] = useState('all');
  const [selectedArithType, setSelectedArithType] = useState('sale');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(15);

  useEffect(() => {
    fetchFinishingGoodsHistoryData(setLightWatts, toast, setFinishingGoodsHistory);
  }, []);

  // Get unique distributors for filter
  const distributors = useMemo(() => {
    const dists = ['all', ...new Set(finishingGoodsHistory.map(item => item.distributor).filter(Boolean))];
    return dists;
  }, [finishingGoodsHistory]);

  // Filter data
  const filteredData = useMemo(() => {
    return finishingGoodsHistory.filter((row) => {
      const matchesSearch = row.invoiceNumber?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           row.distributor?.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesDistributor = selectedDistributor === 'all' || row.distributor === selectedDistributor;
      const matchesArithType = selectedArithType === 'all' || row.arithType === selectedArithType;
      return matchesSearch && matchesDistributor && matchesArithType;
    });
  }, [finishingGoodsHistory, searchTerm, selectedDistributor, selectedArithType]);

  // Pagination
  const totalPages = Math.ceil(filteredData.length / itemsPerPage);
  const paginatedData = filteredData.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  // Get product quantity for a specific watt
  const getProductQuantity = (row, watt) => {
    const product = row.products?.find(p => p.watts === watt.watts && p.typeName === watt.typeName);
    return product ? product.quantity : 0;
  };

  // Get stock status color
  const getStockStatusColor = (quantity) => {
    if (quantity === 0) return { bg: '#fee2e2', color: '#dc2626', label: 'Out of Stock' };
    if (quantity < 10) return { bg: '#fed7aa', color: '#ea580c', label: 'Low Stock' };
    if (quantity < 50) return { bg: '#fef08a', color: '#ca8a04', label: 'Medium Stock' };
    return { bg: '#dcfce7', color: '#16a34a', label: 'Good Stock' };
  };

  // Calculate stats
  const stats = {
    totalInvoices: filteredData.length,
    totalProducts: filteredData.reduce((sum, row) => sum + (row.products?.length || 0), 0),
    totalQuantity: filteredData.reduce((sum, row) => 
      sum + (row.products?.reduce((s, p) => s + (p.quantity || 0), 0) || 0), 0),
    uniqueDistributors: new Set(filteredData.map(row => row.distributor)).size
  };

  // Reset pagination when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, selectedDistributor, selectedArithType]);

  // Export to CSV
  const exportToCSV = () => {
    const headers = ['Invoice Number', 'Distributor', 'Type', ...lightWatts.map(w => w.watts)];
    const rows = filteredData.map(row => [
      row.invoiceNumber,
      row.distributor,
      row.arithType,
      ...lightWatts.map(w => getProductQuantity(row, w))
    ]);
    
    const csvContent = [headers, ...rows].map(row => row.join(',')).join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `delivery-history-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);
    toast.success('Export completed!');
  };

  return (
    <div
      className={`${showDeliveryHistory === 'hidden' ? 'hidden' : 'block'}`}
      style={{
        padding: '24px',
        backgroundColor: '#f8fafc',
        minHeight: '100vh',
        fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
      }}
    >
      {/* Header Section */}
      <div style={{ marginBottom: '24px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px', marginBottom: '20px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <button
              onClick={() => setShowDeliveryHistory('hidden')}
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
            <div>
              <h1 style={{ margin: 0, fontSize: '24px', fontWeight: 700, color: '#0f172a' }}>
                Delivery History
              </h1>
              <p style={{ margin: '4px 0 0', fontSize: '13px', color: '#64748b' }}>
                Track product deliveries across all distributors
              </p>
            </div>
          </div>

          <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
            <div>
              <button
              onClick={()=>{fetchFinishingGoodsHistoryData(setLightWatts, toast, setFinishingGoodsHistory);}}
              className='border-2 p-1 border-blue-400 rounded-xl hover:bg-blue-100'>
                <RefreshCcw className='text-blue-500'/>
              </button>
            </div>
            {/* Search Box */}
            <div style={{ position: 'relative' }}>
              <Search size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
              <input
                type="text"
                placeholder="Search invoice or distributor..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                style={{
                  padding: '9px 12px 9px 38px',
                  border: '1px solid #e2e8f0',
                  borderRadius: '12px',
                  fontSize: '14px',
                  outline: 'none',
                  width: '260px',
                  backgroundColor: '#fff',
                  transition: 'all 0.2s',
                }}
                onFocus={(e) => e.currentTarget.style.borderColor = '#6366f1'}
                onBlur={(e) => e.currentTarget.style.borderColor = '#e2e8f0'}
              />
              {searchTerm && (
                <button
                  onClick={() => setSearchTerm('')}
                  style={{
                    position: 'absolute',
                    right: '10px',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer',
                    color: '#94a3b8',
                  }}
                >
                  <X size={14} />
                </button>
              )}
            </div>

            {/* Export Button */}
            <button
              onClick={exportToCSV}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                padding: '9px 18px',
                backgroundColor: '#4f46e5',
                border: 'none',
                borderRadius: '12px',
                cursor: 'pointer',
                fontSize: '14px',
                fontWeight: 500,
                color: '#fff',
                transition: 'all 0.2s',
                boxShadow: '0 1px 2px rgba(0,0,0,0.05)',
              }}
              onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#4338ca'}
              onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#4f46e5'}
            >
              <Download size={16} />
              Export CSV
            </button>
          </div>
        </div>

        {/* Filters */}
        <div style={{ display: 'flex', gap: '12px', marginBottom: '20px', flexWrap: 'wrap' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', backgroundColor: '#fff', padding: '4px 12px', borderRadius: '10px', border: '1px solid #e2e8f0' }}>
            <TrendingUp size={14} color="#64748b" />
            <select
              value={selectedArithType}
              onChange={(e) => {
                setSelectedArithType(e.target.value);
                if (e.target.value === 'restock') {
                  setSelectedDistributor('all');
                }
              }}
              style={{ padding: '8px 8px', border: 'none', outline: 'none', fontSize: '13px', backgroundColor: 'transparent', cursor: 'pointer' }}
            >
              <option value="restock">Restock</option>
              <option value="sale">Sale</option>
            </select>
          </div>
          { selectedArithType === 'sale' && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', backgroundColor: '#fff', padding: '4px 12px', borderRadius: '10px', border: '1px solid #e2e8f0' }}>
            <Filter size={14} color="#64748b" />
            <select
              value={selectedDistributor}
              onChange={(e) => setSelectedDistributor(e.target.value)}
              style={{ padding: '8px 8px', border: 'none', outline: 'none', fontSize: '13px', backgroundColor: 'transparent', cursor: 'pointer' }}
            >
              {distributors.map(dist => (
                <option key={dist} value={dist}>{dist === 'all' ? 'All Distributors' : dist}</option>
              ))}
            </select>
          </div>)}


          <div style={{ marginLeft: 'auto', fontSize: '13px', color: '#64748b', display: 'flex', alignItems: 'center', gap: '6px' }}>
            <Calendar size={14} />
            <span>Showing {paginatedData.length} of {filteredData.length} records</span>
          </div>
        </div>
      </div>

      {/* Table Container 1 */}
      <div
        style={{
          backgroundColor: '#fff',
          borderRadius: '16px',
          border: '1px solid #e2e8f0',
          boxShadow: '0 1px 3px rgba(0,0,0,0.04)',
          overflow: 'hidden',
        }}
      >
        <div style={{ overflowX: 'auto', maxWidth: '100%', maxHeight: 'calc(100vh - 320px)', position: 'relative' }}>
          <table style={{ 
  borderCollapse: 'separate', 
  borderSpacing: 0, 
  minWidth: 'max-content', 
  fontSize: '13px', 
  width: '100%',
  fontFamily: 'system-ui, -apple-system, sans-serif'
}}>
  <thead>
    <tr>
      {/* Fixed Column 1: Invoice Number */}
      <th
        className={selectedArithType === 'sale' ? '' : 'hidden'}
        style={{
          padding: '16px 20px',
          backgroundColor: '#f8fafc',
          position: 'sticky',
          left: 0,
          top: 0,
          zIndex: 4,
          minWidth: '120px',
          textAlign: 'left',
          fontWeight: 700,
          color: '#1e293b',
          borderBottom: '2px solid #e2e8f0',
          borderRight: '2px solid #e2e8f0',
          fontSize: '12px',
          textTransform: 'uppercase',
          letterSpacing: '0.05em',
        }}
      >
        <div className="flex items-center gap-2">
          <svg className="w-4 h-4 text-indigo-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          Invoice #
        </div>
      </th>
      
      {/* Fixed Column 2: Distributor */}
      <th
        className={selectedArithType === 'sale' ? '' : 'hidden'}
        style={{
          padding: '16px 20px',
          backgroundColor: '#f8fafc',
          position: 'sticky',
          left: '120px',
          top: 0,
          zIndex: 3,
          minWidth: '140px',
          textAlign: 'left',
          fontWeight: 700,
          color: '#1e293b',
          borderBottom: '2px solid #e2e8f0',
          borderRight: '2px solid #e2e8f0',
          fontSize: '12px',
          textTransform: 'uppercase',
          letterSpacing: '0.05em',
        }}
      >
        <div className="flex items-center gap-2">
          <svg className="w-4 h-4 text-indigo-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
          </svg>
          Distributor
        </div>
      </th>
      
      {/* Fixed Column 3: Date */}
      <th
        style={{
          padding: '16px 20px',
          backgroundColor: '#f8fafc',
          position: 'sticky',
          left: selectedArithType === 'sale' ? '260px' : '0px',
          top: 0,
          zIndex: 3,
          minWidth: '120px',
          fontWeight: 700,
          color: '#1e293b',
          borderBottom: '2px solid #e2e8f0',
          borderRight: '2px solid #e2e8f0',
          fontSize: '12px',
          textTransform: 'uppercase',
          letterSpacing: '0.05em',
          textAlign: 'left',
        }}
      >
        <div className="flex items-center gap-2">
          <svg className="w-4 h-4 text-indigo-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
          Date
        </div>
      </th>
      
      {/* Dynamic Watt Columns */}
      {lightWatts.map((watts, idx) => (
        <th 
          className={`hover:bg-indigo-50 cursor-pointer transition-colors ${watts.watts === 'All watts' ? 'hidden' : ''}`}
          key={idx}
          onMouseEnter={() => setHoveredCol(idx)}
          onMouseLeave={() => setHoveredCol(null)}
          style={{
            padding: '16px 12px',
            backgroundColor: hoveredCol === idx ? '#eef2ff' : '#f8fafc',
            whiteSpace: 'nowrap',
            fontWeight: 700,
            color: '#1e293b',
            borderBottom: '2px solid #e2e8f0',
            position: 'sticky',
            top: 0,
            zIndex: 1,
            minWidth: '100px',
            textAlign: 'center',
            transition: 'all 0.2s ease',
            fontSize: '13px',
          }}
        >
          <div className="flex flex-col items-center gap-1">
            <span className="bg-gradient-to-r from-indigo-600 to-indigo-700 bg-clip-text text-transparent font-black text-base">
              {watts.watts}
            </span>
            <span className="text-[10px] font-medium text-slate-400 uppercase tracking-wider">
              {watts.typeName}
            </span>
          </div>
        </th>
      ))}
    </tr>
  </thead>
  
  <tbody>
    {paginatedData.map((row, rowIndex) => {
      const isEven = rowIndex % 2 === 0;
      return (
        <tr
          key={row._id || rowIndex}
          onMouseEnter={() => setHoveredRow(rowIndex)}
          onMouseLeave={() => setHoveredRow(null)}
          className="group transition-colors duration-200"
          style={{
            backgroundColor: hoveredRow === rowIndex ? '#f8fafc' : isEven ? '#ffffff' : '#fafcff',
          }}
        >
          {/* Invoice Number Cell */}
          <td
            className={selectedArithType === 'sale' ? '' : 'hidden'}
            style={{
              padding: '16px 20px',
              textAlign: 'left',
              fontWeight: 600,
              color: '#1e293b',
              borderBottom: '1px solid #e2e8f0',
              borderRight: '2px solid #e2e8f0',
              backgroundColor: hoveredRow === rowIndex ? '#f8fafc' : isEven ? '#ffffff' : '#fafcff',
              position: 'sticky',
              left: 0,
              zIndex: 2,
            }}
          >
            <span className="inline-flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-indigo-500"></span>
              <span className="font-mono text-sm font-semibold">#{row.invoiceNumber}</span>
            </span>
          </td>
          
          {/* Distributor Cell */}
          <td
            className={selectedArithType === 'sale' ? '' : 'hidden'}
            style={{
              padding: '16px 20px',
              textAlign: 'left',
              fontWeight: 500,
              color: '#475569',
              borderBottom: '1px solid #e2e8f0',
              borderRight: '2px solid #e2e8f0',
              backgroundColor: hoveredRow === rowIndex ? '#f8fafc' : isEven ? '#ffffff' : '#fafcff',
              position: 'sticky',
              left: '120px',
              zIndex: 1,
            }}
          >
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 rounded-full text-xs font-medium text-slate-700">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
              {row.distributor}
            </span>
          </td>
          
          {/* Date Cell */}
          <td
            style={{
              padding: '16px 20px',
              textAlign: 'left',
              fontWeight: 500,
              color: '#475569',
              borderBottom: '1px solid #e2e8f0',
              borderRight: '2px solid #e2e8f0',
              backgroundColor: hoveredRow === rowIndex ? '#f8fafc' : isEven ? '#ffffff' : '#fafcff',
              position: 'sticky',
              left: selectedArithType === 'sale' ? '260px' : '0px',
              top: 0,
              zIndex: 2,
            }}
          >
            <span className="inline-flex items-center gap-1.5 text-xs text-slate-600">
              <svg className="w-3.5 h-3.5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              {new Date(row.createdAt).toLocaleDateString('en-US', { 
                year: 'numeric', 
                month: 'short', 
                day: 'numeric' 
              })}
            </span>
          </td>
          
          {/* Quantity Cells */}
          {lightWatts.map((watts, idx) => {
            const quantity = getProductQuantity(row, watts);
            const status = getStockStatusColor(quantity);
            return (
              <td
                className={`hover:bg-indigo-50/30 cursor-pointer transition-all duration-200 ${watts.watts === 'All watts' ? 'hidden' : ''}`}
                key={idx}
                onMouseEnter={() => setHoveredCol(idx)}
                onMouseLeave={() => setHoveredCol(null)}
                style={{
                  padding: '16px 12px',
                  textAlign: 'center',
                  fontWeight: 600,
                  backgroundColor: hoveredCol === idx ? '#fefce8' : 'transparent',
                  borderBottom: '1px solid #e2e8f0',
                  transition: 'all 0.2s ease',
                }}
              >
                {quantity > 0 ? (
                  <div className="inline-flex flex-col items-center gap-1">
                    <span
                      className="inline-flex items-center justify-center min-w-[48px] px-3 py-1.5 rounded-full font-bold text-sm shadow-sm transition-transform hover:scale-105"
                      style={{
                        backgroundColor: status.bg,
                        color: status.color,
                      }}
                    >
                      {quantity}
                    </span>
                    <span className="text-[10px] text-slate-400">units</span>
                  </div>
                ) : (
                  <div className="inline-flex flex-col items-center gap-1">
                    <span className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-slate-50 text-slate-300">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
                      </svg>
                    </span>
                  </div>
                )}
              </td>
            );
          })}
        </tr>
      );
    })}

    {filteredData.length === 0 && (
      <tr>
        <td colSpan={lightWatts.length + 3} style={{ padding: '80px 20px', textAlign: 'center' }}>
          <div className="flex flex-col items-center justify-center gap-4">
            <div className="w-20 h-20 rounded-full bg-slate-100 flex items-center justify-center">
              <svg className="w-10 h-10 text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
              </svg>
            </div>
            <div className="text-center">
              <div className="text-lg font-semibold text-slate-600 mb-1">No delivery records found</div>
              <div className="text-sm text-slate-400">Try adjusting your search or filters to see results</div>
            </div>
          </div>
        </td>
      </tr>
    )}
  </tbody>
</table>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div style={{
            padding: '16px 20px',
            borderTop: '1px solid #e2e8f0',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            backgroundColor: '#f8fafc',
          }}>
            <div style={{ fontSize: '13px', color: '#64748b' }}>
              Page {currentPage} of {totalPages}
            </div>
            <div style={{ display: 'flex', gap: '8px' }}>
              <button
                onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                style={{
                  padding: '8px 12px',
                  borderRadius: '10px',
                  border: '1px solid #e2e8f0',
                  backgroundColor: '#fff',
                  cursor: currentPage === 1 ? 'not-allowed' : 'pointer',
                  opacity: currentPage === 1 ? 0.5 : 1,
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  fontSize: '13px',
                }}
              >
                <ChevronLeft size={16} /> Previous
              </button>
              <button
                onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages}
                style={{
                  padding: '8px 12px',
                  borderRadius: '10px',
                  border: '1px solid #e2e8f0',
                  backgroundColor: '#fff',
                  cursor: currentPage === totalPages ? 'not-allowed' : 'pointer',
                  opacity: currentPage === totalPages ? 0.5 : 1,
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  fontSize: '13px',
                }}
              >
                Next <ChevronRight size={16} />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

// Helper component for file text icon
const FileText = ({ size }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
    <polyline points="14 2 14 8 20 8" />
    <line x1="16" y1="13" x2="8" y2="13" />
    <line x1="16" y1="17" x2="8" y2="17" />
    <polyline points="10 9 9 9 8 9" />
  </svg>
);

export default WideTableComponent;