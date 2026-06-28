import React from 'react';
import { Company, Product } from '@/types/api';
import { ChevronLeft, ChevronRight } from 'lucide-react';

export function TimelineSection({ company, products }: { company: Company; products: Product[] }) {
  // Build milestones
  const milestones = [];
  
  if (company.founded_year) {
    milestones.push({
      year: company.founded_year.toString(),
      label: `${company.name}\nFounded`,
      date: new Date(`${company.founded_year}-01-01`),
    });
  }

  products.forEach(p => {
    if (p.launch_date) {
      milestones.push({
        year: new Date(p.launch_date).getFullYear().toString(),
        label: `${p.name}\nLaunched`,
        date: new Date(p.launch_date),
      });
    }
  });

  // Sort by date
  milestones.sort((a, b) => a.date.getTime() - b.date.getTime());

  // Show empty state if not enough data
  if (milestones.length === 0) {
    return null;
  }

  return (
    <section id="timeline" className="py-12 border-t border-slate-100 scroll-mt-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-12">
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900">2. Timeline</h2>
          <div className="flex items-center gap-2">
            <button className="w-8 h-8 rounded-full border border-slate-200 flex items-center justify-center hover:bg-slate-50 transition-colors text-slate-400">
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button className="w-8 h-8 rounded-full border border-slate-200 flex items-center justify-center hover:bg-slate-50 transition-colors text-slate-400">
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        <div className="relative pt-8 pb-12 overflow-x-auto hide-scrollbar">
          {/* Connecting Line */}
          <div className="absolute top-[39px] left-8 right-8 h-[2px] bg-brand-pink/20 -z-10" />

          <div className="flex justify-between min-w-[800px]">
            {milestones.map((m, i) => (
              <div key={i} className="flex flex-col items-center flex-1 px-4 text-center">
                <span className="text-sm font-bold text-slate-900 mb-4">{m.year}</span>
                
                {/* Marker */}
                <div className="w-4 h-4 rounded-full bg-white border-2 border-brand-red flex items-center justify-center shadow-sm relative z-10 mb-4">
                  <div className="w-1.5 h-1.5 rounded-full bg-brand-red" />
                </div>
                
                <span className="text-xs font-semibold text-slate-600 whitespace-pre-line leading-tight">
                  {m.label}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
