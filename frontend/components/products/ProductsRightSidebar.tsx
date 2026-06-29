'use client';

import { Mail } from 'lucide-react';
import Link from 'next/link';

export function ProductsRightSidebar() {
  return (
    <aside className="w-64 shrink-0 flex flex-col gap-6">
      {/* Email Signup */}
      <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm">
        <div className="w-10 h-10 bg-red-50 text-brand-pink rounded-xl flex items-center justify-center mb-4 border border-red-100">
          <Mail className="w-5 h-5" />
        </div>
        
        <h3 className="font-bold text-slate-900 mb-2">Stay ahead in AI</h3>
        <p className="text-sm text-slate-500 mb-4 leading-relaxed">
          Get weekly updates on new tools and trends.
        </p>
        
        <form className="flex flex-col gap-3" onSubmit={(e) => e.preventDefault()}>
          <input 
            type="email" 
            placeholder="Enter your email" 
            className="w-full px-4 py-2 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-brand-pink focus:ring-1 focus:ring-brand-pink transition-all"
            required
          />
          <button 
            type="submit" 
            className="w-full bg-brand-pink hover:bg-rose-600 text-white font-semibold text-sm py-2.5 rounded-xl transition-colors"
          >
            Subscribe
          </button>
        </form>
      </div>
      
      {/* Footer Links */}
      <div className="px-2">
        <div className="flex flex-wrap gap-x-4 gap-y-2 mb-6">
          <Link href="/about" className="text-xs font-medium text-slate-500 hover:text-brand-pink transition-colors">About</Link>
          <Link href="/advertise" className="text-xs font-medium text-slate-500 hover:text-brand-pink transition-colors">Advertise</Link>
          <Link href="/api-docs" className="text-xs font-medium text-slate-500 hover:text-brand-pink transition-colors">API</Link>
          <Link href="/newsletter" className="text-xs font-medium text-slate-500 hover:text-brand-pink transition-colors">Newsletter</Link>
          <Link href="/blog" className="text-xs font-medium text-slate-500 hover:text-brand-pink transition-colors">Blog</Link>
          <Link href="/privacy" className="text-xs font-medium text-slate-500 hover:text-brand-pink transition-colors">Privacy</Link>
          <Link href="/terms" className="text-xs font-medium text-slate-500 hover:text-brand-pink transition-colors">Terms</Link>
          <Link href="/contact" className="text-xs font-medium text-slate-500 hover:text-brand-pink transition-colors">Contact</Link>
        </div>
        
        <div className="text-[10px] text-slate-400">
          <p>© 2024 GraphOne.</p>
          <p>All rights reserved.</p>
        </div>
      </div>
    </aside>
  );
}
