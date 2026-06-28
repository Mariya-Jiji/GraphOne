'use client';

import React, { useState } from 'react';

const COLORS = [
  'bg-blue-500',
  'bg-purple-500',
  'bg-slate-500',
  'bg-indigo-500',
  'bg-pink-500',
  'bg-teal-500',
  'bg-cyan-600',
  'bg-violet-500',
];

function getHashColor(name: string) {
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }
  hash = Math.abs(hash);
  return COLORS[hash % COLORS.length];
}

interface CompanyLogoProps {
  url?: string;
  name: string;
  className?: string;
}

export function CompanyLogo({ url, name, className = '' }: CompanyLogoProps) {
  const [hasError, setHasError] = useState(false);

  if (!url || hasError) {
    const bgColor = getHashColor(name || '?');
    const initial = name ? name.charAt(0).toUpperCase() : '?';
    return (
      <div className={`flex items-center justify-center text-white font-bold ${bgColor} ${className}`}>
        {initial}
      </div>
    );
  }

  return (
    <img 
      src={url} 
      alt={name} 
      className={className} 
      onError={() => setHasError(true)} 
    />
  );
}
