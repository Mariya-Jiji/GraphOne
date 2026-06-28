import React from 'react';
import { Company } from '@/types/api';
import { CompanyLogo } from '../CompanyLogo';

export function CompetitorsSection({ competitors }: { competitors: Company[] }) {
  if (!competitors || competitors.length === 0) return null;

  // Split competitors into direct and adjacent (arbitrary split if we don't have explicit relationship sub-types)
  const mid = Math.ceil(competitors.length / 2);
  const direct = competitors.slice(0, mid);
  const adjacent = competitors.slice(mid);

  const renderList = (title: string, list: Company[]) => {
    if (list.length === 0) return null;
    return (
      <div className="flex-1">
        <h3 className="text-sm font-bold text-slate-900 mb-6">{title}</h3>
        <div className="flex flex-wrap items-center gap-4">
          {list.map((c, i) => (
            <div key={i} className="flex items-center gap-3 bg-white shadow-sm border border-slate-100 rounded-full px-4 py-2 cursor-pointer hover:shadow-md hover:border-slate-200 transition-all">
              <div className="w-6 h-6 rounded-full overflow-hidden shrink-0">
                <CompanyLogo url={c.logo_url} name={c.name} className="w-full h-full object-cover text-[10px]" />
              </div>
              <span className="text-sm font-semibold text-slate-800">{c.name}</span>
            </div>
          ))}
        </div>
      </div>
    );
  };

  return (
    <section id="competitors" className="py-12 border-t border-slate-100 scroll-mt-24 bg-slate-50/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-xl sm:text-2xl font-bold text-slate-900 mb-8">10. Competitor Landscape</h2>
        
        <div className="flex flex-col md:flex-row gap-12 lg:gap-24">
          {renderList('Direct Competitors', direct)}
          {renderList('Adjacent Competitors', adjacent)}
        </div>
      </div>
    </section>
  );
}
