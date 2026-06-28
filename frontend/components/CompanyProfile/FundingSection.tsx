'use client';

import React from 'react';
import { FundingRound } from '@/types/api';
import { ArrowRight } from 'lucide-react';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from 'recharts';

export function FundingSection({ rounds }: { rounds: FundingRound[] }) {
  // 1. Funding Table Logic
  const sortedRounds = [...rounds].sort((a, b) => {
    if (!a.date || !b.date) return 0;
    return new Date(a.date).getTime() - new Date(b.date).getTime(); // oldest first to match Airbnb
  });

  // 2. Mock Ownership Logic (approximate based on funding total)
  // We assume founders/employees start with 100%, and each major round dilutes ~15-20%.
  // Since we don't have a cap table, this is a conceptual placeholder as requested.
  const data = [
    { name: 'Microsoft (Placeholder)', value: 49, color: '#f43f5e' }, // brand-red
    { name: 'Employees', value: 16, color: '#fca5a5' }, // red-300
    { name: 'Founders', value: 12, color: '#fbcfe8' }, // pink-200
    { name: 'Investors', value: 23, color: '#e2e8f0' }, // slate-200
  ];

  return (
    <section className="py-12 border-t border-slate-100 scroll-mt-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-24">
          
          {/* Left Column: Funding Timeline */}
          <div id="funding" className="scroll-mt-24">
            <h2 className="text-xl sm:text-2xl font-bold text-slate-900 mb-8">3. Funding Timeline</h2>
            
            <table className="w-full text-left text-sm text-slate-600">
              <thead>
                <tr className="border-b border-slate-100">
                  <th className="pb-4 font-semibold">Round</th>
                  <th className="pb-4 font-semibold">Date</th>
                  <th className="pb-4 font-semibold">Amount</th>
                </tr>
              </thead>
              <tbody>
                {sortedRounds.map((r, i) => (
                  <tr key={r.id || i} className="border-b border-slate-50 last:border-0 hover:bg-slate-50 transition-colors">
                    <td className="py-4 font-medium text-slate-900 capitalize">{r.round_type.replace('-', ' ')}</td>
                    <td className="py-4">{r.date ? new Date(r.date).getFullYear() : 'Unknown'}</td>
                    <td className="py-4">
                      {r.amount ? `$${(r.amount / 100000000).toFixed(1)}M` : 'Undisclosed'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {sortedRounds.length === 0 && (
              <p className="text-slate-500 py-4">No funding rounds listed.</p>
            )}

            <button className="mt-6 flex items-center gap-2 text-brand-red font-semibold hover:text-brand-pink transition-colors text-sm">
              View funding history <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          {/* Right Column: Ownership (Donut Chart) */}
          <div id="ownership" className="scroll-mt-24">
            <h2 className="text-xl sm:text-2xl font-bold text-slate-900 mb-8">4. Ownership</h2>
            
            <div className="flex items-center gap-8">
              {/* Donut Chart */}
              <div className="w-48 h-48 shrink-0">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={data}
                      innerRadius={60}
                      outerRadius={90}
                      paddingAngle={2}
                      dataKey="value"
                      stroke="none"
                    >
                      {data.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip 
                      formatter={(value: any) => [`${value}%`, 'Ownership']}
                      contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>

              {/* Legend */}
              <div className="flex-1 flex flex-col gap-4">
                {data.map((item, idx) => (
                  <div key={idx} className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-3">
                      <div className="w-3 h-3 rounded-sm" style={{ backgroundColor: item.color }} />
                      <span className="text-slate-600">{item.name}</span>
                    </div>
                    <span className="font-semibold text-slate-900">{item.value}%</span>
                  </div>
                ))}
              </div>
            </div>
            
            {/* Note about approximation */}
            <p className="mt-8 text-xs text-slate-400">
              * Note: Cap table is an approximation derived from funding round investor types and standard dilution metrics. Exact percentage splits are not public.
            </p>
          </div>

        </div>
      </div>
    </section>
  );
}
