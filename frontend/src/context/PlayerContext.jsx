import React, { createContext, useContext, useRef, useState, useEffect, useCallback } from 'react';
import { mockSongs } from '../data/mockSongs';

const PlayerContext = createContext(null);

export function PlayerProvider({ children }) {
  const [currentSong, setCurrentSong] = useState(mockSongs[0] || null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(mockSongs[0]?.durationSec || 0);
  const [volume, setVolume] = useState(0.7);
  const [queue, setQueue] = useState(mockSongs);
  const [queueIndex, setQueueIndex] = useState(0);
  const [favourites, setFavourites] = useState(() => {
    try { return JSON.parse(localStorage.getItem('moodify_favs') || '[]'); } catch { return []; }
  });
  const [recentlyPlayed, setRecentlyPlayed] = useState(() => {
    try { return JSON.parse(localStorage.getItem('moodify_recent') || '[]'); } catch { return []; }
  });

  const audioRef = useRef(new Audio());

  useEffect(() => {
    const audio = audioRef.current;
    audio.volume = volume;

    const updateProgress = () => {
      if (audio.duration) setProgress((audio.currentTime / audio.duration) * 100);
      setDuration(audio.duration || 0);
    };
    const handleEnded = () => { playNextRef.current(); };

    audio.addEventListener('timeupdate', updateProgress);
    audio.addEventListener('loadedmetadata', updateProgress);
    audio.addEventListener('ended', handleEnded);

    return () => {
      audio.removeEventListener('timeupdate', updateProgress);
      audio.removeEventListener('loadedmetadata', updateProgress);
      audio.removeEventListener('ended', handleEnded);
    };
  }, []);

  const playSong = useCallback((song, songList = null) => {
    const audio = audioRef.current;
    if (currentSong?.id === song.id) {
      if (isPlaying) { audio.pause(); setIsPlaying(false); }
      else { audio.play().catch(() => {}); setIsPlaying(true); }
      return;
    }
    audio.src = song.audioUrl;
    audio.load();
    audio.play().catch(() => {});
    setCurrentSong(song);
    setIsPlaying(true);
    setProgress(0);

    if (songList) {
      setQueue(songList);
      setQueueIndex(songList.findIndex(s => s.id === song.id));
    }

    // Update recently played
    setRecentlyPlayed(prev => {
      const updated = [song, ...prev.filter(s => s.id !== song.id)].slice(0, 20);
      localStorage.setItem('moodify_recent', JSON.stringify(updated));
      return updated;
    });
  }, [currentSong, isPlaying]);

  const togglePlay = useCallback(() => {
    const audio = audioRef.current;
    if (!audio.src && currentSong) {
      audio.src = currentSong.audioUrl;
      audio.load();
    }
    if (isPlaying) { audio.pause(); setIsPlaying(false); }
    else { audio.play().catch(() => {}); setIsPlaying(true); }
  }, [isPlaying, currentSong]);

  const seek = useCallback((pct) => {
    const audio = audioRef.current;
    if (audio.duration) {
      audio.currentTime = (pct / 100) * audio.duration;
      setProgress(pct);
    }
  }, []);

  const changeVolume = useCallback((v) => {
    audioRef.current.volume = v;
    setVolume(v);
  }, []);

  const playNext = useCallback(() => {
    if (queue.length === 0) return;
    const next = (queueIndex + 1) % queue.length;
    setQueueIndex(next);
    playSong(queue[next]);
  }, [queue, queueIndex, playSong]);

  // Use ref for event listener to avoid stale closure
  const playNextRef = useRef(playNext);
  useEffect(() => { playNextRef.current = playNext; }, [playNext]);

  const playPrev = useCallback(() => {
    if (queue.length === 0) return;
    const prev = (queueIndex - 1 + queue.length) % queue.length;
    setQueueIndex(prev);
    playSong(queue[prev]);
  }, [queue, queueIndex, playSong]);

  const toggleFavourite = useCallback((song) => {
    setFavourites(prev => {
      const exists = prev.find(s => s.id === song.id);
      const updated = exists ? prev.filter(s => s.id !== song.id) : [song, ...prev];
      localStorage.setItem('moodify_favs', JSON.stringify(updated));
      return updated;
    });
  }, []);

  const isFavourite = useCallback((id) => favourites.some(s => s.id === id), [favourites]);

  return (
    <PlayerContext.Provider value={{
      currentSong, isPlaying, progress, duration, volume, queue, favourites, recentlyPlayed,
      playSong, togglePlay, seek, changeVolume, playNext, playPrev, toggleFavourite, isFavourite
    }}>
      {children}
    </PlayerContext.Provider>
  );
}

export const usePlayer = () => {
  const ctx = useContext(PlayerContext);
  if (!ctx) throw new Error('usePlayer must be used within PlayerProvider');
  return ctx;
};
