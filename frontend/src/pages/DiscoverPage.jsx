import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Search,
  TrendingUp,
  Flame,
  ArrowRight,
  Sparkles,
  Music2,
  Clock,
  Play,
  Heart,
} from 'lucide-react';
import { mockSongs } from '../data/mockSongs';
import { SongCard } from '../components/ui/SongCard';
import { Badge } from '../components/ui/Badge';
import { Button } from '../components/ui/Button';
import { usePlayer } from '../context/PlayerContext';

const LANGUAGES = ['All', 'Tamil', 'English', 'Hindi', 'Telugu', 'Malayalam'];

const CURATED_PLAYLISTS = [
  {
    id: 'p1',
    title: 'Rainy Night Melodies',
    lang: 'Tamil',
    mood: 'Nostalgic',
    cover: 'https://images.unsplash.com/photo-1519692933481-e162a57d6721?w=400&h=400&fit=crop',
    trackCount: '18 songs',
  },
  {
    id: 'p2',
    title: 'Late Night Synth Drive',
    lang: 'English',
    mood: 'Late night',
    cover: 'https://images.unsplash.com/photo-1508700115892-45ecd05ae2ad?w=400&h=400&fit=crop',
    trackCount: '24 songs',
  },
  {
    id: 'p3',
    title: 'Sufi & Soul Longing',
    lang: 'Hindi',
    mood: 'Romantic',
    cover: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=400&h=400&fit=crop',
    trackCount: '15 songs',
  },
  {
    id: 'p4',
    title: 'Acoustic Coffee Morning',
    lang: 'English',
    mood: 'Peaceful',
    cover: 'https://images.unsplash.com/photo-1495616811223-4d98c6e9c869?w=400&h=400&fit=crop',
    trackCount: '20 songs',
  },
  {
    id: 'p5',
    title: 'Anirudh High Energy Beats',
    lang: 'Tamil',
    mood: 'Energetic',
    cover: 'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=400&h=400&fit=crop',
    trackCount: '16 songs',
  },
  {
    id: 'p6',
    title: 'Deep Heartbreak Catharsis',
    lang: 'Tamil & Hindi',
    mood: 'Heartbroken',
    cover: 'https://images.unsplash.com/photo-1483000805330-4eaf0a0d82da?w=400&h=400&fit=crop',
    trackCount: '22 songs',
  },
];

const ARC_ALBUMS = [
  {
    song: mockSongs[0],
    style: 'top-8 left-4 -rotate-12 lg:-left-4 lg:top-12',
  },
  {
    song: mockSongs[10],
    style: 'bottom-12 left-8 rotate-6 lg:left-12 lg:bottom-16',
  },
  {
    song: mockSongs[1],
    style: 'top-20 right-6 rotate-12 lg:right-2 lg:top-10',
  },
  {
    song: mockSongs[20],
    style: 'bottom-8 right-8 -rotate-6 lg:right-16 lg:bottom-12',
  },
];

