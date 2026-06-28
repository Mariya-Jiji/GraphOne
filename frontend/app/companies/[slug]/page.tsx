import React from 'react';
import { fetchCompanyProfile, fetchCompanyFunding, fetchCompanyProducts, fetchCompanyGraph } from '@/lib/api';
import { notFound } from 'next/navigation';
import { StickyNav } from '@/components/CompanyProfile/StickyNav';
import { CompanyHeader } from '@/components/CompanyProfile/CompanyHeader';
import { TimelineSection } from '@/components/CompanyProfile/TimelineSection';
import { FundingSection } from '@/components/CompanyProfile/FundingSection';
import { InvestorsSection } from '@/components/CompanyProfile/InvestorsSection';
import { FoundersSection } from '@/components/CompanyProfile/FoundersSection';
import { ProductsSection } from '@/components/CompanyProfile/ProductsSection';
import { CompetitorsSection } from '@/components/CompanyProfile/CompetitorsSection';
import { EcosystemGraph } from '@/components/CompanyProfile/EcosystemGraph';
import { NewsAndJobs } from '@/components/CompanyProfile/NewsAndJobs';
import { BottomLists } from '@/components/CompanyProfile/BottomLists';

interface PageProps {
  params: {
    slug: string;
  };
}

export default async function CompanyDetailPage({ params }: PageProps) {
  const { slug } = params;

  // Fetch all related data in parallel
  const [profileRes, fundingRes, productsRes, graphRes] = await Promise.allSettled([
    fetchCompanyProfile(slug),
    fetchCompanyFunding(slug),
    fetchCompanyProducts(slug),
    fetchCompanyGraph(slug)
  ]);

  if (profileRes.status === 'rejected') {
    return notFound();
  }

  const profile = profileRes.value.data;
  const funding = fundingRes.status === 'fulfilled' ? fundingRes.value.data : null;
  const products = productsRes.status === 'fulfilled' ? productsRes.value.data : null;
  const graph = graphRes.status === 'fulfilled' ? graphRes.value.data : null;

  return (
    <div className="min-h-screen bg-white">
      <StickyNav />
      
      <main className="pb-24">
        <CompanyHeader company={profile} />
        <TimelineSection company={profile} products={profile.products || []} />
        <FundingSection rounds={funding?.rounds || []} />
        <InvestorsSection rounds={funding?.rounds || []} />
        <FoundersSection founders={profile.founders || []} />
        <ProductsSection products={products?.products || []} />
        <CompetitorsSection competitors={graph?.competitors || []} />
        {graph && <EcosystemGraph graph={graph} />}
        <NewsAndJobs />
        <BottomLists similarCompanies={graph?.competitors || []} />
      </main>
    </div>
  );
}
