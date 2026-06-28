import React from 'react';

export function FooterCTA() {
  return (
    <footer className="w-full bg-[#0a0f1c] py-20 mt-16 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col lg:flex-row items-center justify-between gap-10">
        <div className="flex items-center gap-4 text-white">
          <div className="flex-shrink-0 w-12 h-12 rounded-full bg-brand-pink/20 text-brand-pink flex items-center justify-center font-bold border border-brand-pink/30">
            g
          </div>
          <div>
            <h2 className="text-2xl font-bold mb-1">Be the first to discover what&apos;s next in AI</h2>
            <p className="text-slate-400 text-sm">Join thousands of builders, investors and researchers.</p>
          </div>
        </div>

        <div className="flex items-center gap-3 w-full max-w-md">
          <input 
            type="email" 
            placeholder="Enter your email" 
            className="flex-1 bg-white/5 border border-white/10 rounded-full px-5 py-3 text-white text-sm focus:outline-none focus:ring-2 focus:ring-brand-pink/50 focus:border-transparent transition-all"
          />
          <button className="bg-brand-pink hover:bg-brand-red text-white text-sm font-medium px-6 py-3 rounded-full transition-colors whitespace-nowrap">
            Get updates
          </button>
        </div>
      </div>
    </footer>
  );
}
