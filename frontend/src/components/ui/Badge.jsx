import React from 'react';

export function Badge({ children, variant = 'ai', className = '' }) {
  const variants = {
    ai: 'bg-amber-500/20 text-amber-400 border border-amber-500/30',
    beta: 'bg-purple-500/20 text-purple-400 border border-purple-500/30',
    preview: 'bg-blue-500/20 text-blue-400 border border-blue-500/30',
    language: 'bg-white/10 text-gray-300 border border-white/10',
  };
  return (
    <span className={`inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-semibold uppercase tracking-wider ${variants[variant]} ${className}`}>
      {children}
    </span>
  );
}
