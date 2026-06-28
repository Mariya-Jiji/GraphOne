import React from 'react';
import { SectionHeader } from './SectionHeader';
import { Company } from '../types/api';
import { CompanyLogo } from './CompanyLogo';

function getGradientClasses(index: number) {
  const gradients = [
    'from-blue-50 to-purple-50',
    'from-slate-50 to-slate-100',
    'from-orange-50 to-amber-50',
    'from-yellow-50 to-orange-100',
  ];
  return gradients[index % gradients.length];
}

export function EmergingStartupsSection({ companies }: { companies: Company[] }) {
  const displayed = companies.slice(0, 4);

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <SectionHeader 
        number={3} 
        title="Emerging AI Startups to Watch" 
        subtitle="Promising early-stage companies gaining real traction." 
        viewAll 
      />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {displayed.map((company, index) => (
          <div 
            key={company.id} 
            className={`relative rounded-2xl overflow-hidden bg-gradient-to-br ${getGradientClasses(index)} p-6 flex flex-col justify-between h-[240px] shadow-sm hover:shadow-md transition-shadow cursor-pointer`}
          >
            <div className="flex justify-between items-start mb-4">
              <h3 className="text-xl font-bold text-slate-900 leading-tight pr-4">{company.name}</h3>
              <div className="w-10 h-10 rounded-xl bg-white shadow-sm flex items-center justify-center shrink-0 overflow-hidden text-lg font-bold">
                <CompanyLogo url={company.logo_url} name={company.name} className="w-full h-full object-cover" />
              </div>
            </div>
            
            <p className="text-slate-600 text-sm mb-4 font-medium">{company.category}</p>
            
            <p className="text-slate-700 text-sm font-semibold mb-6 flex-1 line-clamp-3">
              {company.description || 'Building the future of artificial intelligence.'}
            </p>
            
            <div className="flex items-center gap-2 text-xs text-slate-500 mt-auto border-t border-black/5 pt-3">
              <span>{company.founded_year || '2023'}</span>
              <span>•</span>
              <span>{company.employee_count ? `${company.employee_count} employees` : '1-50 employees'}</span>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
