import { useNavigate } from 'react-router-dom';
import { m, AnimatePresence } from 'motion/react';
import { CreditCard, ChevronLeft, ShieldCheck, Truck, Clock, Sparkles, MapPin, Check, ArrowRight } from 'lucide-react';
import { useCart } from '@/contexts/CartContext';
import { OptimizedImage } from '@/components/ui/OptimizedImage';
import { cn } from '@/lib/utils';
import { useState } from 'react';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { db, handleFirestoreError, OperationType } from '@/lib/firebase';

export function Checkout() {
  const navigate = useNavigate();
  const { totalPrice, items, clearCart } = useCart();
  const [isOrdering, setIsOrdering] = useState(false);

  const handlePlaceOrder = async () => {
    setIsOrdering(true);
    
    try {
      const orderData = {
        customer: "Karan Singh", // In a real app, this would come from a user profile
        amount: totalPrice,
        status: 'New',
        date: serverTimestamp(),
        items: items.map(item => ({
          id: item.id,
          name: item.name,
          quantity: item.quantity,
          price: item.price
        }))
      };

      await addDoc(collection(db, 'orders'), orderData);
      
      setTimeout(() => {
        clearCart();
        navigate('/');
      }, 2000);
    } catch (error) {
      console.error("Order Creation Error:", error);
      handleFirestoreError(error, OperationType.CREATE, 'orders');
      setIsOrdering(false);
    }
  };

  return (
    <div className="min-h-screen bg-cream selection:bg-saffron/30">
      <header className="bg-white/80 backdrop-blur-xl border-b border-orange-50/50 px-4 md:px-8 py-5 md:py-8 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-[10px] md:text-xs font-black text-cinnamon/60 uppercase tracking-[0.2em] hover:text-chili transition-colors group">
            <ChevronLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" /> Back
          </button>
          <div className="flex flex-col items-center">
            <h1 className="text-xl md:text-2xl font-black text-deep-charcoal italic tracking-tight leading-none">ORDER DETAILS</h1>
            <span className="text-[8px] font-black text-cinnamon/40 tracking-[0.5em] uppercase mt-1">Spark Zing Artisanal</span>
          </div>
          <div className="w-12 md:w-20" /> {/* Spacer */}
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 md:px-6 py-10 md:py-20 pb-40 md:pb-20">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 md:gap-16 items-start">
          {/* Left: Summary & Address */}
          <div className="lg:col-span-7 space-y-12">
            <section className="space-y-6">
              <div className="flex items-center gap-3">
                 <div className="w-1.5 h-6 bg-chili rounded-full" />
                 <h3 className="text-[11px] font-black text-deep-charcoal uppercase tracking-[0.3em]">Your Selection</h3>
              </div>
              <div className="bg-white rounded-[2.5rem] p-6 md:p-10 shadow-xl shadow-orange-500/5 border border-orange-50 space-y-8">
                <div className="space-y-6 max-h-[40vh] overflow-y-auto pr-2 custom-scrollbar">
                  {items.map(item => (
                    <div key={item.id} className="flex justify-between items-center group">
                      <div className="flex items-center gap-4 md:gap-6">
                        <div className="w-16 h-16 md:w-20 md:h-20 bg-cream rounded-2xl md:rounded-[1.5rem] overflow-hidden group-hover:scale-105 transition-transform">
                          <OptimizedImage src={item.image} alt={item.name} className="w-full h-full object-cover" />
                        </div>
                        <div>
                          <p className="text-base md:text-lg font-black text-deep-charcoal italic tracking-tight">{item.name}</p>
                          <p className="text-[10px] font-bold text-cinnamon/60 uppercase tracking-widest mt-1">Batch #{item.id.slice(0, 4)} × {item.quantity}</p>
                        </div>
                      </div>
                      <p className="text-base md:text-xl font-black text-deep-charcoal italic tracking-tighter">₹{item.price * item.quantity}</p>
                    </div>
                  ))}
                </div>

                <div className="pt-8 border-t border-orange-50 space-y-4">
                  <div className="flex justify-between text-xs font-bold text-cinnamon/40 uppercase tracking-widest">
                    <span>Subtotal</span>
                    <span>₹{totalPrice}</span>
                  </div>
                  <div className="flex justify-between text-xs font-bold text-cinnamon/40 uppercase tracking-widest">
                    <span>Packaging & Express Delivery</span>
                    <span className="text-emerald-500 italic font-black">COMPLIMENTARY</span>
                  </div>
                  <div className="flex justify-between text-3xl md:text-4xl font-black text-deep-charcoal italic pt-4">
                    <span>Total</span>
                    <span className="text-chili">₹{totalPrice}</span>
                  </div>
                </div>
              </div>
            </section>

            <section className="space-y-6">
               <div className="flex items-center gap-3">
                  <div className="w-1.5 h-6 bg-saffron rounded-full" />
                  <h3 className="text-[11px] font-black text-deep-charcoal uppercase tracking-[0.3em]">Delivery To</h3>
               </div>
               <div className="bg-white rounded-[2.5rem] p-8 md:p-10 shadow-xl shadow-orange-500/5 border border-orange-50 relative group">
                  <div className="absolute top-8 right-8">
                     <button className="text-[10px] font-black text-chili uppercase tracking-widest border-b-2 border-chili/20 hover:border-chili transition-all">Change</button>
                  </div>
                  <div className="flex items-start gap-6">
                     <div className="w-14 h-14 bg-cream rounded-2xl flex items-center justify-center text-chili shrink-0">
                        <MapPin className="w-6 h-6" />
                     </div>
                     <div className="space-y-2">
                        <p className="text-lg font-black italic tracking-tight">Karan Singh</p>
                        <p className="text-sm font-medium text-cinnamon/60 italic leading-relaxed">
                          24A Baker Street, Mumbai Indigo Complex,<br/>Maharashtra, 400001
                        </p>
                        <p className="text-xs font-bold text-cinnamon tracking-[0.2em] pt-2">+91 98765 43210</p>
                     </div>
                  </div>
               </div>
            </section>
          </div>

          {/* Right: Payment - Desktop Sticky */}
          <div className="lg:col-span-5 space-y-8 lg:sticky lg:top-32">
            <section className="space-y-6">
              <div className="flex items-center gap-3">
                 <div className="w-1.5 h-6 bg-turmeric rounded-full" />
                 <h3 className="text-[11px] font-black text-deep-charcoal uppercase tracking-[0.3em]">Payment System</h3>
              </div>
              <div className="bg-white rounded-[3rem] p-8 md:p-12 shadow-2xl shadow-orange-500/10 border-2 border-deep-charcoal relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-chili/5 rounded-full -mr-16 -mt-16 blur-2xl" />
                
                <div className="space-y-10 relative z-10">
                   <div className="space-y-6">
                      <div className="flex items-center justify-between">
                         <div className="flex items-center gap-3">
                            <CreditCard className="w-5 h-5 text-deep-charcoal" />
                            <span className="text-[11px] font-black uppercase tracking-widest">Selected Mode</span>
                         </div>
                         <div className="px-3 py-1 bg-deep-charcoal text-white rounded-full text-[8px] font-black tracking-widest uppercase">Safe Zing Pay</div>
                      </div>

                      <div className="p-6 bg-cream/50 rounded-2xl flex items-center justify-between border border-orange-100 group cursor-pointer hover:bg-cream transition-colors">
                         <div className="flex items-center gap-4">
                            <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center shadow-sm">
                               <span className="text-2xl">🤝</span>
                            </div>
                            <div>
                               <p className="text-sm font-black italic tracking-tight">Pay on Delivery</p>
                               <p className="text-[10px] font-bold text-cinnamon/40 uppercase tracking-widest">UPI / Cash at doorstep</p>
                            </div>
                         </div>
                         <div className="w-6 h-6 rounded-full border-2 border-chili bg-white flex items-center justify-center">
                            <div className="w-2.5 h-2.5 rounded-full bg-chili" />
                         </div>
                      </div>
                   </div>

                   <div className="space-y-4">
                      <div className="flex items-center gap-4 p-4 bg-orange-50/50 rounded-2xl border border-orange-100/50">
                         <ShieldCheck className="w-5 h-5 text-chili" />
                         <span className="text-[10px] font-black uppercase tracking-widest text-cinnamon">100% Secure Checkout</span>
                      </div>
                      <div className="flex items-center gap-3 px-2">
                         <Truck className="w-4 h-4 text-emerald-500" />
                         <span className="text-[9px] font-black uppercase tracking-[0.2em] text-cinnamon/40">Ships in 24 hrs from artisan kitchen</span>
                      </div>
                   </div>

                   <button 
                     disabled={isOrdering}
                     onClick={handlePlaceOrder}
                     className="w-full bg-deep-charcoal text-white py-6 rounded-[2rem] font-black italic flex items-center justify-center gap-4 shadow-2xl hover:bg-chili transition-all active:scale-95 group relative overflow-hidden"
                   >
                     <AnimatePresence mode="wait">
                       {isOrdering ? (
                         <m.div 
                           key="loading"
                           initial={{ opacity: 0 }}
                           animate={{ opacity: 1 }}
                           className="flex items-center gap-2"
                         >
                            <div className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                            CONFIRMING...
                         </m.div>
                       ) : (
                         <m.div 
                           key="idle"
                           initial={{ opacity: 0 }}
                           animate={{ opacity: 1 }}
                           className="flex items-center gap-3"
                         >
                            CONFIRM JAR ORDER <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                         </m.div>
                       )}
                     </AnimatePresence>
                   </button>
                </div>
              </div>
            </section>
          </div>
        </div>
      </main>

      {/* Floating Sticky Mobile CTA */}
      <m.div 
        initial={{ y: 200 }}
        animate={{ y: 0 }}
        className="fixed bottom-0 inset-x-0 bg-white border-t border-orange-100 p-6 z-[60] lg:hidden"
      >
         <div className="max-w-md mx-auto flex items-center justify-between gap-6">
            <div className="flex flex-col">
               <span className="text-[10px] font-black text-cinnamon/40 uppercase tracking-widest">Order Total</span>
               <span className="text-3xl font-black italic tracking-tighter text-deep-charcoal">₹{totalPrice}</span>
            </div>
            <button 
               disabled={isOrdering}
               onClick={handlePlaceOrder}
               className="flex-1 py-5 bg-deep-charcoal text-white rounded-2xl font-black italic shadow-xl flex items-center justify-center gap-3 active:scale-95 transition-all text-sm"
            >
               {isOrdering ? "HANDLING..." : "PLACE ORDER"} <Sparkles className="w-4 h-4 text-saffron fill-saffron" />
            </button>
         </div>
      </m.div>

      {/* Success Overlay */}
      <AnimatePresence>
        {isOrdering && (
          <m.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="fixed inset-0 bg-deep-charcoal/95 backdrop-blur-2xl z-[200] flex flex-col items-center justify-center px-6 text-center space-y-8"
          >
             <m.div 
               initial={{ scale: 0, rotate: -45 }}
               animate={{ scale: 1, rotate: 0 }}
               transition={{ type: 'spring', damping: 10 }}
               className="w-32 h-32 bg-saffron rounded-[3rem] flex items-center justify-center text-6xl shadow-2xl shadow-saffron/20 rotate-12"
             >
                ✨
             </m.div>
             <div className="space-y-4">
                <h2 className="text-5xl md:text-7xl text-white italic">Order Zing!</h2>
                <p className="text-white/60 font-medium italic text-lg md:text-xl max-w-sm">Our artisans are firing up the ovens. Your batch of makhana will be ready soon.</p>
             </div>
             <div className="flex items-center gap-3 text-saffron font-black uppercase text-xs tracking-widest animate-pulse">
                <Check className="w-4 h-4" /> Redirecting to Home
             </div>
          </m.div>
        )}
      </AnimatePresence>
    </div>
  );
}
