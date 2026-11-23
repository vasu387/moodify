import React, { useState } from 'react';
import {
  Play,
  Pause,
  SkipBack,
  SkipForward,
  Heart,
  Volume2,
  VolumeX,
} from 'lucide-react';
import { usePlayer } from '../../context/PlayerContext';
import { Badge } from '../ui/Badge';

export function MiniPlayer() {
  const {
    currentSong,
    isPlaying,
    progress,
    duration,
    volume,
    togglePlay,
    seek,
    changeVolume,
    playNext,
    playPrev,
    toggleFavourite,
    isFavourite,
  } = usePlayer();
  const [showVolume, setShowVolume] = useState(false);

  if (!currentSong) return null;

  const fav = isFavourite(currentSong.id);
  const fmt = (sec) =>
    `${Math.floor(sec / 60)}:${String(Math.floor(sec % 60)).padStart(2, '0')}`;
  const currentTime = (progress / 100) * duration;

  const handleSeekClick = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const pct = ((e.clientX - rect.left) / rect.width) * 100;
    seek(Math.max(0, Math.min(100, pct)));
  };

  return (
    <>
      {/* MOBILE FLOATING PILL DOCK (< 768px): Dynamic Island / Spotify 2026 Style */}
      <div className="md:hidden fixed bottom-[64px] left-3 right-3 z-50 h-[52px] rounded-2xl bg-[#18181C]/95 backdrop-blur-xl border border-white/10 shadow-[0_8px_32px_rgba(0,0,0,0.6)] overflow-hidden px-2.5 flex items-center justify-between">
        {/* Track Cover & Info */}
        <div className="flex items-center gap-2.5 min-w-0 flex-1 mr-2">
          <div className="relative w-[38px] h-[38px] rounded-xl overflow-hidden flex-shrink-0 ring-1 ring-white/10 shadow-md">
            <img
              src={currentSong.coverUrl}
              alt=""
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
            <p className="text-xs font-semibold text-white truncate leading-tight">
              {currentSong.title}
            </p>
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
          >
            <Heart className={`w-4 h-4 ${fav ? 'fill-current' : ''}`} />
          </button>

          <button
            onClick={togglePlay}
            className="w-8 h-8 rounded-full bg-amber-500 hover:bg-amber-400 flex items-center justify-center text-black shadow-md active:scale-95 transition-all"
          >
            {isPlaying ? (
              <Pause className="w-4 h-4 fill-black" />
            ) : (
              <Play className="w-4 h-4 fill-black ml-0.5" />
            )}
          </button>

          <button
            onClick={playNext}
            className="p-1.5 text-gray-400 hover:text-white transition-colors"
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

      {/* DESKTOP PLAYER (>= 768px): Kept identical */}
      <div className="hidden md:block fixed bottom-0 left-0 right-0 z-50 bg-charcoal/95 backdrop-blur-md border-t border-white/5">
        {/* Progress bar */}
        <div
          className="relative h-1 bg-white/10 cursor-pointer group"
          onClick={handleSeekClick}
        >
          <div
            className="h-full bg-amber-500 transition-all duration-200 relative"
            style={{ width: `${progress}%` }}
          >
            <div className="absolute right-0 top-1/2 -translate-y-1/2 w-3 h-3 bg-amber-400 rounded-full opacity-0 group-hover:opacity-100 transition-opacity" />
          </div>
        </div>

        <div className="flex items-center gap-3 px-6 py-3">
          {/* Song Info */}
          <div className="flex items-center gap-3 flex-1 min-w-0">
            <div className="relative">
              <img
                src={currentSong.coverUrl}
                alt=""
                className={`w-11 h-11 rounded-lg object-cover ${
                  isPlaying ? 'ring-2 ring-amber-500/50' : ''
                }`}
              />
              {isPlaying && (
                <div className="absolute -bottom-0.5 left-1/2 -translate-x-1/2 flex gap-0.5">
                  {[0, 1, 2].map((i) => (
                    <div
                      key={i}
                      className="w-0.5 bg-amber-400 rounded-full animate-bounce"
                      style={{ height: '6px', animationDelay: `${i * 0.1}s` }}
                    />
                  ))}
                </div>
              )}
            </div>
            <div className="min-w-0">
              <p className="text-sm font-medium text-white truncate">{currentSong.title}</p>
              <p className="text-xs text-gray-400 truncate">{currentSong.artist}</p>
            </div>
            <Badge variant="language" className="hidden sm:inline-flex flex-shrink-0">
              {currentSong.language}
            </Badge>
          </div>

          {/* Controls */}
          <div className="flex items-center gap-2">
            <span className="text-xs text-gray-500 w-10 text-right">{fmt(currentTime)}</span>
            <button
              onClick={playPrev}
              className="p-2 text-gray-400 hover:text-white transition-colors"
            >
              <SkipBack className="w-5 h-5" />
            </button>
            <button
              onClick={togglePlay}
              className="w-10 h-10 bg-amber-500 hover:bg-amber-400 rounded-full flex items-center justify-center transition-colors"
            >
              {isPlaying ? (
                <Pause className="w-5 h-5 text-black" />
              ) : (
                <Play className="w-5 h-5 text-black fill-black ml-0.5" />
              )}
            </button>
            <button
              onClick={playNext}
              className="p-2 text-gray-400 hover:text-white transition-colors"
            >
              <SkipForward className="w-5 h-5" />
            </button>
            <span className="text-xs text-gray-500 w-10">{fmt(duration)}</span>
          </div>

          {/* Right Controls */}
          <div className="flex items-center gap-1 justify-end">
            <button
              onClick={() => toggleFavourite(currentSong)}
              className={`p-2 transition-colors ${
                fav ? 'text-red-400' : 'text-gray-500 hover:text-red-400'
              }`}
            >
              <Heart className={`w-4 h-4 ${fav ? 'fill-current' : ''}`} />
            </button>
            <div className="relative">
              <button
                className="p-2 text-gray-400 hover:text-white transition-colors"
                onClick={() => setShowVolume(!showVolume)}
              >
                {volume === 0 ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
              </button>
              {showVolume && (
                <div className="absolute bottom-10 right-0 bg-charcoal border border-white/10 rounded-xl p-3 shadow-xl">
                  <input
                    type="range"
                    min="0"
                    max="1"
                    step="0.05"
                    value={volume}
                    onChange={(e) => changeVolume(Number(e.target.value))}
                    className="w-24 accent-amber-500"
                  />
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default MiniPlayer;
