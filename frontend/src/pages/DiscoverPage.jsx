import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Search,
  Flame,
  ArrowRight,
  Sparkles,
  Music2,
  Clock,
  Play,
  Heart,
  Check,
  RotateCcw,
  Users,
} from 'lucide-react';
import { mockSongs, TOP_CREATORS } from '../data/mockSongs';
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
  const [selectedCreator, setSelectedCreator] = useState(null);

  const { playSong, recentlyPlayed, currentSong, isPlaying, toggleFavourite, isFavourite } =
    usePlayer();

  const handleHeroSearch = (e) => {
    e.preventDefault();
    if (heroSearch.trim()) {
      navigate(`/mood-match?q=${encodeURIComponent(heroSearch.trim())}`);
    }
  };

  const handleCreatorClick = (creator) => {
    if (selectedCreator?.id === creator.id) {
      setSelectedCreator(null);
    } else {
      setSelectedCreator(creator);
    }
  };

  // Filtered Trending Songs based on creator & language
  const trendingSongs = useMemo(() => {
    let list = [...mockSongs];

    if (selectedCreator) {
      list = list.filter((s) =>
        s.artist.toLowerCase().includes(selectedCreator.filterKey.toLowerCase())
      );
    }

    if (selectedLanguage !== 'All') {
      list = list.filter((s) => s.language === selectedLanguage);
    }

    return list;
  }, [selectedCreator, selectedLanguage]);

  const formatSec = (sec) => {
    if (!sec) return '0:00';
    const m = Math.floor(sec / 60);
    const s = Math.floor(sec % 60);
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  return (
    <div className="pb-36 md:pb-28 px-3.5 md:px-6 max-w-7xl mx-auto space-y-10 md:space-y-16">
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
            {trendingSongs.length} tracks displayed
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

      {/* SECTION 1: TOP CREATORS (Replacing Trending Tracks) */}
      <section className="space-y-3 md:space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Users className="w-4 h-4 text-amber-400" />
            <h2 className="font-serif text-xl md:text-2xl font-bold text-white">Top Creators</h2>
            <span className="px-2 py-0.5 rounded-full bg-amber-500/15 border border-amber-500/30 text-amber-400 text-[10px] md:text-xs font-semibold uppercase tracking-wider">
              Trending Now
            </span>
          </div>

          {selectedCreator && (
            <button
              onClick={() => setSelectedCreator(null)}
              className="text-xs text-amber-400 hover:text-amber-300 flex items-center gap-1 transition-colors"
            >
              <RotateCcw className="w-3 h-3" />
              <span>Show All Creators</span>
            </button>
          )}
        </div>

        {/* 8 Creator Cards Responsive Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
          {TOP_CREATORS.map((creator) => {
            const isSelected = selectedCreator?.id === creator.id;
            const trackCount = mockSongs.filter((s) =>
              s.artist.toLowerCase().includes(creator.filterKey.toLowerCase())
            ).length;

            return (
              <div
                key={creator.id}
                onClick={() => handleCreatorClick(creator)}
                className={`card p-3 rounded-2xl cursor-pointer transition-all duration-200 group flex items-center gap-3 relative overflow-hidden ${
                  isSelected
                    ? 'border-[#F5A623] bg-amber-500/10 shadow-lg shadow-amber-500/20 ring-1 ring-amber-400/50 scale-[1.02]'
                    : 'hover:border-white/20 hover:bg-white/5'
                }`}
              >
                {/* Stylized Creator Artwork */}
                <div className="relative w-12 h-12 md:w-14 md:h-14 rounded-xl overflow-hidden flex-shrink-0 shadow-md ring-1 ring-white/10">
                  <img
                    src={creator.image}
                    alt={creator.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  {isSelected && (
                    <div className="absolute inset-0 bg-amber-500/40 backdrop-blur-[1px] flex items-center justify-center">
                      <Check className="w-5 h-5 text-black stroke-[3]" />
                    </div>
                  )}
                </div>

                {/* Creator Details */}
                <div className="min-w-0 flex-1">
                  <h4
                    className={`font-serif text-xs md:text-sm font-bold truncate leading-tight ${
                      isSelected ? 'text-amber-400' : 'text-white group-hover:text-amber-300'
                    }`}
                  >
                    {creator.name}
                  </h4>
                  <p className="text-[10px] md:text-[11px] text-gray-400 truncate mt-0.5">
                    {creator.tag}
                  </p>
                  <span className="text-[9px] md:text-[10px] text-amber-400/90 font-mono mt-1 inline-block">
                    {trackCount} {trackCount === 1 ? 'Track' : 'Tracks'}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* SECTION 2: TRENDING SONGS (Replacing All Songs with Ranked Rows) */}
      <section className="space-y-3 md:space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-1 border-b border-white/5">
          <div className="flex items-center gap-2 flex-wrap">
            <Flame className="w-4 h-4 text-amber-400" />
            <h2 className="font-serif text-xl md:text-2xl font-bold text-white">
              Trending Songs
              {selectedCreator && (
                <span className="text-amber-400 font-sans text-base font-normal ml-2">
                  • {selectedCreator.name}
                </span>
              )}
            </h2>
          </div>

          <div className="flex items-center gap-3">
            <span className="text-[11px] md:text-xs text-gray-400">
              {trendingSongs.length} {trendingSongs.length === 1 ? 'song' : 'songs'} in chart
            </span>
            {selectedCreator && (
              <button
                onClick={() => setSelectedCreator(null)}
                className="text-xs px-2.5 py-1 rounded-lg bg-white/5 hover:bg-white/10 text-gray-300 border border-white/10 transition-colors"
              >
                Clear filter
              </button>
            )}
          </div>
        </div>

        {/* Ranked Song Rows with #1, #2, #3 badges */}
        {trendingSongs.length === 0 ? (
          <div className="card p-10 text-center">
            <p className="text-gray-400 text-sm">No songs match this specific creator & language filter.</p>
            <Button
              variant="secondary"
              size="sm"
              className="mt-3"
              onClick={() => {
                setSelectedCreator(null);
                setSelectedLanguage('All');
              }}
            >
              Reset Filters
            </Button>
          </div>
        ) : (
          <div className="space-y-2">
            {trendingSongs.map((song, i) => {
              const fav = isFavourite(song.id);
              const active = currentSong?.id === song.id;

              return (
                <div
                  key={song.id}
                  onClick={() => playSong(song, trendingSongs)}
                  className={`group card p-3 rounded-xl flex items-center justify-between gap-3 cursor-pointer transition-all duration-200 hover:border-amber-500/30 ${
                    active
                      ? 'bg-amber-500/10 border-amber-500/30'
                      : 'hover:bg-white/5'
                  }`}
                >
                  <div className="flex items-center gap-3 md:gap-4 min-w-0 flex-1">
                    {/* Rank Badge */}
                    <span
                      className={`text-sm md:text-base font-mono font-bold w-6 text-center flex-shrink-0 ${
                        i < 3 ? 'text-amber-400' : 'text-gray-500'
                      }`}
                    >
                      #{i + 1}
                    </span>

                    {/* Album Art with Play Hover */}
                    <div className="relative w-12 h-12 rounded-xl overflow-hidden flex-shrink-0 shadow-md">
                      <img
                        src={song.coverUrl}
                        alt={song.title}
                        className="w-full h-full object-cover"
                      />
                      <div
                        className={`absolute inset-0 bg-black/50 flex items-center justify-center transition-opacity ${
                          active && isPlaying ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'
                        }`}
                      >
                        <Play className="w-5 h-5 text-white fill-white ml-0.5" />
                      </div>
                      {active && isPlaying && (
                        <div className="absolute bottom-1 left-1/2 -translate-x-1/2 flex gap-0.5">
                          {[0, 1, 2].map((idx) => (
                            <div
                              key={idx}
                              className="w-0.5 bg-amber-400 rounded-full animate-bounce"
                              style={{ height: '7px', animationDelay: `${idx * 0.1}s` }}
                            />
                          ))}
                        </div>
                      )}
                    </div>

                    {/* Metadata */}
                    <div className="min-w-0 flex-1">
                      <p
                        className={`text-xs md:text-sm font-semibold truncate ${
                          active ? 'text-amber-400' : 'text-white group-hover:text-amber-300'
                        }`}
                      >
                        {song.title}
                      </p>
                      <p className="text-[11px] md:text-xs text-gray-400 truncate mt-0.5">
                        {song.artist} • <span className="text-gray-500">{song.album}</span>
                      </p>
                    </div>
                  </div>

                  {/* Badges, Duration & Actions */}
                  <div className="flex items-center gap-2 md:gap-3 flex-shrink-0">
                    <Badge variant="language" className="hidden sm:inline-flex">
                      {song.language}
                    </Badge>
                    <span className="text-xs font-mono text-gray-400">
                      {formatSec(song.durationSec)}
                    </span>

                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleFavourite(song);
                      }}
                      className={`p-2 rounded-lg transition-colors ${
                        fav ? 'text-red-400' : 'text-gray-400 hover:text-red-400'
                      }`}
                      title="Save favourite"
                    >
                      <Heart className={`w-4 h-4 ${fav ? 'fill-current' : ''}`} />
                    </button>

                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        playSong(song, trendingSongs);
                      }}
                      className="p-2 rounded-lg bg-white/5 hover:bg-amber-500 text-gray-300 hover:text-black transition-colors"
                      title="Play track"
                    >
                      <Play className="w-3.5 h-3.5 fill-current ml-0.5" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
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
              <div
                key={song.id}
                onClick={() => playSong(song, recentlyPlayed)}
                className="card p-2.5 rounded-xl flex items-center justify-between gap-3 hover:border-amber-500/30 cursor-pointer transition-colors"
              >
                <div className="flex items-center gap-2.5 min-w-0">
                  <img
                    src={song.coverUrl}
                    alt=""
                    className="w-10 h-10 rounded-lg object-cover flex-shrink-0"
                  />
                  <div className="min-w-0">
                    <p className="text-xs font-semibold text-white truncate">{song.title}</p>
                    <p className="text-[11px] text-gray-400 truncate">{song.artist}</p>
                  </div>
                </div>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleFavourite(song);
                  }}
                  className={`p-1.5 rounded-lg ${
                    isFavourite(song.id) ? 'text-red-400' : 'text-gray-400 hover:text-white'
                  }`}
                >
                  <Heart className={`w-3.5 h-3.5 ${isFavourite(song.id) ? 'fill-current' : ''}`} />
                </button>
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}

export default DiscoverPage;
