import React from 'react';
import { Heart, Music, Plus } from 'lucide-react';
import { usePlayerStore } from '../store/playerStore';
import { useNavigate } from 'react-router-dom';

const Library = () => {
  const { likedSongs, customPlaylists } = usePlayerStore();
  const navigate = useNavigate();

  return (
    <div className="p-8 pb-32">
      <h1 className="text-3xl font-extrabold text-white mb-8">Your Library</h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
        {/* Liked Songs Tile */}
        <div
          onClick={() => navigate('/liked')}
          className="bg-gradient-to-br from-indigo-700 to-purple-800 p-6 rounded-lg cursor-pointer hover:scale-[1.02] transition-transform shadow-xl flex flex-col justify-end min-h-[220px] relative group"
        >
          <div className="absolute top-6 left-6 text-white">
            <Heart size={36} fill="white" />
          </div>
          <div>
            <h2 className="text-3xl font-extrabold text-white mb-2">Liked Songs</h2>
            <p className="text-sm font-semibold text-gray-200">
              {likedSongs.length} liked {likedSongs.length === 1 ? 'song' : 'songs'}
            </p>
          </div>
        </div>

        {/* Custom User Playlists */}
        {customPlaylists.map((playlist) => (
          <div
            key={playlist.id}
            onClick={() => navigate(`/playlist/${playlist.id}`)}
            className="bg-[#181818] p-5 rounded-lg hover:bg-[#282828] cursor-pointer transition-all shadow-md group flex flex-col justify-between min-h-[220px]"
          >
            <div className="w-full aspect-square bg-[#282828] rounded flex items-center justify-center mb-4 group-hover:scale-105 transition-transform overflow-hidden">
              <Music size={48} className="text-spotify-base" />
            </div>
            <div>
              <h3 className="text-white font-bold text-lg truncate mb-1">{playlist.name}</h3>
              <p className="text-xs text-gray-400">
                Playlist • {playlist.tracks.length} {playlist.tracks.length === 1 ? 'song' : 'songs'}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Library;
