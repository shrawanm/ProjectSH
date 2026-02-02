import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { X, Save, Image as ImageIcon, Plus } from 'lucide-react';
import { Product, categories, normalizeProductData } from './AdminTypes';

interface ProductModalProps {
  mode: 'add' | 'edit';
  product: Product | null;
  onClose: () => void;
  onSave: (product: Product) => void;
}

export function ProductModal({ mode, product, onClose, onSave }: ProductModalProps) {
  const [formData, setFormData] = useState<Partial<Product>>(normalizeProductData(product));
  const [colorInput, setColorInput] = useState('#08ef1f');
  const [sizeInput, setSizeInput] = useState('');
  const [imagePreview, setImagePreview] = useState<string>(product?.image || '');
  const [uploadMethod, setUploadMethod] = useState<'url' | 'upload'>('url');

  useEffect(() => {
    const normalized = normalizeProductData(product);
    setFormData(normalized);
    setImagePreview(normalized.image || '');
  }, [product]);

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
      if (!currentSizes.includes(sizeInput)) {
        setFormData(prev => ({
          ...prev,
          variants: {
            colors: prev.variants?.colors || [],
            sizes: [...currentSizes, sizeInput.trim()]
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

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const result = reader.result as string;
        setImagePreview(result);
        setFormData({ ...formData, image: result });
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <motion.div 
        initial={{ scale: 0.95, opacity: 0 }} 
        animate={{ scale: 1, opacity: 1 }} 
        className="bg-white dark:bg-gray-900 w-full max-w-5xl rounded-2xl shadow-2xl overflow-hidden max-h-[90vh] flex flex-col"
      >
        <div className="px-8 py-5 border-b flex justify-between items-center bg-white sticky top-0 z-10">
          <h2 className="text-2xl font-bold">{mode === 'edit' ? 'Edit Product' : 'Add New Product'}</h2>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full"><X className="w-6 h-6" /></button>
        </div>

        <div className="p-8 overflow-y-auto flex-1 bg-gray-50/50">
          <div className="grid grid-cols-12 gap-8">
            <div className="col-span-12 lg:col-span-7 space-y-6">
              {/* Categorization Section */}
              <section className="bg-white p-6 rounded-xl border space-y-4">
                <h3 className="font-bold">Categorization</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <select 
                    value={formData.category} 
                    onChange={e => setFormData({ ...formData, category: e.target.value, subcategory: '', subsubcategory: '' })}
                    className="w-full px-4 py-2 border rounded-lg"
                  >
                    <option value="">Select Category</option>
                    {categories.map(cat => <option key={cat.id} value={cat.id}>{cat.name}</option>)}
                  </select>

                  <select 
                    disabled={!selectedCategory}
                    value={formData.subcategory} 
                    onChange={e => setFormData({ ...formData, subcategory: e.target.value, subsubcategory: '' })}
                    className="w-full px-4 py-2 border rounded-lg"
                  >
                    <option value="">Select Subcategory</option>
                    {selectedCategory?.subcategories?.map(sub => <option key={sub.id} value={sub.id}>{sub.name}</option>)}
                  </select>
                </div>

                {/* This uses the 'selectedSubcategory' variable to show sub-sub-categories if they exist */}
                {selectedSubcategory?.subsubcategories && (
                  <select 
                    value={formData.subsubcategory} 
                    onChange={e => setFormData({ ...formData, subsubcategory: e.target.value })}
                    className="w-full px-4 py-2 border rounded-lg"
                  >
                    <option value="">Select Sub-subcategory</option>
                    {selectedSubcategory.subsubcategories.map(ss => <option key={ss.id} value={ss.id}>{ss.name}</option>)}
                  </select>
                )}
              </section>

              <section className="bg-white p-6 rounded-xl border space-y-4">
                <h3 className="font-bold">Basic Information</h3>
                <input type="text" placeholder="Product Name" value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} className="w-full px-4 py-2 border rounded-lg" />
                <textarea placeholder="Description" rows={4} value={formData.description} onChange={e => setFormData({ ...formData, description: e.target.value })} className="w-full px-4 py-2 border rounded-lg" />
              </section>

              <section className="bg-white p-6 rounded-xl border space-y-4">
                <div className="flex items-center gap-2"><Plus className="w-4 h-4" /><h3 className="font-bold">Variants</h3></div>
                <div className="flex items-center gap-3">
                  <input type="color" value={colorInput} onChange={e => setColorInput(e.target.value)} />
                  <button onClick={handleAddColor} className="px-4 py-2 bg-gray-900 text-white rounded-lg">Add Color</button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {formData.variants?.colors.map(c => (
                    <span key={c} style={{backgroundColor: c}} className="w-8 h-8 rounded-full border shadow-sm flex items-center justify-center">
                      <X onClick={() => handleRemoveColor(c)} className="w-3 h-3 text-white cursor-pointer mix-blend-difference" />
                    </span>
                  ))}
                </div>
                <div className="flex gap-2">
                  <input type="text" placeholder="Size (e.g. XL)" value={sizeInput} onChange={e => setSizeInput(e.target.value)} className="flex-1 px-4 py-2 border rounded-lg" />
                  <button onClick={handleAddSize} className="px-4 py-2 bg-gray-100 rounded-lg">Add Size</button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {formData.variants?.sizes.map(s => (
                    <span key={s} className="px-3 py-1 bg-blue-50 text-blue-700 rounded-lg flex items-center gap-2">
                      {s} <X onClick={() => handleRemoveSize(s)} className="w-3 h-3 cursor-pointer" />
                    </span>
                  ))}
                </div>
              </section>
            </div>

            <div className="col-span-12 lg:col-span-5 space-y-6">
              <section className="bg-white p-6 rounded-xl border space-y-4">
                <h3 className="font-bold">Pricing & Stock</h3>
                <input type="number" placeholder="Price" value={formData.price} onChange={e => setFormData({ ...formData, price: Number(e.target.value) })} className="w-full px-4 py-2 border rounded-lg" />
                <input type="number" placeholder="Stock" value={formData.stock} onChange={e => setFormData({ ...formData, stock: Number(e.target.value) })} className="w-full px-4 py-2 border rounded-lg" />
              </section>

              <section className="bg-white p-6 rounded-xl border space-y-4">
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-2"><ImageIcon className="w-4 h-4" /><h3 className="font-bold">Product Image</h3></div>
                  <div className="flex bg-gray-100 p-1 rounded-lg text-xs">
                    <button onClick={() => setUploadMethod('url')} className={`px-3 py-1 rounded ${uploadMethod === 'url' ? 'bg-white shadow' : ''}`}>URL</button>
                    <button onClick={() => setUploadMethod('upload')} className={`px-3 py-1 rounded ${uploadMethod === 'upload' ? 'bg-white shadow' : ''}`}>Upload</button>
                  </div>
                </div>
                {uploadMethod === 'url' ? (
                   <input type="text" value={formData.image} onChange={e => { setFormData({...formData, image: e.target.value}); setImagePreview(e.target.value); }} placeholder="Paste Image URL" className="w-full px-4 py-2 border rounded-lg" />
                ) : (
                   <div className="relative border-2 border-dashed rounded-xl p-4 text-center hover:bg-gray-50">
                     <input type="file" onChange={handleImageUpload} className="absolute inset-0 opacity-0 cursor-pointer" />
                     <p className="text-sm text-gray-500">Click to upload product image</p>
                   </div>
                )}
                <div className="aspect-square bg-gray-100 rounded-xl overflow-hidden border">
                  {imagePreview ? <img src={imagePreview} className="w-full h-full object-cover" /> : <div className="w-full h-full flex items-center justify-center text-gray-300"><ImageIcon className="w-12 h-12" /></div>}
                </div>
              </section>
            </div>
          </div>
        </div>

        <div className="px-8 py-5 border-t bg-white flex justify-end gap-3 sticky bottom-0">
          <button onClick={onClose} className="px-6 py-2 border rounded-lg hover:bg-gray-50">Cancel</button>
          <button onClick={() => onSave(formData as Product)} className="px-6 py-2 bg-blue-600 text-white rounded-lg flex items-center gap-2 shadow-lg shadow-blue-200">
            <Save className="w-4 h-4" /> Save Product
          </button>
        </div>
      </motion.div>
    </div>
  );
}