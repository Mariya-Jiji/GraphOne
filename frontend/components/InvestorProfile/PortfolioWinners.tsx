import React from 'react';
import { SectionHeader } from '../SectionHeader';
import { FundingRound } from '@/types/api';
import { CompanyLogo } from '../CompanyLogo';
import { AlertCircle } from 'lucide-react';
import Link from 'next/link';

interface Props {
  investments: FundingRound[];
}

export function PortfolioWinners({ investments }: Props) {
  // Extract unique companies that are unicorns
  const uniqueCompanies = new Map();
  investments.forEach(inv => {
    const company = inv.company;
    if (company && !uniqueCompanies.has(company.id)) {
      uniqueCompanies.set(company.id, company);
    }
  });

  const companies = Array.from(uniqueCompanies.values());
  const unicorns = companies.filter(c => c.is_unicorn);
  
  // Stats
  const unicornCount = unicorns.length;

  return (
    <section className="py-12 border-t border-slate-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          
          {/* Portfolio Winners */}
          <div>
            <SectionHeader number={5} title="Portfolio Winners" />
            
            <div className="mt-8">
              <h4 className="text-sm font-medium text-slate-500 mb-4">Notable Winners</h4>
              <div className="flex flex-wrap gap-4 mb-8">
                {unicorns.length > 0 ? unicorns.map((company, idx) => (
                  <Link key={idx} href={`/companies/${company.slug}`}>
                    <div className="w-32 h-12 bg-white border border-slate-200 rounded-lg flex items-center justify-center p-2 hover:border-brand-red transition-colors shadow-sm cursor-pointer">
                      <CompanyLogo url={company.logo_url} name={company.name} className="w-full h-full object-contain" />
                    </div>
                  </Link>
                )) : (
                  <p className="text-slate-400 text-sm">No unicorns tracked in dataset.</p>
                )}
              </div>

              <h4 className="text-sm font-medium text-slate-500 mb-4">Outcome Breakdown</h4>
              <div className="grid grid-cols-4 gap-4">
                <div className="flex flex-col items-center justify-center p-4 bg-white border border-slate-200 rounded-xl">
                  <span className="text-2xl font-bold text-blue-600 mb-1">{unicornCount}</span>
                  <span className="text-xs font-medium text-slate-500 text-center">Unicorns</span>
                </div>
                <div className="flex flex-col items-center justify-center p-4 bg-white border border-slate-200 rounded-xl opacity-60">
                  <span className="text-xl font-bold text-slate-400 mb-1">N/A</span>
                  <span className="text-xs font-medium text-slate-500 text-center">IPOs</span>
                </div>
                <div className="flex flex-col items-center justify-center p-4 bg-white border border-slate-200 rounded-xl opacity-60">
                  <span className="text-xl font-bold text-slate-400 mb-1">N/A</span>
                  <span className="text-xs font-medium text-slate-500 text-center">Acquisitions</span>
                </div>
                <div className="flex flex-col items-center justify-center p-4 bg-white border border-slate-200 rounded-xl opacity-60">
                  <span className="text-xl font-bold text-slate-400 mb-1">N/A</span>
                  <span className="text-xs font-medium text-slate-500 text-center">Active</span>
                </div>
              </div>
            </div>
          </div>

          {/* Follow-On Strength */}
          <div>
            <SectionHeader number={6} title="Follow-On Strength" />
            <div className="mt-8 flex flex-col items-center justify-center h-[260px] border border-dashed border-slate-200 rounded-3xl bg-slate-50 p-8 text-center relative overflow-hidden">
              <AlertCircle className="w-10 h-10 text-slate-300 mb-4" />
              <h3 className="text-slate-900 font-bold mb-2">Follow-on tracking not available</h3>
              <p className="text-slate-500 text-sm max-w-sm">
                Detailed follow-on investment rates, average time between rounds, and funding growth metrics are not available in the current dataset.
              </p>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
