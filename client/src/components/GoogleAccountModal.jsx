import React, { useState } from 'react';
import { X, Mail, CheckCircle2, ArrowRight } from 'lucide-react';
import { useAuthStore } from '../store/authStore';

const GoogleAccountModal = ({ isOpen, onClose, onSuccess }) => {
  const { loginWithGoogle } = useAuthStore();
  const [customEmail, setCustomEmail] = useState('');
  const [customName, setCustomName] = useState('');
  const [showCustomForm, setShowCustomForm] = useState(false);

  if (!isOpen) return null;

  const defaultAccounts = [
    {
      uid: 'google-shubham-001',
      displayName: 'Shubham Gaonkar',
      email: 'shubhamgaonkar@gmail.com',
      photoURL: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200&h=200',
    },
    {
      uid: 'google-[#1db954]-002',
      displayName: 'Shubham Music',
      email: 'shubham.music@gmail.com',
      photoURL: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=200&h=200',
    },
  ];

  const handleSelectAccount = async (account) => {
    const res = await loginWithGoogle(account);
    if (res.success) {
      onSuccess?.();
      onClose();
    }
  };

  const handleCustomSubmit = async (e) => {
    e.preventDefault();
    if (!customEmail.trim() || !customEmail.includes('@')) return;

    const account = {
      uid: `google-custom-${Date.now()}`,
      displayName: customName.trim() || customEmail.split('@')[0],
      email: customEmail.trim(),
      photoURL: `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(customEmail)}`,
    };

    const res = await loginWithGoogle(account);
    if (res.success) {
      onSuccess?.();
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-md p-4 animate-fadeIn">
      <div className="bg-[#181818] border border-white/10 w-full max-w-md rounded-2xl p-6 text-white shadow-2xl relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-white p-1 rounded-full hover:bg-white/10 transition-colors"
        >
          <X size={20} />
        </button>

        {/* Google Header Logo */}
        <div className="flex flex-col items-center text-center mb-6">
          <div className="w-12 h-12 rounded-full bg-white flex items-center justify-center shadow-md mb-3">
            <svg className="w-6 h-6" viewBox="0 0 24 24">
              <path
                fill="#4285F4"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="#34A853"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="#FBBC05"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
              />
              <path
                fill="#EA4335"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
              />
            </svg>
          </div>
          <h2 className="text-xl font-extrabold text-white">Sign in with Google</h2>
          <p className="text-xs text-gray-400 mt-1">Choose a Google Account to continue to Shubify</p>
        </div>

        {!showCustomForm ? (
          <div className="flex flex-col gap-3">
            {defaultAccounts.map((acc) => (
              <div
                key={acc.uid}
                onClick={() => handleSelectAccount(acc)}
                className="flex items-center justify-between p-3.5 bg-[#242424] hover:bg-[#303030] border border-white/5 hover:border-spotify-base/40 rounded-xl cursor-pointer transition-all group"
              >
                <div className="flex items-center gap-3">
                  <img src={acc.photoURL} alt={acc.displayName} className="w-10 h-10 rounded-full object-cover shadow" />
                  <div className="flex flex-col">
                    <span className="text-sm font-bold group-hover:text-spotify-base transition-colors">
                      {acc.displayName}
                    </span>
                    <span className="text-xs text-gray-400">{acc.email}</span>
                  </div>
                </div>
                <CheckCircle2 size={18} className="text-spotify-base opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>
            ))}

            <button
              onClick={() => setShowCustomForm(true)}
              className="mt-2 text-xs font-bold text-spotify-base hover:underline flex items-center justify-center gap-1.5 py-2"
            >
              <Mail size={14} /> Use another Google Account
            </button>
          </div>
        ) : (
          <form onSubmit={handleCustomSubmit} className="flex flex-col gap-4">
            <div>
              <label className="text-xs font-bold text-gray-300 block mb-1">Google Email Address</label>
              <input
                type="email"
                value={customEmail}
                onChange={(e) => setCustomEmail(e.target.value)}
                placeholder="your.email@gmail.com"
                required
                className="w-full bg-[#242424] border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-spotify-base"
              />
            </div>
            <div>
              <label className="text-xs font-bold text-gray-300 block mb-1">Your Full Name (Optional)</label>
              <input
                type="text"
                value={customName}
                onChange={(e) => setCustomName(e.target.value)}
                placeholder="e.g. Shubham Gaonkar"
                className="w-full bg-[#242424] border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-spotify-base"
              />
            </div>

            <div className="flex items-center justify-between pt-2">
              <button
                type="button"
                onClick={() => setShowCustomForm(false)}
                className="text-xs font-bold text-gray-400 hover:text-white"
              >
                Back to accounts
              </button>
              <button
                type="submit"
                className="bg-spotify-base text-black font-bold text-sm px-6 py-2.5 rounded-full hover:scale-105 transition-transform flex items-center gap-2"
              >
                Continue <ArrowRight size={16} />
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default GoogleAccountModal;
