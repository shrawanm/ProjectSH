import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { Package, Plus, Edit2, Trash2, Search, LogOut, CheckCircle2, Clock, XCircle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { Product } from './AdminTypes';
import { ProductModal } from './ProductModal';

export function SellerDashboard() {
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const [activeTab, setActiveTab] = useState('products');
  const [searchQuery, setSearchQuery] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<'add' | 'edit'>('add');
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [productList, setProductList] = useState<Product[]>([]);

  useEffect(() => {
    if (!user) {
      navigate('/login');
    } else if (user.role !== 'seller') {
      alert('Only sellers can access this dashboard. Please create a seller account.');
      navigate('/');
    }
  }, [user, navigate]);

  const fetchSellerProducts = async () => {
    try {
      if (!user) return;
      const res = await fetch(`http://localhost/ShrawanHandicraftsFYP/backend/api/products.php?seller_id=${user.id}`);
      const data = await res.json();
      setProductList(Array.isArray(data) ? data : []);
    } catch (e) {
      console.error("Product Fetch Error:", e);
    }
  };

  useEffect(() => {
    fetchSellerProducts();
  }, [user]);

  const handleAddProduct = () => {
    setSelectedProduct(null);
    setModalMode('add');
    setIsModalOpen(true);
  };

  const handleEditProduct = (product: Product) => {
    setSelectedProduct(product);
    setModalMode('edit');
    setIsModalOpen(true);
  };

  const handleDeleteProduct = async (id: number) => {
    if (!window.confirm('Are you sure you want to delete this product?')) return;

    try {
      const res = await fetch(`http://localhost/ShrawanHandicraftsFYP/backend/api/products.php?id=${id}`, {
        method: 'DELETE'
      });
      const data = await res.json();
      if (data.status === 'success') {
        setProductList(prev => prev.filter(p => p.id !== id));
        alert('Product deleted successfully');
      }
    } catch (e) {
      console.error("Delete Error:", e);
      alert('Failed to delete product');
    }
  };

  const handleModalSave = async (productData: any) => {
    if (modalMode === 'add') {
      //add seller_id to the product data
      productData.seller_id = user?.id;
      productData.approval_status = 'pending';
    }

    try {
      const method = modalMode === 'add' ? 'POST' : 'PUT';
      const res = await fetch('http://localhost/ShrawanHandicraftsFYP/backend/api/products.php', {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(productData)
      });
      const data = await res.json();
      if (data.status === 'success') {
        alert('Product saved successfully!');
        setIsModalOpen(false);
        fetchSellerProducts();
      } else {
        alert('Error saving product: ' + (data.message || 'Unknown error'));
      }
    } catch (e) {
      console.error("Save Error:", e);
      alert('Failed to save product');
    }
  };

  // Filter products based on active tab
  const filteredProducts = productList.filter(p => {
    const matchesSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase());

    if (activeTab === 'products') return matchesSearch;
    if (activeTab === 'pending') return (p.approval_status === 'pending' || p.approval_status === 'rejected') && matchesSearch;
    return matchesSearch;
  });

  const pendingCount = productList.filter(p => p.approval_status === 'pending').length;
  const approvedCount = productList.filter(p => p.approval_status === 'approved').length;

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'approved':
        return <span className="inline-flex items-center gap-1 px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-medium"><CheckCircle2 size={16} /> Approved</span>;
      case 'pending':
        return <span className="inline-flex items-center gap-1 px-3 py-1 bg-yellow-100 text-yellow-800 rounded-full text-sm font-medium"><Clock size={16} /> Pending</span>;
      case 'rejected':
        return <span className="inline-flex items-center gap-1 px-3 py-1 bg-red-100 text-red-800 rounded-full text-sm font-medium"><XCircle size={16} /> Rejected</span>;
      default:
        return <span className="text-gray-500 text-sm">Unknown</span>;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <AnimatePresence>
        {isModalOpen && (
          <ProductModal
            onClose={() => setIsModalOpen(false)}
            mode={modalMode}
            product={selectedProduct}
            onSave={handleModalSave}
          />
        )}
      </AnimatePresence>

      {/* Header */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Seller Dashboard</h1>
              <p className="text-gray-600">Welcome, {user?.name}</p>
            </div>
            <button
              onClick={() => {
                logout();
                navigate('/');
              }}
              className="flex items-center gap-2 px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition"
            >
              <LogOut size={20} />
              Logout
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">Total Products</p>
                <p className="text-3xl font-bold text-gray-900">{productList.length}</p>
              </div>
              <Package className="text-emerald-600" size={32} />
            </div>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">Approved</p>
                <p className="text-3xl font-bold text-green-600">{approvedCount}</p>
              </div>
              <CheckCircle2 className="text-green-600" size={32} />
            </div>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">Pending Approval</p>
                <p className="text-3xl font-bold text-yellow-600">{pendingCount}</p>
              </div>
              <Clock className="text-yellow-600" size={32} />
            </div>
          </motion.div>
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-lg shadow">
          <div className="border-b border-gray-200">
            <div className="flex">
              {[
                { id: 'products', label: 'My Products', icon: Package },
                { id: 'pending', label: 'Pending Approval', icon: Clock }
              ].map(tab => (
                <button
                  key={tab.id}
                  onClick={() => {
                    setActiveTab(tab.id);
                    setSearchQuery('');
                  }}
                  className={`px-6 py-4 font-medium border-b-2 transition flex items-center gap-2 ${
                    activeTab === tab.id
                      ? 'border-emerald-600 text-emerald-600'
                      : 'border-transparent text-gray-600 hover:text-gray-900'
                  }`}
                >
                  <tab.icon size={20} />
                  {tab.label}
                </button>
              ))}
            </div>
          </div>

          <div className="p-6">
            {/* Search & Add Button */}
            <div className="flex gap-4 mb-6">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-3 text-gray-400" size={20} />
                <input
                  type="text"
                  placeholder="Search products..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none"
                />
              </div>
              {activeTab === 'products' && (
                <button
                  onClick={handleAddProduct}
                  className="flex items-center gap-2 px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition font-medium"
                >
                  <Plus size={20} />
                  Add Product
                </button>
              )}
            </div>

            {/* Products Table */}
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Product Name</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Category</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Price</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Status</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  <AnimatePresence>
                    {filteredProducts.length > 0 ? (
                      filteredProducts.map((product, index) => (
                        <motion.tr
                          key={product.id}
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          exit={{ opacity: 0 }}
                          transition={{ delay: index * 0.05 }}
                          className="hover:bg-gray-50 transition"
                        >
                          <td className="px-6 py-4 text-sm text-gray-900 font-medium">{product.name}</td>
                          <td className="px-6 py-4 text-sm text-gray-600">{product.category}</td>
                          <td className="px-6 py-4 text-sm text-gray-900 font-semibold">Rs. {product.price}</td>
                          <td className="px-6 py-4 text-sm">{getStatusBadge(product.approval_status || 'pending')}</td>
                          <td className="px-6 py-4 text-sm">
                            <div className="flex gap-2">
                              <button
                                onClick={() => handleEditProduct(product)}
                                className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition"
                                title="Edit"
                              >
                                <Edit2 size={18} />
                              </button>
                              <button
                                onClick={() => handleDeleteProduct(product.id)}
                                className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition"
                                title="Delete"
                              >
                                <Trash2 size={18} />
                              </button>
                            </div>
                          </td>
                        </motion.tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan={5} className="px-6 py-8 text-center text-gray-600">
                          <div className="flex flex-col items-center justify-center">
                            <Package className="text-gray-400 mb-2" size={32} />
                            <p>
                              {activeTab === 'pending'
                                ? 'No pending products'
                                : 'No products yet. Add your first product!'}
                            </p>
                          </div>
                        </td>
                      </tr>
                    )}
                  </AnimatePresence>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
