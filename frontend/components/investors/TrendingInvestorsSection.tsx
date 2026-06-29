import React from 'react';
import { SectionHeader } from '../SectionHeader';
import { Investor } from '../../types/api';
import { ArrowRight, Flame } from 'lucide-react';
import Link from 'next/link';

function getGradientClasses(index: number) {
  const gradients = [
    'from-[#1e1b4b] to-[#312e81]',
    'from-[#0f172a] to-[#1e293b]',
    'from-[#2e1065] to-[#4c1d95]',
    'from-[#450a0a] to-[#7f1d1d]',
    'from-[#064e3b] to-[#065f46]',
    'from-[#3b0764] to-[#6b21a8]',
  ];
  return gradients[index % gradients.length];
}

export function TrendingInvestorsSection({ investors }: { investors: Investor[] }) {
  // Sort by portfolio_count or aum and take top 6
  const trending = [...investors]
    .sort((a, b) => (b.portfolio_count || 0) - (a.portfolio_count || 0))
    .slice(0, 6);

  if (trending.length === 0) return null;

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <SectionHeader 
        number={1} 
        title="Trending Investors" 
        subtitle="The most active and viewed investors backing AI companies right now." 
        viewAll 
      />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {trending.map((investor, index) => (
          <div 
            key={investor.id} 
            className={`relative rounded-2xl overflow-hidden bg-gradient-to-br ${getGradientClasses(index)} text-white p-6 flex flex-col justify-between h-[250px] shadow-lg group hover:shadow-xl transition-shadow cursor-pointer`}
          >
            {/* Background glowing effects */}
            <div className="absolute right-0 bottom-0 w-32 h-32 bg-white/10 blur-2xl rounded-full translate-x-1/4 translate-y-1/4" />
            
            <div className="relative z-10 flex justify-between items-start">
              <div className="w-10 h-10 rounded-full border border-white/20 flex items-center justify-center text-sm font-bold bg-white/5 backdrop-blur-sm overflow-hidden">
                {investor.logo_url ? (
                  <img src={investor.logo_url} alt={investor.name} className="w-full h-full object-cover" />
                ) : (
                  <span>0{index + 1}</span>
                )}
              </div>
              <div className="flex items-center gap-1 bg-white/10 text-white px-2 py-1 rounded-md text-xs font-medium backdrop-blur-sm border border-white/10">
                <Flame className="w-3 h-3 text-brand-pink" />
                Trending
              </div>
            </div>
            
            <div className="relative z-10 mt-auto">
              <h3 className="text-2xl font-bold mb-2">{investor.name}</h3>
              <p className="text-white/70 text-sm mb-4 line-clamp-1">
                {investor.sector_focus?.join(', ') || investor.type || 'Venture Capital'}
              </p>
              
              <div className="pt-4 border-t border-white/10 mt-2">
                <Link href={`/investors/${investor.slug}`} className="flex items-center gap-2 text-sm font-medium text-white hover:text-brand-pink transition-colors">
                  View portfolio <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
