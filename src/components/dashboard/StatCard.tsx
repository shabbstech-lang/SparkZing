import { ArrowUpRight, ArrowDownRight, LucideIcon } from 'lucide-react';
import { cn } from '@/lib/utils';
import { m } from 'motion/react';

interface StatCardProps {
  label: string;
  value: string;
  icon: LucideIcon;
  change: number;
  trend: 'up' | 'down';
  delay?: number;
}

export function StatCard({ label, value, icon: Icon, change, trend, delay = 0 }: StatCardProps) {
  return (
    <m.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay }}
      className="p-5 bg-white border border-slate-200 rounded-xl shadow-sm hover:shadow-md transition-all flex flex-col justify-between"
    >
      <div className="flex items-start justify-between mb-4">
        <div className={cn(
          "p-2 rounded-lg transition-colors",
          trend === 'up' ? "bg-emerald-50 text-emerald-600" : "bg-blue-50 text-blue-600"
        )}>
          <Icon className="w-4 h-4" />
        </div>
        <div className={cn(
          "flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-wider",
          trend === 'up' ? "text-emerald-600 bg-emerald-50" : "text-rose-600 bg-rose-50"
        )}>
          {trend === 'up' ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
          {Math.abs(change)}%
        </div>
      </div>
      <div>
        <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1">{label}</p>
        <h3 className="text-2xl font-bold tracking-tight text-slate-800">{value}</h3>
      </div>
    </m.div>
  );
}
