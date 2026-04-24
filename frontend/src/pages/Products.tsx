import React, { useMemo, useState, Children } from 'react';
import { motion } from 'framer-motion';
import { ProductCard } from '../components/ProductCard';
import { CategoryFilter } from '../components/CategoryFilter';
import { products, Category } from '../data/mockData';
const containerVariants = {
  hidden: {
    opacity: 0
  },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.08
    }
  }
};
export function Products() {
  const [selectedCategory, setSelectedCategory] = useState<Category | 'all'>('all');
  const filteredProducts = useMemo(() => {
    if (selectedCategory === 'all') return products;
    return products.filter(p => p.category === selectedCategory);
  }, [selectedCategory]);
  return <main className="min-h-screen pt-24 pb-16 bg-gradient-dark">
      {/* Hero Section */}
      <section className="py-16 px-4 text-center">
        <motion.p initial={{
        opacity: 0,
        y: 20
      }} animate={{
        opacity: 1,
        y: 0
      }} className="text-gold uppercase tracking-[0.3em] text-sm mb-4">
          Our Collection
        </motion.p>
        <motion.h1 initial={{
        opacity: 0,
        y: 20
      }} animate={{
        opacity: 1,
        y: 0
      }} transition={{
        delay: 0.1
      }} className="font-serif text-4xl md:text-6xl text-white mb-6">
          Artisan Treasures
        </motion.h1>
        <motion.p initial={{
        opacity: 0,
        y: 20
      }} animate={{
        opacity: 1,
        y: 0
      }} transition={{
        delay: 0.2
      }} className="text-white/60 max-w-2xl mx-auto text-lg">
          Each piece tells a story of heritage, skill, and the spirit of the
          Himalayas
        </motion.p>
      </section>

      {/* Filter & Grid */}
      <section className="px-4 max-w-7xl mx-auto">
        <motion.div initial={{
        opacity: 0,
        y: 20
      }} animate={{
        opacity: 1,
        y: 0
      }} transition={{
        delay: 0.3
      }}>
          <CategoryFilter selectedCategory={selectedCategory} onCategoryChange={setSelectedCategory} />
        </motion.div>

        <motion.div key={selectedCategory} variants={containerVariants} initial="hidden" animate="visible" className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredProducts.map((product, index) => <ProductCard key={product.id} product={product} index={index} />)}
        </motion.div>

        {filteredProducts.length === 0 && <div className="text-center py-16">
            <p className="text-white/60 text-lg">
              No products found in this category.
            </p>
          </div>}
      </section>
    </main>;
}