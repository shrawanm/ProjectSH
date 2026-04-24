import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { EyeIcon } from 'lucide-react';
import { categoryColors, categoryLabels } from '../data/mockData';

type ProductCardProps = {
  product: any; 
  index?: number;
};

export function ProductCard({
  product,
  index = 0
}: ProductCardProps) {
  const categoryColor = categoryColors[product.category] || '#D4AF37';

  return (
    <motion.article
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      className="group relative bg-gradient-card rounded-xl overflow-hidden border border-white/5"
    >
      <Link to={`/product/${product.id}`} className="block">
        {/* Category color accent */}
        <div className="absolute top-0 left-0 w-1 h-full" style={{ backgroundColor: categoryColor }} />

        {/* Image container */}
        <div className="relative aspect-square overflow-hidden bg-gray-900">
                 <img
            src={product.image || 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="400" height="400"%3E%3Crect fill="%23374151" width="400" height="400"/%3E%3Ctext x="50%25" y="50%25" font-size="24" fill="%239CA3AF" text-anchor="middle" dy=".3em"%3ENo Image%3C/text%3E%3C/svg%3E'}
            alt={product.name}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
            onError={(e) => {
              if (!e.currentTarget.src.includes('data:image')) {
                e.currentTarget.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="400" height="400"%3E%3Crect fill="%23374151" width="400" height="400"/%3E%3Ctext x="50%25" y="50%25" font-size="24" fill="%239CA3AF" text-anchor="middle" dy=".3em"%3ENo Image%3C/text%3E%3C/svg%3E';
              }
            }}
          />

          {/* Overlay on hover */}
          <div className="absolute inset-0 bg-deep-blue/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              whileHover={{ scale: 1, opacity: 1 }}
              className="flex items-center space-x-2 px-4 py-2 bg-gold text-deep-blue rounded-full font-medium"
            >
              <EyeIcon className="w-4 h-4" />
              <span>Quick View</span>
            </motion.div>
          </div>

          {/* Category badge */}
          <div
            className="absolute top-3 right-3 px-3 py-1 rounded-full text-xs font-medium text-white shadow-lg"
            style={{ backgroundColor: `${categoryColor}dd` }}
          >
            {categoryLabels[product.category] || product.category?.replace(/-/g, ' ')}
          </div>
        </div>

        {/* Content */}
        <div className="p-5">
          <div className="flex justify-between items-start mb-1">
            <h3 className="font-serif text-lg text-white group-hover:text-gold transition-colors line-clamp-1">
              {product.name}
            </h3>
          </div>

          <p className="text-gold/80 text-[10px] uppercase tracking-widest mb-2">
            {product.material || 'Handcrafted'}
          </p>

          <p className="text-white/50 text-sm mb-4 line-clamp-2 min-h-[40px]">
            {product.description}
          </p>

          <div className="flex items-center justify-between border-t border-white/5 pt-3">
            <span className="text-gold font-semibold text-lg">
              Rs. {Number(product.price).toLocaleString()}
            </span>
            <span className="text-white/40 text-xs italic">
              {product.artisan ? `by ${product.artisan}` : 'Authentic Nepal'}
            </span>
          </div>
        </div>
      </Link>
    </motion.article>
  );
}