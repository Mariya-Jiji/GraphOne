import React from 'react';
import { ChevronRight } from 'lucide-react';
import { Company } from '../types/api';
import { fetchCompanyFunding } from '../lib/api';

interface ListColumnProps {
  number: number;
  title: string;
  items: Company[];
  metadataRender: (company: Company) => string;
}

function ListColumn({ number, title, items, metadataRender }: ListColumnProps) {
  return (
    <div className="flex-1 bg-slate-50 rounded-2xl p-6 flex flex-col">
      <div className="flex items-center gap-3 mb-6">
        <div className="flex-shrink-0 w-5 h-5 rounded-full bg-brand-pink/20 text-brand-pink flex items-center justify-center text-[10px] font-bold">
          {number}
        </div>
        <h3 className="text-lg font-bold text-slate-900">{title}</h3>
      </div>

      <div className="flex flex-col gap-5 flex-1">
        {items.map((company) => (
          <div key={company.id} className="flex items-start gap-4 group cursor-pointer">
            <div className="w-10 h-10 rounded-lg bg-white shadow-sm flex items-center justify-center overflow-hidden shrink-0 border border-slate-100">
              {company.logo_url ? (
                <img src={company.logo_url} alt={company.name} className="w-full h-full object-cover" />
              ) : (
                <span className="font-bold text-slate-400">{company.name.charAt(0)}</span>
              )}
            </div>
            <div>
              <h4 className="font-bold text-slate-900 group-hover:text-brand-red transition-colors text-sm">{company.name}</h4>
              <p className="text-xs text-slate-500 mt-1">{metadataRender(company)}</p>
            </div>
          </div>
        ))}
      </div>

      <button className="mt-8 w-full flex items-center justify-center gap-1 text-sm font-medium text-slate-600 hover:text-slate-900 bg-white border border-slate-200 py-2.5 rounded-xl hover:shadow-sm transition-all">
        View all <ChevronRight className="w-4 h-4" />
      </button>
    </div>
  );
}

export async function ThreeColumnRows({ companies }: { companies: Company[] }) {
  // Mock different subsets of companies for each column based on the requirements
  const breakout = companies.slice(0, 3);
  const fundedRaw = companies.slice(3, 6);
  const watch = companies.slice(6, 9);

  const funded = await Promise.all(
    fundedRaw.map(async (company) => {
      try {
        const { data } = await fetchCompanyFunding(company.slug);
        const latestRound = data?.rounds?.[0];
        if (latestRound) {
          const amountStr = latestRound.amount ? `$${(latestRound.amount / 100000000).toFixed(1)}M` : 'Undisclosed';
          const dateStr = new Date(latestRound.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
          return { ...company, _fundingStr: `${amountStr} ${latestRound.round_type || 'Round'} • ${dateStr}` };
        }
      } catch (e) {
        // Silently fallback if fetch fails
      }
      return company;
    })
  );

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <div className="flex flex-col md:flex-row gap-6">
        <ListColumn 
          number={5} 
          title="Breakout Companies" 
          items={breakout} 
          metadataRender={(c) => c.description || 'Companies making moves.'} 
        />
        <ListColumn 
          number={6} 
          title="Recently Funded AI Startups" 
          items={funded} 
          metadataRender={(c) => (c as any)._fundingStr || `$${((c.funding_total || 0) / 100000000).toFixed(1)}M Series • ${new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}`} 
        />
        <ListColumn 
          number={7} 
          title="Startups to Watch" 
          items={watch} 
          metadataRender={(c) => c.category || 'High potential companies.'} 
        />
      </div>
    </section>
  );
}
