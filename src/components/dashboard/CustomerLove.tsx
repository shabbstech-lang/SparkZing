import { motion } from 'motion/react';
import { Star, BadgeCheck, Quote } from 'lucide-react';
import { cn } from '@/lib/utils';

const reviews = [
  { name: 'Marcus', rating: 5, text: "The Spicy Cassava Chips are life-changing. I can't stop eating them!", date: '2 days ago' },
  { name: 'Sarah', rating: 5, text: 'Finally, a snack that feels healthy but tastes like a cheat meal. 10/10.', date: '1 week ago' },
  { name: 'Leo', rating: 5, text: 'The Honey Roasted Almonds are the perfect balance of sweet and savory.', date: '3 days ago' },
  { name: 'Elena', rating: 5, text: 'The packaging is beautiful and the snacks are even better. Handmade quality shows!', date: '5 days ago' },
  { name: 'David', rating: 5, text: 'Perfect for my hiking trips. High energy and great flavor.', date: 'Yesterday' },
  { name: 'Maya', rating: 5, text: 'The Berry Blast bundle is a family favorite. Everyone loves it!', date: '6 days ago' },
];

export function CustomerLove() {
  // Duplicate for seamless loop
  const marqueeItems = [...reviews, ...reviews, ...reviews];

  return (
    <div className="bg-white border border-slate-200 rounded-2xl p-8 shadow-sm overflow-hidden mt-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h3 className="text-xl font-bold text-slate-800 flex items-center gap-2">
            Customer Love
            <span className="text-spark-orange">❤</span>
          </h3>
          <p className="text-xs text-slate-500 font-medium">Real testimonials from our snack-loving community.</p>
        </div>
        <div className="flex items-center gap-1">
          {[...Array(5)].map((_, i) => (
            <Star key={i} className="w-4 h-4 fill-spark-orange text-spark-orange" />
          ))}
          <span className="ml-2 text-sm font-bold text-slate-700">4.9/5 Rating</span>
        </div>
      </div>

      <div className="relative">
        {/* Fades for smooth edge transition */}
        <div className="absolute left-0 top-0 bottom-0 w-24 bg-gradient-to-r from-white to-transparent z-10" />
        <div className="absolute right-0 top-0 bottom-0 w-24 bg-gradient-to-l from-white to-transparent z-10" />

        <motion.div
          animate={{ x: [0, -2000] }}
          transition={{
            duration: 40,
            repeat: Infinity,
            ease: 'linear',
          }}
          className="flex gap-6 w-max py-4"
        >
          {marqueeItems.map((review, i) => (
            <div
              key={i}
              className="w-80 bg-orange-50/50 hover:bg-orange-50 border border-orange-100/50 rounded-2xl p-6 shadow-sm transition-all group flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-bold text-slate-800">{review.name}</span>
                    <div className="flex items-center gap-1 px-1.5 py-0.5 bg-emerald-50 text-emerald-600 rounded text-[9px] font-bold uppercase tracking-wider">
                      <BadgeCheck className="w-3 h-3" />
                      Verified
                    </div>
                  </div>
                  <Quote className="w-4 h-4 text-orange-200 group-hover:text-spark-orange transition-colors" />
                </div>
                <div className="flex gap-0.5 mb-3">
                  {[...Array(review.rating)].map((_, i) => (
                    <Star key={i} className="w-3 h-3 fill-spark-orange text-spark-orange" />
                  ))}
                </div>
                <p className="text-sm text-slate-600 italic leading-relaxed">
                  "{review.text}"
                </p>
              </div>
              <div className="mt-4 pt-4 border-t border-orange-100/50">
                <span className="text-[10px] font-medium text-slate-400">{review.date}</span>
              </div>
            </div>
          ))}
        </motion.div>
      </div>
    </div>
  );
}
