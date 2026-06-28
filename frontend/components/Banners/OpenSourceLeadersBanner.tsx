import React from 'react';
import { ChevronRight, Star } from 'lucide-react';
import { Company } from '../../types/api';
import { CompanyLogo } from '../CompanyLogo';

export function OpenSourceLeadersBanner({ companies }: { companies: Company[] }) {
  const leaders = companies.slice(0, 4);

  return (
    <div className="w-full bg-gradient-to-r from-emerald-950 to-teal-950 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-3 mb-8">
          <div className="flex-shrink-0 w-6 h-6 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center text-xs font-bold border border-emerald-500/30">
            10
          </div>
          <div>
            <h2 className="text-xl sm:text-2xl font-bold text-white">Open Source AI Leaders</h2>
            <p className="text-emerald-200/60 text-sm mt-1">Leading the open source movement.</p>
          </div>
        </div>

        <div className="flex items-center gap-6 overflow-x-auto hide-scrollbar">
          {leaders.map((c, i) => {
            const stars = [160, 28, 15, 9][i] || 10;
            return (
              <div key={c.id} className="flex-shrink-0 flex items-center gap-3 cursor-pointer group">
                <div className="w-10 h-10 rounded-md overflow-hidden shrink-0 bg-white/10 p-1">
                  <CompanyLogo url={c.logo_url} name={c.name} className="w-full h-full object-contain rounded-sm text-sm" />
                </div>
                <div>
                  <h4 className="font-bold text-white text-base leading-none mb-1 group-hover:text-emerald-400 transition-colors">{c.name}</h4>
                  <div className="flex items-center gap-1 text-emerald-200/80 text-xs font-medium">
                    {stars}K <Star className="w-3 h-3 fill-emerald-400 text-emerald-400" />
                  </div>
                </div>
              </div>
            );
          })}
          <div className="flex-shrink-0 w-12 h-12 rounded-full bg-white/10 border border-white/10 flex items-center justify-center text-white cursor-pointer hover:bg-white/20 ml-auto">
            <ChevronRight className="w-5 h-5" />
          </div>
        </div>
      </div>
    </div>
  );
}
