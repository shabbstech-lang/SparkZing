import React, { useState } from 'react';
import { Plus, ShoppingCart, Star, Heart, Flame } from 'lucide-react';
import { m, AnimatePresence } from 'motion/react';
import { cn } from '@/lib/utils';
import { Product } from '@/types';
import { OptimizedImage } from '@/components/ui/OptimizedImage';

interface ProductCardProps {
  product: Product;
  onAdd: (product: Product) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product, onAdd }) => {
  const [isLiked, setIsLiked] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  return (
    <m.div 
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-[1.5rem] md:rounded-[2.5rem] p-3 md:p-6 shadow-xl hover:shadow-2xl hover:shadow-orange-500/10 border border-orange-50 flex flex-col gap-3 md:gap-4 group relative overflow-hidden h-full transition-all duration-500"
    >
      <div className="absolute top-2 right-2 md:top-4 md:right-4 z-20">
         <button 
           onClick={(e) => { e.stopPropagation(); setIsLiked(!isLiked); }}
           className={cn(
             "p-2 md:p-3 rounded-xl md:rounded-2xl transition-all shadow-md active:scale-90", 
             isLiked ? "bg-chili text-white" : "bg-white/80 backdrop-blur-md text-cinnamon hover:bg-white"
           )}
         >
           <Heart className={cn("w-3 h-3 md:w-4 md:h-4", isLiked && "fill-white")} />
         </button>
      </div>

      <div className="relative aspect-square rounded-[1rem] md:rounded-[2rem] overflow-hidden group-hover:scale-[1.02] transition-transform duration-700 bg-cream">
        <OptimizedImage 
          src={product.image} 
          alt={product.name}
          className="w-full h-full object-cover"
        />
        
        {/* Floating Labels */}
        <div className="absolute top-2 left-2 md:top-4 md:left-4 flex flex-col gap-1.5">
          {product.isSeasonal && (
            <div className="bg-saffron text-black px-2 md:px-3 py-1 rounded-full text-[8px] md:text-[10px] font-black uppercase tracking-widest shadow-lg flex items-center gap-1.5 backdrop-blur-sm">
              <span className="animate-pulse">✨</span> Limited
            </div>
          )}
          {product.isArtisanFavorite && (
            <div className="bg-deep-charcoal text-white px-2 md:px-3 py-1 rounded-full text-[8px] md:text-[10px] font-black uppercase tracking-widest shadow-lg flex items-center gap-1.5">
              <Flame className="w-2 md:w-3 h-2 md:h-3 text-saffron fill-saffron" /> Top Pick
            </div>
          )}
        </div>

        {/* Hover Action Blur */}
        <div className="absolute inset-x-0 bottom-0 p-4 translate-y-full group-hover:translate-y-0 transition-transform duration-500 hidden md:block">
           <div className="glass-dark rounded-2xl p-4 flex items-center justify-between">
              <span className="text-[10px] text-white/40 font-black uppercase">Small Batch</span>
              <span className="text-white text-xs font-black italic">Pure Zing</span>
           </div>
        </div>
      </div>

      <div className="flex-1 space-y-1 md:space-y-2 px-1">
        <div className="flex items-center gap-1 text-turmeric scale-75 md:scale-100 origin-left">
           {[...Array(5)].map((_, i) => <Star key={i} className="w-3 h-3 fill-turmeric" />)}
           <span className="text-[10px] text-cinnamon/60 font-black ml-1">4.9</span>
        </div>
        <h4 className="text-base md:text-xl font-black text-deep-charcoal leading-tight italic tracking-tight line-clamp-2">{product.name}</h4>
        <p className="text-[9px] md:text-[10px] text-cinnamon font-bold uppercase tracking-widest opacity-60 italic">{product.category}</p>
      </div>

      <div className="flex flex-col gap-2 md:gap-3 mt-auto pt-3 md:pt-4 border-t border-orange-50/50">
        <div className="flex items-center justify-between px-1">
           <span className="text-[9px] md:text-[10px] font-black text-cinnamon/40 uppercase tracking-widest hidden xs:block">Artisan Made</span>
           <span className="text-lg md:text-2xl font-black text-deep-charcoal italic tracking-tighter">₹{product.price}</span>
        </div>

        <m.button 
          whileTap={{ scale: 0.95 }}
          onClick={(e) => { e.stopPropagation(); onAdd(product); }}
          className="w-full py-3 md:py-4 bg-deep-charcoal text-white rounded-xl md:rounded-2xl font-black uppercase text-[10px] md:text-[11px] tracking-[0.2em] shadow-xl hover:bg-chili transition-all flex items-center justify-center gap-2 md:gap-3 group/btn relative overflow-hidden"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-white/10 to-transparent -translate-x-full group-hover/btn:translate-x-full transition-transform duration-700" />
          <ShoppingCart className="w-3 md:w-4 h-3 md:h-4 group-hover/btn:scale-110 transition-transform text-saffron fill-saffron" />
          <span className="relative z-10">Add to Jar</span>
        </m.button>
      </div>
    </m.div>
  );
}
