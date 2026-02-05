import { useState, useEffect } from 'react';

export type FilterType = 'category' | 'subcategory' | 'subsubcategory';

export interface Product {
  id: number;
  name: string;
  price: number;
  category: string;
  subcategory: string;
  subsubcategory: string;
  image: string;     
  images: string[];   
  description: string;
  material: string;
  stock: number;
  rating?: number;    
  reviews?: any[];    
  variants: {
    colors: string[];
    sizes: string[];
  };
}

export function useProductHook(filterType: FilterType, filterValue: string) {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      setError(null);
      try {
        const url = `http://localhost/ShrawanHandicraftsFYP/backend/api/products.php?${filterType}=${encodeURIComponent(filterValue)}`;
        const res = await fetch(url);
        
        if (!res.ok) throw new Error('Failed to fetch data');
        const data = await res.json();
        const formattedData = Array.isArray(data) ? data.map((p: any) => ({
          ...p,
          variants: typeof p.variants === 'string' ? JSON.parse(p.variants) : (p.variants || { colors: [], sizes: [] }),
                    price: Number(p.price),
          stock: Number(p.stock),

          images: p.image ? [p.image] : [],
          rating: 5,
          reviews: []
        })) : [];
        
        setProducts(formattedData);
      } catch (err: any) {
        console.error("Hook Error:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    if (filterValue) {
      fetchProducts();
    }
  }, [filterType, filterValue]);
  return { products, loading, error };
}