import { Gift, Calendar, Sparkles, Plus } from 'lucide-react';
import { motion } from 'motion/react';

const seasonalOffers = [
  { id: '1', name: 'Summer Zinger Box', discount: '20% OFF', ends: 'Aug 30, 2024', status: 'Active', color: 'bg-orange-500' },
  { id: '2', name: 'Artisan Holiday Bundle', discount: 'BUY 2 GET 1', ends: 'Dec 25, 2024', status: 'Draft', color: 'bg-deep-charcoal' },
  { id: '3', name: 'Berry Blast Month', discount: 'FREE SHIPPING', ends: 'May 31, 2024', status: 'Active', color: 'bg-rose-500' },
];

export function SeasonalOffers() {
  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-800">Seasonal Offers</h1>
          <p className="text-slate-500 mt-1">Configure limited-time snack promotions.</p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2 bg-spark-orange text-white rounded-lg text-sm font-medium hover:brightness-110 shadow-sm shadow-orange-200 transition-all">
          <Calendar className="w-4 h-4" />
          Schedule Offer
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {seasonalOffers.map((offer, idx) => (
          <motion.div 
            key={offer.id}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: idx * 0.1 }}
            className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-all flex flex-col h-64"
          >
            <div className={`h-24 ${offer.color} p-6 flex flex-col justify-end relative overflow-hidden`}>
              <div className="absolute -right-4 -top-4 w-24 h-24 bg-white/10 rounded-full blur-2xl" />
              <div className="absolute right-4 top-4">
                <Gift className="text-white/40 w-8 h-8" />
              </div>
              <p className="text-white/80 text-[10px] font-bold uppercase tracking-widest">Limited Edition</p>
              <h3 className="text-white font-bold text-lg">{offer.name}</h3>
            </div>
            <div className="p-6 flex-1 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-2xl font-black text-slate-800 tracking-tighter">{offer.discount}</span>
                  <span className={`text-[10px] font-bold px-2 py-1 rounded uppercase tracking-tighter ${
                    offer.status === 'Active' ? 'bg-emerald-50 text-emerald-600' : 'bg-slate-100 text-slate-400'
                  }`}>
                    {offer.status}
                  </span>
                </div>
                <div className="flex items-center gap-2 text-slate-400 text-xs mt-1">
                  <Calendar className="w-3.5 h-3.5" />
                  Ends: {offer.ends}
                </div>
              </div>
              <div className="flex gap-2 pt-4">
                <button className="flex-1 px-3 py-2 bg-slate-50 text-slate-600 rounded-lg text-[10px] font-bold uppercase tracking-wider hover:bg-slate-100 transition-colors">Edit</button>
                <button className="flex-1 px-3 py-2 bg-slate-900 text-white rounded-lg text-[10px] font-bold uppercase tracking-wider hover:bg-black transition-colors">Stats</button>
              </div>
            </div>
          </motion.div>
        ))}

        <button className="border-2 border-dashed border-slate-200 rounded-2xl flex flex-col items-center justify-center p-6 gap-3 text-slate-400 hover:border-orange-200 hover:text-orange-400 hover:bg-orange-50/30 transition-all group min-h-[256px]">
          <div className="p-4 bg-slate-50 rounded-full group-hover:bg-orange-50 transition-colors">
            <Plus className="w-6 h-6" />
          </div>
          <span className="text-sm font-bold uppercase tracking-widest">New Offer</span>
        </button>
      </div>
    </div>
  );
}
