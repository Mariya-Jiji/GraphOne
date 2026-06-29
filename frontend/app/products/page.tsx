import React from 'react';
import { fetchProducts } from '@/lib/api';
import { ProductsSidebar } from '@/components/products/ProductsSidebar';
import { ProductsTopBar } from '@/components/products/ProductsTopBar';
import { ProductsHeroSection } from '@/components/products/ProductsHeroSection';
import { ProductsFeatureRow } from '@/components/products/ProductsFeatureRow';
import { ProductsCategoryTabs } from '@/components/products/ProductsCategoryTabs';
import { PopularRightNowRow } from '@/components/products/PopularRightNowRow';
import { MainProductList } from '@/components/products/MainProductList';
import { ProductsRightSidebar } from '@/components/products/ProductsRightSidebar';

export default async function ProductsPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const resolvedSearchParams = await searchParams;
  
  const params: Record<string, string> = {};
  if (typeof resolvedSearchParams.category === 'string') params.category = resolvedSearchParams.category;
  if (typeof resolvedSearchParams.sort === 'string') params.sort = resolvedSearchParams.sort;

  // 1. Fetch main products list with filters
  const { data: filteredProducts, meta } = await fetchProducts(params);
  
  // 2. Fetch unfiltered products for the top sections (Popular Right Now, Product of the Day)
  const { data: allProducts } = await fetchProducts({ limit: '50' });

  return (
    <div className="min-h-screen bg-white text-slate-900 font-sans flex">
      {/* LEFT SIDEBAR */}
      <ProductsSidebar />
      
      {/* MAIN CONTENT AREA */}
      <div className="flex-1 ml-64 flex flex-col bg-white min-h-screen">
        <ProductsTopBar />
        
        <main className="flex-1 overflow-x-hidden pt-6">
          <ProductsHeroSection />
          
          <ProductsFeatureRow products={allProducts} />
          
          <ProductsCategoryTabs />
          
          <PopularRightNowRow products={allProducts} />
          
          {/* List and Right Sidebar Row */}
          <div className="px-8 pb-20 max-w-[1400px] mx-auto flex flex-col lg:flex-row gap-12">
            <MainProductList products={filteredProducts} totalProducts={meta?.total || filteredProducts.length} />
            <ProductsRightSidebar />
          </div>
        </main>
      </div>
    </div>
  );
}
