import { useState, useEffect, useRef } from 'react';
import { m, AnimatePresence, useScroll, useTransform } from 'motion/react';
import { ShoppingCart, LayoutDashboard, Sparkles, Flame, Star, ArrowRight, Heart, ShoppingBag, MapPin, Instagram, Facebook, Twitter, Search, User, Box, Sparkle } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { ProductCard } from '@/components/store/ProductCard';
import { BottomNav } from '@/components/store/BottomNav';
import { MakersStory } from '@/components/store/MakersStory';
import { StoreHeader } from '@/components/layout/StoreHeader';
import { Product, BundleOffer } from '@/types';
import { cn } from '@/lib/utils';
import { db, handleFirestoreError, OperationType } from '@/lib/firebase';
import { collection, onSnapshot, query, where, limit } from 'firebase/firestore';
import { OptimizedImage } from '@/components/ui/OptimizedImage';
import { useCart } from '@/contexts/CartContext';
import sparkZingPouch from '@/assets/images/regenerated_image_1778771245104.png';

const testimonials = [
  { name: 'Sarah K.', role: 'Food Critic', quote: 'The crunch is legendary. You can taste the handmade love in every bite.', img: '👩‍🦰' },
  { name: 'Marcus L.', role: 'Fitness Enthusiast', quote: 'Finally, a snack that is clean and absolutely bursting with flavor.', img: '🧔' },
  { name: 'Priya R.', role: 'Home Chef', quote: 'Takes me back to my grandmother’s kitchen. Authentic and premium.', img: '👩' },
];

