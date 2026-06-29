'use client';

import React from 'react';
import { Search, ChevronDown, Rocket, Landmark, Target, MapPin, Sparkles } from 'lucide-react';
import { motion } from 'framer-motion';
import { Investor } from '../../types/api';

const FilterPill = ({ label }: { label: string }) => (
  <button className="flex items-center gap-2 px-4 py-2 rounded-full border border-slate-200 bg-white text-sm font-medium text-slate-700 hover:border-slate-300 hover:shadow-sm transition-all">
    {label}
  </button>
);

export function InvestorsHeroSection({ investors }: { investors: Investor[] }) {
  // Take a few top investors for the floating chips
  const floatingInvestors = investors.slice(0, 6);
  
  // Hardcode some positions for the 6 floating chips
  const positions = [
    { top: '10%', left: '40%', rotate: '-5deg', delay: 0 },
    { top: '20%', right: '10%', rotate: '10deg', delay: 1 },
    { bottom: '30%', left: '20%', rotate: '-12deg', delay: 2 },
    { bottom: '20%', right: '20%', rotate: '8deg', delay: 0.5 },
    { top: '40%', left: '10%', rotate: '-8deg', delay: 1.5 },
    { top: '50%', right: '5%', rotate: '5deg', delay: 2.5 },
  ];

  return (
    <section className="relative w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-24 overflow-hidden">
      <div className="flex flex-col lg:flex-row items-center gap-12">
        {/* Left Column: Text & Search */}
        <div className="flex-1 max-w-2xl z-10">
          <div className="inline-block px-3 py-1 mb-6 rounded-md bg-brand-pink/10 text-brand-red text-xs font-bold tracking-widest uppercase">
            Investors
          </div>
          
          <h1 className="text-5xl sm:text-6xl font-extrabold text-slate-900 tracking-tight leading-[1.1] text-balance mb-6">
            Discover Investors Building the AI Economy
          </h1>
          
          <p className="text-lg text-slate-500 mb-10 max-w-xl">
            Find VCs, angels, operators, corporate funds and emerging managers backing the next generation of AI companies.
          </p>

          <div className="relative max-w-lg mb-8">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
            <input 
              type="text" 
              placeholder="Search investors, funds, partners..." 
              className="w-full bg-white border border-slate-200 rounded-full pl-12 pr-16 py-4 shadow-sm text-base focus:outline-none focus:ring-2 focus:ring-brand-pink/20 focus:border-brand-pink transition-all"
            />
            <button className="absolute right-2 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-brand-pink hover:bg-pink-600 text-white flex items-center justify-center transition-colors shadow-md shadow-brand-pink/20">
              <Search className="w-4 h-4" />
            </button>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <FilterPill label="AI Agents" />
            <FilterPill label="Seed Investors" />
            <FilterPill label="Series A" />
            <FilterPill label="YC Backers" />
            <FilterPill label="India" />
            <FilterPill label="OpenAI Portfolio" />
          </div>
        </div>

        {/* Right Column: Decorative Graphic */}
        <div className="flex-1 relative w-full h-[400px] lg:h-[500px] hidden md:block">
          {/* Background Grid */}
          <div className="absolute inset-0 bg-[radial-gradient(circle,#e2e8f0_1px,transparent_1px)] [background-size:24px_24px] opacity-60 mask-image-[radial-gradient(ellipse_at_center,black_40%,transparent_70%)]" />
          
          {/* Connecting lines SVG (mocked) */}
          <svg className="absolute inset-0 w-full h-full stroke-slate-200 stroke-[1.5] fill-none opacity-50 z-0">
            <path d="M 150 150 Q 250 100 350 200 T 500 150" />
            <path d="M 200 300 Q 300 350 400 250" />
            <path d="M 100 250 Q 200 150 300 250 T 400 350" />
          </svg>

          {/* Floating Name Cards */}
          {floatingInvestors.map((investor, i) => {
            const pos = positions[i] || positions[0];
            return (
              <motion.div 
                key={investor.id || i}
                animate={{ y: [0, -10, 0] }} 
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut", delay: pos.delay }}
                className="absolute flex items-center gap-3 bg-white border border-slate-100 shadow-xl shadow-slate-200/50 rounded-full pl-2 pr-4 py-2 z-10"
                style={{ top: pos.top, left: pos.left, right: pos.right, bottom: pos.bottom, transform: `rotate(${pos.rotate})` }}
              >
                <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center overflow-hidden shrink-0 border border-slate-200">
                  {investor.logo_url ? (
                    <img src={investor.logo_url} alt={investor.name} className="w-full h-full object-cover" />
                  ) : (
                    <span className="text-xs font-bold text-slate-500">{investor.name.substring(0, 1)}</span>
                  )}
                </div>
                <span className="text-sm font-semibold text-slate-800 whitespace-nowrap">
                  {investor.name}
                </span>
              </motion.div>
            );
          })}

          {/* Glowing blur effects */}
          <div className="absolute top-[10%] left-[40%] w-32 h-32 bg-brand-pink/20 blur-[60px] rounded-full z-0" />
          <div className="absolute bottom-[30%] left-[20%] w-40 h-40 bg-purple-400/20 blur-[70px] rounded-full z-0" />
        </div>
      </div>
    </section>
  );
}
