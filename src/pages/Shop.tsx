import { useState, useEffect } from 'react';
import { m, AnimatePresence } from 'motion/react';
import { ShoppingBag, Search, Filter, Sparkles, ArrowRight, Home, ChevronRight } from 'lucide-react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { ProductCard } from '@/components/store/ProductCard';
import { BottomNav } from '@/components/store/BottomNav';
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
    <div className="bg-white min-h-screen pb-32 font-sans selection:bg-saffron/30">
      {/* Header */}
      <header className="px-6 py-4 flex items-center justify-between sticky top-0 bg-white/80 backdrop-blur-xl z-50 border-b border-orange-50">
        <div className={cn("flex items-center gap-12 transition-opacity", isMobileSearchOpen && "opacity-0 md:opacity-100 pointer-events-none md:pointer-events-auto")}>
          <Link to="/" className="flex items-center gap-2 group">
            <div className="w-10 h-10 bg-deep-charcoal rounded-2xl flex items-center justify-center text-white shadow-xl group-hover:rotate-12 transition-transform duration-500">
              <Sparkles className="w-5 h-5 text-saffron" />
            </div>
            <div>
              <h1 className="text-xl font-black text-deep-charcoal tracking-tight leading-none italic font-serif">SPARK ZING</h1>
              <span className="text-[8px] font-black uppercase tracking-[0.4em] text-cinnamon/60">Artisanal Snacking</span>
            </div>
          </Link>

          <nav className="hidden lg:flex items-center gap-8">
             <Link to="/shop" className="text-[10px] font-black text-chili uppercase tracking-[0.2em]">SHOP</Link>
             <Link to="/#our-story" className="text-[10px] font-black text-cinnamon uppercase tracking-[0.2em] hover:text-chili transition-colors">OUR STORY</Link>
          </nav>
        </div>

        <div className="flex items-center gap-4 flex-1 md:flex-none justify-end">
          <div className={cn(
            "relative flex items-center transition-all duration-300",
            isMobileSearchOpen ? "flex-1 md:flex-none" : "hidden md:flex"
          )}>
            <Search className="absolute left-3 w-4 h-4 text-cinnamon/40" />
            <input 
              type="text" 
              placeholder="Search snacks..." 
              value={searchQuery}
              autoFocus={isMobileSearchOpen}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Escape') setIsMobileSearchOpen(false);
                if (e.key === 'Enter') setIsMobileSearchOpen(false);
              }}
              className={cn(
                "pl-9 pr-4 py-2 bg-cream rounded-full text-xs font-bold border-none focus:ring-1 focus:ring-saffron outline-none transition-all",
                isMobileSearchOpen ? "w-full" : "w-48 focus:w-64"
              )}
            />
          </div>

          <button 
            onClick={() => setIsMobileSearchOpen(true)}
            className={cn("md:hidden p-2.5 text-cinnamon hover:text-chili transition-colors", isMobileSearchOpen && "hidden")} 
            title="Search"
          >
            <Search className="w-5 h-5" />
          </button>

          <div className="relative cursor-pointer group">
            <div className="p-2.5 bg-deep-charcoal rounded-xl text-white shadow-lg group-hover:bg-chili transition-colors">
              <ShoppingBag className="w-5 h-5" />
            </div>
            <AnimatePresence>
              {totalItems > 0 && (
                <m.div 
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  key={totalItems}
                  className="absolute -top-1 -right-1 w-5 h-5 bg-saffron text-black rounded-full flex items-center justify-center text-[10px] font-black border-2 border-white shadow-lg"
                >
                  {totalItems}
                </m.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-12">
        {/* Breadcrumbs */}
        <nav className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.3em] text-cinnamon/40 mb-8">
          <Link to="/" className="hover:text-chili transition-colors flex items-center gap-2">
            <Home className="w-3 h-3" /> HOME
          </Link>
          <ChevronRight className="w-3 h-3" />
          <span className="text-deep-charcoal">SHOP ALL FLAVOURS</span>
        </nav>

        <div className="flex flex-col lg:flex-row gap-12">
          {/* Sidebar Filters */}
          <aside className="lg:w-64 space-y-10">
            <div className="space-y-4">
              <h3 className="text-[10px] font-black uppercase tracking-[0.4em] text-deep-charcoal border-b border-orange-100 pb-2">Search</h3>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-cinnamon/40" />
                <input 
                  type="text" 
                  placeholder="Find your zing..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-cream rounded-xl py-3 pl-10 pr-4 text-xs font-bold border-none focus:ring-1 focus:ring-saffron outline-none"
                />
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="text-[10px] font-black uppercase tracking-[0.4em] text-deep-charcoal border-b border-orange-100 pb-2">Categories</h3>
              <div className="flex flex-wrap lg:flex-col gap-2">
                {categories.map(category => (
                  <button
                    key={category as string}
                    onClick={() => setSelectedCategory(category as string)}
                    className={cn(
                      "text-left px-4 py-3 rounded-xl text-xs font-black transition-all",
                      selectedCategory === category 
                        ? "bg-deep-charcoal text-white shadow-xl translate-x-2" 
                        : "bg-cream text-cinnamon/60 hover:bg-orange-50"
                    )}
                  >
                    {(category as string).toUpperCase()}
                  </button>
                ))}
              </div>
            </div>

            <div className="p-6 bg-saffron rounded-[2rem] space-y-4 shadow-xl">
               <Sparkles className="w-8 h-8 text-white" />
               <h4 className="text-xl font-black italic tracking-tight leading-none">Fresh Batch Alert!</h4>
               <p className="text-[10px] font-bold uppercase tracking-widest text-black/60 leading-relaxed">Our artisans just finished a special batch of Masala Makhana. Grab them before they're gone!</p>
            </div>
          </aside>

          {/* Product Grid */}
          <div className="flex-1 space-y-12">
            <div className="flex items-center justify-between">
               <h2 className="text-4xl font-black italic tracking-tighter text-deep-charcoal font-serif">
                 The <span className="text-chili">Full</span> Collection
               </h2>
               <div className="text-[10px] font-black uppercase tracking-widest text-cinnamon/40">
                 {filteredProducts.length} PRODUCTS
               </div>
            </div>

            {loading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-8">
                {[...Array(6)].map((_, i) => (
                  <div key={i} className="aspect-[4/5] bg-cream animate-pulse rounded-[3rem]" />
                ))}
              </div>
            ) : filteredProducts.length === 0 ? (
              <div className="space-y-16">
                <div className="py-24 text-center bg-cream rounded-[4rem] border-2 border-dashed border-orange-100">
                  <Search className="w-12 h-12 text-cinnamon/20 mx-auto mb-4" />
                  <p className="text-2xl font-black text-deep-charcoal italic px-6">We couldn't find that exact zing.</p>
                  <button 
                    onClick={() => { setSearchQuery(''); setSelectedCategory('All'); }}
                    className="mt-6 text-[10px] font-black uppercase tracking-widest text-chili hover:underline"
                  >
                    Clear all filters
                  </button>
                </div>

                <div className="space-y-8">
                   <div className="flex items-center gap-3">
                      <Sparkles className="w-5 h-5 text-saffron" />
                      <h3 className="text-2xl font-black italic tracking-tight text-deep-charcoal font-serif">Similar Flavours You'll Love</h3>
                   </div>
                   
                   <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-8">
                      {recommendedProducts.map((product) => (
                        <div key={product.id} onClick={() => navigate(`/product/${product.id}`)} className="cursor-pointer">
                          <ProductCard product={product} onAdd={handleAddToCart} />
                        </div>
                      ))}
                   </div>
                </div>
              </div>
            ) : (
              <m.div 
                layout
                className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-8"
              >
                <AnimatePresence mode='popLayout'>
                  {filteredProducts.map((product) => (
                    <m.div
                      key={product.id}
                      layout
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.9 }}
                      transition={{ duration: 0.3 }}
                      onClick={() => navigate(`/product/${product.id}`)}
                      className="cursor-pointer"
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

      <BottomNav />

      {/* Notification Toast */}
      <AnimatePresence>
        {showNotification && (
          <m.div 
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 50 }}
            className="fixed bottom-28 left-6 right-6 bg-chili text-white py-5 px-8 rounded-3xl shadow-2xl z-[60] flex items-center justify-between font-black italic tracking-tight"
          >
            <span>ZING ADDED TO CART! 🚀</span>
          </m.div>
        )}
      </AnimatePresence>
    </div>
  );
}
