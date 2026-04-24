import { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Minus, Plus, ShoppingBag, Truck, ShieldCheck, 
  RefreshCw, X, LogIn, ChevronRight 
} from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { ImageGallery } from '../components/ImageGallery';
import { VariantSelector } from '../components/VariantSelector';
import { YouMayLike } from '../components/YouMayLike';

export function ProductDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const { addToCart } = useCart();
  const { user } = useAuth(); 
  
  const [product, setProduct] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState('details');
  const [showAuthCard, setShowAuthCard] = useState(false);
  const [selectedVariants, setSelectedVariants] = useState<any>({
    color: '',
    size: ''
  });

  useEffect(() => {
    const fetchProduct = async () => {
      setLoading(true);
      try {
        const res = await fetch(`http://localhost/ShrawanHandicraftsFYP/backend/api/products.php?id=${id}`);
        const data = await res.json();
        
        if (data && !data.error) {
          const formattedProduct = {
            ...data,
            price: Number(data.price),
            stock: Number(data.stock),
            images: data.image ? [data.image] : ['https://via.placeholder.com/600'],
            variants: typeof data.variants === 'string' ? JSON.parse(data.variants) : data.variants
          };
          setProduct(formattedProduct);
          setSelectedVariants({
            color: formattedProduct.variants?.colors?.[0] || '',
            size: formattedProduct.variants?.sizes?.[0] || ''
          });
        }
      } catch (err) {
        console.error("Error loading product:", err);
      } finally {
        setLoading(false);
      }
    };
    if (id) fetchProduct();
  }, [id]);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [id]);

  const handleVariantChange = (key: string, value: string) => {
    setSelectedVariants((prev: any) => ({ ...prev, [key]: value }));
  };

  const handleAddToCartClick = () => {
    if (!user) {
      setShowAuthCard(true);
    } else {
      addToCart(product, quantity, selectedVariants);
    }
  };

  const handleAuthRedirect = (path: string) => {
    navigate(path, { state: { from: location.pathname } });
  };

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-bg-light dark:bg-bg-dark">
      <div className="text-center font-serif text-xl animate-pulse text-accent">Loading masterpiece...</div>
    </div>
  );

  if (!product) return (
    <div className="min-h-screen flex items-center justify-center bg-bg-light dark:bg-bg-dark">
      <div className="text-center font-serif text-xl">Product not found</div>
    </div>
  );

  return (
    <div className="min-h-screen pt-24 pb-12 bg-bg-light dark:bg-bg-dark relative">
      
      {/* AUTH MODAL */}
      <AnimatePresence>
        {showAuthCard && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => setShowAuthCard(false)}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative bg-white dark:bg-gray-900 rounded-2xl shadow-2xl max-w-md w-full p-8"
            >
              <button onClick={() => setShowAuthCard(false)} className="absolute top-4 right-4 p-2 text-text-secondary hover:text-accent">
                <X className="w-5 h-5" />
              </button>
              <div className="text-center">
                <div className="w-16 h-16 bg-accent/10 text-accent rounded-full flex items-center justify-center mx-auto mb-4">
                  <LogIn className="w-8 h-8" />
                </div>
                <h2 className="font-serif text-2xl font-bold text-text-primary mb-2">Sign in Required</h2>
                <p className="text-text-secondary mb-8">Please log in to your account to add this handcrafted item to your cart.</p>
                <div className="grid gap-4">
                  <button onClick={() => handleAuthRedirect('/login')} className="w-full py-3 bg-accent text-white rounded-xl font-bold hover:opacity-90 transition-all">
                    Login / Sign Up
                  </button>
                  <button onClick={() => handleAuthRedirect('/login')} className="w-full flex items-center justify-center gap-3 px-4 py-3 border border-gray-300 dark:border-gray-700 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
                    <img src="https://www.svgrepo.com/show/475656/google-color.svg" className="w-5 h-5" alt="Google" />
                    <span className="font-medium text-text-primary">Continue with Google</span>
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16">
          
          <ImageGallery images={product.images} name={product.name} />

          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-8">
            <div>
              <div className="flex items-center gap-2 text-accent font-medium uppercase tracking-wider text-sm mb-2">
                <span>{product.category?.replace(/-/g, ' ')}</span>
                {product.subcategory && (
                  <>
                    <ChevronRight className="w-3 h-3 text-text-muted" />
                    <span className="text-text-muted">{product.subcategory}</span>
                  </>
                )}
              </div>
              <h1 className="font-serif text-4xl font-bold text-text-primary mb-4">{product.name}</h1>
              <div className="flex items-center gap-4">
                <span className="text-3xl font-bold text-text-primary">Rs. {product.price.toLocaleString()}</span>
                {product.stock > 0 && product.stock < 10 && (
                  <span className="text-red-500 text-sm font-medium animate-pulse">Only {product.stock} left!</span>
                )}
              </div>
            </div>

            <p className="text-text-secondary text-lg leading-relaxed">{product.description}</p>

            <div className="h-px bg-gray-200 dark:bg-gray-800" />

            <VariantSelector variants={product.variants} selected={selectedVariants} onChange={handleVariantChange} />

            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              <div className="flex items-center border border-gray-300 dark:border-gray-700 rounded-md w-max bg-white dark:bg-gray-900">
                <button onClick={() => setQuantity(Math.max(1, quantity - 1))} className="p-3 hover:text-accent transition-colors">
                  <Minus className="w-4 h-4" />
                </button>
                <span className="w-12 text-center font-medium">{quantity}</span>
                <button 
                  onClick={() => setQuantity(Math.min(product.stock, quantity + 1))} 
                  className="p-3 hover:text-accent transition-colors disabled:opacity-30"
                  disabled={quantity >= product.stock}
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>

              <button 
                onClick={handleAddToCartClick} 
                className="flex-1 btn-primary flex items-center justify-center gap-2 disabled:opacity-50"
                disabled={product.stock === 0}
              >
                <ShoppingBag className="w-5 h-5" />
                {product.stock === 0 ? 'Out of Stock' : 'Add to Cart'}
              </button>
            </div>

            {/* Feature Icons */}
            <div className="grid grid-cols-3 gap-4 pt-6 border-t border-gray-100 dark:border-gray-800">
              <div className="text-center p-3 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
                <Truck className="w-5 h-5 text-accent mx-auto mb-1" />
                <p className="text-[10px] font-bold uppercase text-text-secondary">World wide Shipping</p>
              </div>
              <div className="text-center p-3 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
                <ShieldCheck className="w-5 h-5 text-accent mx-auto mb-1" />
                <p className="text-[10px] font-bold uppercase text-text-secondary">Authentic</p>
              </div>
              <div className="text-center p-3 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
                <RefreshCw className="w-5 h-5 text-accent mx-auto mb-1" />
                <p className="text-[10px] font-bold uppercase text-text-secondary">Returns</p>
              </div>
            </div>

            {/* DYNAMIC TABS SECTION */}
            <div className="pt-4">
              <div className="flex gap-8 border-b border-gray-200 dark:border-gray-800 mb-6">
                {['Details', 'Material', 'Care'].map(tab => (
                  <button 
                    key={tab} 
                    onClick={() => setActiveTab(tab.toLowerCase())} 
                    className={`pb-4 text-sm font-medium relative transition-colors ${
                      activeTab === tab.toLowerCase() ? 'text-accent' : 'text-text-secondary hover:text-text-primary'
                    }`}
                  >
                    {tab}
                    {activeTab === tab.toLowerCase() && (
                      <motion.div layoutId="activeTab" className="absolute bottom-0 left-0 right-0 h-0.5 bg-accent" />
                    )}
                  </button>
                ))}
              </div>

              <div className="min-h-[120px] text-text-secondary text-sm leading-relaxed">
                <AnimatePresence mode="wait">
                  {activeTab === 'details' && (
                    <motion.div key="details" initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -5 }}>
                      <p>{product.long_details || "Handcrafted in Nepal using traditional techniques passed down through generations"}</p>
                      <ul className="mt-4 space-y-2">
                        <li className="flex items-center gap-2"><div className="w-1 h-1 bg-accent rounded-full"/> Origin: Kathmandu Valley</li>
                        <li className="flex items-center gap-2"><div className="w-1 h-1 bg-accent rounded-full"/> Maker: Local Artisan Collective</li>
                      </ul>
                    </motion.div>
                  )}
                  {activeTab === 'material' && (
                    <motion.div key="material" initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -5 }}>
                      <p className="font-bold text-text-primary mb-2">{product.material_type || "Ethically Sourced"}</p>
                      <p>{product.material || "We use premium, eco-conscious materials that reflect our commitment to the environment and traditional crafting methods."}</p>
                    </motion.div>
                  )}
                  {activeTab === 'care' && (
                    <motion.div key="care" initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -5 }}>
                      {product.care_instructions ? (
                        <p>{product.care_instructions}</p>
                      ) : (
                        <ul className="space-y-2">
                          <li>• Hand wash gently in cold water</li>
                          <li>• Use mild, wool-safe detergent</li>
                          <li>• Dry flat in shade away from sunlight</li>
                        </ul>
                      )}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </motion.div>
        </div>

        <div className="mt-16 pt-16 border-t border-gray-200 dark:border-gray-800">
           <YouMayLike productId={product.id} />
        </div>
      </div>
    </div>
  );
}