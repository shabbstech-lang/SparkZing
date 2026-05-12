import { useEffect, useState } from 'react';
import { DollarSign, ShoppingCart, Users, CreditCard } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { StatCard } from '@/components/dashboard/StatCard';
import { CustomerLove } from '@/components/dashboard/CustomerLove';
import { BundleSaver } from '@/components/promo/BundleSaver';
import { Stats, Order } from '@/types';
import { motion } from 'motion/react';
import { cn } from '@/lib/utils';
import { db, handleFirestoreError, OperationType, auth } from '@/lib/firebase';
import { collection, onSnapshot, query, orderBy, limit, getDocs } from 'firebase/firestore';

const chartData = [
  { name: 'Mon', revenue: 4000 },
  { name: 'Tue', revenue: 3000 },
  { name: 'Wed', revenue: 2000 },
  { name: 'Thu', revenue: 2780 },
  { name: 'Fri', revenue: 1890 },
  { name: 'Sat', revenue: 2390 },
  { name: 'Sun', revenue: 3490 },
];

export function Dashboard() {
  const [stats, setStats] = useState<Stats>({
    revenue: 0,
    sales: 0,
    customers: 0,
    avgOrderValue: 0,
    revenueChange: 0,
    salesChange: 0,
    customersChange: 0,
    aovChange: 0
  });
  const [recentOrders, setRecentOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let unsubscribe = () => {};

    const setupSubscription = () => {
      // Only subscribe if we are admin. Dashboard is an admin-only view conceptually.
      if (!auth.currentUser) {
        setLoading(false);
        return;
      }

      const q = query(collection(db, 'orders'), orderBy('date', 'desc'), limit(5));
      unsubscribe = onSnapshot(q, (snapshot) => {
        const orders = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
          date: doc.data().date?.toDate?.()?.toISOString() || doc.data().date
        })) as Order[];
        setRecentOrders(orders);
        
        // Calculate simple stats from orders
        let totalRev = 0;
        orders.forEach(o => totalRev += o.amount);
        
        setStats({
          revenue: totalRev || 12450.50, // Default mock values if no real data yet
          sales: snapshot.size || 84,
          customers: 12, // Would need a separate collection for this
          avgOrderValue: totalRev / (orders.length || 1) || 148.22,
          revenueChange: 12.5,
          salesChange: -2.4,
          customersChange: 8.1,
          aovChange: 5.2
        });
        setLoading(false);
      }, (error) => {
        handleFirestoreError(error, OperationType.LIST, 'orders');
      });
    };

    // Listen for auth changes to re-subscribe
    const authUnsubscribe = auth.onAuthStateChanged(() => {
      unsubscribe();
      setupSubscription();
    });

    return () => {
      unsubscribe();
      authUnsubscribe();
    };
  }, []);

  if (loading) {
    return (
      <div className="h-[80vh] flex flex-col items-center justify-center gap-4">
        <div className="w-12 h-12 border-4 border-spark-orange/20 border-t-spark-orange rounded-full animate-spin" />
        <p className="text-sm font-black text-deep-charcoal italic tracking-tight uppercase">Crafting your analytics...</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-800">Dashboard</h1>
          <p className="text-slate-500 mt-1">Spark Zing snack performance overview.</p>
        </div>
        <div className="flex gap-3">
          <button className="px-4 py-2 border border-slate-200 rounded-lg text-sm font-medium text-slate-600 hover:bg-white transition-all shadow-sm">
            Export Data
          </button>
          <button className="px-4 py-2 bg-spark-orange text-white rounded-lg text-sm font-medium hover:brightness-110 shadow-sm shadow-orange-200 transition-all">
            + New Snack
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 auto-rows-min">
        {/* Bundle Promo Section */}
        <div className="lg:col-span-3 mb-4">
          <BundleSaver />
        </div>

        <StatCard 
          label="Revenue" 
          value={`$${stats.revenue.toLocaleString()}`} 
          icon={DollarSign} 
          change={stats.revenueChange} 
          trend="up" 
          delay={0}
        />
        <StatCard 
          label="Active Orders" 
          value={`${stats.sales}`} 
          icon={ShoppingCart} 
          change={stats.salesChange} 
          trend="down" 
          delay={0.1}
        />
        <StatCard 
          label="Avg. Ticket" 
          value={`$${stats.avgOrderValue.toFixed(2)}`} 
          icon={CreditCard} 
          change={stats.aovChange} 
          trend="up" 
          delay={0.2}
        />
        
        {/* Top Products / Sidebar Card in the Bento Grid */}
        <motion.div 
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.4, delay: 0.3 }}
          className="lg:row-span-3 bg-white rounded-xl border border-slate-200 p-5 flex flex-col shadow-sm"
        >
          <h4 className="text-sm font-bold text-slate-800 mb-4">Top Selling</h4>
          <div className="space-y-5 flex-1">
            {[
              { name: 'Quantum X-Pro', sold: 412, val: '$8.2k' },
              { name: 'Titan Audio Pods', sold: 298, val: '$5.9k' },
              { name: 'Vortex Nomad', sold: 385, val: '$7.1k' },
              { name: 'Luna Smart Watch', sold: 156, val: '$4.2k' },
            ].map((p, i) => (
              <div key={i} className="flex items-center gap-3">
                <div className="w-10 h-10 bg-slate-50 rounded border border-slate-100 flex items-center justify-center text-lg">📦</div>
                <div className="flex-1 overflow-hidden">
                  <p className="text-xs font-bold text-slate-700 truncate">{p.name}</p>
                  <p className="text-[10px] text-slate-500">{p.sold} sold</p>
                </div>
                <div className="text-xs font-bold text-blue-600">{p.val}</div>
              </div>
            ))}
          </div>
          <button className="mt-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest hover:text-blue-600 text-center w-full py-2 border-t border-slate-50 transition-colors">
            View Report
          </button>
        </motion.div>

        {/* Revenue Growth Chart Area */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.4, delay: 0.4 }}
          className="lg:col-span-3 lg:row-span-2 bg-white rounded-xl border border-slate-200 p-6 shadow-sm relative overflow-hidden"
        >
          <div className="flex justify-between items-center mb-8">
            <div>
              <h4 className="text-sm font-bold text-slate-800">Revenue Growth</h4>
              <p className="text-[10px] text-slate-500">7-day rolling average</p>
            </div>
            <div className="flex gap-2">
              <span className="px-2 py-1 bg-slate-100 text-[10px] font-bold rounded text-slate-600 uppercase tracking-wider">Orders</span>
              <span className="px-2 py-1 bg-blue-50 text-[10px] font-bold rounded text-blue-600 uppercase tracking-wider">Revenue</span>
            </div>
          </div>
          <div className="h-[240px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData}>
                <defs>
                  <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#2563EB" stopOpacity={0.1}/>
                    <stop offset="95%" stopColor="#2563EB" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F1F5F9" />
                <XAxis 
                  dataKey="name" 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fontSize: 10, fill: '#64748B', fontWeight: 500 }}
                  dy={10}
                />
                <YAxis 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fontSize: 10, fill: '#64748B', fontWeight: 500 }}
                  tickFormatter={(val) => `$${val/1000}k`}
                />
                <Tooltip 
                  contentStyle={{ borderRadius: '8px', border: '1px solid #E2E8F0', boxShadow: '0 4px 12px rgba(0,0,0,0.05)', fontSize: '12px' }}
                />
                <Area 
                  type="monotone" 
                  dataKey="revenue" 
                  stroke="#2563EB" 
                  strokeWidth={2}
                  fillOpacity={1} 
                  fill="url(#colorRevenue)" 
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        {/* Recent Orders - Bento Style */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.5 }}
          className="lg:col-span-2 lg:row-span-1 bg-white rounded-xl border border-slate-200 p-5 shadow-sm"
        >
          <div className="flex justify-between items-center mb-4">
            <h4 className="text-sm font-bold text-slate-800">Recent Orders</h4>
            <button className="text-[10px] text-blue-600 font-bold uppercase tracking-wider">See all</button>
          </div>
          <div className="space-y-0.5">
            <div className="grid grid-cols-4 py-2 border-b border-slate-50 text-[10px] font-bold text-slate-400 uppercase tracking-tighter">
              <div className="col-span-2">Customer</div>
              <div>Status</div>
              <div className="text-right">Amount</div>
            </div>
            {recentOrders.slice(0, 3).map((order) => (
              <div key={order.id} className="grid grid-cols-4 py-3 border-b border-slate-50 items-center last:border-0 grow transition-colors hover:bg-slate-50/50 rounded-lg px-1 -mx-1">
                <div className="col-span-2 flex items-center gap-2">
                  <div className="w-7 h-7 rounded bg-blue-50 text-blue-600 flex items-center justify-center text-[10px] font-extrabold">
                    {order.customer.split(' ').map(n => n[0]).join('')}
                  </div>
                  <div className="overflow-hidden">
                    <p className="text-xs font-bold text-slate-700 truncate">{order.customer}</p>
                    <p className="text-[9px] text-slate-400 font-mono">{order.id}</p>
                  </div>
                </div>
                <div>
                  <span className={cn(
                    "px-2 py-0.5 rounded text-[9px] font-bold uppercase tracking-tighter",
                    order.status === 'Delivered' ? 'bg-emerald-50 text-emerald-600' :
                    order.status === 'Processing' ? 'bg-amber-50 text-amber-600' :
                    order.status === 'Shipped' ? 'bg-blue-50 text-blue-600' :
                    'bg-slate-100 text-slate-500'
                  )}>
                    {order.status}
                  </span>
                </div>
                <div className="text-right text-xs font-bold text-slate-700">${order.amount.toFixed(2)}</div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Small Action/Health Card */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.4, delay: 0.6 }}
          className="bg-slate-900 rounded-xl p-5 flex flex-col text-white shadow-sm"
        >
          <h4 className="text-[10px] font-bold mb-4 opacity-50 uppercase tracking-widest">System Health</h4>
          <div className="space-y-4 flex-1">
            <div className="flex items-center justify-between">
              <span className="text-[10px] opacity-60">API Latency</span>
              <span className="text-[10px] font-mono text-emerald-400">12ms</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-[10px] opacity-60">Uptime</span>
              <span className="text-[10px] font-mono text-emerald-400">99.9%</span>
            </div>
            <div className="p-3 bg-slate-800/50 rounded-lg border border-slate-800 flex items-center gap-3">
               <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]"></div>
               <span className="text-[10px] font-bold">DB Optimal</span>
            </div>
          </div>
          <div className="text-[9px] text-slate-500 mt-auto pt-4 flex justify-between">
            <span>v1.2.0</span>
            <span className="flex items-center gap-1"><div className="w-1 h-1 bg-blue-500 rounded-full animate-pulse"></div> LIVE</span>
          </div>
        </motion.div>

      </div>
      
      <CustomerLove />
    </div>
  );
}
