import { useState } from 'react';
import { m, AnimatePresence } from 'motion/react';
import { ShoppingBag, X, Plus, Minus, CreditCard, ChevronLeft } from 'lucide-react';
import { useCart } from '@/contexts/CartContext';
import { cn } from '@/lib/utils';
import { useNavigate } from 'react-router-dom';
import { auth } from '@/lib/firebase';

export function SideCart() {
  const [isOpen, setIsOpen] = useState(false);
  const { items, totalItems, totalPrice, updateQuantity, removeFromCart } = useCart();
  const navigate = useNavigate();

  const handleCheckout = () => {
    if (!auth.currentUser) {
      // Logic for non-registered: ask to register
      // In this app, we'll redirect to a generic login/register if they aren't authenticated
      // For now, let's assume we redirect to /login (which I'll need to handle or use an existing one)
      alert("Please sign in or register to proceed with checkout.");
      navigate('/admin'); // Redirecting to admin for login since that's where auth usually lives in this template
      return;
    }
    navigate('/checkout'); // Placeholder for checkout page
  };

  if (totalItems === 0 && !isOpen) return null;

  return (
    <>
      {/* Floating Toggle Trigger */}
      <div 
        className={cn(
          "fixed right-0 top-1/2 -translate-y-1/2 z-[100] transition-transform duration-500",
          isOpen ? "translate-x-full" : "translate-x-0"
        )}
      >
        <m.button
          whileHover={{ scale: 1.05, x: -5 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setIsOpen(true)}
          className="bg-deep-charcoal text-white p-4 rounded-l-3xl shadow-2xl flex flex-col items-center gap-2 border-y border-l border-white/20"
        >
          <div className="relative">
            <ShoppingBag className="w-6 h-6" />
            {totalItems > 0 && (
              <span className="absolute -top-1 -right-1 w-4 h-4 bg-saffron text-black text-[8px] font-black rounded-full flex items-center justify-center">
                {totalItems}
              </span>
            )}
          </div>
          <span className="text-[10px] font-black uppercase tracking-widest vertical-text py-2">BAG</span>
        </m.button>
      </div>

      {/* Cart Drawer */}
      <AnimatePresence>
        {isOpen && (
          <>
            <m.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
              className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[110]"
            />
            <m.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed right-0 top-0 bottom-0 w-full max-w-md bg-white z-[120] shadow-[-20px_0_50px_rgba(0,0,0,0.1)] flex flex-col"
            >
              {/* Header */}
              <div className="p-8 border-b border-orange-50 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-cream rounded-2xl flex items-center justify-center">
                    <ShoppingBag className="w-6 h-6 text-chili" />
                  </div>
                  <div>
                    <h2 className="text-xl font-black text-deep-charcoal italic leading-none">Your Zing Bag</h2>
                    <p className="text-[10px] font-bold text-cinnamon/40 uppercase tracking-widest mt-1">{totalItems} ARTISANAL ITEMS</p>
                  </div>
                </div>
                <button 
                  onClick={() => setIsOpen(false)}
                  className="p-3 bg-cream rounded-xl text-cinnamon hover:text-chili transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Items List */}
              <div className="flex-1 overflow-y-auto p-8 space-y-6">
                {items.length === 0 ? (
                  <div className="h-full flex flex-col items-center justify-center text-center space-y-4">
                    <div className="w-20 h-20 bg-cream rounded-full flex items-center justify-center opacity-40">
                      <ShoppingBag className="w-10 h-10 text-cinnamon" />
                    </div>
                    <p className="text-sm font-bold text-cinnamon uppercase tracking-widest opacity-60 italic">Bag is currently empty</p>
                    <button 
                      onClick={() => setIsOpen(false)}
                      className="px-8 py-3 bg-deep-charcoal text-white rounded-full text-xs font-black italic hover:bg-chili transition-all"
                    >
                      BROWSE SHOP
                    </button>
                  </div>
                ) : (
                  items.map((item) => (
                    <div key={item.id} className="flex gap-4 group">
                      <div className="w-24 h-24 bg-cream rounded-2xl overflow-hidden shadow-sm flex-shrink-0">
                        <img src={item.image} alt={item.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                      </div>
                      <div className="flex-1 min-w-0 py-1 flex flex-col justify-between">
                        <div>
                          <div className="flex justify-between items-start">
                            <h4 className="text-sm font-black text-deep-charcoal italic tracking-tight truncate pr-4">{item.name}</h4>
                            <p className="text-sm font-black text-cinnamon">Rs. {item.price * item.quantity}</p>
                          </div>
                          <p className="text-[10px] font-bold text-cinnamon/40 uppercase tracking-widest mt-0.5">{item.category}</p>
                        </div>
                        
                        <div className="flex items-center justify-between">
                          <div className="flex items-center bg-cream rounded-xl border border-orange-50 overflow-hidden">
                            <button 
                              onClick={() => updateQuantity(item.id, item.quantity - 1)}
                              className="p-2 hover:bg-orange-100 transition-colors"
                            >
                              <Minus className="w-3 h-3 text-cinnamon" />
                            </button>
                            <span className="w-8 text-center text-xs font-black text-deep-charcoal">{item.quantity}</span>
                            <button 
                              onClick={() => updateQuantity(item.id, item.quantity + 1)}
                              className="p-2 hover:bg-orange-100 transition-colors"
                            >
                              <Plus className="w-3 h-3 text-cinnamon" />
                            </button>
                          </div>
                          <button 
                            onClick={() => removeFromCart(item.id)}
                            className="text-[10px] font-black text-chili/40 uppercase tracking-widest hover:text-chili transition-colors"
                          >
                            Remove
                          </button>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>

              {/* Footer Summary */}
              {items.length > 0 && (
                <div className="p-8 bg-cream border-t border-orange-50 space-y-6">
                  <div className="space-y-3">
                    <div className="flex justify-between text-[10px] font-black text-cinnamon/60 uppercase tracking-widest leading-none">
                       <span>Subtotal</span>
                       <span>Rs. {totalPrice}</span>
                    </div>
                    <div className="flex justify-between text-[10px] font-black text-cinnamon/60 uppercase tracking-widest leading-none">
                       <span>Shipping</span>
                       <span className="text-chili italic">FREE</span>
                    </div>
                    <div className="flex justify-between text-xl font-black text-deep-charcoal italic">
                       <span>Total</span>
                       <span>Rs. {totalPrice}</span>
                    </div>
                  </div>

                  <button 
                    onClick={handleCheckout}
                    className="w-full bg-deep-charcoal text-white py-5 rounded-[2rem] font-black italic flex items-center justify-center gap-3 shadow-2xl hover:bg-chili transition-all group"
                  >
                    CHECKOUT <CreditCard className="w-5 h-5 group-hover:rotate-12 transition-transform" />
                  </button>
                  
                  <p className="text-[9px] font-bold text-cinnamon/40 text-center uppercase tracking-widest px-12 leading-relaxed">
                    By checking out, you agree to Spark Zing's artisanal quality standards & handmade shipping times.
                  </p>
                </div>
              )}
            </m.div>
          </>
        )}
      </AnimatePresence>

      <style>{`
        .vertical-text {
          writing-mode: vertical-rl;
          text-orientation: mixed;
        }
      `}</style>
    </>
  );
}
