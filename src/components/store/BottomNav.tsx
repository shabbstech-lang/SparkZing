import { Home, Search, ShoppingBag, Heart, User } from 'lucide-react';
import { motion } from 'motion/react';
import { cn } from '@/lib/utils';

const navItems = [
  { icon: Home, label: 'Home' },
  { icon: Search, label: 'Search' },
  { icon: ShoppingBag, label: 'Store', active: true },
  { icon: Heart, label: 'Liked' },
  { icon: User, label: 'Profile' },
];

export function BottomNav() {
  return (
    <nav className="fixed bottom-6 left-6 right-6 bg-deep-charcoal rounded-3xl p-2 flex items-center justify-around shadow-2xl z-50 lg:hidden">
      {navItems.map((item, i) => (
        <button 
          key={i}
          className={cn(
            "p-3 rounded-2xl transition-all relative group",
            item.active ? "bg-spark-orange text-white" : "text-gray-500 hover:text-white"
          )}
        >
          <item.icon className="w-5 h-5" />
          {item.active && (
            <motion.div 
              layoutId="nav-highlight"
              className="absolute -top-1 -right-1 w-2 h-2 bg-white rounded-full border-2 border-deep-charcoal"
            />
          )}
        </button>
      ))}
    </nav>
  );
}
