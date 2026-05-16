import { Search, Bell, Menu, UserCircle } from 'lucide-react';

export function Header({ onMenuToggle }: { onMenuToggle: () => void }) {
  return (
    <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-4 md:px-8 shrink-0 z-10 transition-all">
      <div className="flex items-center gap-4 flex-1 max-w-xl">
        <button 
          onClick={onMenuToggle}
          className="lg:hidden p-2 hover:bg-slate-100 rounded-lg transition-colors"
        >
          <Menu className="w-5 h-5 text-slate-500" />
        </button>
        <div className="relative flex-1 group">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-spark-orange transition-colors" />
          <input 
            type="text" 
            placeholder="Search products, orders..."
            className="w-full bg-slate-100 border-transparent focus:bg-white focus:border-slate-200 focus:ring-1 focus:ring-orange-100 rounded-lg py-2 pl-10 pr-4 text-sm transition-all outline-none"
          />
        </div>
      </div>

      <div className="flex items-center gap-2 md:gap-4">
        <button className="relative p-2 hover:bg-slate-100 rounded-full transition-colors group">
          <Bell className="w-5 h-5 text-slate-500 group-hover:text-slate-800" />
          <span className="absolute top-2 right-2 w-2 h-2 bg-rose-500 rounded-full border-2 border-white ring-1 ring-rose-500/20"></span>
        </button>
        
        <div className="h-8 w-px bg-slate-200 mx-2 hidden md:block"></div>

        <button className="flex items-center gap-3 p-1.5 hover:bg-slate-100 rounded-full transition-colors group">
          <div className="hidden md:block text-right">
            <p className="text-xs font-semibold text-slate-800 uppercase tracking-tighter">Admin Portal</p>
            <p className="text-[10px] text-slate-500 font-medium">System Operator</p>
          </div>
          <div className="w-8 h-8 rounded-full bg-slate-200 border border-slate-300 flex items-center justify-center overflow-hidden">
            <UserCircle className="w-full h-full text-slate-400 group-hover:text-slate-600 transition-colors" />
          </div>
        </button>
      </div>
    </header>
  );
}
