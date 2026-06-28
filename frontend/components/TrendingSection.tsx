import React from 'react';
import { SectionHeader } from './SectionHeader';
import { fetchTrendingCompanies } from '../lib/api';
import { Flame, ChevronRight } from 'lucide-react';
import Image from 'next/image';

function getGradientClasses(index: number) {
  const gradients = [
    'from-[#1e1b4b] to-[#312e81]',
    'from-[#0f172a] to-[#1e293b]',
    'from-[#2e1065] to-[#4c1d95]',
  ];
  return gradients[index % gradients.length];
}

export async function TrendingSection() {
  const { data: companies } = await fetchTrendingCompanies();
  const featured = companies.slice(0, 3);
  const listItems = companies.slice(3, 5);

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <SectionHeader 
        number={1} 
        title="Trending AI Companies" 
        subtitle="The most searched, viewed and discussed AI companies right now." 
        viewAll 
      />

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Featured Cards */}
        {featured.map((company, index) => (
          <div 
            key={company.id} 
            className={`relative lg:col-span-1 rounded-2xl overflow-hidden bg-gradient-to-br ${getGradientClasses(index)} text-white p-6 flex flex-col justify-between h-[300px] shadow-lg group hover:shadow-xl transition-shadow cursor-pointer`}
          >
            {/* Background glowing effects */}
            <div className="absolute right-0 bottom-0 w-32 h-32 bg-white/10 blur-2xl rounded-full translate-x-1/4 translate-y-1/4" />
            
            <div className="relative z-10 flex justify-between items-start">
              <div className="w-8 h-8 rounded-full border border-white/20 flex items-center justify-center text-xs bg-white/5 backdrop-blur-sm">
                0{index + 1}
              </div>
            </div>
            
            <div className="relative z-10 mt-auto">
              <h3 className="text-2xl font-bold mb-2">{company.name}</h3>
              <p className="text-white/70 text-sm mb-4 line-clamp-2">{company.category || 'AI Company'}</p>
              <p className="text-white/60 text-xs mb-4 line-clamp-2">{company.description}</p>
              
              <div className="flex items-center gap-4 text-xs font-medium">
                <div className="flex items-center gap-1 bg-brand-red/20 text-brand-red px-2 py-1 rounded-md">
                  <Flame className="w-3 h-3" />
                  Trending #{index + 1}
                </div>
                <span className="text-white/60">{company.trending_score?.toFixed(1) || '0.0'} score</span>
              </div>
            </div>
          </div>
        ))}

        {/* List Items */}
        <div className="lg:col-span-1 flex flex-col gap-4">
          {listItems.map((company, index) => (
            <div 
              key={company.id}
              className="bg-slate-50 border border-slate-100 rounded-2xl p-4 flex items-center justify-between group hover:bg-slate-100 hover:border-slate-200 transition-all cursor-pointer h-[142px]"
            >
              <div className="flex items-center gap-4">
                <div className="w-8 h-8 rounded-md bg-slate-900 text-white flex items-center justify-center text-xs font-bold shrink-0">
                  0{index + 4}
                </div>
                <div>
                  <h4 className="font-bold text-slate-900">{company.name}</h4>
                  <p className="text-xs text-slate-500 mb-2">{company.category}</p>
                  <p className="text-xs text-slate-400 font-medium">{company.trending_score?.toFixed(1) || '0.0'} score</p>
                </div>
              </div>
              <div className="w-8 h-8 rounded-full bg-white shadow-sm flex items-center justify-center text-slate-400 group-hover:text-slate-900 transition-colors">
                <ChevronRight className="w-4 h-4" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
