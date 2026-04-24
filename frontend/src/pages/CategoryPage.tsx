import { useState } from 'react';
import { useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ProductCard } from '../components/ProductCard';
import { products, categories } from '../data/mockData';
import { Filter, ChevronDown } from 'lucide-react';
export function CategoryPage() {
  const {
    categoryId
  } = useParams();
  const category = categories.find(c => c.id === categoryId);
  const categoryProducts = products.filter(p =>
  // Simple matching logic for demo - in real app would use exact IDs
  p.category.toLowerCase().includes(category?.name.split(' ')[0].toLowerCase() || ''));
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  if (!category) {
    return <div className="pt-32 text-center">Cat not found</div>;
  }
  return <div className="min-h-screen pt-24 pb-12 bg-bg-light dark:bg-bg-dark">
      {/* Header */}
      <div className="bg-bg-card dark:bg-bg-card border-b border-gray-100 dark:border-gray-800 mb-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <motion.h1 initial={{
          opacity: 0,
          y: 20
        }} animate={{
          opacity: 1,
          y: 0
        }} className="font-serif text-4xl font-bold text-text-primary mb-4">
            {category.name}
          </motion.h1>
          <p className="text-text-secondary max-w-2xl">
            {category.description}
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar Filters - Desktop */}
          <div className="hidden lg:block w-64 flex-shrink-0 space-y-8">
            <div>
              <h3 className="font-serif text-lg font-bold text-text-primary mb-4">
                Price Range
              </h3>
              <div className="space-y-2">
                {['Under Rs. 5,000', 'Rs. 5,000 - 10,000', 'Rs. 10,000 - 25,000', 'Above Rs. 25,000'].map(range => <label key={range} className="flex items-center gap-2 cursor-pointer">
                    <input type="checkbox" className="rounded border-gray-300 text-accent focus:ring-accent" />
                    <span className="text-sm text-text-secondary">{range}</span>
                  </label>)}
              </div>
            </div>

            <div>
              <h3 className="font-serif text-lg font-bold text-text-primary mb-4">
                Materialss
              </h3>
              <div className="space-y-2">
                {['100% Pashmina', 'Yak Wool', 'Cotton', 'Silk Blend'].map(material => <label key={material} className="flex items-center gap-2 cursor-pointer">
                      <input type="checkbox" className="rounded border-gray-300 text-accent focus:ring-accent" />
                      <span className="text-sm text-text-secondary">
                        {material}
                      </span>
                    </label>)}
              </div>
            </div>
          </div>

          {/* Mobile Filter Toggle */}
          <div className="lg:hidden">
            <button onClick={() => setIsFilterOpen(!isFilterOpen)} className="flex items-center gap-2 px-4 py-2 border border-gray-200 dark:border-gray-700 rounded-md text-text-primary">
              <Filter className="w-4 h-4" />
              Filters
              <ChevronDown className={`w-4 h-4 transition-transform ${isFilterOpen ? 'rotate-180' : ''}`} />
            </button>

            {isFilterOpen && <motion.div initial={{
            height: 0,
            opacity: 0
          }} animate={{
            height: 'auto',
            opacity: 1
          }} className="mt-4 p-4 bg-bg-card dark:bg-bg-card rounded-lg border border-gray-100 dark:border-gray-800">
                {/* Mobile filters content */}
                <p className="text-sm text-text-muted">
                  Filters would go here...
                </p>
              </motion.div>}
          </div>

          {/* Product Grid */}
          <div className="flex-1">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {categoryProducts.length > 0 ? categoryProducts.map(product => <ProductCard key={product.id} product={product} />) :
            // Fallback if no products match exactly (for demo purposes show all)
            products.slice(0, 4).map(product => <ProductCard key={product.id} product={product} />)}
            </div>
          </div>
        </div>
      </div>
    </div>;
}