import React from 'react';
import { SectionHeader } from '../SectionHeader';
import { BookOpen } from 'lucide-react';

export function InvestorResearchSection() {
  // Mock empty state since we don't have news_articles yet for this specific view
  const articles: any[] = []; 

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <SectionHeader 
        number={8} 
        title="Investor Research & Analysis" 
        subtitle="Deep dives into capital allocation, fund performance, and emerging trends." 
      />

      {articles.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Render articles if they exist */}
        </div>
      ) : (
        <div className="bg-slate-50 border border-slate-200 border-dashed rounded-3xl p-12 flex flex-col items-center justify-center text-center">
          <div className="w-16 h-16 rounded-2xl bg-white border border-slate-200 shadow-sm flex items-center justify-center mb-6 text-slate-400">
            <BookOpen className="w-8 h-8" />
          </div>
          <h3 className="text-xl font-bold text-slate-900 mb-2">More research coming soon</h3>
          <p className="text-slate-500 max-w-md">
            Our research team is currently compiling new data on AI investment trends, fund returns, and sector analysis. Check back shortly.
          </p>
        </div>
      )}
    </section>
  );
}
