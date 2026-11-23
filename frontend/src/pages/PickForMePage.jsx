import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Shuffle, RotateCcw, Play, Heart, Map, Sparkles, SlidersHorizontal, Check } from 'lucide-react';
import { getPickForMe } from '../services/api';
import { mockSongs } from '../data/mockSongs';
import { Badge } from '../components/ui/Badge';
import { Button } from '../components/ui/Button';
import { usePlayer } from '../context/PlayerContext';

const FILTERS = {
  language: {
    label: 'Language',
    options: ['Any', 'Tamil', 'Hindi', 'English', 'Telugu', 'Malayalam'],
  },
  mood: {
    label: 'Mood',
    options: ['Any', 'Happy', 'Sad', 'Relaxed', 'Romantic', 'Energetic', 'Nostalgic'],
  },
  genre: {
    label: 'Genre',
    options: ['Anything', 'Pop', 'Rock', 'Lo-fi', 'Classical', 'EDM', 'Indie', 'Melody'],
  },
  duration: {
    label: 'Duration',
    options: ['Any', 'Under 3 min', 'Under 5 min'],
  },
  energy: {
    label: 'Energy',
    options: ['Any', 'Low', 'Medium', 'High'],
  },
  discovery: {
    label: 'Discovery',
    options: ['Familiar style', 'Something new'],
  },
};

const DEFAULT_FILTERS = {
  language: 'Any',
  mood: 'Any',
  genre: 'Anything',
  duration: 'Any',
  energy: 'Any',
  discovery: 'Familiar style',
};

const AI_REASONS = [
  'Matches your current energy curve',
  'Hidden sonic gem in your selected language',
  'Harmonic cadence tailored to your mood',
  'Critically acclaimed arrangement',
  'Matches tempo & acoustic profile',
  'Mood-certified dynamic progression',
];

