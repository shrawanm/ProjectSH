import { useState, useEffect } from 'react';
import { AnimatePresence } from 'framer-motion';
import { 
  Package, ShoppingCart, Users, Search, Plus, Edit2, 
  Trash2, Filter, AlertCircle, ChevronRight, Settings 
} from 'lucide-react';
import { Product, User, Order } from './AdminTypes';
import { ProductModal } from './ProductModal';

export function AdminDashboard() {
  const [activeTab, setActiveTab] = useState('products');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<'add' | 'edit'>('add');
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [productList, setProductList] = useState<Product[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [searchQuery, setSearchQuery] = useState('');

  // mock datas
  const orders: Order[] = [
    { id: 'ORD-2024-001', customer: 'Anish Dahal', date: '2024-03-20', total: 12500, status: 'Delivered', items: 3 },
    { id: 'ORD-2024-002', customer: 'Sita Sharma', date: '2024-03-21', total: 4500, status: 'Processing', items: 1 }
  ];

  const fetchProducts = async () => {
    try {
      const res = await fetch('http://localhost/ShrawanHandicraftsFYP/backend/api/products.php');
      const data = await res.json();
      setProductList(Array.isArray(data) ? data : []);
    } catch (e) { console.error(e); }
  };

const fetchUsers = async () => {
  try {
    const res = await fetch('http://localhost/ShrawanHandicraftsFYP/backend/api/users.php');
    const data = await res.json();
    
    // Mapping php names to the react names
    const formattedUsers = Array.isArray(data) ? data.map((u: any) => ({
      id: u.id,
      name: u.name,
      email: u.email,
      // map registration_method from PHP to registrationMethod for react
      registrationMethod: u.registration_method, 
      status: u.status,
      joined: u.created_at
    })) : [];

    setUsers(formattedUsers);
  } catch (e) { 
    console.error(e); 
  }
};

  useEffect(() => { fetchProducts(); fetchUsers(); }, []);


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
    switch (activeTab) {
      case 'products':
        return (
          <div className="space-y-6">
            <div className="flex flex-col md:flex-row justify-between items-center gap-4">
              <div className="relative w-full md:w-96">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-secondary" />
                <input type="text" placeholder="Search inventory..." className="w-full pl-10 pr-4 py-2.5 bg-white dark:bg-bg-card border border-gray-200 dark:border-gray-800 rounded-lg outline-none focus:ring-2 focus:ring-accent/10" value={searchQuery} onChange={e => setSearchQuery(e.target.value)} />
              </div>
              <div className="flex gap-2 w-full md:w-auto">
                <button className="flex items-center gap-2 px-4 py-2.5 border border-gray-200 dark:border-gray-800 rounded-lg text-text-secondary hover:bg-gray-50"><Filter className="w-4 h-4" /> Filter</button>
                <button onClick={() => { setSelectedProduct(null); setModalMode('add'); setIsModalOpen(true); }} className="flex-1 md:flex-none flex items-center justify-center gap-2 px-6 py-2.5 bg-accent text-white rounded-lg shadow-lg shadow-accent/20 hover:bg-accent-hover transition-all"><Plus className="w-4 h-4" /> Add Product</button>
              </div>
            </div>

            <div className="bg-white dark:bg-bg-card rounded-xl border border-gray-200 dark:border-gray-800 overflow-hidden shadow-sm">
              <table className="w-full text-left">
                <thead className="bg-gray-50 dark:bg-gray-900/50 text-[11px] uppercase tracking-wider text-text-secondary font-bold">
                  <tr><th className="p-6">Product Image & Name</th><th>Category</th><th>Price</th><th>Stock</th><th className="p-6 text-right">Actions</th></tr>
                </thead>
                <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                  {productList.filter(p => p.name.toLowerCase().includes(searchQuery.toLowerCase())).map(p => (
                    <tr key={p.id} className="group hover:bg-gray-50/50 dark:hover:bg-gray-900/50 transition-colors">
                      <td className="p-6">
                        <div className="flex items-center gap-4">
                          <div className="w-14 h-14 rounded-lg overflow-hidden border border-gray-100 dark:border-gray-800 bg-gray-50">
                            <img src={p.image} className="w-full h-full object-cover" alt={p.name} onError={(e) => (e.currentTarget.src = 'https://via.placeholder.com/150')} />
                          </div>
                          <div><p className="font-serif font-bold text-text-primary">{p.name}</p><p className="text-xs text-text-secondary">{p.material}</p></div>
                        </div>
                      </td>
                      <td className="text-sm text-text-secondary capitalize">{p.category.replace(/-/g, ' ')}</td>
                      <td className="font-medium text-text-primary">Rs. {Number(p.price).toLocaleString()}</td>
                      <td><span className={`px-2 py-1 rounded-full text-[10px] font-bold uppercase ${p.stock < 10 ? 'bg-red-50 text-red-600' : 'bg-green-50 text-green-600'}`}>{p.stock} In Stock</span></td>
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
          <div className="bg-white dark:bg-bg-card rounded-xl border border-gray-200 dark:border-gray-800 overflow-hidden shadow-sm">
            <table className="w-full text-left">
              <thead className="bg-gray-50 dark:bg-gray-900/50 text-[11px] uppercase tracking-wider text-text-secondary font-bold">
                <tr><th className="p-6">Order ID</th><th>Customer</th><th>Date</th><th>Total</th><th>Status</th></tr>
              </thead>
              <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                {orders.map(o => (
                  <tr key={o.id} className="hover:bg-gray-50/50">
                    <td className="p-6 font-mono text-xs font-bold text-accent">{o.id}</td>
                    <td className="font-medium">{o.customer}</td>
                    <td className="text-text-secondary text-sm">{o.date}</td>
                    <td className="font-bold">Rs. {o.total.toLocaleString()}</td>
                    <td><span className={`px-2 py-1 rounded-full text-[10px] font-bold uppercase ${o.status === 'Delivered' ? 'bg-green-50 text-green-600' : 'bg-blue-50 text-blue-600'}`}>{o.status}</span></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        );

      default:
        return <div className="p-20 text-center text-text-secondary"><AlertCircle className="mx-auto mb-4 w-12 h-12 opacity-20" />This section is currently being updated.</div>;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50/50 dark:bg-gray-950 flex text-text-primary">
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
            <button key={item.id} onClick={() => setActiveTab(item.id)} className={`w-full flex items-center gap-4 px-5 py-3.5 rounded-xl text-sm font-medium transition-all ${activeTab === item.id ? 'bg-accent text-white shadow-lg shadow-accent/30' : 'text-text-secondary hover:bg-gray-50 dark:hover:bg-gray-900'}`}>
              <item.icon className="w-5 h-5" /> {item.label}
            </button>
          ))}
        </nav>
      </aside>

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
    </div>
  );
}
