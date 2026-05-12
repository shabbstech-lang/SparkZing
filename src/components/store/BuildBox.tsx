import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Plus, Minus, Package, ArrowRight, Sparkles, Trash2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Product } from '@/types';

const BOX_SIZE = 6;

const availableSnacks: Product[] = [
  { id: 'bx1', name: 'Zesty Chips', category: 'Chips', price: 0, stock: 100, status: 'Active', image: '🥔' },
  { id: 'bx2', name: 'Honey Almonds', category: 'Nuts', price: 0, stock: 100, status: 'Active', image: '🥜' },
  { id: 'bx3', name: 'Mango Slices', category: 'Fruits', price: 0, stock: 100, status: 'Active', image: '🥭' },
  { id: 'bx4', name: 'Grain Crackers', category: 'Crunch', price: 0, stock: 100, status: 'Active', image: '🥨' },
  { id: 'bx5', name: 'Spicy Peas', category: 'Crunch', price: 0, stock: 100, status: 'Active', image: '🟢' },
  { id: 'bx6', name: 'Cocoa Bites', category: 'Sweet', price: 0, stock: 100, status: 'Active', image: '🍫' },
];

export function BuildBox() {
  const [selectedSnacks, setSelectedSnacks] = useState<Product[]>([]);

  const addSnack = (snack: Product) => {
    if (selectedSnacks.length < BOX_SIZE) {
      setSelectedSnacks([...selectedSnacks, snack]);
    }
  };

  const removeSnack = (index: number) => {
    const newSnacks = [...selectedSnacks];
    newSnacks.splice(index, 1);
    setSelectedSnacks(newSnacks);
  };

  const progress = (selectedSnacks.length / BOX_SIZE) * 100;

  return (
    <div className="bg-cream border border-orange-100 rounded-[3rem] p-8 md:p-12 shadow-2xl relative overflow-hidden">
      <div className="absolute top-0 right-0 w-64 h-64 bg-turmeric/10 rounded-full blur-3xl -z-10" />
      <div className="absolute bottom-0 left-0 w-64 h-64 bg-chili/5 rounded-full blur-3xl -z-10" />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
        {/* Left: Interactive Box Preview */}
        <div className="space-y-8">
          <div className="text-center md:text-left">
            <div className="flex items-center gap-2 mb-2 justify-center md:justify-start">
              <Sparkles className="w-5 h-5 text-saffron" />
              <span className="text-[10px] font-black uppercase tracking-[0.3em] text-cinnamon">Artisan Experience</span>
            </div>
            <h2 className="text-4xl md:text-5xl font-black text-deep-charcoal italic tracking-tight">Build Your Box</h2>
            <p className="text-cinnamon/70 font-medium mt-2 max-w-sm">Mix and match {BOX_SIZE} of your favorite handmade snacks.</p>
          </div>

          <div className="relative aspect-square max-w-[400px] mx-auto lg:mx-0">
            {/* The Box Graphic */}
            <div className="absolute inset-0 bg-white border-4 border-orange-100 rounded-[2.5rem] shadow-inner flex items-center justify-center p-8">
              <div className="grid grid-cols-3 grid-rows-2 gap-4 w-full h-full">
                {[...Array(BOX_SIZE)].map((_, i) => (
                  <div 
                    key={i} 
                    className={cn(
                      "rounded-2xl border-2 border-dashed border-orange-100 flex items-center justify-center text-4xl relative group transition-all",
                      selectedSnacks[i] ? "border-solid bg-orange-50/50 scale-105" : "hover:border-saffron/50"
                    )}
                  >
                    <AnimatePresence mode="wait">
                      {selectedSnacks[i] ? (
                        <motion.div
                          key={selectedSnacks[i].id + i}
                          initial={{ scale: 0, rotate: -20 }}
                          animate={{ scale: 1, rotate: 0 }}
                          exit={{ scale: 0 }}
                          className="relative"
                        >
                          {selectedSnacks[i].image}
                          <button 
                            onClick={() => removeSnack(i)}
                            className="absolute -top-6 -right-6 p-1.5 bg-chili text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                          >
                            <Trash2 className="w-3 h-3" />
                          </button>
                        </motion.div>
                      ) : (
                        <Package className="w-6 h-6 text-orange-200" />
                      )}
                    </AnimatePresence>
                  </div>
                ))}
              </div>
            </div>
            
            {/* Floating particles */}
            <motion.div 
               animate={{ y: [0, -10, 0], rotate: [0, 5, 0] }}
               transition={{ duration: 4, repeat: Infinity }}
               className="absolute -top-4 -right-4 text-4xl"
            >
              ✨
            </motion.div>
          </div>

          <div className="space-y-4">
            <div className="flex justify-between items-end">
              <span className="text-sm font-black text-deep-charcoal italic uppercase">Your Box Progress</span>
              <span className="text-2xl font-black text-saffron">{selectedSnacks.length} <span className="text-xs text-cinnamon/50">/ {BOX_SIZE}</span></span>
            </div>
            <div className="h-4 bg-orange-100/50 rounded-full overflow-hidden p-1 shadow-inner border border-orange-200">
              <motion.div 
                className="h-full bg-gradient-to-r from-saffron to-spark-orange rounded-full"
                initial={{ width: 0 }}
                animate={{ width: `${progress}%` }}
              />
            </div>
          </div>
        </div>

        {/* Right: Snack Selection Area */}
        <div className="bg-white/80 backdrop-blur-md rounded-[2.5rem] p-6 md:p-8 border border-white shadow-xl flex flex-col h-full max-h-[600px]">
          <div className="mb-6 flex justify-between items-center">
            <h3 className="font-black text-deep-charcoal uppercase tracking-widest text-xs">Select Your Snacks</h3>
            <span className="text-[10px] bg-turmeric/20 text-cinnamon px-2 py-1 rounded font-bold uppercase">Fresh Batch</span>
          </div>

          <div className="flex-1 overflow-y-auto space-y-3 pr-2 scrollbar-hide no-scrollbar">
            {availableSnacks.map((snack) => (
              <button
                key={snack.id}
                onClick={() => addSnack(snack)}
                disabled={selectedSnacks.length >= BOX_SIZE}
                className={cn(
                  "w-full p-4 rounded-2xl flex items-center justify-between transition-all group",
                  selectedSnacks.length >= BOX_SIZE ? "opacity-50 grayscale cursor-not-allowed" : "hover:bg-orange-50 hover:scale-[1.02] border border-transparent hover:border-saffron/20"
                )}
              >
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-white rounded-xl shadow-sm flex items-center justify-center text-2xl group-hover:rotate-12 transition-transform">
                    {snack.image}
                  </div>
                  <div className="text-left">
                    <p className="text-sm font-bold text-deep-charcoal uppercase italic tracking-tight">{snack.name}</p>
                    <p className="text-[10px] text-cinnamon font-medium leading-none">{snack.category}</p>
                  </div>
                </div>
                <div className="p-2 bg-saffron/10 text-saffron rounded-xl group-hover:bg-saffron group-hover:text-white transition-all">
                  <Plus className="w-4 h-4" />
                </div>
              </button>
            ))}
          </div>

          <div className="mt-8 pt-6 border-t border-orange-100">
             <button 
                disabled={selectedSnacks.length < BOX_SIZE}
                className={cn(
                  "w-full py-5 rounded-[2rem] font-black text-white shadow-xl flex items-center justify-center gap-3 transition-all transform active:scale-95 group overflow-hidden relative",
                  selectedSnacks.length < BOX_SIZE ? "bg-slate-300 cursor-not-allowed" : "bg-deep-charcoal hover:shadow-saffron/30"
                )}
             >
                <div className="absolute inset-0 bg-spark-orange translate-y-full group-hover:translate-y-0 transition-transform duration-500 -z-10" />
                <ArrowRight className="w-5 h-5 group-hover:translate-x-2 transition-transform" />
                <span>COMPLETE MY EXPLORER BOX</span>
                <span className="bg-white/20 px-3 py-1 rounded-full text-xs">Rs. 999</span>
             </button>
          </div>
        </div>
      </div>
    </div>
  );
}
