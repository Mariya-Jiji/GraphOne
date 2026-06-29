import React from 'react';
import { TopNav } from '@/components/TopNav';
import { fetchInvestors, fetchCompanies, fetchMostActiveInvestors, fetchCompanyFunding } from '@/lib/api';
import { Investor } from '@/types/api';

import { InvestorsHeroSection } from '@/components/investors/InvestorsHeroSection';
import { TrendingInvestorsSection } from '@/components/investors/TrendingInvestorsSection';
import { InvestorCollectionsSection } from '@/components/investors/InvestorCollectionsSection';
import { BrowseInvestorTypeSection } from '@/components/investors/BrowseInvestorTypeSection';
import { MostActiveInvestorsSection } from '@/components/investors/MostActiveInvestorsSection';
import { InvestorsBackingWinnersSection } from '@/components/investors/InvestorsBackingWinnersSection';
import { CapitalThemesSection } from '@/components/investors/CapitalThemesSection';
import { EmergingInvestorsSection } from '@/components/investors/EmergingInvestorsSection';
import { InvestorResearchSection } from '@/components/investors/InvestorResearchSection';
import { CapitalGraphBanner } from '@/components/investors/CapitalGraphBanner';
import { InvestorFooterCTA } from '@/components/investors/InvestorFooterCTA';

export default async function InvestorsDiscoveryPage({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined };
}) {
  // Extract potential filters from searchParams for GET /investors
  const params: Record<string, string> = {};
  if (typeof searchParams.type === 'string') params.type = searchParams.type;
  if (typeof searchParams.sector === 'string') params.sector = searchParams.sector;
  if (typeof searchParams.stage === 'string') params.stage_focus = searchParams.stage;

  // 1. Fetch main investors pool
  const { data: investors } = await fetchInvestors(params);
  
  // 2. Fetch companies to extract unicorns for "Investors Backing Winners"
  const { data: companies } = await fetchCompanies({ limit: '50' });

  // 3. Fetch most active investors
  let mostActiveInvestors = investors;
  try {
    const mostActiveResponse = await fetchMostActiveInvestors();
    if (mostActiveResponse && mostActiveResponse.data) {
      mostActiveInvestors = mostActiveResponse.data;
    }
  } catch (e) {
    console.error("Failed to fetch most active investors", e);
  }

  // 4. Resolve investors for the Winners section using real funding data
  const winners = companies.filter(c => c.is_unicorn).slice(0, 3);
  if (winners.length === 0) winners.push(...companies.slice(0, 3));
  
  const backersMap: Record<string, Investor[]> = {};
  
  await Promise.all(
    winners.map(async (company) => {
      try {
        const fundingRes = await fetchCompanyFunding(company.slug);
        const fundingRounds = fundingRes?.data?.rounds || [];
        const investorIds = new Set<string>();
        
        fundingRounds.forEach((round: any) => {
          if (round.lead_investor_id) investorIds.add(round.lead_investor_id);
          if (round.lead_investor?.id) investorIds.add(round.lead_investor.id);
          if (round.co_investors && Array.isArray(round.co_investors)) {
            round.co_investors.forEach((id: string) => investorIds.add(id));
          }
        });

        // Resolve IDs to actual Investor objects from the fetched list
        // Note: If the backend returns paginated investors and a matched ID isn't in the first page,
        // it won't be mapped unless we fetch it. Assuming the top investors are likely returned.
        const resolvedInvestors = Array.from(investorIds).map(id => {
          // Check if we already have this investor locally
          let inv = investors.find(i => i.id === id);
          if (!inv) inv = mostActiveInvestors.find((i: Investor) => i.id === id);
          return inv;
        }).filter(Boolean) as Investor[];

        backersMap[company.id] = resolvedInvestors;
      } catch (e) {
        console.error(`Failed to fetch funding for ${company.slug}`, e);
        backersMap[company.id] = [];
      }
    })
  );

  return (
    <div className="min-h-screen bg-white">
      {/* 1. TOP NAV */}
      <TopNav />
      <main>
        {/* 2. HERO */}
        <InvestorsHeroSection investors={investors} />
        
        {/* 3. TRENDING INVESTORS */}
        <TrendingInvestorsSection investors={investors} />
        
        {/* 4. INVESTOR COLLECTIONS */}
        <InvestorCollectionsSection investors={investors} />
        
        {/* 5. BROWSE BY INVESTOR TYPE */}
        <BrowseInvestorTypeSection investors={investors} />
        
        {/* 6. MOST ACTIVE INVESTORS */}
        <MostActiveInvestorsSection investors={mostActiveInvestors} />
        
        {/* 7. INVESTORS BACKING WINNERS */}
        <InvestorsBackingWinnersSection companies={winners} backersMap={backersMap} />
        
        {/* 8. CAPITAL THEMES */}
        <CapitalThemesSection investors={investors} />
        
        {/* 9. EMERGING INVESTORS */}
        <EmergingInvestorsSection investors={investors} />
        
        {/* 10. INVESTOR RESEARCH */}
        <InvestorResearchSection />
        
        {/* 11. DARK CTA BANNER */}
        <CapitalGraphBanner />
      </main>
      {/* 12. FOOTER CTA */}
      <InvestorFooterCTA />
    </div>
  );
}
