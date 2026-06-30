import React from 'react';
import { SectionHeader } from '../SectionHeader';
import { Investor } from '../../types/api';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { CompanyLogo } from '../CompanyLogo';

export function EmergingInvestorsSection({ investors }: { investors: Investor[] }) {
  // Sort by lowest portfolio count to find "emerging" (or use a founded_year filter if available)
  const emerging = [...investors]
    .filter(i => (i.portfolio_count || 0) < 20) // Just a heuristic
    .sort((a, b) => (b.founded_year || 0) - (a.founded_year || 0))
    .slice(0, 8);

  if (emerging.length === 0) return null;

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <SectionHeader 
        number={7} 
        title="Emerging Investors" 
        subtitle="New funds, solo capitalists, and rising operators backing early-stage AI." 
        viewAll 
      />

      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-4">
        {emerging.map(investor => (
          <Link 
            href={`/investors/${investor.slug}`}
            key={investor.id}
            className="flex flex-col items-center p-4 bg-white border border-slate-200 rounded-xl hover:border-brand-pink hover:shadow-md transition-all group"
          >
            <div className="w-14 h-14 rounded-lg bg-slate-50 border border-slate-100 flex items-center justify-center overflow-hidden mb-3">
              <CompanyLogo logoUrl={investor.logo_url} name={investor.name} className="w-full h-full object-cover" />
            </div>
            <h4 className="font-semibold text-sm text-slate-900 text-center line-clamp-2 leading-tight group-hover:text-brand-pink transition-colors">
              {investor.name}
            </h4>
          </Link>
        ))}
      </div>
    </section>
  );
}
