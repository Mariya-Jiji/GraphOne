'use client';

import { LayoutGrid, MessageSquare, Code, Bot, Image as ImageIcon, Video, Mic, LayoutDashboard, MoreHorizontal } from 'lucide-react';
import { useRouter, useSearchParams } from 'next/navigation';
import clsx from 'clsx';

const CATEGORIES = [
  { name: 'All', icon: LayoutGrid },
  { name: 'Chat', icon: MessageSquare },
  { name: 'Code', icon: Code },
  { name: 'Agents', icon: Bot },
  { name: 'Image', icon: ImageIcon },
  { name: 'Video', icon: Video },
  { name: 'Voice', icon: Mic },
  { name: 'Productivity', icon: LayoutDashboard },
];

export function ProductsCategoryTabs() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const currentCategory = searchParams.get('category') || 'All';

  const handleCategoryClick = (category: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (category === 'All') {
      params.delete('category');
    } else {
      params.set('category', category);
    }
    router.push(`/products?${params.toString()}`);
  };

  return (
    <div className="px-8 mb-8 max-w-[1400px] mx-auto">
      <div className="flex items-center gap-2 border-b border-slate-200 pb-1 overflow-x-auto no-scrollbar">
        {CATEGORIES.map(cat => {
          const Icon = cat.icon;
          const isActive = currentCategory.toLowerCase() === cat.name.toLowerCase();
          
          return (
            <button
              key={cat.name}
              onClick={() => handleCategoryClick(cat.name)}
              className={clsx(
                "flex items-center gap-2 px-4 py-3 text-sm font-semibold transition-colors relative whitespace-nowrap",
                isActive ? "text-brand-pink" : "text-slate-500 hover:text-slate-800"
              )}
            >
              <Icon className="w-4 h-4" />
              {cat.name}
              {isActive && (
                <div className="absolute bottom-0 left-0 w-full h-0.5 bg-brand-pink"></div>
              )}
            </button>
          );
        })}
        
        <button className="flex items-center gap-2 px-4 py-3 text-sm font-semibold text-slate-500 hover:text-slate-800 transition-colors ml-auto whitespace-nowrap">
          More <MoreHorizontal className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
