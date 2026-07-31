import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import { User, Lock, Mail, AlertCircle, ArrowRight, ShieldCheck } from 'lucide-react';

const Login = () => {
  const navigate = useNavigate();
  const { user, loginWithEmail, signUpWithEmail, loading, error, setError } = useAuthStore();

  const [mode, setMode] = useState('login'); // 'login' or 'signup'
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [displayName, setDisplayName] = useState('');

  // Redirect to home if user is authenticated
  React.useEffect(() => {
    if (user) {
      navigate('/');
    }
  }, [user, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    if (mode === 'signup') {
      if (password !== confirmPassword) {
        setError('Passwords do not match. Please try again.');
        return;
      }
      const res = await signUpWithEmail(email, password, displayName);
      if (res.success) {
        navigate('/');
      }
    } else {
      const res = await loginWithEmail(email, password);
      if (res.success) {
        navigate('/');
      }
    }
  };

  return (
    <div className="w-full min-h-screen flex items-center justify-center bg-[#09090b] p-4 text-white font-sans select-none relative overflow-hidden">
      {/* Dynamic Background Glow Rings */}
      <div className="absolute -top-40 -left-40 w-96 h-96 bg-spotify-base/15 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-40 -right-40 w-96 h-96 bg-emerald-600/15 rounded-full blur-3xl pointer-events-none" />

      <div className="w-full max-w-md bg-[#121214] border border-white/10 rounded-3xl p-8 shadow-2xl z-10 relative backdrop-blur-xl">
        {/* Top Logo & Title */}
        <div className="flex flex-col items-center text-center mb-8">
          <img
            src="/logo.png"
            alt="Shubify Logo"
            className="w-16 h-16 object-contain mb-3 drop-shadow-xl hover:scale-105 transition-transform"
          />
          <h1 className="text-3xl font-black bg-gradient-to-r from-spotify-base via-emerald-400 to-green-300 bg-clip-text text-transparent animate-gradient-bg tracking-tight">
            Shubify
          </h1>
          <span className="text-xs font-extrabold text-spotify-base tracking-wider uppercase opacity-90 mt-0.5">
            – Ad-Free Music Player
          </span>
          <p className="text-xs text-gray-400 mt-2 font-semibold">
            {mode === 'login' ? 'Welcome back! Log in to your account.' : 'Create an account to stream endless music.'}
          </p>
        </div>

        {/* Auth Error Banner */}
        {error && (
          <div className="bg-red-500/10 border border-red-500/40 text-red-400 px-4 py-3 rounded-2xl mb-6 flex items-center gap-3 text-xs font-semibold animate-shake">
            <AlertCircle size={18} className="flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* Toggle Tabs (Log In vs Sign Up) */}
        <div className="flex bg-[#1a1a1e] p-1 rounded-2xl mb-6">
          <button
            type="button"
            onClick={() => {
              setMode('login');
              setError(null);
            }}
            className={`flex-1 py-2.5 text-xs font-extrabold rounded-xl transition-all ${
              mode === 'login' ? 'bg-spotify-base text-black shadow-md' : 'text-gray-400 hover:text-white'
            }`}
          >
            Log In
          </button>
          <button
            type="button"
            onClick={() => {
              setMode('signup');
              setError(null);
            }}
            className={`flex-1 py-2.5 text-xs font-extrabold rounded-xl transition-all ${
              mode === 'signup' ? 'bg-spotify-base text-black shadow-md' : 'text-gray-400 hover:text-white'
            }`}
          >
            Sign Up
          </button>
        </div>

        {/* Regular Form Fields */}
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          {mode === 'signup' && (
            <div>
              <label className="text-xs font-bold text-gray-300 block mb-1.5">Full Name</label>
              <div className="relative">
                <User size={18} className="absolute left-3.5 top-3 text-gray-400" />
                <input
                  type="text"
                  value={displayName}
                  onChange={(e) => setDisplayName(e.target.value)}
                  placeholder="e.g. Shubham Gaonkar"
                  required
                  className="w-full bg-[#1c1c20] border border-white/10 rounded-2xl pl-10 pr-4 py-2.5 text-sm text-white focus:outline-none focus:border-spotify-base transition-colors"
                />
              </div>
            </div>
          )}

          <div>
            <label className="text-xs font-bold text-gray-300 block mb-1.5">Email Address</label>
            <div className="relative">
              <Mail size={18} className="absolute left-3.5 top-3 text-gray-400" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@example.com"
                required
                className="w-full bg-[#1c1c20] border border-white/10 rounded-2xl pl-10 pr-4 py-2.5 text-sm text-white focus:outline-none focus:border-spotify-base transition-colors"
              />
            </div>
          </div>

          <div>
            <label className="text-xs font-bold text-gray-300 block mb-1.5">Password</label>
            <div className="relative">
              <Lock size={18} className="absolute left-3.5 top-3 text-gray-400" />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                minLength={6}
                className="w-full bg-[#1c1c20] border border-white/10 rounded-2xl pl-10 pr-4 py-2.5 text-sm text-white focus:outline-none focus:border-spotify-base transition-colors"
              />
            </div>
          </div>

          {mode === 'signup' && (
            <div>
              <label className="text-xs font-bold text-gray-300 block mb-1.5">Confirm Password</label>
              <div className="relative">
                <Lock size={18} className="absolute left-3.5 top-3 text-gray-400" />
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  minLength={6}
                  className="w-full bg-[#1c1c20] border border-white/10 rounded-2xl pl-10 pr-4 py-2.5 text-sm text-white focus:outline-none focus:border-spotify-base transition-colors"
                />
              </div>
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-spotify-base hover:bg-spotify-highlight text-black font-extrabold text-sm py-3.5 px-4 rounded-full flex items-center justify-center gap-2 hover:scale-[1.02] active:scale-95 transition-all shadow-xl mt-2 disabled:opacity-50"
          >
            {loading ? (
              <span className="w-5 h-5 border-2 border-black border-t-transparent rounded-full animate-spin" />
            ) : (
              <>
                <span>{mode === 'login' ? 'Log In to Shubify' : 'Create Account'}</span>
                <ArrowRight size={18} />
              </>
            )}
          </button>
        </form>

        {/* Security badge */}
        <div className="mt-8 pt-4 border-t border-white/5 flex items-center justify-center gap-2 text-[11px] font-semibold text-gray-400">
          <ShieldCheck size={14} className="text-spotify-base" />
          <span>Protected with secure authentication & session persistence</span>
        </div>
      </div>
    </div>
  );
};

export default Login;
