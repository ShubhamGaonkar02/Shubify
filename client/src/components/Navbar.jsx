import React, { useState, useRef, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Sun, Moon, LogOut, ShieldCheck, ChevronDown } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { usePlayerStore } from '../store/playerStore';
import { useAuthStore } from '../store/authStore';

const Navbar = () => {
  const navigate = useNavigate();
  const { theme, toggleTheme } = usePlayerStore();
  const { user, logout } = useAuthStore();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  const userPhoto =
    user?.photoURL ||
    `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(user?.displayName || 'User')}`;

  return (
    <nav
      className={`h-16 flex items-center justify-between px-4 md:px-8 sticky top-0 z-40 backdrop-blur-md transition-colors ${
        theme === 'light'
          ? 'bg-white/95 border-b border-slate-200 text-slate-900 shadow-sm'
          : 'bg-[#121212]/90 text-white'
      }`}
    >
      {/* Mobile Brand Logo / Left Nav History */}
      <div className="flex items-center gap-3">
        {/* Mobile Shubify Logo (Hidden on desktop since desktop has Sidebar) */}
        <div
          onClick={() => navigate('/')}
          className="flex md:hidden items-center gap-2 cursor-pointer"
        >
          <img src="/logo.png" alt="Shubify" className="w-8 h-8 object-contain drop-shadow" />
          <span className="font-black text-lg tracking-tight animate-wave-text">Shubify</span>
        </div>

        {/* Navigation History Controls */}
        <div className="hidden sm:flex gap-2">
          <button
            onClick={() => navigate(-1)}
            className={`rounded-full p-1.5 transition-colors ${
              theme === 'light'
                ? 'bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200'
                : 'bg-black/40 text-gray-400 hover:text-white'
            }`}
            title="Go back"
          >
            <ChevronLeft size={20} />
          </button>
          <button
            onClick={() => navigate(1)}
            className={`rounded-full p-1.5 transition-colors ${
              theme === 'light'
                ? 'bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200'
                : 'bg-black/40 text-gray-400 hover:text-white'
            }`}
            title="Go forward"
          >
            <ChevronRight size={20} />
          </button>
        </div>
      </div>

      <div className="flex items-center gap-2 sm:gap-4">
        {/* Light / Dark Mode Toggle Button */}
        <button
          onClick={toggleTheme}
          className={`p-2 rounded-full flex items-center gap-1.5 text-xs font-black transition-all shadow-sm ${
            theme === 'light'
              ? 'bg-slate-100 text-slate-900 hover:bg-slate-200 border border-slate-300'
              : 'bg-[#282828] text-yellow-400 hover:bg-[#383838] border border-white/10'
          }`}
          title={theme === 'light' ? 'Switch to Dark Mode' : 'Switch to Light Mode'}
        >
          {theme === 'light' ? (
            <Moon size={16} className="fill-current text-slate-900" />
          ) : (
            <Sun size={16} className="fill-current text-yellow-400" />
          )}
          <span className="hidden md:inline">{theme === 'light' ? 'Dark Mode' : 'Light Mode'}</span>
        </button>

        {/* User Profile & Logout Dropdown */}
        {user ? (
          <div className="relative" ref={dropdownRef}>
            <button
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              className={`flex items-center gap-2 p-1 pr-2.5 rounded-full transition-all shadow-sm border ${
                theme === 'light'
                  ? 'bg-slate-100 hover:bg-slate-200 border-slate-300 text-slate-900'
                  : 'bg-black/80 hover:bg-[#282828] border-white/10 text-white'
              }`}
              title="User Account Menu"
            >
              <img
                src={userPhoto}
                alt={user.displayName || 'User Avatar'}
                className="w-7 h-7 rounded-full object-cover shadow"
              />
              <span className="text-xs font-extrabold max-w-[100px] truncate hidden sm:inline">
                {user.displayName || 'Account'}
              </span>
              <ChevronDown size={14} className="text-gray-400" />
            </button>

            {/* Dropdown Menu */}
            {isDropdownOpen && (
              <div
                className={`absolute right-0 mt-2 w-60 rounded-2xl p-2 shadow-2xl border z-50 animate-fadeIn ${
                  theme === 'light'
                    ? 'bg-white border-slate-200 text-slate-900'
                    : 'bg-[#18181b] border-white/10 text-white'
                }`}
              >
                {/* User Info Card */}
                <div className="px-3 py-3 border-b border-gray-200/20 mb-1">
                  <p className="text-xs font-black truncate">{user.displayName || 'User'}</p>
                  <p className="text-[11px] text-gray-400 truncate mt-0.5">{user.email}</p>
                  <div className="mt-2 flex items-center gap-1.5 text-[10px] text-spotify-base font-bold bg-spotify-base/10 px-2 py-1 rounded-md w-max">
                    <ShieldCheck size={12} />
                    <span>{user.provider === 'google.com' ? 'Google Authenticated' : 'Shubify User'}</span>
                  </div>
                </div>

                {/* Log Out Button */}
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-xs font-extrabold text-red-500 hover:bg-red-500/10 transition-colors"
                >
                  <LogOut size={16} />
                  <span>Log out</span>
                </button>
              </div>
            )}
          </div>
        ) : (
          <div className="flex items-center gap-2">
            <button
              onClick={() => navigate('/login')}
              className={`font-bold text-xs sm:text-sm transition-colors ${
                theme === 'light' ? 'text-slate-700 hover:text-spotify-base' : 'text-gray-400 hover:text-spotify-base'
              }`}
            >
              Sign up
            </button>
            <button
              onClick={() => navigate('/login')}
              className="bg-spotify-base text-black font-extrabold text-xs sm:text-sm px-4 py-1.5 sm:px-6 sm:py-2 rounded-full hover:scale-105 transition-transform shadow-md"
            >
              Log in
            </button>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
