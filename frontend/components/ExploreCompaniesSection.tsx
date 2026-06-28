'use client';

import React, { useState } from 'react';
import { SectionHeader } from './SectionHeader';
import { Company } from '../types/api';
import { ChevronDown, LayoutGrid, List } from 'lucide-react';
import { CompanyLogo } from './CompanyLogo';

export function ExploreCompaniesSection({ companies }: { companies: Company[] }) {
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  
  // Use first 4 for "New on GraphOne" sidebar
  const newCompanies = companies.slice(0, 4);
  // Use remaining for the main grid
  const allCompanies = companies.slice(4, 20);

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <div className="flex flex-col lg:flex-row gap-10">
        
        {/* Left Sidebar - New on GraphOne */}
        <div className="w-full lg:w-[280px] shrink-0">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="flex-shrink-0 w-6 h-6 rounded-full bg-brand-pink/20 text-brand-pink flex items-center justify-center text-xs font-bold">
                12
              </div>
              <h3 className="text-lg font-bold text-slate-900">New on GraphOne</h3>
            </div>
            <span className="text-xs font-medium text-slate-500 hover:text-slate-900 cursor-pointer">View all</span>
          </div>
          <p className="text-xs text-slate-500 mb-6">Recently added companies.</p>
          
          <div className="flex flex-col gap-5">
            {newCompanies.map(c => (
              <div key={c.id} className="flex items-center gap-4 cursor-pointer group">
                <div className="w-10 h-10 rounded-xl overflow-hidden bg-slate-50 border border-slate-100 flex items-center justify-center shrink-0">
                  <CompanyLogo url={c.logo_url} name={c.name} className="w-full h-full object-cover text-sm" />
                </div>
                <div>
                  <h4 className="font-bold text-slate-900 text-sm group-hover:text-brand-red transition-colors">{c.name}</h4>
                  <p className="text-xs text-slate-500">{c.category || 'AI'}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right Main Content - Explore All Companies */}
        <div className="flex-1">
          <SectionHeader 
            number={13} 
            title="Explore All Companies" 
            subtitle="Find, filter and sort the right companies." 
          />

          {/* Filters Bar */}
          <div className="flex flex-wrap items-center justify-between gap-4 mb-8 bg-slate-50 border border-slate-100 p-3 rounded-2xl">
            <div className="flex flex-wrap items-center gap-2">
              {['Category', 'Funding Stage', 'Country', 'Team Size', 'More filters'].map((filter, i) => (
                <button key={i} className="flex items-center gap-1 text-xs font-medium text-slate-600 bg-white border border-slate-200 px-3 py-1.5 rounded-full hover:bg-slate-50 transition-colors">
                  {filter} <ChevronDown className="w-3 h-3 text-slate-400" />
                </button>
              ))}
            </div>

            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <span className="text-xs font-medium text-slate-500">Sort by:</span>
                <button className="flex items-center gap-1 text-xs font-medium text-slate-900 bg-white border border-slate-200 px-3 py-1.5 rounded-full">
                  Trending <ChevronDown className="w-3 h-3 text-slate-400" />
                </button>
              </div>

              <div className="flex items-center bg-white border border-slate-200 rounded-lg p-1">
                <button 
                  onClick={() => setViewMode('grid')}
                  className={`p-1.5 rounded-md transition-colors ${viewMode === 'grid' ? 'bg-slate-100 text-slate-900' : 'text-slate-400 hover:text-slate-600'}`}
                >
                  <LayoutGrid className="w-4 h-4" />
                </button>
                <button 
                  onClick={() => setViewMode('list')}
                  className={`p-1.5 rounded-md transition-colors ${viewMode === 'list' ? 'bg-slate-100 text-slate-900' : 'text-slate-400 hover:text-slate-600'}`}
                >
                  <List className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>

          {/* Company Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
            {allCompanies.map(c => (
              <div key={c.id} className="border border-slate-100 rounded-xl p-4 hover:shadow-md hover:border-slate-200 transition-all cursor-pointer flex flex-col">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 rounded-lg overflow-hidden bg-slate-50 shrink-0">
                    <CompanyLogo url={c.logo_url} name={c.name} className="w-full h-full object-cover text-sm" />
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-900 leading-tight">{c.name}</h4>
                    <p className="text-xs text-slate-500">{c.category}</p>
                  </div>
                </div>
                <p className="text-xs text-slate-600 line-clamp-2 mb-3 flex-1">{c.description}</p>
                <div className="flex flex-wrap gap-2 mt-auto">
                  {c.stage && <span className="bg-slate-50 text-slate-500 text-[10px] font-medium px-2 py-1 rounded-md">{c.stage}</span>}
                  {c.hq_country && <span className="bg-slate-50 text-slate-500 text-[10px] font-medium px-2 py-1 rounded-md">{c.hq_country}</span>}
                </div>
              </div>
            ))}
          </div>

          {/* Footer Action */}
          <div className="flex items-center justify-between border-t border-slate-100 pt-6">
            <p className="text-sm font-medium text-slate-500">50,000+ companies</p>
            <button className="bg-brand-pink hover:bg-brand-red text-white text-sm font-medium px-6 py-2.5 rounded-full transition-colors">
              Explore Companies
            </button>
          </div>

        </div>
      </div>
    </section>
  );
}
