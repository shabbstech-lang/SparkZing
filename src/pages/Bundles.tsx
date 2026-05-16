import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Plus, Search, X, Check, Edit2, Trash2, Home, ChevronRight, Package, IndianRupee, Sparkles } from 'lucide-react';
import { Product, BundleOffer } from '@/types';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '@/lib/utils';
import { db, handleFirestoreError, OperationType, auth } from '@/lib/firebase';
import { collection, onSnapshot, addDoc, updateDoc, doc, deleteDoc, serverTimestamp, query, orderBy } from 'firebase/firestore';
import { OptimizedImage } from '@/components/ui/OptimizedImage';

export function Bundles() {
  const [bundles, setBundles] = useState<BundleOffer[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [isSlideOverOpen, setIsSlideOverOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    let unsubBundles = () => {};
    let unsubProducts = () => {};

    const setupSubscriptions = () => {
      // Bundles subscription
      const bq = query(collection(db, 'bundles'), orderBy('createdAt', 'desc'));
      unsubBundles = onSnapshot(bq, (snapshot) => {
        const bundleList = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        })) as BundleOffer[];
        setBundles(bundleList);
      }, (error) => {
        handleFirestoreError(error, OperationType.LIST, 'bundles');
      });

      // Products subscription for selection
      const pq = query(collection(db, 'products'), orderBy('name', 'asc'));
      unsubProducts = onSnapshot(pq, (snapshot) => {
        const productList = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        })) as Product[];
        setProducts(productList);
        setLoading(false);
      }, (error) => {
        handleFirestoreError(error, OperationType.LIST, 'products');
      });
    };

    setupSubscriptions();
    
    return () => {
      unsubBundles();
      unsubProducts();
    };
  }, []);

  const [editingBundle, setEditingBundle] = useState<BundleOffer | null>(null);
  const [formData, setFormData] = useState<Partial<BundleOffer>>({
    name: '',
    description: '',
    productIds: [],
    price: 0,
    originalPrice: 0,
    active: true,
    image: ''
  });

  const handleOpenAdd = () => {
    setEditingBundle(null);
    setFormData({
      name: '',
      description: '',
      productIds: [],
      price: 0,
      originalPrice: 0,
      active: true,
      image: ''
    });
    setIsSlideOverOpen(true);
  };

  const handleOpenEdit = (bundle: BundleOffer) => {
    setEditingBundle(bundle);
    setFormData(bundle);
    setIsSlideOverOpen(true);
  };

  const handleToggleProduct = (productId: string) => {
    setFormData(prev => {
      const ids = prev.productIds || [];
      const newIds = ids.includes(productId) 
        ? ids.filter(id => id !== productId)
        : [...ids, productId];
      
      // Auto-calculate original price
      const originalPrice = newIds.reduce((sum, id) => {
        const p = products.find(prod => prod.id === id);
        return sum + (p?.price || 0);
      }, 0);

      return { ...prev, productIds: newIds, originalPrice };
    });
  };

  const handleSave = async () => {
    try {
      const bundleData = {
        ...formData,
        updatedAt: serverTimestamp(),
      };

      if (editingBundle) {
        await updateDoc(doc(db, 'bundles', editingBundle.id), bundleData);
      } else {
        await addDoc(collection(db, 'bundles'), {
          ...bundleData,
          createdAt: serverTimestamp(),
        });
      }
      setIsSlideOverOpen(false);
    } catch (error) {
      handleFirestoreError(error, editingBundle ? OperationType.UPDATE : OperationType.CREATE, `bundles/${editingBundle?.id || ''}`);
    }
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Delete this bundle offer?')) {
      try {
        await deleteDoc(doc(db, 'bundles', id));
      } catch (error) {
        handleFirestoreError(error, OperationType.DELETE, `bundles/${id}`);
      }
    }
  };

  const filteredBundles = bundles.filter(b => 
    b.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-8 relative font-sans">
      <div className="space-y-1">
        <nav className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-slate-400 mb-4">
          <Link to="/" className="p-1 hover:bg-slate-100 rounded-md transition-colors">
            <Home className="w-3.5 h-3.5" />
          </Link>
          <ChevronRight className="w-3 h-3" />
          <Link to="/admin" className="hover:text-spark-orange transition-colors">Dashboard</Link>
          <ChevronRight className="w-3 h-3" />
          <span className="text-slate-600">Bundle Offers</span>
        </nav>
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-slate-800">Bundle Offers</h1>
            <p className="text-slate-500 mt-1">Create irresistible curated snack collections.</p>
          </div>
          <button 
            onClick={handleOpenAdd}
            className="flex items-center gap-2 px-4 py-2 bg-chili text-white rounded-lg text-sm font-medium hover:brightness-110 shadow-sm shadow-orange-200 transition-all"
          >
            <Plus className="w-4 h-4" />
            Create Bundle
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {loading ? (
             <div className="col-span-full py-12 text-center">
                <div className="w-8 h-8 border-4 border-chili/20 border-t-chili rounded-full animate-spin mx-auto mb-4" />
                <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Warping to your bundles...</p>
             </div>
        ) : filteredBundles.length === 0 ? (
            <div className="col-span-full py-24 text-center bg-white border-2 border-dashed border-slate-200 rounded-3xl">
                <Sparkles className="w-12 h-12 text-slate-200 mx-auto mb-4" />
                <p className="text-slate-400 font-medium">No bundles yet. Create an offer to boost sales!</p>
            </div>
        ) : filteredBundles.map(bundle => (
          <motion.div 
            key={bundle.id}
            layoutId={bundle.id}
            className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm hover:shadow-xl transition-all group"
          >
            <div className="flex justify-between items-start mb-6">
              <div className="w-12 h-12 bg-cream rounded-2xl flex items-center justify-center text-2xl shadow-inner">
                🎁
              </div>
              <div className="flex gap-2">
                <button onClick={() => handleOpenEdit(bundle)} className="p-2 hover:bg-slate-50 rounded-lg text-slate-400 hover:text-chili transition-colors">
                  <Edit2 className="w-4 h-4" />
                </button>
                <button onClick={() => handleDelete(bundle.id)} className="p-2 hover:bg-slate-50 rounded-lg text-slate-400 hover:text-rose-500 transition-colors">
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>

            <h3 className="text-xl font-black text-slate-800 italic uppercase mb-2">{bundle.name}</h3>
            <p className="text-sm text-slate-500 mb-6 line-clamp-2">{bundle.description}</p>

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Included</span>
                <span className="text-[10px] font-bold text-chili bg-chili/10 px-2 py-1 rounded-full uppercase tracking-widest">
                  {bundle.productIds.length} Products
                </span>
              </div>
              
              <div className="flex -space-x-3 overflow-hidden py-2">
                {bundle.productIds.slice(0, 5).map(pid => {
                  const p = products.find(prod => prod.id === pid);
                  return (
                    <div key={pid} className="w-10 h-10 rounded-xl border-2 border-white bg-slate-100 flex items-center justify-center text-xl shadow-sm overflow-hidden bg-white">
                      {p?.image.startsWith('http') ? <img src={p.image} className="w-full h-full object-cover" /> : p?.image || '🍿'}
                    </div>
                  );
                })}
              </div>

              <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
                 <div>
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest line-through">Rs. {bundle.originalPrice}</p>
                    <p className="text-xl font-black text-chili italic">Rs. {bundle.price}</p>
                 </div>
                 <div className={cn(
                   "px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest",
                   bundle.active ? "bg-emerald-50 text-emerald-600" : "bg-slate-100 text-slate-400"
                 )}>
                   {bundle.active ? 'Active' : 'Paused'}
                 </div>
              </div>
            </div>
          </motion.div>
        ))}
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
              className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-[60]"
            />
            <motion.div 
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed right-0 top-0 h-full w-full max-w-xl bg-white shadow-2xl z-[70] flex flex-col"
            >
              <div className="p-6 border-b border-slate-100 flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-bold text-slate-800">
                    {editingBundle ? 'Edit Bundle' : 'Create New Bundle'}
                  </h2>
                  <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-1">Combine your best flavors</p>
                </div>
                <button 
                  onClick={() => setIsSlideOverOpen(false)}
                  className="p-2 hover:bg-slate-100 rounded-full transition-colors"
                >
                  <X className="w-5 h-5 text-slate-500" />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto p-6 space-y-8">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-500 uppercase tracking-widest">Bundle Name</label>
                    <input 
                      type="text" 
                      placeholder="e.g. Masala Party Pack"
                      value={formData.name}
                      onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                      className="w-full bg-slate-100 border-none focus:ring-1 focus:ring-chili/20 rounded-xl p-4 text-sm font-medium"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-500 uppercase tracking-widest">Description</label>
                    <textarea 
                      rows={3}
                      placeholder="Why is this bundle special?"
                      value={formData.description}
                      onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                      className="w-full bg-slate-100 border-none focus:ring-1 focus:ring-chili/20 rounded-xl p-4 text-sm font-medium resize-none"
                    />
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-bold text-slate-500 uppercase tracking-widest">Select Products</label>
                    <span className="text-[10px] font-bold text-chili uppercase tracking-widest">{formData.productIds?.length} Packed</span>
                  </div>
                  <div className="grid grid-cols-2 gap-3 max-h-[300px] overflow-y-auto pr-2 custom-scrollbar">
                    {products.filter(p => p.isBundle).map(product => {
                      const isSelected = formData.productIds?.includes(product.id);
                      return (
                        <div 
                          key={product.id}
                          onClick={() => handleToggleProduct(product.id)}
                          className={cn(
                            "p-3 rounded-2xl border-2 transition-all cursor-pointer flex items-center gap-3",
                            isSelected 
                              ? "bg-chili/5 border-chili ring-2 ring-chili/10" 
                              : "bg-slate-50 border-transparent hover:border-slate-200"
                          )}
                        >
                          <div className="w-10 h-10 rounded-xl bg-white border border-slate-100 flex items-center justify-center text-xl overflow-hidden shrink-0">
                            {product.image.startsWith('http') ? <img src={product.image} className="w-full h-full object-cover" /> : product.image}
                          </div>
                          <div className="overflow-hidden">
                            <p className="text-[11px] font-bold text-slate-700 truncate">{product.name}</p>
                            <p className="text-[9px] text-slate-400 font-bold uppercase tracking-widest">Rs. {product.price}</p>
                          </div>
                          {isSelected && <Check className="w-4 h-4 text-chili shrink-0 ml-auto" />}
                        </div>
                      );
                    })}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-500 uppercase tracking-widest">Actual Price (Rs.)</label>
                    <input 
                      type="number" 
                      placeholder="0.00"
                      value={formData.originalPrice}
                      onChange={(e) => setFormData(prev => ({ ...prev, originalPrice: parseFloat(e.target.value) || 0 }))}
                      className="w-full bg-slate-100 border-none focus:ring-1 focus:ring-chili/20 rounded-xl p-4 text-sm font-bold text-slate-500 line-through"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-500 uppercase tracking-widest">Bundle Offer Price (Rs.)</label>
                    <input 
                      type="number" 
                      placeholder="0.00"
                      value={formData.price}
                      onChange={(e) => setFormData(prev => ({ ...prev, price: parseFloat(e.target.value) || 0 }))}
                      className="w-full bg-slate-100 border-none focus:ring-1 focus:ring-chili/20 rounded-xl p-4 text-sm font-black italic text-chili"
                    />
                  </div>
                </div>

                <div className="space-y-4">
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-widest">Status</label>
                  <button 
                    onClick={() => setFormData(prev => ({ ...prev, active: !prev.active }))}
                    className={cn(
                      "w-full px-4 py-3.5 rounded-xl border-2 font-bold text-xs uppercase tracking-widest transition-all flex items-center justify-center gap-3 mt-1",
                      formData.active 
                        ? "bg-emerald-50 border-emerald-200 text-emerald-600" 
                        : "bg-slate-50 border-slate-200 text-slate-400"
                    )}
                  >
                    {formData.active ? <Check className="w-4 h-4" /> : <div className="w-4 h-4" />}
                    {formData.active ? 'Offer is LIVE' : 'Offer is PAUSED'}
                  </button>
                </div>
              </div>

              <div className="p-6 border-t border-slate-100 bg-slate-50 flex gap-4">
                <button 
                  onClick={() => setIsSlideOverOpen(false)}
                  className="flex-1 px-6 py-4 bg-white border border-slate-200 rounded-xl text-sm font-bold text-slate-500 hover:bg-slate-100 transition-all uppercase tracking-widest"
                >
                  Discard
                </button>
                <button 
                  onClick={handleSave}
                  disabled={!formData.name || !formData.productIds?.length}
                  className="flex-1 px-6 py-4 bg-chili text-white rounded-xl text-sm font-black italic uppercase tracking-widest hover:brightness-110 shadow-xl shadow-orange-100 transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Check className="w-5 h-5 shadow-inner" />
                  {editingBundle ? 'Update' : 'Launch'} Bundle
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
