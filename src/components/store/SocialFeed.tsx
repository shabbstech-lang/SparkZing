import { motion } from 'motion/react';
import { Instagram, Heart, MessageCircle, Share2 } from 'lucide-react';

const feedImages = [
  { url: 'https://images.unsplash.com/photo-1599490659223-23505c8106c1?q=80&w=2070&auto=format&fit=crop', size: 'col-span-1 row-span-2' },
  { url: 'https://images.unsplash.com/photo-1544022613-e87ca75a784a?q=80&w=2070&auto=format&fit=crop', size: 'col-span-1 row-span-1' },
  { url: 'https://images.unsplash.com/photo-1621939514649-280e2ee25f60?q=80&w=2070&auto=format&fit=crop', size: 'col-span-1 row-span-1' },
  { url: 'https://images.unsplash.com/photo-1600454021970-351feb4a503e?q=80&w=2070&auto=format&fit=crop', size: 'col-span-2 row-span-1' },
  { url: 'https://images.unsplash.com/photo-1590779033100-9f60a05a013d?q=80&w=2070&auto=format&fit=crop', size: 'col-span-1 row-span-2' },
];

export function SocialFeed() {
  return (
    <section className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-16 space-y-4">
           <div className="flex items-center justify-center gap-2 text-chili">
              <Instagram className="w-5 h-5" />
              <span className="text-xs font-black tracking-[0.4em] uppercase">Gram Worthy Zing</span>
           </div>
           <h2 className="text-4xl md:text-5xl font-black text-deep-charcoal italic tracking-tight">Join the Zing Society</h2>
           <p className="text-cinnamon/60 font-medium italic">Tag us @SparkZing for a chance to be featured!</p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 grid-rows-3 gap-4 h-[600px] md:h-[800px]">
          {feedImages.map((img, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className={`relative group overflow-hidden rounded-[2rem] shadow-xl ${img.size}`}
            >
              <img 
                src={img.url} 
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                alt="Social zing"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-deep-charcoal/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-6">
                 <div className="flex gap-4 text-white">
                    <div className="flex items-center gap-1 text-sm font-bold">
                       <Heart className="w-4 h-4 fill-white" /> 2.4k
                    </div>
                    <div className="flex items-center gap-1 text-sm font-bold">
                       <MessageCircle className="w-4 h-4" /> 182
                    </div>
                    <Share2 className="ml-auto w-4 h-4" />
                 </div>
              </div>
            </motion.div>
          ))}
        </div>

        <div className="mt-16 flex flex-wrap justify-center gap-12 grayscale opacity-40">
           {['Handmade', 'Vegan Friendly', 'Organic Spices', 'Artisan Made'].map((tag) => (
             <span key={tag} className="text-2xl font-black text-cinnamon italic tracking-tight">{tag}</span>
           ))}
        </div>
      </div>
    </section>
  );
}
