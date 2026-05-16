import { useState, ReactNode } from 'react';
import { Sidebar } from './Sidebar';
import { Header } from './Header';
import { CountdownBanner } from '../promo/CountdownBanner';
import { useAuth } from '@/contexts/AuthContext';
import { ShieldAlert, LogIn, CheckCircle2 } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface AdminLayoutProps {
  children: ReactNode;
}

function AuthAlert() {
  const { user, loginWithGoogle } = useAuth();
  const isAdminEmail = user?.email === 'shabbs.tech@gmail.com';
  
  if (user && isAdminEmail) {
    return (
      <div className="bg-emerald-50 border-b border-emerald-100 py-1.5 px-4 flex items-center justify-center gap-2">
         <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
         <span className="text-[10px] font-bold text-emerald-700 uppercase tracking-widest">
           Secure Database Link Active: {user.email}
         </span>
      </div>
    );
  }

  return (
    <motion.div 
      initial={{ height: 0, opacity: 0 }}
      animate={{ height: 'auto', opacity: 1 }}
      className="bg-amber-50 border-b border-amber-100 py-2 px-4"
    >
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="p-1.5 bg-amber-100 rounded-lg">
            <ShieldAlert className="w-4 h-4 text-amber-600" />
          </div>
          <div>
            <p className="text-[11px] font-black text-amber-900 uppercase tracking-tight">Database Read-Only Mode</p>
            <p className="text-[10px] font-medium text-amber-700/80">
              {user 
                ? `Signed in as ${user.email} (Unauthorized for writes)` 
                : 'Authenticated via mock login. Google Sign-In is required to modify collections.'}
            </p>
          </div>
        </div>
        <button 
          onClick={() => loginWithGoogle()}
          className="flex items-center gap-2 px-3 py-1.5 bg-amber-600 text-white rounded-lg text-[10px] font-black uppercase tracking-widest hover:bg-amber-700 transition-all shadow-sm"
        >
          <LogIn className="w-3 h-3" />
          Link Google Admin
        </button>
      </div>
    </motion.div>
  );
}

export function AdminLayout({ children }: AdminLayoutProps) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <div className="flex h-screen bg-slate-50 text-slate-800 font-sans overflow-hidden">
      <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />
      
      <div className="flex-1 flex flex-col h-full min-w-0 relative">
        <AuthAlert />
        <CountdownBanner />
        <Header onMenuToggle={() => setIsSidebarOpen(true)} />
        
        <main className="flex-1 overflow-y-auto p-4 md:p-8">
          {children}
        </main>
      </div>
    </div>
  );
}
