import { useState, useRef, ChangeEvent, useEffect } from 'react';
import { Plus, Search, Filter, MoreHorizontal, X, Upload, Check, Edit2, Trash2 } from 'lucide-react';
import { Product } from '@/types';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '@/lib/utils';
import { db, handleFirestoreError, OperationType, auth } from '@/lib/firebase';
import { collection, onSnapshot, addDoc, updateDoc, doc, deleteDoc, serverTimestamp, query, orderBy } from 'firebase/firestore';
import { OptimizedImage } from '@/components/ui/OptimizedImage';

export function Products() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [isSlideOverOpen, setIsSlideOverOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  
  // Real-time subscription
  useEffect(() => {
    let unsubscribe = () => {};

    const setupSubscription = () => {
      const q = query(collection(db, 'products'), orderBy('name', 'asc'));
      unsubscribe = onSnapshot(q, (snapshot) => {
        const productList = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        })) as Product[];
        setProducts(productList);
        setLoading(false);
      }, (error) => {
        // Only error if we actually expected to succeed (e.g. if we are trying to list as admin)
        // Note: products list is public in rules, but listing them in the admin dash might still hit permissions
        // if the rules were tighter. Best to check auth.
        handleFirestoreError(error, OperationType.LIST, 'products');
      });
    };

    const authUnsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        unsubscribe();
        setupSubscription();
      } else {
        setLoading(false);
        setProducts([]);
      }
    });

    return () => {
      unsubscribe();
      authUnsubscribe();
    };
  }, []);
  
  // Form State
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [formData, setFormData] = useState<Partial<Product>>({
    name: '',
    category: 'Chips',
    price: 0,
    stock: 0,
    status: 'Active',
    image: '🍿',
    description: '',
    isSeasonal: false,
    isBundle: false
  });
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleOpenAdd = () => {
    setEditingProduct(null);
    setFormData({
      name: '',
      category: 'Chips',
      price: 0,
      stock: 0,
      status: 'Active',
      image: '🍿',
      description: '',
      isSeasonal: false,
      isBundle: false
    });
    setImagePreview(null);
    setIsSlideOverOpen(true);
  };

  const handleOpenEdit = (product: Product) => {
    setEditingProduct(product);
    setFormData(product);
    setImagePreview(product.image.startsWith('http') || product.image.startsWith('data:') ? product.image : null);
    setIsSlideOverOpen(true);
  };

  const handleImageClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileUpload = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const img = new Image();
        img.src = reader.result as string;
        img.onload = () => {
          // Max dimensions for resizing
          const MAX_WIDTH = 800;
          const MAX_HEIGHT = 800;
          let width = img.width;
          let height = img.height;

          if (width > height) {
            if (width > MAX_WIDTH) {
              height *= MAX_WIDTH / width;
              width = MAX_WIDTH;
            }
          } else {
            if (height > MAX_HEIGHT) {
              width *= MAX_HEIGHT / height;
              height = MAX_HEIGHT;
            }
          }

          const canvas = document.createElement('canvas');
          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext('2d');
          ctx?.drawImage(img, 0, 0, width, height);

          // Get compressed base64
          const dataUrl = canvas.toDataURL('image/jpeg', 0.7); // 0.7 quality
          setImagePreview(dataUrl);
          setFormData(prev => ({ ...prev, image: dataUrl }));
        };
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = async () => {
    try {
      const productData = {
        ...formData,
        updatedAt: serverTimestamp(),
      };

      if (editingProduct) {
        await updateDoc(doc(db, 'products', editingProduct.id), productData);
      } else {
        await addDoc(collection(db, 'products'), {
          ...productData,
          createdAt: serverTimestamp(),
        });
      }
      setIsSlideOverOpen(false);
    } catch (error) {
      handleFirestoreError(error, editingProduct ? OperationType.UPDATE : OperationType.CREATE, `products/${editingProduct?.id || ''}`);
    }
  };

  const toggleProductProperty = async (id: string, property: 'isSeasonal' | 'isBundle') => {
    try {
      const product = products.find(p => p.id === id);
      if (product) {
        await updateDoc(doc(db, 'products', id), {
          [property]: !product[property],
          updatedAt: serverTimestamp()
        });
      }
    } catch (error) {
      handleFirestoreError(error, OperationType.UPDATE, `products/${id}`);
    }
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this snack?')) {
      try {
        await deleteDoc(doc(db, 'products', id));
      } catch (error) {
        handleFirestoreError(error, OperationType.DELETE, `products/${id}`);
      }
    }
  };

  const filteredProducts = products.filter(p => 
    p.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    p.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-8 relative">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-800">Inventory</h1>
          <p className="text-slate-500 mt-1">Manage your handmade snack catalog.</p>
        </div>
        <button 
          onClick={handleOpenAdd}
          className="flex items-center gap-2 px-4 py-2 bg-spark-orange text-white rounded-lg text-sm font-medium hover:brightness-110 shadow-sm shadow-orange-200 transition-all"
        >
          <Plus className="w-4 h-4" />
          Add New Snack
        </button>
      </div>

      <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm">
        <div className="p-4 border-b border-slate-200 flex flex-col md:flex-row gap-4 items-center justify-between">
          <div className="relative w-full md:w-96">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input 
              type="text" 
              placeholder="Search by snack name or category..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-slate-100 border-transparent focus:bg-white focus:border-slate-200 focus:ring-1 focus:ring-orange-100 rounded-lg py-2.5 pl-10 pr-4 text-sm transition-all"
            />
          </div>
          <div className="flex items-center gap-2 w-full md:w-auto">
            <button className="flex items-center gap-2 px-3 py-2.5 border border-slate-200 rounded-lg text-sm font-medium text-slate-600 hover:bg-slate-50 transition-all grow md:grow-0 justify-center">
              <Filter className="w-4 h-4" />
              Filters
            </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-slate-50/50 text-[10px] font-bold text-slate-400 uppercase tracking-widest border-b border-slate-200">
                <th className="px-6 py-5">Snack Name</th>
                <th className="px-6 py-5">Price</th>
                <th className="px-6 py-5">Stock</th>
                <th className="px-6 py-5">Seasonal</th>
                <th className="px-6 py-5">Bundle</th>
                <th className="px-6 py-5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {loading ? (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center">
                    <div className="flex flex-col items-center gap-3">
                      <div className="w-8 h-8 border-4 border-spark-orange/20 border-t-spark-orange rounded-full animate-spin" />
                      <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Loading snacks...</p>
                    </div>
                  </td>
                </tr>
              ) : filteredProducts.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-slate-400 italic">
                    No snacks found. Add your first artisanal snack!
                  </td>
                </tr>
              ) : filteredProducts.map((product, idx) => (
                <motion.tr 
                  key={product.id}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: idx * 0.05 }}
                  className="hover:bg-slate-50/80 transition-colors group cursor-pointer"
                >
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-4">
                      <OptimizedImage 
                        src={product.image} 
                        alt={product.name}
                        className="w-12 h-12 rounded-lg border border-slate-200"
                      />
                      <div>
                        <p className="text-sm font-bold text-slate-700 group-hover:text-spark-orange transition-colors">{product.name}</p>
                        <p className="text-[10px] text-slate-400 font-medium">{product.category}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm font-bold text-slate-800">${product.price.toFixed(2)}</td>
                  <td className="px-6 py-4 text-sm">
                    <span className={cn(
                      "font-semibold flex items-center gap-2",
                      product.stock < 20 ? 'text-rose-600' : 'text-slate-600'
                    )}>
                      <div className={cn("w-1.5 h-1.5 rounded-full", product.stock < 20 ? "bg-rose-500" : "bg-emerald-500")} />
                      {product.stock}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <button 
                      onClick={(e) => { e.stopPropagation(); toggleProductProperty(product.id, 'isSeasonal'); }}
                      className={cn(
                        "w-10 h-5 rounded-full transition-all relative overflow-hidden",
                        product.isSeasonal ? "bg-spark-orange" : "bg-slate-200"
                      )}
                    >
                      <div className={cn(
                        "absolute top-1 w-3 h-3 bg-white rounded-full transition-all shadow-sm",
                        product.isSeasonal ? "left-6" : "left-1"
                      )} />
                    </button>
                  </td>
                  <td className="px-6 py-4">
                    <button 
                      onClick={(e) => { e.stopPropagation(); toggleProductProperty(product.id, 'isBundle'); }}
                      className={cn(
                        "w-10 h-5 rounded-full transition-all relative overflow-hidden",
                        product.isBundle ? "bg-blue-600" : "bg-slate-200"
                      )}
                    >
                      <div className={cn(
                        "absolute top-1 w-3 h-3 bg-white rounded-full transition-all shadow-sm",
                        product.isBundle ? "left-6" : "left-1"
                      )} />
                    </button>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button 
                        onClick={(e) => { e.stopPropagation(); handleOpenEdit(product); }}
                        className="p-2 hover:bg-white rounded-lg border border-transparent hover:border-slate-200 transition-all opacity-0 group-hover:opacity-100"
                        title="Edit Product"
                      >
                        <Edit2 className="w-4 h-4 text-slate-400 hover:text-spark-orange" />
                      </button>
                      <button 
                        onClick={(e) => { e.stopPropagation(); handleDelete(product.id); }}
                        className="p-2 hover:bg-white rounded-lg border border-transparent hover:border-slate-200 transition-all opacity-0 group-hover:opacity-100"
                        title="Delete Product"
                      >
                        <Trash2 className="w-4 h-4 text-slate-400 hover:text-rose-500" />
                      </button>
                      <button className="p-2 hover:bg-white rounded-lg border border-transparent hover:border-slate-200 transition-all opacity-0 group-hover:opacity-100">
                        <MoreHorizontal className="w-4 h-4 text-slate-400 hover:text-slate-800" />
                      </button>
                    </div>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Slide-over Panel */}
      <AnimatePresence>
        {isSlideOverOpen && (
          <>
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsSlideOverOpen(false)}
              className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50"
            />
            <motion.div 
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed right-0 top-0 h-full w-full max-w-md bg-white shadow-2xl z-50 flex flex-col"
            >
              <div className="p-6 border-b border-slate-100 flex items-center justify-between">
                <h2 className="text-xl font-bold text-slate-800">
                  {editingProduct ? 'Edit Snack' : 'Add New Snack'}
                </h2>
                <button 
                  onClick={() => setIsSlideOverOpen(false)}
                  className="p-2 hover:bg-slate-100 rounded-full transition-colors"
                >
                  <X className="w-5 h-5 text-slate-500" />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto p-6 space-y-6">
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-widest">Snack Name</label>
                  <input 
                    type="text" 
                    placeholder="e.g. Spicy Honey Cashews"
                    value={formData.name}
                    onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                    className="w-full bg-slate-100 border-none focus:ring-1 focus:ring-orange-100 rounded-lg p-3 text-sm"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-widest">Category</label>
                  <select 
                    value={formData.category}
                    onChange={(e) => setFormData(prev => ({ ...prev, category: e.target.value }))}
                    className="w-full bg-slate-100 border-none focus:ring-1 focus:ring-orange-100 rounded-lg p-3 text-sm"
                  >
                    <option value="Chips">Chips</option>
                    <option value="Nuts">Nuts</option>
                    <option value="Fruits">Fruits</option>
                    <option value="Crackers">Crackers</option>
                    <option value="Bundles">Bundles</option>
                  </select>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-widest">Description</label>
                  <textarea 
                    rows={4}
                    placeholder="Describe the flavors, ingredients..."
                    value={formData.description}
                    onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                    className="w-full bg-slate-100 border-none focus:ring-1 focus:ring-orange-100 rounded-lg p-3 text-sm resize-none"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-500 uppercase tracking-widest">Price ($)</label>
                    <input 
                      type="number" 
                      step="0.01"
                      placeholder="0.00"
                      value={formData.price || 0}
                      onChange={(e) => setFormData(prev => ({ ...prev, price: parseFloat(e.target.value) || 0 }))}
                      className="w-full bg-slate-100 border-none focus:ring-1 focus:ring-orange-100 rounded-lg p-3 text-sm"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-500 uppercase tracking-widest">Stock Level</label>
                    <input 
                      type="number" 
                      placeholder="0"
                      value={formData.stock || 0}
                      onChange={(e) => setFormData(prev => ({ ...prev, stock: parseInt(e.target.value) || 0 }))}
                      className="w-full bg-slate-100 border-none focus:ring-1 focus:ring-orange-100 rounded-lg p-3 text-sm"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-widest">Image</label>
                  <input 
                    type="file" 
                    className="hidden" 
                    ref={fileInputRef} 
                    onChange={handleFileUpload}
                    accept="image/*"
                  />
                  <div 
                    onClick={handleImageClick}
                    className="border-2 border-dashed border-slate-200 rounded-xl p-8 flex flex-col items-center justify-center gap-3 text-slate-400 hover:border-orange-200 hover:text-orange-400 transition-all cursor-pointer group overflow-hidden relative min-h-[160px]"
                  >
                    {imagePreview ? (
                      <div className="absolute inset-0 w-full h-full">
                        <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                          <p className="text-white text-xs font-bold">Change Image</p>
                        </div>
                      </div>
                    ) : formData.image && !formData.image.startsWith('http') && !formData.image.startsWith('data:') ? (
                       <div className="flex flex-col items-center gap-3">
                         <div className="text-5xl">{formData.image}</div>
                         <p className="text-xs font-medium">Using emoji/placeholder. Click to upload image.</p>
                       </div>
                    ) : (
                      <>
                        <div className="p-3 bg-slate-50 rounded-full group-hover:bg-orange-50 transition-colors">
                          <Upload className="w-6 h-6" />
                        </div>
                        <p className="text-xs font-medium">Click to upload or drag and drop</p>
                        <p className="text-[10px] opacity-70">Max. 1MB (Auto-compressed if larger)</p>
                      </>
                    )}
                  </div>
                </div>
              </div>

              <div className="p-6 border-t border-slate-100 bg-slate-50 flex gap-3">
                <button 
                  onClick={() => setIsSlideOverOpen(false)}
                  className="flex-1 px-4 py-3 bg-white border border-slate-200 rounded-lg text-sm font-bold text-slate-600 hover:bg-white transition-all"
                >
                  Cancel
                </button>
                <button 
                  onClick={handleSave}
                  className="flex-1 px-4 py-3 bg-spark-orange text-white rounded-lg text-sm font-bold hover:brightness-110 shadow-sm shadow-orange-200 transition-all flex items-center justify-center gap-2"
                >
                  <Check className="w-4 h-4" />
                  {editingProduct ? 'Update Snack' : 'Save Snack'}
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
