// components/Inventory/ProductInventory.jsx
import { useState } from 'react';
import { 
  Package, 
  AlertTriangle, 
  XCircle, 
  DollarSign,
  Search,
  Plus,
  Edit2,
  Trash2,
  ChevronLeft,
  ChevronRight,
  TrendingUp,
  TrendingDown,
  Eye
} from 'lucide-react';

// ============= DUMMY DATA =============
const dummyProducts = [
  {
    id: 1,
    name: "LED Light Bulb 9W",
    type: "Lighting",
    price: 12.99,
    stock: 145,
  },
  {
    id: 2,
    name: "Smart LED RGB",
    sku: "LED-RGB-12",
    category: "Lighting",
    description: "Color changing smart bulb",
    price: 24.99,
    cost: 15.00,
    stock: 8,
    minStock: 15,
    maxStock: 200,
    unit: "pcs",
    image: "https://via.placeholder.com/40",
    location: { warehouse: "Main", shelf: "A12", bin: "4" },
    supplier: { name: "LightCorp", contact: "john@lightcorp.com" },
    status: "active",
    lastRestocked: "2024-01-10"
  },
  {
    id: 3,
    name: "Industrial LED 50W",
    sku: "LED-IND-50",
    category: "Lighting",
    description: "High power industrial lighting",
    price: 89.99,
    cost: 55.00,
    stock: 0,
    minStock: 10,
    maxStock: 100,
    unit: "pcs",
    image: "https://via.placeholder.com/40",
    location: { warehouse: "North", shelf: "B05", bin: "2" },
    supplier: { name: "IndustrialLight", contact: "sales@indlight.com" },
    status: "out-of-stock",
    lastRestocked: "2023-12-20"
  },
  {
    id: 4,
    name: "LED Driver 12V",
    sku: "DRV-12V-30",
    category: "Accessories",
    description: "Constant current LED driver",
    price: 18.50,
    cost: 12.00,
    stock: 67,
    minStock: 25,
    maxStock: 300,
    unit: "pcs",
    image: "https://via.placeholder.com/40",
    location: { warehouse: "Main", shelf: "C08", bin: "1" },
    supplier: { name: "PowerTech", contact: "support@powertech.com" },
    status: "active",
    lastRestocked: "2024-01-18"
  },
  {
    id: 5,
    name: "LED Strip 5m",
    sku: "STRIP-5M-RGB",
    category: "Lighting",
    description: "Flexible RGB LED strip",
    price: 34.99,
    cost: 22.00,
    stock: 32,
    minStock: 15,
    maxStock: 150,
    unit: "roll",
    image: "https://via.placeholder.com/40",
    location: { warehouse: "East", shelf: "D03", bin: "5" },
    supplier: { name: "LightCorp", contact: "john@lightcorp.com" },
    status: "active",
    lastRestocked: "2024-01-12"
  },
  {
    id: 6,
    name: "LED Connectors Pack",
    sku: "ACC-CONN-10",
    category: "Accessories",
    description: "10-pack LED connectors",
    price: 9.99,
    cost: 5.00,
    stock: 234,
    minStock: 50,
    maxStock: 1000,
    unit: "pack",
    image: "https://via.placeholder.com/40",
    location: { warehouse: "Main", shelf: "E01", bin: "2" },
    supplier: { name: "AccessoryHub", contact: "orders@accessoryhub.com" },
    status: "active",
    lastRestocked: "2024-01-05"
  },
  {
    id: 7,
    name: "LED Dimmer Switch",
    sku: "SW-DIM-200",
    category: "Accessories",
    description: "Touch dimmer for LED lights",
    price: 28.99,
    cost: 18.00,
    stock: 12,
    minStock: 20,
    maxStock: 200,
    unit: "pcs",
    image: "https://via.placeholder.com/40",
    location: { warehouse: "North", shelf: "F12", bin: "3" },
    supplier: { name: "SwitchMaster", contact: "info@switchmaster.com" },
    status: "active",
    lastRestocked: "2024-01-08"
  },
  {
    id: 8,
    name: "Solar LED Panel",
    sku: "SOL-100W",
    category: "Solar",
    description: "100W solar panel for outdoor lighting",
    price: 149.99,
    cost: 95.00,
    stock: 5,
    minStock: 10,
    maxStock: 50,
    unit: "pcs",
    image: "https://via.placeholder.com/40",
    location: { warehouse: "East", shelf: "G05", bin: "1" },
    supplier: { name: "SolarTech", contact: "sales@solartech.com" },
    status: "low-stock",
    lastRestocked: "2023-12-28"
  }
];

