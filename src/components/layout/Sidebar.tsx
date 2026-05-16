import { NavLink } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { 
  LayoutDashboard, 
  Package, 
  ShoppingCart, 
  Gift,
  Settings, 
  LogOut,
  ChevronRight,
  Sparkles,
  ExternalLink,
  User,
  Globe
} from 'lucide-react';
import { cn } from '@/lib/utils';

const navItems = [
  { icon: Globe, label: 'Back to Store', path: '/' },
  { icon: LayoutDashboard, label: 'Dashboard', path: '/admin' },
  { icon: Package, label: 'Products', path: '/admin/products' },
  { icon: Sparkles, label: 'Bundle Offers', path: '/admin/bundles' },
  { icon: Gift, label: 'Seasonal Offers', path: '/admin/seasonal' },
  { icon: ShoppingCart, label: 'Orders', path: '/admin/orders' },
];

export function Sidebar({ isOpen, onClose }: { isOpen?: boolean, onClose?: () => void }) {
  const { logout } = useAuth();

  const handleLogout = () => {
    logout();
    onClose?.();
  };

  return (
    <>
      {/* Mobile Overlay */}
      <div 
        className={cn(
          "fixed inset-0 bg-black/60 backdrop-blur-sm z-40 transition-opacity lg:hidden",
          isOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        )}
        onClick={onClose}
      />

      <aside className={cn(
        "w-64 bg-deep-charcoal flex flex-col h-full shrink-0 text-gray-400 fixed lg:static inset-y-0 left-0 z-50 transition-transform duration-300 transform lg:translate-x-0 shadow-2xl lg:shadow-none",
        isOpen ? "translate-x-0" : "-translate-x-full"
      )}>
        <div className="p-6 border-b border-white/10 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-spark-orange rounded-lg flex items-center justify-center">
              <Sparkles className="text-white w-5 h-5" />
            </div>
            <span className="font-bold text-white tracking-tight text-lg">Spark Zing</span>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-white/5 rounded-lg lg:hidden">
            <ChevronRight className="w-5 h-5 rotate-180" />
          </button>
        </div>

        <div className="p-4 border-b border-white/5 space-y-3 shrink-0">
          <div className="flex items-center gap-3 px-3 py-2 bg-white/5 rounded-xl border border-white/10">
            <div className="w-8 h-8 bg-spark-orange rounded-full flex items-center justify-center">
              <User className="w-4 h-4 text-white" />
            </div>
            <div className="flex-1 overflow-hidden">
              <p className="text-xs font-bold text-white truncate">Administrator</p>
              <p className="text-[10px] text-gray-500 truncate">System Access</p>
            </div>
          </div>
        </div>

        <nav className="flex-1 p-4 space-y-1 overflow-y-auto no-scrollbar">
          <div className="text-[10px] font-bold text-gray-500 uppercase tracking-widest px-3 mb-4">
            Management
          </div>
          {navItems.map((item) => (
            <NavLink
              key={item.label}
              to={item.path}
              onClick={onClose}
              className={({ isActive }) => cn(
                "flex items-center justify-between px-3 py-2.5 rounded-lg transition-all duration-200 group text-sm font-medium",
                isActive 
                  ? "bg-white/10 text-white" 
                  : "hover:bg-white/5 hover:text-white"
              )}
            >
              <div className="flex items-center gap-3">
                <item.icon className={cn("w-4 h-4 transition-colors", "group-hover:text-spark-orange")} />
                {item.label}
              </div>
              <ChevronRight className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-all transform translate-x-[-4px] group-hover:translate-x-0" />
            </NavLink>
          ))}
        </nav>

        <div className="p-4 border-t border-white/10 space-y-1 shrink-0">
          <NavLink
            to="/shop"
            className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium text-spark-lime hover:bg-spark-lime/10 transition-all duration-200"
          >
            <ExternalLink className="w-4 h-4" />
            View Store
          </NavLink>
          <NavLink
            to="/admin/settings"
            onClick={onClose}
            className={({ isActive }) => cn(
              "flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200",
              isActive ? "bg-white/10 text-white" : "hover:bg-white/5 hover:text-white"
            )}
          >
            <Settings className="w-4 h-4" />
            Settings
          </NavLink>
          <button 
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-black uppercase tracking-widest text-rose-500 hover:bg-rose-500/10 transition-all duration-200"
          >
            <LogOut className="w-4 h-4" />
            Admin Logout
          </button>
        </div>
      </aside>
    </>
  );
}
