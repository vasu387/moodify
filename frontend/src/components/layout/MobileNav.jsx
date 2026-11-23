import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Home, Map, Smile, Shuffle, Music2 } from 'lucide-react';

const navItems = [
  { to: '/discover', icon: Home, label: 'Discover' },
  { to: '/music-map', icon: Map, label: 'Map' },
  { to: '/mood-match', icon: Smile, label: 'Mood' },
  { to: '/pick-for-me', icon: Shuffle, label: 'Pick' },
  { to: '/blend', icon: Music2, label: 'Blend' },
];

export function MobileNav() {
  const location = useLocation();

  return (
    <nav className="md:hidden fixed bottom-2 left-3 right-3 z-50 h-12 rounded-2xl bg-[#131316]/95 backdrop-blur-xl border border-white/10 shadow-[0_8px_32px_rgba(0,0,0,0.6)] flex items-center justify-around px-2">
      {navItems.map(({ to, icon: Icon, label }) => {
        const active =
          location.pathname === to || (to !== '/' && location.pathname.startsWith(to));
        return (
          <Link
            key={to}
            to={to}
            className={`flex flex-col items-center justify-center gap-0.5 py-1 px-3 rounded-xl transition-all ${
              active
                ? 'text-amber-400 font-semibold scale-105'
                : 'text-gray-400 hover:text-gray-200'
            }`}
          >
            <Icon className="w-[18px] h-[18px]" />
            <span className="text-[10px] tracking-tight">{label}</span>
          </Link>
        );
      })}
    </nav>
  );
}

export default MobileNav;
