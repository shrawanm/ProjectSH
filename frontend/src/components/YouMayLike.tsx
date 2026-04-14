import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Loader, AlertCircle } from 'lucide-react';

interface Recommendation {
  id: number;
  name: string;
  category: string;
  subcategory: string;
  image: string;
  price: number;
  material: string;
  similarity_score: number;
}

interface ApiResponse {
  success: boolean;
  recommendations: Recommendation[];
  total_similar_products: number;
  error?: string;
}

export function YouMayLike({ productId }: { productId: number | string }) {
  const navigate = useNavigate();
  const [recommendations, setRecommendations] = useState<Recommendation[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchRecommendations = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await fetch(
          `http://localhost/ShrawanHandicraftsFYP/backend/api/get-recommendations.php?id=${productId}`
        );

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data: ApiResponse = await response.json();

        if (!data.success) {
          throw new Error(data.error || 'Failed to fetch recommendations');
        }

        setRecommendations(data.recommendations || []);
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Failed to load recommendations';
        setError(errorMessage);
        console.error('Error fetching recommendations:', err);
      } finally {
        setLoading(false);
      }
    };

    if (productId) {
      fetchRecommendations();
    }
  }, [productId]);

  if (loading === false && recommendations.length === 0 && !error) {
    return null;
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="mt-20 mb-16"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="font-serif text-3xl font-bold text-text-primary mb-2">You May Like</h2>
        <p className="text-text-secondary text-sm mb-8">Similar products based on your selection</p>

        {loading && (
          <div className="flex justify-center items-center py-20">
            <div className="flex flex-col items-center gap-4">
              <Loader className="w-10 h-10 animate-spin text-accent" />
              <p className="text-text-secondary">Finding recommendations...</p>
            </div>
          </div>
        )}

        {error && (
          <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-6 flex items-start gap-4">
            <AlertCircle className="w-5 h-5 text-red-600 dark:text-red-400 flex-shrink-0 mt-0.5" />
            <div>
              <h3 className="font-semibold text-red-800 dark:text-red-300">Unable to Load Recommendations</h3>
              <p className="text-red-600 dark:text-red-400 text-sm mt-1">{error}</p>
            </div>
          </div>
        )}

        {!loading && !error && recommendations.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {recommendations.map((product, index) => (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                onClick={() => navigate(`/product/${product.id}`)}
                className="group cursor-pointer"
              >
                <div className="relative overflow-hidden rounded-lg bg-gray-100 dark:bg-gray-800 aspect-square mb-4">
                  {/* Product Image */}
                  <img
                    src={product.image || 'https://via.placeholder.com/400'}
                    alt={product.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = 'https://via.placeholder.com/400';
                    }}
                  />

                  {/* Similarity Badge */}
                  {/* <div className="absolute top-3 right-3">
                    <div className="bg-accent text-white px-3 py-1 rounded-full text-sm font-semibold shadow-lg">
                      {product.similarity_score}% Match
                    </div>
                  </div> */}

                  {/* Overlay on Hover */}
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300 flex items-center justify-center">
                    <button className="opacity-0 group-hover:opacity-100 bg-accent text-white px-6 py-2 rounded-lg font-semibold transition-all duration-300 transform translate-y-4 group-hover:translate-y-0">
                      View Product
                    </button>
                  </div>
                </div>

                {/* Product Info */}
                <div className="space-y-2">
                  {/* Category Tags */}
                  <div className="flex items-center gap-2 text-sm">
                    <span className="text-accent font-medium capitalize">
                      {product.category.replace(/-/g, ' ')}
                    </span>
                    {product.subcategory && (
                      <>
                        <span className="text-text-muted">/</span>
                        <span className="text-text-secondary capitalize">
                          {product.subcategory}
                        </span>
                      </>
                    )}
                  </div>

                  {/* Product Name */}
                  <h3 className="font-serif text-lg font-bold text-text-primary line-clamp-2 group-hover:text-accent transition-colors">
                    {product.name}
                  </h3>

                  {/* Material */}
                  {product.material && (
                    <p className="text-sm text-text-secondary">
                      Material: <span className="font-medium">{product.material}</span>
                    </p>
                  )}

                  {/* Price */}
                  <div className="pt-2 border-t border-gray-200 dark:border-gray-700">
                    <p className="text-xl font-bold text-accent">
                      Rs {product.price.toLocaleString('en-IN')}
                    </p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}

        {/* No Recommendations Message */}
        {!loading && !error && recommendations.length === 0 && (
          <div className="text-center py-12">
            <p className="text-text-secondary text-lg">
              No similar products found yet. Check back when we add more items!
            </p>
          </div>
        )}
      </div>
    </motion.div>
  );
}
