import React, { useState } from 'react';
import { usePlayerStore } from '../store/playerStore';
import { Heart, X, UserPlus, Check, Radio } from 'lucide-react';

const artistBios = {
  'Arijit Singh': {
    listeners: '38,912,405',
    bio: 'Arijit Singh is an Indian playback singer and music composer. Known as the King of Romantic Music in India, he has won a National Film Award and seven Filmfare Awards.',
    img: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&q=80&w=600&h=600',
  },
  'Jubin Nautiyal': {
    listeners: '21,430,192',
    bio: 'Jubin Nautiyal is an Indian playback singer and performer known for his soulful unplugged vocals, romantic chartbusters, and Bollywood film soundtracks.',
    img: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?auto=format&fit=crop&q=80&w=600&h=600',
  },
  Badshah: {
    listeners: '19,850,310',
    bio: 'Badshah is an Indian rapper, singer, and music producer known for his Hindi, Haryanvi, and Punjabi songs. He is one of the biggest hitmakers in Indian hip-hop and pop.',
    img: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&q=80&w=600&h=600',
  },
  'Shreya Ghoshal': {
    listeners: '24,105,800',
    bio: 'Shreya Ghoshal is a legendary Indian playback singer who has recorded songs for films and albums in various Indian languages and has received four National Film Awards.',
    img: 'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?auto=format&fit=crop&q=80&w=600&h=600',
  },
};

const RightSidebar = () => {
  const { currentTrack, isLiked, toggleLikeTrack } = usePlayerStore();
  const [isFollowing, setIsFollowing] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);

  if (!currentTrack || isCollapsed) return null;

  const primaryArtist = currentTrack.artists?.[0]?.name || 'Bollywood Artist';
  const info = artistBios[primaryArtist] || {
    listeners: '18,500,000',
    bio: `${primaryArtist} is a top featured Indian music artist with millions of streams worldwide across Bollywood film soundtracks and pop singles.`,
    img: currentTrack.album?.images?.[0]?.url || 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&q=80&w=600&h=600',
  };

  const albumArt =
    currentTrack.album?.images?.[0]?.url ||
    'https://images.unsplash.com/photo-1614613535308-eb5fbd3d2c17?auto=format&fit=crop&q=80&w=600&h=600';

  return (
    <div className="w-80 bg-[#121212] h-full flex flex-col border-l border-[#181818] select-none overflow-y-auto custom-scrollbar p-4 relative">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-white font-bold text-base flex items-center gap-2">
          <Radio size={16} className="text-spotify-base" /> Now Playing
        </h3>
        <button
          onClick={() => setIsCollapsed(true)}
          className="text-gray-400 hover:text-white p-1 rounded-full hover:bg-white/10 transition-colors"
          title="Close panel"
        >
          <X size={18} />
        </button>
      </div>

      {/* Main Track Image Card */}
      <div className="relative rounded-lg overflow-hidden mb-4 aspect-square shadow-2xl group bg-[#181818]">
        <img src={albumArt} alt={currentTrack.name} className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent flex flex-col justify-end p-4">
          <h2 className="text-white font-bold text-xl truncate">{currentTrack.name}</h2>
          <p className="text-gray-300 text-sm truncate">
            {currentTrack.artists?.map((a) => a.name).join(', ')}
          </p>
        </div>
      </div>

      {/* Track Controls / Like */}
      <div className="flex items-center justify-between bg-[#181818] p-3.5 rounded-lg mb-6 shadow-md">
        <div className="flex flex-col truncate">
          <span className="text-white text-sm font-semibold truncate">{currentTrack.name}</span>
          <span className="text-xs text-gray-400 truncate">{currentTrack.album?.name || 'Single'}</span>
        </div>
        <button
          onClick={() => toggleLikeTrack(currentTrack)}
          className="p-1 text-spotify-base hover:scale-110 transition-transform"
        >
          <Heart
            size={20}
            fill={isLiked(currentTrack.id) ? '#1db954' : 'none'}
            className={isLiked(currentTrack.id) ? 'text-spotify-base' : 'text-gray-400'}
          />
        </button>
      </div>

      {/* About the Artist Card */}
      <div className="bg-[#181818] rounded-xl p-4 shadow-lg flex flex-col gap-3 relative overflow-hidden group">
        <div className="flex items-center justify-between mb-1">
          <span className="text-white font-bold text-sm">About the artist</span>
        </div>

        <div className="w-full h-40 rounded-lg overflow-hidden relative shadow-md">
          <img src={info.img} alt={primaryArtist} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
        </div>

        <div>
          <h4 className="text-white font-bold text-lg">{primaryArtist}</h4>
          <p className="text-gray-400 text-xs mt-0.5">{info.listeners} monthly listeners</p>
        </div>

        <p className="text-gray-300 text-xs line-clamp-4 leading-relaxed">{info.bio}</p>

        <button
          onClick={() => setIsFollowing(!isFollowing)}
          className={`w-full py-2.5 rounded-full text-xs font-bold transition-all flex items-center justify-center gap-2 mt-1 ${
            isFollowing
              ? 'bg-transparent border border-gray-400 text-white hover:border-white'
              : 'bg-white text-black hover:scale-[1.02]'
          }`}
        >
          {isFollowing ? (
            <>
              <Check size={14} /> Following
            </>
          ) : (
            <>
              <UserPlus size={14} /> Follow
            </>
          )}
        </button>
      </div>
    </div>
  );
};

export default RightSidebar;
