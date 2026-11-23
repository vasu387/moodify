import React, { useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { PlayerProvider } from './context/PlayerContext';
import { Header } from './components/layout/Header';
import { MobileNav } from './components/layout/MobileNav';
import { MiniPlayer } from './components/layout/MiniPlayer';

import { DiscoverPage } from './pages/DiscoverPage';
import { MusicMapPage } from './pages/MusicMapPage';
import { MoodMatchPage } from './pages/MoodMatchPage';
import { PickForMePage } from './pages/PickForMePage';
import { MusicBlendPage } from './pages/MusicBlendPage';
import { MusicTogetherPage } from './pages/MusicTogetherPage';

// Automatically scroll window back to top on route change
function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
}

export function App() {
  return (
    <BrowserRouter>
      <ScrollToTop />
      <PlayerProvider>
        <div className="min-h-screen bg-obsidian text-gray-200 font-sans selection:bg-amber-500 selection:text-black relative">
          {/* Fixed Navigation Bar (h-14 mobile, h-16 desktop) */}
          <Header />

          {/* Main Application Content with proper top offset padding so content is never cut off */}
          <main className="min-h-screen pt-20 md:pt-24">
            <Routes>
              <Route path="/" element={<DiscoverPage />} />
              <Route path="/discover" element={<DiscoverPage />} />
              <Route path="/music-map" element={<MusicMapPage />} />
              <Route path="/mood-match" element={<MoodMatchPage />} />
              <Route path="/pick-for-me" element={<PickForMePage />} />
              <Route path="/blend" element={<MusicBlendPage />} />
              <Route path="/together" element={<MusicTogetherPage />} />
              <Route path="*" element={<Navigate to="/discover" replace />} />
            </Routes>
          </main>

          {/* Mobile Bottom Navigation (screens < 768px) */}
          <MobileNav />

          {/* Persistent HTML5 Audio Bottom Player */}
          <MiniPlayer />
        </div>
      </PlayerProvider>
    </BrowserRouter>
  );
}

export default App;
