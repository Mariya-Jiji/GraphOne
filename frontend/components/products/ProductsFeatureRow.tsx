import { Flame, Trophy, ArrowRight, Code } from 'lucide-react';
import { Product } from '../../types/api';

interface ProductsFeatureRowProps {
  products: Product[];
}

export function ProductsFeatureRow({ products }: ProductsFeatureRowProps) {
  // Derive Collection: Code tools
  const codeTools = products.filter(p => p.category?.toLowerCase() === 'code');
  
  // Derive Product of the day: highest upvoted
  const productOfTheDay = [...products].sort((a, b) => b.upvotes - a.upvotes)[0];
  
  const trendingSearches = [
    'Cursor', 'Claude', 'Vibe Coding', 'Lovable', 'Perplexity', 'Midjourney', 'Runway', 'MCP', 'AI Agents', 'AI Notetaker'
  ];

  return (
    <section className="px-8 mb-12 max-w-[1400px] mx-auto flex flex-col xl:flex-row gap-6">
      {/* Left: Collection of the Week */}
      <div className="flex-[2] bg-gradient-to-r from-red-50 to-orange-50 rounded-3xl p-8 border border-orange-100 flex justify-between relative overflow-hidden">
        <div className="max-w-md relative z-10">
          <div className="flex items-center gap-2 mb-4">
            <Flame className="w-4 h-4 text-brand-pink fill-brand-pink" />
            <span className="text-xs font-bold text-brand-pink uppercase tracking-wider">Collection of the Week</span>
          </div>
          
          <h2 className="text-4xl font-bold text-slate-900 mb-3 flex items-center gap-3">
            <span className="text-4xl">🔥</span> Vibe Coding Tools
          </h2>
          
          <p className="text-slate-600 mb-8">
            The best AI tools for vibe coding, building and shipping faster.
          </p>
          
          <div className="flex items-center gap-6 mb-8">
            <div className="flex -space-x-3">
              {[1, 2, 3].map(i => (
                <img key={i} src={`https://i.pravatar.cc/150?img=${i + 10}`} className="w-10 h-10 rounded-full border-2 border-white" alt="Avatar" />
              ))}
              <div className="w-10 h-10 rounded-full border-2 border-white bg-slate-900 text-white flex items-center justify-center text-xs font-bold z-10">+2K</div>
            </div>
            <span className="text-sm font-medium text-slate-500">2,341 products</span>
          </div>
          
          <button className="bg-brand-pink hover:bg-rose-600 text-white px-6 py-3 rounded-full font-semibold flex items-center gap-2 transition-colors">
            Explore Collection <ArrowRight className="w-4 h-4" />
          </button>
        </div>
        
        {/* Right side graphic mockup */}
        <div className="hidden md:block absolute right-0 top-1/2 -translate-y-1/2 translate-x-12 w-[400px] h-[250px] bg-white/60 backdrop-blur-sm border border-white/80 rounded-l-2xl shadow-xl p-4 transform rotate-[-2deg]">
           <div className="flex gap-2 mb-3">
             <div className="w-2.5 h-2.5 rounded-full bg-red-400"></div>
             <div className="w-2.5 h-2.5 rounded-full bg-amber-400"></div>
             <div className="w-2.5 h-2.5 rounded-full bg-green-400"></div>
           </div>
           <div className="flex gap-4">
             <div className="w-1/3 bg-white/80 rounded-lg p-3 border border-white h-48">
               <div className="w-12 h-12 bg-indigo-100 rounded-lg mb-3 flex items-center justify-center"><Code className="w-6 h-6 text-indigo-500" /></div>
               <div className="w-full h-2 bg-slate-200 rounded mb-2"></div>
               <div className="w-3/4 h-2 bg-slate-200 rounded"></div>
             </div>
             <div className="flex-1 bg-slate-900 rounded-lg p-4 font-mono text-[10px] text-emerald-400 h-48 leading-relaxed shadow-inner">
               <p><span className="text-pink-400">import</span> React <span className="text-pink-400">from</span> 'react';</p>
               <p className="mt-2"><span className="text-pink-400">function</span> <span className="text-blue-300">App</span>() {'{'}</p>
               <p className="pl-4 mt-1"><span className="text-pink-400">return</span> (</p>
               <p className="pl-8 text-blue-200">&lt;<span className="text-blue-400">div</span>&gt;</p>
               <p className="pl-12 text-slate-300">Hello Vibe Coding</p>
               <p className="pl-8 text-blue-200">&lt;/<span className="text-blue-400">div</span>&gt;</p>
               <p className="pl-4">)</p>
               <p>{'}'}</p>
             </div>
           </div>
        </div>
      </div>
      
      {/* Right: Product of the day & Trending */}
      <div className="flex-1 flex flex-col gap-6">
        {/* Product of the day */}
        <div className="bg-white border border-slate-200 rounded-3xl p-6 relative overflow-hidden flex flex-col h-[200px]">
          <div className="absolute top-0 right-0 w-32 h-32 bg-orange-50 rounded-full blur-3xl -translate-y-1/2 translate-x-1/4"></div>
          
          <div className="flex items-center gap-2 mb-6 relative z-10">
            <Trophy className="w-4 h-4 text-amber-500 fill-amber-500" />
            <span className="text-xs font-bold text-slate-900 uppercase tracking-wider">Product of the Day</span>
          </div>
          
          {productOfTheDay ? (
            <div className="flex gap-4 items-center mb-6 relative z-10">
              <div className="w-14 h-14 rounded-xl border border-slate-200 bg-white flex items-center justify-center overflow-hidden shrink-0 shadow-sm">
                {productOfTheDay.company?.logo_url ? (
                  <img src={productOfTheDay.company.logo_url} alt={productOfTheDay.name} className="w-full h-full object-cover" />
                ) : (
                  <span className="font-bold text-slate-400 text-xl">{productOfTheDay.name.charAt(0)}</span>
                )}
              </div>
              <div>
                <h3 className="font-bold text-lg text-slate-900">{productOfTheDay.name}</h3>
                <p className="text-sm text-slate-500 line-clamp-1">{productOfTheDay.description}</p>
              </div>
            </div>
          ) : (
             <div className="flex-1 flex items-center text-sm text-slate-400">No product found</div>
          )}
          
          <button className="w-full bg-brand-pink hover:bg-rose-600 text-white py-2.5 rounded-xl font-semibold transition-colors mt-auto relative z-10">
            View Product
          </button>
        </div>
        
        {/* Trending Searches */}
        <div className="bg-white border border-slate-200 rounded-3xl p-6 flex-1">
          <div className="flex items-center gap-2 mb-5">
            <TrendingUpIcon className="w-4 h-4 text-brand-pink" />
            <span className="text-xs font-bold text-slate-900 uppercase tracking-wider">Trending Searches</span>
          </div>
          
          <div className="flex flex-wrap gap-2">
            {trendingSearches.map(term => (
              <span key={term} className="px-3 py-1.5 bg-slate-50 border border-slate-100 rounded-full text-xs font-medium text-slate-600 hover:bg-slate-100 transition-colors cursor-pointer">
                {term}
              </span>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function TrendingUpIcon(props: any) {
  return (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="22 7 13.5 15.5 8.5 10.5 2 17" />
      <polyline points="16 7 22 7 22 13" />
    </svg>
  )
}
