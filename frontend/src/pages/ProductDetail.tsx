import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Minus, Plus, ShoppingBag, Truck, ShieldCheck, RefreshCw } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { ImageGallery } from '../components/ImageGallery';
import { VariantSelector } from '../components/VariantSelector';
import { RelatedProducts } from '../components/RelatedProducts';

export function ProductDetail() {
  const { id } = useParams();
  const { addToCart } = useCart();
  
  const [product, setProduct] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState('details');
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

  if (loading) return <div className="pt-32 text-center font-serif text-xl">Loading your masterpiece...</div>;
  if (!product) return <div className="pt-32 text-center font-serif text-xl">Product not found</div>;

  return (
    <div className="min-h-screen pt-24 pb-12 bg-bg-light dark:bg-bg-dark">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16">
          
          <ImageGallery images={product.images} name={product.name} />

          <motion.div 
            initial={{ opacity: 0, x: 20 }} 
            animate={{ opacity: 1, x: 0 }} 
            className="space-y-8"
          >
            <div>
              <span className="text-accent font-medium uppercase tracking-wider text-sm">
                {product.category?.replace(/-/g, ' ')}
              </span>
              <h1 className="font-serif text-4xl font-bold text-text-primary mt-2 mb-4">
                {product.name}
              </h1>
              <div className="flex items-baseline gap-4">
                <span className="text-3xl font-bold text-text-primary">
                  Rs. {product.price.toLocaleString()}
                </span>
                {product.stock < 10 && product.stock > 0 && (
                  <span className="text-red-500 text-sm font-medium">
                    Only {product.stock} left in stock!
                  </span>
                )}
              </div>
            </div>

            <p className="text-text-secondary leading-relaxed">
              {product.description}
            </p>

            <div className="h-px bg-gray-200 dark:bg-gray-800" />

            <VariantSelector 
              variants={product.variants} 
              selected={selectedVariants} 
              onChange={handleVariantChange} 
            />

            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              <div className="flex items-center border border-gray-300 dark:border-gray-700 rounded-md w-max bg-white dark:bg-gray-900">
                <button 
                  onClick={() => setQuantity(Math.max(1, quantity - 1))} 
                  className="p-3 hover:text-accent transition-colors"
                >
                  <Minus className="w-4 h-4" />
                </button>
                <span className="w-12 text-center font-medium text-text-primary">
                  {quantity}
                </span>
                <button 
                  onClick={() => setQuantity(Math.min(product.stock, quantity + 1))} 
                  className="p-3 hover:text-accent transition-colors"
                  disabled={quantity >= product.stock}
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>

              <button 
                onClick={() => addToCart(product, quantity, selectedVariants)} 
                className="flex-1 btn-primary flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={product.stock === 0}
              >
                <ShoppingBag className="w-5 h-5" />
                {product.stock === 0 ? 'Out of Stock' : 'Add to Cart'}
              </button>
            </div>

            <div className="grid grid-cols-3 gap-4 pt-6">
              <div className="text-center p-4 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
                <Truck className="w-6 h-6 text-accent mx-auto mb-2" />
                <p className="text-xs font-medium text-text-secondary">Free Shipping</p>
              </div>
              <div className="text-center p-4 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
                <ShieldCheck className="w-6 h-6 text-accent mx-auto mb-2" />
                <p className="text-xs font-medium text-text-secondary">Authentic</p>
              </div>
              <div className="text-center p-4 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
                <RefreshCw className="w-6 h-6 text-accent mx-auto mb-2" />
                <p className="text-xs font-medium text-text-secondary">Easy Returns</p>
              </div>
            </div>

            {/* Accordion tabs */}
            <div className="border-t border-gray-200 dark:border-gray-800 pt-8">
              <div className="flex gap-8 border-b border-gray-200 dark:border-gray-800 mb-6 overflow-x-auto scrollbar-hide">
                {['Details', 'Material', 'Care'].map(tab => (
                  <button 
                    key={tab} 
                    onClick={() => setActiveTab(tab.toLowerCase())} 
                    className={`pb-4 text-sm font-medium transition-colors whitespace-nowrap relative ${activeTab === tab.toLowerCase() ? 'text-accent' : 'text-text-secondary hover:text-text-primary'}`}
                  >
                    {tab}
                    {activeTab === tab.toLowerCase() && (
                      <motion.div layoutId="activeTab" className="absolute bottom-0 left-0 right-0 h-0.5 bg-accent" />
                    )}
                  </button>
                ))}
              </div>

              <div className="min-h-[120px] text-text-secondary text-sm leading-relaxed">
                {activeTab === 'details' && (
                  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                    <p>Handcrafted in Nepal using traditional techniques passed down through generations. Each piece is unique and carries the spirit of the Himalayas.</p>
                    <ul className="list-disc list-inside mt-4 space-y-1">
                      <li>Origin: Kathmandu Valley</li>
                      <li>Artisan: Local community craftsmen</li>
                      <li>Quality Grade: Premium Export Quality</li>
                    </ul>
                  </motion.div>
                )}
                {activeTab === 'material' && (
                  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                    <p className="font-bold text-text-primary mb-2">{product.material || 'Premium Ethical Fiber'}</p>
                    <p>Sourced ethically from high-altitude regions ensuring the finest quality and sustainability. We prioritize materials that are both luxurious and environmentally conscious.</p>
                  </motion.div>
                )}
                {activeTab === 'care' && (
                  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                    <ul className="list-disc list-inside space-y-2">
                      <li>Dry clean recommended for long-term preservation</li>
                      <li>Hand wash gently in cold water using wool-safe detergent</li>
                      <li>Do not bleach or wring</li>
                      <li>Dry flat in shade away from direct sunlight</li>
                    </ul>
                  </motion.div>
                )}
              </div>
            </div>
          </motion.div>
        </div>
        <div className="mt-16 pt-16 border-t border-gray-200 dark:border-gray-800">
           <RelatedProducts 
             currentId={product.id} 
             category={product.category} 
           />
        </div>
      </div>
    </div>
  );
}