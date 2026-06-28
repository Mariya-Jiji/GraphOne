import React from 'react';
import { FundingRound } from '@/types/api';
import { CompanyLogo } from '../CompanyLogo';

export function InvestorsSection({ rounds }: { rounds: FundingRound[] }) {
  // Group investors by stage
  const seedInvestors = new Map();
  const seriesInvestors = new Map();
  const growthInvestors = new Map();

  rounds.forEach(r => {
    if (!r.lead_investor) return;

    const investor = r.lead_investor;
    const type = r.round_type.toLowerCase();

    if (type.includes('seed')) {
      seedInvestors.set(investor.id, investor);
    } else if (type.includes('series')) {
      seriesInvestors.set(investor.id, investor);
    } else {
      growthInvestors.set(investor.id, investor);
    }
  });

  const hasInvestors = seedInvestors.size > 0 || seriesInvestors.size > 0 || growthInvestors.size > 0;

  if (!hasInvestors) return null;

  const renderInvestorList = (title: string, investorsMap: Map<string, any>) => {
    const investors = Array.from(investorsMap.values());
    if (investors.length === 0) return null;

    return (
      <div className="flex-1">
        <h3 className="text-sm font-bold text-slate-900 mb-6">{title}</h3>
        <div className="flex flex-col gap-4">
          {investors.map((inv, idx) => (
            <div key={idx} className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-md overflow-hidden bg-slate-50 border border-slate-100 flex items-center justify-center shrink-0">
                <CompanyLogo url={inv.logo_url} name={inv.name} className="w-full h-full object-cover text-xs" />
              </div>
              <span className="text-sm text-slate-600 font-medium">{inv.name}</span>
            </div>
          ))}
        </div>
      </div>
    );
  };

  return (
    <section id="investors" className="py-12 border-t border-slate-100 scroll-mt-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-xl sm:text-2xl font-bold text-slate-900 mb-8">5. Investors</h2>
        
        <div className="flex flex-col md:flex-row gap-8 lg:gap-16">
          {renderInvestorList('Seed Investors', seedInvestors)}
          {renderInvestorList('Series Investors', seriesInvestors)}
          {renderInvestorList('Growth Investors', growthInvestors)}
        </div>
      </div>
    </section>
  );
}
