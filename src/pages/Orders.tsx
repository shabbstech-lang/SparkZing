import { useState, useEffect } from 'react';
import { Search, Filter, MoreHorizontal, ChevronRight, ChevronLeft, Package, Clock, Truck, ChefHat } from 'lucide-react';
import { Order, OrderStatus } from '@/types';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '@/lib/utils';
import { db, handleFirestoreError, OperationType, auth } from '@/lib/firebase';
import { collection, onSnapshot, query, orderBy, updateDoc, doc, serverTimestamp } from 'firebase/firestore';

const COLUMNS: { id: OrderStatus; label: string; icon: any; color: string }[] = [
  { id: 'New', label: 'New', icon: Clock, color: 'text-blue-600 bg-blue-50 border-blue-200' },
  { id: 'In Kitchen', label: 'In Kitchen', icon: ChefHat, color: 'text-orange-600 bg-orange-50 border-orange-200' },
  { id: 'Packaging', label: 'Packaging', icon: Package, color: 'text-indigo-600 bg-indigo-50 border-indigo-200' },
  { id: 'Shipped', label: 'Shipped', icon: Truck, color: 'text-emerald-600 bg-emerald-50 border-emerald-200' },
];

export function Orders() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [showHighValue, setShowHighValue] = useState(false);

  useEffect(() => {
    let unsubscribe = () => {};

    const setupSubscription = () => {
      const q = query(collection(db, 'orders'), orderBy('date', 'desc'));
      unsubscribe = onSnapshot(q, (snapshot) => {
        const orderList = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
          date: doc.data().date?.toDate?.()?.toISOString() || doc.data().date
        })) as Order[];
        setOrders(orderList);
        setLoading(false);
      }, (error) => {
        handleFirestoreError(error, OperationType.LIST, 'orders');
      });
    };

    setupSubscription();
    
    return () => {
      unsubscribe();
    };
  }, []);

  const filteredOrders = orders.filter(order => {
    const matchesSearch = order.customer.toLowerCase().includes(searchQuery.toLowerCase()) || order.id.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesHighValue = !showHighValue || order.amount > 50;
    return matchesSearch && matchesHighValue;
  });

  const moveOrder = async (id: string, nextStatus: OrderStatus) => {
    try {
      await updateDoc(doc(db, 'orders', id), {
        status: nextStatus,
        updatedAt: serverTimestamp()
      });
    } catch (error) {
      handleFirestoreError(error, OperationType.UPDATE, `orders/${id}`);
    }
  };

  const getOrdersByStatus = (status: OrderStatus) => filteredOrders.filter(o => o.status === status);

  return (
    <div className="space-y-8 h-full flex flex-col">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 shrink-0">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-800">Order Management</h1>
          <p className="text-slate-500 mt-1">Live tracking of Spark Zing kitchen & fulfillment.</p>
        </div>
        <div className="flex gap-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input 
              type="text" 
              placeholder="Search orders..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full md:w-64 bg-white border border-slate-200 rounded-lg py-2.5 pl-10 pr-4 text-sm focus:ring-1 focus:ring-orange-100 outline-none transition-all shadow-sm"
            />
          </div>
          <button 
            onClick={() => setShowHighValue(!showHighValue)}
            className={cn(
              "flex items-center gap-2 px-4 py-2 border rounded-lg text-sm font-medium transition-all shadow-sm",
              showHighValue ? "bg-spark-orange text-white border-spark-orange" : "bg-white border-slate-200 text-slate-600 hover:bg-slate-50"
            )}
          >
            <Filter className={cn("w-4 h-4", showHighValue ? "text-white" : "text-slate-400")} />
            High Value
          </button>
        </div>
      </div>

      <div className="flex-1 min-h-0 overflow-x-auto pb-4">
        <div className="flex gap-6 h-full min-w-[1000px]">
          {COLUMNS.map(column => (
            <div key={column.id} className="flex-1 flex flex-col min-w-[280px]">
              <div className="flex items-center justify-between px-3 py-2 border-b-2 border-transparent mb-4">
                <div className="flex items-center gap-3">
                  <div className={cn("p-2 rounded-lg border", column.color.split(' ').slice(1).join(' '))}>
                    <column.icon className={cn("w-4 h-4", column.color.split(' ')[0])} />
                  </div>
                  <h3 className="font-bold text-slate-800 text-sm">{column.label}</h3>
                  <span className="text-[10px] font-bold bg-slate-100 text-slate-500 px-2 py-0.5 rounded-full">
                    {getOrdersByStatus(column.id).length}
                  </span>
                </div>
                <MoreHorizontal className="w-4 h-4 text-slate-300" />
              </div>

              <div className="flex-1 bg-slate-50/50 rounded-2xl p-2 space-y-3 overflow-y-auto max-h-[calc(100vh-300px)]">
                <AnimatePresence mode="popLayout">
                  {getOrdersByStatus(column.id).map((order) => (
                    <motion.div
                      layout
                      key={order.id}
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.9 }}
                      transition={{ type: 'spring', damping: 20, stiffness: 200 }}
                      className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm hover:shadow-md transition-shadow group"
                    >
                      <div className="flex justify-between items-start mb-3">
                        <div>
                          <p className="text-[10px] font-mono text-slate-400 uppercase font-bold tracking-wider">{order.id}</p>
                          <h4 className="text-sm font-bold text-slate-800 group-hover:text-spark-orange transition-colors">{order.customer}</h4>
                        </div>
                        <span className="text-sm font-black text-slate-900">Rs. {order.amount.toFixed(2)}</span>
                      </div>

                      <div className="space-y-1 mb-4">
                        {order.items.map((item, i) => (
                          <div key={i} className="flex items-center justify-between text-[11px] text-slate-500 font-medium bg-slate-50/80 px-2 py-1 rounded">
                            <span>{item.name}</span>
                            <span className="bg-slate-200 text-slate-600 px-1.5 rounded">x{item.quantity}</span>
                          </div>
                        ))}
                      </div>

                      <div className="flex items-center justify-between pt-3 border-t border-slate-50">
                        <div className="flex gap-1">
                          {column.id !== 'New' && (
                            <button 
                              onClick={() => moveOrder(order.id, COLUMNS[COLUMNS.findIndex(c => c.id === column.id) - 1].id)}
                              className="p-1.5 rounded-lg border border-slate-200 hover:bg-slate-50 text-slate-400 hover:text-slate-600 transition-all"
                            >
                              <ChevronLeft className="w-4 h-4" />
                            </button>
                          )}
                        </div>
                        {column.id !== 'Shipped' && (
                          <button 
                            onClick={() => moveOrder(order.id, COLUMNS[COLUMNS.findIndex(c => c.id === column.id) + 1].id)}
                            className="flex items-center gap-1 px-3 py-1.5 bg-slate-900 text-white rounded-lg text-[10px] font-bold uppercase tracking-wider hover:bg-black transition-all"
                          >
                            Advance
                            <ChevronRight className="w-3 h-3" />
                          </button>
                        )}
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
                {getOrdersByStatus(column.id).length === 0 && (
                  <div className="h-24 border-2 border-dashed border-slate-200 rounded-xl flex items-center justify-center text-slate-300 text-xs font-medium">
                    No orders {column.label.toLowerCase()}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
