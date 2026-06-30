import React from 'react';
import { SectionHeader } from '../SectionHeader';
import { Company, Investor } from '../../types/api';
import Link from 'next/link';
import { Trophy } from 'lucide-react';
import { CompanyLogo } from '../CompanyLogo';

export function InvestorsBackingWinnersSection({ 
  companies,
  backersMap
}: { 
  companies: Company[];
  backersMap: Record<string, Investor[]>;
}) {
  if (companies.length === 0) return null;

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <SectionHeader 
        number={5} 
        title="Investors Backing Winners" 
        subtitle="The capital behind the defining AI companies of our generation." 
      />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {companies.map((company) => {
          const backers = backersMap[company.id] || [];
          
          return (
            <div key={company.id} className="bg-white border border-slate-200 rounded-2xl overflow-hidden flex flex-col">
              <div className="p-6 border-b border-slate-100 bg-slate-50 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl bg-white border border-slate-200 flex items-center justify-center overflow-hidden">
                    <CompanyLogo logoUrl={company.logo_url} name={company.name} className="w-full h-full object-cover" />
                  </div>
                  <div>
                    <h3 className="font-bold text-lg text-slate-900">{company.name}</h3>
                    <p className="text-xs font-medium text-brand-pink flex items-center gap-1">
                      <Trophy className="w-3 h-3" /> Unicorn
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="p-6 flex-1 bg-white">
                <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-4">Backed By</h4>
                <div className="flex flex-col gap-3">
                  {backers.length > 0 ? (
                    backers.map((investor, i) => (
                      <div key={`${investor.id}-${i}`} className="flex items-center justify-between group">
                        <div className="flex items-center gap-2">
                           <div className="w-5 h-5 rounded-full bg-slate-100 flex items-center justify-center overflow-hidden border border-slate-200 shrink-0">
                            <CompanyLogo logoUrl={investor.logo_url} name={investor.name} className="w-full h-full object-cover text-[9px]" />
                          </div>
                          <span className="text-sm font-semibold text-slate-700">{investor.name}</span>
                        </div>
                        <Link href={`/investors/${investor.slug}`} className="opacity-0 group-hover:opacity-100 text-xs text-brand-pink font-medium transition-opacity">
                          View Profile →
                        </Link>
                      </div>
                    ))
                  ) : (
                    <p className="text-sm text-slate-400">No public investors found.</p>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
