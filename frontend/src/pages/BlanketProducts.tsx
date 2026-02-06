import { Link, useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ChevronRight } from 'lucide-react';
import { categories } from '../data/mockData';
import { ProductCard } from '../components/ProductCard';
import { useProductHook } from '../pages/productHook';

export function BlanketProducts() {
  const { categoryId } = useParams();
  const mainCategory = categoryId || 'pashmina';
  const category = categories.find(c => c.id === mainCategory);
  const subcategory = category?.subcategories?.find(s => s.id === 'blankets');

  const { products, loading } = useProductHook('subcategory', 'blankets');
  const displayProducts = products.filter(p => 
    p.category === 'pashmina-cashmere' || p.category === 'pashmina'
  );

  if (!subcategory) {
    return <div className="pt-32 text-center">Category configuration not found for 'blankets'</div>;
  }

  if (loading) return <div className="pt-32 text-center font-serif text-xl">Loading authentic blankets...</div>;

  return (
    <div className="min-h-screen pt-24 pb-12 bg-bg-light dark:bg-bg-dark">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-8">
        <div className="flex items-center gap-2 text-sm text-text-secondary">
          <Link to="/collections" className="hover:text-accent transition-colors">Collections</Link>
          <ChevronRight className="w-4 h-4" />
          <Link to={`/${mainCategory}`} className="hover:text-accent transition-colors">
            {category?.name}
          </Link>
          <ChevronRight className="w-4 h-4" />
          <span className="text-text-primary font-medium">{subcategory.name}</span>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-12 text-center">
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
          <h1 className="font-serif text-4xl font-bold text-text-primary mb-4">
            {category?.name} {subcategory.name}
          </h1>
          <p className="text-text-secondary text-lg max-w-2xl mx-auto">{subcategory.description}</p>
        </motion.div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {displayProducts.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {displayProducts.map(product => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <p className="text-text-secondary text-lg">No products found in the database.</p>
            <p className="text-xs text-gray-400 mt-2">
              Searching for blankets under "pashmina-cashmere"
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
