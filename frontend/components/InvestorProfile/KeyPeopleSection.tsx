import React from 'react';
import { SectionHeader } from '../SectionHeader';
import { Users } from 'lucide-react';

export function KeyPeopleSection() {
  return (
    <section id="leadership" className="py-12 border-t border-slate-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeader number={1} title="Key people" />
        
        {/* Graceful empty state since there is no dedicated "investor team members" table in the schema */}
        <div className="mt-8 flex flex-col items-center justify-center p-12 border border-dashed border-slate-200 rounded-2xl bg-slate-50/50">
          <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center mb-4 text-slate-400">
            <Users className="w-6 h-6" />
          </div>
          <h3 className="text-slate-900 font-medium mb-1">Team Information Not Available</h3>
          <p className="text-slate-500 text-sm max-w-sm text-center">
            Detailed team structures for investors are not yet fully tracked in our current dataset.
          </p>
        </div>
      </div>
    </section>
  );
}
