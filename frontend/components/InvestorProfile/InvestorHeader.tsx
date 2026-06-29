import React from 'react';
import { Investor } from '@/types/api';
import { CompanyLogo } from '../CompanyLogo';
import { BadgeCheck, MapPin, Calendar, Bookmark, Plus } from 'lucide-react';

export function InvestorHeader({ investor }: { investor: Investor }) {
  // Parse types into tags (assuming type is comma-separated like "VC, Growth Equity")
  const tags = investor.type 
    ? investor.type.split(',').map(t => t.trim()).filter(Boolean) 
    : ['Venture Capital'];

  // Handle optional fields that might not be strictly typed in the current schema yet
  // but are requested in the UI
  const location = investor.hq_country || 'Global';
  const foundedYear = investor.founded_year;

  return (
    <section id="overview" className="relative pt-12 pb-8 overflow-hidden">
      {/* Decorative background blob */}
      <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/3 w-[800px] h-[800px] bg-gradient-to-bl from-brand-pink/20 via-brand-red/5 to-transparent rounded-full blur-3xl -z-10 pointer-events-none" />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row gap-8 items-start">
          {/* Logo */}
          <div className="w-32 h-32 md:w-40 md:h-40 rounded-2xl overflow-hidden shrink-0 shadow-lg border border-slate-100 bg-white">
            <CompanyLogo url={investor.logo_url} name={investor.name} className="w-full h-full object-contain p-2" />
          </div>

          {/* Info */}
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <h1 className="text-4xl font-bold text-slate-900">{investor.name}</h1>
              {/* Green Verified Checkmark */}
              <BadgeCheck className="w-6 h-6 text-brand-red fill-white" />
            </div>
            
            <p className="text-lg text-slate-600 mb-6 max-w-3xl leading-relaxed">
              {investor.bio || `Leading investment firm focused on ${tags[0] || 'technology'} sectors.`}
            </p>

            {/* Metadata Grid */}
            <div className="flex flex-wrap items-center gap-x-6 gap-y-3 text-sm text-slate-500 mb-6">
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4" />
                {location}
              </div>
              {foundedYear && (
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4" />
                  Founded {foundedYear}
                </div>
              )}
            </div>

            {/* Category Tags */}
            <div className="flex flex-wrap gap-2 mb-8">
              {tags.map((tag, idx) => (
                <span key={idx} className="px-4 py-1.5 rounded-full border border-brand-pink/30 text-slate-600 bg-white text-sm font-medium">
                  {tag}
                </span>
              ))}
            </div>

            {/* Action Buttons */}
            <div className="flex items-center gap-3">
              <button className="flex items-center gap-2 px-6 py-2.5 bg-brand-red hover:bg-red-700 text-white font-medium rounded-xl transition-colors shadow-sm">
                <Plus className="w-4 h-4" />
                Follow Investor
              </button>
              <button className="flex items-center justify-center w-11 h-11 border border-slate-200 hover:border-slate-300 text-slate-600 rounded-xl transition-colors bg-white">
                <Bookmark className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
