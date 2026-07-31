import React, { useState } from 'react';
import { X, Music } from 'lucide-react';
import { usePlayerStore } from '../store/playerStore';
import { useNavigate } from 'react-router-dom';

const CreatePlaylistModal = ({ isOpen, onClose }) => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const { createPlaylist } = usePlayerStore();
  const navigate = useNavigate();

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name.trim()) return;

    const newPlaylist = createPlaylist(name.trim(), description.trim());
    setName('');
    setDescription('');
    onClose();
    if (newPlaylist) {
      navigate(`/playlist/${newPlaylist.id}`);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-[#282828] border border-white/10 rounded-xl w-full max-w-md p-6 shadow-2xl relative animate-in fade-in zoom-in-95 duration-200">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors"
        >
          <X size={20} />
        </button>

        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 bg-spotify-base/20 text-spotify-base rounded-full flex items-center justify-center">
            <Music size={22} />
          </div>
          <div>
            <h3 className="text-xl font-bold text-white">Create New Playlist</h3>
            <p className="text-xs text-gray-400">Build your custom music collection</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div>
            <label className="block text-xs font-bold text-gray-300 uppercase tracking-wider mb-2">
              Playlist Name *
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="My Bollywood Party Hits"
              required
              className="w-full bg-[#181818] border border-[#383838] focus:border-spotify-base rounded-lg px-4 py-3 text-white text-sm focus:outline-none transition-all"
              autoFocus
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-300 uppercase tracking-wider mb-2">
              Description (Optional)
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Give your playlist a cool description..."
              rows={3}
              className="w-full bg-[#181818] border border-[#383838] focus:border-spotify-base rounded-lg px-4 py-3 text-white text-sm focus:outline-none transition-all resize-none"
            />
          </div>

          <div className="flex justify-end gap-3 mt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 rounded-full text-sm font-semibold text-gray-300 hover:text-white hover:bg-white/10 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-2.5 rounded-full text-sm font-bold bg-spotify-base hover:bg-spotify-highlight text-black transition-transform hover:scale-105"
            >
              Create Playlist
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreatePlaylistModal;
