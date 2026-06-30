import React from 'react';
import { SectionHeader } from '../SectionHeader';
import { Investor } from '../../types/api';
import Link from 'next/link';
import { CompanyLogo } from '../CompanyLogo';

export function MostActiveInvestorsSection({ investors }: { investors: Investor[] }) {
  // Take top 4 most active
  const mostActive = investors.slice(0, 4);

  if (mostActive.length === 0) return null;

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <SectionHeader 
        number={4} 
        title="Most Active Investors" 
        subtitle="The firms deploying the most capital into AI companies this quarter." 
        viewAll 
      />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {mostActive.map((investor) => (
          <div key={investor.id} className="bg-white border border-slate-200 rounded-2xl p-6 hover:shadow-lg transition-shadow">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-16 h-16 rounded-xl border border-slate-100 bg-slate-50 flex items-center justify-center overflow-hidden shrink-0">
                <CompanyLogo logoUrl={investor.logo_url} name={investor.name} className="w-full h-full object-cover" />
              </div>
              <div>
                <Link href={`/investors/${investor.slug}`} className="font-bold text-lg text-slate-900 hover:text-brand-pink transition-colors">
                  {investor.name}
                </Link>
                <p className="text-sm text-slate-500">{investor.type || 'Venture Capital'}</p>
              </div>
            </div>

            <div className="mb-4">
              <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3">Notable Portfolio</h4>
              <div className="flex flex-col gap-2">
                {investor.portfolio && investor.portfolio.length > 0 ? (
                  investor.portfolio.slice(0, 3).map(company => (
                    <div key={company.id} className="flex items-center gap-2 text-sm">
                      <div className="w-6 h-6 rounded border border-slate-100 bg-slate-50 overflow-hidden shrink-0">
                        <CompanyLogo logoUrl={company.logo_url} name={company.name} className="w-full h-full object-cover text-[8px]" />
                      </div>
                      <span className="font-medium text-slate-700 truncate">{company.name}</span>
                    </div>
                  ))
                ) : (
                  <p className="text-sm text-slate-400">Portfolio data unavailable</p>
                )}
              </div>
            </div>
            
            {investor.portfolio_count && (
              <div className="pt-4 border-t border-slate-100 flex justify-between items-center text-sm">
                <span className="text-slate-500">Total Investments</span>
                <span className="font-bold text-slate-900">{investor.portfolio_count}</span>
              </div>
            )}
          </div>
        ))}
      </div>
    </section>
  );
}