export function PickForMePage() {
  const [filters, setFilters] = useState(DEFAULT_FILTERS);
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [skipPlayed, setSkipPlayed] = useState(false);
  const { playSong, recentlyPlayed, toggleFavourite, isFavourite } = usePlayer();
  const navigate = useNavigate();

  const handlePick = async () => {
    setLoading(true);
    try {
      let songs = await getPickForMe(filters);
      if (skipPlayed && recentlyPlayed.length > 0) {
        const recentIds = new Set(recentlyPlayed.map((r) => r.id));
        const filtered = songs.filter((s) => !recentIds.has(s.id));
        songs = filtered.length >= 3 ? filtered : songs;
      }
      setResults(songs.slice(0, 5));
    } finally {
      setLoading(false);
    }
  };

  const handleSurpriseAgain = async () => {
    setLoading(true);
    try {
      // Shuffle from entire mock catalog with slightly different seeds
      const shuffled = [...mockSongs].sort(() => Math.random() - 0.5).slice(0, 5);
      const withMatch = shuffled.map((s) => ({
        ...s,
        matchPercent: Math.floor(Math.random() * 15) + 84,
      }));
      setResults(withMatch);
    } finally {
      setLoading(false);
    }
  };

  const setFilterValue = (key, val) => {
    setFilters((prev) => ({ ...prev, [key]: val }));
  };

  const resetFilters = () => {
    setFilters(DEFAULT_FILTERS);
    setResults([]);
  };

  return (
    <div className="pb-36 md:pb-36 px-3.5 md:px-6 max-w-6xl mx-auto">
      {/* Header */}
      <div className="mb-6 md:mb-8">
        <div className="flex items-center gap-1.5 mb-1.5">
          <Badge variant="ai">AI</Badge>
          <span className="text-[11px] md:text-xs uppercase tracking-wider text-gray-400 font-semibold">
            Precision Music Selector
          </span>
        </div>
        <h1 className="font-serif text-[26px] leading-[1.15] md:text-5xl font-bold text-white mb-2 md:mb-3">
          Pick a song for me.
        </h1>
        <p className="text-gray-400 text-xs md:text-base max-w-2xl leading-relaxed">
          Tell us your sonic coordinates or keep it loose. Our AI weighs tempo, language, emotional
          timbre, and discovery depth to surface your next obsession.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 md:gap-8 items-start">
        {/* Interactive Filter Panel (Reelipse Matte Card style) */}
        <div className="lg:col-span-5 card p-4 md:p-6 space-y-4 md:space-y-6">
          <div className="flex items-center justify-between pb-3 border-b border-white/5">
            <div className="flex items-center gap-2 text-white font-medium text-sm">
              <SlidersHorizontal className="w-4 h-4 text-amber-400" />
              <span>Taste Tuning</span>
            </div>
            <button
              onClick={resetFilters}
              className="text-xs text-gray-400 hover:text-amber-400 transition-colors flex items-center gap-1"
            >
              <RotateCcw className="w-3 h-3" />
              Reset
            </button>
          </div>

          <div className="space-y-5">
            {Object.entries(FILTERS).map(([key, { label, options }]) => (
              <div key={key}>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-semibold uppercase tracking-wider text-gray-400">
                    {label}
                  </span>
                  <span className="text-xs text-amber-400 font-medium">
                    {filters[key]}
                  </span>
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {options.map((option) => {
                    const isSelected = filters[key] === option;
                    return (
                      <button
                        key={option}
                        onClick={() => setFilterValue(key, option)}
                        className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all duration-150 ${
                          isSelected
                            ? 'bg-amber-500 text-black font-semibold shadow-md shadow-amber-500/20'
                            : 'bg-white/5 text-gray-400 hover:text-white hover:bg-white/10 border border-white/5'
                        }`}
                      >
                        {option}
                      </button>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>

          {/* Options & Action */}
          <div className="pt-4 border-t border-white/5 space-y-4">
            <label className="flex items-center gap-2 text-xs text-gray-300 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={skipPlayed}
                onChange={(e) => setSkipPlayed(e.target.checked)}
                className="rounded border-white/20 bg-white/5 text-amber-500 focus:ring-amber-500/30 accent-amber-500"
              />
              <span>Skip songs I've played recently</span>
            </label>

            <Button
              onClick={handlePick}
              disabled={loading}
              size="lg"
              className="w-full shadow-lg shadow-amber-500/10 text-base"
            >
              {loading ? (
                <>
                  <div className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin mr-2" />
                  Synthesizing Selection...
                </>
              ) : (
                <>
                  <Shuffle className="w-4 h-4 mr-1" />
                  Pick My Music
                </>
              )}
            </Button>
          </div>
        </div>

        {/* Shortlist Results View */}
        <div className="lg:col-span-7 space-y-4">
          {results.length === 0 && !loading && (
            <div className="card p-12 text-center flex flex-col items-center justify-center border-dashed border-white/10">
              <div className="w-16 h-16 rounded-2xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400 mb-4">
                <Sparkles className="w-7 h-7" />
              </div>
              <h3 className="font-serif text-xl font-bold text-white mb-2">
                Ready to find your match
              </h3>
              <p className="text-gray-400 text-sm max-w-sm mb-6 leading-relaxed">
                Adjust your mood, language, and energy dials on the left, then hit{' '}
                <span className="text-amber-400 font-semibold">Pick My Music</span> to generate an
                AI-ranked shortlist.
              </p>
              <Button onClick={handlePick} variant="secondary" size="md">
                Quick Pick (Surprise Me)
              </Button>
            </div>
          )}

          {loading && (
            <div className="card p-8 space-y-4 animate-pulse">
              <div className="h-4 bg-white/10 rounded w-1/3 mb-6" />
              {[1, 2, 3, 4, 5].map((i) => (
                <div key={i} className="flex items-center gap-4 py-2 border-b border-white/5 last:border-0">
                  <div className="w-12 h-12 bg-white/10 rounded-xl flex-shrink-0" />
                  <div className="flex-1 space-y-2">
                    <div className="h-4 bg-white/10 rounded w-3/4" />
                    <div className="h-3 bg-white/5 rounded w-1/2" />
                  </div>
                  <div className="w-16 h-6 bg-white/10 rounded-full" />
                </div>
              ))}
            </div>
          )}

          {results.length > 0 && !loading && (
            <div className="space-y-4">
              <div className="flex items-center justify-between pb-1">
                <div className="flex items-center gap-2">
                  <span className="font-serif text-xl font-bold text-white">Your AI Shortlist</span>
                  <Badge variant="ai">Top 5 Matches</Badge>
                </div>
                <button
                  onClick={handleSurpriseAgain}
                  className="flex items-center gap-1.5 text-xs text-amber-400 hover:text-amber-300 transition-colors font-medium"
                >
                  <Shuffle className="w-3.5 h-3.5" />
                  Surprise Me Again
                </button>
              </div>

              <div className="space-y-3">
                {results.map((song, idx) => {
                  const fav = isFavourite(song.id);
                  const reason = AI_REASONS[idx % AI_REASONS.length];
                  return (
                    <div
                      key={song.id}
                      className="card p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:border-amber-500/30 transition-all duration-200 group"
                    >
                      <div className="flex items-center gap-4 min-w-0">
                        <div className="relative w-14 h-14 rounded-xl overflow-hidden flex-shrink-0 group-hover:shadow-md group-hover:shadow-amber-500/20">
                          <img
                            src={song.coverUrl}
                            alt={song.title}
                            className="w-full h-full object-cover"
                          />
                          <button
                            onClick={() => playSong(song, results)}
                            className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity text-white"
                          >
                            <Play className="w-6 h-6 fill-white text-white" />
                          </button>
                        </div>

                        <div className="min-w-0">
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className="font-medium text-white text-base truncate">
                              {song.title}
                            </span>
                            <Badge variant="language">{song.language}</Badge>
                            <span className="px-2 py-0.5 rounded-full bg-amber-500/15 text-amber-400 text-xs font-bold border border-amber-500/30">
                              {song.matchPercent || 92}% Match
                            </span>
                          </div>
                          <p className="text-gray-400 text-xs truncate mt-0.5">
                            {song.artist} • <span className="text-gray-500">{song.album}</span>
                          </p>
                          <p className="text-[11px] text-amber-400/90 mt-1 flex items-center gap-1 italic">
                            <Sparkles className="w-3 h-3 flex-shrink-0" />
                            {reason}
                          </p>
                        </div>
                      </div>

                      {/* Card Actions */}
                      <div className="flex items-center gap-2 self-end sm:self-center flex-shrink-0">
                        <button
                          onClick={() => playSong(song, results)}
                          className="px-3 py-1.5 rounded-lg bg-amber-500 hover:bg-amber-400 text-black text-xs font-semibold flex items-center gap-1.5 transition-colors"
                        >
                          <Play className="w-3.5 h-3.5 fill-black" />
                          Play
                        </button>
                        <button
                          onClick={() => toggleFavourite(song)}
                          className={`p-2 rounded-lg border transition-colors ${
                            fav
                              ? 'border-red-500/40 text-red-400 bg-red-500/10'
                              : 'border-white/10 text-gray-400 hover:text-white hover:bg-white/5'
                          }`}
                          title="Save Favourite"
                        >
                          <Heart className={`w-4 h-4 ${fav ? 'fill-current' : ''}`} />
                        </button>
                        <button
                          onClick={() => navigate('/music-map')}
                          className="p-2 rounded-lg border border-white/10 text-gray-400 hover:text-amber-400 hover:border-amber-500/30 transition-colors"
                          title="Discover Similar on Music Map"
                        >
                          <Map className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default PickForMePage;

