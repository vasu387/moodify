import React, { useState, useEffect } from 'react';
import {
  ChevronDown,
  Play,
  Pause,
  SkipBack,
  SkipForward,
  Shuffle,
  Repeat,
  Repeat1,
  Heart,
  Moon,
  Clock,
  ListMusic,
  Volume2,
  VolumeX,
  X,
  Sparkles,
  Share2,
  Check,
} from 'lucide-react';
import { usePlayer } from '../../context/PlayerContext';
import { Badge } from '../ui/Badge';

export function NowPlayingModal() {
  const {
    currentSong,
    isPlaying,
    currentTime,
    duration,
    isShuffle,
    repeatMode,
    isNowPlayingOpen,
    sleepTimerMode,
    sleepTimeRemaining,
    queue,
    queueIndex,
    togglePlay,
    seekToTime,
    toggleShuffle,
    toggleRepeat,
    playNext,
    playPrev,
    toggleFavourite,
    isFavourite,
    closeNowPlaying,
    setSleepTimerMode,
    playSong,
    volume,
    changeVolume,
  } = usePlayer();

  // Local drag state for smooth precision seeking
  const [isSeeking, setIsSeeking] = useState(false);
  const [seekValue, setSeekValue] = useState(0);

  // Modals inside Now Playing
  const [showSleepMenu, setShowSleepMenu] = useState(false);
  const [showQueueSheet, setShowQueueSheet] = useState(false);
  const [showShareToast, setShowShareToast] = useState(false);

  // Keep local seekValue in sync with live currentTime when not actively dragging
  useEffect(() => {
    if (!isSeeking) {
      setSeekValue(currentTime || 0);
    }
  }, [currentTime, isSeeking]);

  if (!isNowPlayingOpen || !currentSong) return null;

  const fav = isFavourite(currentSong.id);
  const dur = duration || currentSong.durationSec || 0;

  // Format mm:ss
  const formatTime = (seconds) => {
    if (!seconds || isNaN(seconds) || seconds < 0) return '0:00';
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  // Seekbar handlers
  const handleSeekChange = (e) => {
    setSeekValue(Number(e.target.value));
  };

  const handleSeekStart = () => {
    setIsSeeking(true);
  };

  const handleSeekEnd = (e) => {
    const targetSeconds = Number(e.target.value);
    seekToTime(targetSeconds);
    setIsSeeking(false);
  };

  const handleShare = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(
        `Listening to ${currentSong.title} by ${currentSong.artist} on Moodify! 🎵`
      ).catch(() => {});
    }
    setShowShareToast(true);
    setTimeout(() => setShowShareToast(false), 2000);
  };

  const progressPercent = dur > 0 ? (seekValue / dur) * 100 : 0;

  return (
    <div className="fixed inset-0 z-[100] bg-[#09090B]/98 backdrop-blur-2xl flex flex-col justify-between overflow-y-auto transition-all animate-in fade-in slide-in-from-bottom-8 duration-300">
      {/* Ambient background glow matching song mood */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[340px] md:w-[600px] h-[340px] md:h-[500px] bg-gradient-to-tr from-amber-500/15 via-purple-600/10 to-transparent blur-[120px] pointer-events-none rounded-full" />

      {/* Top Bar: Collapse Chevron + Header Title + Utility */}
      <div className="relative z-10 px-4 md:px-8 pt-4 md:pt-6 pb-2 flex items-center justify-between">
        <button
          onClick={closeNowPlaying}
          className="w-10 h-10 rounded-full bg-white/5 hover:bg-white/10 active:scale-95 flex items-center justify-center text-white transition-all shadow-md"
          aria-label="Collapse Now Playing"
        >
          <ChevronDown className="w-6 h-6" />
        </button>

        <div className="text-center max-w-[220px] md:max-w-md truncate">
          <p className="text-[10px] md:text-xs font-semibold uppercase tracking-widest text-gray-400">
            Playing From Moodify
          </p>
          <p className="text-xs md:text-sm font-medium text-white truncate">
            {currentSong.album || 'Trending Now'}
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleShare}
            className="w-10 h-10 rounded-full bg-white/5 hover:bg-white/10 active:scale-95 flex items-center justify-center text-gray-300 hover:text-white transition-all shadow-md relative"
            title="Share Song"
          >
            {showShareToast ? (
              <Check className="w-4 h-4 text-emerald-400" />
            ) : (
              <Share2 className="w-4 h-4" />
            )}
          </button>
        </div>
      </div>

      {/* Main Center Stage: Large Artwork & Metadata */}
      <div className="relative z-10 px-6 md:px-12 py-4 flex-1 flex flex-col items-center justify-center max-w-lg mx-auto w-full">
        {/* Large Artwork */}
        <div className="relative w-full aspect-square max-w-[320px] sm:max-w-[350px] md:max-w-[380px] rounded-3xl overflow-hidden shadow-[0_20px_60px_rgba(0,0,0,0.85)] ring-1 ring-white/10 my-auto group">
          <img
            src={currentSong.coverUrl}
            alt={currentSong.title}
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
          />

          {/* Equalizer animation overlay when playing */}
          {isPlaying && (
            <div className="absolute bottom-4 right-4 bg-black/60 backdrop-blur-md px-3 py-1.5 rounded-full flex items-center gap-1 border border-white/10">
              {[0, 1, 2, 3].map((i) => (
                <div
                  key={i}
                  className="w-1 bg-amber-400 rounded-full animate-bounce"
                  style={{ height: '14px', animationDelay: `${i * 0.15}s` }}
                />
              ))}
            </div>
          )}
        </div>

        {/* Title, Artist & Favourite Row */}
        <div className="w-full mt-6 mb-2 flex items-center justify-between gap-4">
          <div className="min-w-0 flex-1">
            <h2 className="font-serif text-2xl md:text-3xl font-bold text-white truncate leading-tight">
              {currentSong.title}
            </h2>
            <p className="text-base md:text-lg text-gray-400 truncate mt-1">
              {currentSong.artist}
            </p>
            <div className="flex items-center gap-2 mt-2">
              <Badge variant="language">{currentSong.language}</Badge>
              <span className="text-xs text-gray-400 bg-white/5 px-2 py-0.5 rounded border border-white/5">
                {currentSong.genre}
              </span>
              <span className="text-xs text-amber-400/90 font-medium">
                {currentSong.energy} Energy
              </span>
            </div>
          </div>

          <button
            onClick={() => toggleFavourite(currentSong)}
            className={`w-12 h-12 rounded-full flex items-center justify-center border transition-all active:scale-90 flex-shrink-0 ${
              fav
                ? 'bg-red-500/10 border-red-500/40 text-red-400 shadow-lg shadow-red-500/20'
                : 'bg-white/5 border-white/10 text-gray-400 hover:text-white'
            }`}
            aria-label="Toggle favourite"
          >
            <Heart className={`w-6 h-6 ${fav ? 'fill-current' : ''}`} />
          </button>
        </div>
      </div>

      {/* Playback Controls & Utility Section */}
      <div className="relative z-10 px-6 md:px-12 pb-8 max-w-lg mx-auto w-full space-y-5">
        {/* Interactive Precision Seekbar */}
        <div className="space-y-1.5">
          <div className="relative flex items-center group">
            {/* Range Input with custom appearance */}
            <input
              type="range"
              min={0}
              max={dur || 100}
              step={0.5}
              value={seekValue}
              onChange={handleSeekChange}
              onPointerDown={handleSeekStart}
              onPointerUp={handleSeekEnd}
              className="w-full h-1.5 bg-white/15 rounded-lg appearance-none cursor-pointer accent-amber-500 hover:h-2 transition-all"
              style={{
                background: `linear-gradient(to right, #F5A623 0%, #F5A623 ${progressPercent}%, rgba(255,255,255,0.15) ${progressPercent}%, rgba(255,255,255,0.15) 100%)`,
              }}
            />
          </div>

          <div className="flex justify-between items-center text-xs font-mono text-gray-400 select-none">
            <span>{formatTime(seekValue)}</span>
            <span>{formatTime(dur)}</span>
          </div>
        </div>

        {/* Major Spotify Transport Controls */}
        <div className="flex items-center justify-between gap-3 pt-1">
          {/* Shuffle Toggle */}
          <button
            onClick={toggleShuffle}
            className={`p-2.5 rounded-full transition-all relative ${
              isShuffle ? 'text-amber-400' : 'text-gray-400 hover:text-white'
            }`}
            title={isShuffle ? 'Shuffle enabled' : 'Shuffle disabled'}
          >
            <Shuffle className="w-5 h-5" />
            {isShuffle && (
              <span className="absolute bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 bg-amber-400 rounded-full" />
            )}
          </button>

          {/* Previous Track */}
          <button
            onClick={playPrev}
            className="p-3 text-white hover:text-amber-400 active:scale-90 transition-all"
            aria-label="Previous track"
          >
            <SkipBack className="w-7 h-7 fill-current" />
          </button>

          {/* Large Central Play / Pause Button */}
          <button
            onClick={togglePlay}
            className="w-16 h-16 rounded-full bg-amber-500 hover:bg-amber-400 text-black flex items-center justify-center shadow-2xl shadow-amber-500/30 active:scale-95 transition-all"
            aria-label={isPlaying ? 'Pause' : 'Play'}
          >
            {isPlaying ? (
              <Pause className="w-7 h-7 fill-black" />
            ) : (
              <Play className="w-7 h-7 fill-black ml-1" />
            )}
          </button>

          {/* Next Track */}
          <button
            onClick={playNext}
            className="p-3 text-white hover:text-amber-400 active:scale-90 transition-all"
            aria-label="Next track"
          >
            <SkipForward className="w-7 h-7 fill-current" />
          </button>

          {/* Repeat Mode Toggle */}
          <button
            onClick={toggleRepeat}
            className={`p-2.5 rounded-full transition-all relative ${
              repeatMode !== 'off' ? 'text-amber-400' : 'text-gray-400 hover:text-white'
            }`}
            title={`Repeat mode: ${repeatMode}`}
          >
            {repeatMode === 'one' ? (
              <Repeat1 className="w-5 h-5" />
            ) : (
              <Repeat className="w-5 h-5" />
            )}
            {repeatMode !== 'off' && (
              <span className="absolute bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 bg-amber-400 rounded-full" />
            )}
          </button>
        </div>

        {/* Bottom Utility Row: Sleep Timer & Up-Next Queue */}
        <div className="flex items-center justify-between pt-3 border-t border-white/5">
          {/* Sleep Timer Toggle */}
          <button
            onClick={() => setShowSleepMenu(true)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs transition-colors border ${
              sleepTimerMode !== 'off'
                ? 'bg-amber-500/15 border-amber-500/30 text-amber-400'
                : 'bg-white/5 border-white/10 text-gray-400 hover:text-white'
            }`}
          >
            <Moon className="w-3.5 h-3.5" />
            <span>
              {sleepTimerMode === 'off'
                ? 'Sleep Timer'
                : sleepTimerMode === 'endOfTrack'
                ? 'End of track'
                : `${Math.ceil((sleepTimeRemaining || 0) / 60)}m left`}
            </span>
          </button>

          {/* Up-Next Queue Preview Button */}
          <button
            onClick={() => setShowQueueSheet(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs bg-white/5 hover:bg-white/10 border border-white/10 text-gray-300 hover:text-white transition-colors"
          >
            <ListMusic className="w-3.5 h-3.5 text-amber-400" />
            <span>Up Next ({queue.length})</span>
          </button>
        </div>
      </div>

      {/* Sleep Timer Modal */}
      {showSleepMenu && (
        <div className="fixed inset-0 z-[110] bg-black/70 backdrop-blur-md flex items-end sm:items-center justify-center p-4">
          <div className="card p-6 w-full max-w-sm border-white/15 bg-[#131316] shadow-2xl animate-in slide-in-from-bottom-6 duration-200">
            <div className="flex items-center justify-between mb-4 pb-2 border-b border-white/10">
              <div className="flex items-center gap-2">
                <Moon className="w-4 h-4 text-amber-400" />
                <h3 className="font-serif font-bold text-white text-base">Sleep Timer</h3>
              </div>
              <button
                onClick={() => setShowSleepMenu(false)}
                className="text-gray-400 hover:text-white p-1"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-2">
              {[
                { id: 'off', label: 'Off' },
                { id: '15min', label: '15 minutes' },
                { id: '30min', label: '30 minutes' },
                { id: 'endOfTrack', label: 'End of this track' },
              ].map((opt) => (
                <button
                  key={opt.id}
                  onClick={() => {
                    setSleepTimerMode(opt.id);
                    setShowSleepMenu(false);
                  }}
                  className={`w-full text-left px-4 py-2.5 rounded-xl text-sm transition-all flex items-center justify-between ${
                    sleepTimerMode === opt.id
                      ? 'bg-amber-500 text-black font-semibold'
                      : 'hover:bg-white/5 text-gray-300'
                  }`}
                >
                  <span>{opt.label}</span>
                  {sleepTimerMode === opt.id && <Check className="w-4 h-4" />}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Up-Next Queue Slide-up Sheet */}
      {showQueueSheet && (
        <div className="fixed inset-0 z-[110] bg-black/70 backdrop-blur-md flex items-end sm:items-center justify-center p-3 sm:p-6">
          <div className="card p-5 w-full max-w-md max-h-[80vh] flex flex-col border-white/15 bg-[#131316] shadow-2xl animate-in slide-in-from-bottom-8 duration-200">
            <div className="flex items-center justify-between mb-3 pb-2 border-b border-white/10">
              <div className="flex items-center gap-2">
                <ListMusic className="w-4 h-4 text-amber-400" />
                <h3 className="font-serif font-bold text-white text-base">
                  Playback Queue ({queue.length})
                </h3>
              </div>
              <button
                onClick={() => setShowQueueSheet(false)}
                className="text-gray-400 hover:text-white p-1"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Currently Playing Card in Queue */}
            <div className="mb-3 p-3 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center gap-3">
              <img
                src={currentSong.coverUrl}
                alt=""
                className="w-10 h-10 rounded-lg object-cover flex-shrink-0"
              />
              <div className="min-w-0 flex-1">
                <span className="text-[10px] uppercase font-bold text-amber-400 tracking-wider">
                  Now Playing
                </span>
                <p className="text-sm font-semibold text-white truncate">{currentSong.title}</p>
                <p className="text-xs text-gray-400 truncate">{currentSong.artist}</p>
              </div>
            </div>

            <p className="text-xs font-semibold uppercase tracking-wider text-gray-400 mb-2">
              Next In Line
            </p>

            <div className="flex-1 overflow-y-auto space-y-1.5 pr-1">
              {queue.map((song, i) => {
                const isCurrent = song.id === currentSong.id;
                return (
                  <button
                    key={`${song.id}-${i}`}
                    onClick={() => {
                      playSong(song, queue);
                      setShowQueueSheet(false);
                    }}
                    className={`w-full text-left p-2.5 rounded-xl transition-colors flex items-center justify-between gap-3 ${
                      isCurrent
                        ? 'bg-white/10 text-amber-400'
                        : 'hover:bg-white/5 text-gray-300'
                    }`}
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <span className="text-xs text-gray-500 font-mono w-4 text-center">
                        {i + 1}
                      </span>
                      <img
                        src={song.coverUrl}
                        alt=""
                        className="w-9 h-9 rounded-md object-cover flex-shrink-0"
                      />
                      <div className="min-w-0 flex-1">
                        <p className="text-xs font-medium text-white truncate">{song.title}</p>
                        <p className="text-[11px] text-gray-400 truncate">{song.artist}</p>
                      </div>
                    </div>
                    <Badge variant="language">{song.language}</Badge>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default NowPlayingModal;

