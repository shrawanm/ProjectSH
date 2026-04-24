import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { categories } from '../data/mockData';
import { ArrowRight } from 'lucide-react';
export function Collections() {
  return <div className="min-h-screen pt-24 pb-12 bg-bg-light dark:bg-bg-dark">
      <div className="px-4 mb-16 text-center">
        <motion.h1 initial={{
        opacity: 0,
        y: 20
      }} animate={{
        opacity: 1,
        y: 0
      }} className="font-serif text-4xl md:text-5xl font-bold text-text-primary mb-4">
          Explore Our Collections
        </motion.h1>
        <motion.p initial={{
        opacity: 0,
        y: 20
      }} animate={{
        opacity: 1,
        y: 0
      }} transition={{
        delay: 0.1
      }} className="text-text-secondary text-lg max-w-2xl mx-auto">
          Discover our finest Himalayan cashmere across our curated
          categories
        </motion.p>
      </div>

      {/* Collections Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">

          {categories.map((category, index) => <motion.div key={category.id} initial={{
          opacity: 0,
          y: 20
        }} whileInView={{
          opacity: 1,
          y: 0
        }} viewport={{
          once: true
        }} transition={{
          delay: index * 0.1
        }}>
              <Link to={`/${category.id}`} className="group block h-full">
                <div className="relative h-96 rounded-lg overflow-hidden shadow-lg bg-gray-100 dark:bg-gray-800">
                  <img src={category.image} alt={category.name} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-80 group-hover:opacity-90 transition-opacity"></div>

                  <div className="absolute bottom-0 left-0 right-0 p-8 transform translate-y-2 group-hover:translate-y-0 transition-transform duration-300">
                    <h3 className="font-serif text-2xl font-bold text-white mb-2">
                      {category.name}
                    </h3>
                    <p className="text-white/80 text-sm mb-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300 delay-100">
                      {category.description}
                    </p>
                    <span className="inline-flex items-center text-accent text-sm font-medium uppercase tracking-wider group-hover:text-white transition-colors">
                      View Collection <ArrowRight className="w-4 h-4 ml-2" />
                    </span>
                  </div>
                </div>
              </Link>
            </motion.div>)}
        </div>
      </div>
    </div>;
}