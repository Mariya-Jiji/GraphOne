import Link from 'next/link';
import { Home, Rocket, Package, Users, Briefcase, Newspaper, PlusCircle, Hexagon } from 'lucide-react';

export function ProductsSidebar() {
  return (
    <aside className="w-64 fixed top-0 left-0 h-screen border-r border-slate-200 bg-slate-50 flex flex-col p-4 z-20">
      <Link href="/" className="flex items-center gap-2 mb-8 px-2 mt-2">
        <Hexagon className="w-6 h-6 text-brand-pink fill-brand-pink" />
        <span className="font-bold text-xl tracking-tight">GraphOne</span>
      </Link>
      
      <nav className="flex flex-col gap-1 flex-1">
        <Link href="/" className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-slate-600 hover:bg-slate-100 transition-colors">
          <Home className="w-4 h-4" />
          <span className="text-sm font-medium">Home</span>
        </Link>
        <Link href="/companies" className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-slate-600 hover:bg-slate-100 transition-colors">
          <Rocket className="w-4 h-4" />
          <span className="text-sm font-medium">AI Startups</span>
        </Link>
        <Link href="/products" className="flex items-center gap-3 px-3 py-2.5 rounded-lg bg-brand-pink/10 text-brand-pink hover:bg-brand-pink/20 transition-colors">
          <Package className="w-4 h-4" />
          <span className="text-sm font-medium">AI Products</span>
        </Link>
        <Link href="/investors" className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-slate-600 hover:bg-slate-100 transition-colors">
          <Users className="w-4 h-4" />
          <span className="text-sm font-medium">Investors</span>
        </Link>
        <Link href="/jobs" className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-slate-600 hover:bg-slate-100 transition-colors">
          <Briefcase className="w-4 h-4" />
          <span className="text-sm font-medium">Jobs</span>
        </Link>
        <Link href="/news" className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-slate-600 hover:bg-slate-100 transition-colors">
          <Newspaper className="w-4 h-4" />
          <span className="text-sm font-medium">News</span>
        </Link>
      </nav>

      <div className="pt-4 border-t border-slate-200 mt-4 mb-2">
        <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2 px-3">Contribute</h4>
        <Link href="/submit/startup" className="flex items-center gap-3 px-3 py-2 rounded-lg text-slate-600 hover:bg-slate-100 transition-colors">
          <Rocket className="w-4 h-4 text-brand-pink" />
          <span className="text-sm font-medium">Submit Startup</span>
        </Link>
        <Link href="/submit/product" className="flex items-center gap-3 px-3 py-2 rounded-lg text-slate-600 hover:bg-slate-100 transition-colors">
          <PlusCircle className="w-4 h-4 text-purple-500" />
          <span className="text-sm font-medium">Submit Product</span>
        </Link>
      </div>
    </aside>
  );
}
