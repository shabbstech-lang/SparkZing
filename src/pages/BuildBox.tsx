import { useState, useEffect } from 'react';
import { m, AnimatePresence } from 'motion/react';
import { Sparkles, ArrowRight, ArrowLeft, Box, Check, Flame, Star, ShoppingBag, X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { StoreHeader } from '@/components/layout/StoreHeader';
import { BottomNav } from '@/components/store/BottomNav';
import { db } from '@/lib/firebase';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { Product } from '@/types';
import { useCart } from '@/contexts/CartContext';
import { cn } from '@/lib/utils';
import { OptimizedImage } from '@/components/ui/OptimizedImage';

const STEPS = [
  { id: 'flavor', title: 'Pick Your Flavors', subtitle: 'Choose any 6 snacks for your signature box' },
  { id: 'box', title: 'Selection Style', subtitle: 'Choose your signature box design' },
  { id: 'review', title: 'Review & Add', subtitle: 'Confirm your custom collection' }
];

const BOX_DESIGNS = [
  { id: 'royal', name: 'Royal Saffron', color: 'bg-saffron', emoji: '👑' },
  { id: 'midnight', name: 'Midnight Zing', color: 'bg-deep-charcoal', emoji: '🌙' },
  { id: 'spice', name: 'Spicy Crimson', color: 'bg-chili', emoji: '🔥' },
];

export function BuildBox() {
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const [currentStep, setCurrentStep] = useState(0);
  const [products, setProducts] = useState<Product[]>([]);
  const [selectedProducts, setSelectedProducts] = useState<Product[]>([]);
  const [selectedBox, setSelectedBox] = useState(BOX_DESIGNS[0]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchProducts() {
      try {
        const q = query(collection(db, 'products'), where('status', '==', 'Active'));
        const snapshot = await getDocs(q);
        const list = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as Product[];
        setProducts(list);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    }
    fetchProducts();
  }, []);

  const toggleProduct = (product: Product) => {
    if (selectedProducts.find(p => p.id === product.id)) {
      setSelectedProducts(selectedProducts.filter(p => p.id !== product.id));
    } else {
      if (selectedProducts.length < 6) {
        setSelectedProducts([...selectedProducts, product]);
      }
    }
  };

  const handleFinish = () => {
    // Treat the box as a single bundle or add individual items
    // For simplicity, we add individual items and a custom "Box" fee/item if needed.
    // Here we'll just add selected products and navigate.
    selectedProducts.forEach(p => addToCart(p));
    navigate('/checkout');
  };

  const step = STEPS[currentStep];

  return (
    <div className="bg-cream min-h-screen pb-32">
      <StoreHeader />

      <main className="max-w-7xl mx-auto px-6 py-12 md:py-20">
        {/* Progress Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-12 gap-8">
           <div className="space-y-2">
              <span className="text-[10px] font-black uppercase tracking-[0.4em] text-cinnamon">Step {currentStep + 1} of 3</span>
              <h2 className="text-4xl md:text-6xl font-black italic tracking-tighter text-deep-charcoal">{step.title}</h2>
              <p className="text-sm font-medium text-cinnamon/60 italic">{step.subtitle}</p>
           </div>
           
           <div className="flex gap-2">
             {STEPS.map((_, i) => (
               <div 
                 key={i} 
                 className={cn(
                   "h-1.5 rounded-full transition-all duration-500",
                   i === currentStep ? "w-12 bg-chili" : i < currentStep ? "w-6 bg-saffron" : "w-6 bg-white border border-orange-100"
                 )}
               />
             ))}
           </div>
        </div>

        <section className="relative">
          <AnimatePresence mode="wait">
            {currentStep === 0 && (
              <m.div 
                key="step-0"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-12"
              >
                 {loading ? (
                   <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-6">
                      {[...Array(12)].map((_, i) => (
                        <div key={i} className="aspect-square bg-white/50 rounded-3xl animate-pulse" />
                      ))}
                   </div>
                 ) : (
                   <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4 md:gap-6">
                      {products.map((product) => {
                        const isSelected = selectedProducts.find(p => p.id === product.id);
                        return (
                          <m.div
                            key={product.id}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => toggleProduct(product)}
                            className={cn(
                              "relative aspect-square rounded-[2rem] p-4 flex flex-col items-center justify-center cursor-pointer transition-all border-2",
                              isSelected ? "bg-white border-chili shadow-xl" : "bg-white/50 border-transparent hover:bg-white"
                            )}
                          >
                             <div className="absolute top-3 right-3">
                                <div className={cn(
                                  "w-6 h-6 rounded-full flex items-center justify-center transition-colors",
                                  isSelected ? "bg-chili text-white" : "bg-orange-50 text-transparent"
                                )}>
                                   <Check className="w-3 h-3" />
                                </div>
                             </div>
                             <div className="w-20 md:w-24 aspect-square mb-3">
                                <OptimizedImage src={product.image} alt={product.name} className="w-full h-full object-cover rounded-2xl" />
                             </div>
                             <h4 className="text-[10px] md:text-xs font-black text-center uppercase tracking-tighter line-clamp-1">{product.name}</h4>
                             <span className="text-[8px] font-bold text-cinnamon/60 tracking-widest mt-1">₹{product.price}</span>
                          </m.div>
                        );
                      })}
                   </div>
                 )}
              </m.div>
            )}

            {currentStep === 1 && (
              <m.div 
                key="step-1"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="grid grid-cols-1 md:grid-cols-3 gap-8"
              >
                 {BOX_DESIGNS.map((design) => (
                   <m.div
                     key={design.id}
                     whileHover={{ y: -10 }}
                     onClick={() => setSelectedBox(design)}
                     className={cn(
                       "p-12 rounded-[3.5rem] border-4 cursor-pointer transition-all text-center space-y-6 flex flex-col items-center",
                       selectedBox.id === design.id ? "bg-white border-chili shadow-2xl" : "bg-white/50 border-transparent"
                     )}
                   >
                      <div className={cn("w-24 h-24 rounded-3xl flex items-center justify-center text-5xl shadow-xl", design.color)}>
                         {design.emoji}
                      </div>
                      <h3 className="text-2xl font-black italic">{design.name}</h3>
                      <p className="text-xs font-bold text-cinnamon/60 uppercase tracking-widest">Premium Matte Finish</p>
                   </m.div>
                 ))}
              </m.div>
            )}

            {currentStep === 2 && (
              <m.div 
                key="step-2"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="max-w-2xl mx-auto glass-dark p-8 md:p-12 rounded-[3rem] text-white space-y-10"
              >
                 <div className="flex items-center gap-6">
                    <div className={cn("w-20 h-20 rounded-2xl flex items-center justify-center text-4xl", selectedBox.color)}>
                       {selectedBox.emoji}
                    </div>
                    <div>
                       <h3 className="text-2xl italic tracking-tighter">The {selectedBox.name} Collection</h3>
                       <p className="text-white/40 font-bold uppercase text-[10px] tracking-widest">Hand-picked Artisan Selection</p>
                    </div>
                 </div>

                 <div className="grid grid-cols-3 gap-4">
                    {selectedProducts.map(p => (
                      <div key={p.id} className="bg-white/5 rounded-2xl p-4 flex flex-col items-center gap-2 border border-white/10 group">
                         <div className="w-12 h-12">
                            <OptimizedImage src={p.image} alt={p.name} className="w-full h-full object-cover rounded-xl" />
                         </div>
                         <span className="text-[8px] font-black uppercase text-center text-white/60 truncate w-full">{p.name}</span>
                      </div>
                    ))}
                 </div>

                 <div className="pt-8 border-t border-white/10 flex items-center justify-between">
                    <div>
                      <p className="text-white/40 text-[10px] font-black uppercase tracking-widest">Total Value</p>
                      <p className="text-4xl font-black italic text-saffron">₹{selectedProducts.reduce((sum, p) => sum + p.price, 0)}</p>
                    </div>
                    <button 
                      onClick={handleFinish}
                      className="px-10 py-5 bg-chili text-white rounded-2xl font-black italic tracking-tight hover:brightness-110 shadow-2xl active:scale-95 transition-all"
                    >
                       Confirm Selection
                    </button>
                 </div>
              </m.div>
            )}
          </AnimatePresence>
        </section>
      </main>

      {/* Floating Sticky Footer for Mobile Selection */}
      {selectedProducts.length > 0 && currentStep === 0 && (
        <m.div 
          initial={{ y: 100 }}
          animate={{ y: 0 }}
          className="fixed bottom-0 md:bottom-28 inset-x-0 md:inset-x-6 z-[80]"
        >
          <div className="max-w-4xl mx-auto glass-dark md:rounded-3xl p-6 md:p-8 flex items-center justify-between shadow-2xl border-t border-white/10 md:border">
             <div className="flex items-center gap-4">
                <div className="hidden sm:flex -space-x-4">
                   {selectedProducts.slice(0, 3).map(p => (
                     <div key={p.id} className="w-12 h-12 rounded-full border-4 border-deep-charcoal bg-white overflow-hidden shadow-lg">
                        <OptimizedImage src={p.image} alt={p.name} className="w-full h-full object-cover" />
                     </div>
                   ))}
                </div>
                <div>
                   <p className="text-white font-black italic text-sm md:text-base">{selectedProducts.length}/6 Snacks Selected</p>
                   <p className="text-white/40 text-[10px] font-bold uppercase tracking-widest">{6 - selectedProducts.length} more to unlock signature box</p>
                </div>
             </div>
             
             <button 
               disabled={selectedProducts.length < 6}
               onClick={() => setCurrentStep(1)}
               className={cn(
                 "px-8 py-4 rounded-xl md:rounded-2xl font-black italic tracking-tight transition-all flex items-center gap-2",
                 selectedProducts.length === 6 ? "bg-saffron text-black shadow-lg" : "bg-white/10 text-white/20 cursor-not-allowed"
               )}
             >
                NEXT STEP <ArrowRight className="w-4 h-4" />
             </button>
          </div>
        </m.div>
      )}

      {/* Navigation Buttons for step 1 & 2 */}
      {currentStep > 0 && (
        <div className="fixed bottom-0 md:bottom-28 inset-x-6 flex justify-center z-[80] pointer-events-none">
          <div className="max-w-4xl w-full flex justify-between pointer-events-auto">
             <button 
               onClick={() => setCurrentStep(currentStep - 1)}
               className="p-5 bg-white rounded-2xl shadow-xl border border-orange-50 text-deep-charcoal hover:text-chili transition-all active:scale-90"
             >
                <ArrowLeft className="w-6 h-6" />
             </button>
             
             {currentStep === 1 && (
               <button 
                 onClick={() => setCurrentStep(2)}
                 className="px-10 py-5 bg-deep-charcoal text-white rounded-2xl font-black italic tracking-tight shadow-xl hover:bg-chili transition-all active:scale-95 flex items-center gap-3"
               >
                  REVIEW BOX <ArrowRight className="w-5 h-5" />
               </button>
             )}
          </div>
        </div>
      )}

    </div>
  );
}
