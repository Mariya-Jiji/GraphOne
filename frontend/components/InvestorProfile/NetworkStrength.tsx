import React from 'react';
import { SectionHeader } from '../SectionHeader';
import { Investor } from '@/types/api';
import { CompanyLogo } from '../CompanyLogo';
import Link from 'next/link';
import { Users, Link as LinkIcon, Building2, Globe2 } from 'lucide-react';

interface Props {
  coInvestors: { investor: Investor, count: number }[];
}

export function NetworkStrength({ coInvestors }: Props) {
  // Take top co-investors
  const topPartners = [...coInvestors].sort((a, b) => b.count - a.count).slice(0, 5);

  return (
    <section className="py-12 border-t border-slate-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          
          {/* Network Strength */}
          <div>
            <SectionHeader number={7} title="Network Strength" />
            <div className="mt-8 grid grid-cols-2 gap-4">
              <div className="flex flex-col items-center justify-center p-6 bg-white border border-slate-200 rounded-2xl shadow-sm hover:shadow-md transition-shadow">
                <LinkIcon className="w-8 h-8 text-brand-red mb-3" />
                <span className="text-sm font-semibold text-slate-900 text-center">Most Connected Founder</span>
                <span className="text-xs text-slate-500 mt-1">Data not tracked</span>
              </div>
              <div className="flex flex-col items-center justify-center p-6 bg-white border border-slate-200 rounded-2xl shadow-sm hover:shadow-md transition-shadow">
                <Building2 className="w-8 h-8 text-emerald-500 mb-3" />
                <span className="text-sm font-semibold text-slate-900 text-center">Most Connected Startup</span>
                <span className="text-xs text-slate-500 mt-1">Data not tracked</span>
              </div>
              <div className="flex flex-col items-center justify-center p-6 bg-white border border-slate-200 rounded-2xl shadow-sm hover:shadow-md transition-shadow">
                <Users className="w-8 h-8 text-blue-500 mb-3" />
                <span className="text-sm font-semibold text-slate-900 text-center">Most Active Co-Investor</span>
                <span className="text-sm font-bold text-slate-900 mt-1 truncate max-w-full px-2">
                  {topPartners.length > 0 ? topPartners[0].investor.name : 'N/A'}
                </span>
              </div>
              <div className="flex flex-col items-center justify-center p-6 bg-white border border-slate-200 rounded-2xl shadow-sm hover:shadow-md transition-shadow">
                <Globe2 className="w-8 h-8 text-purple-500 mb-3" />
                <span className="text-sm font-semibold text-slate-900 text-center">Largest Founder Network</span>
                <span className="text-xs text-slate-500 mt-1">Data not tracked</span>
              </div>
            </div>
          </div>

          {/* Co-Investor Network */}
          <div>
            <div className="flex items-center justify-between mb-8">
              <SectionHeader number={8} title="Co-Investor Network" />
              <Link href="#" className="text-brand-red font-medium hover:text-red-700 transition-colors text-sm">
                View all co-investors →
              </Link>
            </div>
            
            <div className="mt-8 border border-slate-200 rounded-3xl p-8 bg-white h-[280px]">
              <h4 className="text-sm font-medium text-slate-500 mb-6 uppercase tracking-wider">Most Frequent Co-Investors</h4>
              
              <div className="flex flex-wrap gap-6 items-center">
                {topPartners.length > 0 ? topPartners.map((partner, idx) => (
                  <Link key={idx} href={`/investors/${partner.investor.slug}`} title={`${partner.investor.name} (${partner.count} co-investments)`}>
                    <div className="w-24 h-16 bg-white border border-slate-100 shadow-sm rounded-xl flex items-center justify-center p-2 hover:border-brand-red transition-all hover:scale-105 cursor-pointer">
                      <CompanyLogo url={partner.investor.logo_url} name={partner.investor.name} className="w-full h-full object-contain" />
                    </div>
                  </Link>
                )) : (
                  <div className="text-slate-400 text-sm italic">No co-investors tracked.</div>
                )}
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
