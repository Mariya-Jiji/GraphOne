import React from 'react';
import { Founder } from '@/types/api';
import { ArrowRight } from 'lucide-react';
import { CompanyLogo } from '../CompanyLogo';

export function FoundersSection({ founders }: { founders: Founder[] }) {
  if (!founders || founders.length === 0) return null;

  return (
    <section id="leadership" className="py-12 border-t border-slate-100 scroll-mt-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-xl sm:text-2xl font-bold text-slate-900 mb-8">6. Founders & Leadership</h2>
        
        <div className="flex flex-wrap items-center justify-between gap-8">
          <div className="flex flex-wrap items-center gap-8 lg:gap-16">
            {founders.map((f, i) => (
              <div key={i} className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-full overflow-hidden bg-slate-100 shrink-0 border border-slate-200">
                  <CompanyLogo url={f.photo_url} name={f.name} className="w-full h-full object-cover text-xl" />
                </div>
                <div>
                  <h4 className="font-bold text-slate-900 leading-tight">{f.name}</h4>
                  <p className="text-sm text-slate-500 mt-1">{f.title || 'Founder'}</p>
                </div>
              </div>
            ))}
          </div>

          <button className="flex items-center gap-2 text-brand-red font-semibold hover:text-brand-pink transition-colors text-sm">
            View all leadership <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </section>
  );
}
