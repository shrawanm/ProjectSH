import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { X, Save, Image as ImageIcon, Plus, Palette, Layers, Info, Tag } from 'lucide-react';
import { Product, categories, normalizeProductData } from './AdminTypes';

interface ProductModalProps {
  mode: 'add' | 'edit';
  product: Product | null;
  onClose: () => void;
  onSave: (product: Product) => void;
}

export function ProductModal({ mode, product, onClose, onSave }: ProductModalProps) {
  // Initialize state with normalized data to avoid undefined errors
  const [formData, setFormData] = useState<Partial<Product>>(normalizeProductData(product));
  const [colorInput, setColorInput] = useState('#4F46E5');
  const [sizeInput, setSizeInput] = useState('');
  const [imagePreview, setImagePreview] = useState<string>(product?.image || '');
  const [uploadMethod, setUploadMethod] = useState<'url' | 'upload'>('url');

//prefills
  useEffect(() => {
    const normalized = normalizeProductData(product);
    setFormData(normalized);
    setImagePreview(normalized.image || '');
  }, [product]);

  // Derived state for dynamic dropdowns
  const selectedCategory = categories.find(c => c.id === formData.category);
  const selectedSubcategory = selectedCategory?.subcategories?.find(s => s.id === formData.subcategory);

  const handleAddColor = () => {
    const currentColors = formData.variants?.colors || [];
    if (!currentColors.includes(colorInput)) {
      setFormData(prev => ({
        ...prev,
        variants: {
          sizes: prev.variants?.sizes || [],
          colors: [...currentColors, colorInput]
        }
      }));
    }
  };

  const handleRemoveColor = (color: string) => {
    setFormData(prev => ({
      ...prev,
      variants: {
        sizes: prev.variants?.sizes || [],
        colors: (prev.variants?.colors || []).filter(c => c !== color)
      }
    }));
  };

  const handleAddSize = () => {
    if (sizeInput.trim()) {
      const currentSizes = formData.variants?.sizes || [];
      const normalizedSize = sizeInput.trim().toUpperCase();
      if (!currentSizes.includes(normalizedSize)) {
        setFormData(prev => ({
          ...prev,
          variants: {
            colors: prev.variants?.colors || [],
            sizes: [...currentSizes, normalizedSize]
          }
        }));
      }
      setSizeInput('');
    }
  };

  const handleRemoveSize = (size: string) => {
    setFormData(prev => ({
      ...prev,
      variants: {
        colors: prev.variants?.colors || [],
        sizes: (prev.variants?.sizes || []).filter(s => s !== size)
      }
    }));
  };

  // --- Image Handlers ---
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result as string;
        setImagePreview(base64String);
        setFormData({ ...formData, image: base64String });
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <motion.div 
        initial={{ scale: 0.9, opacity: 0, y: 20 }} 
        animate={{ scale: 1, opacity: 1, y: 0 }} 
        className="bg-white dark:bg-gray-900 w-full max-w-5xl rounded-2xl shadow-2xl overflow-hidden max-h-[92vh] flex flex-col"
      >
        {/* Header */}
        <div className="px-8 py-5 border-b dark:border-gray-800 flex justify-between items-center bg-white dark:bg-gray-900 sticky top-0 z-10">
          <div>
            <h2 className="text-2xl font-serif font-bold dark:text-white">
              {mode === 'edit' ? 'Edit Product' : 'Add New Product'}
            </h2>
            <p className="text-xs text-gray-500 uppercase tracking-widest mt-1">Inventory Management</p>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-colors">
            <X className="w-6 h-6 dark:text-gray-400" />
          </button>
        </div>

        <div className="p-8 overflow-y-auto flex-1 bg-gray-50/50 dark:bg-gray-950/50">
          <div className="grid grid-cols-12 gap-8">
            
            {/* Left Column: Details */}
            <div className="col-span-12 lg:col-span-7 space-y-6">
              
              {/* Categorization */}
              <section className="bg-white dark:bg-gray-900 p-6 rounded-xl border dark:border-gray-800 space-y-4 shadow-sm">
                <div className="flex items-center gap-2 text-accent">
                  <Layers className="w-4 h-4" />
                  <h3 className="font-bold dark:text-white">Categorization</h3>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <select 
                    value={formData.category} 
                    onChange={e => setFormData({ ...formData, category: e.target.value, subcategory: '', subsubcategory: '' })}
                    className="w-full px-4 py-2.5 border dark:border-gray-700 dark:bg-gray-800 dark:text-white rounded-lg outline-none focus:ring-2 focus:ring-accent/20"
                  >
                    <option value="">Select Category</option>
                    {categories.map(cat => <option key={cat.id} value={cat.id}>{cat.name}</option>)}
                  </select>

                  <select 
                    disabled={!selectedCategory}
                    value={formData.subcategory} 
                    onChange={e => setFormData({ ...formData, subcategory: e.target.value, subsubcategory: '' })}
                    className="w-full px-4 py-2.5 border dark:border-gray-700 dark:bg-gray-800 dark:text-white rounded-lg outline-none focus:ring-2 focus:ring-accent/20 disabled:opacity-50"
                  >
                    <option value="">Select Subcategory</option>
                    {selectedCategory?.subcategories?.map(sub => <option key={sub.id} value={sub.id}>{sub.name}</option>)}
                  </select>
                </div>

                {selectedSubcategory?.subsubcategories && (
                  <select 
                    value={formData.subsubcategory} 
                    onChange={e => setFormData({ ...formData, subsubcategory: e.target.value })}
                    className="w-full px-4 py-2.5 border dark:border-gray-700 dark:bg-gray-800 dark:text-white rounded-lg outline-none focus:ring-2 focus:ring-accent/20"
                  >
                    <option value="">Select Sub-subcategory (Optional)</option>
                    {selectedSubcategory.subsubcategories.map(ss => <option key={ss.id} value={ss.id}>{ss.name}</option>)}
                  </select>
                )}
              </section>

              {/* Basic Info */}
              <section className="bg-white dark:bg-gray-900 p-6 rounded-xl border dark:border-gray-800 space-y-4 shadow-sm">
                <div className="flex items-center gap-2 text-accent">
                  <Info className="w-4 h-4" />
                  <h3 className="font-bold dark:text-white">Basic Information</h3>
                </div>
                <input 
                  type="text" 
                  placeholder="Product Name" 
                  value={formData.name}  // current value
                  onChange={e => setFormData({ ...formData, name: e.target.value })}  //updates when user types
                  className="w-full px-4 py-2.5 border dark:border-gray-700 dark:bg-gray-800 dark:text-white rounded-lg outline-none focus:ring-2 focus:ring-accent/20" 
                />
                <textarea 
                  placeholder="Detailed Description" 
                  rows={4} 
                  value={formData.description} 
                  onChange={e => setFormData({ ...formData, description: e.target.value })} 
                  className="w-full px-4 py-2.5 border dark:border-gray-700 dark:bg-gray-800 dark:text-white rounded-lg outline-none focus:ring-2 focus:ring-accent/20" 
                />
                <div className="space-y-1">
                  <label className="text-xs font-bold text-gray-400 uppercase tracking-widest ml-1">Material Composition</label>
                  <input 
                    type="text" 
                    value={formData.material || ''} 
                    onChange={(e) => setFormData({ ...formData, material: e.target.value })}
                    placeholder="e.g. 100% Pashmina, Brass with Gold Plating"
                    className="w-full px-4 py-2.5 border dark:border-gray-700 dark:bg-gray-800 dark:text-white rounded-lg outline-none focus:ring-2 focus:ring-accent/20"
                  />
                </div>
              </section>

              {/* Variants */}
              <section className="bg-white dark:bg-gray-900 p-6 rounded-xl border dark:border-gray-800 space-y-4 shadow-sm">
                <div className="flex items-center gap-2 text-accent">
                  <Palette className="w-4 h-4" />
                  <h3 className="font-bold dark:text-white">Variants & Attributes</h3>
                </div>
                
                {/* Colors */}
                <div className="space-y-3">
                  <label className="text-sm font-medium dark:text-gray-300">Available Colors</label>
                  <div className="flex items-center gap-3">
                    <input 
                      type="color" 
                      value={colorInput} 
                      onChange={e => setColorInput(e.target.value)} 
                      className="w-10 h-10 rounded-lg cursor-pointer border-none bg-transparent"
                    />
                    <button 
                      onClick={handleAddColor} 
                      className="px-4 py-2 bg-gray-900 dark:bg-accent text-white rounded-lg text-sm font-bold hover:bg-black transition-colors"
                    >
                      Add Hex
                    </button>
                  </div>
                  <div className="flex flex-wrap gap-3 p-3 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
                    {formData.variants?.colors.length === 0 && <span className="text-xs text-gray-400 italic">No colors added</span>}
                    {formData.variants?.colors.map(c => (
                      <span key={c} style={{backgroundColor: c}} className="w-9 h-9 rounded-full border-2 border-white dark:border-gray-700 shadow-md flex items-center justify-center group relative">
                        <X onClick={() => handleRemoveColor(c)} className="w-4 h-4 text-white opacity-0 group-hover:opacity-100 cursor-pointer mix-blend-difference transition-opacity" />
                      </span>
                    ))}
                  </div>
                </div>

                {/* Sizes */}
                <div className="space-y-3">
                  <label className="text-sm font-medium dark:text-gray-300">Available Sizes</label>
                  <div className="flex gap-2">
                    <input 
                      type="text" 
                      placeholder="Size (e.g. S, M, XL, 12-inch)" 
                      value={sizeInput} 
                      onChange={e => setSizeInput(e.target.value)} 
                      onKeyPress={(e) => e.key === 'Enter' && handleAddSize()}
                      className="flex-1 px-4 py-2 border dark:border-gray-700 dark:bg-gray-800 dark:text-white rounded-lg outline-none" 
                    />
                    <button onClick={handleAddSize} className="px-4 py-2 bg-gray-100 dark:bg-gray-800 dark:text-white rounded-lg font-bold hover:bg-gray-200 transition-colors">
                      <Plus className="w-5 h-5" />
                    </button>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {formData.variants?.sizes.map(s => (
                      <span key={s} className="px-3 py-1.5 bg-accent/10 text-accent rounded-lg flex items-center gap-2 text-sm font-bold border border-accent/20">
                        {s} <X onClick={() => handleRemoveSize(s)} className="w-3 h-3 cursor-pointer hover:text-red-500" />
                      </span>
                    ))}
                  </div>
                </div>
              </section>
            </div>

            {/* Right Column: Pricing & Media */}
            <div className="col-span-12 lg:col-span-5 space-y-6">
              
              <section className="bg-white dark:bg-gray-900 p-6 rounded-xl border dark:border-gray-800 space-y-4 shadow-sm">
                <div className="flex items-center gap-2 text-accent">
                  <Tag className="w-4 h-4" />
                  <h3 className="font-bold dark:text-white">Pricing & Stock</h3>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-gray-400 uppercase ml-1">Price (NPR)</label>
                    <input type="number" value={formData.price} onChange={e => setFormData({ ...formData, price: Number(e.target.value) })} className="w-full px-4 py-2.5 border dark:border-gray-700 dark:bg-gray-800 dark:text-white rounded-lg outline-none" />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-gray-400 uppercase ml-1">Stock Quantity</label>
                    <input type="number" value={formData.stock} onChange={e => setFormData({ ...formData, stock: Number(e.target.value) })} className="w-full px-4 py-2.5 border dark:border-gray-700 dark:bg-gray-800 dark:text-white rounded-lg outline-none" />
                  </div>
                </div>
              </section>

              <section className="bg-white dark:bg-gray-900 p-6 rounded-xl border dark:border-gray-800 space-y-4 shadow-sm">
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-2 text-accent">
                    <ImageIcon className="w-4 h-4" />
                    <h3 className="font-bold dark:text-white">Product Media</h3>
                  </div>
                  <div className="flex bg-gray-100 dark:bg-gray-800 p-1 rounded-lg text-[10px] font-bold">
                    <button onClick={() => setUploadMethod('url')} className={`px-3 py-1 rounded-md transition-all ${uploadMethod === 'url' ? 'bg-white dark:bg-gray-700 shadow-sm text-accent' : 'text-gray-500'}`}>URL</button>
                    <button onClick={() => setUploadMethod('upload')} className={`px-3 py-1 rounded-md transition-all ${uploadMethod === 'upload' ? 'bg-white dark:bg-gray-700 shadow-sm text-accent' : 'text-gray-500'}`}>FILE</button>
                  </div>
                </div>

                {uploadMethod === 'url' ? (
                  <input 
                    type="text" 
                    value={formData.image} 
                    onChange={e => { setFormData({...formData, image: e.target.value}); setImagePreview(e.target.value); }} 
                    placeholder="https://example.com/image.jpg" 
                    className="w-full px-4 py-2.5 border dark:border-gray-700 dark:bg-gray-800 dark:text-white rounded-lg outline-none text-sm" 
                  />
                ) : (
                  <div className="relative border-2 border-dashed border-gray-200 dark:border-gray-700 rounded-xl p-6 text-center hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
                    <input type="file" accept="image/*" onChange={handleImageUpload} className="absolute inset-0 opacity-0 cursor-pointer" />
                    <Plus className="mx-auto w-6 h-6 text-gray-400 mb-2" />
                    <p className="text-xs text-gray-500 font-medium">Drop image here or click to browse</p>
                  </div>
                )}

                <div className="aspect-square bg-gray-100 dark:bg-gray-800 rounded-xl overflow-hidden border dark:border-gray-700 relative">
                  {imagePreview ? (
                    <img src={imagePreview} className="w-full h-full object-cover" alt="Preview" />
                  ) : (
                    <div className="w-full h-full flex flex-col items-center justify-center text-gray-300">
                      <ImageIcon className="w-12 h-12 opacity-20" />
                      <span className="text-[10px] font-bold uppercase tracking-tighter mt-2 opacity-40">No Image Preview</span>
                    </div>
                  )}
                </div>
              </section>

            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-8 py-5 border-t dark:border-gray-800 bg-white dark:bg-gray-900 flex justify-end gap-3 sticky bottom-0">
          <button 
            onClick={onClose} 
            className="px-6 py-2.5 border dark:border-gray-700 dark:text-white rounded-xl hover:bg-gray-50 dark:hover:bg-gray-800 font-medium transition-colors"
          >
            Cancel
          </button>
          <button 
            onClick={() => onSave(formData as Product)} 
            className="px-8 py-2.5 bg-accent text-white rounded-xl flex items-center gap-2 shadow-lg shadow-accent/20 hover:bg-accent-hover transition-all font-bold"
          >
            <Save className="w-4 h-4" /> Save Product
          </button>
        </div>
      </motion.div>
    </div>
  );
}