export default function ProductInventory() {
  const [products, setProducts] = useState(dummyProducts);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(5);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [showStockModal, setShowStockModal] = useState(false);
  const [stockUpdate, setStockUpdate] = useState({ type: "restock", quantity: 0, reason: "" });

  // Filter products
  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         product.sku.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === "all" || product.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  // Pagination
  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);
  const paginatedProducts = filteredProducts.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // Statistics
  const stats = {
    total: products.length,
    lowStock: products.filter(p => p.stock > 0 && p.stock <= p.minStock).length,
    outOfStock: products.filter(p => p.stock === 0).length,
    totalValue: products.reduce((sum, p) => sum + (p.stock * p.price), 0)
  };

  const getStockStatus = (product) => {
    if (product.stock === 0) {
      return { label: "Out of Stock", color: "bg-red-100 text-red-700", icon: XCircle };
    }
    if (product.stock <= product.minStock) {
      return { label: "Low Stock", color: "bg-orange-100 text-orange-700", icon: AlertTriangle };
    }
    return { label: "In Stock", color: "bg-green-100 text-green-700", icon: Package };
  };

  const updateStock = () => {
    const productIndex = products.findIndex(p => p.id === selectedProduct.id);
    if (productIndex !== -1) {
      const updatedProducts = [...products];
      if (stockUpdate.type === "restock") {
        updatedProducts[productIndex].stock += stockUpdate.quantity;
      } else {
        updatedProducts[productIndex].stock = Math.max(0, updatedProducts[productIndex].stock - stockUpdate.quantity);
      }
      setProducts(updatedProducts);
      setShowStockModal(false);
      setStockUpdate({ type: "restock", quantity: 0, reason: "" });
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
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
                <p className="text-2xl font-bold text-green-600">${stats.totalValue.toLocaleString()}</p>
              </div>
              <DollarSign className="w-8 h-8 text-green-500 opacity-50" />
            </div>
          </div>
        </div>

        {/* Search and Filter */}
        <div className="bg-white rounded-xl shadow-sm p-4 mb-8">
          <div className="flex flex-wrap gap-4">
            <div className="flex-1 min-w-[200px]">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search products..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">All Categories</option>
              <option value="Lighting">Lighting</option>
              <option value="Accessories">Accessories</option>
              <option value="Solar">Solar</option>
            </select>
            <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2">
              <Plus className="w-4 h-4" />
              Add Product
            </button>
          </div>
        </div>

        {/* Product Table */}
        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Product</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">SKU</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Category</th>
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
                    <tr key={product.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4">
                        <div className="font-medium text-gray-900">{product.name}</div>
                        <div className="text-xs text-gray-500">{product.description?.substring(0, 50)}</div>
                      </td>
                      <td className="px-6 py-4 text-gray-600 text-sm">{product.sku}</td>
                      <td className="px-6 py-4">
                        <span className="px-2 py-1 text-xs rounded-full bg-gray-100 text-gray-600">
                          {product.category}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <div className="w-16 bg-gray-200 rounded-full h-1.5">
                            <div 
                              className="bg-blue-600 h-1.5 rounded-full"
                              style={{ width: `${(product.stock / product.maxStock) * 100}%` }}
                            />
                          </div>
                          <span className="text-sm font-medium">{product.stock}</span>
                        </div>
                       </td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex items-center gap-1 px-2 py-1 text-xs rounded-full ${status.color}`}>
                          <StockIcon className="w-3 h-3" />
                          {status.label}
                        </span>
                       </td>
                      <td className="px-6 py-4 text-gray-900 font-medium">${product.price}</td>
                      <td className="px-6 py-4">
                        <div className="flex gap-2">
                          <button 
                            onClick={() => {
                              setSelectedProduct(product);
                              setShowStockModal(true);
                            }}
                            className="p-1 text-blue-600 hover:bg-blue-50 rounded"
                            title="Update Stock"
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>
                          <button className="p-1 text-green-600 hover:bg-green-50 rounded" title="View Details">
                            <Eye className="w-4 h-4" />
                          </button>
                          <button className="p-1 text-red-600 hover:bg-red-50 rounded" title="Delete">
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                       </td>
                    </tr>
                  );
                })}
              </tbody>
              </table>
            </div>
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
        </div>

        {/* Stock Update Modal */}
        {showStockModal && selectedProduct && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-xl shadow-xl max-w-md w-full mx-4">
              <div className="px-6 py-4 border-b flex justify-between items-center">
                <h3 className="text-lg font-semibold text-gray-900">
                  Update Stock - {selectedProduct.name}
                </h3>
                <button onClick={() => setShowStockModal(false)} className="text-gray-400 hover:text-gray-600">
                  <XCircle className="w-5 h-5" />
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
                      <span>Restock (+)</span>
                    </label>
                    <label className="flex items-center gap-2">
                      <input
                        type="radio"
                        value="sale"
                        checked={stockUpdate.type === "sale"}
                        onChange={(e) => setStockUpdate({ ...stockUpdate, type: e.target.value })}
                        className="text-blue-600"
                      />
                      <span>Sale/Damage (-)</span>
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
                  <label className="block text-sm font-medium text-gray-700 mb-2">Reason</label>
                  <textarea
                    rows="2"
                    value={stockUpdate.reason}
                    onChange={(e) => setStockUpdate({ ...stockUpdate, reason: e.target.value })}
                    placeholder="e.g., Supplier delivery, Customer order, etc."
                    className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div className="flex gap-3">
                  <button
                    onClick={updateStock}
                    disabled={stockUpdate.quantity <= 0}
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
      </div>
  );
}