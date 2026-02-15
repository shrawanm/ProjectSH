import { useState, useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { 
  Package, ShoppingCart, Users, Search, Plus, Edit2, 
  Trash2, Filter, AlertCircle, ChevronRight, Settings,
  Eye, X, Mail, Phone, MapPin, Calendar,
} from 'lucide-react';
import { Product, User } from './AdminTypes';
import { ProductModal } from './ProductModal';

export function AdminDashboard() {
  // Tabs & UI State
  const [activeTab, setActiveTab] = useState('products');
  const [searchQuery, setSearchQuery] = useState('');
  
  // Product States
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<'add' | 'edit'>('add');
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [productList, setProductList] = useState<Product[]>([]);
  
  // User States
  const [users, setUsers] = useState<User[]>([]);
  
  // Order States
  const [orders, setOrders] = useState<any[]>([]);
  const [selectedOrder, setSelectedOrder] = useState<any | null>(null);

  const fetchProducts = async () => {
    try {
      const res = await fetch('http://localhost/ShrawanHandicraftsFYP/backend/api/products.php');
      const data = await res.json();
      setProductList(Array.isArray(data) ? data : []);
    } catch (e) { console.error("Product Fetch Error:", e); }
  };

  const fetchUsers = async () => {
    try {
      const res = await fetch('http://localhost/ShrawanHandicraftsFYP/backend/api/users.php');
      const data = await res.json();
      const formattedUsers = Array.isArray(data) ? data.map((u: any) => ({
        id: u.id,
        name: u.name,
        email: u.email,
        registrationMethod: u.registration_method, 
        status: u.status,
        joined: u.created_at
      })) : [];
      setUsers(formattedUsers);
    } catch (e) { console.error("User Fetch Error:", e); }
  };

  const fetchOrders = async () => {
    try {
      // fetchs users orders data using get_orders.php
      const res = await fetch('http://localhost/ShrawanHandicraftsFYP/backend/api/get_orders.php');
      const data = await res.json();
      setOrders(Array.isArray(data) ? data : []);
    } catch (e) { console.error("Order Fetch Error:", e); }
  };

  useEffect(() => { 
    fetchProducts(); 
    fetchUsers(); 
    fetchOrders(); 
  }, []);


  const handleDeleteProduct = async (id: number) => {
    if (!window.confirm('Delete this product permanently?')) return;
    try {
      const res = await fetch(`http://localhost/ShrawanHandicraftsFYP/backend/api/products.php?id=${id}`, { method: 'DELETE' });
      if (res.ok) fetchProducts();
    } catch (e) { alert("Failed to delete product"); }
  };

  const handleDeleteUser = async (id: number) => {
    if (!window.confirm('Delete this user account?')) return;
    try {
      const res = await fetch(`http://localhost/ShrawanHandicraftsFYP/backend/api/users.php?id=${id}`, { method: 'DELETE' });
      if (res.ok) fetchUsers();
    } catch (e) { alert("Failed to delete user"); }
  };


  const renderContent = () => {
    // Shared Search Logic for Products & Orders
    const filteredProducts = productList.filter(p => p.name.toLowerCase().includes(searchQuery.toLowerCase()));
    const filteredOrders = orders.filter(o => 
      o.first_name.toLowerCase().includes(searchQuery.toLowerCase()) || 
      o.id.toString().includes(searchQuery)
    );

    switch (activeTab) {
      case 'products':
        return (
          <div className="space-y-6">
            <div className="flex flex-col md:flex-row justify-between items-center gap-4">
              <div className="relative w-full md:w-96">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-secondary" />
                <input 
                  type="text" 
                  placeholder="Search inventory..." 
                  className="w-full pl-10 pr-4 py-2.5 bg-white dark:bg-bg-card border border-gray-200 dark:border-gray-800 rounded-lg outline-none focus:ring-2 focus:ring-accent/10" 
                  value={searchQuery} 
                  onChange={e => setSearchQuery(e.target.value)} 
                />
              </div>
              <div className="flex gap-2 w-full md:w-auto">
                <button className="flex items-center gap-2 px-4 py-2.5 border border-gray-200 dark:border-gray-800 rounded-lg text-text-secondary hover:bg-gray-50"><Filter className="w-4 h-4" /> Filter</button>
                <button onClick={() => { setSelectedProduct(null); setModalMode('add'); setIsModalOpen(true); }} className="flex-1 md:flex-none flex items-center justify-center gap-2 px-6 py-2.5 bg-accent text-white rounded-lg shadow-lg shadow-accent/20 hover:bg-accent-hover transition-all"><Plus className="w-4 h-4" /> Add Product</button>
              </div>
            </div>

            <div className="bg-white dark:bg-bg-card rounded-xl border border-gray-200 dark:border-gray-800 overflow-hidden shadow-sm">
              <table className="w-full text-left">
                <thead className="bg-gray-50 dark:bg-gray-900/50 text-[11px] uppercase tracking-wider text-text-secondary font-bold">
                  <tr><th className="p-6">Product</th><th>Category</th><th>Price</th><th>Stock</th><th className="p-6 text-right">Actions</th></tr>
                </thead>
                <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                  {filteredProducts.map(p => (
                    <tr key={p.id} className="group hover:bg-gray-50/50 dark:hover:bg-gray-900/50 transition-colors">
                      <td className="p-6">
                        <div className="flex items-center gap-4">
                          <img src={p.image} className="w-12 h-12 rounded-lg object-cover border border-gray-100 dark:border-gray-800" alt="" />
                          <div><p className="font-serif font-bold text-text-primary">{p.name}</p><p className="text-xs text-text-secondary">{p.material}</p></div>
                        </div>
                      </td>
                      <td className="text-sm text-text-secondary capitalize">{p.category.replace(/-/g, ' ')}</td>
                      <td className="font-medium text-text-primary">Rs. {Number(p.price).toLocaleString()}</td>
                      <td>
                        <span className={`px-2 py-1 rounded-full text-[10px] font-bold uppercase ${p.stock < 10 ? 'bg-red-50 text-red-600' : 'bg-green-50 text-green-600'}`}>
                          {p.stock} In Stock
                        </span>
                      </td>
                      <td className="p-6 text-right space-x-2">
                        <button onClick={() => { setSelectedProduct(p); setModalMode('edit'); setIsModalOpen(true); }} className="p-2 text-text-secondary hover:text-accent hover:bg-accent/5 rounded-lg transition-all"><Edit2 className="w-4 h-4" /></button>
                        <button onClick={() => handleDeleteProduct(p.id)} className="p-2 text-text-secondary hover:text-red-600 hover:bg-red-50 rounded-lg transition-all"><Trash2 className="w-4 h-4" /></button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        );

      case 'users':
        return (
          <div className="bg-white dark:bg-bg-card rounded-xl border border-gray-200 dark:border-gray-800 overflow-hidden shadow-sm">
            <table className="w-full text-left">
              <thead className="bg-gray-50 dark:bg-gray-900/50 text-[11px] uppercase tracking-wider text-text-secondary font-bold">
                <tr><th className="p-6">Customer</th><th>Email</th><th>Registration</th><th>Status</th><th className="p-6 text-right">Actions</th></tr>
              </thead>
              <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                {users.map(u => (
                  <tr key={u.id} className="hover:bg-gray-50/50 dark:hover:bg-gray-900/50">
                    <td className="p-6 flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-accent/10 flex items-center justify-center text-accent font-bold">{u.name.charAt(0)}</div>
                      <span className="font-medium text-text-primary">{u.name}</span>
                    </td>
                    <td className="text-text-secondary text-sm">{u.email}</td>
                    <td className="text-text-secondary text-sm">{u.registrationMethod || 'Email'}</td>
                    <td><span className="px-2 py-1 bg-green-50 text-green-600 rounded-full text-[10px] font-bold uppercase">Active</span></td>
                    <td className="p-6 text-right">
                      <button onClick={() => handleDeleteUser(u.id)} className="p-2 text-text-secondary hover:text-red-600 transition-all"><Trash2 className="w-4 h-4" /></button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        );

      case 'orders':
        return (
          <div className="space-y-6">
            <div className="relative w-full md:w-96">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-secondary" />
                <input 
                  type="text" 
                  placeholder="Search by name or order ID..." 
                  className="w-full pl-10 pr-4 py-2.5 bg-white dark:bg-bg-card border border-gray-200 dark:border-gray-800 rounded-lg outline-none" 
                  value={searchQuery} 
                  onChange={e => setSearchQuery(e.target.value)} 
                />
            </div>
            <div className="bg-white dark:bg-bg-card rounded-xl border border-gray-200 dark:border-gray-800 overflow-hidden shadow-sm">
              <table className="w-full text-left">
                <thead className="bg-gray-50 dark:bg-gray-900/50 text-[11px] uppercase tracking-wider text-text-secondary font-bold">
                  <tr>
                    <th className="p-6">Order ID</th>
                    <th>Customer</th>
                    <th>Date</th>
                    <th>Total</th>
                    <th>Status</th>
                    
                    <th className="p-6 text-right">Details</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                  {filteredOrders.map(o => (
                    <tr key={o.id} className="hover:bg-gray-50/50 transition-colors">
                      <td className="p-6 font-mono text-xs font-bold text-accent">ORD-{o.id.toString().padStart(4, '0')}</td>
                      <td className="font-medium">
                        <p className="text-sm">{o.first_name} {o.last_name}</p>
                        <p className="text-[10px] text-text-secondary">{o.user_email}</p>
                      </td>
                      <td className="text-text-secondary text-sm">{new Date(o.created_at).toLocaleDateString()}</td>
                      <td className="font-bold">Rs. {Number(o.total_amount).toLocaleString()}</td>
                      <td>
                        <span className={`px-2 py-1 rounded-full text-[10px] font-bold uppercase ${
                          o.status === 'completed' ? 'bg-green-50 text-green-600' : 'bg-amber-50 text-amber-600'
                        }`}>
                          {o.status}
                        </span>
                      </td>
                      <td className="p-6 text-right">
                        <button 
                          onClick={() => setSelectedOrder(o)}
                          className="p-2 text-accent hover:bg-accent/5 rounded-lg transition-all"
                        >
                          <Eye className="w-5 h-5" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        );

      default:
        return <div className="p-20 text-center text-text-secondary"><AlertCircle className="mx-auto mb-4 w-12 h-12 opacity-20" />This section is currently being updated.</div>;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50/50 dark:bg-gray-950 flex text-text-primary">
      {/* SIDEBAR */}
      <aside className="w-64 bg-white dark:bg-bg-card border-r border-gray-200 dark:border-gray-800 fixed h-full flex flex-col z-20 shadow-xl shadow-gray-200/50 dark:shadow-none">
        <div className="p-8">
          <h1 className="text-2xl font-serif font-bold text-text-primary tracking-tight">SHRAWAN</h1>
          <div className="h-1 w-12 bg-accent mt-1 rounded-full"></div>
        </div>
        <nav className="flex-1 px-4 space-y-1">
          {[
            { id: 'products', label: 'Inventory', icon: Package },
            { id: 'orders', label: 'Orders', icon: ShoppingCart },
            { id: 'users', label: 'Customers', icon: Users },
            { id: 'settings', label: 'Store Settings', icon: Settings },
          ].map(item => (
            <button key={item.id} onClick={() => { setActiveTab(item.id); setSearchQuery(''); }} className={`w-full flex items-center gap-4 px-5 py-3.5 rounded-xl text-sm font-medium transition-all ${activeTab === item.id ? 'bg-accent text-white shadow-lg shadow-accent/30' : 'text-text-secondary hover:bg-gray-50 dark:hover:bg-gray-900'}`}>
              <item.icon className="w-5 h-5" /> {item.label}
            </button>
          ))}
        </nav>
      </aside>

      {/* MAIN VIEW */}
      <main className="flex-1 ml-64 min-h-screen flex flex-col">
        <header className="h-20 bg-white/80 dark:bg-bg-card/80 backdrop-blur-md border-b border-gray-200 dark:border-gray-800 flex items-center justify-between px-10 sticky top-0 z-10">
          <div className="flex items-center gap-2 text-text-secondary">
            <span className="text-sm font-medium text-text-primary capitalize">{activeTab}</span>
            <ChevronRight className="w-4 h-4 opacity-30" />
            <span className="text-sm opacity-60">Management</span>
          </div>
          <div className="flex items-center gap-6">
            <div className="flex flex-col items-end"><p className="text-sm font-bold">Admin User</p><p className="text-[10px] text-accent font-bold uppercase tracking-widest">Super Admin</p></div>
            <div className="w-10 h-10 rounded-full bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-800"></div>
          </div>
        </header>

        <div className="p-10">{renderContent()}</div>
      </main>

      {/* PRODUCT MODAL */}
      <AnimatePresence>
        {isModalOpen && (
          <ProductModal mode={modalMode} product={selectedProduct} onClose={() => setIsModalOpen(false)} onSave={async (data: Product) => {
            const method = modalMode === 'add' ? 'POST' : 'PUT';
            try {
              const res = await fetch('http://localhost/ShrawanHandicraftsFYP/backend/api/products.php', {
                method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data)
              });
              if (res.ok) { fetchProducts(); setIsModalOpen(false); }
            } catch (e) { console.error(e); }
          }} />
        )}
      </AnimatePresence>

      {/* ORDER DETAILS MODAL */}
      <AnimatePresence>
        {selectedOrder && (
          <div className="fixed inset-0 z-[120] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="bg-white dark:bg-bg-card w-full max-w-3xl rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
            >
              <div className="p-6 border-b border-gray-100 dark:border-gray-800 flex justify-between items-center bg-gray-50/50 dark:bg-gray-900/50">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-accent/10 rounded-lg text-accent"><ShoppingCart className="w-5 h-5"/></div>
                  <h3 className="font-serif text-xl font-bold text-text-primary">Order #ORD-{selectedOrder.id}</h3>
                </div>
                <button onClick={() => setSelectedOrder(null)} className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-colors"><X className="w-5 h-5"/></button>
              </div>
              
              <div className="flex-1 overflow-y-auto p-8 space-y-8">
                {/* Section: Top Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="p-4 bg-gray-50 dark:bg-gray-900/40 rounded-xl border border-gray-100 dark:border-gray-800">
                    <h4 className="text-[10px] uppercase tracking-widest text-accent font-bold mb-3 flex items-center gap-2"><Mail className="w-3 h-3"/> Customer Profile</h4>
                    <p className="font-bold text-text-primary text-lg">{selectedOrder.first_name} {selectedOrder.last_name}</p>
                    <p className="text-sm text-text-secondary mt-1">{selectedOrder.user_email}</p>
                    <p className="text-sm text-text-secondary flex items-center gap-2 mt-1"><Phone className="w-3 h-3"/> {selectedOrder.phone}</p>
                  </div>
                  <div className="p-4 bg-gray-50 dark:bg-gray-900/40 rounded-xl border border-gray-100 dark:border-gray-800">
                    <h4 className="text-[10px] uppercase tracking-widest text-accent font-bold mb-3 flex items-center gap-2"><MapPin className="w-3 h-3"/> Shipping Address</h4>
                    <p className="text-sm text-text-secondary leading-relaxed">
                      {selectedOrder.address}<br />
                      {selectedOrder.city}, {selectedOrder.postal_code}<br />
                      <span className="font-bold text-text-primary">{selectedOrder.country}</span>
                    </p>
                  </div>
                </div>

                {/* Section: Products List */}
                <div>
                  <h4 className="text-[10px] uppercase tracking-widest text-accent font-bold mb-4 flex items-center gap-2"><Package className="w-3 h-3"/> Ordered Items</h4>
                  <div className="space-y-3">
                    {selectedOrder.cart_items.map((item: any, idx: number) => (
                      <div key={idx} className="flex justify-between items-center p-4 bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-xl">
                        <div className="flex gap-4">
                          <img src={item.image} className="w-14 h-14 rounded-lg object-cover bg-gray-100" alt="" />
                          <div>
                            <p className="font-bold text-text-primary">{item.name}</p>
                            <div className="flex gap-2 mt-1">
                              {item.variant?.color && <span className="text-[10px] px-2 py-0.5 bg-gray-100 dark:bg-gray-800 rounded">{item.variant.color}</span>}
                              {item.variant?.size && <span className="text-[10px] px-2 py-0.5 bg-gray-100 dark:bg-gray-800 rounded">{item.variant.size}</span>}
                            </div>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="font-bold text-accent">Rs. {item.price.toLocaleString()}</p>
                          <p className="text-xs text-text-muted font-medium">Quantity: {item.quantity}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Modal Footer */}
              <div className="p-6 border-t border-gray-100 dark:border-gray-800 bg-gray-50/50 dark:bg-gray-900/50 flex flex-col md:flex-row justify-between items-center gap-4">
                <div className="flex items-center gap-4">
                  <div className="flex flex-col">
                    <span className="text-[10px] uppercase font-bold text-text-muted">Order Date</span>
                    <span className="text-xs font-medium flex items-center gap-1"><Calendar className="w-3 h-3"/> {new Date(selectedOrder.created_at).toLocaleString()}</span>
                  </div>
                </div>
                <div className="flex items-center gap-6">
                  <div className="text-right">
                    <span className="text-[10px] uppercase font-bold text-text-muted">Total Paid</span>
                    <p className="text-2xl font-black text-text-primary">Rs. {Number(selectedOrder.total_amount).toLocaleString()}</p>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}