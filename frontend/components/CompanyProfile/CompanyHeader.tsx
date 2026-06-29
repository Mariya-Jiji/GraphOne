import React from 'react';
import { Company } from '@/types/api';
import { CompanyLogo } from '../CompanyLogo';
import { BadgeCheck, Link as LinkIcon, MapPin, Users, Calendar, Info, X, Globe, Mail, MessageSquare } from 'lucide-react';
import Link from 'next/link';

export function CompanyHeader({ company }: { company: Company }) {
  // Parse categories into tags
  const tags = company.category 
    ? company.category.split(',').map(t => t.trim()).filter(Boolean) 
    : ['Technology'];

  return (
    <section id="overview" className="relative pt-12 pb-8 overflow-hidden">
      {/* Decorative background blob */}
      <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/3 w-[800px] h-[800px] bg-gradient-to-bl from-brand-pink/20 via-brand-red/5 to-transparent rounded-full blur-3xl -z-10 pointer-events-none" />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row gap-8 items-start">
          {/* Logo */}
          <div className="w-32 h-32 md:w-40 md:h-40 rounded-2xl overflow-hidden shrink-0 shadow-lg border border-slate-100 bg-white">
            <CompanyLogo url={company.logo_url} name={company.name} className="w-full h-full object-contain p-2" />
          </div>

          {/* Info */}
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <h1 className="text-4xl font-bold text-slate-900">{company.name}</h1>
              <BadgeCheck className="w-6 h-6 text-slate-400 fill-slate-800" />
            </div>
            
            <p className="text-lg text-slate-600 mb-6 max-w-3xl leading-relaxed">
              {company.description || `${company.name} is a leading company in the ${tags[0]} sector.`}
            </p>

            {/* Metadata Grid */}
            <div className="flex flex-wrap items-center gap-x-6 gap-y-3 text-sm text-slate-500 mb-6">
              <div className="flex items-center gap-2">
                <LinkIcon className="w-4 h-4" />
                <a href={`https://${company.name.toLowerCase().replace(/\s+/g, '')}.com`} target="_blank" rel="noreferrer" className="hover:text-slate-900 transition-colors underline decoration-slate-300 underline-offset-4">
                  {company.name.toLowerCase().replace(/\s+/g, '')}.com
                </a>
              </div>
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                Founded {company.founded_year || 'Unknown'}
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4" />
                {company.hq_country || 'Global'}
              </div>
              <div className="flex items-center gap-2">
                <Users className="w-4 h-4" />
                {company.employee_count ? `${company.employee_count.toLocaleString()} employees (est.)` : 'Unknown employees'}
              </div>
              <div className="flex items-center gap-2">
                <Info className="w-4 h-4" />
                {tags[0]}
              </div>
              <div className="flex items-center gap-2">
                <Info className="w-4 h-4" />
                {company.stage === 'public' ? 'Publicly Traded' : 'Privately Held'}
              </div>
            </div>

            {/* Social Icons */}
            <div className="flex items-center gap-4 mb-8 text-slate-400">
              <a href="#" className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center hover:bg-slate-200 hover:text-slate-900 transition-colors">
                <X className="w-4 h-4" />
              </a>
              <a href="#" className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center hover:bg-slate-200 hover:text-slate-900 transition-colors">
                <Globe className="w-4 h-4" />
              </a>
              <a href="#" className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center hover:bg-slate-200 hover:text-slate-900 transition-colors">
                <Mail className="w-4 h-4" />
              </a>
              <a href="#" className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center hover:bg-slate-200 hover:text-slate-900 transition-colors">
                <MessageSquare className="w-4 h-4" />
              </a>
            </div>

            {/* Category Tags */}
            <div className="flex flex-wrap gap-2">
              {tags.map((tag, idx) => (
                <Link key={idx} href={`/?category=${encodeURIComponent(tag)}`}>
                  <span className="px-4 py-1.5 rounded-full border border-brand-pink/30 text-brand-red text-sm font-medium hover:bg-brand-pink/5 transition-colors cursor-pointer bg-white">
                    {tag}
                  </span>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
