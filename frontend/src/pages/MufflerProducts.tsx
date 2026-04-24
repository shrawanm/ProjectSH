import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ChevronRight } from 'lucide-react';
import { categories } from '../data/mockData';
import { ProductCard } from '../components/ProductCard';
import { useProductHook } from '../pages/productHook'; 

export function MufflerProducts() {
  // Gets muffler subcategory from mockData
  const category = categories.find(c => c.id === 'pashmina');
  const subcategory = category?.subcategories?.find(s => s.id === 'muffler');
  const { products, loading, error } = useProductHook('subcategory', 'muffler');

  if (!subcategory) {
    return <div className="pt-32 text-center">Category not found</div>;
  }

  if (loading) {
    return (
      <div className="min-h-screen pt-32 text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-accent mx-auto mb-4"></div>
        <p className="text-text-secondary font-serif">Loading Mufflers from collection...</p>
      </div>
    );
  }

  if (error) {
    return <div className="pt-32 text-center text-red-500">Error: {error}</div>;
  }

  return (
    <div className="min-h-screen pt-24 pb-12 bg-bg-light dark:bg-bg-dark">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-8">
        <div className="flex items-center gap-2 text-sm text-text-secondary">
          <Link to="/collections" className="hover:text-accent transition-colors">Collections</Link>
          <ChevronRight className="w-4 h-4" />
          <Link to="/pashmina" className="hover:text-accent transition-colors">Pashmina</Link>
          <ChevronRight className="w-4 h-4" />
          <span className="text-text-primary font-medium">{subcategory.name}</span>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-12 text-center">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <h1 className="font-serif text-4xl md:text-5xl font-bold text-text-primary mb-4">
            Pashmina {subcategory.name}
          </h1>
          <p className="text-text-secondary text-lg max-w-2xl mx-auto">
            {subcategory.description}
          </p>
        </motion.div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {products.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <p className="text-text-secondary text-lg">No authentic mufflers found in the database.</p>
            <p className="text-sm text-gray-400 mt-2">check admin</p>
          </div>
        )}
      </div>
    </div>
  );
}