'use client';

import React from 'react';
import { AreaChart, Area, ResponsiveContainer } from 'recharts';
import { ChevronRight } from 'lucide-react';
import { SectionHeader } from './SectionHeader';
import { Company } from '../types/api';
import { CompanyLogo } from './CompanyLogo';

// Generate fake sparkline data to visually match the screenshot
function generateSparklineData() {
  return Array.from({ length: 10 }).map((_, i) => ({
    value: 20 + Math.random() * 50 + (i * 5),
  }));
}

export function FastestGrowingSection({ companies }: { companies: Company[] }) {
  // Use first 5 companies for this section visually
  const displayed = companies.slice(0, 5);

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <SectionHeader 
        number={2} 
        title="Fastest Growing AI Companies" 
        subtitle="Companies showing strong momentum across key growth signals." 
        viewAll 
      />

      <div className="flex flex-col lg:flex-row gap-6">
        <div className="flex-1 grid grid-cols-2 md:grid-cols-5 gap-4">
          {displayed.map((company, index) => {
            const data = generateSparklineData();
            // Colors from screenshot: orange, purple, green, red, pink
            const colors = ['#f97316', '#a855f7', '#22c55e', '#ef4444', '#ec4899'];
            const color = colors[index % colors.length];

            return (
              <div key={company.id} className="bg-white border border-slate-100 shadow-sm rounded-2xl p-4 flex flex-col items-center justify-between group hover:shadow-md transition-all cursor-pointer overflow-hidden relative h-[200px]">
                <div className="w-12 h-12 rounded-xl mb-3 shadow-sm overflow-hidden bg-slate-50 flex items-center justify-center text-xl font-bold text-slate-800">
                  <CompanyLogo url={company.logo_url} name={company.name} className="w-full h-full object-cover" />
                </div>
                <h4 className="font-bold text-slate-900 text-center text-sm mb-1">{company.name}</h4>
                <p className="text-xs text-slate-500 text-center mb-4 z-10">{company.category}</p>
                
                <div className="absolute bottom-0 left-0 right-0 h-16 opacity-40 group-hover:opacity-60 transition-opacity">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={data}>
                      <defs>
                        <linearGradient id={`grad-${index}`} x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor={color} stopOpacity={0.8}/>
                          <stop offset="95%" stopColor={color} stopOpacity={0}/>
                        </linearGradient>
                      </defs>
                      <Area type="monotone" dataKey="value" stroke={color} strokeWidth={2} fillOpacity={1} fill={`url(#grad-${index})`} />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </div>
            );
          })}
        </div>

        <div className="w-full lg:w-[300px] rounded-2xl bg-slate-50 border border-slate-100 p-6 flex flex-col justify-between h-[200px] shadow-sm relative overflow-hidden">
          <div className="absolute right-0 top-0 w-32 h-32 bg-blue-100/50 rounded-full blur-2xl translate-x-1/2 -translate-y-1/2" />
          <div className="relative z-10">
            <h3 className="text-xl font-bold text-slate-900 mb-2 leading-tight">Explore tomorrow&apos;s market leaders today.</h3>
            <p className="text-xs text-slate-500 mb-4">Discover companies with the highest growth potential across the AI landscape.</p>
          </div>
          <button className="relative z-10 bg-slate-900 hover:bg-slate-800 text-white text-xs font-medium px-4 py-2 rounded-full inline-flex items-center w-max transition-colors">
            Explore Growth Leaders <ChevronRight className="w-3 h-3 ml-1" />
          </button>
        </div>
      </div>
    </section>
  );
}
