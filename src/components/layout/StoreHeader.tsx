import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ShoppingBag, Search, User, Sparkles, Menu, X } from 'lucide-react';
import { m, AnimatePresence } from 'motion/react';
import { useCart } from '@/contexts/CartContext';
import { cn } from '@/lib/utils';

export function StoreHeader() {
  const navigate = useNavigate();
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { totalItems } = useCart();

  const handleCartClick = () => {
    navigate('/checkout');
  };

  return (
    <>
      <header className="px-4 md:px-8 py-4 flex items-center justify-between sticky top-0 bg-white/80 backdrop-blur-xl z-50 border-b border-orange-50/50">
        <div className="flex items-center gap-4 lg:gap-12">
          {/* Mobile Menu Toggle */}
          <button 
            onClick={() => setIsMenuOpen(true)}
            className="lg:hidden p-2 text-deep-charcoal hover:bg-cream rounded-xl transition-colors"
          >
            <Menu className="w-6 h-6" />
          </button>

          <Link to="/" className="flex items-center gap-2 group">
            <div className="w-9 h-9 md:w-10 md:h-10 bg-deep-charcoal rounded-xl md:rounded-2xl flex items-center justify-center text-white shadow-lg group-hover:rotate-12 transition-transform duration-500">
              <Sparkles className="w-5 h-5 text-saffron" />
            </div>
            <div className="hidden sm:block">
              <h1 className="text-lg md:text-xl font-black text-deep-charcoal tracking-tight leading-none italic font-serif">SPARK ZING</h1>
              <span className="text-[7px] md:text-[8px] font-black uppercase tracking-[0.4em] text-cinnamon/60">Artisanal Snacking</span>
            </div>
          </Link>

          <nav className="hidden lg:flex items-center gap-8">
            <Link to="/shop" className="text-[10px] font-black text-cinnamon hover:text-chili transition-colors tracking-[0.2em]">SHOP</Link>
            <Link to="/bundles" className="text-[10px] font-black text-cinnamon hover:text-chili transition-colors tracking-[0.2em]">BUNDLES</Link>
            <a href="#our-story" className="text-[10px] font-black text-cinnamon hover:text-chili transition-colors tracking-[0.2em]">OUR STORY</a>
          </nav>
        </div>

        <div className="flex items-center gap-2 md:gap-4">
          <div className={cn(
            "relative hidden md:flex items-center transition-all duration-300",
            isSearchOpen ? "w-64" : "w-48"
          )}>
            <Search className="absolute left-3 w-4 h-4 text-cinnamon/40" />
            <input 
              type="text" 
              placeholder="Search snacks..." 
              onFocus={() => setIsSearchOpen(true)}
              onBlur={() => setIsSearchOpen(false)}
              className="w-full pl-9 pr-4 py-2 bg-cream rounded-full text-xs font-bold border-none focus:ring-1 focus:ring-saffron outline-none transition-all placeholder:text-cinnamon/30"
            />
          </div>

          <button 
            className="md:hidden p-2 text-cinnamon hover:text-chili transition-colors"
            onClick={() => setIsSearchOpen(!isSearchOpen)}
          >
            <Search className="w-5 h-5" />
          </button>
          
          <Link to="/admin" className="p-2 text-cinnamon hover:text-chili transition-colors">
            <User className="w-5 h-5" />
          </Link>

          <button 
            onClick={handleCartClick}
            className="relative group p-2 bg-deep-charcoal rounded-xl text-white shadow-xl hover:bg-chili transition-all active:scale-90"
          >
            <ShoppingBag className="w-5 h-5" />
            <AnimatePresence>
              {totalItems > 0 && (
                <m.div 
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  exit={{ scale: 0 }}
                  key={totalItems}
                  className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-saffron text-black rounded-full flex items-center justify-center text-[10px] font-black border-2 border-white shadow-lg"
                >
                  {totalItems}
                </m.div>
              )}
            </AnimatePresence>
          </button>
        </div>
      </header>

      {/* Mobile Sidebar Menu */}
      <AnimatePresence>
        {isMenuOpen && (
          <>
            <m.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsMenuOpen(false)}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[60]"
            />
            <m.div 
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed inset-y-0 left-0 w-[80%] max-w-sm bg-white z-[70] p-8 flex flex-col shadow-2xl"
            >
              <div className="flex items-center justify-between mb-12">
                <div className="flex items-center gap-2">
                  <div className="w-10 h-10 bg-deep-charcoal rounded-2xl flex items-center justify-center text-white">
                    <Sparkles className="w-5 h-5 text-saffron" />
                  </div>
                  <h1 className="text-xl font-black italic">SPARK ZING</h1>
                </div>
                <button onClick={() => setIsMenuOpen(false)} className="p-2 hover:bg-cream rounded-full transition-colors">
                  <X className="w-6 h-6 text-cinnamon" />
                </button>
              </div>

              <nav className="flex flex-col gap-6">
                {[
                  { label: 'Shop All', path: '/shop' },
                  { label: 'Value Bundles', path: '/bundles' },
                  { label: 'Seasonal Offers', path: '/seasonal' },
                  { label: 'Our Story', path: '/#our-story' },
                  { label: 'Your Profile', path: '/admin' },
                ].map((item) => (
                  <Link 
                    key={item.path}
                    to={item.path}
                    onClick={() => setIsMenuOpen(false)}
                    className="text-2xl font-black italic text-deep-charcoal hover:text-chili transition-colors flex items-center justify-between group"
                  >
                    {item.label}
                    <div className="w-8 h-8 rounded-full border border-orange-50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                      <Menu className="w-4 h-4" />
                    </div>
                  </Link>
                ))}
              </nav>

              <div className="mt-auto pt-12 border-t border-orange-50">
                <p className="text-[10px] font-black uppercase tracking-[0.2em] text-cinnamon/40 mb-4">Handcrafted in small batches</p>
                <div className="flex gap-4">
                  <div className="w-10 h-10 bg-cream rounded-full flex items-center justify-center text-chili">🇮🇳</div>
                  <div className="text-xs font-bold text-cinnamon/60">Shipping Pan-India<br/>Authentic Flavors</div>
                </div>
              </div>
            </m.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
