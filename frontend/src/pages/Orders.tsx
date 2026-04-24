import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ChevronRight, Clock, CheckCircle, Truck, Package, AlertCircle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';

export function Orders() {
  const { user } = useAuth();
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!user?.email) return;

    const fetchOrders = async () => {
      try {
        const res = await fetch(`http://localhost/ShrawanHandicraftsFYP/backend/api/get_orders.php?email=${user.email}`);
        const data = await res.json();
        setOrders(Array.isArray(data) ? data : []);
      } catch (err) {
        setError('Failed to load orders. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [user]);

  const getStatusColor = (status: string) => {
    switch (status?.toLowerCase()) {
      case 'delivered':
        return 'text-green-600 bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800';
      case 'active':
        return 'text-blue-600 bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800';
      case 'pending':
        return 'text-yellow-600 bg-yellow-50 dark:bg-yellow-900/20 border-yellow-200 dark:border-yellow-800';
      default:
        return 'text-gray-600 bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status?.toLowerCase()) {
      case 'delivered':
        return <CheckCircle className="w-4 h-4" />;
      case 'active':
        return <Truck className="w-4 h-4" />;
      default:
        return <Clock className="w-4 h-4" />;
    }
  };

  if (loading) return (
    <div className="min-h-screen pt-24 flex items-center justify-center">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-accent"></div>
    </div>
  );

  return (
    <div className="min-h-screen pt-24 pb-12 bg-bg-light dark:bg-bg-dark px-4">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <h1 className="font-serif text-3xl font-bold text-text-primary">My Orders</h1>
          <span className="px-3 py-1 bg-accent/10 text-accent text-xs font-bold rounded-full uppercase tracking-widest">
            {orders.length} TOTAL
          </span>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-50 text-red-600 rounded-xl flex items-center gap-3">
            <AlertCircle /> {error}
          </div>
        )}

        <div className="space-y-6">
          {orders.length > 0 ? (
            orders.map((order, index) => (
              <motion.div
                key={order.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-bg-card rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800 overflow-hidden"
              >
                <div className="p-6">
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
                    <div>
                      <div className="flex items-center gap-3 mb-1">
                        <span className="font-mono text-sm text-text-secondary font-bold">
                          #ORD-{order.id.toString().padStart(4, '0')}
                        </span>
                        <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase border flex items-center gap-1.5 ${getStatusColor(order.status)}`}>
                          {getStatusIcon(order.status)}
                          {order.status || 'Pending'}
                        </span>
                      </div>
                      <p className="text-xs text-text-muted">
                        Placed on {new Date(order.created_at).toLocaleDateString(undefined, { dateStyle: 'long' })}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-[10px] uppercase font-bold text-text-secondary tracking-widest">Price Paid</p>
                      <p className="font-black text-xl text-text-primary mt-0.5">
                        Rs. {Number(order.total_amount).toLocaleString()}
                      </p>
                    </div>
                  </div>

                  <div className="border-t border-gray-50 dark:border-gray-800 pt-6">
                    <div className="flex flex-col sm:flex-row gap-6">
                      <div className="flex -space-x-4 overflow-hidden py-1">
                        {order.cart_items?.map((item: any, i: number) => (
                          <img
                            key={i}
                            src={item.image}
                            alt={item.name}
                            className="inline-block h-14 w-14 rounded-xl ring-4 ring-white dark:ring-bg-card object-cover bg-gray-50"
                          />
                        ))}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-bold text-text-primary">
                          {order.cart_items?.length} {order.cart_items?.length === 1 ? 'item' : 'items'}
                        </p>
                        <p className="text-xs text-text-secondary truncate mt-1">
                          {order.cart_items?.map((item: any) => item.name).join(', ')}
                        </p>
                      </div>
                      <button className="flex items-center gap-1 text-xs font-black text-accent hover:text-accent-hover self-start sm:self-center uppercase tracking-widest bg-accent/5 px-4 py-2 rounded-lg transition-colors">
                        View Details <ChevronRight className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))
          ) : (
            <div className="text-center py-20 bg-bg-card rounded-2xl border border-dashed border-gray-200 dark:border-gray-800">
              <Package className="w-12 h-12 text-text-muted mx-auto mb-4 opacity-20" />
              <p className="text-text-secondary font-medium">No orders found yet.</p>
              <Link to="/collections" className="text-accent text-sm font-bold mt-2 hover:underline inline-block">Start Shopping</Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}