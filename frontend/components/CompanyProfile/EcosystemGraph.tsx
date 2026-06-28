'use client';

import React, { useMemo } from 'react';

// Graph shape derived from GET /companies/:slug/graph
interface EcosystemGraphProps {
  graph: any;
}

export function EcosystemGraph({ graph }: EcosystemGraphProps) {
  // Pure SVG radial layout for a 1-hop network graph
  
  const width = 1000;
  const height = 600;
  const cx = width / 2;
  const cy = height / 2;

  // We organize nodes into categories and assign them an orbit radius
  const orbits = [
    { key: 'products', label: 'Products', data: graph.products || [], radius: 140, color: '#3b82f6', nodeSize: 30 },
    { key: 'acquisitions', label: 'Acquisitions', data: graph.acquired || [], radius: 180, color: '#10b981', nodeSize: 35 },
    { key: 'investors', label: 'Investors', data: graph.investors || [], radius: 240, color: '#f59e0b', nodeSize: 40 },
    { key: 'competitors', label: 'Competitors', data: graph.competitors || [], radius: 300, color: '#ef4444', nodeSize: 40 },
  ];

  // Distribute nodes in circles
  const nodes = useMemo(() => {
    let allNodes: any[] = [];
    
    orbits.forEach(orbit => {
      if (orbit.data.length === 0) return;
      
      const angleStep = (2 * Math.PI) / orbit.data.length;
      // offset starting angle slightly per orbit
      const offset = orbit.radius % 7; 
      
      orbit.data.forEach((item: any, i: number) => {
        const angle = i * angleStep + offset;
        const x = cx + orbit.radius * Math.cos(angle);
        const y = cy + orbit.radius * Math.sin(angle);
        
        allNodes.push({
          id: item.id,
          label: item.name,
          x,
          y,
          color: orbit.color,
          size: orbit.nodeSize,
          category: orbit.label
        });
      });
    });
    return allNodes;
  }, [graph]);

  return (
    <section id="ecosystem" className="py-12 border-t border-slate-100 scroll-mt-24 bg-slate-50/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-xl sm:text-2xl font-bold text-slate-900 mb-8">11. AI Ecosystem Graph</h2>
        
        <div className="relative w-full overflow-hidden bg-white rounded-3xl border border-slate-100 shadow-sm" style={{ height: '600px' }}>
          
          {/* Legend */}
          <div className="absolute top-6 left-6 z-10 bg-white/90 backdrop-blur-sm p-4 rounded-xl border border-slate-100 shadow-sm">
            <h4 className="text-xs font-bold text-slate-900 mb-3 uppercase tracking-wider">Legend</h4>
            <div className="flex flex-col gap-2">
              {orbits.filter(o => o.data.length > 0).map(o => (
                <div key={o.key} className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: o.color }} />
                  <span className="text-xs text-slate-600 font-medium">{o.label} ({o.data.length})</span>
                </div>
              ))}
            </div>
          </div>

          <div className="w-full h-full overflow-auto hide-scrollbar">
            <div style={{ minWidth: '1000px', minHeight: '600px' }}>
              <svg width={width} height={height}>
                {/* Edges */}
                {nodes.map((node, i) => (
                  <line 
                    key={`edge-${i}`} 
                    x1={cx} y1={cy} 
                    x2={node.x} y2={node.y} 
                    stroke={node.color} 
                    strokeWidth={1} 
                    strokeDasharray="4 4"
                    opacity={0.3} 
                  />
                ))}

                {/* Nodes */}
                {nodes.map((node, i) => (
                  <g key={`node-${i}`} className="cursor-pointer group">
                    <circle cx={node.x} cy={node.y} r={node.size / 2} fill={node.color} opacity={0.1} />
                    <circle cx={node.x} cy={node.y} r={4} fill={node.color} />
                    
                    {/* Node Label Pill */}
                    <rect 
                      x={node.x - 40} y={node.y + 10} 
                      width={80} height={20} 
                      rx={10} 
                      fill="white" stroke={node.color} strokeWidth={1}
                      className="transition-all group-hover:stroke-2"
                    />
                    <text 
                      x={node.x} y={node.y + 24} 
                      fontSize="9" fontWeight="600" fill="#334155" 
                      textAnchor="middle"
                      className="pointer-events-none"
                    >
                      {node.label.length > 12 ? node.label.substring(0, 10) + '...' : node.label}
                    </text>
                  </g>
                ))}

                {/* Center Node (The Company) */}
                <g className="cursor-pointer group">
                  <circle cx={cx} cy={cy} r={40} fill="white" stroke="#0f172a" strokeWidth={2} className="shadow-lg" />
                  <text x={cx} y={cy + 4} fontSize="14" fontWeight="800" fill="#0f172a" textAnchor="middle">
                    {graph.company.name.length > 8 ? graph.company.name.substring(0,6)+'...' : graph.company.name}
                  </text>
                </g>
              </svg>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
}