export function DiscoverPage() {
  const navigate = useNavigate();
  const [heroSearch, setHeroSearch] = useState('');
  const [selectedLanguage, setSelectedLanguage] = useState('All');
  const { playSong, recentlyPlayed } = usePlayer();

  const handleHeroSearch = (e) => {
    e.preventDefault();
    if (heroSearch.trim()) {
      navigate(`/mood-match?q=${encodeURIComponent(heroSearch.trim())}`);
    }
  };

  const trendingTracks = mockSongs.slice(0, 8);

  const filteredCatalog =
    selectedLanguage === 'All'
      ? mockSongs
      : mockSongs.filter((s) => s.language === selectedLanguage);

  return (
    <div className="pb-36 md:pb-24 px-3.5 md:px-6 max-w-7xl mx-auto space-y-10 md:space-y-16">
      {/* Hero Section */}
      <section className="relative px-2 pt-1 pb-8 md:pt-4 md:pb-24 overflow-hidden text-center">
        {/* Ambient background glow */}
        <div className="absolute inset-0 bg-glow-amber opacity-35 pointer-events-none" />

        {/* Floating Album Art Arc (Desktop & Tablet) */}
        <div className="hidden md:block absolute inset-0 pointer-events-none z-0">
          {ARC_ALBUMS.map((item, idx) => (
            <div
              key={idx}
              className={`absolute ${item.style} w-24 h-24 lg:w-28 lg:h-28 rounded-2xl overflow-hidden shadow-2xl ring-1 ring-white/10 opacity-70 hover:opacity-100 transition-opacity`}
            >
              <img
                src={item.song.coverUrl}
                alt=""
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-black/30" />
            </div>
          ))}
        </div>

        <div className="relative z-10 max-w-3xl mx-auto space-y-3.5 md:space-y-5">
          {/* Trending Today Pill */}
          <div className="inline-flex items-center gap-1.5 px-3 py-1 md:px-4 md:py-1.5 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-400 text-[11px] md:text-xs font-semibold uppercase tracking-wider">
            <Flame className="w-3.5 h-3.5" />
            <span>Trending today</span>
          </div>

          {/* Compact Serif Headline on Mobile (< 768px: text-[26px] leading-[1.15]) */}
          <h1 className="font-serif text-[26px] leading-[1.15] md:text-5xl lg:text-7xl font-extrabold text-white tracking-tight">
            Every mood. Every song.<br className="hidden sm:inline" />{' '}
            <span className="text-amber-400 italic">Every vibe.</span>
          </h1>

          <p className="text-gray-400 text-xs md:text-lg max-w-xl mx-auto leading-relaxed">
            What's trending in Tamil & English, and what fits your exact headspace right now.
          </p>

          {/* Glowing Amber-Bordered Search Bar */}
          <form
            onSubmit={handleHeroSearch}
            className="relative max-w-xl mx-auto mt-4 md:mt-6"
          >
            <div className="relative flex items-center bg-charcoal border-2 border-amber-500/40 hover:border-amber-500 rounded-2xl overflow-hidden focus-within:border-amber-400 focus-within:shadow-[0_0_25px_rgba(245,166,35,0.3)] transition-all">
              <Search className="w-4 h-4 md:w-5 md:h-5 text-gray-400 absolute left-3.5 md:left-4" />
              <input
                type="text"
                value={heroSearch}
                onChange={(e) => setHeroSearch(e.target.value)}
                placeholder="e.g., Emotional Tamil melodies for a rainy night..."
                className="w-full bg-transparent pl-10 pr-12 md:pl-12 md:pr-14 py-3 md:py-4 text-xs md:text-sm text-white placeholder-gray-500 focus:outline-none"
              />
              <button
                type="submit"
                className="absolute right-2 md:right-3 w-8 h-8 md:w-10 md:h-10 bg-amber-500 hover:bg-amber-400 rounded-xl flex items-center justify-center text-black font-bold transition-all shadow-md flex-shrink-0"
              >
                <ArrowRight className="w-4 h-4 md:w-5 md:h-5" />
              </button>
            </div>
          </form>
        </div>
      </section>

      {/* Language Filter Tabs */}
      <section className="space-y-3 md:space-y-4">
        <div className="flex items-center justify-between pb-2 border-b border-white/5">
          <div className="flex items-center gap-2">
            <Music2 className="w-4 h-4 text-amber-400" />
            <h2 className="font-serif text-xl md:text-2xl font-bold text-white">Explore Catalog</h2>
          </div>
          <span className="text-[11px] md:text-xs text-gray-400">
            {filteredCatalog.length} tracks
          </span>
        </div>

        <div className="flex gap-1.5 md:gap-2 overflow-x-auto pb-2 scrollbar-none">
          {LANGUAGES.map((lang) => {
            const isSelected = selectedLanguage === lang;
            return (
              <button
                key={lang}
                onClick={() => setSelectedLanguage(lang)}
                className={`px-3.5 md:px-4 py-1.5 md:py-2 rounded-full text-xs font-semibold uppercase tracking-wider transition-all flex-shrink-0 ${
                  isSelected
                    ? 'bg-amber-500 text-black shadow-md shadow-amber-500/20'
                    : 'bg-white/5 text-gray-400 hover:text-white hover:bg-white/10 border border-white/5'
                }`}
              >
                {lang}
              </button>
            );
          })}
        </div>
      </section>

      {/* Trending Tracks Grid */}
      <section className="space-y-3 md:space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-amber-400" />
            <h2 className="font-serif text-xl md:text-2xl font-bold text-white">Trending Tracks</h2>
          </div>
          <span className="text-[11px] md:text-xs text-amber-400/90 font-medium">Updated Hourly</span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4">
          {trendingTracks.map((song, i) => (
            <div
              key={song.id}
              className="card p-2.5 md:p-3 flex flex-col justify-between hover:border-amber-500/40 transition-all duration-200 group"
            >
              <div className="relative aspect-square w-full rounded-xl overflow-hidden mb-2.5">
                <img
                  src={song.coverUrl}
                  alt={song.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <button
                  onClick={() => playSong(song, trendingTracks)}
                  className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity"
                >
                  <div className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-amber-500 flex items-center justify-center text-black shadow-xl">
                    <Play className="w-4 h-4 md:w-5 md:h-5 fill-black ml-0.5" />
                  </div>
                </button>
                <div className="absolute top-1.5 left-1.5 md:top-2 md:left-2 w-5 h-5 md:w-6 md:h-6 rounded-md bg-black/75 backdrop-blur text-white text-[10px] md:text-xs font-bold flex items-center justify-center">
                  #{i + 1}
                </div>
              </div>

              <div>
                <h3 className="font-medium text-white text-xs md:text-sm truncate group-hover:text-amber-400 transition-colors">
                  {song.title}
                </h3>
                <p className="text-[11px] md:text-xs text-gray-400 truncate mt-0.5">{song.artist}</p>
                <div className="flex items-center justify-between mt-2 pt-2 border-t border-white/5">
                  <Badge variant="language">{song.language}</Badge>
                  <span className="text-[10px] md:text-[11px] text-gray-500">{song.genre}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Curated Mood Playlists */}
      <section className="space-y-3 md:space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-amber-400" />
            <h2 className="font-serif text-xl md:text-2xl font-bold text-white">Curated Playlists</h2>
          </div>
          <span className="text-[11px] md:text-xs text-gray-400">Handcrafted by Moodify</span>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 md:gap-4">
          {CURATED_PLAYLISTS.map((playlist) => (
            <div
              key={playlist.id}
              onClick={() => navigate(`/mood-match?q=${encodeURIComponent(playlist.mood)}`)}
              className="card p-2.5 md:p-3 cursor-pointer hover:border-amber-500/40 transition-all group"
            >
              <div className="relative aspect-square w-full rounded-xl overflow-hidden mb-2">
                <img
                  src={playlist.cover}
                  alt={playlist.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-80" />
                <span className="absolute bottom-1.5 left-1.5 text-[9px] font-semibold uppercase px-1.5 py-0.5 rounded bg-black/60 text-amber-400 border border-amber-400/30">
                  {playlist.lang}
                </span>
              </div>
              <h4 className="font-medium text-xs md:text-sm text-white truncate group-hover:text-amber-400 transition-colors">
                {playlist.title}
              </h4>
              <p className="text-[10px] md:text-[11px] text-gray-500 mt-0.5">{playlist.trackCount}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Recently Played (from localStorage) */}
      {recentlyPlayed.length > 0 && (
        <section className="space-y-3 md:space-y-4">
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-amber-400" />
            <h2 className="font-serif text-xl md:text-2xl font-bold text-white">Recently Played</h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5 md:gap-3">
            {recentlyPlayed.slice(0, 6).map((song) => (
              <SongCard key={song.id} song={song} songs={recentlyPlayed} />
            ))}
          </div>
        </section>
      )}

      {/* Filtered Track Catalog */}
      <section className="space-y-3 md:space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="font-serif text-xl md:text-2xl font-bold text-white">
            {selectedLanguage === 'All' ? 'All Songs' : `${selectedLanguage} Songs`}
          </h2>
          <span className="text-[11px] md:text-xs text-gray-400">
            {filteredCatalog.length} songs
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5 md:gap-3">
          {filteredCatalog.map((song) => (
            <SongCard key={song.id} song={song} songs={filteredCatalog} />
          ))}
        </div>
      </section>
    </div>
  );
}

export default DiscoverPage;
