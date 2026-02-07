import { Link } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';
import { motion } from 'framer-motion';
import { categories } from '../data/mockData';
import { ProductCard } from '../components/ProductCard';
import { useProductHook } from './productHook';

export function ViscoseProducts() {
  const categoryMetadata = categories.find(c => c.id === 'viscose');
  const { products: dbProducts, loading } = useProductHook('category', 'viscose');

  const pageTitle = categoryMetadata?.name || 'Viscos Collection';
  const pageDesc = categoryMetadata?.description || 'Soft, versatile fabrics and blends handcrafted with care.';

  if (loading) return (
    <div className="min-h-screen pt-40 text-center font-serif text-xl animate-pulse text-accent">
      Loading Viscos Collection...
    </div>
  );

  return (
    <div className="min-h-screen pt-24 pb-12 bg-bg-light dark:bg-bg-dark">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-8">
        <div className="flex items-center gap-2 text-sm text-text-secondary">
          <Link to="/collections" className="hover:text-accent transition-colors">Collections</Link>
          <ChevronRight className="w-4 h-4" />
          <span className="text-text-primary font-medium">{pageTitle}</span>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-12 text-center">
        <motion.div 
          initial={{ opacity: 0, y: 20 }} 
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="font-serif text-4xl md:text-5xl font-bold text-text-primary mb-4">
            {pageTitle}
          </h1>
          <p className="text-text-secondary text-lg max-w-2xl mx-auto">
            {pageDesc}
          </p>
        </motion.div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {dbProducts.length > 0 ? (
          <motion.div 
            layout
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
          >
            {dbProducts.map(product => (
              <ProductCard key={product.id} product={product} />
            ))}
          </motion.div>
        ) : (
          <div className="text-center py-20 bg-gray-50 dark:bg-gray-900/50 rounded-2xl border-2 border-dashed border-gray-200 dark:border-gray-800">
            <p className="text-text-secondary text-lg font-serif">
              Our {pageTitle} is currently being updated with new arrivals.
            </p>
            <Link 
              to="/collections" 
              className="mt-6 inline-block text-accent hover:underline font-medium"
            >
              Browse other collections
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}