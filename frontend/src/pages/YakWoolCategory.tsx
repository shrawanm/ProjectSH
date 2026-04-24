import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, ChevronRight } from 'lucide-react';
import { categories } from '../data/mockData';
export function YakWoolCategory() {
  const category = categories.find(c => c.id === 'yak-wool');
  if (!category || !category.subcategories) {
    return <div className="pt-32 text-center">Category not found</div>;
  }
  return <div className="min-h-screen pt-24 pb-12 bg-bg-light dark:bg-bg-dark">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-8">
        <div className="flex items-center gap-2 text-sm text-text-secondary">
          <Link to="/collections" className="hover:text-accent transition-colors">
            Collections
          </Link>
          <ChevronRight className="w-4 h-4" />
          <span className="text-text-primary font-medium">{category.name}</span>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-16">
        <motion.div initial={{
        opacity: 0,
        y: 20
      }} animate={{
        opacity: 1,
        y: 0
      }} className="text-center">
          <h1 className="font-serif text-4xl md:text-5xl font-bold text-text-primary mb-4">
            {category.name}
          </h1>
          <p className="text-text-secondary text-lg max-w-2xl mx-auto">
            {category.description}
          </p>
        </motion.div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {category.subcategories.map((subcategory, index) => <motion.div key={subcategory.id} initial={{
          opacity: 0,
          y: 20
        }} animate={{
          opacity: 1,
          y: 0
        }} transition={{
          delay: index * 0.1
        }}>
              <Link to={`/yak-wool/${subcategory.id}`} className="group block h-full">
                <div className="relative h-80 rounded-lg overflow-hidden shadow-lg bg-gray-100 dark:bg-gray-800">
                  <img src={subcategory.image} alt={subcategory.name} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent"></div>

                  <div className="absolute bottom-0 left-0 right-0 p-6">
                    <h3 className="font-serif text-2xl font-bold text-white mb-2">
                      {subcategory.name}
                    </h3>
                    <p className="text-white/80 text-sm mb-4">
                      {subcategory.description}
                    </p>
                    <span className="inline-flex items-center text-accent text-sm font-medium uppercase tracking-wider group-hover:text-white transition-colors">
                      Shop Now <ArrowRight className="w-4 h-4 ml-2" />
                    </span>
                  </div>
                </div>
              </Link>
            </motion.div>)}
        </div>
      </div>
    </div>;
}