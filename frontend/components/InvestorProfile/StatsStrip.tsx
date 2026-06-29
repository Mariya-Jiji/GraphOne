import React from 'react';
import { Activity, Target, Network, Layers } from 'lucide-react';
import { FundingRound } from '@/types/api';

interface StatsStripProps {
  investorId: string;
  investments: FundingRound[];
  topPartner?: string;
}

export function StatsStrip({ investorId, investments, topPartner }: StatsStripProps) {
  // Compute Deals in last 90 days
  const now = new Date();
  const ninetyDaysAgo = new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000);
  
  const recentDeals = investments.filter(inv => {
    if (!inv.date) return false;
    const invDate = new Date(inv.date);
    return invDate >= ninetyDaysAgo;
  }).length;

  // Compute Lead investments count
  const leadInvestments = investments.filter(inv => inv.lead_investor_id === investorId).length;

  // Compute Most active stage
  const stageCounts = investments.reduce((acc, inv) => {
    const stage = inv.round_type;
    if (stage) {
      acc[stage] = (acc[stage] || 0) + 1;
    }
    return acc;
  }, {} as Record<string, number>);

  let mostActiveStage = 'N/A';
  let maxCount = 0;
  for (const [stage, count] of Object.entries(stageCounts)) {
    if (count > maxCount) {
      maxCount = count;
      mostActiveStage = stage;
    }
  }

  // Format stage name (e.g., "series_a" -> "Series A")
  const formattedStage = mostActiveStage === 'N/A' 
    ? 'N/A' 
    : mostActiveStage.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');

  const stats = [
    {
      label: 'Deals Last 90 Days',
      value: `+${recentDeals}`,
      icon: <Activity className="w-5 h-5 text-brand-red" />,
      color: 'text-brand-red',
    },
    {
      label: 'Lead Investments',
      value: `+${leadInvestments}`,
      icon: <Target className="w-5 h-5 text-emerald-500" />,
      color: 'text-emerald-500',
    },
    {
      label: 'Most Active Stage',
      value: formattedStage,
      icon: <Layers className="w-5 h-5 text-blue-500" />,
      color: 'text-blue-600',
    },
    {
      label: 'Top Partner',
      value: topPartner || 'N/A',
      icon: <Network className="w-5 h-5 text-purple-500" />,
      color: 'text-purple-600',
    },
  ];

  return (
    <section className="py-8 border-t border-slate-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-8 bg-white border border-slate-200 shadow-sm rounded-3xl">
          {stats.map((stat, idx) => (
            <div key={idx} className="flex flex-col items-center justify-center text-center p-4">
              <div className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center mb-3">
                {stat.icon}
              </div>
              <div className={`text-2xl font-bold mb-1 ${stat.color}`}>
                {stat.value}
              </div>
              <div className="text-sm font-medium text-slate-500">
                {stat.label}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
