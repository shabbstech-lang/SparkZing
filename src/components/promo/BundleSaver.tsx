import { ShoppingCart, Sparkles, Plus } from 'lucide-react';
import { motion } from 'motion/react';
import { cn } from '@/lib/utils';

export function BundleSaver() {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-cream border-2 border-orange-100 rounded-[3rem] p-8 md:p-12 shadow-xl relative overflow-hidden group hover:border-saffron/30 transition-all"
    >
      {/* Save Badge */}
      <div className="absolute -top-1 -right-1 bg-chili text-white px-6 py-4 font-black rounded-bl-[2rem] shadow-lg z-20 flex flex-col items-center leading-none">
        <span className="text-[10px] opacity-80 uppercase tracking-widest">Save</span>
        <span className="text-2xl mt-1 italic">Rs. 150</span>
      </div>

      <div className="flex flex-col lg:flex-row gap-12 items-center">
        {/* Overlapping Images */}
        <div className="flex scale-110 md:scale-125 lg:scale-110">
          {[
            { img: '🥔', color: 'bg-white', rotate: '-rotate-12', x: '0' },
            { img: '🥜', color: 'bg-orange-50', rotate: 'rotate-0', x: '-translate-x-8' },
            { img: '🥭', color: 'bg-white', rotate: 'rotate-12', x: '-translate-x-16' },
          ].map((item, i) => (
            <div 
              key={i}
              className={cn(
                "w-24 h-24 rounded-[2rem] border-4 border-white shadow-2xl flex items-center justify-center text-4xl transition-transform group-hover:scale-110",
                item.color,
                item.rotate,
                item.x,
                "relative z-" + (10 - i)
              )}
            >
              {item.img}
            </div>
          ))}
        </div>

        <div className="flex-1 text-center lg:text-left space-y-4">
          <div className="flex items-center gap-3 justify-center lg:justify-start">
            <Sparkles className="w-6 h-6 text-saffron" />
            <h3 className="text-3xl md:text-4xl font-black text-deep-charcoal italic tracking-tight uppercase">Triple Zing Bundle</h3>
          </div>
          <p className="text-lg text-cinnamon/60 font-medium max-w-xl mx-auto lg:mx-0">
            The ultimate explorer's collection. Hand-roasted Spicy Chips, Ghee Almonds, and Sun-dried Mango. 
          </p>

          <button className="w-full lg:w-auto px-12 py-5 bg-deep-charcoal hover:bg-chili text-white rounded-[2rem] font-black italic text-sm flex items-center justify-center gap-4 transition-all shadow-2xl shadow-gray-200 active:scale-95 group/btn relative overflow-hidden">
            <ShoppingCart className="w-5 h-5" />
            <span>ONE-CLICK ADD BUNDLE</span>
            <div className="bg-white/20 px-3 py-1 rounded-full text-[10px] font-bold">
              Rs. 850
            </div>
          </button>
        </div>
      </div>

      {/* Decorative background element */}
      <div className="absolute -bottom-12 -left-12 w-64 h-64 bg-saffron/5 rounded-full blur-3xl -z-10" />
    </motion.div>
  );
}
