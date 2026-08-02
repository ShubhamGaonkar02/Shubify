import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import Navbar from './components/Navbar';
import MusicPlayer from './components/MusicPlayer';
import MobileBottomNav from './components/MobileBottomNav';
import CreatePlaylistModal from './components/CreatePlaylistModal';
import Home from './pages/Home';
import Search from './pages/Search';
import Login from './pages/Login';
import LikedSongs from './pages/LikedSongs';
import PlaylistView from './pages/PlaylistView';
import Library from './pages/Library';
import { setAccessToken } from './api/spotify';
import { usePlayerStore } from './store/playerStore';
import { useAuthStore } from './store/authStore';

function App() {
  const { theme, isCreatePlaylistOpen, closeCreatePlaylistModal } = usePlayerStore();
  const { user, initializeAuth } = useAuthStore();

  useEffect(() => {
    initializeAuth();

    // Ensure spotify token is set if user exists
    const storedToken = localStorage.getItem('spotify_token') || 'shubify_demo_token';
    setAccessToken(storedToken);
  }, [initializeAuth]);

  return (
    <Router>
      <div
        className={`flex h-screen overflow-hidden font-sans transition-colors ${
          theme === 'light' ? 'bg-[#eaf6ee]' : 'bg-black'
        }`}
      >
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route
            path="/*"
            element={
              !user ? (
                <Navigate to="/login" replace />
              ) : (
                <>
                  {/* Left Sidebar (Desktop Only) */}
                  <Sidebar />

                  {/* Center Main Panel (Full Width on Mobile) */}
                  <div
                    className={`flex-1 overflow-y-auto rounded-none md:rounded-xl my-0 md:my-2 mr-0 md:mr-2 relative custom-scrollbar transition-all ${
                      theme === 'light'
                        ? 'bg-white text-slate-900 shadow-sm border border-emerald-200/80'
                        : 'bg-[#121212] text-white'
                    }`}
                  >
                    <Navbar />
                    <div className="pb-36">
                      <Routes>
                        <Route path="/" element={<Home />} />
                        <Route path="/search" element={<Search />} />
                        <Route path="/liked" element={<LikedSongs />} />
                        <Route path="/playlist/:id" element={<PlaylistView />} />
                        <Route path="/library" element={<Library />} />
                        <Route path="*" element={<Navigate to="/" replace />} />
                      </Routes>
                    </div>
                  </div>

                  {/* Bottom Music Player Bar */}
                  <div
                    className={`fixed bottom-16 md:bottom-0 left-0 right-0 h-[65px] md:h-[90px] border-t z-40 transition-colors ${
                      theme === 'light'
                        ? 'bg-white border-slate-200 text-slate-900 shadow-md'
                        : 'bg-black border-[#282828] text-white'
                    }`}
                  >
                    <MusicPlayer />
                  </div>

                  {/* Mobile Bottom Navigation Bar */}
                  <MobileBottomNav />

                  {/* Global Create Playlist Modal (Works on Mobile & Desktop) */}
                  <CreatePlaylistModal
                    isOpen={isCreatePlaylistOpen}
                    onClose={closeCreatePlaylistModal}
                  />
                </>
              )
            }
          />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
