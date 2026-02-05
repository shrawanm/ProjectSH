export const categories = [
  {
    id: 'pashmina-cashmere',
    name: 'Pashmina / Cashmere',
    subcategories: [
      {
        id: 'stole',
        name: 'Stole',
        subsubcategories: [
          { id: '100-pashmina-stole', name: '100% Pashmina' },
          { id: '50-merino-50-pashmina-stole', name: '50% Merino 50% Pashmina' },
          { id: '30-pashmina-70-merino-stole', name: '30% Pashmina 70% Merino' }
        ]
      },
      { id: 'muffler', name: 'Muffler' },
      { id: 'blankets', name: 'Blankets' },
      { id: 'sweater', name: 'Sweater' },
      { id: 'pancho', name: 'Pancho' },
      { id: 'shawl', name: 'Shawl' }
    ]
  },
  {
    id: 'yak-wool',
    name: 'Yak Wool',
    subcategories: [
      { id: 'blanket', name: 'Blanket' },
      { id: 'pancho', name: 'Pancho' },
      { id: 'sweater', name: 'Sweater' },
      { id: 'shawl', name: 'Shawl' },
      { id: 'mufflers', name: 'Mufflers' }
    ]
  },
  {
    id: 'crafts-paintings',
    name: 'Crafts & Paintings',
    subcategories: [
      { id: 'crafts', name: 'Crafts' },
      {
        id: 'painting',
        name: 'Paintings',
        subsubcategories: [
          { id: 'batik-painting', name: 'Batik Painting' },
          { id: 'silk-painting', name: 'Silk Painting' }
        ]
      }
    ]
  },
  {
    id: 'viscose',
    name: 'Viscose',
    subcategories: [
      { id: 'stole', name: 'Stole' },
      { id: 'shawl', name: 'Shawl' },
      { id: 'muffler', name: 'Muffler' },
      { id: 'blanket', name: 'Blanket' }
    ]
  },
  {
    id: 'tshirts',
    name: 'T-Shirts',
    subcategories: [
      { id: 'mens', name: 'Mens' },
      { id: 'womens', name: 'Womens' },
      { id: 'kids', name: 'Kids' }
    ]
  },
  {
    id: 'jewelry',
    name: 'Jewelry',
    subcategories: [
      { id: 'necklaces', name: 'Necklaces' },
      { id: 'bracelets', name: 'Bracelets' },
      { id: 'earrings', name: 'Earrings' },
      { id: 'rings', name: 'Rings' }
    ]
  }
];

export type Product = {
  id: number;
  name: string;
  price: number;
  category: string;
  subcategory: string;
  subsubcategory: string;
  image: string;
  images?: string[];
  description: string;
  material: string;
  stock: number;
  rating?: number;
  reviews?: number;
  variants: {
    colors: string[];
    sizes: string[];
  };
};

export type Order = {
  id: string;
  customer: string;
  date: string;
  total: number;
  status: 'Pending' | 'Processing' | 'Shipped' | 'Delivered' | 'Cancelled';
  items: number;
};

export type User = {
  id: number;
  name: string;
  email: string;
  status: 'Active' | 'Inactive';
  joined: string;
  avatar?: string;
  registrationMethod?: string;
};

export const normalizeProductData = (product: Product | null): Partial<Product> => {
  if (!product) return {
    name: '', price: 0, category: '', subcategory: '', subsubcategory: '',
    image: '', images: [], description: '', material: '', stock: 0,
    rating: 5, reviews: 0, variants: { colors: [], sizes: [] }
  };
  return {
    ...product,
    variants: {
      colors: Array.isArray(product.variants?.colors) ? product.variants.colors : [],
      sizes: Array.isArray(product.variants?.sizes) ? product.variants.sizes : []
    }
  };
};