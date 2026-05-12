import { NavLink } from 'react-router-dom';
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
  LogIn,
  User,
  MessageSquare
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { auth } from '@/lib/firebase';
import { signInWithPopup, GoogleAuthProvider, signOut, onAuthStateChanged, User as FirebaseUser } from 'firebase/auth';
import { useEffect, useState } from 'react';

const navItems = [
  { icon: LayoutDashboard, label: 'Dashboard', path: '/' },
  { icon: Package, label: 'Products', path: '/products' },
  { icon: Gift, label: 'Seasonal Offers', path: '/seasonal' },
  { icon: ShoppingCart, label: 'Orders', path: '/orders' },
  { icon: MessageSquare, label: 'AI Support', path: '/support' },
];

export function Sidebar() {
  const [user, setUser] = useState<FirebaseUser | null>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (u) => {
      setUser(u);
    });
    return () => unsubscribe();
  }, []);

  const handleLogin = async () => {
    try {
      const provider = new GoogleAuthProvider();
      await signInWithPopup(auth, provider);
    } catch (error) {
      console.error('Login failed', error);
    }
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
    } catch (error) {
      console.error('Logout failed', error);
    }
  };

  return (
    <aside className="w-64 bg-deep-charcoal flex flex-col h-full shrink-0 hidden lg:flex text-gray-400">
      <div className="p-6 border-b border-white/10 flex items-center gap-3">
        <div className="w-8 h-8 bg-spark-orange rounded-lg flex items-center justify-center">
          <Sparkles className="text-white w-5 h-5" />
        </div>
        <span className="font-bold text-white tracking-tight text-lg">Spark Zing</span>
      </div>

      <div className="p-4 border-b border-white/5 space-y-3">
        {user ? (
          <div className="flex items-center gap-3 px-3 py-2 bg-white/5 rounded-xl border border-white/10">
            {user.photoURL ? (
              <img src={user.photoURL} className="w-8 h-8 rounded-full border border-white/20" alt="Profile" />
            ) : (
              <div className="w-8 h-8 bg-white/10 rounded-full flex items-center justify-center">
                <User className="w-4 h-4 text-white" />
              </div>
            )}
            <div className="flex-1 overflow-hidden">
              <p className="text-xs font-bold text-white truncate">{user.displayName || 'Admin'}</p>
              <p className="text-[10px] text-gray-500 truncate">{user.email}</p>
            </div>
          </div>
        ) : (
          <button 
            onClick={handleLogin}
            className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-spark-orange text-white rounded-xl text-xs font-black uppercase tracking-widest hover:brightness-110 transition-all shadow-lg"
          >
            <LogIn className="w-4 h-4" />
            Sign In with Google
          </button>
        )}
      </div>

      <nav className="flex-1 p-4 space-y-1">
        <div className="text-[10px] font-bold text-gray-500 uppercase tracking-widest px-3 mb-4">
          Management
        </div>
        {navItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
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

      <div className="p-4 border-t border-white/10 space-y-1">
        <NavLink
          to="/shop"
          className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium text-spark-lime hover:bg-spark-lime/10 transition-all duration-200"
        >
          <ExternalLink className="w-4 h-4" />
          View Store
        </NavLink>
        <NavLink
          to="/settings"
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
          className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium text-rose-400 hover:bg-rose-500/10 transition-all duration-200"
        >
          <LogOut className="w-4 h-4" />
          Logout
        </button>
      </div>
    </aside>
  );
}
