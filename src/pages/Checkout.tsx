import { useNavigate } from 'react-router-dom';
import { m } from 'motion/react';
import { CreditCard, ChevronLeft, ShieldCheck, Truck, Clock } from 'lucide-react';
import { useCart } from '@/contexts/CartContext';

export function Checkout() {
  const navigate = useNavigate();
  const { totalPrice, items, clearCart } = useCart();

  const handlePlaceOrder = () => {
    alert("Order placed successfully! Thank you for choosing Spark Zing.");
    clearCart();
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-slate-50 font-sans">
      <header className="bg-white border-b border-slate-200 px-6 py-6 font-sans">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-xs font-black text-slate-400 uppercase tracking-widest hover:text-spark-orange transition-colors">
            <ChevronLeft className="w-4 h-4" /> Back to Store
          </button>
          <div className="flex flex-col items-center">
            <h1 className="text-xl font-black text-deep-charcoal italic tracking-tight uppercase leading-none">Checkout</h1>
            <span className="text-[8px] font-black text-slate-400 tracking-[0.4em] uppercase mt-1">Artisanal Direct</span>
          </div>
          <div className="w-20" /> {/* Spacer */}
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-6 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Left: Summary */}
          <div className="space-y-8">
            <section>
              <h3 className="text-xs font-black text-slate-400 uppercase tracking-[0.3em] mb-6">Order Summary</h3>
              <div className="bg-white rounded-[2rem] p-8 shadow-sm border border-slate-200 space-y-6">
                {items.map(item => (
                  <div key={item.id} className="flex justify-between items-center">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-cream rounded-xl overflow-hidden">
                        <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                      </div>
                      <div>
                        <p className="text-sm font-black text-deep-charcoal italic">{item.name}</p>
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Qty: {item.quantity}</p>
                      </div>
                    </div>
                    <p className="text-sm font-black text-deep-charcoal">Rs. {item.price * item.quantity}</p>
                  </div>
                ))}

                <div className="pt-6 border-t border-slate-100 space-y-3">
                  <div className="flex justify-between text-xs font-bold text-slate-400 uppercase tracking-widest">
                    <span>Subtotal</span>
                    <span>Rs. {totalPrice}</span>
                  </div>
                  <div className="flex justify-between text-xs font-bold text-slate-400 uppercase tracking-widest">
                    <span>Shipping</span>
                    <span className="text-emerald-500 italic">FREE</span>
                  </div>
                  <div className="flex justify-between text-xl font-black text-deep-charcoal italic pt-2">
                    <span>Total</span>
                    <span>Rs. {totalPrice}</span>
                  </div>
                </div>
              </div>
            </section>

            <div className="bg-orange-50 rounded-[2rem] p-6 flex items-start gap-4 border border-orange-100">
               <ShieldCheck className="w-6 h-6 text-spark-orange" />
               <div>
                  <p className="text-xs font-black text-deep-charcoal uppercase tracking-widest mb-1">Authenticity Guaranteed</p>
                  <p className="text-[10px] font-medium text-cinnamon/60 leading-relaxed">Each batch is handmade to order. Quality takes time, but your crunch is worth the wait.</p>
               </div>
            </div>
          </div>

          {/* Right: Payment */}
          <div className="space-y-8">
            <section>
              <h3 className="text-xs font-black text-slate-400 uppercase tracking-[0.3em] mb-6">Payment Method</h3>
              <div className="bg-white rounded-[2rem] p-8 shadow-sm border border-slate-200 space-y-6">
                <div className="p-6 border-2 border-spark-orange bg-orange-50/30 rounded-2xl flex items-center justify-between">
                   <div className="flex items-center gap-4">
                      <CreditCard className="w-6 h-6 text-spark-orange" />
                      <div>
                         <p className="text-xs font-black text-deep-charcoal uppercase tracking-widest">Pay on Delivery</p>
                         <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Cash or UPI at Doorstep</p>
                      </div>
                   </div>
                   <div className="w-5 h-5 rounded-full border-4 border-spark-orange bg-white flex items-center justify-center">
                      <div className="w-1.5 h-1.5 rounded-full bg-spark-orange" />
                   </div>
                </div>

                <div className="space-y-4">
                   <div className="flex items-center gap-3 text-slate-400">
                      <Truck className="w-4 h-4" />
                      <span className="text-[10px] font-bold uppercase tracking-widest">Standard Shipping (2-4 Days)</span>
                   </div>
                   <div className="flex items-center gap-3 text-slate-400">
                      <Clock className="w-4 h-4" />
                      <span className="text-[10px] font-bold uppercase tracking-widest">Freshly Packed Guarantee</span>
                   </div>
                </div>

                <button 
                  onClick={handlePlaceOrder}
                  className="w-full bg-deep-charcoal text-white py-5 rounded-[2rem] font-black italic flex items-center justify-center gap-3 shadow-2xl hover:bg-chili transition-all group"
                >
                  PLACE ORDER <CreditCard className="w-5 h-5 transition-transform group-hover:translate-x-1" />
                </button>
              </div>
            </section>
          </div>
        </div>
      </main>
    </div>
  );
}
