'use client';

import React, { useMemo } from 'react';
import { SectionHeader } from '../SectionHeader';
import { Investor, FundingRound } from '@/types/api';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import { Quote } from 'lucide-react';

interface Props {
  investor: Investor;
  investments: FundingRound[];
}

const COLORS = ['#ef4444', '#3b82f6', '#10b981', '#f59e0b', '#8b5cf6', '#64748b'];

export function ThesisAndConcentration({ investor, investments }: Props) {
  const chartData = useMemo(() => {
    const categoryCounts: Record<string, number> = {};
    investments.forEach(inv => {
      // Assuming the API returns the company object nested or we can fallback to 'Other'
      const category = inv.company?.category || 'Other';
      const mainCategory = category.split(',')[0].trim();
      categoryCounts[mainCategory] = (categoryCounts[mainCategory] || 0) + 1;
    });

    const total = investments.length || 1; // avoid division by zero
    
    return Object.entries(categoryCounts)
      .map(([name, count]) => ({
        name,
        value: Math.round((count / total) * 100)
      }))
      .sort((a, b) => b.value - a.value)
      .slice(0, 5); // Top 5 categories
  }, [investments]);

  // Derived arrays (handle both array and string from the API)
  const sectorFocusRaw = investor.sector_focus as unknown;
  const sectorFocus = Array.isArray(sectorFocusRaw) 
    ? sectorFocusRaw 
    : (typeof sectorFocusRaw === 'string' ? sectorFocusRaw.split(',').filter(Boolean) : []);
    
  const stageFocusRaw = investor.stage_focus as unknown;
  const stageFocus = Array.isArray(stageFocusRaw)
    ? stageFocusRaw
    : (typeof stageFocusRaw === 'string' ? stageFocusRaw.split(',').filter(Boolean) : []);

  return (
    <section className="py-12 border-t border-slate-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          
          {/* Left: Investment Thesis */}
          <div>
            <SectionHeader number={2} title="Investment Thesis" />
            <div className="mt-8 bg-brand-pink/5 border border-brand-pink/20 rounded-3xl p-8 relative">
              <Quote className="absolute top-6 left-6 w-12 h-12 text-brand-red/10 rotate-180" />
              <p className="text-xl text-slate-800 leading-relaxed relative z-10 pl-6 mb-8 font-medium">
                {investor.bio 
                  ? investor.bio 
                  : "We partner with visionary founders building category-defining companies. Our focus is on technology and innovation that creates long-term impact and shapes the future."}
              </p>

              {sectorFocus.length > 0 && (
                <div className="mb-6">
                  <div className="flex flex-wrap gap-2">
                    {sectorFocus.map((sector: string, i: number) => (
                      <span key={i} className="px-3 py-1.5 bg-white border border-slate-200 rounded-lg text-sm text-slate-600 font-medium">
                        {sector.trim()}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {stageFocus.length > 0 && (
                <div>
                  <h4 className="text-sm font-semibold text-slate-900 mb-3">Preferred Stages</h4>
                  <div className="flex flex-wrap gap-2">
                    {stageFocus.map((stage: string, i: number) => (
                      <span key={i} className="px-4 py-1.5 rounded-full border border-slate-200 bg-white text-slate-700 text-sm font-medium hover:border-slate-300 transition-colors cursor-default">
                        {stage.trim()}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Right: Portfolio Concentration */}
          <div>
            <SectionHeader number={3} title="Portfolio Concentration" />
            <div className="mt-8 p-8 border border-slate-200 rounded-3xl bg-white flex flex-col sm:flex-row items-center gap-8 h-[400px]">
              
              <div className="w-full sm:w-1/2 h-64 sm:h-full relative">
                {chartData.length > 0 ? (
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={chartData}
                        cx="50%"
                        cy="50%"
                        innerRadius={80}
                        outerRadius={110}
                        paddingAngle={5}
                        dataKey="value"
                        stroke="none"
                      >
                        {chartData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip 
                        formatter={(value) => [`${value}%`, 'Concentration']}
                        contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)' }}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="flex items-center justify-center w-full h-full text-slate-400">
                    No data available
                  </div>
                )}
              </div>

              {/* Legend */}
              <div className="w-full sm:w-1/2 flex flex-col justify-center gap-4">
                {chartData.map((entry, index) => (
                  <div key={index} className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-3 h-3 rounded-full" style={{ backgroundColor: COLORS[index % COLORS.length] }} />
                      <span className="text-sm font-medium text-slate-700">{entry.name}</span>
                    </div>
                    <span className="text-sm font-bold text-slate-900">{entry.value}%</span>
                  </div>
                ))}
              </div>

            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
