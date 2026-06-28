import React from 'react';
import { ArrowRight } from 'lucide-react';

export function NewsAndJobs() {
  return (
    <section className="py-12 border-t border-slate-100 scroll-mt-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-24">
          
          {/* Left: News */}
          <div id="news" className="scroll-mt-24">
            <h2 className="text-xl sm:text-2xl font-bold text-slate-900 mb-8">12. News</h2>
            <div className="flex flex-col gap-4">
              <p className="text-slate-500 py-4 italic">No recent news available.</p>
            </div>
            <button className="mt-6 flex items-center gap-2 text-brand-red font-semibold hover:text-brand-pink transition-colors text-sm">
              View all news <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          {/* Right: Jobs */}
          <div id="jobs" className="scroll-mt-24">
            <h2 className="text-xl sm:text-2xl font-bold text-slate-900 mb-8">13. Open Jobs</h2>
            <div className="flex flex-col gap-4">
              <p className="text-slate-500 py-4 italic">No open positions listed.</p>
            </div>
            <button className="mt-6 flex items-center gap-2 text-brand-red font-semibold hover:text-brand-pink transition-colors text-sm">
              View all jobs <ArrowRight className="w-4 h-4" />
            </button>
          </div>

        </div>
      </div>
    </section>
  );
}
