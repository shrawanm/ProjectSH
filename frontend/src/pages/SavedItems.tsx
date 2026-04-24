import { motion } from 'framer-motion';
import { Heart, ShoppingBag, Trash2 } from 'lucide-react';
import { products } from '../data/mockData';
import { useCart } from '../context/CartContext';
import { Link } from 'react-router-dom';
export function SavedItems() {
  const {
    addToCart
  } = useCart();
  // Mock saved items - in real app would come from context/API
  const savedProducts = products.slice(0, 3);
  return <div className="min-h-screen pt-24 pb-12 bg-bg-light dark:bg-bg-dark px-4">
      <div className="max-w-7xl mx-auto">
        <h1 className="font-serif text-3xl font-bold text-text-primary mb-8">
          Saved Items
        </h1>

        {savedProducts.length > 0 ? <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {savedProducts.map((product, index) => <motion.div key={product.id} initial={{
          opacity: 0,
          y: 20
        }} animate={{
          opacity: 1,
          y: 0
        }} transition={{
          delay: index * 0.1
        }} className="bg-bg-card dark:bg-bg-card rounded-lg overflow-hidden shadow-sm border border-gray-100 dark:border-gray-800 flex flex-col">
                <div className="relative aspect-[4/3] overflow-hidden">
                  <img src={product.image} alt={product.name} className="w-full h-full object-cover hover:scale-105 transition-transform duration-500" />
                  <button className="absolute top-3 right-3 p-2 bg-white/90 dark:bg-black/50 backdrop-blur-sm rounded-full text-red-500 hover:bg-red-500 hover:text-white transition-colors">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>

                <div className="p-4 flex-1 flex flex-col">
                  <Link to={`/product/${product.id}`}>
                    <h3 className="font-serif text-lg font-medium text-text-primary hover:text-accent transition-colors mb-2">
                      {product.name}
                    </h3>
                  </Link>
                  <p className="text-text-secondary text-sm mb-4 line-clamp-2">
                    {product.description}
                  </p>

                  <div className="mt-auto flex items-center justify-between">
                    <span className="font-semibold text-text-primary">
                      Rs. {product.price.toLocaleString()}
                    </span>
                    <button onClick={() => addToCart(product)} className="flex items-center gap-2 px-4 py-2 bg-accent text-white text-sm font-medium rounded-md hover:bg-accent-hover transition-colors">
                      <ShoppingBag className="w-4 h-4" />
                      Add to Cart
                    </button>
                  </div>
                </div>
              </motion.div>)}
          </div> : <div className="text-center py-20">
            <Heart className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h2 className="text-xl font-medium text-text-primary mb-2">
              No saved items yet
            </h2>
            <p className="text-text-secondary mb-6">
              Start exploring our collections and save your favorites!
            </p>
            <Link to="/collections" className="btn-primary inline-block">
              Explore Collections
            </Link>
          </div>}
      </div>
    </div>;
}