import React, { useState, useEffect, useRef } from 'react';
import { useSearchParams } from 'react-router-dom';
import { ArrowRight, Shuffle, Grid, Sparkles, Play, Plus, Check } from 'lucide-react';
import { moodMatrix, moodCategories, mockSongs } from '../data/mockSongs';
import { getMoodSongs } from '../services/api';
import { SongCard } from '../components/ui/SongCard';
import { Badge } from '../components/ui/Badge';
import { Button } from '../components/ui/Button';
import { usePlayer } from '../context/PlayerContext';

export function MoodMatchPage() {
  const [searchParams] = useSearchParams();
  const [input, setInput] = useState(searchParams.get('q') || '');
  const [activeCategory, setActiveCategory] = useState('all');
  const [selectedMood, setSelectedMood] = useState(null);
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [vibeNote, setVibeNote] = useState('');

  const resultsRef = useRef(null);
  const gridRef = useRef(null);
  const { playSong } = usePlayer();

  const filteredMoods =
    activeCategory === 'all'
      ? moodMatrix
      : moodMatrix.filter((m) => m.category === activeCategory);

  const handleSearchSubmit = async (e, customQuery) => {
    if (e) e.preventDefault();
    const query = (customQuery !== undefined ? customQuery : input).trim();
    if (!query) return;

    setLoading(true);
    try {
      const foundMood = moodMatrix.find(
        (m) =>
          m.name.toLowerCase() === query.toLowerCase() ||
          query.toLowerCase().includes(m.name.toLowerCase())
      );
      if (foundMood) {
        setSelectedMood(foundMood);
        setVibeNote(
          `You're in the "${foundMood.name}" headspace — ${foundMood.desc} Here are 5 tracks scientifically aligned with this state.`
        );
      } else {
        setSelectedMood({
          id: 'custom',
          name: query,
          emoji: '✨',
          category: 'lit',
          desc: `Reflecting your exact prompt: "${query}"`,
        });
        setVibeNote(
          `Analyzing linguistic sentiment and acoustic preference for "${query}". Surfacing 5 resonant Tamil, English & Hindi tracks.`
        );
      }

      const songs = await getMoodSongs(query);
      const finalSongs = songs.length > 0 ? songs : mockSongs.slice(0, 5);
      setResults(finalSongs);

      setTimeout(() => {
        resultsRef.current?.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    } finally {
      setLoading(false);
    }
  };

  const handleMoodCardClick = async (mood) => {
    setSelectedMood(mood);
    setInput(mood.name);
    setLoading(true);
    try {
      setVibeNote(
        `You're feeling "${mood.name}" — ${mood.desc} Here are 5 songs that match this exact frequency.`
      );
      const songs = await getMoodSongs(mood.name);
      const finalSongs = songs.length > 0 ? songs : mockSongs.slice(0, 5);
      setResults(finalSongs);

      setTimeout(() => {
        resultsRef.current?.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    } finally {
      setLoading(false);
    }
  };

  const handleRandomMood = () => {
    const random = moodMatrix[Math.floor(Math.random() * moodMatrix.length)];
    handleMoodCardClick(random);
  };

  useEffect(() => {
    const initialQ = searchParams.get('q');
    if (initialQ) {
      setInput(initialQ);
      handleSearchSubmit(null, initialQ);
    }
  }, [searchParams]);

  return (
    <div className="pb-36 md:pb-24 px-3.5 md:px-6">
      {/* Top Hero Section with Ambient Glow */}
      <section className="relative px-2 pt-1 pb-8 md:pt-4 md:pb-20 overflow-hidden text-center max-w-4xl mx-auto">
        {/* Purple-amber ambient radial glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[320px] md:w-[600px] h-[220px] md:h-[350px] bg-gradient-to-tr from-purple-600/20 via-amber-500/15 to-transparent blur-3xl pointer-events-none rounded-full" />

        <div className="relative z-10 space-y-3 md:space-y-4">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/5 border border-white/10 backdrop-blur-md">
            <Badge variant="ai">AI</Badge>
            <span className="text-[11px] md:text-xs text-gray-300 font-medium">
              Mood Match AI · 33 moods · Tamil, Hindi & English
            </span>
          </div>

          <h1 className="font-serif text-[26px] leading-[1.15] md:text-5xl lg:text-7xl font-bold text-white tracking-tight">
            How are you, <span className="italic text-amber-400">really?</span>
          </h1>

          <p className="text-gray-400 text-xs md:text-lg max-w-xl mx-auto leading-relaxed">
            Skip the genres. Tell us what kind of night it is, and we'll find tracks that get it—or
            get you out of it.
          </p>

          {/* Natural Language Input */}
          <form
            onSubmit={(e) => handleSearchSubmit(e)}
            className="relative max-w-2xl mx-auto mt-4 md:mt-6"
          >
            <div className="relative flex items-center bg-charcoal border-2 border-white/10 rounded-2xl overflow-hidden focus-within:border-amber-500/60 transition-colors shadow-2xl">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Say it like you'd text a friend... e.g., exam tomorrow and overthinking"
                className="w-full bg-transparent pl-4 pr-12 md:pl-5 md:pr-14 py-3 md:py-4 text-xs md:text-sm text-white placeholder-gray-500 focus:outline-none"
              />
              <button
                type="submit"
                className="absolute right-2 md:right-3 w-8 h-8 md:w-10 md:h-10 bg-amber-500 hover:bg-amber-400 rounded-xl flex items-center justify-center transition-colors text-black shadow-md flex-shrink-0"
              >
                <ArrowRight className="w-4 h-4 md:w-5 md:h-5" />
              </button>
            </div>
          </form>

          {/* Sub Controls: Random & Scroll to Matrix */}
          <div className="flex items-center justify-center gap-3 md:gap-4 pt-1 text-xs md:text-sm text-gray-400">
            <button
              onClick={handleRandomMood}
              className="flex items-center gap-1.5 hover:text-amber-400 transition-colors"
            >
              <Shuffle className="w-3.5 h-3.5 md:w-4 md:h-4 text-amber-400" />
              <span>No idea what I'm feeling</span>
            </button>
            <span className="text-gray-600">•</span>
            <button
              onClick={() => gridRef.current?.scrollIntoView({ behavior: 'smooth' })}
              className="flex items-center gap-1.5 hover:text-amber-400 transition-colors"
            >
              <Grid className="w-3.5 h-3.5 md:w-4 md:h-4 text-amber-400" />
              <span>Browse 33 moods</span>
            </button>
          </div>
        </div>
      </section>

      {/* AI Results Section */}
      {(results.length > 0 || loading) && (
        <section ref={resultsRef} className="max-w-4xl mx-auto mb-12 md:mb-16 scroll-mt-20">
          <div className="card p-4 md:p-6 border-amber-500/30 bg-gradient-to-r from-charcoal via-amber-950/10 to-charcoal mb-4 md:mb-6">
            <div className="flex items-center gap-2 mb-1.5">
              <Sparkles className="w-4 h-4 text-amber-400" />
              <h3 className="font-serif text-base md:text-lg font-bold text-white">
                AI Vibe Breakdown
              </h3>
            </div>
            <p className="text-gray-300 text-xs md:text-sm leading-relaxed">{vibeNote}</p>
          </div>

          <div className="space-y-2 md:space-y-3">
            {loading ? (
              <div className="space-y-2 md:space-y-3">
                {[1, 2, 3, 4, 5].map((i) => (
                  <div key={i} className="h-14 md:h-16 bg-white/5 rounded-xl animate-pulse" />
                ))}
              </div>
            ) : (
              results.map((song) => (
                <SongCard key={song.id} song={song} songs={results} showMatch={true} />
              ))
            )}
          </div>
        </section>
      )}

      {/* 33-Mood Matrix Grid */}
      <section ref={gridRef} className="max-w-6xl mx-auto scroll-mt-16">
        <div className="mb-4 md:mb-6">
          <div className="flex items-center gap-2 mb-1">
            <h2 className="font-serif text-xl md:text-3xl font-bold text-white">
              Find yourself in here
            </h2>
            <Badge variant="ai">33 Mood Matrix</Badge>
          </div>
          <p className="text-gray-400 text-xs md:text-sm">
            Categorized across the human spectrum. Click any tile to instantly conjure its matching catalog.
          </p>
        </div>

        {/* Category Filter Pills */}
        <div className="flex gap-1.5 md:gap-2 overflow-x-auto pb-2.5 mb-4 md:mb-6 scrollbar-none">
          {moodCategories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              className={`flex-shrink-0 px-3 md:px-4 py-1.5 md:py-2 rounded-full text-xs font-medium transition-all ${
                activeCategory === cat.id
                  ? 'bg-amber-500 text-black font-semibold shadow-md shadow-amber-500/20'
                  : 'bg-white/5 text-gray-400 hover:text-white hover:bg-white/10 border border-white/5'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Compact 2-Column Responsive Grid (< 768px: grid-cols-2 gap-2.5 p-3.5) */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2.5 md:gap-4">
          {filteredMoods.map((mood) => {
            const isSelected = selectedMood?.id === mood.id;
            return (
              <div
                key={mood.id}
                onClick={() => handleMoodCardClick(mood)}
                className={`group relative card p-3 md:p-5 cursor-pointer transition-all duration-200 overflow-hidden hover:-translate-y-1 hover:border-amber-500/40 flex flex-col justify-between ${
                  isSelected ? 'border-amber-500 bg-amber-500/10 shadow-lg shadow-amber-500/10' : ''
                }`}
              >
                {/* Colored Radial Corner Dot Glow */}
                <div
                  className="absolute top-0 right-0 w-20 md:w-24 h-20 md:h-24 rounded-full blur-2xl opacity-20 group-hover:opacity-60 transition-opacity pointer-events-none"
                  style={{
                    backgroundColor: mood.color || '#F5A623',
                    transform: 'translate(40%, -40%)',
                  }}
                />

                <div className="relative z-10">
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-[9px] md:text-[10px] uppercase tracking-wider text-gray-500 font-semibold truncate pr-1">
                      {moodCategories.find((c) => c.id === mood.category)?.label || 'Mood'}
                    </span>
                    <span className="text-xl md:text-2xl flex-shrink-0">{mood.emoji}</span>
                  </div>

                  <h3 className="font-serif font-bold text-white text-base md:text-lg group-hover:text-amber-400 transition-colors leading-tight">
                    {mood.name}
                  </h3>

                  <p className="text-gray-400 text-[11px] md:text-xs mt-1 leading-snug line-clamp-2">
                    {mood.desc}
                  </p>
                </div>

                <div className="relative z-10 mt-3 pt-2 md:mt-4 md:pt-3 border-t border-white/5 flex items-center justify-between">
                  <span className="text-[10px] md:text-[11px] text-gray-500 group-hover:text-amber-400 transition-colors flex items-center gap-1 font-medium">
                    Select <ArrowRight className="w-2.5 h-2.5 md:w-3 md:h-3" />
                  </span>
                  <div
                    className="w-1.5 h-1.5 md:w-2 md:h-2 rounded-full"
                    style={{ backgroundColor: mood.color || '#F5A623' }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
}

export default MoodMatchPage;
