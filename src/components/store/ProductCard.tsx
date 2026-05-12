import React, { useState } from 'react';
import { Plus, ShoppingCart, Star, Heart } from 'lucide-react';
import { motion } from 'motion/react';
import { cn } from '@/lib/utils';
import { Product } from '@/types';

interface ProductCardProps {
  product: Product;
  onAdd: (product: Product) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product, onAdd }) => {
  const [isLiked, setIsLiked] = useState(false);

  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-[2.5rem] p-6 shadow-xl border border-orange-50 flex flex-col gap-4 min-w-[280px] group relative overflow-hidden"
    >
      <div className="absolute top-4 right-4 z-20">
         <button 
           onClick={(e) => { e.stopPropagation(); setIsLiked(!isLiked); }}
           className={cn("p-3 rounded-2xl transition-all shadow-md", isLiked ? "bg-chili text-white" : "bg-white text-cinnamon")}
         >
           <Heart className={cn("w-4 h-4", isLiked && "fill-white")} />
         </button>
      </div>

      <div className="relative aspect-square bg-cream rounded-[2rem] flex items-center justify-center text-6xl group-hover:scale-105 transition-transform duration-500">
        <motion.div whileHover={{ scale: 1.2, rotate: 10 }}>
          {product.image}
        </motion.div>
        {product.isSeasonal && (
          <div className="absolute top-4 left-4 bg-saffron text-black px-4 py-1 rounded-full text-[10px] font-black uppercase tracking-widest shadow-lg">
            Limited
          </div>
        )}
      </div>

      <div className="flex-1 space-y-2">
        <div className="flex items-center gap-1 text-turmeric">
           {[...Array(5)].map((_, i) => <Star key={i} className="w-3 h-3 fill-turmeric" />)}
           <span className="text-[10px] text-cinnamon/60 font-bold ml-1">4.9</span>
        </div>
        <h4 className="text-xl font-black text-deep-charcoal leading-tight italic tracking-tight">{product.name}</h4>
        <p className="text-[10px] text-cinnamon font-bold uppercase tracking-widest opacity-60">{product.category}</p>
      </div>

      <div className="flex items-center justify-between mt-2 pt-4 border-t border-orange-50">
        <div className="flex flex-col">
           <span className="text-[10px] font-bold text-cinnamon/40 uppercase">Handmade</span>
           <span className="text-2xl font-black text-deep-charcoal italic">Rs. {product.price * 100}</span>
        </div>
        <motion.button 
          whileTap={{ scale: 0.9 }}
          onClick={(e) => { e.stopPropagation(); onAdd(product); }}
          className="bg-deep-charcoal text-white p-4 rounded-2xl shadow-xl hover:bg-chili transition-colors flex items-center justify-center group/btn"
        >
          <ShoppingCart className="w-5 h-5 group-hover/btn:scale-110 transition-transform" />
        </motion.button>
      </div>
    </motion.div>
  );
}
