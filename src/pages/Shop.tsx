import { useState, useEffect } from 'react';
import { m, AnimatePresence } from 'motion/react';
import { ShoppingBag, Search, Filter, Sparkles, ArrowRight, Home, ChevronRight, X } from 'lucide-react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { ProductCard } from '@/components/store/ProductCard';
import { BottomNav } from '@/components/store/BottomNav';
import { StoreHeader } from '@/components/layout/StoreHeader';
import { Product } from '@/types';
import { cn } from '@/lib/utils';
import { db, handleFirestoreError, OperationType } from '@/lib/firebase';
import { collection, onSnapshot, query, where, orderBy } from 'firebase/firestore';
import { useCart } from '@/contexts/CartContext';

export function Shop() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const initialQuery = searchParams.get('q') || '';
  
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [isMobileSearchOpen, setIsMobileSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState(initialQuery);
  const [selectedCategory, setSelectedCategory] = useState<string>('All');

  useEffect(() => {
    const q = searchParams.get('q');
    if (q !== null) {
      setSearchQuery(q);
    }
  }, [searchParams]);
  const { totalItems, addToCart } = useCart();
  const [showNotification, setShowNotification] = useState(false);

  useEffect(() => {
    const q = query(
      collection(db, 'products'), 
      where('status', '==', 'Active'),
      orderBy('name', 'asc')
    );
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const productList = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Product[];
      setProducts(productList);
      setLoading(false);
    }, (error) => {
      handleFirestoreError(error, OperationType.LIST, 'products');
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const handleAddToCart = (product: Product) => {
    addToCart(product);
    setShowNotification(true);
    setTimeout(() => setShowNotification(false), 2000);
  };

  const categories = ['All', ...Array.from(new Set(products.map(p => p.category)))];

  const filteredProducts = products.filter(p => {
    const matchesSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         (p.description || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
                         p.tags?.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesCategory = selectedCategory === 'All' || p.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const recommendedProducts = products
    .filter(p => p.status === 'Active')
    .sort((a, b) => {
      // Prioritize same category if selected
      if (selectedCategory !== 'All') {
        if (a.category === selectedCategory && b.category !== selectedCategory) return -1;
        if (a.category !== selectedCategory && b.category === selectedCategory) return 1;
      }
      // Then prioritize artisan favorites
      if (a.isArtisanFavorite && !b.isArtisanFavorite) return -1;
      if (!a.isArtisanFavorite && b.isArtisanFavorite) return 1;
      return 0;
    })
    .slice(0, 3);

  return (
    <div className="bg-white min-h-screen pb-32 selection:bg-saffron/30">
      <StoreHeader />

      <main className="max-w-7xl mx-auto px-4 md:px-6 py-8 md:py-12">
        {/* Breadcrumbs - Responsive Hide */}
        <nav className="hidden md:flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.3em] text-cinnamon/40 mb-12">
          <Link to="/" className="hover:text-chili transition-colors flex items-center gap-2">
            <Home className="w-3 h-3" /> HOME
          </Link>
          <ChevronRight className="w-3 h-3" />
          <span className="text-deep-charcoal">SHOP ALL FLAVOURS</span>
        </nav>

        {/* Mobile Header Summary */}
        <div className="md:hidden flex flex-col gap-4 mb-8">
           <h2 className="text-4xl font-black italic tracking-tighter">The Full <span className="text-chili">Jar.</span></h2>
           <div className="flex items-center justify-between">
              <span className="text-[10px] font-black uppercase tracking-widest text-cinnamon/40">{filteredProducts.length} ZINGS FOUND</span>
              <button 
                onClick={() => setIsMobileSearchOpen(true)}
                className="flex items-center gap-2 px-4 py-2 bg-cream rounded-full text-[10px] font-black uppercase tracking-widest"
              >
                <Filter className="w-3 h-3" /> Filter
              </button>
           </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-12">
          {/* Sidebar Filters - Desktop */}
          <aside className="hidden lg:block lg:w-72 space-y-12 h-fit sticky top-28">
            <div className="space-y-6">
              <h3 className="text-[11px] font-black uppercase tracking-[0.4em] text-deep-charcoal border-b border-orange-100 pb-3 flex items-center justify-between">
                Explore Flavors <Sparkles className="w-3 h-3 text-saffron" />
              </h3>
              <div className="relative group">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-cinnamon/40 group-focus-within:text-chili transition-colors" />
                <input 
                  type="text" 
                  placeholder="What's your zing?"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-cream border-2 border-transparent focus:border-orange-100 rounded-2xl py-4 pl-12 pr-6 text-xs font-bold outline-none transition-all"
                />
              </div>
            </div>

            <div className="space-y-6">
              <h3 className="text-[11px] font-black uppercase tracking-[0.4em] text-deep-charcoal border-b border-orange-100 pb-3">Categories</h3>
              <div className="flex flex-col gap-2.5">
                {categories.map(category => (
                  <button
                    key={category as string}
                    onClick={() => setSelectedCategory(category as string)}
                    className={cn(
                      "text-left px-5 py-4 rounded-2xl text-xs font-black transition-all group flex items-center justify-between",
                      selectedCategory === category 
                        ? "bg-deep-charcoal text-white shadow-xl translate-x-2" 
                        : "bg-white border border-orange-50 text-cinnamon/60 hover:bg-cream"
                    )}
                  >
                    {(category as string).toUpperCase()}
                    {selectedCategory === category && <ArrowRight className="w-3 h-3 text-saffron" />}
                  </button>
                ))}
              </div>
            </div>

            <m.div 
              whileHover={{ scale: 1.02 }}
              className="p-8 bg-gradient-to-br from-saffron to-turmeric rounded-[2.5rem] space-y-6 shadow-2xl relative overflow-hidden group cursor-pointer"
            >
               <div className="absolute top-0 right-0 w-32 h-32 bg-white/20 rounded-full -mr-16 -mt-16 blur-3xl group-hover:scale-150 transition-transform duration-700" />
               <div className="w-12 h-12 bg-white/20 backdrop-blur-md rounded-2xl flex items-center justify-center">
                 <Sparkles className="w-6 h-6 text-white" />
               </div>
               <div className="space-y-2">
                 <h4 className="text-2xl font-black italic tracking-tighter text-black leading-none">The Artisan<br/>Circle</h4>
                 <p className="text-[10px] font-bold uppercase tracking-widest text-black/60 leading-relaxed italic">Join for priority access to our smallest limited drops.</p>
               </div>
               <button className="w-full py-3 bg-black text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:scale-105 active:scale-95 transition-all">Sign Up Free</button>
            </m.div>
          </aside>

          {/* Product Grid */}
          <div className="flex-1 space-y-8 md:space-y-12">
            <div className="hidden md:flex items-center justify-between">
               <h2 className="text-5xl md:text-6xl font-black italic tracking-tighter text-deep-charcoal">
                 The <span className="text-chili">Spark</span> Zing Collection
               </h2>
               <div className="text-[10px] font-black uppercase tracking-widest text-cinnamon/40 bg-cream px-4 py-2 rounded-full">
                 {filteredProducts.length} HANDCRAFTED SNACKS
               </div>
            </div>

            {loading ? (
              <div className="grid grid-cols-2 md:grid-cols-2 xl:grid-cols-3 gap-4 md:gap-8">
                {[...Array(6)].map((_, i) => (
                  <div key={i} className="aspect-[3/4] bg-cream animate-pulse rounded-[2rem] md:rounded-[3rem]" />
                ))}
              </div>
            ) : filteredProducts.length === 0 ? (
              <div className="space-y-16">
                <div className="py-24 md:py-32 text-center bg-cream rounded-[3rem] md:rounded-[4rem] border-2 border-dashed border-orange-100 px-6">
                  <m.div
                    animate={{ rotate: [0, 10, -10, 0] }}
                    transition={{ repeat: Infinity, duration: 4 }}
                  >
                    <Search className="w-16 h-16 text-cinnamon/20 mx-auto mb-6" />
                  </m.div>
                  <p className="text-2xl md:text-3xl font-black text-deep-charcoal italic leading-tight">Mmm, we couldn't find<br/>that specific zing.</p>
                  <button 
                    onClick={() => { setSearchQuery(''); setSelectedCategory('All'); }}
                    className="mt-8 px-10 py-5 bg-deep-charcoal text-white rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-chili active:scale-95 transition-all"
                  >
                    Clear all filters
                  </button>
                </div>

                <div className="space-y-12">
                   <div className="flex items-center gap-3">
                      <div className="w-1.5 h-6 bg-saffron rounded-full" />
                      <h3 className="text-3xl font-black italic tracking-tight text-deep-charcoal">Featured Favorites</h3>
                   </div>
                   
                   <div className="grid grid-cols-2 md:grid-cols-2 xl:grid-cols-3 gap-4 md:gap-8">
                      {recommendedProducts.map((product) => (
                        <ProductCard key={product.id} product={product} onAdd={handleAddToCart} />
                      ))}
                   </div>
                </div>
              </div>
            ) : (
              <m.div 
                layout
                className="grid grid-cols-2 md:grid-cols-2 xl:grid-cols-3 gap-4 md:gap-8"
              >
                <AnimatePresence mode='popLayout'>
                  {filteredProducts.map((product) => (
                    <m.div
                      key={product.id}
                      layout
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.9 }}
                      transition={{ duration: 0.4 }}
                      className="h-full"
                    >
                      <ProductCard product={product} onAdd={handleAddToCart} />
                    </m.div>
                  ))}
                </AnimatePresence>
              </m.div>
            )}
          </div>
        </div>
      </main>

      {/* Mobile Filter Drawer */}
      <AnimatePresence>
        {isMobileSearchOpen && (
          <>
            <m.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsMobileSearchOpen(false)}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100]"
            />
            <m.div 
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed inset-x-0 bottom-0 bg-white z-[110] rounded-t-[3rem] p-8 max-h-[85vh] overflow-y-auto"
            >
               <div className="flex items-center justify-between mb-8">
                  <h3 className="text-2xl font-black italic tracking-tighter">Filter Flavors</h3>
                  <button onClick={() => setIsMobileSearchOpen(false)} className="p-3 hover:bg-cream rounded-full">
                    <X className="w-6 h-6" />
                  </button>
               </div>

               <div className="space-y-10">
                  <div className="space-y-4">
                    <p className="text-[10px] font-black uppercase tracking-widest text-cinnamon/40">Search Flavors</p>
                    <div className="relative">
                      <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-cinnamon/40" />
                      <input 
                        type="text" 
                        placeholder="Sweet, spicy, tangy..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full bg-cream border-2 border-transparent focus:border-orange-100 rounded-2xl py-4 pl-12 pr-6 text-xs font-bold outline-none"
                      />
                    </div>
                  </div>

                  <div className="space-y-4 pb-12">
                     <p className="text-[10px] font-black uppercase tracking-widest text-cinnamon/40">Collections</p>
                     <div className="grid grid-cols-2 gap-3">
                        {categories.map(category => (
                          <button
                            key={category as string}
                            onClick={() => { setSelectedCategory(category as string); setIsMobileSearchOpen(false); }}
                            className={cn(
                              "px-4 py-4 rounded-2xl text-[10px] font-black transition-all text-center uppercase tracking-widest border-2",
                              selectedCategory === category 
                                ? "bg-deep-charcoal text-white border-deep-charcoal shadow-xl" 
                                : "bg-white border-orange-50 text-cinnamon/60"
                            )}
                          >
                            {category as string}
                          </button>
                        ))}
                     </div>
                  </div>

                  <button 
                    onClick={() => setIsMobileSearchOpen(false)}
                    className="w-full py-5 bg-chili text-white rounded-2xl font-black italic tracking-tight shadow-xl"
                  >
                    SEE {filteredProducts.length} RESULTS
                  </button>
               </div>
            </m.div>
          </>
        )}
      </AnimatePresence>


      {/* Notification Toast */}
      <AnimatePresence>
        {showNotification && (
          <m.div 
            initial={{ opacity: 0, y: 50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 50, scale: 0.9 }}
            className="fixed bottom-28 left-4 right-4 md:left-auto md:right-8 md:w-96 bg-chili text-white py-5 px-8 rounded-3xl shadow-2xl z-[150] flex items-center justify-between font-black italic tracking-tight border border-white/20"
          >
            <div className="flex items-center gap-3">
              <Sparkles className="w-5 h-5 text-saffron fill-saffron" />
              <span className="uppercase text-sm">Zing added to Jar! 🚀</span>
            </div>
          </m.div>
        )}
      </AnimatePresence>
    </div>
  );
}
