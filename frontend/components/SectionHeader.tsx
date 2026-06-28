import React from 'react';
import { ChevronRight } from 'lucide-react';

interface SectionHeaderProps {
  number: number;
  title: string;
  subtitle?: string;
  viewAll?: boolean;
}

export function SectionHeader({ number, title, subtitle, viewAll }: SectionHeaderProps) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
      <div className="flex items-start gap-4">
        <div className="flex-shrink-0 w-6 h-6 rounded-full bg-brand-pink/20 text-brand-pink flex items-center justify-center text-xs font-bold mt-1">
          {number}
        </div>
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900">{title}</h2>
          {subtitle && <p className="text-sm text-slate-500 mt-1">{subtitle}</p>}
        </div>
      </div>
      {viewAll && (
        <button className="flex items-center gap-1 text-sm font-medium text-slate-600 hover:text-slate-900 bg-slate-100 px-3 py-1.5 rounded-full transition-colors">
          View all
        </button>
      )}
    </div>
  );
}
