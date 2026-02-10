import { Link, useParams } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';
import { categories } from '../data/mockData';
import { ProductCard } from '../components/ProductCard';
import { useProductHook } from '../pages/productHook';

export function GenericSubcategoryProducts() {
  const { categoryId, subcategoryId } = useParams();
  
  const category = categories.find(c => c.id === categoryId);
  const subcategory = category?.subcategories?.find(s => s.id === subcategoryId);

  const { products: allProducts, loading } = useProductHook('subcategory', subcategoryId || '');
  const products = allProducts.filter(p => 
    p.category.toLowerCase().includes(categoryId || '')
  );

  if (!category || !subcategory) {
    return (
      <div className="pt-32 text-center">
        <h2 className="text-2xl font-serif">Configuration Not Found</h2>
        <p className="text-text-secondary">Category: {categoryId}, Sub: {subcategoryId}</p>
      </div>
    );
  }

  if (loading) return <div className="pt-40 text-center font-serif text-xl">Loading...</div>;

  return (
    <div className="min-h-screen pt-24 pb-12 bg-bg-light dark:bg-bg-dark">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-8">
        <div className="flex items-center gap-2 text-sm text-text-secondary">
          <Link to="/collections">Collections</Link>
          <ChevronRight className="w-4 h-4" />
          <Link to={`/${categoryId}`}>{category.name}</Link>
          <ChevronRight className="w-4 h-4" />
          <span className="text-text-primary font-medium">{subcategory.name}</span>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-12 text-center">
        <h1 className="font-serif text-4xl font-bold">{category.name} {subcategory.name}</h1>
        <p className="text-text-secondary text-lg">{subcategory.description}</p>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {products.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {products.map(product => <ProductCard key={product.id} product={product} />)}
          </div>
        ) : (
          <div className="text-center py-16">
            <p className="text-text-secondary">No {subcategory.name} found for {category.name}.</p>
          </div>
        )}
      </div>
    </div>
  );
}