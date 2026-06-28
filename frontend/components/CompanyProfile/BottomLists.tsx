import React from 'react';
import { Company } from '@/types/api';
import { CompanyLogo } from '../CompanyLogo';
import { ArrowRight } from 'lucide-react';

export function BottomLists({ similarCompanies }: { similarCompanies: Company[] }) {
  return (
    <section className="py-12 border-t border-slate-100 bg-slate-50/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-16">
          
          {/* Alumni */}
          <div>
            <h2 className="text-lg font-bold text-slate-900 mb-6">16. Alumni Companies</h2>
            <p className="text-sm text-slate-500 italic py-2">No alumni data available.</p>
            <button className="mt-4 flex items-center gap-2 text-brand-red font-semibold hover:text-brand-pink transition-colors text-sm">
              View all alumni companies <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          {/* Collections */}
          <div>
            <h2 className="text-lg font-bold text-slate-900 mb-6">17. Collections</h2>
            <p className="text-sm text-slate-500 italic py-2">No collections available.</p>
            <button className="mt-4 flex items-center gap-2 text-brand-red font-semibold hover:text-brand-pink transition-colors text-sm">
              View all collections <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          {/* Similar Companies */}
          <div>
            <h2 className="text-lg font-bold text-slate-900 mb-6">18. Similar Companies</h2>
            {similarCompanies && similarCompanies.length > 0 ? (
              <div className="flex flex-col gap-4">
                {similarCompanies.slice(0, 5).map((c, i) => (
                  <div key={i} className="flex items-center gap-3 group cursor-pointer">
                    <div className="w-6 h-6 rounded-md overflow-hidden shrink-0">
                      <CompanyLogo url={c.logo_url} name={c.name} className="w-full h-full object-cover text-[10px]" />
                    </div>
                    <span className="text-sm font-semibold text-slate-600 group-hover:text-brand-red transition-colors">
                      {c.name}
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-slate-500 italic py-2">No similar companies found.</p>
            )}
            <button className="mt-4 flex items-center gap-2 text-brand-red font-semibold hover:text-brand-pink transition-colors text-sm">
              View more similar companies <ArrowRight className="w-4 h-4" />
            </button>
          </div>

        </div>
      </div>
    </section>
  );
}
