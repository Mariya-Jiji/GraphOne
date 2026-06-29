import React from 'react';
import { Briefcase, User, Building, Banknote, Box, ArrowRight } from 'lucide-react';
import Link from 'next/link';

export function CapitalGraphBanner() {
  const steps = [
    { name: 'Investor', icon: Briefcase, color: 'text-brand-pink', bg: 'bg-brand-pink/20' },
    { name: 'Founder', icon: User, color: 'text-blue-400', bg: 'bg-blue-400/20' },
    { name: 'Company', icon: Building, color: 'text-emerald-400', bg: 'bg-emerald-400/20' },
    { name: 'Funding', icon: Banknote, color: 'text-orange-400', bg: 'bg-orange-400/20' },
    { name: 'Product', icon: Box, color: 'text-purple-400', bg: 'bg-purple-400/20' },
  ];

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
      <div className="relative rounded-3xl bg-slate-900 overflow-hidden text-center py-20 px-6 lg:px-16 shadow-2xl">
        {/* Background Gradients */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-3xl h-full bg-gradient-to-b from-brand-pink/20 to-transparent blur-3xl opacity-50 pointer-events-none" />
        
        <div className="relative z-10 max-w-3xl mx-auto">
          <h2 className="text-4xl font-extrabold text-white mb-4">
            Explore the Capital Graph
          </h2>
          <p className="text-lg text-slate-400 mb-12">
            Visualize how capital moves in the AI economy. Map the connections between investors, founders, and the products shaping our future.
          </p>

          <div className="flex flex-col md:flex-row items-center justify-center gap-4 md:gap-8 mb-12">
            {steps.map((step, index) => {
              const Icon = step.icon;
              return (
                <React.Fragment key={index}>
                  <div className="flex flex-col items-center gap-3">
                    <div className={`w-16 h-16 rounded-full ${step.bg} border border-white/10 flex items-center justify-center shadow-lg`}>
                      <Icon className={`w-8 h-8 ${step.color}`} />
                    </div>
                    <span className="text-white text-sm font-semibold">{step.name}</span>
                  </div>
                  
                  {index < steps.length - 1 && (
                    <ArrowRight className="w-6 h-6 text-slate-600 hidden md:block" />
                  )}
                  {index < steps.length - 1 && (
                    <ArrowRight className="w-6 h-6 text-slate-600 md:hidden rotate-90" />
                  )}
                </React.Fragment>
              );
            })}
          </div>

          <Link href="/graph" className="inline-flex items-center justify-center px-8 py-4 bg-brand-pink hover:bg-pink-600 text-white font-bold rounded-full transition-all hover:scale-105 shadow-lg shadow-brand-pink/25">
            Launch Graph Explorer
          </Link>
        </div>
      </div>
    </section>
  );
}
