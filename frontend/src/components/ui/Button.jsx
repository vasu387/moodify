import React from 'react';

export function Button({ children, variant = 'primary', size = 'md', className = '', onClick, disabled, type = 'button' }) {
  const base = 'inline-flex items-center justify-center gap-2 font-semibold rounded-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed';
  const variants = {
    primary: 'bg-amber-500 hover:bg-amber-400 text-black',
    secondary: 'bg-white/10 hover:bg-white/15 text-white border border-white/10',
    ghost: 'hover:bg-white/5 text-gray-400 hover:text-white',
    danger: 'bg-red-500/20 hover:bg-red-500/30 text-red-400',
  };
  const sizes = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2 text-sm',
    lg: 'px-6 py-3 text-base',
    xl: 'px-8 py-4 text-lg',
  };
  return (
    <button type={type} className={`${base} ${variants[variant]} ${sizes[size]} ${className}`} onClick={onClick} disabled={disabled}>
      {children}
    </button>
  );
}
