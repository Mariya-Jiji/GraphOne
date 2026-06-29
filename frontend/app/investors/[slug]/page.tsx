import React from 'react';
import { TopNav } from '@/components/TopNav';
import { 
  fetchInvestorProfile, 
  fetchInvestorInvestments, 
  fetchInvestorCoInvestors, 
  fetchMostActiveInvestors 
} from '@/lib/api';
import { Investor } from '@/types/api';
import { notFound } from 'next/navigation';
import Link from 'next/link';

// Components
import { InvestorHeader } from '@/components/InvestorProfile/InvestorHeader';
import { KeyPeopleSection } from '@/components/InvestorProfile/KeyPeopleSection';
import { StatsStrip } from '@/components/InvestorProfile/StatsStrip';
import { ThesisAndConcentration } from '@/components/InvestorProfile/ThesisAndConcentration';
import { RecentInvestments } from '@/components/InvestorProfile/RecentInvestments';
import { InvestmentTrends } from '@/components/InvestorProfile/InvestmentTrends';
import { PortfolioWinners } from '@/components/InvestorProfile/PortfolioWinners';
import { NetworkStrength } from '@/components/InvestorProfile/NetworkStrength';
import { ResearchAndRelated } from '@/components/InvestorProfile/ResearchAndRelated';

interface PageProps {
  params: Promise<{
    slug: string;
  }>;
}

export default async function InvestorProfilePage(props: PageProps) {
  const params = await props.params;
  const { slug } = params;

  // Fetch all related data in parallel
  const [profileRes, investmentsRes, coInvestorsRes, activeInvestorsRes] = await Promise.allSettled([
    fetchInvestorProfile(slug),
    fetchInvestorInvestments(slug),
    fetchInvestorCoInvestors(slug),
    fetchMostActiveInvestors()
  ]);

  if (profileRes.status === 'rejected') {
    return notFound();
  }

  const investor = profileRes.value.data;
  const investments = investmentsRes.status === 'fulfilled' ? investmentsRes.value.data : [];
  const coInvestors = coInvestorsRes.status === 'fulfilled' ? coInvestorsRes.value.data : [];
  
  // For related investors, we just use most active investors for now, 
  // filtering out the current investor.
  const activeInvestors = activeInvestorsRes.status === 'fulfilled' ? activeInvestorsRes.value.data : [];
  const relatedInvestors = activeInvestors.filter((inv: Investor) => inv.id !== investor.id);

  // Compute top partner for StatsStrip
  let topPartner = 'N/A';
  if (coInvestors.length > 0) {
    const top = [...coInvestors].sort((a: { count: number }, b: { count: number }) => b.count - a.count)[0];
    if (top) {
      topPartner = top.investor.name;
    }
  }

  return (
    <div className="min-h-screen bg-white">
      <TopNav />

      {/* Breadcrumb */}
      <div className="bg-slate-50 border-b border-slate-100 py-3">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center text-sm text-slate-500 font-medium">
            <Link href="/" className="hover:text-slate-900 transition-colors">Home</Link>
            <span className="mx-2">›</span>
            <Link href="/investors" className="hover:text-slate-900 transition-colors">Investors</Link>
            <span className="mx-2">›</span>
            <span className="text-slate-900">{investor.name}</span>
          </div>
        </div>
      </div>
      
      <main className="pb-24">
        {/* 2. HEADER */}
        <InvestorHeader investor={investor} />

        {/* 3. KEY PEOPLE SECTION */}
        <KeyPeopleSection />

        {/* 4. STATS STRIP */}
        <StatsStrip investorId={investor.id} investments={investments} topPartner={topPartner} />

        {/* 5. TWO-COLUMN ROW: Thesis & Portfolio Concentration */}
        <ThesisAndConcentration investor={investor} investments={investments} />

        {/* 6. RECENT INVESTMENTS */}
        <RecentInvestments investments={investments} />

        {/* 7. THREE-COLUMN ROW: Investment Trends */}
        <InvestmentTrends investments={investments} />

        {/* 8. TWO-COLUMN ROW: Portfolio Winners & Follow-on */}
        <PortfolioWinners investments={investments} />

        {/* 9. TWO-COLUMN ROW: Network Strength */}
        <NetworkStrength coInvestors={coInvestors} />

        {/* 10. Final row: Research & Mentions */}
        <ResearchAndRelated relatedInvestors={relatedInvestors} />
      </main>
    </div>
  );
}
