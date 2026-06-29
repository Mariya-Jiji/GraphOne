import React from 'react';
import { SectionHeader } from '../SectionHeader';
import { Investor } from '../../types/api';
import { ArrowUpRight } from 'lucide-react';
import Link from 'next/link';

export function InvestorCollectionsSection({ investors }: { investors: Investor[] }) {
  // Define collections and compute counts dynamically based on investor data where possible
  const collections = [
    {
      title: "Investors Backing AI Agents",
      image: "https://images.unsplash.com/photo-1620712943543-bcc4688e7485?q=80&w=800&auto=format&fit=crop",
      filter: (i: Investor) => i.sector_focus?.some(s => s.toLowerCase().includes('agent')),
      fallbackCount: 142
    },
    {
      title: "Investors Backing Indian AI Startups",
      image: "https://images.unsplash.com/photo-1524492412937-b28074a5d7da?q=80&w=800&auto=format&fit=crop",
      filter: (i: Investor) => i.hq_country === 'India' || i.sector_focus?.some(s => s.toLowerCase().includes('india')),
      fallbackCount: 89
    },
    {
      title: "Top Seed Investors",
      image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=800&auto=format&fit=crop",
      filter: (i: Investor) => i.stage_focus?.some(s => s.toLowerCase().includes('seed')),
      fallbackCount: 356
    },
    {
      title: "Operator Angels",
      image: "https://images.unsplash.com/photo-1573164713988-8665fc963095?q=80&w=800&auto=format&fit=crop",
      filter: (i: Investor) => i.type?.toLowerCase().includes('angel') || i.type?.toLowerCase().includes('operator'),
      fallbackCount: 524
    },
    {
      title: "OpenAI Alumni Investors",
      image: "https://images.unsplash.com/photo-1677442136019-21780ecad995?q=80&w=800&auto=format&fit=crop",
      filter: (i: Investor) => i.bio?.toLowerCase().includes('openai'),
      fallbackCount: 45
    },
    {
      title: "Enterprise AI Investors",
      image: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=800&auto=format&fit=crop",
      filter: (i: Investor) => i.sector_focus?.some(s => s.toLowerCase().includes('enterprise')),
      fallbackCount: 218
    },
    {
      title: "Developer Tool Specialists",
      image: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?q=80&w=800&auto=format&fit=crop",
      filter: (i: Investor) => i.sector_focus?.some(s => s.toLowerCase().includes('developer') || s.toLowerCase().includes('devtool')),
      fallbackCount: 175
    },
    {
      title: "Healthcare AI Investors",
      image: "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?q=80&w=800&auto=format&fit=crop",
      filter: (i: Investor) => i.sector_focus?.some(s => s.toLowerCase().includes('health')),
      fallbackCount: 112
    }
  ];

  const processedCollections = collections.map(c => {
    let count = investors.filter(c.filter).length;
    // If the mock/real data is too small to show realistic counts, use the fallback + actual
    if (count < 10) count = c.fallbackCount + count;
    return { ...c, count };
  });

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <SectionHeader 
        number={2} 
        title="Investor Collections" 
        subtitle="Curated lists of investors based on specific themes, regions, and specialities." 
        viewAll 
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {processedCollections.map((collection, index) => (
          <Link href="/investors" key={index} className="group block relative h-[200px] rounded-2xl overflow-hidden">
            {/* Background Image */}
            <div 
              className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-110"
              style={{ backgroundImage: `url(${collection.image})` }}
            />
            {/* Dark Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-slate-900/90 via-slate-900/40 to-transparent" />
            
            {/* Content */}
            <div className="absolute inset-0 p-5 flex flex-col justify-end">
              <div className="flex justify-between items-end">
                <div>
                  <h3 className="text-white font-bold text-lg leading-tight mb-1 group-hover:text-brand-pink transition-colors">
                    {collection.title}
                  </h3>
                  <p className="text-white/70 text-sm font-medium">
                    {collection.count.toLocaleString()} Investors
                  </p>
                </div>
                <div className="w-8 h-8 rounded-full bg-white/10 backdrop-blur-md flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-all translate-y-2 group-hover:translate-y-0">
                  <ArrowUpRight className="w-4 h-4" />
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
