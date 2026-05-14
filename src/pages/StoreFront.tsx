import { useState, useEffect, useRef } from 'react';
import { m, AnimatePresence, useScroll, useTransform } from 'motion/react';
import { ShoppingCart, LayoutDashboard, Sparkles, Flame, Star, ArrowRight, Heart, ShoppingBag, MapPin, Instagram, Facebook, Twitter, Search, User } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { ProductCard } from '@/components/store/ProductCard';
import { BottomNav } from '@/components/store/BottomNav';
import { MakersStory } from '@/components/store/MakersStory';
import { Product, BundleOffer } from '@/types';
import { cn } from '@/lib/utils';
import { db, handleFirestoreError, OperationType } from '@/lib/firebase';
import { collection, onSnapshot, query, where, limit } from 'firebase/firestore';
import { OptimizedImage } from '@/components/ui/OptimizedImage';
import { useCart } from '@/contexts/CartContext';

const testimonials = [
  { name: 'Sarah K.', role: 'Food Critic', quote: 'The crunch is legendary. You can taste the handmade love in every bite.', img: '👩‍🦰' },
  { name: 'Marcus L.', role: 'Fitness Enthusiast', quote: 'Finally, a snack that is clean and absolutely bursting with flavor.', img: '🧔' },
  { name: 'Priya R.', role: 'Home Chef', quote: 'Takes me back to my grandmother’s kitchen. Authentic and premium.', img: '👩' },
];

