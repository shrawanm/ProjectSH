import React, { useState, useCallback, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { X, Search as SearchIcon } from 'lucide-react';
import { useSearchHook } from '../hooks/useSearchHook';

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SearchModal: React.FC<SearchModalProps> = ({ isOpen, onClose }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const { products, loading, error } = useSearchHook(searchQuery);
  const navigate = useNavigate();

  const handleProductClick = (productId: string) => {
    navigate(`/product/${productId}`);
    onClose();
    setSearchQuery('');
  };

  const handleClose = () => {
    setSearchQuery('');
    onClose();
  };

  useEffect(() => {
    const handleEscKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        handleClose();
      }
    };

    if (isOpen) {
      window.addEventListener('keydown', handleEscKey);
      return () => window.removeEventListener('keydown', handleEscKey);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/50 z-40"
        onClick={handleClose}
      />

      {/* Modal */}
      <div className="fixed top-0 left-0 right-0 z-50 bg-bg-lighter shadow-lg">
        <div className="max-w-2xl mx-auto p-4">
          {/* Search Input */}
          <div className="flex items-center gap-3 mb-4">
            <SearchIcon className="w-5 h-5 text-text-secondary" />
            <input
              type="text"
              placeholder="Search by product name, material, or category..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="flex-1 bg-transparent outline-none text-text-primary text-lg"
              autoFocus
            />
            <button
              onClick={handleClose}
              className="p-1 hover:bg-text-secondary/10 rounded transition-colors"
            >
              <X className="w-5 h-5 text-text-secondary" />
            </button>
          </div>

          {/* Results */}
          <div className="max-h-96 overflow-y-auto bg-bg-darker/50 rounded p-2">
            {searchQuery.trim() === '' ? (
              <p className="text-text-secondary text-center py-8">
                Start typing to search products...
              </p>
            ) : loading ? (
              <p className="text-text-secondary text-center py-8">
                Searching...
              </p>
            ) : error ? (
              <p className="text-red-500 text-center py-8">
                {error}
              </p>
            ) : products.length === 0 ? (
              <p className="text-text-secondary text-center py-8">
                No products found for "{searchQuery}"
              </p>
            ) : (
              <div className="space-y-2">
                {products.map((product) => (
                  <button
                    key={product.id}
                    onClick={() => handleProductClick(product.id)}
className="w-full flex items-center gap-3 p-3 hover:bg-text-secondary/10 rounded transition-colors text-left group bg-bg-darker"                  >
                    <img
                      src={product.image}
                      alt={product.name}
                      className="w-12 h-12 object-cover rounded"
                    />
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-text-light group-hover:text-accent truncate">
                        {product.name}
                      </p>
                      <div className="flex gap-2 text-sm text-text-secondary">
                        <span>{product.category}</span>
                        {product.material && <span>•</span>}
                        {product.material && <span>{product.material}</span>}
                      </div>
                    </div>
                    <div className="text-right whitespace-nowrap">
                      <p className="font-semibold text-accent">
                        Rs {product.price}
                      </p>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};
