import React from 'react';
import { ChevronRight } from 'lucide-react';
import { Company } from '../../types/api';
import { CompanyLogo } from '../CompanyLogo';

export function UnicornsBanner({ companies }: { companies: Company[] }) {
  const unicorns = companies.filter(c => c.is_unicorn).slice(0, 6);

  return (
    <div className="w-full bg-gradient-to-r from-pink-50 to-purple-50 border-y border-pink-100 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-3 mb-8">
          <div className="flex-shrink-0 w-6 h-6 rounded-full bg-brand-pink text-white flex items-center justify-center text-xs font-bold">
            8
          </div>
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900">Companies valued at $1B+</h2>
        </div>

        <div className="flex items-center gap-4 overflow-x-auto hide-scrollbar">
          {unicorns.map(c => (
            <div key={c.id} className="flex-shrink-0 flex items-center gap-3 bg-white/60 backdrop-blur-sm border border-white rounded-xl px-5 py-3 hover:bg-white transition-colors cursor-pointer">
              <div className="w-8 h-8 rounded-md overflow-hidden shrink-0">
                <CompanyLogo url={c.logo_url} name={c.name} className="w-full h-full object-cover text-xs" />
              </div>
              <div>
                <h4 className="font-bold text-slate-900 text-sm leading-none mb-1">{c.name}</h4>
                <p className="text-xs text-brand-pink font-semibold">
                  ${c.valuation ? (c.valuation / 100000000000).toFixed(1) : '1.0'}B+
                </p>
              </div>
            </div>
          ))}
          <div className="flex-shrink-0 w-12 h-12 rounded-full bg-white shadow-sm border border-slate-100 flex items-center justify-center text-slate-400 cursor-pointer hover:text-slate-900 ml-4">
            <ChevronRight className="w-5 h-5" />
          </div>
        </div>
      </div>
    </div>
  );
}
