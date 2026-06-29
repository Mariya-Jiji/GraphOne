import { Search, Hexagon } from 'lucide-react';

export function ProductsHeroSection() {
  return (
    <section className="px-8 py-12 flex flex-col lg:flex-row items-center gap-12 max-w-[1400px] mx-auto">
      <div className="flex-1 max-w-2xl">
        <div className="flex items-center gap-2 mb-6">
          <div className="w-1.5 h-1.5 rounded-full bg-brand-pink animate-pulse"></div>
          <span className="text-[10px] font-bold text-brand-pink uppercase tracking-widest">Live AI Intelligence</span>
        </div>
        
        <h1 className="text-5xl font-bold text-slate-900 leading-[1.1] mb-6 tracking-tight">
          The Global Intelligence<br />Layer <span className="text-brand-pink">for AI.</span>
        </h1>
        
        <p className="text-slate-500 text-lg mb-8 max-w-xl">
          One graph connecting companies, founders, investors, products, funding and talent.
        </p>
        
        <div className="relative mb-6 max-w-xl">
          <Search className="w-5 h-5 absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
          <input 
            type="text"
            placeholder="Search companies, founders, investors, products or funding rounds..."
            className="w-full bg-white border border-slate-200 rounded-full pl-12 pr-14 py-4 text-sm focus:outline-none focus:border-brand-pink focus:ring-1 focus:ring-brand-pink shadow-sm transition-all"
          />
          <button className="absolute right-2 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-brand-pink text-white flex items-center justify-center hover:bg-rose-600 transition-colors shadow-md">
            <Search className="w-4 h-4" />
          </button>
        </div>
        
        <div className="flex items-center gap-3">
          <span className="text-xs font-semibold text-slate-400">Most searched</span>
          <div className="flex flex-wrap gap-2">
            {['Databricks', 'Notion', 'Pinecone', 'Weaviate', 'LangChain'].map(tag => (
              <button key={tag} className="px-3 py-1.5 rounded-full border border-slate-200 bg-white text-xs font-semibold text-slate-600 hover:border-slate-300 hover:bg-slate-50 transition-colors flex items-center gap-1.5">
                <div className="w-4 h-4 rounded-full bg-slate-100 flex items-center justify-center overflow-hidden">
                  <span className="text-[8px] font-bold text-slate-400">{tag.charAt(0)}</span>
                </div>
                {tag}
              </button>
            ))}
          </div>
        </div>
      </div>
      
      {/* Decorative Network Diagram */}
      <div className="flex-1 w-full flex justify-center lg:justify-end relative h-[400px]">
        <div className="relative w-[400px] h-[400px]">
          {/* Dashed circles */}
          <div className="absolute inset-4 rounded-full border border-dashed border-slate-200/60 animate-[spin_60s_linear_infinite]"></div>
          <div className="absolute inset-16 rounded-full border border-dashed border-slate-200/80 animate-[spin_40s_linear_infinite_reverse]"></div>
          <div className="absolute inset-28 rounded-full border border-dashed border-brand-pink/20"></div>
          
          {/* Center node */}
          <div className="absolute inset-0 m-auto w-24 h-24 bg-white rounded-3xl shadow-xl shadow-brand-pink/10 border border-brand-pink/20 flex items-center justify-center z-10">
            <div className="w-16 h-16 bg-brand-pink rounded-2xl flex items-center justify-center">
               <Hexagon className="w-8 h-8 text-white fill-white" />
            </div>
            
            {/* Pulsing rings */}
            <div className="absolute inset-0 rounded-3xl border-2 border-brand-pink opacity-20 animate-ping"></div>
          </div>
          
          {/* Nodes */}
          {/* Top Right: OpenAI */}
          <div className="absolute top-8 right-8 w-28 h-12 bg-white rounded-xl shadow-md border border-slate-100 flex items-center gap-2 px-3 z-10 hover:-translate-y-1 transition-transform">
            <div className="w-6 h-6 rounded-full bg-slate-900 flex items-center justify-center text-white"><span className="text-[10px] font-bold">O</span></div>
            <span className="text-xs font-bold text-slate-800">OpenAI</span>
          </div>
          
          {/* Right: Cursor */}
          <div className="absolute top-1/2 -right-4 -translate-y-1/2 w-28 h-12 bg-white rounded-xl shadow-md border border-slate-100 flex items-center gap-2 px-3 z-10 hover:-translate-y-1 transition-transform">
            <div className="w-6 h-6 rounded-md bg-slate-900 flex items-center justify-center text-white"><span className="text-[10px] font-bold">C</span></div>
            <span className="text-xs font-bold text-slate-800">Cursor</span>
          </div>
          
          {/* Bottom Right: Perplexity */}
          <div className="absolute bottom-8 right-8 w-32 h-12 bg-white rounded-xl shadow-md border border-slate-100 flex items-center gap-2 px-3 z-10 hover:-translate-y-1 transition-transform">
            <div className="w-6 h-6 rounded-full bg-slate-900 flex items-center justify-center text-white grid grid-cols-2 grid-rows-2 gap-[1px] overflow-hidden p-1">
               <div className="bg-white rounded-sm"></div><div className="bg-white rounded-sm"></div><div className="bg-white rounded-sm"></div><div className="bg-white rounded-sm"></div>
            </div>
            <span className="text-xs font-bold text-slate-800">Perplexity</span>
          </div>
          
          {/* Bottom Left: Midjourney */}
          <div className="absolute bottom-4 left-12 w-32 h-14 bg-white rounded-xl shadow-md border border-slate-100 flex flex-col items-center justify-center gap-0.5 z-10 hover:-translate-y-1 transition-transform">
            <span className="text-lg">⛵</span>
            <span className="text-[10px] font-bold text-slate-800">Midjourney</span>
          </div>
          
          {/* Top Left: Anthropic */}
          <div className="absolute top-20 left-4 w-28 h-14 bg-white rounded-xl shadow-md border border-slate-100 flex flex-col items-center justify-center gap-0.5 z-10 hover:-translate-y-1 transition-transform">
            <span className="font-serif font-bold text-slate-900 leading-none">A</span>
            <span className="text-[10px] font-bold text-slate-800">Anthropic</span>
          </div>
          
          {/* Connecting Lines (SVGs overlay) */}
          <svg className="absolute inset-0 w-full h-full pointer-events-none" style={{ zIndex: 0 }}>
             <line x1="200" y1="200" x2="300" y2="80" stroke="#f43f5e" strokeWidth="1" strokeDasharray="4 4" opacity="0.4" />
             <line x1="200" y1="200" x2="380" y2="200" stroke="#f43f5e" strokeWidth="1" strokeDasharray="4 4" opacity="0.4" />
             <line x1="200" y1="200" x2="320" y2="340" stroke="#f43f5e" strokeWidth="1" strokeDasharray="4 4" opacity="0.4" />
             <line x1="200" y1="200" x2="100" y2="360" stroke="#f43f5e" strokeWidth="1" strokeDasharray="4 4" opacity="0.4" />
             <line x1="200" y1="200" x2="80" y2="120" stroke="#f43f5e" strokeWidth="1" strokeDasharray="4 4" opacity="0.4" />
             
             {/* Small red dots at ends */}
             <circle cx="300" cy="80" r="3" fill="#f43f5e" />
             <circle cx="380" cy="200" r="3" fill="#f43f5e" />
             <circle cx="320" cy="340" r="3" fill="#f43f5e" />
             <circle cx="100" cy="360" r="3" fill="#f43f5e" />
             <circle cx="80" cy="120" r="3" fill="#f43f5e" />
          </svg>
        </div>
      </div>
    </section>
  );
}
