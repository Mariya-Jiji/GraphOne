import React, { useMemo } from 'react';
import { FundingRound } from '@/types/api';
import { TrendingUp, BarChart3, ArrowUpRight, ArrowDownRight, Layers } from 'lucide-react';

interface Props {
  investments: FundingRound[];
}

export function InvestmentTrends({ investments }: Props) {
  // Aggregate data for trends
  const { velocity, increasingSectors, decreasingSectors, stageEvolution } = useMemo(() => {
    const years: Record<string, number> = {};
    const sectorsByYear: Record<string, Record<string, number>> = {};
    const stagesByYear: Record<string, Record<string, number>> = {};

    investments.forEach(inv => {
      if (!inv.date) return;
      const year = new Date(inv.date).getFullYear().toString();
      
      // Velocity
      years[year] = (years[year] || 0) + 1;

      // Sectors
      const category = inv.company?.category?.split(',')[0].trim() || 'Other';
      if (!sectorsByYear[year]) sectorsByYear[year] = {};
      sectorsByYear[year][category] = (sectorsByYear[year][category] || 0) + 1;

      // Stages
      const stage = inv.round_type || 'Unknown';
      if (!stagesByYear[year]) stagesByYear[year] = {};
      stagesByYear[year][stage] = (stagesByYear[year][stage] || 0) + 1;
    });

    const sortedYears = Object.keys(years).sort().slice(-5); // last 5 years

    // Velocity data
    const velocityData = sortedYears.map(year => ({
      year,
      count: years[year]
    }));

    // Capital Flow (compare last year to this year)
    const currentYear = new Date().getFullYear().toString();
    const lastYear = (new Date().getFullYear() - 1).toString();
    
    const currSectors = sectorsByYear[currentYear] || {};
    const prevSectors = sectorsByYear[lastYear] || {};
    
    const incSectors: string[] = [];
    const decSectors: string[] = [];
    
    const allSectors = new Set([...Object.keys(currSectors), ...Object.keys(prevSectors)]);
    allSectors.forEach(sector => {
      const curr = currSectors[sector] || 0;
      const prev = prevSectors[sector] || 0;
      if (curr > prev) incSectors.push(sector);
      if (curr < prev) decSectors.push(sector);
    });

    // Stage evolution
    const stageEvol = sortedYears.map(year => {
      const stages = stagesByYear[year] || {};
      const mostCommon = Object.entries(stages).sort((a, b) => b[1] - a[1])[0]?.[0] || 'N/A';
      return {
        year,
        stage: mostCommon.replace('_', ' ')
      };
    }).reverse();

    return {
      velocity: velocityData.reverse(),
      increasingSectors: incSectors.slice(0, 3),
      decreasingSectors: decSectors.slice(0, 3),
      stageEvolution: stageEvol
    };
  }, [investments]);

  return (
    <section className="py-12 border-t border-slate-100 bg-slate-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          
          {/* Investment Velocity */}
          <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm">
            <div className="flex items-center gap-2 mb-6">
              <BarChart3 className="w-5 h-5 text-brand-red" />
              <h3 className="font-bold text-lg text-slate-900">Investment Velocity</h3>
            </div>
            
            <div className="space-y-4">
              {velocity.map((v, i) => (
                <div key={i} className="flex items-center justify-between border-b border-slate-100 pb-3 last:border-0 last:pb-0">
                  <span className="font-semibold text-slate-900">{v.year}</span>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-slate-900">{v.count}</span>
                    <span className="text-sm text-slate-500">Deals</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Capital Flow */}
          <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm">
            <div className="flex items-center gap-2 mb-6">
              <TrendingUp className="w-5 h-5 text-brand-red" />
              <h3 className="font-bold text-lg text-slate-900">Capital Flow</h3>
            </div>
            
            <div className="mb-6">
              <h4 className="text-sm font-medium text-slate-500 mb-3 uppercase tracking-wider">Increasing Capital</h4>
              <div className="space-y-3">
                {increasingSectors.length > 0 ? increasingSectors.map((sector, i) => (
                  <div key={i} className="flex items-center gap-2">
                    <ArrowUpRight className="w-4 h-4 text-emerald-500" />
                    <span className="font-medium text-slate-800">{sector}</span>
                  </div>
                )) : <p className="text-slate-400 text-sm">Not enough data</p>}
              </div>
            </div>

            <div>
              <h4 className="text-sm font-medium text-slate-500 mb-3 uppercase tracking-wider">Decreasing Capital</h4>
              <div className="space-y-3">
                {decreasingSectors.length > 0 ? decreasingSectors.map((sector, i) => (
                  <div key={i} className="flex items-center gap-2">
                    <ArrowDownRight className="w-4 h-4 text-brand-red" />
                    <span className="font-medium text-slate-800">{sector}</span>
                  </div>
                )) : <p className="text-slate-400 text-sm">Not enough data</p>}
              </div>
            </div>
          </div>

          {/* Stage Evolution */}
          <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm">
            <div className="flex items-center gap-2 mb-6">
              <Layers className="w-5 h-5 text-brand-red" />
              <h3 className="font-bold text-lg text-slate-900">Stage Evolution</h3>
            </div>
            
            <div className="space-y-4 relative before:absolute before:inset-0 before:ml-[11px] before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-slate-100 pl-8 md:pl-0">
              {stageEvolution.map((se, i) => (
                <div key={i} className="relative flex items-center justify-between md:justify-normal md:even:flex-row-reverse group border-b border-slate-100 pb-3 last:border-0 last:pb-0 pl-4 md:pl-0">
                  {/* Optional: Add custom timeline styling if needed, keeping it simple as a list for now to match screenshot "row of dots" style implicitly */}
                  <div className="flex items-center gap-4 w-full justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-2 h-2 rounded-full bg-brand-red" />
                      <span className="font-semibold text-slate-900">{se.year}</span>
                    </div>
                    <span className="text-slate-600 font-medium text-right capitalize">{se.stage}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
