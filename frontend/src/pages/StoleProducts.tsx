import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ChevronRight } from 'lucide-react';
import { categories } from '../data/mockData';
import { ProductCard } from '../components/ProductCard';
import { useProductHook } from '../pages/productHook'; 

export function StoleProducts() {
  const category = categories.find(c => c.id === 'pashmina');
  const subcategory = category?.subcategories?.find(s => s.id === 'stole');
  const [selectedBlend, setSelectedBlend] = useState<string>('all');

  const { products, loading } = useProductHook(
    selectedBlend === 'all' ? 'subcategory' : 'subsubcategory',
    selectedBlend === 'all' ? 'stole' : selectedBlend
  );

  if (!subcategory) {
    return <div className="pt-32 text-center">Category not found</div>;
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

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-12">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center">
          <h1 className="font-serif text-4xl md:text-5xl font-bold text-text-primary mb-4">
            Pashmina {subcategory.name}
          </h1>
          <p className="text-text-secondary text-lg max-w-2xl mx-auto">
            {subcategory.description}
          </p>
        </motion.div>
      </div>

      {subcategory.children && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-12">
          <div className="flex items-center gap-3 justify-center flex-wrap">
            <span className="text-sm font-medium text-text-secondary">Filter by blend:</span>
            <button 
              onClick={() => setSelectedBlend('all')} 
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${selectedBlend === 'all' ? 'bg-accent text-white' : 'bg-gray-100 dark:bg-gray-800 text-text-secondary'}`}
            >
              All Stoles
            </button>
            {subcategory.children.map(child => (
              <button 
                key={child.id} 
                onClick={() => setSelectedBlend(child.id)} 
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${selectedBlend === child.id ? 'bg-accent text-white' : 'bg-gray-100 dark:bg-gray-800 text-text-secondary'}`}
              >
                {child.name}
              </button>
            ))}
          </div>
        </div>
      )}

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {loading ? (
          <div className="text-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-accent mx-auto"></div>
            <p className="mt-4 text-text-secondary">Loading your collection...</p>
          </div>
        ) : products.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <p className="text-text-secondary text-lg">No products found in this category.</p>
            <button onClick={() => setSelectedBlend('all')} className="mt-4 text-accent hover:text-accent-hover font-medium">
              View all stoles
            </button>
          </div>
        )}
      </div>
    </div>
  );
}