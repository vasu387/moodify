import React, { createContext, useContext, useRef, useState, useEffect, useCallback } from 'react';
import { mockSongs } from '../data/mockSongs';

const PlayerContext = createContext(null);

export function PlayerProvider({ children }) {
  const [currentSong, setCurrentSong] = useState(mockSongs[0] || null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(mockSongs[0]?.durationSec || 0);
  const [volume, setVolume] = useState(0.7);
  const [queue, setQueue] = useState(mockSongs);
  const [queueIndex, setQueueIndex] = useState(0);

  // Spotify-style playback modes
  const [isShuffle, setIsShuffle] = useState(false);
  const [repeatMode, setRepeatMode] = useState('off'); // 'off' | 'all' | 'one'
  const [isNowPlayingOpen, setIsNowPlayingOpen] = useState(false);

  // Sleep Timer: 'off' | '15min' | '30min' | 'endOfTrack'
  const [sleepTimerMode, setSleepTimerMode] = useState('off');
  const [sleepTimeRemaining, setSleepTimeRemaining] = useState(null);

  const [favourites, setFavourites] = useState(() => {
    try { return JSON.parse(localStorage.getItem('moodify_favs') || '[]'); } catch { return []; }
  });
  const [recentlyPlayed, setRecentlyPlayed] = useState(() => {
    try { return JSON.parse(localStorage.getItem('moodify_recent') || '[]'); } catch { return []; }
  });

  const audioRef = useRef(new Audio());
  const repeatModeRef = useRef(repeatMode);
  const sleepTimerModeRef = useRef(sleepTimerMode);
  repeatModeRef.current = repeatMode;
  sleepTimerModeRef.current = sleepTimerMode;

  // Sync volume to audio element
  useEffect(() => {
    audioRef.current.volume = volume;
  }, [volume]);

  // Main Audio Event Listeners
  useEffect(() => {
    const audio = audioRef.current;

    const handleTimeUpdate = () => {
      const cur = audio.currentTime || 0;
      const dur = audio.duration || duration || 0;
      setCurrentTime(cur);
      if (dur > 0) {
        setProgress((cur / dur) * 100);
      }
    };

    const handleLoadedMetadata = () => {
      if (audio.duration && Number.isFinite(audio.duration)) {
        setDuration(audio.duration);
      }
    };

    const handleEnded = () => {
      // Check sleep timer endOfTrack
      if (sleepTimerModeRef.current === 'endOfTrack') {
        audio.pause();
        setIsPlaying(false);
        setSleepTimerMode('off');
        setSleepTimeRemaining(null);
        return;
      }

      // Check Repeat One
      if (repeatModeRef.current === 'one') {
        audio.currentTime = 0;
        audio.play().catch(() => {});
        setIsPlaying(true);
        return;
      }

      // Otherwise advance to next
      playNextRef.current();
    };

    audio.addEventListener('timeupdate', handleTimeUpdate);
    audio.addEventListener('loadedmetadata', handleLoadedMetadata);
    audio.addEventListener('ended', handleEnded);

    return () => {
      audio.removeEventListener('timeupdate', handleTimeUpdate);
      audio.removeEventListener('loadedmetadata', handleLoadedMetadata);
      audio.removeEventListener('ended', handleEnded);
    };
  }, [duration]);

  // Sleep Timer Countdown Interval
  useEffect(() => {
    if (sleepTimerMode === 'off' || sleepTimerMode === 'endOfTrack') {
      setSleepTimeRemaining(null);
      return;
    }

    let initialSeconds = 15 * 60;
    if (sleepTimerMode === '30min') initialSeconds = 30 * 60;
    setSleepTimeRemaining(initialSeconds);

    const interval = setInterval(() => {
      setSleepTimeRemaining((prev) => {
        if (prev === null || prev <= 1) {
          clearInterval(interval);
          audioRef.current.pause();
          setIsPlaying(false);
          setSleepTimerMode('off');
          return null;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [sleepTimerMode]);

  // Play Specific Song
  const playSong = useCallback((song, songList = null) => {
    const audio = audioRef.current;
    if (currentSong?.id === song.id) {
      if (isPlaying) {
        audio.pause();
        setIsPlaying(false);
      } else {
        audio.play().catch(() => {});
        setIsPlaying(true);
      }
      return;
    }

    audio.src = song.audioUrl;
    audio.load();
    audio.play().catch(() => {});
    setCurrentSong(song);
    setIsPlaying(true);
    setProgress(0);
    setCurrentTime(0);
    setDuration(song.durationSec || 0);

    if (songList && songList.length > 0) {
      setQueue(songList);
      setQueueIndex(songList.findIndex((s) => s.id === song.id));
    }

    // Update recently played
    setRecentlyPlayed((prev) => {
      const updated = [song, ...prev.filter((s) => s.id !== song.id)].slice(0, 25);
      localStorage.setItem('moodify_recent', JSON.stringify(updated));
      return updated;
    });
  }, [currentSong, isPlaying]);

  // Play / Pause Toggle
  const togglePlay = useCallback(() => {
    const audio = audioRef.current;
    if (!audio.src && currentSong) {
      audio.src = currentSong.audioUrl;
      audio.load();
    }
    if (isPlaying) {
      audio.pause();
      setIsPlaying(false);
    } else {
      audio.play().catch(() => {});
      setIsPlaying(true);
    }
  }, [isPlaying, currentSong]);

  // Precision Seek by Percentage
  const seek = useCallback((pct) => {
    const audio = audioRef.current;
    const dur = audio.duration || duration || 0;
    if (dur > 0) {
      const targetSec = (pct / 100) * dur;
      audio.currentTime = targetSec;
      setProgress(pct);
      setCurrentTime(targetSec);
    }
  }, [duration]);

  // Precision Seek by Exact Second (e.g. 176s for 2:56)
  const seekToTime = useCallback((timeInSeconds) => {
    const audio = audioRef.current;
    const dur = audio.duration || duration || 0;
    const target = Math.max(0, Math.min(timeInSeconds, dur || 99999));
    audio.currentTime = target;
    setCurrentTime(target);
    if (dur > 0) {
      setProgress((target / dur) * 100);
    }
  }, [duration]);

  // Volume
  const changeVolume = useCallback((v) => {
    const val = Math.max(0, Math.min(1, v));
    audioRef.current.volume = val;
    setVolume(val);
  }, []);

  // Shuffle Toggle
  const toggleShuffle = useCallback(() => {
    setIsShuffle((prev) => !prev);
  }, []);

  // Repeat Mode Toggle: 'off' -> 'all' -> 'one' -> 'off'
  const toggleRepeat = useCallback(() => {
    setRepeatMode((prev) => {
      if (prev === 'off') return 'all';
      if (prev === 'all') return 'one';
      return 'off';
    });
  }, []);

  // Next Track
  const playNext = useCallback(() => {
    if (queue.length === 0) return;

    if (isShuffle && queue.length > 1) {
      const otherIndices = queue.map((_, i) => i).filter((i) => i !== queueIndex);
      const randIndex = otherIndices[Math.floor(Math.random() * otherIndices.length)];
      setQueueIndex(randIndex);
      playSong(queue[randIndex]);
      return;
    }

    if (repeatModeRef.current === 'off' && queueIndex === queue.length - 1) {
      // Reached end of queue without repeat
      audioRef.current.pause();
      setIsPlaying(false);
      return;
    }

    const nextIndex = (queueIndex + 1) % queue.length;
    setQueueIndex(nextIndex);
    playSong(queue[nextIndex]);
  }, [queue, queueIndex, isShuffle, playSong]);

  const playNextRef = useRef(playNext);
  useEffect(() => {
    playNextRef.current = playNext;
  }, [playNext]);

  // Previous Track (Spotify behavior: if currentTime > 3, restart track; else previous)
  const playPrev = useCallback(() => {
    const audio = audioRef.current;
    if (audio.currentTime > 3) {
      audio.currentTime = 0;
      setCurrentTime(0);
      setProgress(0);
      return;
    }

    if (queue.length === 0) return;

    if (isShuffle && queue.length > 1) {
      const otherIndices = queue.map((_, i) => i).filter((i) => i !== queueIndex);
      const randIndex = otherIndices[Math.floor(Math.random() * otherIndices.length)];
      setQueueIndex(randIndex);
      playSong(queue[randIndex]);
      return;
    }

    const prevIndex = (queueIndex - 1 + queue.length) % queue.length;
    setQueueIndex(prevIndex);
    playSong(queue[prevIndex]);
  }, [queue, queueIndex, isShuffle, playSong]);

  const playPrevRef = useRef(playPrev);
  useEffect(() => {
    playPrevRef.current = playPrev;
  }, [playPrev]);

  // Queue Operations
  const addToQueue = useCallback((song) => {
    setQueue((prev) => {
      if (prev.some((s) => s.id === song.id)) return prev;
      return [...prev, song];
    });
  }, []);

  const removeFromQueue = useCallback((songId) => {
    setQueue((prev) => prev.filter((s) => s.id !== songId));
  }, []);

  // Favourites
  const toggleFavourite = useCallback((song) => {
    setFavourites((prev) => {
      const exists = prev.find((s) => s.id === song.id);
      const updated = exists ? prev.filter((s) => s.id !== song.id) : [song, ...prev];
      localStorage.setItem('moodify_favs', JSON.stringify(updated));
      return updated;
    });
  }, []);

  const isFavourite = useCallback((id) => favourites.some((s) => s.id === id), [favourites]);

  // Full-screen Now Playing modal controls
  const openNowPlaying = useCallback(() => setIsNowPlayingOpen(true), []);
  const closeNowPlaying = useCallback(() => setIsNowPlayingOpen(false), []);

  // Sleep Timer Setter
  const handleSetSleepTimer = useCallback((mode) => {
    setSleepTimerMode(mode);
  }, []);

  // Media Session API for native lock-screen & headphone controls
  useEffect(() => {
    if (!('mediaSession' in navigator) || !currentSong) return;

    try {
      navigator.mediaSession.metadata = new MediaMetadata({
        title: currentSong.title,
        artist: currentSong.artist,
        album: currentSong.album || 'Moodify',
        artwork: [
          { src: currentSong.coverUrl, sizes: '96x96', type: 'image/jpeg' },
          { src: currentSong.coverUrl, sizes: '128x128', type: 'image/jpeg' },
          { src: currentSong.coverUrl, sizes: '192x192', type: 'image/jpeg' },
          { src: currentSong.coverUrl, sizes: '512x512', type: 'image/jpeg' },
        ],
      });

      navigator.mediaSession.setActionHandler('play', () => togglePlay());
      navigator.mediaSession.setActionHandler('pause', () => togglePlay());
      navigator.mediaSession.setActionHandler('previoustrack', () => playPrevRef.current());
      navigator.mediaSession.setActionHandler('nexttrack', () => playNextRef.current());
      navigator.mediaSession.setActionHandler('seekto', (details) => {
        if (details.seekTime !== undefined) {
          seekToTime(details.seekTime);
        }
      });
      navigator.mediaSession.setActionHandler('seekbackward', (details) => {
        const skip = details.seekOffset || 10;
        seekToTime(Math.max((audioRef.current.currentTime || 0) - skip, 0));
      });
      navigator.mediaSession.setActionHandler('seekforward', (details) => {
        const skip = details.seekOffset || 10;
        seekToTime(Math.min((audioRef.current.currentTime || 0) + skip, duration || 9999));
      });
    } catch (e) {
      console.warn('[MediaSession] Setup error:', e);
    }
  }, [currentSong, togglePlay, seekToTime, duration]);

  // Sync playback state to mediaSession
  useEffect(() => {
    if ('mediaSession' in navigator) {
      navigator.mediaSession.playbackState = isPlaying ? 'playing' : 'paused';
    }
  }, [isPlaying]);

  return (
    <PlayerContext.Provider
      value={{
        currentSong,
        isPlaying,
        progress,
        currentTime,
        duration,
        volume,
        queue,
        queueIndex,
        isShuffle,
        repeatMode,
        isNowPlayingOpen,
        sleepTimerMode,
        sleepTimeRemaining,
        favourites,
        recentlyPlayed,
        playSong,
        togglePlay,
        seek,
        seekToTime,
        changeVolume,
        toggleShuffle,
        toggleRepeat,
        playNext,
        playPrev,
        addToQueue,
        removeFromQueue,
        toggleFavourite,
        isFavourite,
        openNowPlaying,
        closeNowPlaying,
        setSleepTimerMode: handleSetSleepTimer,
        setIsNowPlayingOpen,
      }}
    >
      {children}
    </PlayerContext.Provider>
  );
}

export const usePlayer = () => {
  const ctx = useContext(PlayerContext);
  if (!ctx) throw new Error('usePlayer must be used within PlayerProvider');
  return ctx;
};

export default PlayerContext;
