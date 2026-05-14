import { motion } from 'motion/react';
import { Quote, Heart, Sparkles } from 'lucide-react';

export function MakersStory() {
  return (
    <section id="our-story" className="py-24 bg-cream relative overflow-hidden">
      <div className="absolute top-0 right-0 w-96 h-96 bg-saffron/5 rounded-full blur-[100px] -z-10" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-chili/5 rounded-full blur-[100px] -z-10" />

      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          {/* Visual Side */}
          <div className="relative">
             <motion.div 
               initial={{ opacity: 0, x: -50 }}
               whileInView={{ opacity: 1, x: 0 }}
               viewport={{ once: true }}
               className="relative z-10"
             >
               <img 
                 src="https://images.unsplash.com/photo-1556910103-1c02745aae4d?q=80&w=2070&auto=format&fit=crop" 
                 alt="The Artisan at work" 
                 className="rounded-[3rem] shadow-2xl object-cover aspect-[4/5]"
               />
               
               {/* Floating elements */}
               <div className="absolute -right-8 -bottom-8 bg-white p-8 rounded-[2rem] shadow-xl border border-orange-50 max-w-[240px] hidden md:block">
                  <div className="flex items-center gap-2 mb-3">
                    <Heart className="w-4 h-4 text-chili fill-chili" />
                    <span className="text-[10px] font-black uppercase tracking-widest text-cinnamon">Our Promise</span>
                  </div>
                  <p className="text-sm font-medium text-deep-charcoal italic italic">
                    "Every pinch of spice is measured by hand, and every batch is tasted for the perfect zing."
                  </p>
               </div>
             </motion.div>

             <motion.div 
                animate={{ rotate: [0, 10, 0] }}
                transition={{ duration: 10, repeat: Infinity, ease: 'linear' }}
                className="absolute -left-12 -top-12 w-48 h-48 border-4 border-dashed border-orange-100 rounded-full -z-10"
             />
             <div className="absolute -right-12 top-24 text-8xl opacity-10">🌶️</div>
          </div>

          {/* Content Side */}
          <div className="space-y-8">
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-saffron" />
                <span className="text-xs font-black uppercase tracking-[0.4em] text-cinnamon opacity-60">From the Maker</span>
              </div>
              <h2 className="text-5xl md:text-6xl font-black text-deep-charcoal italic leading-none tracking-tight">
                Crafted with <br/>
                <span className="text-chili">Passion</span> & <br/>
                <span className="text-cinnamon underline decoration-saffron decoration-4 underline-offset-8">Tradition</span>
              </h2>
            </div>

            <div className="space-y-6 text-lg text-cinnamon/80 font-medium leading-relaxed">
              <p>
                Spark Zing wasn't born in a factory. It started in a sun-drenched kitchen in Kerala, inspired by the rhythmic sounds of stone-grinding spices and the aroma of fresh cassava roasting over open flames.
              </p>
              <p>
                Founder <span className="text-deep-charcoal font-black italic">Aria Rajan</span> belief was simple: snacks should be an adventure. No mass-production, no artificial zing. Just real ingredients, slow-cooked to perfection.
              </p>
            </div>

            <div className="flex items-center gap-6 pt-6">
               <div className="flex flex-col">
                  <span className="text-3xl font-black text-deep-charcoal">100%</span>
                  <span className="text-[10px] font-bold text-cinnamon uppercase tracking-widest">Handmade</span>
               </div>
               <div className="w-px h-12 bg-orange-100" />
               <div className="flex flex-col">
                  <span className="text-3xl font-black text-deep-charcoal">NO</span>
                  <span className="text-[10px] font-bold text-cinnamon uppercase tracking-widest">Preservatives</span>
               </div>
               <div className="w-px h-12 bg-orange-100" />
               <div className="flex flex-col">
                  <span className="text-3xl font-black text-deep-charcoal">Real</span>
                  <span className="text-[10px] font-bold text-cinnamon uppercase tracking-widest">Spices</span>
               </div>
            </div>

            <button className="flex items-center gap-3 text-deep-charcoal font-black uppercase tracking-widest hover:text-chili transition-colors pt-4 group">
               Read Full Story 
               <div className="p-2 bg-white rounded-full shadow-md group-hover:bg-chili group-hover:text-white transition-all">
                  <Quote className="w-3 h-3 rotate-180" />
               </div>
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
