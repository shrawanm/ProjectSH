import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Trash2, Minus, Plus, ArrowRight, ShoppingBag } from 'lucide-react';
import { useCart } from '../context/CartContext';
export function Cart() {
  const {
    cart,
    removeFromCart,
    updateQuantity,
    cartTotal,
    cartCount
  } = useCart();
  if (cart.length === 0) {
    return <div className="min-h-screen pt-32 pb-12 bg-bg-light dark:bg-bg-dark px-4 flex flex-col items-center justify-center text-center">
      <ShoppingBag className="w-20 h-20 text-gray-300 mb-6" />
      <h1 className="font-serif text-3xl font-bold text-text-primary mb-4">
        Your Cart is Empty
      </h1>
      <p className="text-text-secondary mb-8 max-w-md">
        Looks like you haven't added any products to your
        cart yet.
      </p>
      <Link to="/collections" className="btn-primary">
        Start Shopping
      </Link>
    </div>;
  }
  return <div className="min-h-screen pt-24 pb-12 bg-bg-light dark:bg-bg-dark px-4">
    <div className="max-w-7xl mx-auto">
      <h1 className="font-serif text-3xl font-bold text-text-primary mb-8">
        Shopping Cart ({cartCount})
      </h1>

      <div className="flex flex-col lg:flex-row gap-12">
        {/* Cart Items */}
        <div className="flex-1 space-y-6">
          <AnimatePresence>
            // loops through cart items and displays them
            {cart.map(item => <motion.div key={`${item.id}-${JSON.stringify(item.variant)}`} layout initial={{
              opacity: 0,
              y: 20
            }} animate={{
              opacity: 1,
              y: 0
            }} exit={{
              opacity: 0,
              x: -20
            }} className="flex gap-6 p-4 bg-bg-card dark:bg-bg-card rounded-lg shadow-sm border border-gray-100 dark:border-gray-800">
              <div className="w-24 h-24 flex-shrink-0 rounded-md overflow-hidden bg-gray-100">
                <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
              </div>

              <div className="flex-1 flex flex-col justify-between">
                <div className="flex justify-between items-start">
                  <div>
                    <Link to={`/product/${item.id}`} className="font-serif text-lg font-medium text-text-primary hover:text-accent transition-colors">
                      {item.name}
                    </Link>
                    <div className="text-sm text-text-secondary mt-1 space-x-3">
                      {item.variant?.color && <span className="inline-flex items-center gap-1">
                        <span className="w-3 h-3 rounded-full border border-gray-300" style={{
                          backgroundColor: item.variant.color
                        }}></span>
                        Color
                      </span>}
                      {item.variant?.size && <span>Size: {item.variant.size}</span>}
                    </div>
                  </div>
                  <button onClick={() => removeFromCart(item.id, item.variant)} className="text-text-muted hover:text-red-500 transition-colors p-1">
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>

                <div className="flex justify-between items-end">
                  <div className="flex items-center border border-gray-200 dark:border-gray-700 rounded-md">
                    <button onClick={() => updateQuantity(item.id, item.variant, item.quantity - 1)} className="p-1.5 hover:text-accent transition-colors">
                      <Minus className="w-4 h-4" />
                    </button>
                    <span className="w-8 text-center text-sm font-medium">
                      {item.quantity}
                    </span>
                    <button onClick={() => updateQuantity(item.id, item.variant, item.quantity + 1)} className="p-1.5 hover:text-accent transition-colors">
                      <Plus className="w-4 h-4" />
                    </button>
                  </div>
                  <span className="font-bold text-text-primary">
                    Rs. {(item.price * item.quantity).toLocaleString()}
                  </span>
                </div>
              </div>
            </motion.div>)}
          </AnimatePresence>
        </div>

        {/* Summary */}
        <div className="lg:w-96 flex-shrink-0">
          <div className="bg-bg-card dark:bg-bg-card p-6 rounded-lg shadow-sm border border-gray-100 dark:border-gray-800 sticky top-24">
            <h2 className="font-serif text-xl font-bold text-text-primary mb-6">
              Order Summary
            </h2>

            <div className="space-y-4 mb-6">
              <div className="flex justify-between text-text-secondary">
                <span>Subtotal</span>
                <span>Rs. {cartTotal.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-text-secondary">
                <span>Shipping</span>
                <span>Calculated at checkout</span>
              </div>
              <div className="border-t border-gray-200 dark:border-gray-700 pt-4 flex justify-between font-bold text-lg text-text-primary">
                <span>Total</span>
                <span>Rs. {cartTotal.toLocaleString()}</span>
              </div>
            </div>

            <Link to="/checkout" className="w-full btn-primary flex items-center justify-center gap-2">
              Proceed to Checkout
              <ArrowRight className="w-4 h-4" />
            </Link>

            <div className="mt-6 text-xs text-text-muted text-center">
              <p></p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>;
}