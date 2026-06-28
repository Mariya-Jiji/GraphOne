import React from 'react';
import { ChevronRight } from 'lucide-react';
import { Company } from '../../types/api';
import { CompanyLogo } from '../CompanyLogo';

export function FrontierLabsBanner({ companies }: { companies: Company[] }) {
  const labs = companies.filter(c => ['OpenAI', 'Anthropic', 'Google DeepMind', 'xAI', 'Meta AI', 'SSI'].includes(c.name) || c.category === 'LLM').slice(0, 6);

  return (
    <div className="w-full bg-[#0a0f1c] bg-frontier py-12 relative overflow-hidden">
      {/* Subtle lighting effects */}
      <div className="absolute top-0 left-1/4 w-[500px] h-[100px] bg-blue-500/20 blur-[100px] rounded-full" />
      <div className="absolute bottom-0 right-1/4 w-[400px] h-[150px] bg-purple-500/20 blur-[100px] rounded-full" />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="flex items-center gap-3 mb-8">
          <div className="flex-shrink-0 w-6 h-6 rounded-full bg-white/20 text-white flex items-center justify-center text-xs font-bold border border-white/10">
            9
          </div>
          <div>
            <h2 className="text-xl sm:text-2xl font-bold text-white">Frontier AI Labs</h2>
            <p className="text-slate-400 text-sm mt-1">Organizations advancing the state-of-the-art.</p>
          </div>
        </div>

        <div className="flex items-center justify-between gap-8 overflow-x-auto hide-scrollbar">
          {labs.map(c => (
            <div key={c.id} className="flex-shrink-0 flex items-center gap-3 cursor-pointer group opacity-70 hover:opacity-100 transition-opacity">
              <div className="w-8 h-8 rounded-md overflow-hidden shrink-0 grayscale group-hover:grayscale-0 transition-all bg-white/10">
                <CompanyLogo url={c.logo_url} name={c.name} className="w-full h-full object-cover text-xs" />
              </div>
              <h4 className="font-bold text-white text-lg">{c.name}</h4>
            </div>
          ))}
          <div className="flex-shrink-0 w-12 h-12 rounded-full bg-white/10 border border-white/10 flex items-center justify-center text-white cursor-pointer hover:bg-white/20 ml-auto">
            <ChevronRight className="w-5 h-5" />
          </div>
        </div>
      </div>
    </div>
  );
}