export function StoreFront() {
  const navigate = useNavigate();
  const [allProducts, setAllProducts] = useState<Product[]>([]);
  const [bundles, setBundles] = useState<BundleOffer[]>([]);
  const { items, addToCart, updateQuantity } = useCart();
  const [showNotification, setShowNotification] = useState(false);
  const [notificationMessage, setNotificationMessage] = useState("");
  const { scrollY } = useScroll();
  
  // Responsive optimizations: Disable heavy transforms on small screens
  const isMobile = typeof window !== 'undefined' && window.innerWidth < 768;
  const heroOpacity = useTransform(scrollY, [0, 500], [1, 0.2]);
  const heroScale = useTransform(scrollY, [0, 500], [1, isMobile ? 1.05 : 1.1]);

  const scrollRef = useRef<HTMLDivElement>(null);
  const bundleScrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (window.location.hash === '#our-story') {
      const el = document.getElementById('our-story');
      if (el) setTimeout(() => el.scrollIntoView({ behavior: 'smooth' }), 500);
    }
  }, []);

  useEffect(() => {
    // Products
    const pq = query(collection(db, 'products'), limit(20));
    const unsubProducts = onSnapshot(pq, (snapshot) => {
      const productList = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as Product[];
      setAllProducts(productList);
    }, (error) => handleFirestoreError(error, OperationType.LIST, 'products'));

    // Bundles
    const bq = query(collection(db, 'bundles'), where('active', '==', true), limit(5));
    const unsubBundles = onSnapshot(bq, (snapshot) => {
      const bundleList = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as BundleOffer[];
      setBundles(bundleList);
    }, (error) => handleFirestoreError(error, OperationType.LIST, 'bundles'));

    return () => { unsubProducts(); unsubBundles(); };
  }, []);

  const artisanFavorites = allProducts.filter(p => p.status === 'Active' && p.isArtisanFavorite).slice(0, 12);

  const getCartItemQuantity = (id: string) => {
    return items.find(item => item.id === id)?.quantity || 0;
  };

  const getProductEmoji = (p: Product | undefined) => {
    if (!p) return '📦';
    if (p.image && !p.image.startsWith('http') && p.image.length <= 4) return p.image;
    return '🍿';
  };

  const handleAddToCart = (product: Product | BundleOffer) => {
    // Cast BundleOffer to Product for the cart
    const cartProduct = {
      ...product,
      category: 'Bundle',
      stock: 100,
      status: 'Active' as const,
      image: (product as BundleOffer).image || ''
    } as Product;
    
    addToCart(cartProduct);
    setNotificationMessage("ZING ADDED TO JAR! 🚀");
    setShowNotification(true);
    setTimeout(() => setShowNotification(false), 2000);
  };

  return (
    <div className="bg-white min-h-screen pb-24 lg:pb-10 overflow-x-hidden selection:bg-saffron/30">
      <StoreHeader />

      {/* Premium Luxury Adaptive Hero Section */}
      <section className="relative min-h-[85vh] md:h-screen w-full flex items-center overflow-hidden bg-[#0A0A0A]">
        <m.div 
          style={{ opacity: heroOpacity, scale: heroScale }} 
          className="absolute inset-0 z-0"
        >
          <div className="absolute inset-0 bg-gradient-to-b md:bg-gradient-to-r from-black via-black/60 to-transparent z-10" />
          <OptimizedImage 
            src="https://images.unsplash.com/photo-1516684732162-798a0062be99?q=80&w=1974&auto=format&fit=crop" 
            className="w-full h-full object-cover opacity-50"
            alt="Artisanal Indian Luxury"
          />
        </m.div>
        
        {!isMobile && (
          <div className="absolute inset-0 pointer-events-none z-20 overflow-hidden">
            {[...Array(8)].map((_, i) => (
              <m.div
                key={i}
                initial={{ opacity: 0, scale: 0.5 }}
                animate={{ 
                  y: ["-10%", "110%"],
                  opacity: [0, 0.3, 0],
                  rotate: 360,
                  scale: [0.5, 1, 0.5]
                }}
                transition={{ duration: 15 + Math.random() * 10, repeat: Infinity, ease: "linear", delay: i * 2 }}
                className="absolute text-2xl filter blur-[1px]"
                style={{ left: `${Math.random() * 100}%` }}
              >
                {['🌶️', '🍃', '✨', '🍿'][i % 4]}
              </m.div>
            ))}
          </div>
        )}

        <div className="relative z-30 w-full max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-2 items-center h-full pt-20 md:pt-0">
           <div className="space-y-6 md:space-y-10 text-center md:text-left">
              <m.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
                className="space-y-4 md:space-y-6"
              >
                <div className="flex items-center gap-3 justify-center md:justify-start">
                  <div className="h-[1px] w-8 md:w-12 bg-saffron" />
                  <span className="text-[10px] md:text-[11px] font-black uppercase tracking-[0.4em] text-saffron">Premium Indian Small-Batch</span>
                </div>
                
                <h2 className="text-6xl sm:text-7xl md:text-[8rem] font-black text-white italic leading-[0.9] tracking-tighter font-serif">
                  Spark<br/>
                  <span className="text-saffron italic">Zing.</span>
                </h2>
                
                <p className="text-base md:text-xl text-white/70 max-w-md mx-auto md:mx-0 font-medium leading-relaxed italic">
                  Experience makhana reimagined. Stone-roasted in small batches, glazed with Himalayan pink salt and secret sun-dried spices.
                </p>
              </m.div>

              <m.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4, duration: 0.8 }}
                className="flex flex-col sm:flex-row items-center gap-4 md:gap-6 pt-4"
              >
                 <button onClick={() => navigate('/shop')} className="w-full sm:w-auto px-10 py-5 md:px-12 md:py-6 bg-saffron text-black rounded-2xl font-black italic tracking-tight shadow-2xl hover:scale-105 transition-all flex items-center justify-center gap-4 group active:scale-95">
                    SHOP THE Zing <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                 </button>
                 <button 
                  onClick={() => document.getElementById('our-story')?.scrollIntoView({ behavior: 'smooth' })} 
                  className="w-full sm:w-auto px-10 py-5 md:px-12 md:py-6 glass-light text-white rounded-2xl font-black italic tracking-tight hover:bg-white/20 transition-all active:scale-95"
                >
                    OUR STORY
                 </button>
              </m.div>
           </div>

           <m.div
             initial={{ opacity: 0, scale: 0.9 }}
             animate={{ opacity: 1, scale: 1 }}
             transition={{ duration: 1, delay: 0.2 }}
             className="relative pt-12 md:pt-0 flex justify-center md:justify-end"
           >
              <div className="relative group max-w-[300px] sm:max-w-[400px] md:max-w-none">
                <div className="absolute inset-0 bg-saffron/10 blur-[100px] rounded-full scale-125 md:scale-150 animate-pulse" />
                <div className="relative z-10 w-full md:w-[450px] aspect-square flex items-center justify-center">
                   <m.div
                     animate={isMobile ? {} : { y: [0, -20, 0], rotate: [1, -1, 1] }}
                     transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
                   >
                      <OptimizedImage 
                        src={sparkZingPouch} 
                        alt="Spark Zing"
                        className="w-full h-auto drop-shadow-2xl filter brightness-110"
                      />
                   </m.div>
                </div>
              </div>
           </m.div>
        </div>
      </section>

      {/* Trust Badges - Fluid Grid */}
      <div className="bg-cream/80 backdrop-blur-md border-y border-orange-50/50 py-10 md:py-16">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-2 lg:grid-cols-4 gap-8 md:gap-12">
           {[
             { label: 'Stone Roasted', desc: 'Ancient Craftsmanship', icon: Flame },
             { label: 'Clean Label', desc: 'No Artificial Zing', icon: Sparkles },
             { label: 'Small Batches', desc: 'Handcrafted Quality', icon: Star },
             { label: 'Eco Conscious', desc: 'Planet Positive', icon: MapPin },
           ].map((badge, i) => (
             <div key={i} className="flex flex-col items-center md:items-start text-center md:text-left gap-3">
                <div className="p-3 bg-white rounded-xl shadow-sm border border-orange-50">
                  <badge.icon className="w-5 h-5 text-chili" />
                </div>
                <div>
                  <span className="block text-sm font-black text-deep-charcoal italic">{badge.label}</span>
                  <span className="block text-[9px] font-bold text-cinnamon uppercase tracking-[0.2em] opacity-60">{badge.desc}</span>
                </div>
             </div>
           ))}
        </div>
      </div>

      {/* Artisan Favorites - Responsive Multi-Column/Swipe */}
      <section className="py-20 md:py-32 max-w-7xl mx-auto px-6">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 md:mb-20 gap-6">
           <div className="space-y-4">
              <div className="flex items-center gap-3">
                 <div className="w-2 h-8 bg-chili rounded-full" />
                 <span className="text-[10px] font-black uppercase tracking-[0.4em] text-cinnamon">Season's Finest</span>
              </div>
              <h2 className="text-5xl md:text-7xl">Artisan Batch</h2>
           </div>
           <Link to="/shop" className="text-xs font-black uppercase text-cinnamon hover:text-chili transition-colors flex items-center gap-3 tracking-widest group">
              Browse Full Shop <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
           </Link>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-8">
          {artisanFavorites.map((product, i) => (
            <m.div 
              key={product.id} 
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ delay: (i % 4) * 0.1 }}
            >
               <ProductCard product={product} onAdd={handleAddToCart} />
            </m.div>
          ))}
        </div>
      </section>

      {/* Combo Offers Section */}
      {bundles.length > 0 && (
        <section className="py-20 md:py-32 bg-cream/30">
          <div className="max-w-7xl mx-auto px-6">
            <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 md:mb-16 gap-4">
               <div className="space-y-2 md:space-y-4">
                  <div className="flex items-center gap-3">
                     <div className="w-1.5 h-6 md:w-2 md:h-8 bg-saffron rounded-full" />
                     <span className="text-[9px] md:text-[10px] font-black uppercase tracking-[0.3em] md:tracking-[0.4em] text-cinnamon">Exclusive Bundles</span>
                  </div>
                  <h2 className="text-4xl md:text-7xl font-black italic tracking-tighter">Combo Offers</h2>
               </div>
               <Link to="/bundles" className="text-[10px] font-black uppercase text-cinnamon hover:text-chili transition-colors flex items-center gap-2 md:gap-3 tracking-[0.15em] group">
                  View All Packs <ArrowRight className="w-3.5 h-3.5 md:w-4 md:h-4 group-hover:translate-x-1 transition-transform" />
               </Link>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
              {bundles.map((bundle, i) => {
                const savings = bundle.originalPrice ? bundle.originalPrice - bundle.price : 0;
                const savingsPercentage = bundle.originalPrice ? Math.round((savings / bundle.originalPrice) * 100) : 0;
                const bundleProducts = bundle.productIds.map(id => allProducts.find(p => p.id === id)).filter(Boolean) as Product[];
                const quantity = getCartItemQuantity(bundle.id);

                return (
                  <m.div
                    key={bundle.id || i}
                    initial={{ opacity: 0, scale: 0.95 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.1 }}
                    className="group relative bg-white rounded-[2rem] overflow-hidden shadow-xl shadow-orange-500/5 border border-orange-50 hover:shadow-2xl hover:shadow-orange-500/10 transition-all p-6 md:p-8 flex flex-col items-center text-center"
                  >
                    <div className="w-full relative pt-2 mb-2">
                      {/* Savings Badge - Repositioned and Slimmer */}
                      {savingsPercentage > 0 && (
                        <div className="absolute -top-2 -right-2 flex flex-col items-center justify-center w-14 h-14 md:w-16 md:h-16 bg-chili text-white rounded-full shadow-lg rotate-12 group-hover:rotate-0 transition-transform duration-500 z-20 border-2 border-white">
                          <span className="text-sm md:text-lg font-black italic">-{savingsPercentage}%</span>
                          <span className="text-[7px] md:text-[8px] font-bold uppercase tracking-widest leading-none">OFF</span>
                        </div>
                      )}
                    </div>

                    <div className="space-y-3 md:space-y-4 w-full flex-grow">
                      <div className="space-y-2">
                        <div className="flex items-center justify-center gap-2">
                           <div className="h-[1px] w-3 bg-orange-100" />
                           <span className="text-[8px] font-black text-cinnamon/40 uppercase tracking-[0.2em]">Signature Bundle</span>
                           <div className="h-[1px] w-3 bg-orange-100" />
                        </div>
                        <h3 className="text-xl md:text-2xl font-black italic tracking-tighter text-deep-charcoal">{bundle.name}</h3>
                        
                        <div className="bg-orange-50/20 rounded-xl p-3 border border-orange-100/30 space-y-2">
                          <div className="space-y-1.5">
                            {bundleProducts.map((p) => (
                              <div key={p.id} className="flex items-center justify-between group/item">
                                <div className="flex items-center gap-2">
                                  <span className="text-sm">{getProductEmoji(p)}</span>
                                  <span className="text-[10px] md:text-[11px] font-bold text-deep-charcoal italic">{p.name}</span>
                                </div>
                                <span className="text-[8px] font-black text-cinnamon/30 uppercase tracking-widest">Handcrafted</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                      
                      <p className="text-[10px] md:text-xs font-medium text-cinnamon/60 italic leading-relaxed px-1">
                        {bundle.description}
                      </p>
                      
                      <div className="flex flex-col items-center gap-2">
                        <div className="flex items-center gap-3 bg-white px-4 py-2 rounded-full shadow-md border border-orange-50">
                          <div className="flex flex-col text-right pr-3 border-r border-orange-100">
                             <span className="text-[7px] font-bold text-cinnamon/40 uppercase tracking-widest">Actual</span>
                             <span className="text-[10px] md:text-xs font-bold text-cinnamon/20 line-through leading-none">₹{bundle.originalPrice}</span>
                          </div>
                          <div className="flex flex-col text-left">
                             <span className="text-[7px] font-black text-chili uppercase tracking-widest leading-none mb-0.5">Combo</span>
                             <span className="text-xl md:text-2xl font-black text-deep-charcoal italic leading-none">₹{bundle.price}</span>
                          </div>
                        </div>
                      </div>

                      <div className="mt-4 md:mt-6 w-full">
                        <AnimatePresence mode="wait">
                          {quantity === 0 ? (
                            <m.button 
                              key="add-to-jar"
                              initial={{ opacity: 0, y: 10 }}
                              animate={{ opacity: 1, y: 0 }}
                              exit={{ opacity: 0, y: -10 }}
                              onClick={() => handleAddToCart(bundle)}
                              className="w-full py-4 md:py-5 bg-deep-charcoal text-white rounded-xl md:rounded-2xl font-black italic shadow-xl hover:bg-chili active:scale-95 transition-all text-xs md:text-base tracking-[0.05em]"
                            >
                              ADD TO JAR
                            </m.button>
                          ) : (
                            <m.div 
                              key="quantity-control"
                              initial={{ opacity: 0, y: 10 }}
                              animate={{ opacity: 1, y: 0 }}
                              exit={{ opacity: 0, y: -10 }}
                              className="flex items-center bg-cream rounded-xl md:rounded-2xl p-1 shadow-inner border border-orange-100"
                            >
                              <button 
                                onClick={() => updateQuantity(bundle.id, quantity - 1)}
                                className="w-12 h-12 md:w-14 md:h-14 bg-white rounded-lg md:rounded-xl shadow-sm text-deep-charcoal font-black text-xl hover:bg-chili hover:text-white transition-all active:scale-90"
                              >
                                −
                              </button>
                              <div className="flex-1 flex flex-col items-center">
                                <span className="text-lg md:text-2xl font-black italic text-deep-charcoal">{quantity}</span>
                                <span className="text-[8px] font-bold text-cinnamon uppercase tracking-widest">In Jar</span>
                              </div>
                              <button 
                                onClick={() => updateQuantity(bundle.id, quantity + 1)}
                                className="w-12 h-12 md:w-14 md:h-14 bg-white rounded-lg md:rounded-xl shadow-sm text-deep-charcoal font-black text-xl hover:bg-chili hover:text-white transition-all active:scale-90"
                              >
                                +
                              </button>
                            </m.div>
                          )}
                        </AnimatePresence>
                      </div>
                    </div>
                  </m.div>
                );
              })}
            </div>
          </div>
        </section>
      )}

      <MakersStory />

      <section className="py-20 md:py-32 bg-deep-charcoal text-white overflow-hidden relative">
        <div className="absolute top-0 right-0 w-96 h-96 bg-saffron/10 rounded-full blur-[120px]" />
        <div className="max-w-7xl mx-auto px-6 relative z-10">
           <div className="text-center mb-16 md:mb-24 space-y-4">
              <span className="text-xs font-black uppercase tracking-[0.5em] text-saffron">Artisan Reviews</span>
              <h2 className="text-white">Community Zing</h2>
           </div>

           <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12">
              {testimonials.map((t, i) => (
                <m.div 
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  className="bg-white/5 border border-white/10 p-10 rounded-[3rem] space-y-6 hover:bg-white/10 transition-all duration-500"
                >
                   <div className="text-4xl opacity-80">{t.img}</div>
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

      <footer className="bg-cream pt-24 pb-32 md:pb-12 border-t border-orange-50">
        <div className="max-w-7xl mx-auto px-6">
           <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-12 sm:gap-16 mb-20">
              <div className="space-y-6">
                 <h2 className="text-2xl font-black text-deep-charcoal italic tracking-tight">SPARK ZING</h2>
                 <p className="text-sm font-medium text-cinnamon/60 leading-relaxed italic">
                   Redefining the artisan snack experience with fresh ingredients and bold Indian spice profiles.
                 </p>
                 <div className="flex gap-4">
                    <button className="p-3 bg-white rounded-2xl shadow-xl hover:scale-110 hover:text-chili transition-all"><Instagram className="w-4 h-4" /></button>
                    <button className="p-3 bg-white rounded-2xl shadow-xl hover:scale-110 hover:text-chili transition-all"><Facebook className="w-4 h-4" /></button>
                 </div>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-1 gap-8">
                <div>
                   <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-deep-charcoal mb-6">Explore</h4>
                   <ul className="space-y-3 text-sm font-bold text-cinnamon/60 uppercase tracking-widest text-[10px]">
                      <li className="hover:text-chili cursor-pointer transition-colors"><Link to="/shop">Shop Collection</Link></li>
                      <li className="hover:text-chili cursor-pointer transition-colors"><Link to="/bundles">Value Packs</Link></li>
                      <li className="hover:text-chili cursor-pointer transition-colors">Maker's Story</li>
                   </ul>
                </div>
                <div>
                   <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-deep-charcoal mb-6">Support</h4>
                   <ul className="space-y-3 text-sm font-bold text-cinnamon/60 uppercase tracking-widest text-[10px]">
                      <li className="hover:text-chili cursor-pointer transition-colors">Shipping</li>
                      <li className="hover:text-chili cursor-pointer transition-colors">Privacy</li>
                      <li className="hover:text-chili cursor-pointer transition-colors">Terms</li>
                   </ul>
                </div>
              </div>

              <div className="lg:col-span-2 space-y-8 max-w-sm">
                 <h4 className="text-[10px] font-black uppercase tracking-[0.4em] text-deep-charcoal">The Society</h4>
                 <p className="text-xs font-bold text-cinnamon/60 leading-relaxed uppercase tracking-widest">Join the Society for fresh drops & artisan secrets.</p>
                 <div className="relative">
                    <input type="text" placeholder="Your email..." className="w-full bg-white border-2 border-orange-50 rounded-2xl py-5 px-6 text-xs font-bold focus:border-saffron outline-none transition-all" />
                    <button className="absolute right-2 top-1/2 -translate-y-1/2 p-3 bg-deep-charcoal text-white rounded-xl hover:bg-chili transition-colors shadow-lg">
                       <ArrowRight className="w-4 h-4" />
                    </button>
                 </div>
              </div>
           </div>

           <div className="flex flex-col md:flex-row items-center justify-between pt-12 border-t border-orange-50/50 gap-6">
              <span className="text-[10px] font-black text-cinnamon/30 uppercase tracking-[0.5em]">© 2024 Spark Zing Artisanal</span>
              <div className="flex items-center gap-8 opacity-40">
                 <div className="w-8 h-8 rounded-full border border-orange-900" />
                 <div className="w-8 h-8 rounded-full border border-orange-900" />
                 <div className="w-8 h-8 rounded-full border border-orange-900" />
              </div>
           </div>
        </div>
      </footer>

      <AnimatePresence>
        {showNotification && (
          <m.div 
            initial={{ opacity: 0, y: 50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 50, scale: 0.9 }}
            className="fixed bottom-28 left-4 right-4 md:left-auto md:right-8 md:w-96 bg-chili text-white py-5 px-8 rounded-3xl shadow-2xl shadow-chili/30 z-[100] flex items-center justify-between font-black italic tracking-tight border border-white/20"
          >
            <div className="flex items-center gap-3">
               <Sparkles className="w-5 h-5 text-saffron fill-saffron" />
               <span className="uppercase text-sm">{notificationMessage}</span>
            </div>
          </m.div>
        )}
      </AnimatePresence>
    </div>
  );
}
