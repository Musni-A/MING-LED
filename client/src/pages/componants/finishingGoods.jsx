// components/Inventory/ProductInventory.jsx
import { useEffect, useState, useCallback, useMemo } from 'react';
import { updateProductStock, bulkUpdateProducts, productPriceUpdate } from '../../api/lightAPI';
import { getLightType } from '../../api/lightTypeAPI';
import { Link } from 'react-router-dom';
import { 
  Check,
  History,
  Package, 
  AlertTriangle, 
  XCircle,
  XIcon, 
  DollarSign,
  Search,
  Plus,
  Edit2,
  Trash2,
  ChevronLeft,
  ChevronRight,
  TrendingUp,
  TrendingDown,
  Eye,
  LoaderCircle,
  X,
  Minus,
  Plus as PlusIcon,
  Save,
  RefreshCw,
  Hash, RotateCcw, CheckSquare, 
  ArrowRight, AlertCircle
} from 'lucide-react';
import toast, { Toaster } from 'react-hot-toast';
import { getLightWatts } from '../../api/lightAPI';
import { createFinishingGoodsHistory } from '../../api/finishingGoodsHistory';
import React from 'react';

// Memoized Bulk Product Row Component for performance
const BulkProductRow = React.memo(({ product, bulkOperation, update, removeProductFromBulk, updateBulkItem }) => {
  const newStock = update.type === 'restock' 
    ? product.quantity + Number(update.quantity)
    : product.quantity - Number(update.quantity);
  const isValid = newStock >= 0;
  const stockChanged = update.quantity > 0;
  
  return (
    <tr 
      className={`${product.watts === 'All watts' && 'hidden'} 
        hover:bg-purple-50/30 transition-colors
        ${!isValid ? 'bg-red-50/50' : ''}
      `}
    >
      <td className="px-4 py-3">
        <div className="flex items-center gap-3">
          <div className={`w-10 h-10 rounded-lg flex items-center justify-center font-bold text-white text-xs shadow-sm ${
            bulkOperation === 'restock' 
              ? 'bg-gradient-to-br from-green-400 to-emerald-600'
              : 'bg-gradient-to-br from-red-400 to-rose-600'
          }`}>
            {product.watts?.substring(0, 3).toUpperCase()}
          </div>
          <div>
            <div className="font-semibold text-gray-900 text-sm">{product.watts}</div>
            <div className="text-xs text-gray-400">{product.typeName}</div>
          </div>
        </div>
      </td>
      
      <td className="px-4 py-3">
        <div className="flex items-baseline gap-1">
          <span className={`font-bold text-xl ${
            product.quantity === 0 ? 'text-red-600' : 
            product.quantity < 10 ? 'text-orange-600' : 'text-green-600'
          }`}>
            {product.quantity}
          </span>
          <span className="text-xs text-gray-400">units</span>
        </div>
        {product.quantity === 0 && (
          <span className="inline-block mt-1 px-1.5 py-0.5 text-[10px] bg-red-100 text-red-700 rounded font-semibold">
            OUT OF STOCK
          </span>
        )}
        {product.quantity > 0 && product.quantity < 10 && (
          <span className="inline-block mt-1 px-1.5 py-0.5 text-[10px] bg-orange-100 text-orange-700 rounded font-semibold">
            LOW STOCK
          </span>
        )}
      </td>
      
      <td className="px-4 py-3">
        <div className="inline-flex items-center bg-gray-50 border border-gray-200 rounded-lg overflow-hidden">
          <button
            onClick={() => updateBulkItem(product._id, Math.max(0, Number(update.quantity) - 1), product.watts, product.typeName)}
            className="px-2 py-2 hover:bg-gray-200 text-gray-600 transition-colors"
            disabled={update.quantity <= 0}
          >
            <Minus className="w-3.5 h-3.5" />
          </button>
          <input
            type="number"
            min="0"
            value={update.quantity}
            onChange={(e) => updateBulkItem(product._id, e.target.value, product.watts, product.typeName)}
            className="w-16 px-2 py-2 text-center text-sm font-semibold bg-white border-x border-gray-200 outline-none focus:bg-purple-50"
          />
          <button
            onClick={() => updateBulkItem(product._id, Number(update.quantity) + 1, product.watts, product.typeName)}
            className="px-2 py-2 hover:bg-gray-200 text-gray-600 transition-colors"
          >
            <Plus className="w-3.5 h-3.5" />
          </button>
        </div>
      </td>
      
      <td className="px-4 py-3">
        {stockChanged ? (
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs text-gray-400">{product.quantity}</span>
              <ArrowRight className="w-3 h-3 text-gray-400" />
              <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-sm font-bold ${
                !isValid ? 'bg-red-100 text-red-700' :
                newStock === 0 ? 'bg-red-100 text-red-700' :
                newStock < 10 ? 'bg-orange-100 text-orange-700' : 'bg-green-100 text-green-700'
              }`}>
                {!isValid ? (
                  <>
                    <AlertTriangle className="w-3 h-3" />
                    Invalid
                  </>
                ) : (
                  newStock
                )}
              </span>
            </div>
            {!isValid && (
              <p className="text-xs text-red-500 mt-1 flex items-center gap-1">
                <AlertCircle className="w-3 h-3" />
                Cannot go below 0
              </p>
            )}
          </div>
        ) : (
          <span className="text-gray-300 text-sm">— no change —</span>
        )}
      </td>
      
      <td className="px-4 py-3 text-center">
        <button
          onClick={() => removeProductFromBulk(product._id)}
          className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all"
          title="Remove from list"
        >
          <Trash2 className="w-4 h-4" />
        </button>
      </td>
    </tr>
  );
}, (prev, next) => {
  return prev.product._id === next.product._id &&
         prev.update.quantity === next.update.quantity &&
         prev.update.type === next.update.type &&
         prev.bulkOperation === next.bulkOperation;
});

BulkProductRow.displayName = 'BulkProductRow';

export default function ProductInventory({setShowDeliveryHistory, showDeliveryHistory}) {
  const [products, setProducts] = useState([]);
  const [lightTypes, setLightTypes] = useState([]);
  const [selectedType, setSelectedType] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, _setSelectedCategory] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(5);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [showStockModal, setShowStockModal] = useState(false);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [showBulkUpdateModal, setShowBulkUpdateModal] = useState(false);
  const [loading, setLoading] = useState(true);
  const [bulkLoading, setBulkLoading] = useState(false);
  const [stockUpdate, setStockUpdate] = useState({ type: "restock", price : 0, quantity: 0, reason: "" });
  const [bulkUpdates, setBulkUpdates] = useState({});
  const [invoiceNumber, setInvoiceNumber] = useState('');
  const [changeIntoUpdate, setChangeIntoUpdate] = useState(false);
  const [price, setPrice] = useState(0);
  const [selectedProductId, setSelectedProductId] = useState(null);
  const [selectedDistributor, setSelectedDistributor] = useState('');

  // Bulk Update Modal State
  const [bulkSelectedProducts, setBulkSelectedProducts] = useState([]);
  const [availableProducts, setAvailableProducts] = useState([]);
  
  // NEW: Single operation for all products
  const [bulkOperation, setBulkOperation] = useState('restock'); // 'restock' or 'sale'

  // Fetch Light Types
  const fetchLightTypes = async () => {
    try {
      const response = await getLightType();
      setLightTypes(response.data);
    } catch (_err) {
      toast.error("Failed to fetch light types");
    }
  };

  // Fetch Products
  const fetchLight = async () => {
    try {
      setLoading(true);
      const response = await getLightWatts();
      setProducts(response.data);
      const initialBulk = {};
      response.data.forEach(product => {
        initialBulk[product._id] = { quantity: 0, type: 'restock', watts : product.watts, typeName: product.typeName };
      });
      setBulkUpdates(initialBulk);
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to fetch products");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLightTypes();
    fetchLight();
  },[]);

  // Filter products
  const filteredProducts = products.filter(product => {
    const matchesType = !selectedType || product.typeName === selectedType.typeName;
    const matchesSearch = searchTerm === "" || 
      product.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.sku?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === "all" || product.category === selectedCategory;
    return matchesType && matchesSearch && matchesCategory;
  });

  // Pagination
  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);
  const paginatedProducts = filteredProducts.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // Statistics
  const stats = {
    total: filteredProducts.length,
    lowStock: filteredProducts.filter(p => p.quantity > 0 && p.quantity <= (p.minStock || 10)).length,
    outOfStock: (filteredProducts.filter(p => p.quantity === 0).length) - (filteredProducts.filter(p => p.watts === "All watts").length),
    totalValue: filteredProducts.reduce((sum, p) => sum + (p.quantity * p.price), 0)
  };

  // Initialize available products
  useEffect(() => {
    if (showBulkUpdateModal) {
      const selectedIds = bulkSelectedProducts.map(p => p._id);
      const available = filteredProducts.filter(p => !selectedIds.includes(p._id));
      setAvailableProducts(available);
    }
  }, []);

  // Add product to bulk update list
  const addProductToBulk = useCallback((productId) => {
    setAvailableProducts(prev => {
      const product = prev.find(p => p._id === productId);
      if (product && !bulkSelectedProducts.find(p => p._id === productId)) {
        setBulkSelectedProducts(sel => [...sel, product]);
        setBulkUpdates(upd => ({
          ...upd,
          [productId]: { quantity: 0, type: bulkOperation, Watts: product.watts, typeName: product.typeName }
        }));
        return prev.filter(p => p._id !== productId);
      }
      return prev;
    });
  }, [bulkOperation, bulkSelectedProducts]);

  // Remove product from bulk update list
  const removeProductFromBulk = useCallback((productId) => {
    setBulkSelectedProducts(prev => {
      const product = prev.find(p => p._id === productId);
      if (product) {
        setAvailableProducts(avail => [...avail, product]);
        setBulkUpdates(upd => {
          const newUpdates = { ...upd };
          delete newUpdates[productId];
          return newUpdates;
        });
        return prev.filter(p => p._id !== productId);
      }
      return prev;
    });
  }, []);

  // Select all products
  const selectAllProducts = useCallback(() => {
    const allProducts = [...filteredProducts];
    setBulkSelectedProducts(allProducts);
    setAvailableProducts([]);
    
    const allUpdates = {};
    allProducts.forEach(product => {
      allUpdates[product._id] = { quantity: 0, type: bulkOperation, Watts: product.watts, typeName: product.typeName };
    });
    setBulkUpdates(allUpdates);
  }, [filteredProducts, bulkOperation]);

  // Clear all products
  const clearAllProducts = useCallback(() => {
    setBulkSelectedProducts([]);
    setAvailableProducts(filteredProducts);
    setBulkUpdates({});
  }, [filteredProducts]);

  // Update bulk item quantity only (type is now global)
  const updateBulkItem = useCallback((productId, quantity, watts, typeName) => {
    setBulkUpdates(prev => ({
      ...prev,
      [productId]: {
        ...prev[productId],
        Watts: watts,
        quantity: parseInt(quantity) || 0,
        type: bulkOperation,
        typeName: typeName
      }
    }));
  }, [bulkOperation]);

  // Apply bulk operation to all selected products
  const applyOperationToAll = useCallback((operation) => {
    setBulkOperation(operation);
    setBulkUpdates(prev => {
      const updated = { ...prev };
      Object.keys(updated).forEach(productId => {
        updated[productId] = { ...updated[productId], type: operation };
      });
      return updated;
    });
  }, []);

  const handleChangePrice = async (newPrice) => {
    try {
        const response = await productPriceUpdate({ price: newPrice, productId: selectedProductId });
        console.log('Price update response:', response);
        
        // Handle success
        if (response?.data?.success) {
            toast.success('Prices updated successfully!');
        }
        await fetchLight();

    } catch (error) {
        console.error('Price update failed:', error);
        toast.error(error.response?.data?.message || 'Failed to update prices');
    }
};

  const getStockStatus = (product) => {
    const minStock = product.minStock || 50;
    if (product.quantity === 0) {
      return { label: "Out of Stock", color: "bg-red-100 text-red-700", icon: XCircle };
    }
    if (product.quantity <= minStock) {
      return { label: "Low Stock", color: "bg-orange-100 text-orange-700", icon: AlertTriangle };
    }
    return { label: "In Stock", color: "bg-green-100 text-green-700", icon: Package };
  };

  // Single product stock update
  const updateStock = async () => {
    if (stockUpdate.quantity <= 0) {
      toast.error("Please enter a valid quantity");
      return;
    }

    try {
      const response = await updateProductStock(selectedProduct._id, {
        quantity: stockUpdate.quantity,
        price: stockUpdate.price,
        type: stockUpdate.type,
        reason: stockUpdate.reason
      });
      
      await fetchLight();
      setShowStockModal(false);
      setStockUpdate({ type: "restock", quantity: 0, reason: "" });
      toast.success(response.data.message || "Stock updated successfully!");
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to update stock");
    }
  };

  // Bulk update products
  const handleBulkUpdate = async () => {
    // Map all selected products with their complete data + update info
    const updatesToSend = bulkSelectedProducts
      .filter(product => {
        const update = bulkUpdates[product._id];
        return update && update.quantity > 0;
      })
      .map(product => ({
        // Include ALL product data
        ...product,
        // Add/override with update-specific fields
        invoiceNumber: invoiceNumber,
        quantity: bulkUpdates[product._id].quantity,
        type: bulkUpdates[product._id].type,
        watts: bulkUpdates[product._id].Watts,
        productId: product._id,
        typeName: bulkUpdates[product._id].typeName
      }));

    if (updatesToSend.length === 0) {
      toast.error("No updates to apply");
      return;
    }


    setBulkLoading(true);
    try {
      const response2 = await createFinishingGoodsHistory(updatesToSend, selectedDistributor);
      console.log(response2.data);
      const response = await bulkUpdateProducts(updatesToSend);
      console.log(response.data);
      await fetchLight();
      setShowBulkUpdateModal(false);
      setBulkSelectedProducts([]);
      setAvailableProducts([]);
      setBulkOperation('restock');
      toast.success(response.data.message || `${updatesToSend.length} products updated successfully!`);
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to update products");
    } finally {
      setBulkLoading(false);
    }
  };

  // if (loading) {
  //   return (
  //     <div className="flex flex-col items-center justify-center h-96">
  //       <LoaderCircle className="w-12 h-12 text-blue-400 animate-spin mb-4" />
  //       <p className="text-gray-500">Loading products...</p>
  //     </div>
  //   );
  // }

  return (
    <div className={` ${showDeliveryHistory == 'hidden' ? 'block' : 'hidden'} min-h-screen bg-gray-50`}>
      <Toaster />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* Header */}
        <div className="mb-8">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Product Inventory</h1>
              <p className="text-gray-500 mt-1">Manage your products and track stock levels</p>
            </div>
            <div className="flex gap-3">
              <div className="relative w-full sm:w-72">
                <select
                  className="w-full pl-4 pr-10 py-2.5 bg-white border-2 border-gray-200 rounded-xl text-gray-700 font-medium cursor-pointer hover:border-blue-400 focus:border-blue-500 focus:ring-4 focus:ring-blue-100 outline-none transition-all appearance-none text-sm shadow-sm"
                  onChange={(e) => {
                    const type = lightTypes.find(t => t.typeName === e.target.value);
                    setSelectedType(type || null);
                    setCurrentPage(1);
                  }}
                  value={selectedType?.typeName || ""}
                >
                  <option value="">📦 All Product Types</option>
                  {lightTypes.map((type) => (
                    <option key={type._id} value={type.typeName}>
                      {type.typeName} • {products.filter(p => p.typeName === type.typeName).length} products
                    </option>
                  ))}
                </select>
                <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none">
                  <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
              </div>
                <button onClick={()=>{setShowDeliveryHistory('block')}} className="px-4 py-2 bg-red-600/70 text-white rounded-lg hover:bg-red-800 sm:w-fit w-55 flex items-center gap-2 transition-all duration-300">
                  <Package className="w-4 h-4" />
                  Delivery history
                </button>
                <button onClick={()=>{setShowDeliveryHistory('block')}} className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-900 sm:w-fit w-55 flex items-center gap-2 transition-all duration-300">
                  <History className="w-4 h-4" />
                  Restock history
                </button>
            </div>
          </div>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <div className="bg-white rounded-xl shadow-sm p-4 border-l-4 border-blue-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Total Products</p>
                <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
              </div>
              <Package className="w-8 h-8 text-blue-500 opacity-50" />
            </div>
          </div>
          <div className="bg-white rounded-xl shadow-sm p-4 border-l-4 border-orange-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Low Stock Items</p>
                <p className="text-2xl font-bold text-orange-600">{stats.lowStock}</p>
              </div>
              <AlertTriangle className="w-8 h-8 text-orange-500 opacity-50" />
            </div>
            <p className="text-xs text-orange-600 mt-1">⚠️ Needs attention</p>
          </div>
          <div className="bg-white rounded-xl shadow-sm p-4 border-l-4 border-red-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Out of Stock</p>
                <p className="text-2xl font-bold text-red-600">{stats.outOfStock}</p>
              </div>
              <XCircle className="w-8 h-8 text-red-500 opacity-50" />
            </div>
          </div>
          <div className="bg-white rounded-xl shadow-sm p-4 border-l-4 border-green-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Total Value</p>
                <p className="text-2xl font-bold text-green-600">LKR.{stats.totalValue.toLocaleString()}</p>
              </div>
              <DollarSign className="w-8 h-8 text-green-500 opacity-50" />
            </div>
          </div>
        </div>

        {/* Search and Filter */}
        <div className="bg-white rounded-xl shadow-sm p-4 mb-8">
          <div className="flex flex-wrap gap-4">
            <div className="flex-1 min-w-50">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search products..."
                  value={searchTerm}
                  onChange={(e) => {
                    setSearchTerm(e.target.value);
                    setCurrentPage(1);
                  }}
                  className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                />
                {searchTerm && (
                  <button
                    onClick={() => setSearchTerm('')}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>
            <button 
                onClick={() => setShowBulkUpdateModal(true)}
                className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 flex items-center gap-2"
              >
                <RefreshCw className="w-4 h-4" />
                Product deliver / Restock
              </button>
          </div>
        </div>

        {/* Product Table */}
        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          {filteredProducts.length === 0 ? (
            <div className="text-center py-12">
              <div className="inline-flex p-4 bg-gray-100 rounded-full mb-4">
                <Package className="w-8 h-8 text-gray-400" />
              </div>
              <h3 className="text-lg font-semibold text-gray-800 mb-2">No Products Found</h3>
              <p className="text-gray-500 text-sm">No products found matching your criteria</p>
            </div>
          ) : (
            <>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50 border-b">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Product</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Type</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Stock</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Price</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {paginatedProducts.map((product) => {
                      const status = getStockStatus(product);
                      const StockIcon = status.icon;
                      return (
                        <tr key={product._id} className={` ${product.typeName.includes('Common') && 'hidden'} hover:bg-gray-50 transition-colors`}>
                          <td className="px-6 py-4">
                            <div className="font-medium text-gray-900">{product.watts}</div>
                            <div className="text-xs text-gray-500">{product.typeName}</div>
                          </td>
                          <td className="px-6 py-4">
                            <span className="px-2 py-1 text-xs rounded-full bg-blue-100 text-blue-700">
                              {product.typeName}
                            </span>
                           </td>
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-2">
                              <span className="text-sm font-medium">{product.quantity}</span>
                            </div>
                           </td>
                          <td className="px-6 py-4">
                            <span className={`inline-flex items-center gap-1 px-2 py-1 text-xs rounded-full ${status.color}`}>
                              <StockIcon className="w-3 h-3" />
                              {status.label}
                            </span>
                           </td>
                          <td className="px-6 py-4 text-gray-900 font-medium">
                            {changeIntoUpdate && product._id === selectedProductId ? (
                              <input 
                                type="number"
                                defaultValue={product.price}
                                onChange={(e) => {setPrice(e.target.value);}}
                                className="w-20 px-2 py-1 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                              />
                            ) : (
                              <p className="text-sm text-gray-500">
                                LKR.{product.price}
                              </p>
                            )}
                          </td>
                          <td className="px-6 py-4">
                            <div className="flex gap-2">
                              {changeIntoUpdate && product._id === selectedProductId ? 
                              (<div className='flex gap-2'>
                                <button 
                                  onClick={() => {
                                    setChangeIntoUpdate(false);
                                    handleChangePrice(price);
                                  }}
                                  className="p-1 text-blue-600 hover:bg-blue-50 rounded"
                                  title="Update Stock"
                                >
                                  <Check className='w-5 h-5' />
                                </button> 
                                <button 
                                  onClick={() => {
                                    setChangeIntoUpdate(false);
                                    setSelectedProductId(null)
                                  }}
                                  className="p-1 text-red-600 hover:bg-blue-50 rounded"
                                  title="Update Stock"
                                >
                                  <XIcon className='w-5 h-5' />
                                </button>
                              </div>) : 
                              (<button 
                                onClick={() => {
                                  setChangeIntoUpdate(true);
                                  setSelectedProductId(product._id);
                                  setPrice(product.price)
                                }}
                                
                                className="p-1 text-blue-600 hover:bg-blue-50 rounded"
                                title="Update Stock"
                              >
                                <Edit2 className="w-4 h-4" />
                              </button>)}
                              
                              <button 
                                onClick={() => {
                                  setSelectedProduct(product);
                                  setShowDetailsModal(true);
                                }}
                                className="p-1 text-green-600 hover:bg-green-50 rounded" 
                                title="View Details"
                              >
                                <Eye className="w-4 h-4" />
                              </button>
                            </div>
                           </td>
                         </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="px-6 py-4 border-t flex justify-between items-center">
                  <button
                    onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                    disabled={currentPage === 1}
                    className="p-2 text-gray-600 hover:bg-gray-100 rounded disabled:opacity-50"
                  >
                    <ChevronLeft className="w-5 h-5" />
                  </button>
                  <span className="text-sm text-gray-600">
                    Page {currentPage} of {totalPages}
                  </span>
                  <button
                    onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                    disabled={currentPage === totalPages}
                    className="p-2 text-gray-600 hover:bg-gray-100 rounded disabled:opacity-50"
                  >
                    <ChevronRight className="w-5 h-5" />
                  </button>
                </div>
              )}
            </>
          )}
        </div>

        {/* Footer Stats */}
        {filteredProducts.length > 0 && (
          <div className="mt-4 text-center text-sm text-gray-500">
            Showing {paginatedProducts.length} of {filteredProducts.length} products
          </div>
        )}

        {/* Product Details Modal */}
        {showDetailsModal && selectedProduct && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <div className="px-6 py-4 border-b flex justify-between items-center sticky top-0 bg-white">
                <h3 className="text-xl font-semibold text-gray-900">Product Details</h3>
                <button onClick={() => setShowDetailsModal(false)} className="text-gray-400 hover:text-gray-600">
                  <X className="w-5 h-5" />
                </button>
              </div>
              <div className="p-6">
                {/* Product Image */}
                <div className="flex justify-center mb-6">
                  <div className="w-32 h-32 bg-gray-100 rounded-xl flex items-center justify-center">
                    {selectedProduct.image ? (
                      <img src={selectedProduct.image} alt={selectedProduct.name} className="w-full h-full object-cover rounded-xl" />
                    ) : (
                      <Package className="w-12 h-12 text-gray-400" />
                    )}
                  </div>
                </div>

                {/* Basic Info */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                  <div>
                    <label className="text-xs text-gray-500 uppercase font-semibold">Product Name</label>
                    <p className="text-gray-900 font-medium">{selectedProduct.name}</p>
                  </div>
                  <div>
                    <label className="text-xs text-gray-500 uppercase font-semibold">SKU</label>
                    <p className="text-gray-900 font-medium">{selectedProduct.sku}</p>
                  </div>
                  <div>
                    <label className="text-xs text-gray-500 uppercase font-semibold">Type</label>
                    <p className="text-gray-900 font-medium">{selectedProduct.type}</p>
                  </div>
                  <div>
                    <label className="text-xs text-gray-500 uppercase font-semibold">Category</label>
                    <p className="text-gray-900 font-medium">{selectedProduct.category || 'N/A'}</p>
                  </div>
                  <div>
                    <label className="text-xs text-gray-500 uppercase font-semibold">Price</label>
                    <p className="font-medium text-xl text-green-600">${selectedProduct.price}</p>
                  </div>
                  <div>
                    <label className="text-xs text-gray-500 uppercase font-semibold">Cost</label>
                    <p className="text-gray-900 font-medium">${selectedProduct.cost || 'N/A'}</p>
                  </div>
                </div>

                {/* Stock Information */}
                <div className="bg-gray-50 rounded-lg p-4 mb-6">
                  <h4 className="font-semibold text-gray-800 mb-3">Stock Information</h4>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-xs text-gray-500 uppercase font-semibold">Current Stock</label>
                      <p className={`text-2xl font-bold ${
                        selectedProduct.quantity === 0 ? 'text-red-600' : 
                        selectedProduct.quantity <= (selectedProduct.minStock || 10) ? 'text-orange-600' : 'text-green-600'
                      }`}>
                        {selectedProduct.quantity} units
                      </p>
                    </div>
                    <div>
                      <label className="text-xs text-gray-500 uppercase font-semibold">Min Stock Level</label>
                      <p className="text-gray-900 font-medium">{selectedProduct.minStock || 10} units</p>
                    </div>
                    <div>
                      <label className="text-xs text-gray-500 uppercase font-semibold">Max Stock</label>
                      <p className="text-gray-900 font-medium">{selectedProduct.maxStock || 'Unlimited'}</p>
                    </div>
                    <div>
                      <label className="text-xs text-gray-500 uppercase font-semibold">Unit</label>
                      <p className="text-gray-900 font-medium">{selectedProduct.unit || 'pcs'}</p>
                    </div>
                  </div>
                </div>

                {/* Description */}
                {selectedProduct.description && (
                  <div className="mb-6">
                    <label className="text-xs text-gray-500 uppercase font-semibold">Description</label>
                    <p className="text-gray-700 mt-1">{selectedProduct.description}</p>
                  </div>
                )}

                {/* Location Info */}
                {selectedProduct.location && (
                  <div className="mb-6">
                    <label className="text-xs text-gray-500 uppercase font-semibold">Storage Location</label>
                    <div className="grid grid-cols-3 gap-2 mt-2">
                      {selectedProduct.location.warehouse && (
                        <div className="bg-blue-50 rounded-lg p-2 text-center">
                          <p className="text-xs text-gray-500">Warehouse</p>
                          <p className="font-medium">{selectedProduct.location.warehouse}</p>
                        </div>
                      )}
                      {selectedProduct.location.shelf && (
                        <div className="bg-blue-50 rounded-lg p-2 text-center">
                          <p className="text-xs text-gray-500">Shelf</p>
                          <p className="font-medium">{selectedProduct.location.shelf}</p>
                        </div>
                      )}
                      {selectedProduct.location.bin && (
                        <div className="bg-blue-50 rounded-lg p-2 text-center">
                          <p className="text-xs text-gray-500">Bin</p>
                          <p className="font-medium">{selectedProduct.location.bin}</p>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* Supplier Info */}
                {selectedProduct.supplier && (
                  <div className="mb-6">
                    <label className="text-xs text-gray-500 uppercase font-semibold">Supplier Information</label>
                    <div className="mt-2 p-3 bg-gray-50 rounded-lg">
                      <p className="text-sm"><span className="font-medium">Name:</span> {selectedProduct.supplier.name}</p>
                      <p className="text-sm"><span className="font-medium">Contact:</span> {selectedProduct.supplier.contact}</p>
                      {selectedProduct.supplier.email && (
                        <p className="text-sm"><span className="font-medium">Email:</span> {selectedProduct.supplier.email}</p>
                      )}
                    </div>
                  </div>
                )}

                {/* Timestamps */}
                <div className="text-xs text-gray-400 border-t pt-4">
                  <p>Created: {new Date(selectedProduct.createdAt).toLocaleString()}</p>
                  <p>Last Updated: {new Date(selectedProduct.updatedAt).toLocaleString()}</p>
                </div>

                <div className="flex gap-3 mt-6">
                  <button
                    onClick={() => {
                      setShowDetailsModal(false);
                      setShowStockModal(true);
                    }}
                    className="flex-1 bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700"
                  >
                    Update Stock
                  </button>
                  <button
                    onClick={() => setShowDetailsModal(false)}
                    className="flex-1 bg-gray-200 text-gray-700 py-2 rounded-lg hover:bg-gray-300"
                  >
                    Close
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Single Product Stock Update Modal */}
        {showStockModal && selectedProduct && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl shadow-xl max-w-md w-full">
              <div className="px-6 py-4 border-b flex justify-between items-center">
                <h3 className="text-lg font-semibold text-gray-900">
                  Update Stock - {selectedProduct.name}
                </h3>
                <button onClick={() => setShowStockModal(false)} className="text-gray-400 hover:text-gray-600">
                  <X className="w-5 h-5" />
                </button>
              </div>
              <div className="p-6">
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Transaction Type</label>
                  <div className="flex gap-3">
                    <label className="flex items-center gap-2">
                      <input
                        type="radio"
                        value="restock"
                        checked={stockUpdate.type === "restock"}
                        onChange={(e) => setStockUpdate({ ...stockUpdate, type: e.target.value })}
                        className="text-blue-600"
                      />
                      <span className="flex items-center gap-1">➕ Restock (+)</span>
                    </label>
                    <label className="flex items-center gap-2">
                      <input
                        type="radio"
                        value="sale"
                        checked={stockUpdate.type === "sale"}
                        onChange={(e) => setStockUpdate({ ...stockUpdate, type: e.target.value })}
                        className="text-blue-600"
                      />
                      <span className="flex items-center gap-1">➖ Sale/Damage (-)</span>
                    </label>
                  </div>
                </div>
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Quantity</label>
                  <input
                    type="number"
                    min="1"
                    value={stockUpdate.quantity}
                    onChange={(e) => setStockUpdate({ ...stockUpdate, quantity: parseInt(e.target.value) || 0 })}
                    className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Price</label>
                  <input
                    placeholder='LKR'
                    type="number"
                    min="1"
                    value={stockUpdate.price}
                    onChange={(e) => setStockUpdate({ ...stockUpdate, price: parseInt(e.target.value) || 0 })}
                    className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Reason (Optional)</label>
                  <textarea
                    rows="2"
                    value={stockUpdate.reason}
                    onChange={(e) => setStockUpdate({ ...stockUpdate, reason: e.target.value })}
                    placeholder="e.g., Supplier delivery, Customer order, etc."
                    className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                {stockUpdate.type === "sale" && stockUpdate.quantity > selectedProduct.quantity && (
                  <p className="text-red-500 text-sm mb-3">
                    ⚠️ Cannot remove more than available stock ({selectedProduct.quantity} units)
                  </p>
                )}
                <div className="flex gap-3">
                  <button
                    onClick={updateStock}
                    disabled={stockUpdate.quantity <= 0 || (stockUpdate.type === "sale" && stockUpdate.quantity > selectedProduct.quantity)}
                    className="flex-1 bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50"
                  >
                    Update Stock
                  </button>
                  <button
                    onClick={() => setShowStockModal(false)}
                    className="flex-1 bg-gray-200 text-gray-700 py-2 rounded-lg hover:bg-gray-300"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* UPDATED Bulk Update Modal with Single Operation Control */}
        {showBulkUpdateModal && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fadeIn">
            <div className="bg-white rounded-2xl shadow-2xl max-w-6xl w-full max-h-[92vh] flex flex-col overflow-hidden">
              
              {/* Header */}
              <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-gradient-to-r from-purple-50 via-white to-purple-50">
                <div className="flex items-center gap-3">
                  <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-purple-500 to-purple-700 flex items-center justify-center shadow-lg shadow-purple-500/30">
                    <Package className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-gray-900">Product Delivery / Restock</h3>
                    <p className="text-xs text-gray-500">
                      Update multiple products at once — fast and efficient
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => {
                    setShowBulkUpdateModal(false);
                    setBulkSelectedProducts([]);
                    setAvailableProducts([]);
                    setBulkOperation('restock');
                  }}
                  className="w-9 h-9 rounded-lg flex items-center justify-center text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition-all"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Progress / Stepper Bar */}
              <div className="px-6 py-3 bg-gray-50 border-b border-gray-100">
                <div className="flex items-center gap-2 text-xs">
                  <div className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full ${
                    bulkOperation ? 'bg-purple-100 text-purple-700' : 'bg-gray-200 text-gray-500'
                  }`}>
                    <span className="w-5 h-5 rounded-full bg-white flex items-center justify-center font-bold">1</span>
                    Choose Operation
                  </div>
                  <ChevronRight className="w-3 h-3 text-gray-400" />
                  <div className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full ${
                    bulkSelectedProducts.length > 0 ? 'bg-purple-100 text-purple-700' : 'bg-gray-200 text-gray-500'
                  }`}>
                    <span className="w-5 h-5 rounded-full bg-white flex items-center justify-center font-bold">2</span>
                    Select Products
                  </div>
                  <ChevronRight className="w-3 h-3 text-gray-400" />
                  <div className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full ${
                    Object.values(bulkUpdates).some(u => u.quantity > 0) ? 'bg-purple-100 text-purple-700' : 'bg-gray-200 text-gray-500'
                  }`}>
                    <span className="w-5 h-5 rounded-full bg-white flex items-center justify-center font-bold">3</span>
                    Set Quantities
                  </div>
                  <ChevronRight className="w-3 h-3 text-gray-400" />
                  <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-gray-200 text-gray-500">
                    <span className="w-5 h-5 rounded-full bg-white flex items-center justify-center font-bold">4</span>
                    Apply
                  </div>
                </div>
              </div>

              {/* Main Content */}
              <div className="flex-1 overflow-y-auto p-6 bg-gray-50/50">
                
                {/* Step 1: Operation Type & Quick Quantity */}
                <div className="mb-6 bg-white rounded-xl border border-gray-200 p-5 shadow-sm">
                  <div className="flex items-center gap-2 mb-4">
                    <div className="w-6 h-6 rounded-full bg-purple-100 text-purple-700 flex items-center justify-center text-xs font-bold">1</div>
                    <h4 className="font-semibold text-gray-800">Choose operation & set quantity for all</h4>
                  </div>
                  
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                    {/* Operation Toggle */}
                    <div>
                      <label className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-2 block">
                        Operation Type
                      </label>
                      <div className="grid grid-cols-2 gap-2 p-1 bg-gray-100 rounded-xl">
                        <button
                          onClick={() => applyOperationToAll('restock')}
                          className={`relative px-4 py-2.5 rounded-lg font-semibold transition-all flex items-center justify-center gap-2 ${
                            bulkOperation === 'restock'
                              ? 'bg-white text-green-700 shadow-md'
                              : 'text-gray-600 hover:text-gray-800'
                          }`}
                        >
                          <Plus className="w-4 h-4" />
                          Restock
                          {bulkOperation === 'restock' && (
                            <span className="absolute top-1 right-1 w-2 h-2 bg-green-500 rounded-full" />
                          )}
                        </button>
                        <button
                          onClick={() => applyOperationToAll('sale')}
                          className={`relative px-4 py-2.5 rounded-lg font-semibold transition-all flex items-center justify-center gap-2 ${
                            bulkOperation === 'sale'
                              ? 'bg-white text-red-700 shadow-md'
                              : 'text-gray-600 hover:text-gray-800'
                          }`}
                        >
                          <Minus className="w-4 h-4" />
                          Sale
                          {bulkOperation === 'sale' && (
                            <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full" />
                          )}
                        </button>
                      </div>
                    </div>

                    <div className='flex gap-2 justify-evenly'>
                      <div>
                        <label className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-2 block">
                          Enter invoice No
                        </label>
                        <div className="flex gap-2 pt-1">
                          <div className="relative flex-1">
                            <input
                              type="text"
                              min="0"
                              placeholder="Enter invoice No"
                              onChange={(e) => setInvoiceNumber(e.target.value)}
                              disabled={bulkOperation === 'restock'}
                              className="w-full pl-5 pr-3 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none transition-all"
                            />
                          </div>
                        </div>
                      </div>
                      <div>
                        <label className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-2 block">
                          Select distributor
                        </label>
                        <div className="flex gap-2 pt-1">
                          <div className="relative flex-1">
                            <select name="distributor" id=""
                              disabled={bulkOperation === 'restock'}
                              onChange={(e)=>{
                                setSelectedDistributor(e.target.value);
                              }}
                              className="w-full pl-2 mr-3 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none transition-all"
                            >
                              <option value="">Select distributor</option>
                              {[
                                'Trincomale',
                                'Ampara',
                                'Badulla',
                                'Colombo'
                              ].map(o =>(
                                <option key={o} value={o}>{o}</option>
                              ))}
                            </select>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                  </div>
                </div>

                {/* Step 2: Product Selection */}
                <div className="mb-6 bg-white rounded-xl border border-gray-200 p-5 shadow-sm">
                  <div className="flex items-center gap-2 mb-4">
                    <div className="w-6 h-6 rounded-full bg-purple-100 text-purple-700 flex items-center justify-center text-xs font-bold">2</div>
                    <h4 className="font-semibold text-gray-800">Add products to update</h4>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    <div className="relative flex-1 min-w-[250px]">
                      <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                      <select
                        onChange={(e) => {
                          if (e.target.value) {
                            addProductToBulk(e.target.value);
                            e.target.value = '';
                          }
                        }}
                        className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 text-sm outline-none transition-all bg-white"
                        value=""
                      >
                        <option value="">+ Search and add product...</option>
                        {availableProducts.map(product => (
                          <option className={`${product.watts === "All watts" && 'hidden'}`} key={product._id} value={product._id}>
                            {product.watts} — Stock: {product.quantity} | Variant: {product.typeName}
                          </option>
                        ))}
                      </select>
                    </div>
                    
                    <button
                      onClick={selectAllProducts}
                      className="px-4 py-2.5 bg-purple-50 text-purple-700 border border-purple-200 rounded-lg hover:bg-purple-100 text-sm font-medium transition-all flex items-center gap-1.5"
                    >
                      <CheckSquare className="w-4 h-4" />
                      Select All ({bulkSelectedProducts.filter(product => product.watts !== "All watts").length})
                    </button>
                    
                    <button
                      onClick={clearAllProducts}
                      disabled={bulkSelectedProducts.length === 0}
                      className="px-4 py-2.5 bg-gray-50 text-gray-700 border border-gray-200 rounded-lg hover:bg-gray-100 text-sm font-medium transition-all flex items-center gap-1.5 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <Trash2 className="w-4 h-4" />
                      Clear All
                    </button>
                  </div>
                </div>

                {/* Step 3: Products Table */}
                <div className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm">
                  <div className="px-5 py-3 border-b border-gray-100 bg-gray-50 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 rounded-full bg-purple-100 text-purple-700 flex items-center justify-center text-xs font-bold">3</div>
                      <h4 className="font-semibold text-gray-800">Review & set individual quantities</h4>
                    </div>
                    {bulkSelectedProducts.length > 0 && (
                      <span className="text-xs bg-purple-100 text-purple-700 px-2.5 py-1 rounded-full font-semibold">
                        { bulkSelectedProducts.filter((pro )=> pro.watts !== "All watts" ).length } products
                      </span>
                    )}
                  </div>

                  {bulkSelectedProducts.length === 0 ? (
                    <div className="text-center py-16 px-6">
                      <div className="inline-flex p-5 bg-gradient-to-br from-purple-100 to-purple-50 rounded-full mb-4">
                        <Package className="w-10 h-10 text-purple-400" />
                      </div>
                      <h4 className="text-lg font-semibold text-gray-900 mb-1">No Products Selected Yet</h4>
                      <p className="text-gray-500 text-sm max-w-sm mx-auto">
                        Use the dropdown above to add products, or click "Select All" to add everything at once
                      </p>
                    </div>
                  ) : (
                    <div className="overflow-x-auto">
                      <table className="w-full">
                        <thead className="bg-gray-50 border-b border-gray-200">
                          <tr>
                            <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Product</th>
                            <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Current Stock</th>
                            <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                              Quantity to {bulkOperation === 'restock' ? 'Add' : 'Remove'}
                            </th>
                            <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">After Update</th>
                            <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Action</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                          {bulkSelectedProducts.map((product) => {
                            const update = bulkUpdates[product._id] || { quantity: 0, type: bulkOperation };
                            return (
                              <BulkProductRow
                                key={product._id}
                                product={product}
                                bulkOperation={bulkOperation}
                                update={update}
                                removeProductFromBulk={removeProductFromBulk}
                                updateBulkItem={updateBulkItem}
                              />
                            );
                          })}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>
              </div>

              {/* Footer with Summary */}
              <div className="border-t border-gray-200 bg-white">
                {/* Summary Stats */}
                <div className="px-6 py-3 bg-gradient-to-r from-purple-50 via-white to-purple-50 border-b border-gray-100 grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div>
                    <p className="text-xs text-gray-500 font-medium">Products Selected</p>
                    <p className="text-lg font-bold text-purple-700">
                      {bulkSelectedProducts.filter(product => product.watts !== "All watts").length}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 font-medium">Operation</p>
                    <p className={`text-lg font-bold capitalize ${
                      bulkOperation === 'restock' ? 'text-green-600' : 'text-red-600'
                    }`}>
                      {bulkOperation === 'restock' ? '➕ Restock' : '➖ Sale'}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 font-medium">Total Units</p>
                    <p className="text-lg font-bold text-gray-800">
                      {Object.values(bulkUpdates).reduce((sum, u) => sum + Number(u.quantity || 0), 0)}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 font-medium">Items with Changes</p>
                    <p className="text-lg font-bold text-blue-600">
                      {Object.values(bulkUpdates).filter(u => u.quantity > 0).length}
                    </p>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="px-6 py-4 flex gap-3">
                  <button
                    onClick={() => {
                      setShowBulkUpdateModal(false);
                      setBulkSelectedProducts([]);
                      setAvailableProducts([]);
                      setBulkOperation('restock');
                    }}
                    className="px-6 py-2.5 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 font-semibold transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={() => { handleBulkUpdate(); setInvoiceNumber(''); setSelectedDistributor(''); }}
                    disabled={bulkLoading || bulkSelectedProducts.length === 0 || Object.values(bulkUpdates).every(u => !u.quantity)}
                    className={`flex-1 py-2.5 rounded-xl font-semibold transition-all flex items-center justify-center gap-2 shadow-lg ${
                      bulkOperation === 'restock'
                        ? 'bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white shadow-green-500/30'
                        : 'bg-gradient-to-r from-red-500 to-rose-600 hover:from-red-600 hover:to-rose-700 text-white shadow-red-500/30'
                    } disabled:from-gray-300 disabled:to-gray-400 disabled:shadow-none disabled:cursor-not-allowed`}
                  >
                    {bulkLoading ? (
                      <>
                        <LoaderCircle className="w-5 h-5 animate-spin" />
                        Updating {bulkSelectedProducts.length} products...
                      </>
                    ) : (
                      <>
                        <Save className="w-5 h-5" />
                        Apply {bulkOperation === 'restock' ? 'Restock' : 'Sale'} ({bulkSelectedProducts.length} products)
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
            
            {/* Animation styles */}
            <style>{`
              @keyframes fadeIn {
                from { opacity: 0; }
                to { opacity: 1; }
              }
              .animate-fadeIn { animation: fadeIn 0.2s ease-out; }
            `}</style>
          </div>
        )}
      </div>
    </div>
  );
}