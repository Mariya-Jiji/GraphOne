import { Search, Bell, ArrowRight } from 'lucide-react';
import Link from 'next/link';

export function ProductsTopBar() {
  return (
    <header className="sticky top-0 z-10 bg-white/80 backdrop-blur-md border-b border-slate-100 px-8 py-3 flex items-center justify-between">
      <div className="flex-1 max-w-xl relative">
        <Search className="w-4 h-4 absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
        <input 
          type="text"
          placeholder="Search startups, products, investors, jobs and news"
          className="w-full bg-slate-50 border border-slate-200 rounded-full pl-11 pr-16 py-2.5 text-sm focus:outline-none focus:border-brand-pink focus:ring-1 focus:ring-brand-pink transition-all"
        />
        <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-1.5">
          <div className="px-1.5 py-0.5 rounded text-[10px] text-slate-400 font-medium">/</div>
          <button className="w-7 h-7 rounded-full bg-brand-pink text-white flex items-center justify-center hover:bg-rose-600 transition-colors">
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      <div className="flex items-center gap-5 ml-4">
        <button className="relative text-slate-400 hover:text-slate-600 transition-colors">
          <Bell className="w-5 h-5" />
          <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-red-500 border-2 border-white rounded-full"></span>
        </button>
        <Link href="/profile" className="w-8 h-8 rounded-full overflow-hidden border border-slate-200">
          <img src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=150&auto=format&fit=crop" alt="User avatar" className="w-full h-full object-cover" />
        </Link>
      </div>
    </header>
  );
}
