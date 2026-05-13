import { useState, useEffect } from 'react';
import { m, AnimatePresence, useScroll, useTransform } from 'motion/react';
import { ShoppingCart, LayoutDashboard, Sparkles, Flame, Star, ArrowRight, Heart, ShoppingBag, MapPin, Instagram, Facebook, Twitter, Search, User } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { ProductCard } from '@/components/store/ProductCard';
import { BottomNav } from '@/components/store/BottomNav';
import { BuildBox } from '@/components/store/BuildBox';
import { MakersStory } from '@/components/store/MakersStory';
import { SocialFeed } from '@/components/store/SocialFeed';
import { BundleSaver } from '@/components/promo/BundleSaver';
import { Product } from '@/types';
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
  const [products, setProducts] = useState<Product[]>([]);
  const { totalItems, addToCart } = useCart();
  const [showNotification, setShowNotification] = useState(false);
  const { scrollY } = useScroll();
  const heroOpacity = useTransform(scrollY, [0, 500], [1, 0]);
  const heroScale = useTransform(scrollY, [0, 500], [1, 1.1]);

  useEffect(() => {
    const q = query(collection(db, 'products'), where('status', '==', 'Active'), limit(8));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const productList = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Product[];
      setProducts(productList);
    }, (error) => {
      handleFirestoreError(error, OperationType.LIST, 'products');
    });

    return () => unsubscribe();
  }, []);

  const handleAddToCart = (product: Product) => {
    addToCart(product);
    setShowNotification(true);
    setTimeout(() => setShowNotification(false), 2000);
  };

  return (
    <div className="bg-white min-h-screen pb-10 overflow-x-hidden font-sans selection:bg-saffron/30">
      {/* Cinematic Header */}
      <header className="px-6 py-4 flex items-center justify-between sticky top-0 bg-white/80 backdrop-blur-xl z-50 border-b border-orange-50">
        <div className="flex items-center gap-12">
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
             <a href="#" className="text-[10px] font-black text-cinnamon uppercase tracking-[0.2em] hover:text-chili transition-colors">SHOP</a>
             <a href="#" className="text-[10px] font-black text-cinnamon uppercase tracking-[0.2em] hover:text-chili transition-colors">BUILD A BOX</a>
             <a href="#" className="text-[10px] font-black text-cinnamon uppercase tracking-[0.2em] hover:text-chili transition-colors">OUR STORY</a>
          </nav>
        </div>

        <div className="flex items-center gap-2">
          <button className="p-2.5 text-cinnamon hover:text-chili transition-colors" title="Search">
            <Search className="w-5 h-5" />
          </button>
          
          <Link to="/admin" className="p-2.5 text-cinnamon hover:text-chili transition-colors" title="Account / Admin">
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

      {/* Hero Section - Full Width Cinematic */}
      <section className="relative h-[95vh] flex items-center justify-center overflow-hidden">
        <m.div style={{ opacity: heroOpacity, scale: heroScale }} className="absolute inset-0 z-0">
          <OptimizedImage 
            src="https://images.unsplash.com/photo-1596560548464-f01031d93ce8?q=80&w=2070&auto=format&fit=crop" 
            className="w-full h-full brightness-75"
            alt="Hero Background"
          />
        </m.div>
        
        <div className="relative z-10 text-center text-white px-6 w-full max-w-4xl space-y-8">
           <m.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 1 }}
              className="bg-black/20 backdrop-blur-md p-12 md:p-20 rounded-[4rem] border border-white/20 shadow-2xl"
           >
              <m.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="inline-flex items-center gap-3 px-6 py-3 rounded-full bg-saffron/90 text-black mb-8"
              >
                 <Flame className="w-4 h-4" />
                 <span className="text-[10px] font-black uppercase tracking-[0.3em]">Summer Seasonal Release</span>
              </m.div>

              <m.h2 
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="text-7xl md:text-9xl font-black italic leading-[0.85] tracking-tighter font-serif mb-10"
              >
                 CRAFTED <br/>
                 <span className="text-saffron italic">CRUNCH.</span>
              </m.h2>

              <m.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.6 }}
                className="text-lg md:text-xl font-medium text-white/90 max-w-xl mx-auto mb-12"
              >
                 Small-batch artisanal snacks hand-grinded with Kerala's finest spices. 
              </m.p>

              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                 <button className="w-full sm:w-auto px-12 py-6 bg-saffron text-black rounded-[2rem] font-black italic tracking-tight shadow-xl hover:scale-105 transition-transform flex items-center justify-center gap-3">
                    SHOP ALL FLAVORS <ArrowRight className="w-5 h-5" />
                 </button>
              </div>
           </m.div>
        </div>

        {/* Floating Particles Simulation */}
        <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden">
           {[...Array(12)].map((_, i) => (
             <m.div
               key={i}
               className="absolute text-2xl opacity-20"
               initial={{ 
                 left: `${Math.random() * 100}%`, 
                 top: `${Math.random() * 100}%`,
                 rotate: Math.random() * 360
               }}
               animate={{ 
                 y: [0, -50, 0],
                 x: [0, 30, 0],
                 rotate: [0, 180, 0],
                 opacity: [0.1, 0.4, 0.1]
               }}
               transition={{ 
                 duration: 10 + Math.random() * 20, 
                 repeat: Infinity,
                 ease: "linear"
               }}
             >
                {['✨', '🌶️', '🥜', '🔥'][i % 4]}
             </m.div>
           ))}
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

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {products.map((product) => (
            <div key={product.id} onClick={() => navigate(`/product/${product.id}`)} className="cursor-pointer">
               <ProductCard product={product} onAdd={handleAddToCart} />
            </div>
          ))}
          {products.length === 0 && (
            <div className="col-span-full flex flex-col items-center justify-center p-20 bg-cream rounded-[4rem] border-2 border-dashed border-orange-100">
               <Sparkles className="w-12 h-12 text-saffron mb-4 animate-pulse" />
               <p className="text-2xl font-black text-deep-charcoal italic">Sourcing Fresh Batch...</p>
               <p className="text-sm text-cinnamon/60 font-bold uppercase tracking-widest mt-2 text-center">New artisanal snacks are being prepared.</p>
            </div>
          )}
        </div>
      </section>

      {/* Combo Offers / Bundle Saver */}
      <section className="py-12 max-w-7xl mx-auto px-6">
        <BundleSaver />
      </section>

      {/* Build Your Own Box - Interactive Section */}
      <section className="py-24 max-w-7xl mx-auto px-6">
         <BuildBox />
      </section>

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

      {/* Social Media Feed */}
      <SocialFeed />

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
              <div className="flex items-center gap-2 text-[10px] font-bold text-cinnamon uppercase tracking-widest">
                 <MapPin className="w-3 h-3 text-chili" /> 
                 Kerala, India
              </div>
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
