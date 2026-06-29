import React from 'react';
import { SectionHeader } from '../SectionHeader';
import { FundingRound } from '@/types/api';
import { CompanyLogo } from '../CompanyLogo';
import { ChevronRight } from 'lucide-react';
import Link from 'next/link';

interface Props {
  investments: FundingRound[];
}

export function RecentInvestments({ investments }: Props) {
  // Sort investments by date (descending) and take top 5
  const recent = [...investments]
    .sort((a, b) => {
      const d1 = new Date(a.date || 0).getTime();
      const d2 = new Date(b.date || 0).getTime();
      return d2 - d1;
    })
    .slice(0, 5);

  if (recent.length === 0) return null;

  return (
    <section className="py-12 border-t border-slate-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-8">
          <SectionHeader number={4} title="Recent Investments" />
          <Link href="#" className="flex items-center gap-1 text-brand-red font-medium hover:text-red-700 transition-colors text-sm">
            View all investments <ChevronRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
          {recent.map((inv, idx) => {
            const company = inv.company;
            
            // Format amount nicely
            let displayAmount = 'Undisclosed';
            if (inv.amount) {
              displayAmount = inv.amount >= 1e9 
                ? `$${(inv.amount / 1e9).toFixed(1)}B` 
                : inv.amount >= 1e6 
                  ? `$${(inv.amount / 1e6).toFixed(1)}M` 
                  : `$${inv.amount.toLocaleString()}`;
            }

            const dateStr = inv.date 
              ? new Date(inv.date).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })
              : 'Unknown date';

            return (
              <Link key={inv.id || idx} href={`/companies/${company?.slug || '#'}`}>
                <div className="group relative h-72 rounded-3xl overflow-hidden bg-slate-900 border border-slate-800 shadow-xl transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl hover:border-slate-700 p-6 flex flex-col justify-between">
                  {/* Subtle dark gradient overlay */}
                  <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent pointer-events-none" />
                  
                  {/* Company Logo */}
                  <div className="w-16 h-16 rounded-2xl bg-white p-2 shadow-sm relative z-10 mb-4">
                    <CompanyLogo url={company?.logo_url} name={company?.name || 'Company'} className="w-full h-full object-contain" />
                  </div>

                  <div className="relative z-10">
                    <h3 className="text-white font-bold text-lg mb-1 truncate">{company?.name || 'Unknown Company'}</h3>
                    <p className="text-slate-400 text-sm mb-4 truncate">{company?.category || 'Technology'}</p>

                    <div className="space-y-1">
                      <p className="text-slate-300 font-medium text-sm capitalize">{inv.round_type ? inv.round_type.replace('_', ' ') : 'Funding Round'}</p>
                      <p className="text-white font-bold text-xl">{displayAmount}</p>
                      <p className="text-slate-500 text-xs mt-1">{dateStr}</p>
                    </div>

                    {inv.lead_investor_id && (
                      <div className="mt-4 pt-3 border-t border-white/10">
                        <span className="text-xs font-semibold text-emerald-400 tracking-wide uppercase">Lead Investor</span>
                      </div>
                    )}
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}
