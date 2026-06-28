import React from 'react';
import { SectionHeader } from './SectionHeader';
import { ChevronRight } from 'lucide-react';

const collections = [
  { name: 'OpenAI Alumni Startups', count: 42, gradient: 'from-slate-900 to-slate-800' },
  { name: 'YC AI Startups', count: 283, gradient: 'from-orange-950 to-orange-900' },
  { name: 'AI Agent Leaders', count: 121, gradient: 'from-blue-950 to-blue-900' },
  { name: 'AI Infrastructure Leaders', count: 186, gradient: 'from-indigo-950 to-indigo-900' },
  { name: 'Most Funded AI Startups', count: 184, gradient: 'from-slate-950 to-slate-900' },
];

export function CuratedCollections() {
  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <SectionHeader 
        number={11} 
        title="Curated Collections" 
        subtitle="Handpicked lists for faster discovery." 
      />

      <div className="flex items-center gap-4 overflow-x-auto hide-scrollbar pb-4">
        {collections.map((collection, index) => (
          <div 
            key={index} 
            className={`flex-shrink-0 w-64 h-32 rounded-2xl bg-gradient-to-br ${collection.gradient} p-4 flex flex-col justify-end cursor-pointer hover:shadow-lg transition-shadow relative overflow-hidden group`}
          >
            {/* Subtle glow effect on hover */}
            <div className="absolute inset-0 bg-white/0 group-hover:bg-white/5 transition-colors" />
            
            <h3 className="text-white font-bold text-sm leading-tight mb-1 relative z-10">{collection.name}</h3>
            <p className="text-white/60 text-xs relative z-10">{collection.count} companies</p>
          </div>
        ))}
        
        <div className="flex-shrink-0 w-12 h-12 rounded-full bg-white shadow-sm border border-slate-100 flex items-center justify-center text-slate-400 cursor-pointer hover:text-slate-900 ml-2">
          <ChevronRight className="w-5 h-5" />
        </div>
      </div>
    </section>
  );
}
