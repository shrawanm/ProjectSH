import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ChevronRight } from 'lucide-react';
import { categories } from '../data/mockData';
import { ProductCard } from '../components/ProductCard';
import { useProductHook } from '../pages/productHook'; 

export function WoodenCraftsProducts() {
  const category = categories.find(c => c.id === 'crafts');
  const subcategory = category?.subcategories?.find(s => s.id === 'wooden-crafts');

  
  const { products: allProducts, loading } = useProductHook('subcategory', 'crafts');

  const products = allProducts.filter(p => 
    p.category.toLowerCase().includes('crafts')
  );

  if (!subcategory) {
    return <div className="pt-32 text-center font-serif text-xl">Category not found</div>;
  }

  if (loading) {
    return (
      <div className="min-h-screen pt-40 text-center font-serif">
        <div className="animate-pulse text-2xl text-accent">Loading Wooden Masterpieces...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-24 pb-12 bg-bg-light dark:bg-bg-dark">
      {/* Breadcrumbs */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-8">
        <div className="flex items-center gap-2 text-sm text-text-secondary">
          <Link to="/collections" className="hover:text-accent transition-colors">Collections</Link>
          <ChevronRight className="w-4 h-4" />
          <Link to="/crafts" className="hover:text-accent transition-colors">Crafts & Paintings</Link>
          <ChevronRight className="w-4 h-4" />
          <span className="text-text-primary font-medium">{subcategory.name}</span>
        </div>
      </div>

      {/* Header Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-12">
        <motion.div 
          initial={{ opacity: 0, y: 20 }} 
          animate={{ opacity: 1, y: 0 }} 
          className="text-center"
        >
          <h1 className="font-serif text-4xl md:text-5xl font-bold text-text-primary mb-4">
            {subcategory.name}
          </h1>
          <p className="text-text-secondary text-lg max-w-2xl mx-auto">
            {subcategory.description}
          </p>
        </motion.div>
      </div>

      {/* Product Grid - Database Data */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {products.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {products.map(product => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <p className="text-text-secondary text-lg">
              No wooden crafted figures found in the database.
            </p>
            <Link to="/crafts" className="mt-4 inline-block text-accent hover:text-accent-hover font-medium">
              Browse other Crafts & Paintings
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}