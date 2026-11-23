import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Search, Heart, History, Radio, X, Users, Sparkles } from 'lucide-react';
import { Badge } from '../ui/Badge';
import { usePlayer } from '../../context/PlayerContext';

const navLinks = [
  { to: '/discover', label: 'Discover' },
  { to: '/music-map', label: 'Music Map', badge: 'AI' },
  { to: '/mood-match', label: 'Mood Match', badge: 'AI' },
  { to: '/pick-for-me', label: 'Pick For Me', badge: 'AI' },
  { to: '/blend', label: 'Music Blend', badge: 'AI' },
  { to: '/together', label: 'Music Together', badge: 'Beta' },
];

export function Header() {
  const location = useLocation();
  const { favourites, playSong, recentlyPlayed } = usePlayer();
  const [showFavs, setShowFavs] = useState(false);
  const [showHistory, setShowHistory] = useState(false);

  return (
    <>
      {/* Desktop Header (>= 768px): Kept identical */}
      <header className="hidden md:flex fixed top-0 left-0 right-0 z-50 h-16 items-center justify-between px-6 bg-obsidian/90 backdrop-blur-md border-b border-white/5">
        <Link to="/" className="flex items-center gap-2 flex-shrink-0">
          <div className="w-8 h-8 bg-amber-500 rounded-lg flex items-center justify-center shadow-lg shadow-amber-500/20">
            <Radio className="w-5 h-5 text-black" />
          </div>
          <span className="font-serif text-xl font-bold text-white tracking-tight">Moodify</span>
        </Link>

        <nav className="flex items-center gap-1">
          {navLinks.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm transition-colors ${
                location.pathname === link.to ||
                (link.to !== '/' && location.pathname.startsWith(link.to))
                  ? 'bg-white/10 text-white font-medium'
                  : 'text-gray-400 hover:text-white hover:bg-white/5'
              }`}
            >
              {link.label}
              {link.badge && (
                <Badge variant={link.badge === 'Beta' ? 'beta' : 'ai'}>{link.badge}</Badge>
              )}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <Link
            to="/discover"
            className="p-2 rounded-lg text-gray-400 hover:text-white hover:bg-white/5 transition-colors"
          >
            <Search className="w-5 h-5" />
          </Link>
          <button
            className="relative p-2 rounded-lg text-gray-400 hover:text-white hover:bg-white/5 transition-colors"
            onClick={() => {
              setShowFavs(!showFavs);
              setShowHistory(false);
            }}
          >
            <Heart className="w-5 h-5" />
            {favourites.length > 0 && (
              <span className="absolute top-1 right-1 w-2 h-2 bg-amber-500 rounded-full" />
            )}
          </button>
          <button
            className="p-2 rounded-lg text-gray-400 hover:text-white hover:bg-white/5 transition-colors"
            onClick={() => {
              setShowHistory(!showHistory);
              setShowFavs(false);
            }}
          >
            <History className="w-5 h-5" />
          </button>
        </div>
      </header>

      {/* Sleek Mobile Top Bar (< 768px): Native Spotify / Apple Music feel */}
      <header className="md:hidden fixed top-0 left-0 right-0 z-50 h-14 backdrop-blur-xl bg-[#09090B]/85 border-b border-white/5 flex items-center justify-between px-3.5">
        <Link to="/" className="flex items-center gap-2">
          <div className="w-7 h-7 bg-amber-500 rounded-lg flex items-center justify-center shadow-md shadow-amber-500/20">
            <Radio className="w-4 h-4 text-black" />
          </div>
          <span className="font-serif text-lg font-bold text-white tracking-tight">Moodify</span>
        </Link>

        <div className="flex items-center gap-1">
          {/* Quick Together Beta button */}
          <Link
            to="/together"
            className={`px-2 py-1 rounded-lg text-[11px] font-semibold flex items-center gap-1 border transition-colors ${
              location.pathname === '/together'
                ? 'bg-amber-500 text-black border-amber-400'
                : 'bg-white/5 text-gray-300 border-white/10 hover:text-white'
            }`}
          >
            <Users className="w-3.5 h-3.5" />
            <span>Room</span>
            <span className="text-[9px] px-1 py-0.2 rounded bg-amber-500/20 text-amber-400 font-mono">
              β
            </span>
          </Link>

          <Link
            to="/discover"
            className="p-1.5 rounded-lg text-gray-400 hover:text-white hover:bg-white/5 transition-colors"
          >
            <Search className="w-4 h-4" />
          </Link>

          <button
            className="relative p-1.5 rounded-lg text-gray-400 hover:text-white hover:bg-white/5 transition-colors"
            onClick={() => {
              setShowFavs(!showFavs);
              setShowHistory(false);
            }}
          >
            <Heart className="w-4 h-4" />
            {favourites.length > 0 && (
              <span className="absolute top-1 right-1 w-1.5 h-1.5 bg-amber-500 rounded-full" />
            )}
          </button>

          <button
            className="p-1.5 rounded-lg text-gray-400 hover:text-white hover:bg-white/5 transition-colors"
            onClick={() => {
              setShowHistory(!showHistory);
              setShowFavs(false);
            }}
          >
            <History className="w-4 h-4" />
          </button>
        </div>
      </header>

      {/* Favourites Drawer */}
      {showFavs && (
        <div className="fixed top-14 md:top-16 right-3 left-3 sm:left-auto sm:right-4 z-50 sm:w-80 card p-4 shadow-2xl border border-white/10 bg-[#131316]/95 backdrop-blur-xl">
          <div className="flex items-center justify-between mb-3 pb-2 border-b border-white/5">
            <div className="flex items-center gap-1.5">
              <Heart className="w-4 h-4 text-red-400 fill-red-400" />
              <h3 className="font-semibold text-white text-sm">
                Favourites ({favourites.length})
              </h3>
            </div>
            <button onClick={() => setShowFavs(false)} className="p-1 text-gray-400 hover:text-white">
              <X className="w-4 h-4" />
            </button>
          </div>
          <div className="space-y-2 max-h-80 overflow-y-auto pr-1">
            {favourites.length === 0 ? (
              <p className="text-gray-500 text-xs py-4 text-center">
                No favourites yet. Heart any track to save it here!
              </p>
            ) : (
              favourites.map((song) => (
                <div
                  key={song.id}
                  className="flex items-center gap-2.5 p-2 rounded-lg hover:bg-white/5 cursor-pointer transition-colors"
                  onClick={() => {
                    playSong(song);
                    setShowFavs(false);
                  }}
                >
                  <img
                    src={song.coverUrl}
                    alt=""
                    className="w-10 h-10 rounded-lg object-cover flex-shrink-0"
                  />
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-medium text-white truncate">{song.title}</p>
                    <p className="text-[11px] text-gray-400 truncate">{song.artist}</p>
                  </div>
                  <Badge variant="language">{song.language}</Badge>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {/* History Drawer */}
      {showHistory && (
        <div className="fixed top-14 md:top-16 right-3 left-3 sm:left-auto sm:right-4 z-50 sm:w-80 card p-4 shadow-2xl border border-white/10 bg-[#131316]/95 backdrop-blur-xl">
          <div className="flex items-center justify-between mb-3 pb-2 border-b border-white/5">
            <div className="flex items-center gap-1.5">
              <History className="w-4 h-4 text-amber-400" />
              <h3 className="font-semibold text-white text-sm">Recently Played</h3>
            </div>
            <button onClick={() => setShowHistory(false)} className="p-1 text-gray-400 hover:text-white">
              <X className="w-4 h-4" />
            </button>
          </div>
          <div className="space-y-2 max-h-80 overflow-y-auto pr-1">
            {recentlyPlayed.length === 0 ? (
              <p className="text-gray-500 text-xs py-4 text-center">
                No history yet. Start exploring and playing music!
              </p>
            ) : (
              recentlyPlayed.slice(0, 15).map((song) => (
                <div
                  key={song.id}
                  className="flex items-center gap-2.5 p-2 rounded-lg hover:bg-white/5 cursor-pointer transition-colors"
                  onClick={() => {
                    playSong(song);
                    setShowHistory(false);
                  }}
                >
                  <img
                    src={song.coverUrl}
                    alt=""
                    className="w-10 h-10 rounded-lg object-cover flex-shrink-0"
                  />
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-medium text-white truncate">{song.title}</p>
                    <p className="text-[11px] text-gray-400 truncate">{song.artist}</p>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </>
  );
}

export default Header;
