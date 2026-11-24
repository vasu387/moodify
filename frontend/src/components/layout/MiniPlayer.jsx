import React, { useState, useEffect } from 'react';
import {
  Play,
  Pause,
  SkipBack,
  SkipForward,
  Shuffle,
  Repeat,
  Repeat1,
  Heart,
  Volume2,
  VolumeX,
  Maximize2,
  ChevronUp,
  Moon,
  ListMusic,
} from 'lucide-react';
import { usePlayer } from '../../context/PlayerContext';
import { Badge } from '../ui/Badge';
import { NowPlayingModal } from './NowPlayingModal';

export function MiniPlayer() {
  const {
    currentSong,
    isPlaying,
    progress,
    currentTime,
    duration,
    volume,
    isShuffle,
    repeatMode,
    sleepTimerMode,
    sleepTimeRemaining,
    queue,
    togglePlay,
    seek,
    seekToTime,
    changeVolume,
    toggleShuffle,
    toggleRepeat,
    playNext,
    playPrev,
    toggleFavourite,
    isFavourite,
    openNowPlaying,
    setSleepTimerMode,
  } = usePlayer();

  const [showVolume, setShowVolume] = useState(false);
  const [isDesktopSeeking, setIsDesktopSeeking] = useState(false);
  const [desktopSeekValue, setDesktopSeekValue] = useState(0);

  useEffect(() => {
    if (!isDesktopSeeking) {
      setDesktopSeekValue(currentTime || 0);
    }
  }, [currentTime, isDesktopSeeking]);

  if (!currentSong) return null;

  const fav = isFavourite(currentSong.id);
  const dur = duration || currentSong.durationSec || 0;

  const formatTime = (sec) => {
    if (!sec || isNaN(sec) || sec < 0) return '0:00';
    const mins = Math.floor(sec / 60);
    const secs = Math.floor(sec % 60);
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  const handleSeekClick = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const pct = ((e.clientX - rect.left) / rect.width) * 100;
    seek(Math.max(0, Math.min(100, pct)));
  };

  const desktopProgressPercent = dur > 0 ? (desktopSeekValue / dur) * 100 : 0;

  return (
    <>
      {/* MOBILE FLOATING PILL DOCK (< 768px): Dynamic Island / Spotify 2026 Style */}
      <div className="md:hidden fixed bottom-[64px] left-3 right-3 z-50 h-[52px] rounded-2xl bg-[#18181C]/95 backdrop-blur-xl border border-white/10 shadow-[0_8px_32px_rgba(0,0,0,0.65)] overflow-hidden px-2.5 flex items-center justify-between">
        {/* Track Cover & Info - Tapping opens Full-Screen Now Playing View */}
        <div
          onClick={openNowPlaying}
          className="flex items-center gap-2.5 min-w-0 flex-1 mr-2 cursor-pointer group"
          role="button"
          tabIndex={0}
          aria-label="Open Now Playing"
        >
          <div className="relative w-[38px] h-[38px] rounded-xl overflow-hidden flex-shrink-0 ring-1 ring-white/10 shadow-md group-hover:scale-105 transition-transform">
            <img
              src={currentSong.coverUrl}
              alt={currentSong.title}
              className="w-full h-full object-cover"
            />
            {isPlaying && (
              <div className="absolute inset-0 bg-black/40 flex items-center justify-center gap-0.5">
                {[0, 1, 2].map((i) => (
                  <div
                    key={i}
                    className="w-0.5 bg-amber-400 rounded-full animate-bounce"
                    style={{ height: '7px', animationDelay: `${i * 0.12}s` }}
                  />
                ))}
              </div>
            )}
          </div>

          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-1.5">
              <p className="text-xs font-semibold text-white truncate leading-tight group-hover:text-amber-400 transition-colors">
                {currentSong.title}
              </p>
            </div>
            <p className="text-[11px] text-gray-400 truncate leading-tight mt-0.5">
              {currentSong.artist} • <span className="text-amber-400/90 font-medium">{currentSong.language}</span>
            </p>
          </div>
        </div>

        {/* Mobile Mini Actions */}
        <div className="flex items-center gap-1.5 flex-shrink-0">
          <button
            onClick={() => toggleFavourite(currentSong)}
            className={`p-1.5 transition-colors ${
              fav ? 'text-red-400' : 'text-gray-400 hover:text-red-400'
            }`}
            aria-label="Save favourite"
          >
            <Heart className={`w-4 h-4 ${fav ? 'fill-current' : ''}`} />
          </button>

          <button
            onClick={playPrev}
            className="p-1 text-gray-400 hover:text-white transition-colors"
            aria-label="Previous track"
          >
            <SkipBack className="w-3.5 h-3.5" />
          </button>

          <button
            onClick={togglePlay}
            className="w-8 h-8 rounded-full bg-amber-500 hover:bg-amber-400 flex items-center justify-center text-black shadow-md active:scale-95 transition-all"
            aria-label={isPlaying ? 'Pause' : 'Play'}
          >
            {isPlaying ? (
              <Pause className="w-4 h-4 fill-black" />
            ) : (
              <Play className="w-4 h-4 fill-black ml-0.5" />
            )}
          </button>

          <button
            onClick={playNext}
            className="p-1 text-gray-400 hover:text-white transition-colors"
            aria-label="Next track"
          >
            <SkipForward className="w-4 h-4" />
          </button>
        </div>

        {/* Thin 2px Amber Progress Line along bottom edge */}
        <div
          className="absolute bottom-0 left-0 right-0 h-[2px] bg-white/10 cursor-pointer"
          onClick={handleSeekClick}
        >
          <div
            className="h-full bg-amber-500 transition-all duration-150"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      {/* DESKTOP FULL-FEATURED PLAYER (>= 768px): Spotify-Style Desktop Experience */}
      <div className="hidden md:block fixed bottom-0 left-0 right-0 z-50 bg-[#131316]/95 backdrop-blur-md border-t border-white/5 shadow-2xl">
        <div className="max-w-7xl mx-auto px-6 py-2.5 flex items-center justify-between gap-6">
          {/* Left: Track Info & Favourite */}
          <div className="flex items-center gap-3 w-1/4 min-w-[200px]">
            <div
              onClick={openNowPlaying}
              className="relative w-12 h-12 rounded-xl overflow-hidden flex-shrink-0 ring-1 ring-white/10 cursor-pointer group"
              title="Click to expand Now Playing"
            >
              <img
                src={currentSong.coverUrl}
                alt={currentSong.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform"
              />
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity text-white">
                <ChevronUp className="w-5 h-5" />
              </div>
            </div>

            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2">
                <p
                  onClick={openNowPlaying}
                  className="text-sm font-semibold text-white truncate hover:text-amber-400 cursor-pointer transition-colors"
                >
                  {currentSong.title}
                </p>
                <Badge variant="language">{currentSong.language}</Badge>
              </div>
              <p className="text-xs text-gray-400 truncate mt-0.5">{currentSong.artist}</p>
            </div>

            <button
              onClick={() => toggleFavourite(currentSong)}
              className={`p-2 transition-colors flex-shrink-0 ${
                fav ? 'text-red-400' : 'text-gray-400 hover:text-red-400'
              }`}
            >
              <Heart className={`w-4 h-4 ${fav ? 'fill-current' : ''}`} />
            </button>
          </div>

          {/* Center: Spotify Transport & Precision Draggable Seekbar */}
          <div className="flex flex-col items-center flex-1 max-w-xl">
            {/* Controls Row */}
            <div className="flex items-center gap-4 mb-1">
              <button
                onClick={toggleShuffle}
                className={`p-1.5 rounded-full transition-colors relative ${
                  isShuffle ? 'text-amber-400' : 'text-gray-400 hover:text-white'
                }`}
                title={isShuffle ? 'Shuffle on' : 'Shuffle off'}
              >
                <Shuffle className="w-4 h-4" />
                {isShuffle && (
                  <span className="absolute -bottom-0.5 left-1/2 -translate-x-1/2 w-1 h-1 bg-amber-400 rounded-full" />
                )}
              </button>

              <button
                onClick={playPrev}
                className="p-1.5 text-gray-300 hover:text-white active:scale-95 transition-all"
                title="Previous (restart after 3s)"
              >
                <SkipBack className="w-5 h-5 fill-current" />
              </button>

              <button
                onClick={togglePlay}
                className="w-9 h-9 rounded-full bg-amber-500 hover:bg-amber-400 text-black flex items-center justify-center shadow-md active:scale-95 transition-all"
                title={isPlaying ? 'Pause' : 'Play'}
              >
                {isPlaying ? (
                  <Pause className="w-4 h-4 fill-black" />
                ) : (
                  <Play className="w-4 h-4 fill-black ml-0.5" />
                )}
              </button>

              <button
                onClick={playNext}
                className="p-1.5 text-gray-300 hover:text-white active:scale-95 transition-all"
                title="Next song"
              >
                <SkipForward className="w-5 h-5 fill-current" />
              </button>

              <button
                onClick={toggleRepeat}
                className={`p-1.5 rounded-full transition-colors relative ${
                  repeatMode !== 'off' ? 'text-amber-400' : 'text-gray-400 hover:text-white'
                }`}
                title={`Repeat: ${repeatMode}`}
              >
                {repeatMode === 'one' ? (
                  <Repeat1 className="w-4 h-4" />
                ) : (
                  <Repeat className="w-4 h-4" />
                )}
                {repeatMode !== 'off' && (
                  <span className="absolute -bottom-0.5 left-1/2 -translate-x-1/2 w-1 h-1 bg-amber-400 rounded-full" />
                )}
              </button>
            </div>

            {/* Precision Draggable Seekbar with Live Timestamps */}
            <div className="w-full flex items-center gap-3">
              <span className="text-xs font-mono text-gray-400 w-10 text-right select-none">
                {formatTime(desktopSeekValue)}
              </span>

              <div className="flex-1 relative flex items-center group">
                <input
                  type="range"
                  min={0}
                  max={dur || 100}
                  step={0.5}
                  value={desktopSeekValue}
                  onChange={(e) => setDesktopSeekValue(Number(e.target.value))}
                  onPointerDown={() => setIsDesktopSeeking(true)}
                  onPointerUp={(e) => {
                    seekToTime(Number(e.target.value));
                    setIsDesktopSeeking(false);
                  }}
                  className="w-full h-1 bg-white/15 rounded-lg appearance-none cursor-pointer accent-amber-500 group-hover:h-1.5 transition-all"
                  style={{
                    background: `linear-gradient(to right, #F5A623 0%, #F5A623 ${desktopProgressPercent}%, rgba(255,255,255,0.15) ${desktopProgressPercent}%, rgba(255,255,255,0.15) 100%)`,
                  }}
                />
              </div>

              <span className="text-xs font-mono text-gray-400 w-10 select-none">
                {formatTime(dur)}
              </span>
            </div>
          </div>

          {/* Right: Up-Next Queue, Volume & Full-Screen Trigger */}
          <div className="flex items-center justify-end gap-3 w-1/4 min-w-[200px]">
            {/* Sleep Timer status */}
            {sleepTimerMode !== 'off' && (
              <span className="text-xs font-mono text-amber-400 flex items-center gap-1 bg-amber-500/10 px-2 py-0.5 rounded-full border border-amber-500/20">
                <Moon className="w-3 h-3" />
                {sleepTimerMode === 'endOfTrack'
                  ? 'Track end'
                  : `${Math.ceil((sleepTimeRemaining || 0) / 60)}m`}
              </span>
            )}

            {/* Volume Control */}
            <div className="flex items-center gap-2">
              <button
                className="p-1.5 text-gray-400 hover:text-white transition-colors"
                onClick={() => changeVolume(volume === 0 ? 0.7 : 0)}
                title={volume === 0 ? 'Unmute' : 'Mute'}
              >
                {volume === 0 ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
              </button>
              <input
                type="range"
                min={0}
                max={1}
                step={0.05}
                value={volume}
                onChange={(e) => changeVolume(Number(e.target.value))}
                className="w-20 h-1 bg-white/15 rounded-lg appearance-none cursor-pointer accent-amber-500"
              />
            </div>

            {/* Expand / Maximize to Full-screen Now Playing Modal */}
            <button
              onClick={openNowPlaying}
              className="p-1.5 text-gray-400 hover:text-white hover:bg-white/5 rounded-lg transition-colors"
              title="Open Now Playing View"
            >
              <Maximize2 className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* SPOTIFY-STYLE EXPANDABLE FULL-SCREEN NOW PLAYING MODAL */}
      <NowPlayingModal />
    </>
  );
}

export default MiniPlayer;
