import React, { useState } from 'react';
import { Plus, ShoppingCart, Star, Heart } from 'lucide-react';
import { motion } from 'motion/react';
import { cn } from '@/lib/utils';
import { Product } from '@/types';
import { OptimizedImage } from '@/components/ui/OptimizedImage';

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
      className="bg-white rounded-[2.5rem] p-6 shadow-xl border border-orange-50 flex flex-col gap-4 group relative overflow-hidden h-full"
    >
      <div className="absolute top-4 right-4 z-20">
         <button 
           onClick={(e) => { e.stopPropagation(); setIsLiked(!isLiked); }}
           className={cn("p-3 rounded-2xl transition-all shadow-md", isLiked ? "bg-chili text-white" : "bg-white text-cinnamon")}
         >
           <Heart className={cn("w-4 h-4", isLiked && "fill-white")} />
         </button>
      </div>

      <div className="relative aspect-square rounded-[2rem] overflow-hidden group-hover:scale-105 transition-transform duration-500">
        <OptimizedImage 
          src={product.image} 
          alt={product.name}
          className="w-full h-full"
        />
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

      <div className="flex flex-col gap-3 mt-auto pt-4 border-t border-orange-50">
        <div className="flex flex-col gap-2">
          <div className="flex items-center justify-between px-1 mb-1">
             <span className="text-[10px] font-black text-cinnamon/40 uppercase tracking-widest">Handcrafted</span>
             <span className="text-xl font-black text-deep-charcoal italic tracking-tight">Rs. {product.price}</span>
          </div>

          <motion.button 
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={(e) => { e.stopPropagation(); onAdd(product); }}
            className="w-full py-4 bg-deep-charcoal text-white rounded-2xl font-black uppercase text-[11px] tracking-[0.2em] shadow-xl hover:bg-chili transition-all flex items-center justify-center gap-3 group/btn"
          >
            <ShoppingCart className="w-4 h-4 group-hover/btn:scale-110 transition-transform text-saffron" />
            Add to Cart
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
}