export function StoreFront() {
  const navigate = useNavigate();
  const [isMobileSearchOpen, setIsMobileSearchOpen] = useState(false);
  const [allProducts, setAllProducts] = useState<Product[]>([]);
  const [bundles, setBundles] = useState<BundleOffer[]>([]);
  const { totalItems, addToCart } = useCart();
  const [showNotification, setShowNotification] = useState(false);
  const { scrollY } = useScroll();
  const heroOpacity = useTransform(scrollY, [0, 500], [1, 0]);
  const heroScale = useTransform(scrollY, [0, 500], [1, 1.1]);

  const scrollRef = useRef<HTMLDivElement>(null);
  const bundleScrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (window.location.hash === '#our-story') {
      const el = document.getElementById('our-story');
      if (el) setTimeout(() => el.scrollIntoView({ behavior: 'smooth' }), 500);
    }
  }, []);

  useEffect(() => {
    // Products - Fetch more to ensure bundle items are found, regardless of status for the lookup
    const pq = query(
      collection(db, 'products'), 
      limit(200)
    );
    const unsubProducts = onSnapshot(pq, (snapshot) => {
      const productList = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Product[];
      setAllProducts(productList);
    }, (error) => {
      handleFirestoreError(error, OperationType.LIST, 'products');
    });

    // Bundles
    const bq = query(
      collection(db, 'bundles'), 
      where('active', '==', true),
      limit(5)
    );
    const unsubBundles = onSnapshot(bq, (snapshot) => {
      const bundleList = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as BundleOffer[];
      setBundles(bundleList);
    }, (error) => {
      handleFirestoreError(error, OperationType.LIST, 'bundles');
    });

    return () => {
      unsubProducts();
      unsubBundles();
    };
  }, []);

  const artisanFavorites = allProducts.filter(p => p.status === 'Active' && p.isArtisanFavorite).slice(0, 12);

  const getProductEmoji = (p: Product | undefined) => {
    if (!p) return '📦';
    // If the image is already a single emoji or short code
    if (p.image && !p.image.startsWith('http') && p.image.length <= 4) return p.image;
    
    const searchStr = (p.name + ' ' + p.category).toLowerCase();
    if (searchStr.includes('makhana') || searchStr.includes('corn')) return '🍿';
    if (searchStr.includes('spice') || searchStr.includes('chili') || searchStr.includes('hot')) return '🌶️';
    if (searchStr.includes('sweet') || searchStr.includes('sugar') || searchStr.includes('candy')) return '🍭';
    if (searchStr.includes('chip') || searchStr.includes('potato')) return '🥔';
    if (searchStr.includes('nut')) return '🥜';
    if (searchStr.includes('masala')) return '🍛';
    if (searchStr.includes('crisp')) return '🥨';
    return '🍪';
  };

  // Automatic horizontal scroll effect
  useEffect(() => {
    if (artisanFavorites.length === 0) return;

    const interval = setInterval(() => {
      if (scrollRef.current) {
        const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
        const maxScroll = scrollWidth - clientWidth;
        
        if (scrollLeft >= maxScroll - 1) {
          scrollRef.current.scrollTo({ left: 0, behavior: 'smooth' });
        } else {
          scrollRef.current.scrollBy({ left: 240, behavior: 'smooth' });
        }
      }
    }, 3500);

    return () => clearInterval(interval);
  }, [artisanFavorites]);

  const handleBuyBundle = (bundle: BundleOffer) => {
    // Buy Now logic: Add all products to cart and navigate to checkout
    bundle.productIds.forEach(pid => {
      const p = allProducts.find(prod => prod.id === pid);
      if (p) addToCart(p);
    });
    navigate('/checkout');
  };

  const handleAddToCart = (product: Product) => {
    addToCart(product);
    setShowNotification(true);
    setTimeout(() => setShowNotification(false), 2000);
  };

  return (
    <div className="bg-white min-h-screen pb-10 overflow-x-hidden font-sans selection:bg-saffron/30">
      {/* Cinematic Header */}
      <header className="px-6 py-4 flex items-center justify-between sticky top-0 bg-white/80 backdrop-blur-xl z-50 border-b border-orange-50">
        <div className={cn("flex items-center gap-12 transition-opacity", isMobileSearchOpen && "opacity-0 md:opacity-100 pointer-events-none md:pointer-events-auto")}>
          <Link to="/" className="flex items-center gap-2 group">
            <div className="w-10 h-10 bg-deep-charcoal rounded-2xl flex items-center justify-center text-white shadow-xl group-hover:rotate-12 transition-transform duration-500">
              <Sparkles className="w-5 h-5 text-saffron" />
            </div>
            <div>
              <h1 className="text-xl font-black text-deep-charcoal tracking-tight leading-none italic font-serif group-hover:text-chili transition-colors">SPARK ZING</h1>
              <span className="text-[8px] font-black uppercase tracking-[0.4em] text-cinnamon/60">Artisanal Snacking</span>
            </div>
          </Link>

          <nav className="hidden lg:flex items-center gap-8">
             <Link to="/shop" className="text-[10px] font-black text-cinnamon uppercase tracking-[0.2em] hover:text-chili transition-colors">SHOP</Link>
             <button 
               onClick={() => {
                 const el = document.getElementById('our-story');
                 if (el) el.scrollIntoView({ behavior: 'smooth' });
               }} 
               className="text-[10px] font-black text-cinnamon uppercase tracking-[0.2em] hover:text-chili transition-colors"
             >
               OUR STORY
             </button>
          </nav>
        </div>

        <div className="flex items-center gap-2 flex-1 md:flex-none justify-end">
          <div className={cn(
            "relative flex items-center transition-all duration-300",
            isMobileSearchOpen ? "flex-1 md:flex-none" : "hidden md:flex"
          )}>
            <Search className="absolute left-3 w-4 h-4 text-cinnamon/40" />
            <input 
              type="text" 
              placeholder="Search snacks..." 
              autoFocus={isMobileSearchOpen}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  navigate(`/shop?q=${encodeURIComponent(e.currentTarget.value)}`);
                  setIsMobileSearchOpen(false);
                }
                if (e.key === 'Escape') {
                  setIsMobileSearchOpen(false);
                }
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
          
          <Link to="/admin" className={cn("p-2.5 text-cinnamon hover:text-chili transition-colors transition-opacity", isMobileSearchOpen && "opacity-0 md:opacity-100")} title="Account / Admin">
            <User className="w-5 h-5" />
          </Link>

          <div className="relative cursor-pointer group ml-2">
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

      {/* Premium Luxury Hero Section */}
      <section className="relative h-[95vh] md:h-screen w-full flex items-center overflow-hidden bg-[#0A0A0A]">
        {/* Cinematic Background Layer */}
        <m.div 
          style={{ opacity: heroOpacity, scale: heroScale }} 
          className="absolute inset-0 z-0"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-black via-black/40 to-transparent z-10" />
          <div className="absolute inset-0 bg-black/20 z-10" />
          <OptimizedImage 
            src="https://images.unsplash.com/photo-1596791016021-f06071987d60?q=80&w=2070&auto=format&fit=crop" 
            className="w-full h-full object-cover opacity-60"
            alt="Artisanal Indian Luxury Vibe"
          />
        </m.div>

        {/* Floating Spice Particles (Visual Flourish) */}
        <div className="absolute inset-0 pointer-events-none z-20 overflow-hidden">
          {[...Array(12)].map((_, i) => (
            <m.div
              key={i}
              initial={{ 
                x: Math.random() * 100 + "%", 
                y: Math.random() * 100 + "%",
                opacity: 0,
                rotate: 0,
                scale: 0.5
              }}
              animate={{ 
                y: ["-10%", "110%"],
                opacity: [0, 0.4, 0],
                rotate: 360,
                scale: [0.5, 1, 0.5]
              }}
              transition={{ 
                duration: 10 + Math.random() * 20, 
                repeat: Infinity,
                ease: "linear",
                delay: Math.random() * 10
              }}
              className="absolute text-2xl filter blur-[1px]"
            >
              {['🌶️', '🍃', '✨', '🍂', '🍿'][i % 5]}
            </m.div>
          ))}
        </div>
        
        <div className="relative z-30 w-full max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-2 items-center h-full">
           {/* Left Sidebar: Content & CTAs */}
           <div className="space-y-10 md:pt-20">
              <m.div
                initial={{ opacity: 0, x: -50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8, ease: "easeOut" }}
                className="space-y-6"
              >
                <div className="flex items-center gap-4">
                  <div className="h-[2px] w-12 bg-saffron" />
                  <span className="text-[10px] font-black uppercase tracking-[0.5em] text-saffron">Premium Indian Artisanal</span>
                </div>
                
                <h2 className="text-6xl md:text-[7rem] font-black text-white italic leading-[0.9] tracking-tighter font-serif">
                  Spark<br/>
                  <span className="text-saffron italic">Zing.</span>
                </h2>
                
                <p className="text-lg md:text-xl text-white/70 max-w-md font-medium leading-relaxed italic">
                  Handcrafted makhana roasted in pure brass utensils, infused with a proprietary blend of 18 sacred Indian spices.
                </p>
              </m.div>

              <m.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4, duration: 0.8 }}
                className="flex flex-col sm:flex-row items-center gap-6"
              >
                 <button onClick={() => navigate('/shop')} className="w-full sm:w-auto px-12 py-6 bg-saffron text-black rounded-2xl font-black italic tracking-tight shadow-[0_20px_40px_rgba(234,179,8,0.3)] hover:brightness-110 hover:scale-[1.02] transition-all flex items-center justify-center gap-4 group">
                    EXPLORE COLLECTION <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                 </button>
                 <button 
                  onClick={() => {
                    const el = document.getElementById('our-story');
                    if (el) el.scrollIntoView({ behavior: 'smooth' });
                  }} 
                  className="w-full sm:w-auto px-12 py-6 bg-white/10 backdrop-blur-md text-white border border-white/20 rounded-2xl font-black italic tracking-tight hover:bg-white/20 transition-all"
                >
                    OUR CRAFT
                 </button>
              </m.div>

              {/* Minor Stats */}
              <m.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.8 }}
                className="grid grid-cols-3 gap-8 pt-10 border-t border-white/10"
              >
                 <div>
                    <span className="block text-2xl font-serif italic text-white">100%</span>
                    <span className="text-[9px] font-black uppercase tracking-widest text-white/40">Clean Label</span>
                 </div>
                 <div>
                    <span className="block text-2xl font-serif italic text-white flex items-center gap-1">18 <span className="text-xs">spices</span></span>
                    <span className="text-[9px] font-black uppercase tracking-widest text-white/40">Sacred Blend</span>
                 </div>
                 <div>
                    <span className="block text-2xl font-serif italic text-white">4th Gen</span>
                    <span className="text-[9px] font-black uppercase tracking-widest text-white/40">Artisan Craft</span>
                 </div>
              </m.div>
           </div>

           {/* Right Side: Visual Focus (Packaging) */}
           <m.div
             initial={{ opacity: 0, scale: 0.8, x: 100 }}
             animate={{ opacity: 1, scale: 1, x: 0 }}
             transition={{ duration: 1.2, ease: "easeOut" }}
             className="relative hidden md:flex justify-end p-12"
           >
              {/* Product Visual Container */}
              <div className="relative group">
                {/* Glow effect */}
                <div className="absolute inset-0 bg-saffron/20 blur-[120px] rounded-full scale-150 animate-pulse" />
                
                <div className="relative z-10 w-[450px] aspect-square flex items-center justify-center">
                   {/* Here we would place the high-end packaging visual */}
                   {/* For now, a sophisticated 3D-like representation or a placeholder */}
                   <div className="relative">
                      <m.div
                        animate={{ 
                          y: [0, -20, 0],
                          rotate: [1, -1, 1]
                        }}
                        transition={{ 
                          duration: 6, 
                          repeat: Infinity, 
                          ease: "easeInOut" 
                        }}
                        className="relative z-20 w-80 h-96 bg-gradient-to-tr from-[#2A2A2A] to-[#1A1A1A] rounded-[3rem] shadow-2xl border border-white/10 flex flex-col items-center justify-center p-12 text-center"
                      >
                         <Sparkles className="w-16 h-16 text-saffron mb-6" />
                         <h3 className="text-3xl font-black italic text-white font-serif tracking-tighter leading-none mb-4">SPARK ZING</h3>
                         <div className="w-20 h-1 bg-saffron rounded-full mb-6" />
                         <p className="text-xs font-black uppercase tracking-[0.3em] text-saffron">Artisanal Makhana</p>
                         
                         {/* Subtle Motion Spice Explosion (Represented visually) */}
                         <div className="absolute inset-0 pointer-events-none">
                            <m.div 
                              animate={{ scale: [1, 1.2, 1], rotate: [0, 5, 0] }}
                              transition={{ duration: 4, repeat: Infinity }}
                              className="absolute -top-10 -right-10 text-4xl"
                            >
                               🌶️
                            </m.div>
                            <m.div 
                              animate={{ scale: [1, 1.3, 1], rotate: [0, -5, 0] }}
                              transition={{ duration: 5, repeat: Infinity, delay: 1 }}
                              className="absolute -bottom-10 -left-10 text-4xl"
                            >
                               🍿
                            </m.div>
                         </div>
                      </m.div>
                      
                      {/* Shadow */}
                      <div className="absolute -bottom-12 left-10 right-10 h-8 bg-black/60 blur-3xl rounded-full" />
                   </div>
                </div>
              </div>
           </m.div>
        </div>
      </section>

      {/* Trust Badges */}
      <div className="bg-cream border-y border-orange-50 py-12">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-2 md:grid-cols-4 gap-8">
           {[
             { label: 'Farm to Bag', desc: 'Directly Sourced' },
             { label: 'No Preservatives', desc: '100% Core Clean' },
             { label: 'Fast Delivery', desc: '2-Day Ship' },
             { label: 'Artisan Made', desc: 'Small Batches' },
           ].map((badge, i) => (
             <div key={i} className="text-center space-y-1">
                <span className="block text-sm font-black text-deep-charcoal italic">{badge.label}</span>
                <span className="block text-[8px] font-bold text-cinnamon uppercase tracking-widest opacity-60">{badge.desc}</span>
             </div>
           ))}
        </div>
      </div>

      {/* Bestsellers - Visual Rich Carousel */}
      <section className="py-24 max-w-7xl mx-auto px-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-16 gap-6">
           <div className="space-y-2">
              <div className="flex items-center gap-2">
                 <div className="w-1.5 h-6 bg-chili rounded-full" />
                 <span className="text-[10px] font-black uppercase tracking-[0.4em] text-cinnamon">Curated Collection</span>
              </div>
              <h2 className="text-5xl md:text-7xl font-black text-deep-charcoal italic leading-none tracking-tight">Artisan Favorites</h2>
           </div>
        </div>

        <div className="relative">
          <div 
            ref={scrollRef}
            className="flex gap-5 overflow-x-auto pb-12 pt-4 px-4 -mx-4 no-scrollbar snap-x snap-mandatory scroll-smooth"
          >
            {artisanFavorites.map((product, i) => (
              <m.div 
                key={product.id} 
                initial={{ opacity: 0, x: 50 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                onClick={() => navigate(`/product/${product.id}`)} 
                className="cursor-pointer flex-shrink-0 w-[220px] md:w-[260px] snap-center"
              >
                 <ProductCard product={product} onAdd={handleAddToCart} />
              </m.div>
            ))}
            {artisanFavorites.length === 0 && (
              <div className="w-full flex flex-col items-center justify-center p-20 bg-cream rounded-[4rem] border-2 border-dashed border-orange-100">
                 <Sparkles className="w-12 h-12 text-saffron mb-4 animate-pulse" />
                 <p className="text-2xl font-black text-deep-charcoal italic">Sourcing Fresh Batch...</p>
                 <p className="text-sm text-cinnamon/60 font-bold uppercase tracking-widest mt-2 text-center">New artisanal snacks are being prepared.</p>
              </div>
            )}
          </div>
          
          {/* Gradient indicators for scroll */}
          <div className="absolute left-0 top-0 bottom-0 w-20 bg-gradient-to-r from-white to-transparent pointer-events-none z-10" />
          <div className="absolute right-0 top-0 bottom-0 w-20 bg-gradient-to-l from-white to-transparent pointer-events-none z-10" />
        </div>
      </section>

      {/* Bundle Offers Section */}
      {bundles.length > 0 && (
        <section className="py-24 bg-cream/50 relative overflow-hidden">
          <div className="max-w-7xl mx-auto px-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between mb-16 gap-6">
              <div className="space-y-2 text-center md:text-left">
                <div className="flex items-center gap-2 justify-center md:justify-start">
                  <div className="w-1.5 h-6 bg-spark-orange rounded-full" />
                  <span className="text-[10px] font-black uppercase tracking-[0.4em] text-cinnamon">Value Packs</span>
                </div>
                <h2 className="text-5xl md:text-7xl font-black text-deep-charcoal italic leading-none tracking-tight">Bundle Offers</h2>
              </div>
            </div>

            <div 
              ref={bundleScrollRef}
              className="flex gap-8 overflow-x-auto pb-8 pt-4 px-4 -mx-4 no-scrollbar snap-x snap-mandatory"
            >
              {bundles.map((bundle, i) => (
                <m.div
                  key={bundle.id}
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  className="flex-shrink-0 w-[320px] md:w-[450px] snap-center bg-white border border-slate-100 rounded-[3rem] p-8 shadow-2xl shadow-gray-200/50 flex flex-col relative overflow-hidden group"
                >
                  <div className="absolute -top-4 -right-4 w-24 h-24 bg-chili text-white flex flex-col items-center justify-center rotate-12 font-black italic">
                     <span className="text-[8px] uppercase tracking-widest opacity-80">Value</span>
                     <span className="text-xl">SAVE!</span>
                  </div>

                  <div className="flex gap-4 mb-8 overflow-x-auto no-scrollbar pb-2">
                     {bundle.productIds.slice(0, 4).map(pid => {
                       const p = allProducts.find(prod => prod.id === pid);
                       const displayEmoji = getProductEmoji(p);

                       return (
                         <div key={pid} className="flex flex-col items-center gap-2 shrink-0">
                           <div className="w-16 h-16 bg-cream rounded-2xl flex items-center justify-center text-3xl border border-orange-50 group-hover:scale-110 transition-transform shadow-inner">
                              {displayEmoji}
                           </div>
                           <span className="text-[9px] font-bold text-cinnamon/60 uppercase tracking-tighter text-center max-w-[64px] truncate">
                             {p?.name || 'Product'}
                           </span>
                         </div>
                       );
                     })}
                  </div>

                  <h3 className="text-2xl font-black text-deep-charcoal italic uppercase mb-2">{bundle.name}</h3>
                  <p className="text-sm font-medium text-cinnamon/60 mb-8 line-clamp-2">{bundle.description}</p>
                  
                  <div className="mt-auto pt-6 border-t border-slate-50 flex items-center justify-between">
                     <div>
                        <p className="text-[9px] font-bold text-cinnamon/40 uppercase tracking-widest mb-1">Actual Price</p>
                        <p className="text-sm font-bold text-cinnamon/30 line-through tracking-wider">Rs. {bundle.originalPrice}</p>
                        <p className="text-[9px] font-bold text-chili uppercase tracking-widest mt-2">Bundle Price</p>
                        <p className="text-3xl font-black text-chili italic">Rs. {bundle.price}</p>
                     </div>
                     <button 
                       onClick={() => handleBuyBundle(bundle)}
                       className="px-8 py-4 bg-deep-charcoal hover:bg-chili text-white rounded-2xl font-black italic text-xs uppercase tracking-widest transition-all shadow-xl shadow-gray-100 active:scale-95"
                     >
                        Buy Now
                     </button>
                  </div>
                </m.div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Maker’s Story Section */}
      <MakersStory />

      {/* Testimonials - Testimonial Carousel */}
      <section className="py-24 bg-deep-charcoal text-white relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-white/5 rounded-full blur-[100px]" />
        <div className="max-w-7xl mx-auto px-6 relative z-10">
           <div className="text-center mb-16 space-y-4">
              <span className="text-xs font-black uppercase tracking-[0.4em] text-saffron">What They Say</span>
              <h2 className="text-4xl md:text-5xl font-black italic tracking-tight">The Zing Experience</h2>
           </div>

           <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {testimonials.map((t, i) => (
                <m.div 
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  className="bg-white/5 border border-white/10 p-10 rounded-[3rem] space-y-6 hover:bg-white/10 transition-colors"
                >
                   <div className="text-4xl">{t.img}</div>
                   <div className="flex text-saffron">
                      {[...Array(5)].map((_, i) => <Star key={i} className="w-3 h-3 fill-saffron" />)}
                   </div>
                   <p className="text-lg font-medium text-white/80 leading-relaxed italic">"{t.quote}"</p>
                   <div>
                      <p className="font-black italic text-saffron uppercase tracking-widest">{t.name}</p>
                      <p className="text-[10px] uppercase font-bold tracking-widest opacity-40">{t.role}</p>
                   </div>
                </m.div>
              ))}
           </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-cream pt-24 pb-32 border-t border-orange-50">
        <div className="max-w-7xl mx-auto px-6">
           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-20">
              <div className="space-y-6">
                 <h2 className="text-2xl font-black text-deep-charcoal italic tracking-tight">SPARK ZING</h2>
                 <p className="text-sm font-medium text-cinnamon/60 leading-relaxed">
                   Redefining the artisan snack experience with fresh ingredients and bold spice profiles.
                 </p>
                 <div className="flex gap-4">
                    <button className="p-3 bg-white rounded-xl shadow-sm hover:scale-110 transition-transform"><Instagram className="w-4 h-4 text-chili" /></button>
                    <button className="p-3 bg-white rounded-xl shadow-sm hover:scale-110 transition-transform"><Facebook className="w-4 h-4 text-chili" /></button>
                    <button className="p-3 bg-white rounded-xl shadow-sm hover:scale-110 transition-transform"><Twitter className="w-4 h-4 text-chili" /></button>
                 </div>
              </div>

              <div>
                 <h4 className="text-xs font-black uppercase tracking-widest text-deep-charcoal mb-6">Explore</h4>
                 <ul className="space-y-3 text-sm font-bold text-cinnamon/60">
                    <Link to="/admin" className="hover:text-chili cursor-pointer transition-colors block">Admin Panel</Link>
                    <li className="hover:text-chili cursor-pointer transition-colors">Our Snacks</li>
                    <li className="hover:text-chili cursor-pointer transition-colors">Artisan Collections</li>
                    <li className="hover:text-chili cursor-pointer transition-colors">Combo Offers</li>
                 </ul>
              </div>

              <div>
                 <h4 className="text-xs font-black uppercase tracking-widest text-deep-charcoal mb-6">Support</h4>
                 <ul className="space-y-3 text-sm font-bold text-cinnamon/60">
                    <li className="hover:text-chili cursor-pointer transition-colors">Track Order</li>
                    <li className="hover:text-chili cursor-pointer transition-colors">Shipping Policy</li>
                    <li className="hover:text-chili cursor-pointer transition-colors">Refund Policy</li>
                    <li className="hover:text-chili cursor-pointer transition-colors">Contact Us</li>
                 </ul>
              </div>

              <div className="space-y-6">
                 <h4 className="text-xs font-black uppercase tracking-widest text-deep-charcoal mb-6">Newsletter</h4>
                 <p className="text-xs font-bold text-cinnamon/60 leading-relaxed uppercase tracking-widest">Join the Zing Society for fresh drops & spicy updates.</p>
                 <div className="relative">
                    <input type="text" placeholder="Your email..." className="w-full bg-white border border-orange-100 rounded-2xl py-4 px-6 text-xs font-bold focus:ring-1 focus:ring-saffron outline-none" />
                    <button className="absolute right-2 top-1/2 -translate-y-1/2 p-2.5 bg-deep-charcoal text-white rounded-xl">
                       <ArrowRight className="w-4 h-4" />
                    </button>
                 </div>
              </div>
           </div>

           <div className="flex flex-col md:flex-row items-center justify-between pt-8 border-t border-orange-100 gap-6">
              <span className="text-[10px] font-bold text-cinnamon/40 uppercase tracking-[0.4em]">© 2024 Spark Zing Artisanal Snacks</span>
           </div>
        </div>
      </footer>

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
