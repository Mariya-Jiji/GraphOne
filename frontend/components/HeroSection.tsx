'use client';

import React from 'react';
import { Search, Sparkles, Cpu, Activity, ChevronDown } from 'lucide-react';
import { motion } from 'framer-motion';

const FilterPill = ({ icon: Icon, label }: { icon: React.ElementType, label: string }) => (
  <button className="flex items-center gap-2 px-4 py-2 rounded-full border border-slate-200 bg-white text-sm font-medium text-slate-700 hover:border-slate-300 hover:shadow-sm transition-all">
    <Icon className="w-4 h-4 text-brand-red" />
    {label}
  </button>
);

export function HeroSection() {
  return (
    <section className="relative w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-24 overflow-hidden">
      <div className="flex flex-col lg:flex-row items-center gap-12">
        {/* Left Column: Text & Search */}
        <div className="flex-1 max-w-2xl z-10">
          <div className="inline-block px-3 py-1 mb-6 rounded-md bg-brand-pink/10 text-brand-red text-xs font-bold tracking-widest uppercase">
            AI Companies
          </div>
          
          <h1 className="text-5xl sm:text-6xl font-extrabold text-slate-900 tracking-tight leading-[1.1] text-balance mb-6">
            Discover the world&apos;s most innovative AI companies
          </h1>
          
          <p className="text-lg text-slate-500 mb-10 max-w-xl">
            Explore AI startups, unicorns, frontier labs, and emerging companies shaping the future of artificial intelligence.
          </p>

          <div className="relative max-w-lg mb-8">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
            <input 
              type="text" 
              placeholder="Search companies, categories, founders, investors..." 
              className="w-full bg-white border border-slate-200 rounded-full pl-12 pr-16 py-4 shadow-sm text-base focus:outline-none focus:ring-2 focus:ring-brand-pink/20 focus:border-brand-pink transition-all"
            />
            <button className="absolute right-2 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-brand-red hover:bg-brand-pink text-white flex items-center justify-center transition-colors shadow-md shadow-brand-red/20">
              <Search className="w-4 h-4" />
            </button>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <FilterPill icon={Sparkles} label="AI Agents" />
            <FilterPill icon={Cpu} label="AI Coding" />
            <FilterPill icon={Search} label="AI Search" />
            <FilterPill icon={Activity} label="AI Video" />
            <FilterPill icon={Activity} label="AI Voice" />
            <FilterPill icon={Cpu} label="AI Infrastructure" />
            <button className="flex items-center gap-1 px-4 py-2 rounded-full border border-slate-200 bg-slate-50 text-sm font-medium text-slate-600 hover:bg-slate-100 transition-colors">
              More <ChevronDown className="w-4 h-4" />
            </button>
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
          </svg>

          {/* Floating Icons */}
          <motion.div 
            animate={{ y: [0, -10, 0] }} 
            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
            className="absolute top-[10%] left-[40%] w-20 h-20 bg-gradient-to-br from-pink-100 to-white border border-pink-100 shadow-xl shadow-pink-100/50 rounded-2xl flex items-center justify-center rotate-[-5deg] z-10"
          >
            <Sparkles className="w-10 h-10 text-brand-pink" />
          </motion.div>

          <motion.div 
            animate={{ y: [0, 15, 0] }} 
            transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 1 }}
            className="absolute top-[20%] right-[10%] w-16 h-16 bg-gradient-to-br from-orange-50 to-white border border-orange-100 shadow-xl shadow-orange-100/50 rounded-2xl flex items-center justify-center rotate-[10deg] z-10"
          >
            <Cpu className="w-8 h-8 text-orange-400" />
          </motion.div>

          <motion.div 
            animate={{ y: [0, -15, 0] }} 
            transition={{ duration: 4.5, repeat: Infinity, ease: "easeInOut", delay: 2 }}
            className="absolute bottom-[30%] left-[20%] w-24 h-24 bg-gradient-to-br from-purple-50 to-white border border-purple-100 shadow-xl shadow-purple-100/50 rounded-3xl flex items-center justify-center rotate-[-12deg] z-10"
          >
            <Search className="w-12 h-12 text-purple-500" />
          </motion.div>

          <motion.div 
            animate={{ y: [0, 10, 0] }} 
            transition={{ duration: 3.5, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
            className="absolute bottom-[20%] right-[20%] w-16 h-16 bg-gradient-to-br from-red-50 to-white border border-red-100 shadow-xl shadow-red-100/50 rounded-2xl flex items-center justify-center rotate-[8deg] z-10"
          >
            <Activity className="w-8 h-8 text-brand-red" />
          </motion.div>

          {/* Glowing blur effects */}
          <div className="absolute top-[10%] left-[40%] w-32 h-32 bg-brand-pink/20 blur-[60px] rounded-full z-0" />
          <div className="absolute bottom-[30%] left-[20%] w-40 h-40 bg-purple-400/20 blur-[70px] rounded-full z-0" />
        </div>
      </div>
    </section>
  );
}
