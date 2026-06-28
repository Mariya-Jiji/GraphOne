import React from 'react';
import { Product } from '@/types/api';
import { CompanyLogo } from '../CompanyLogo';

export function ProductsSection({ products }: { products: Product[] }) {
  if (!products || products.length === 0) return null;

  return (
    <section id="products" className="py-12 border-t border-slate-100 scroll-mt-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-xl sm:text-2xl font-bold text-slate-900 mb-8">7. Products</h2>
        
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-6">
          {products.map((p, i) => (
            <div key={i} className="flex flex-col items-center text-center group cursor-pointer">
              <div className="w-16 h-16 rounded-2xl bg-white shadow-sm border border-slate-100 flex items-center justify-center overflow-hidden mb-4 group-hover:shadow-md group-hover:border-slate-200 transition-all p-3">
                <CompanyLogo name={p.name} className="w-full h-full rounded-xl text-xl" />
              </div>
              <h4 className="font-bold text-slate-900 text-sm mb-1 leading-tight">{p.name}</h4>
              <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed px-2">
                {p.description || p.category || 'Product'}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
