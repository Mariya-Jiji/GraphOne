import React from 'react';
import { SectionHeader } from '../SectionHeader';
import { Investor } from '@/types/api';
import { CompanyLogo } from '../CompanyLogo';
import { Newspaper } from 'lucide-react';
import Link from 'next/link';

interface Props {
  relatedInvestors: Investor[];
}

export function ResearchAndRelated({ relatedInvestors }: Props) {
  return (
    <section className="py-12 border-t border-slate-100 mb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          
          {/* Research & Mentions */}
          <div>
            <div className="flex items-center justify-between mb-8">
              <SectionHeader number={9} title="Research & Mentions" />
              <Link href="#" className="text-brand-red font-medium hover:text-red-700 transition-colors text-sm">
                View all research →
              </Link>
            </div>
            
            <div className="mt-8 flex flex-col items-center justify-center p-12 border border-slate-200 rounded-3xl bg-slate-50/50 text-center">
              <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center mb-4 text-slate-400">
                <Newspaper className="w-6 h-6" />
              </div>
              <h3 className="text-slate-900 font-medium mb-1">No Recent Mentions</h3>
              <p className="text-slate-500 text-sm max-w-sm">
                There are no recent news articles or research reports tracking this investor in the current dataset.
              </p>
            </div>
          </div>

          {/* Related Investors */}
          <div>
            <SectionHeader number={10} title="Related Investors" />
            
            <div className="mt-8 grid grid-cols-2 gap-4">
              {relatedInvestors.length > 0 ? relatedInvestors.slice(0, 4).map((investor, idx) => (
                <Link key={idx} href={`/investors/${investor.slug}`}>
                  <div className="flex flex-col p-6 bg-white border border-slate-200 rounded-2xl hover:border-brand-red hover:shadow-md transition-all cursor-pointer h-full">
                    <div className="flex items-center gap-4 mb-4">
                      <div className="w-12 h-12 bg-white border border-slate-100 shadow-sm rounded-xl flex items-center justify-center p-1">
                        <CompanyLogo url={investor.logo_url} name={investor.name} className="w-full h-full object-contain" />
                      </div>
                      <div>
                        <h4 className="font-bold text-slate-900 text-sm leading-tight">{investor.name}</h4>
                      </div>
                    </div>
                    <p className="text-slate-500 text-xs line-clamp-2">
                      {investor.type ? investor.type.split(',')[0].trim() : 'Venture Capital'}
                    </p>
                  </div>
                </Link>
              )) : (
                <div className="col-span-2 text-slate-400 text-sm italic">
                  No related investors found.
                </div>
              )}
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
