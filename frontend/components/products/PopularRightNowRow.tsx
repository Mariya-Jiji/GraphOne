import { Zap, ChevronRight } from 'lucide-react';
import { Product } from '../../types/api';
import Link from 'next/link';
import { CompanyLogo } from '../CompanyLogo';

interface PopularRightNowRowProps {
  products: Product[];
}

export function PopularRightNowRow({ products }: PopularRightNowRowProps) {
  // Sort by upvotes and take top 6
  const popular = [...products].sort((a, b) => b.upvotes - a.upvotes).slice(0, 6);
  
  if (popular.length === 0) return null;

  return (
    <section className="px-8 mb-12 max-w-[1400px] mx-auto">
      <div className="flex items-center gap-2 mb-4">
        <Zap className="w-4 h-4 text-brand-pink fill-brand-pink" />
        <span className="text-[10px] font-bold text-slate-900 uppercase tracking-wider">Popular Right Now</span>
      </div>
      
      <div className="flex items-center gap-4 overflow-x-auto pb-4 no-scrollbar">
        {popular.map((product) => (
          <div key={product.id} className="min-w-[200px] bg-white border border-slate-200 rounded-2xl p-4 flex items-center gap-3 hover:shadow-md transition-shadow cursor-pointer shrink-0">
            <div className="w-10 h-10 rounded-lg border border-slate-100 bg-slate-50 flex items-center justify-center overflow-hidden shrink-0">
              <CompanyLogo logoUrl={product.company?.logo_url} name={product.company?.name || product.name} className="w-full h-full object-cover" />
            </div>
            <div>
              <h4 className="font-bold text-sm text-slate-900">{product.name}</h4>
              <p className="text-xs text-slate-500 line-clamp-1">{product.category || 'AI Tool'}</p>
            </div>
          </div>
        ))}
        
        <button className="w-10 h-10 rounded-full bg-white border border-slate-200 flex items-center justify-center text-slate-400 hover:text-slate-900 hover:border-slate-300 transition-colors shrink-0">
          <ChevronRight className="w-5 h-5" />
        </button>
      </div>
    </section>
  );
}
