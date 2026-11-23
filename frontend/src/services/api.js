import axios from 'axios';
import { mockSongs } from '../data/mockSongs';

const API_BASE = 'http://localhost:8000';
const USE_MOCK = true; // Set to false when FastAPI backend is ready

const apiClient = axios.create({
  baseURL: API_BASE,
  timeout: 5000,
});

// Mock delay helper
const delay = (ms = 500) => new Promise(r => setTimeout(r, ms));

// --- Song APIs ---
export const getSongs = async (filters = {}) => {
  if (USE_MOCK) {
    await delay(300);
    let songs = [...mockSongs];
    if (filters.language && filters.language !== 'All') {
      songs = songs.filter(s => s.language === filters.language);
    }
    if (filters.mood) {
      songs = songs.filter(s => s.moods.some(m => m.toLowerCase().includes(filters.mood.toLowerCase())));
    }
    if (filters.energy && filters.energy !== 'Any') {
      songs = songs.filter(s => s.energy === filters.energy);
    }
    if (filters.genre && filters.genre !== 'Anything') {
      songs = songs.filter(s => s.genre === filters.genre);
    }
    return songs;
  }
  const { data } = await apiClient.get('/songs', { params: filters });
  return data;
};

export const getSongById = async (id) => {
  if (USE_MOCK) {
    await delay(200);
    return mockSongs.find(s => s.id === id) || null;
  }
  const { data } = await apiClient.get(`/songs/${id}`);
  return data;
};

export const getRelatedSongs = async (songId) => {
  if (USE_MOCK) {
    await delay(400);
    const song = mockSongs.find(s => s.id === songId);
    if (!song) return [];
    return mockSongs.filter(s => song.relatedIds.includes(s.id));
  }
  const { data } = await apiClient.get(`/songs/${songId}/related`);
  return data;
};

export const getMoodSongs = async (moodName) => {
  if (USE_MOCK) {
    await delay(400);
    return mockSongs.filter(s => s.moods.some(m => m.toLowerCase().includes(moodName.toLowerCase()))).slice(0, 5);
  }
  const { data } = await apiClient.post('/mood-match', { mood: moodName });
  return data;
};

export const getPickForMe = async (filters) => {
  if (USE_MOCK) {
    await delay(600);
    let songs = [...mockSongs];
    if (filters.language && filters.language !== 'Any') songs = songs.filter(s => s.language === filters.language);
    if (filters.mood && filters.mood !== 'Any') songs = songs.filter(s => s.moods.some(m => m.toLowerCase().includes(filters.mood.toLowerCase())));
    if (filters.genre && filters.genre !== 'Anything') songs = songs.filter(s => s.genre === filters.genre);
    if (filters.energy && filters.energy !== 'Any') songs = songs.filter(s => s.energy === filters.energy);
    // Shuffle and return top 5 with match %
    const shuffled = songs.sort(() => Math.random() - 0.5).slice(0, 5);
    return shuffled.map(s => ({ ...s, matchPercent: Math.floor(Math.random() * 20) + 80 }));
  }
  const { data } = await apiClient.post('/pick-for-me', filters);
  return data;
};

export const getBlend = async (song1Id, song2Id) => {
  if (USE_MOCK) {
    await delay(800);
    const s1 = mockSongs.find(s => s.id === song1Id);
    const s2 = mockSongs.find(s => s.id === song2Id);
    const related1 = s1 ? mockSongs.filter(s => s1.relatedIds.includes(s.id)) : [];
    const related2 = s2 ? mockSongs.filter(s => s2.relatedIds.includes(s.id)) : [];
    const combined = [...new Map([...related1, ...related2].map(s => [s.id, s])).values()].slice(0, 5);
    return {
      bridge: { tempo: 'Mid-tempo', atmosphere: 'Cinematic', emotion: 'Bittersweet longing' },
      songs: combined
    };
  }
  const { data } = await apiClient.post('/blend', { song1_id: song1Id, song2_id: song2Id });
  return data;
};
