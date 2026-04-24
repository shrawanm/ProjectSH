import { useState } from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';
import { motion } from 'framer-motion';
import { categories } from '../data/mockData';
import { ProductCard } from '../components/ProductCard';
import { useProductHook } from '../pages/productHook';

export function PaintingsProducts() {
  const category = categories.find(c => c.id === 'crafts');
  const subcategory = category?.subcategories?.find(s => s.id === 'paintings');
  
  const [selectedType, setSelectedType] = useState<string>('all');

  const { products: dbProducts, loading } = useProductHook('subcategory', 'painting');

  const filteredProducts = dbProducts.filter(product => {
    const matchesCategory = product.category === 'crafts-paintings';
    
    const matchesSubcategory = product.subcategory === 'painting';
    
    const matchesType = selectedType === 'all' || product.subsubcategory === selectedType;
    
    return matchesCategory && matchesSubcategory && matchesType;
  });

  if (!subcategory) return <div className="pt-32 text-center">Category not found</div>;
  
  if (loading) return (
    <div className="min-h-screen pt-40 text-center font-serif text-xl animate-pulse">
      Loading Masterpieces...
    </div>
  );

  return (
    <div className="min-h-screen pt-24 pb-12 bg-bg-light dark:bg-bg-dark">
      {/* Breadcrumbs */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-8">
        <div className="flex items-center gap-2 text-sm text-text-secondary">
          <Link to="/collections" className="hover:text-accent transition-colors">Collections</Link>
          <ChevronRight className="w-4 h-4" />
          <Link to="/crafts" className="hover:text-accent transition-colors">{category?.name}</Link>
          <ChevronRight className="w-4 h-4" />
          <span className="text-text-primary font-medium">{subcategory.name}</span>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-12 text-center">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <h1 className="font-serif text-4xl md:text-5xl font-bold text-text-primary mb-4">
            {subcategory.name}
          </h1>
          <p className="text-text-secondary text-lg max-w-2xl mx-auto">
            {subcategory.description}
          </p>
        </motion.div>
      </div>

      {/* Level 3 Filter Buttons */}
      {subcategory.children && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-12">
          <div className="flex items-center gap-3 justify-center flex-wrap">
            <button 
              onClick={() => setSelectedType('all')}
              className={`px-6 py-2 rounded-full text-sm font-medium transition-all ${
                selectedType === 'all' ? 'bg-accent text-white shadow-md' : 'bg-gray-100 dark:bg-gray-800 text-text-secondary'
              }`}
            >
              All Masterpieces
            </button>
            {subcategory.children.map(child => (
              <button 
                key={child.id} 
                onClick={() => setSelectedType(child.id)}
                className={`px-6 py-2 rounded-full text-sm font-medium transition-all ${
                  selectedType === child.id ? 'bg-accent text-white shadow-md' : 'bg-gray-100 dark:bg-gray-800 text-text-secondary'
                }`}
              >
                {child.name}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {filteredProducts.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredProducts.map(product => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <p className="text-text-secondary text-lg">
              No {selectedType === 'all' ? 'paintings' : selectedType.replace('-', ' ')} found in the gallery.
            </p>
            <button 
              onClick={() => setSelectedType('all')}
              className="mt-4 text-accent hover:underline font-medium"
            >
              Show all paintings
            </button>
          </div>
        )}
      </div>
    </div>
  );
}