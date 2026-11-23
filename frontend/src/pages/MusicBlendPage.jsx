import React, { useState } from 'react';
import { Plus, Zap, Play, Heart, Sparkles, Search, X, ArrowRight, Music2 } from 'lucide-react';
import { getBlend } from '../services/api';
import { mockSongs } from '../data/mockSongs';
import { Badge } from '../components/ui/Badge';
import { Button } from '../components/ui/Button';
import { usePlayer } from '../context/PlayerContext';

const QUICK_PAIRS = [
  {
    label: 'After Hours + Kanave Kanave',
    song1Id: '11', // The Weeknd - Blinding Lights/After Hours
    song2Id: '1',  // Anirudh - Kanave Kanave
    tag: 'Synthwave x Tamil Melancholy',
  },
  {
    label: 'A Sky Full of Stars + Kesariya',
    song1Id: '12', // Coldplay - A Sky Full of Stars
    song2Id: '21', // Arijit Singh - Kesariya
    tag: 'Stadium Euphoria x Indian Devotion',
  },
  {
    label: 'Yellow + Vennilave Vennilave',
    song1Id: '15', // Coldplay - Yellow
    song2Id: '2',  // A.R. Rahman - Vennilave Vennilave
    tag: 'Acoustic Soul x Rahman Classical',
  },
  {
    label: 'Cruel Summer + Chaleya',
    song1Id: '13', // Taylor Swift - Cruel Summer
    song2Id: '23', // Arijit Singh - Chaleya
    tag: 'Pop Anthems Clash',
  },
];

