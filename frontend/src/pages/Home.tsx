import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ParallaxHero } from '../components/ParallaxHero';
import { ProductCard } from '../components/ProductCard';
import { products, categories } from '../data/mockData';
import { ArrowRight, Star, Loader } from 'lucide-react';

export function Home() {
  const [bestSellers, setBestSellers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBestSellers = async () => {
      try {
        setLoading(true);
                const productsRes = await fetch('http://localhost/ShrawanHandicraftsFYP/backend/api/products.php');
        const allProducts = await productsRes.json();
        const productList = Array.isArray(allProducts) ? allProducts : [];
        const analyticsRes = await fetch('http://localhost/ShrawanHandicraftsFYP/backend/api/get_analytics.php');
        const analyticsData = await analyticsRes.json();

        if (analyticsData.status === 'success' && analyticsData.data.topProducts.length > 0) {
          //match analytics topproducts with full product data from database
          const enrichedBestSellers = analyticsData.data.topProducts
            .slice(0, 3)
            .map((topProduct: any) => {
              //find matching product in database by name
              const fullProduct = productList.find((p: any) => 
                p.name.toLowerCase() === topProduct.name.toLowerCase()
              );
              return fullProduct || topProduct;
            });
          
          setBestSellers(enrichedBestSellers);
        } else {
          setBestSellers(productList.length > 0 ? productList.slice(0, 3) : products.slice(0, 3));
        }
      } catch (error) {
        console.error('Error fetching best sellers:', error);
        //goto mockdata
        setBestSellers(products.slice(0, 4));
      } finally {
        setLoading(false);
      }
    };

    fetchBestSellers();
  }, []);
  return <div className="min-h-screen bg-bg-light dark:bg-bg-dark">
      <ParallaxHero />

      {/* Featured Collections */}
      <section className="py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <span className="text-accent font-medium uppercase tracking-wider text-sm">
              Curated Selection
            </span>
            <h2 className="font-serif text-4xl font-bold text-text-primary mt-2">
              Our Collections
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {categories.slice(0, 3).map((category, index) => <motion.div key={category.id} initial={{
            opacity: 0,
            y: 20
          }} whileInView={{
            opacity: 1,
            y: 0
          }} viewport={{
            once: true
          }} transition={{
            delay: index * 0.1
          }} className="group relative h-80 rounded-lg overflow-hidden cursor-pointer shadow-lg">
                <Link to={`/${category.id}`}>
                  <img src={category.image} alt={category.name} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent"></div>
                  <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-6">
                    <h3 className="font-serif text-2xl font-bold text-white mb-2 drop-shadow-lg">
                      {category.name}
                    </h3>
                    <p className="text-white/90 text-sm max-w-xs opacity-0 group-hover:opacity-100 transform translate-y-4 group-hover:translate-y-0 transition-all duration-300 drop-shadow-md">
                      {category.description}
                    </p>
                  </div>
                </Link>
              </motion.div>)}
          </div>

          <div className="text-center mt-12">
            <Link to="/collections" className="inline-flex items-center gap-2 text-accent hover:text-accent-hover font-medium uppercase tracking-wider text-sm transition-colors">
              View All Collections <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-20 px-4 bg-bg-dark dark:bg-bg-darker relative overflow-hidden">
        <div className="absolute inset-0 bg-pattern-weave opacity-5 pointer-events-none"></div>

        <div className="max-w-7xl mx-auto relative z-10">
          <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-4">
            <div>
              <span className="text-accent font-medium uppercase tracking-wider text-sm">
                Best Sellers
              </span>
              <h2 className="font-serif text-4xl font-bold text-text-primary mt-2">
                Featured Masterpieces
              </h2>
            </div>
            <Link to="/collections" className="btn-secondary">
              View All Products
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {loading ? (
              <div className="col-span-full flex items-center justify-center py-20">
                <Loader className="w-8 h-8 animate-spin text-accent" />
              </div>
            ) : (
              bestSellers.map(product => <ProductCard key={product.id} product={product} />)
            )}
          </div>
        </div>
      </section>

      {/* Story Teaser */}
      <section className="py-24 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div className="relative">
              <div className="aspect-[4/5] rounded-lg overflow-hidden shadow-xl">
                <img src="https://images.unsplash.com/photo-1623492962519-ac982cffae56?q=80&w=1740&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" alt="Artisan weaving" className="w-full h-full object-cover" />
              </div>
              <div className="absolute -bottom-8 -right-8 w-64 h-64 bg-bg-card dark:bg-bg-card p-8 rounded-lg shadow-xl hidden md:block border border-gray-100 dark:border-gray-800">
                <div className="h-full border border-accent/20 rounded flex flex-col items-center justify-center text-center p-4">
                  <Star className="w-8 h-8 text-accent mb-4" />
                  <p className="font-serif text-3xl font-bold text-text-primary mb-1">
                    20+
                  </p>
                  <p className="text-sm text-text-secondary uppercase tracking-wider">
                    Years of Heritage
                  </p>
                </div>
              </div>
            </div>

            <div>
              <span className="text-accent font-medium uppercase tracking-wider text-sm">
                Our Story
              </span>
              <h2 className="font-serif text-4xl md:text-5xl font-bold text-text-primary mt-4 mb-6">
                Preserving the Art of the Himalayas
              </h2>
              <p className="text-text-secondary text-lg leading-relaxed mb-8">
                Shrawan Handicrafts is more than a brand, it's a bridge between
                ancient Nepali craftsmanship and the modern world. We work
                directly with master artisans to bring you authentic, ethically
                sourced treasures that tell a story of culture, dedication, and
                skill.
              </p>
              <Link to="/about" className="btn-primary">
                Read Our Story
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>;
}