import React from 'react';
import Link from 'next/link';

export function InvestorFooterCTA() {
  return (
    <footer className="w-full bg-[#0a0f1c] py-20 mt-16 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-10 border-b border-slate-800 pb-16">
          <div className="flex items-center gap-4 text-white">
            <div className="flex-shrink-0 w-12 h-12 rounded-full bg-brand-pink/20 text-brand-pink flex items-center justify-center font-bold border border-brand-pink/30">
              g
            </div>
            <div>
              <h2 className="text-2xl font-bold mb-1">Join the GraphOne Investor Network</h2>
              <p className="text-slate-400 text-sm">Access exclusive deal flow, analytics, and connect with top founders.</p>
            </div>
          </div>

          <div className="flex items-center gap-4 w-full max-w-sm">
            <Link href="/login" className="flex-1 bg-white/5 hover:bg-white/10 border border-white/10 rounded-full px-5 py-3 text-white text-sm font-medium text-center transition-all">
              Log in
            </Link>
            <Link href="/signup" className="flex-1 bg-brand-pink hover:bg-pink-600 text-white text-sm font-medium px-6 py-3 rounded-full text-center transition-colors">
              Sign up for free
            </Link>
          </div>
        </div>
        
        {/* Standard Footer Links */}
        <div className="pt-10 flex flex-col md:flex-row items-center justify-between gap-6 text-sm text-slate-500">
          <p>© 2024 GraphOne. All rights reserved.</p>
          <div className="flex items-center gap-6">
            <Link href="/terms" className="hover:text-white transition-colors">Terms</Link>
            <Link href="/privacy" className="hover:text-white transition-colors">Privacy</Link>
            <Link href="/contact" className="hover:text-white transition-colors">Contact</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
