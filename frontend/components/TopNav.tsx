import React from 'react';
import { Logo } from './Logo';
import { Search } from 'lucide-react';

export function TopNav() {
  return (
    <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-slate-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-8">
        <Logo />
        
        <div className="flex-1 max-w-lg hidden md:block">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input 
              type="text" 
              placeholder="Search companies, founders, investors..." 
              className="w-full bg-slate-50 border border-slate-200 rounded-full pl-10 pr-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-pink/20 focus:border-brand-pink transition-all"
            />
          </div>
        </div>

        <div className="hidden lg:flex items-center gap-6 text-sm font-medium text-slate-600">
          <a href="#" className="text-brand-red border-b-2 border-brand-red py-5">Companies</a>
          <a href="#" className="hover:text-slate-900 transition-colors">Products</a>
          <a href="#" className="hover:text-slate-900 transition-colors">Investors</a>
          <a href="#" className="hover:text-slate-900 transition-colors">Funding</a>
          <a href="#" className="hover:text-slate-900 transition-colors">Jobs</a>
          <a href="#" className="hover:text-slate-900 transition-colors">News</a>
        </div>

        <div className="flex items-center gap-4">
          <a href="#" className="text-sm font-medium text-slate-600 hover:text-slate-900 hidden sm:block">Log in</a>
          <button className="bg-brand-red hover:bg-brand-pink text-white text-sm font-medium px-5 py-2 rounded-full transition-colors shadow-sm shadow-brand-red/20">
            Sign up
          </button>
        </div>
      </div>
    </nav>
  );
}
