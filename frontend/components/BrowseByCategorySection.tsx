'use client';

import React from 'react';
import { SectionHeader } from './SectionHeader';
import { Sparkles, Code2, Search, Video, Mic, Server, HeartPulse, Cpu, ChevronRight } from 'lucide-react';

const categories = [
  { name: 'AI Agents', count: 1248, icon: Sparkles, color: 'text-purple-500', bg: 'bg-purple-100' },
  { name: 'AI Coding', count: 863, icon: Code2, color: 'text-green-500', bg: 'bg-green-100' },
  { name: 'AI Search', count: 324, icon: Search, color: 'text-blue-500', bg: 'bg-blue-100' },
  { name: 'AI Video', count: 662, icon: Video, color: 'text-pink-500', bg: 'bg-pink-100' },
  { name: 'AI Voice', count: 412, icon: Mic, color: 'text-orange-500', bg: 'bg-orange-100' },
  { name: 'AI Infrastructure', count: 972, icon: Server, color: 'text-teal-500', bg: 'bg-teal-100' },
  { name: 'Healthcare AI', count: 687, icon: HeartPulse, color: 'text-cyan-500', bg: 'bg-cyan-100' },
  { name: 'Robotics', count: 396, icon: Cpu, color: 'text-yellow-500', bg: 'bg-yellow-100' },
];

export function BrowseByCategorySection() {
  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 overflow-hidden">
      <SectionHeader 
        number={4} 
        title="Browse by Category" 
        subtitle="Explore companies by what they're building." 
      />

      <div className="relative">
        <div className="flex items-center gap-4 overflow-x-auto pb-4 hide-scrollbar -mx-4 px-4 sm:mx-0 sm:px-0">
          {categories.map((cat, i) => {
            const Icon = cat.icon;
            return (
              <div key={i} className="flex-shrink-0 w-36 bg-white border border-slate-100 rounded-2xl p-4 flex flex-col items-center justify-center text-center cursor-pointer hover:shadow-md transition-shadow group">
                <div className={`w-12 h-12 rounded-full ${cat.bg} ${cat.color} flex items-center justify-center mb-3 group-hover:scale-110 transition-transform`}>
                  <Icon className="w-5 h-5" />
                </div>
                <h4 className="font-bold text-slate-900 text-sm mb-1">{cat.name}</h4>
                <p className="text-xs text-slate-500">{cat.count} companies</p>
              </div>
            );
          })}
          
          <div className="flex-shrink-0 w-12 h-12 rounded-full bg-white shadow-md border border-slate-100 flex items-center justify-center text-slate-400 cursor-pointer hover:text-slate-900 ml-2">
            <ChevronRight className="w-5 h-5" />
          </div>
        </div>
      </div>
    </section>
  );
}
