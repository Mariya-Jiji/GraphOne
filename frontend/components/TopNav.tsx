'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Logo } from './Logo';
import { Search } from 'lucide-react';

const NAV_LINKS = [
  { name: 'Companies', href: '/companies' },
  { name: 'Products', href: '/products' },
  { name: 'Investors', href: '/investors' },
  { name: 'Funding', href: '/funding' },
  { name: 'Jobs', href: '/jobs' },
  { name: 'News', href: '/news' },
];

export function TopNav() {
  const pathname = usePathname() || '';

  return (
    <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-slate-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-8">
        <Logo />
        
        <div className="flex-1 max-w-lg hidden md:block">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input 
              type="text" 
              placeholder="Search companies, founders, investors..." 
              className="w-full bg-slate-50 border border-slate-200 rounded-full pl-10 pr-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-pink/20 focus:border-brand-pink transition-all"
            />
          </div>
        </div>

        <div className="hidden lg:flex items-center gap-6 text-sm font-medium text-slate-600 h-full">
          {NAV_LINKS.map(link => {
            const isActive = pathname === link.href || pathname.startsWith(`${link.href}/`);
            return (
              <Link 
                key={link.name} 
                href={link.href}
                className={
                  isActive 
                    ? "text-brand-red border-b-2 border-brand-red h-full flex items-center pt-[2px]"
                    : "hover:text-slate-900 h-full flex items-center transition-colors pt-[2px]"
                }
              >
                {link.name}
              </Link>
            );
          })}
        </div>

        <div className="flex items-center gap-4">
          <Link href="/login" className="text-sm font-medium text-slate-600 hover:text-slate-900 hidden sm:block">Log in</Link>
          <button className="bg-brand-red hover:bg-brand-pink text-white text-sm font-medium px-5 py-2 rounded-full transition-colors shadow-sm shadow-brand-red/20">
            Sign up
          </button>
        </div>
      </div>
    </nav>
  );
}
