import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ShoppingCart, Heart, Share2, Star, ChevronLeft, ArrowRight, Sparkles, Coffee, ShieldCheck, Leaf } from 'lucide-react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { cn } from '@/lib/utils';

const snackDetails = {
  id: 'S1',
  name: 'Zesty Lime Peanuts',
  category: 'Handmade Special',
  price: 5.99,
  rating: 4.9,
  reviews: 124,
  description: 'Slow-roasted peanuts tossed in our secret Kerala lime and chili dust. A perfect balance of tangy, spicy, and nutty delight.',
  ingredients: ['Organic Peanuts', 'Cold-pressed Coconut Oil', 'Kerala Lime Dust', 'Birdseye Chili', 'Rock Salt'],
  nutrition: {
    calories: '160 kcal',
    protein: '7g',
    fiber: '3g',
    fats: '14g'
  },
  images: [
    'https://images.unsplash.com/photo-1599490659223-23505c8106c1?q=80&w=2070&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1544022613-e87ca75a784a?q=80&w=2070&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1621939514649-280e2ee25f60?q=80&w=2070&auto=format&fit=crop'
  ]
};

export function ProductDetails() {
  const navigate = useNavigate();
  const [activeImg, setActiveImg] = useState(0);
  const [isLiked, setIsLiked] = useState(false);

  return (
    <div className="bg-white min-h-screen pb-20 font-sans">
      {/* Product Header (Mobile Nav) */}
      <div className="fixed top-0 left-0 right-0 p-6 flex justify-between items-center z-50 mix-blend-difference invert">
         <button onClick={() => navigate(-1)} className="p-3 bg-white rounded-2xl shadow-xl text-black">
            <ChevronLeft className="w-6 h-6" />
         </button>
         <div className="flex gap-4">
            <button className="p-3 bg-white rounded-2xl shadow-xl text-black">
              <Share2 className="w-5 h-5" />
            </button>
            <button 
              onClick={() => setIsLiked(!isLiked)} 
              className={cn("p-3 bg-white rounded-2xl shadow-xl", isLiked ? "text-chili" : "text-black")}
            >
              <Heart className={cn("w-5 h-5", isLiked && "fill-chili")} />
            </button>
         </div>
      </div>

      <div className="lg:flex lg:h-screen lg:items-stretch">
        {/* Left: Gallery */}
        <div className="relative h-[60vh] lg:h-auto lg:flex-1 bg-cream overflow-hidden">
          <AnimatePresence mode="wait">
            <motion.img
              key={activeImg}
              src={snackDetails.images[activeImg]}
              initial={{ opacity: 0, scale: 1.1 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.6 }}
              className="w-full h-full object-cover"
              alt={snackDetails.name}
            />
          </AnimatePresence>
          
          <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex gap-3 p-3 bg-white/20 backdrop-blur-md rounded-2xl border border-white/30">
            {snackDetails.images.map((img, i) => (
              <button 
                key={i} 
                onClick={() => setActiveImg(i)}
                className={cn(
                  "w-12 h-12 rounded-xl overflow-hidden border-2 transition-all",
                  activeImg === i ? "border-saffron scale-110 shadow-lg" : "border-transparent opacity-50"
                )}
              >
                <img src={img} className="w-full h-full object-cover" />
              </button>
            ))}
          </div>
        </div>

        {/* Right: Info */}
        <div className="p-8 lg:p-16 lg:flex-1 lg:overflow-y-auto">
          <div className="max-w-[500px]">
             <div className="flex items-center gap-2 mb-4">
                <div className="flex text-turmeric">
                  {[...Array(5)].map((_, i) => <Star key={i} className="w-4 h-4 fill-turmeric" />)}
                </div>
                <span className="text-xs font-black text-cinnamon/60 uppercase tracking-widest">{snackDetails.reviews} Reviews</span>
             </div>

             <div className="space-y-2 mb-8">
                <span className="text-xs font-black text-spark-orange uppercase tracking-[0.3em]">{snackDetails.category}</span>
                <h1 className="text-5xl md:text-6xl font-black text-deep-charcoal italic leading-none tracking-tight">
                   {snackDetails.name}
                </h1>
                <p className="text-3xl font-black text-cinnamon mt-4">Rs. {snackDetails.price * 100}</p>
             </div>

             <p className="text-lg text-cinnamon/80 font-medium leading-relaxed mb-10">
               {snackDetails.description}
             </p>

             {/* Features */}
             <div className="grid grid-cols-3 gap-4 mb-12">
                {[
                  { icon: Leaf, label: 'Plant Based' },
                  { icon: Coffee, label: 'Artisanal' },
                  { icon: ShieldCheck, label: 'Zero Presv.' },
                ].map((feat, i) => (
                  <div key={i} className="flex flex-col items-center gap-2 p-4 bg-orange-50/50 rounded-2xl text-center">
                    <feat.icon className="w-5 h-5 text-saffron" />
                    <span className="text-[10px] font-black uppercase tracking-tighter text-cinnamon">{feat.label}</span>
                  </div>
                ))}
             </div>

             {/* Details Accordion style */}
             <div className="space-y-8 mb-12">
                <div>
                   <h3 className="text-xs font-black text-deep-charcoal uppercase tracking-widest mb-4">Inside the Pack</h3>
                   <div className="flex flex-wrap gap-2">
                      {snackDetails.ingredients.map(ing => (
                        <span key={ing} className="px-4 py-2 bg-cream rounded-full text-xs font-bold text-cinnamon/80">{ing}</span>
                      ))}
                   </div>
                </div>

                <div>
                   <h3 className="text-xs font-black text-deep-charcoal uppercase tracking-widest mb-4">Nutrition Profile (per 100g)</h3>
                   <div className="grid grid-cols-4 gap-4">
                      {Object.entries(snackDetails.nutrition).map(([key, val]) => (
                        <div key={key} className="p-3 border-2 border-orange-50 rounded-2xl flex flex-col items-center">
                          <span className="text-xs font-black text-deep-charcoal">{val}</span>
                          <span className="text-[8px] font-bold text-cinnamon uppercase opacity-60">{key}</span>
                        </div>
                      ))}
                   </div>
                </div>
             </div>

             {/* Similar Products */}
             <div className="pt-12 border-t border-orange-100 mb-12">
                <h3 className="text-xs font-black text-deep-charcoal uppercase tracking-widest mb-6">Similar Delights</h3>
                <div className="flex gap-4 overflow-x-auto pb-4 no-scrollbar">
                   {[1, 2, 3].map(i => (
                     <div key={i} className="min-w-[150px] bg-cream rounded-[2rem] p-4 flex flex-col gap-2">
                        <div className="aspect-square bg-white rounded-2xl" />
                        <div className="h-4 bg-orange-100 rounded-full w-3/4" />
                        <div className="h-3 bg-orange-100/50 rounded-full w-1/2" />
                     </div>
                   ))}
                </div>
             </div>
          </div>
        </div>
      </div>

      {/* Floating Add to Cart */}
      <div className="fixed bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-white via-white to-transparent z-40 lg:hidden">
         <button className="w-full bg-deep-charcoal text-white py-5 rounded-[2rem] font-black italic flex items-center justify-center gap-4 shadow-2xl shadow-gray-200">
            <ShoppingCart className="w-5 h-5" />
            ADD TO ZING BAG — Rs. {snackDetails.price * 100}
         </button>
      </div>
    </div>
  );
}
