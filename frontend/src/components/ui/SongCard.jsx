import React from 'react';
import { Play, Heart, Plus } from 'lucide-react';
import { usePlayer } from '../../context/PlayerContext';
import { Badge } from './Badge';

export function SongCard({ song, songs = [], showMatch = false }) {
  const { playSong, toggleFavourite, isFavourite, currentSong, isPlaying } = usePlayer();
  const fav = isFavourite(song.id);
  const active = currentSong?.id === song.id;

  const fmt = (sec) => `${Math.floor(sec / 60)}:${String(sec % 60).padStart(2, '0')}`;

  return (
    <div className={`group flex items-center gap-3 p-3 rounded-xl border transition-all duration-200 cursor-pointer hover:border-amber-500/30 ${active ? 'bg-amber-500/10 border-amber-500/30' : 'bg-charcoal border-white/5 hover:bg-white/5'}`}
      onClick={() => playSong(song, songs.length > 0 ? songs : [song])}>
      <div className="relative w-12 h-12 flex-shrink-0">
        <img src={song.coverUrl} alt={song.title} className="w-12 h-12 rounded-lg object-cover" />
        <div className={`absolute inset-0 bg-black/40 rounded-lg flex items-center justify-center transition-opacity ${active && isPlaying ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'}`}>
          <Play className="w-5 h-5 text-white fill-white" />
        </div>
        {active && isPlaying && (
          <div className="absolute bottom-1 left-1/2 -translate-x-1/2 flex gap-0.5">
            {[0, 1, 2].map(i => (
              <div key={i} className="w-0.5 bg-amber-400 rounded-full animate-bounce" style={{ height: '8px', animationDelay: `${i * 0.1}s` }} />
            ))}
          </div>
        )}
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <p className={`font-medium text-sm truncate ${active ? 'text-amber-400' : 'text-white'}`}>{song.title}</p>
          {showMatch && song.matchPercent && (
            <span className="text-xs bg-amber-500/20 text-amber-400 px-1.5 py-0.5 rounded font-bold">{song.matchPercent}%</span>
          )}
        </div>
        <p className="text-xs text-gray-400 truncate">{song.artist}</p>
        <div className="flex items-center gap-1 mt-0.5">
          <Badge variant="language">{song.language}</Badge>
          <span className="text-xs text-gray-500">{fmt(song.durationSec)}</span>
        </div>
      </div>
      <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity" onClick={e => e.stopPropagation()}>
        <button className={`p-1.5 rounded-lg transition-colors ${fav ? 'text-red-400' : 'text-gray-500 hover:text-red-400'}`}
          onClick={() => toggleFavourite(song)}>
          <Heart className={`w-4 h-4 ${fav ? 'fill-current' : ''}`} />
        </button>
        <button className="p-1.5 rounded-lg text-gray-500 hover:text-white transition-colors">
          <Plus className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
