'use client';

import { Flame, Sparkles, Heart, MessageCircle, TrendingUp, ArrowUpRight } from 'lucide-react';
import { Product } from '../../types/api';
import clsx from 'clsx';
import { useRouter, useSearchParams } from 'next/navigation';

import { CompanyLogo } from '../CompanyLogo';

interface MainProductListProps {
  products: Product[];
  totalProducts: number;
}

export function MainProductList({ products, totalProducts }: MainProductListProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const sort = searchParams.get('sort') || 'popular';

  const handleSortClick = (newSort: string) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set('sort', newSort);
    router.push(`/products?${params.toString()}`);
  };

  const formatNumber = (num: number) => {
    if (num >= 1000) return (num / 1000).toFixed(1) + 'K';
    return num.toString();
  };

  const renderBadge = (product: Product, index: number) => {
    // Fabricate some reasonable badges based on ranking/category
    if (index === 0) return <span className="flex items-center gap-1 text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-1 rounded-full"><TrendingUp className="w-3 h-3" /> Trending in {product.category || 'AI'}</span>;
    if (index === 1) return <span className="flex items-center gap-1 text-[10px] font-bold text-amber-600 bg-amber-50 px-2 py-1 rounded-full"><Sparkles className="w-3 h-3" /> Most used this week</span>;
    if (index === 2) return <span className="flex items-center gap-1 text-[10px] font-bold text-purple-600 bg-purple-50 px-2 py-1 rounded-full"><Flame className="w-3 h-3" /> Top rated in {product.category || 'AI'}</span>;
    if (index === 4) return <span className="flex items-center gap-1 text-[10px] font-bold text-blue-600 bg-blue-50 px-2 py-1 rounded-full"><ArrowUpRight className="w-3 h-3" /> Fastest growing</span>;
    if (index === 6) return <span className="flex items-center gap-1 text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-1 rounded-full"><TrendingUp className="w-3 h-3" /> Most used this week</span>;
    
    return null;
  };

  return (
    <div className="flex-1 max-w-4xl">
      {/* Controls */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-1 bg-slate-50 border border-slate-200 p-1 rounded-lg">
          <button 
            onClick={() => handleSortClick('popular')}
            className={clsx(
              "flex items-center gap-1.5 px-4 py-1.5 rounded-md text-xs font-bold transition-all",
              sort === 'popular' ? "bg-white text-brand-pink shadow-sm" : "text-slate-500 hover:text-slate-700"
            )}
          >
            <Flame className={clsx("w-3.5 h-3.5", sort === 'popular' && "fill-brand-pink")} />
            Most Popular
          </button>
          <button 
            onClick={() => handleSortClick('newest')}
            className={clsx(
              "flex items-center gap-1.5 px-4 py-1.5 rounded-md text-xs font-bold transition-all",
              sort === 'newest' ? "bg-white text-slate-900 shadow-sm" : "text-slate-500 hover:text-slate-700"
            )}
          >
            <Sparkles className={clsx("w-3.5 h-3.5", sort === 'newest' && "fill-slate-900 text-slate-900")} />
            Newest
          </button>
        </div>
        
        <div className="flex items-center gap-4 text-sm text-slate-500">
          <span>{totalProducts.toLocaleString()} products</span>
          <select 
            value={sort}
            onChange={(e) => handleSortClick(e.target.value)}
            className="bg-transparent font-medium text-slate-700 outline-none cursor-pointer"
          >
            <option value="popular">Sort by: Popular</option>
            <option value="newest">Sort by: Newest</option>
          </select>
        </div>
      </div>

      {/* Product List */}
      <div className="flex flex-col gap-4">
        {products.map((product, index) => {
          
          // Insert static sponsored banner in the middle (e.g. after index 3)
          const isSponsoredPosition = index === 4;
          
          return (
            <div key={product.id}>
              {isSponsoredPosition && (
                <div className="bg-gradient-to-r from-purple-50 to-indigo-50 border border-purple-100 rounded-2xl p-6 mb-4 flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-purple-500 rounded-xl flex items-center justify-center shadow-lg shadow-purple-500/20 text-white">
                      <HexagonIcon className="w-6 h-6 fill-current" />
                    </div>
                    <div>
                      <span className="text-[10px] font-bold text-purple-400 uppercase tracking-wider mb-1 block">Sponsored</span>
                      <h3 className="font-bold text-lg text-slate-900">Build AI agents in minutes</h3>
                      <p className="text-sm text-slate-600 max-w-sm">The all-in-one platform to design, deploy and scale AI workflows.</p>
                    </div>
                  </div>
                  
                  {/* Decorative abstract elements */}
                  <div className="hidden md:flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg border border-purple-200 bg-white/50 flex items-center justify-center text-purple-400 text-xs font-bold">G</div>
                    <div className="w-2 h-0.5 bg-purple-200"></div>
                    <div className="w-8 h-8 rounded-full border border-pink-200 bg-white/50 flex items-center justify-center text-pink-400 text-xs font-bold">O</div>
                    <div className="w-2 h-0.5 bg-purple-200"></div>
                    <div className="w-10 h-10 rounded-xl border border-indigo-200 bg-white flex items-center justify-center text-indigo-500 shadow-sm"><BotIcon className="w-5 h-5" /></div>
                  </div>
                  
                  <button className="bg-purple-600 hover:bg-purple-700 text-white px-5 py-2.5 rounded-full font-semibold text-sm transition-colors flex items-center gap-2 shadow-md shadow-purple-500/20">
                    Try GraphOne Studio <ArrowRightIcon className="w-4 h-4" />
                  </button>
                </div>
              )}
              
              <div className="bg-white border border-slate-100 rounded-2xl p-5 flex items-center gap-6 hover:shadow-md transition-shadow cursor-pointer group">
                <div className="w-16 h-16 rounded-2xl border border-slate-200 bg-slate-50 flex items-center justify-center overflow-hidden shrink-0 shadow-sm group-hover:scale-105 transition-transform">
                  <CompanyLogo logoUrl={product.company?.logo_url} name={product.company?.name || product.name} className="w-full h-full object-cover" />
                </div>
                
                <div className="flex-1">
                  <h3 className="font-bold text-lg text-slate-900 flex items-center gap-2">
                    {product.name}
                  </h3>
                  <p className="text-sm text-slate-500 mt-0.5 line-clamp-1">{product.description}</p>
                  
                  <div className="flex items-center gap-3 mt-3">
                    {product.category && (
                      <span className="text-xs font-medium text-slate-400 bg-slate-50 px-2 py-0.5 rounded border border-slate-100">
                        {product.category}
                      </span>
                    )}
                    {renderBadge(product, index)}
                  </div>
                </div>
                
                <div className="flex items-center gap-6 pr-4">
                  <div className="flex flex-col items-center gap-1 group/btn">
                    <button className="text-brand-pink p-1 rounded-full group-hover/btn:bg-red-50 transition-colors">
                      <Heart className="w-5 h-5 fill-brand-pink" />
                    </button>
                    <span className="text-xs font-bold text-slate-700">{formatNumber(product.upvotes)}</span>
                  </div>
                  
                  <div className="flex flex-col items-center gap-1 group/btn">
                    <button className="text-slate-400 p-1 rounded-full group-hover/btn:bg-slate-50 transition-colors">
                      <MessageCircle className="w-5 h-5" />
                    </button>
                    {/* Placeholder comment count */}
                    <span className="text-xs font-bold text-slate-400">0</span>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
        
        {products.length === 0 && (
          <div className="py-12 text-center text-slate-500">
            No products found for this category.
          </div>
        )}
      </div>
      
      {products.length > 0 && (
        <div className="mt-8 text-center">
          <button className="px-6 py-3 bg-white border border-slate-200 rounded-full font-semibold text-sm text-slate-700 hover:bg-slate-50 hover:border-slate-300 transition-colors shadow-sm inline-flex items-center gap-2">
            Load more products
            <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M2.5 4.5L6 8L9.5 4.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
          </button>
        </div>
      )}
    </div>
  );
}

function HexagonIcon(props: any) {
  return (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path></svg>
  );
}

function ArrowRightIcon(props: any) {
  return (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14"></path><path d="m12 5 7 7-7 7"></path></svg>
  );
}

function BotIcon(props: any) {
  return (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 8V4H8"></path><rect width="16" height="12" x="4" y="8" rx="2"></rect><path d="M2 14h2"></path><path d="M20 14h2"></path><path d="M15 13v2"></path><path d="M9 13v2"></path></svg>
  );
}
