import React from 'react';

export function Logo({ className = '' }: { className?: string }) {
  return (
    <div className={`flex items-center gap-2 font-bold text-xl tracking-tight ${className}`}>
      <div className="w-5 h-5 rounded-full bg-gradient-to-tr from-brand-red to-brand-pink flex items-center justify-center">
        <div className="w-2 h-2 rounded-full bg-white/40" />
      </div>
      <span>graphone</span>
    </div>
  );
}