function SongPickerCard({ title, selectedSong, onSelectSong, onClear }) {
  const [search, setSearch] = useState('');
  const [isOpen, setIsOpen] = useState(false);

  const filtered = search.trim()
    ? mockSongs.filter(
        (s) =>
          s.title.toLowerCase().includes(search.toLowerCase()) ||
          s.artist.toLowerCase().includes(search.toLowerCase()) ||
          s.genre.toLowerCase().includes(search.toLowerCase())
      )
    : mockSongs.slice(0, 6);

  return (
    <div className="card p-5 flex-1 relative flex flex-col justify-between border-white/10 hover:border-white/15 transition-all">
      <div>
        <div className="flex items-center justify-between mb-3">
          <span className="text-xs font-semibold uppercase tracking-wider text-gray-400">
            {title}
          </span>
          {selectedSong && (
            <button
              onClick={onClear}
              className="text-xs text-gray-500 hover:text-red-400 transition-colors flex items-center gap-1"
            >
              <X className="w-3 h-3" /> Change
            </button>
          )}
        </div>

        {selectedSong ? (
          <div className="flex items-center gap-4 bg-white/5 p-3 rounded-xl border border-white/5">
            <img
              src={selectedSong.coverUrl}
              alt={selectedSong.title}
              className="w-16 h-16 rounded-lg object-cover flex-shrink-0 shadow-md"
            />
            <div className="min-w-0 flex-1">
              <h4 className="font-serif font-bold text-white text-base truncate">
                {selectedSong.title}
              </h4>
              <p className="text-xs text-gray-400 truncate">{selectedSong.artist}</p>
              <div className="flex items-center gap-1.5 mt-2">
                <Badge variant="language">{selectedSong.language}</Badge>
                <span className="text-[11px] text-gray-400 bg-white/5 px-2 py-0.5 rounded">
                  {selectedSong.genre}
                </span>
                <span className="text-[11px] text-amber-400 font-medium">
                  {selectedSong.energy} Energy
                </span>
              </div>
            </div>
          </div>
        ) : (
          <div className="space-y-3">
            <div className="relative">
              <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value);
                  setIsOpen(true);
                }}
                onFocus={() => setIsOpen(true)}
                placeholder="Search song, artist, or genre..."
                className="w-full bg-white/5 border border-white/10 rounded-xl pl-9 pr-3 py-2.5 text-xs md:text-sm text-white placeholder-gray-500 focus:outline-none focus:border-amber-500/50"
              />
            </div>

            {isOpen && (
              <div className="max-h-48 overflow-y-auto space-y-1 pr-1 custom-scrollbar">
                {filtered.map((song) => (
                  <button
                    key={song.id}
                    onClick={() => {
                      onSelectSong(song);
                      setIsOpen(false);
                      setSearch('');
                    }}
                    className="w-full flex items-center gap-3 p-2 rounded-lg hover:bg-white/10 transition-colors text-left"
                  >
                    <img
                      src={song.coverUrl}
                      alt={song.title}
                      className="w-9 h-9 rounded-md object-cover flex-shrink-0"
                    />
                    <div className="min-w-0 flex-1">
                      <p className="text-xs font-medium text-white truncate">{song.title}</p>
                      <p className="text-[11px] text-gray-400 truncate">{song.artist}</p>
                    </div>
                    <Badge variant="language">{song.language}</Badge>
                  </button>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {!selectedSong && !isOpen && (
        <div className="mt-4 pt-3 border-t border-white/5">
          <p className="text-[11px] text-gray-500 mb-2">Or select a popular seed:</p>
          <div className="flex flex-wrap gap-1.5">
            {mockSongs.slice(0, 3).map((s) => (
              <button
                key={s.id}
                onClick={() => onSelectSong(s)}
                className="text-[11px] bg-white/5 hover:bg-white/10 text-gray-300 px-2.5 py-1 rounded-md border border-white/5 truncate max-w-full"
              >
                {s.title}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export function MusicBlendPage() {
  const [song1, setSong1] = useState(mockSongs[10]); // The Weeknd - Blinding Lights
  const [song2, setSong2] = useState(mockSongs[0]);  // Anirudh - Kanave Kanave
  const [blendResult, setBlendResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const { playSong, toggleFavourite, isFavourite } = usePlayer();

  const handleBlend = async () => {
    if (!song1 || !song2) return;
    setLoading(true);
    try {
      const data = await getBlend(song1.id, song2.id);
      setBlendResult(data);
    } finally {
      setLoading(false);
    }
  };

  const applyQuickPair = (pair) => {
    const s1 = mockSongs.find((s) => s.id === pair.song1Id);
    const s2 = mockSongs.find((s) => s.id === pair.song2Id);
    if (s1 && s2) {
      setSong1(s1);
      setSong2(s2);
      setBlendResult(null);
    }
  };

  return (
    <div className="pb-36 md:pb-36 px-3.5 md:px-6 max-w-5xl mx-auto">
      {/* Header */}
      <div className="mb-6 md:mb-8">
        <div className="flex items-center gap-1.5 mb-1.5">
          <Badge variant="ai">AI</Badge>
          <span className="text-[11px] md:text-xs uppercase tracking-wider text-gray-400 font-semibold">
            Sonic Intersection Engine
          </span>
        </div>
        <h1 className="font-serif text-[26px] leading-[1.15] md:text-5xl font-bold text-white mb-2 md:mb-3">
          Songs like this + that
        </h1>
        <p className="text-gray-400 text-xs md:text-base max-w-2xl leading-relaxed">
          Pick any two tracks or artists you love. We map their harmonic frequencies, rhythm vectors,
          and mood temperatures to forge the musical bridge that sits right in between.
        </p>
      </div>

      {/* Quick Select Presets */}
      <div className="mb-6">
        <div className="flex items-center gap-2 mb-2.5">
          <Sparkles className="w-3.5 h-3.5 text-amber-400" />
          <span className="text-xs font-semibold uppercase tracking-wider text-gray-400">
            Inspiring Pairings
          </span>
        </div>
        <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-none">
          {QUICK_PAIRS.map((pair, idx) => (
            <button
              key={idx}
              onClick={() => applyQuickPair(pair)}
              className="flex-shrink-0 card px-3.5 py-2 text-left hover:border-amber-500/30 transition-all group"
            >
              <p className="text-xs font-medium text-white group-hover:text-amber-400 transition-colors">
                {pair.label}
              </p>
              <p className="text-[10px] text-gray-500 mt-0.5">{pair.tag}</p>
            </button>
          ))}
        </div>
      </div>

      {/* Dual Song Picker Cards */}
      <div className="relative flex flex-col md:flex-row items-stretch gap-4 mb-6">
        <SongPickerCard
          title="Track A (Anchor One)"
          selectedSong={song1}
          onSelectSong={setSong1}
          onClear={() => {
            setSong1(null);
            setBlendResult(null);
          }}
        />

        {/* Center Connector Badge */}
        <div className="flex items-center justify-center my-[-8px] md:my-0 z-10">
          <div className="w-10 h-10 rounded-full bg-charcoal border border-amber-500/30 flex items-center justify-center text-amber-400 shadow-lg shadow-black/50">
            <Plus className="w-5 h-5 stroke-[2.5]" />
          </div>
        </div>

        <SongPickerCard
          title="Track B (Anchor Two)"
          selectedSong={song2}
          onSelectSong={setSong2}
          onClear={() => {
            setSong2(null);
            setBlendResult(null);
          }}
        />
      </div>

      {/* Action Button */}
      <div className="flex justify-center mb-10">
        <Button
          onClick={handleBlend}
          disabled={!song1 || !song2 || loading}
          size="xl"
          className="shadow-xl shadow-amber-500/20 px-10 text-base"
        >
          {loading ? (
            <>
              <div className="w-5 h-5 border-2 border-black border-t-transparent rounded-full animate-spin mr-2" />
              Calculating Harmonic Harmonic Bridge...
            </>
          ) : (
            <>
              <Zap className="w-5 h-5 mr-1" />
              Blend Them
            </>
          )}
        </Button>
      </div>

      {/* Sonic DNA Bridge & Results */}
      {blendResult && !loading && (
        <div className="space-y-6">
          {/* Visual Sonic DNA Bridge */}
          <div className="card p-6 border-amber-500/30 bg-gradient-to-r from-charcoal via-amber-950/10 to-charcoal">
            <div className="flex items-center gap-2 mb-4">
              <Sparkles className="w-4 h-4 text-amber-400" />
              <h3 className="font-serif text-lg font-bold text-white">
                Sonic DNA Bridge Analysis
              </h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-3.5 rounded-xl bg-white/5 border border-white/5">
                <span className="text-[11px] font-semibold uppercase tracking-wider text-gray-400">
                  Tempo Convergence
                </span>
                <p className="text-amber-400 font-bold text-base mt-1">
                  {blendResult.bridge?.tempo || 'Mid-Tempo (~108 BPM)'}
                </p>
                <p className="text-gray-400 text-xs mt-1">
                  Bridging {song1.genre} groove with {song2.genre} pacing.
                </p>
              </div>

              <div className="p-3.5 rounded-xl bg-white/5 border border-white/5">
                <span className="text-[11px] font-semibold uppercase tracking-wider text-gray-400">
                  Shared Atmosphere
                </span>
                <p className="text-amber-400 font-bold text-base mt-1">
                  {blendResult.bridge?.atmosphere || 'Cinematic & Atmospheric'}
                </p>
                <p className="text-gray-400 text-xs mt-1">
                  Reverberant soundstage with rich chord warmth.
                </p>
              </div>

              <div className="p-3.5 rounded-xl bg-white/5 border border-white/5">
                <span className="text-[11px] font-semibold uppercase tracking-wider text-gray-400">
                  Emotional Resonance
                </span>
                <p className="text-amber-400 font-bold text-base mt-1">
                  {blendResult.bridge?.emotion || 'Bittersweet Longing'}
                </p>
                <p className="text-gray-400 text-xs mt-1">
                  Where {song1.moods?.[0] || 'Heart'} meets {song2.moods?.[0] || 'Euphoria'}.
                </p>
              </div>
            </div>
          </div>

          {/* Blended Recommendations List */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-serif text-2xl font-bold text-white">
                5 Tracks Right In The Middle
              </h3>
              <span className="text-xs text-gray-400">
                Sorted by acoustic equilibrium
              </span>
            </div>

            <div className="space-y-3">
              {blendResult.songs.map((song, idx) => {
                const fav = isFavourite(song.id);
                return (
                  <div
                    key={song.id}
                    className="card p-4 flex items-center justify-between gap-4 hover:border-amber-500/30 transition-all group"
                  >
                    <div className="flex items-center gap-4 min-w-0">
                      <span className="text-xl font-serif font-bold text-white/20 w-6 flex-shrink-0 text-center">
                        {idx + 1}
                      </span>
                      <div className="relative w-12 h-12 rounded-lg overflow-hidden flex-shrink-0">
                        <img
                          src={song.coverUrl}
                          alt={song.title}
                          className="w-full h-full object-cover"
                        />
                        <button
                          onClick={() => playSong(song, blendResult.songs)}
                          className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity text-white"
                        >
                          <Play className="w-5 h-5 fill-white text-white" />
                        </button>
                      </div>
                      <div className="min-w-0">
                        <p className="font-medium text-white text-sm truncate">{song.title}</p>
                        <p className="text-xs text-gray-400 truncate mt-0.5">{song.artist}</p>
                        <div className="flex items-center gap-1.5 mt-1">
                          <Badge variant="language">{song.language}</Badge>
                          <span className="text-[11px] text-gray-500">
                            {song.genre} • {song.energy} Energy
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 flex-shrink-0">
                      <button
                        onClick={() => playSong(song, blendResult.songs)}
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
                      >
                        <Heart className={`w-4 h-4 ${fav ? 'fill-current' : ''}`} />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default MusicBlendPage;

