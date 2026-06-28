import { TopNav } from '@/components/TopNav';
import { HeroSection } from '@/components/HeroSection';
import { TrendingSection } from '@/components/TrendingSection';
import { FastestGrowingSection } from '@/components/FastestGrowingSection';
import { EmergingStartupsSection } from '@/components/EmergingStartupsSection';
import { BrowseByCategorySection } from '@/components/BrowseByCategorySection';
import { ThreeColumnRows } from '@/components/ThreeColumnRows';
import { UnicornsBanner } from '@/components/Banners/UnicornsBanner';
import { FrontierLabsBanner } from '@/components/Banners/FrontierLabsBanner';
import { OpenSourceLeadersBanner } from '@/components/Banners/OpenSourceLeadersBanner';
import { CuratedCollections } from '@/components/CuratedCollections';
import { ExploreCompaniesSection } from '@/components/ExploreCompaniesSection';
import { FooterCTA } from '@/components/FooterCTA';
import { fetchCompanies } from '@/lib/api';

export default async function Home() {
  // Fetch general companies data to hydrate sections
  const { data: companies } = await fetchCompanies({ limit: '30' });

  return (
    <div className="min-h-screen bg-white">
      <TopNav />
      <main>
        <HeroSection />
        <TrendingSection />
        <FastestGrowingSection companies={companies} />
        <EmergingStartupsSection companies={companies} />
        <BrowseByCategorySection />
        <ThreeColumnRows companies={companies} />
        <UnicornsBanner companies={companies} />
        <FrontierLabsBanner companies={companies} />
        <OpenSourceLeadersBanner companies={companies} />
        <CuratedCollections />
        <ExploreCompaniesSection companies={companies} />
      </main>
      <FooterCTA />
    </div>
  );
}
