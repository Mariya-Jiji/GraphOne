'use client';

import React, { useEffect, useState } from 'react';
import { ChevronDown } from 'lucide-react';
import Link from 'next/link';

const TABS = [
  { id: 'overview', label: '1. Overview' },
  { id: 'timeline', label: '2. Timeline' },
  { id: 'funding', label: '3. Funding' },
  { id: 'ownership', label: '4. Ownership' },
  { id: 'investors', label: '5. Investors' },
  { id: 'leadership', label: '6. Leadership' },
  { id: 'products', label: '7. Products' },
];

export function StickyNav() {
  const [activeTab, setActiveTab] = useState('overview');
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      // Offset logic for sticky behavior if needed
      setIsScrolled(window.scrollY > 60);

      // Section observer logic
      const sections = TABS.map(tab => document.getElementById(tab.id));
      const scrollPosition = window.scrollY + 120; // Offset for the sticky header

      for (let i = sections.length - 1; i >= 0; i--) {
        const section = sections[i];
        if (section && section.offsetTop <= scrollPosition) {
          setActiveTab(TABS[i].id);
          break;
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      window.scrollTo({
        top: element.offsetTop - 100, // Account for sticky nav height
        behavior: 'smooth',
      });
    }
  };

  return (
    <div className={`sticky top-0 z-50 bg-white border-b border-slate-100 transition-all ${isScrolled ? 'shadow-sm' : ''}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-8 overflow-x-auto hide-scrollbar">
          {TABS.map(tab => (
            <button
              key={tab.id}
              onClick={() => scrollToSection(tab.id)}
              className={`whitespace-nowrap py-4 text-sm font-medium transition-colors border-b-2 ${
                activeTab === tab.id
                  ? 'border-brand-red text-slate-900'
                  : 'border-transparent text-slate-500 hover:text-slate-800 hover:border-slate-300'
              }`}
            >
              {tab.label}
            </button>
          ))}
          <button className="flex items-center gap-1 whitespace-nowrap py-4 text-sm font-medium text-slate-500 hover:text-slate-800 transition-colors border-b-2 border-transparent">
            More <ChevronDown className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
