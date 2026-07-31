import React, { useState, useEffect, useRef } from 'react';
import {
  Play,
  Pause,
  SkipBack,
  SkipForward,
  Volume2,
  Heart,
  Loader2,
  Maximize2,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';
import ReactPlayer from 'react-player';
import { usePlayerStore } from '../store/playerStore';
import { searchYouTubeVideo } from '../api/youtube';

const MusicPlayer = () => {
  const {
    currentTrack,
    isPlaying,
    setIsPlaying,
    volume,
    setVolume,
    playNext,
    playPrevious,
    toggleLikeTrack,
    isLiked,
    theme,
  } = usePlayerStore();

  const [activeMediaUrl, setActiveMediaUrl] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [played, setPlayed] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isExpanded, setIsExpanded] = useState(false);
  const playerRef = useRef(null);

  useEffect(() => {
    let isMounted = true;

    const prepareAudioSource = async () => {
      if (!currentTrack) {
        setActiveMediaUrl(null);
        return;
      }

      setIsLoading(true);
      setPlayed(0);

      const fallbackUrl = currentTrack.preview_url || null;

      try {
        const query = `${currentTrack.name} ${currentTrack.artists?.[0]?.name || ''}`;
        const videoId = await searchYouTubeVideo(query);

        if (isMounted) {
          if (videoId) {
            setActiveMediaUrl(`https://www.youtube.com/watch?v=${videoId}`);
          } else if (fallbackUrl) {
            setActiveMediaUrl(fallbackUrl);
          } else {
            setActiveMediaUrl('https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3');
          }
          setIsLoading(false);
          setIsPlaying(true);
        }
      } catch (err) {
        console.error('Playback setup error:', err);
        if (isMounted) {
          setActiveMediaUrl(fallbackUrl || 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3');
          setIsLoading(false);
          setIsPlaying(true);
        }
      }
    };

    prepareAudioSource();

    return () => {
      isMounted = false;
    };
  }, [currentTrack]);

  const formatTime = (seconds) => {
    if (!seconds || isNaN(seconds)) return '0:00';
    const min = Math.floor(seconds / 60);
    const sec = Math.floor(seconds % 60);
    return `${min}:${sec.toString().padStart(2, '0')}`;
  };

  const handleSeekChange = (e) => {
    const newPlayed = parseFloat(e.target.value);
    setPlayed(newPlayed);
    if (playerRef.current) {
      playerRef.current.seekTo(newPlayed);
    }
  };

  const handleVolumeChange = (e) => {
    setVolume(parseFloat(e.target.value));
  };

  const playerBg =
    theme === 'light'
      ? 'bg-white text-gray-900 border-t border-gray-200 shadow-2xl'
      : 'bg-black text-white border-t border-white/10';
  const textColor = theme === 'light' ? 'text-gray-900' : 'text-white';
  const subTextColor = theme === 'light' ? 'text-gray-500' : 'text-gray-400';
  const controlBtnColor = theme === 'light' ? 'text-gray-600 hover:text-black' : 'text-gray-400 hover:text-white';

  if (!currentTrack) {
    return (
      <div className={`h-full flex items-center justify-between px-6 ${subTextColor} ${playerBg}`}>
        <div className="text-sm font-semibold">Search and click any song to start playing</div>
      </div>
    );
  }

  const albumArt =
    currentTrack.album?.images?.[0]?.url ||
    'https://images.unsplash.com/photo-1614613535308-eb5fbd3d2c17?auto=format&fit=crop&q=80&w=600&h=600';

  return (
    <>
      {/* Hidden Audio Player */}
      {activeMediaUrl && (
        <div className="hidden">
          <ReactPlayer
            ref={playerRef}
            url={activeMediaUrl}
            playing={isPlaying}
            volume={volume}
            onProgress={(progress) => setPlayed(progress.played)}
            onDuration={(dur) => setDuration(dur)}
            onEnded={() => playNext()}
            config={{
              youtube: {
                playerVars: { showinfo: 0, controls: 0, disablekb: 1 },
              },
            }}
          />
        </div>
      )}

      {/* FULL-SCREEN / EXPANDED NOW PLAYING VIEW */}
      {isExpanded && (
        <div className="fixed inset-0 z-[100] bg-gradient-to-b from-[#065f46] via-[#09090b] to-[#040405] text-white flex flex-col justify-between p-6 md:p-12 animate-fade-in-up backdrop-blur-3xl overflow-y-auto">
          {/* Header Drag Down Control */}
          <div className="flex items-center justify-between w-full max-w-4xl mx-auto">
            <button
              onClick={() => setIsExpanded(false)}
              className="p-3 rounded-full bg-white/10 hover:bg-white/20 transition-all hover:scale-110 flex items-center gap-1 font-bold text-xs"
              title="Collapse Player"
            >
              <ChevronDown size={24} />
              <span>Minimize</span>
            </button>
            <div className="text-center">
              <span className="text-xs font-black uppercase tracking-widest text-spotify-base">
                Now Playing from Shubify
              </span>
              <p className="text-sm font-bold text-gray-300 truncate max-w-xs md:max-w-md">
                {currentTrack.album?.name || 'Bollywood Hits'}
              </p>
            </div>
            <button
              onClick={() => toggleLikeTrack(currentTrack)}
              className="p-3 rounded-full bg-white/10 hover:bg-white/20 transition-all hover:scale-110"
            >
              <Heart
                size={24}
                fill={isLiked(currentTrack?.id) ? '#1db954' : 'none'}
                className={isLiked(currentTrack?.id) ? 'text-spotify-base animate-pulse' : 'text-white'}
              />
            </button>
          </div>

          {/* Large Spinning Vinyl Art Center */}
          <div className="flex flex-col items-center justify-center my-6 max-w-4xl mx-auto w-full">
            <div className="relative mb-8">
              <div
                className={`w-64 h-64 sm:w-80 sm:h-80 md:w-96 md:h-96 rounded-full shadow-2xl overflow-hidden relative ring-8 ring-spotify-base/30 transition-transform ${
                  isPlaying ? 'animate-spin-slow ring-spotify-base/60' : 'ring-white/10'
                }`}
              >
                <img src={albumArt} alt={currentTrack.name} className="w-full h-full object-cover rounded-full" />
                {/* Vinyl Center Spindle */}
                <div className="absolute inset-0 m-auto w-12 h-12 bg-black rounded-full border-4 border-white/40 shadow-2xl flex items-center justify-center pointer-events-none">
                  <div className="w-4 h-4 bg-spotify-base rounded-full" />
                </div>
              </div>
            </div>

            {/* Song Title & Equalizer */}
            <div className="text-center max-w-lg">
              <div className="flex items-center justify-center gap-3">
                <h1 className="text-2xl sm:text-4xl font-black tracking-tight text-white line-clamp-1">
                  {currentTrack.name}
                </h1>
                {isPlaying && (
                  <div className="flex items-end gap-1 h-6 flex-shrink-0">
                    <span className="w-1 bg-spotify-base rounded-full equalizer-bar-1" />
                    <span className="w-1 bg-spotify-base rounded-full equalizer-bar-2" />
                    <span className="w-1 bg-spotify-base rounded-full equalizer-bar-3" />
                    <span className="w-1 bg-spotify-base rounded-full equalizer-bar-4" />
                  </div>
                )}
              </div>
              <p className="text-base sm:text-lg text-spotify-base font-extrabold mt-1 truncate">
                {currentTrack.artists?.map((a) => a.name).join(', ')}
              </p>
            </div>
          </div>

          {/* Timeline & Controls */}
          <div className="w-full max-w-3xl mx-auto flex flex-col gap-6">
            {/* Timeline Bar */}
            <div className="flex flex-col gap-2">
              <div className="relative w-full h-2 group flex items-center cursor-pointer">
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.001"
                  value={played}
                  onChange={handleSeekChange}
                  className="absolute w-full h-full opacity-0 cursor-pointer z-10"
                />
                <div className="w-full h-2 rounded-full overflow-hidden bg-white/20">
                  <div
                    className="h-full bg-spotify-base transition-all duration-75"
                    style={{ width: `${played * 100}%` }}
                  />
                </div>
                <div
                  className="absolute h-4 w-4 bg-white rounded-full opacity-100 shadow-xl pointer-events-none"
                  style={{ left: `calc(${played * 100}% - 8px)` }}
                />
              </div>
              <div className="flex justify-between text-xs font-black text-gray-400">
                <span>{formatTime(duration * played)}</span>
                <span>{formatTime(duration)}</span>
              </div>
            </div>

            {/* Playback Controls (Cleaned: Previous, Play/Pause, Next) */}
            <div className="flex items-center justify-center gap-10 px-6">
              <button
                onClick={playPrevious}
                className="text-white hover:text-spotify-base transition-all hover:scale-125"
                title="Previous"
              >
                <SkipBack size={32} fill="currentColor" />
              </button>

              <button
                onClick={() => setIsPlaying(!isPlaying)}
                className="w-16 h-16 bg-spotify-base hover:bg-spotify-highlight text-black rounded-full flex items-center justify-center shadow-2xl hover:scale-110 transition-all"
                title={isPlaying ? 'Pause' : 'Play'}
              >
                {isLoading ? (
                  <Loader2 size={30} className="animate-spin text-black" />
                ) : isPlaying ? (
                  <Pause size={30} fill="black" className="text-black" />
                ) : (
                  <Play size={30} fill="black" className="text-black ml-1" />
                )}
              </button>

              <button
                onClick={playNext}
                className="text-white hover:text-spotify-base transition-all hover:scale-125"
                title="Next"
              >
                <SkipForward size={32} fill="currentColor" />
              </button>
            </div>

            {/* Volume Control */}
            <div className="flex items-center justify-center gap-3 max-w-xs mx-auto w-full pt-2">
              <Volume2 size={20} className="text-gray-400" />
              <div className="relative w-full h-1.5 flex items-center cursor-pointer">
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.01"
                  value={volume}
                  onChange={handleVolumeChange}
                  className="absolute w-full h-full opacity-0 cursor-pointer z-10"
                />
                <div className="w-full h-1.5 rounded-full overflow-hidden bg-white/20">
                  <div className="h-full bg-spotify-base" style={{ width: `${volume * 100}%` }} />
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* MINI PLAYER BAR (BOTTOM STICKY BAR WITH TOP CENTER EXPAND BUTTON) */}
      <div className={`h-full flex items-center justify-between px-4 relative ${playerBg}`}>
        {/* CENTERED TOP EXPAND DRAG HANDLE BUTTON */}
        <button
          onClick={() => setIsExpanded(true)}
          className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-spotify-base hover:bg-spotify-highlight text-black text-xs font-black px-4 py-0.5 rounded-full shadow-xl border border-black/20 flex items-center gap-1.5 hover:scale-110 transition-all z-20 group"
          title="Click to Drag Up / View Full Screen Now Playing"
        >
          <ChevronUp size={14} className="animate-bounce" />
          <span>EXPAND</span>
          <ChevronUp size={14} className="animate-bounce" />
        </button>

        {/* Left: Track Info & Expand Handle */}
        <div className="flex items-center gap-4 w-1/3 min-w-[200px]">
          <div
            onClick={() => setIsExpanded(true)}
            className={`w-14 h-14 bg-[#282828] flex-shrink-0 rounded-full shadow-lg overflow-hidden relative group cursor-pointer transition-transform hover:scale-105 ${
              isPlaying ? 'ring-2 ring-spotify-base animate-spin-slow' : 'ring-1 ring-white/20'
            }`}
            title="Click to view full screen Now Playing"
          >
            <img src={albumArt} alt={currentTrack.name} className="w-full h-full object-cover rounded-full" />
            <div className="absolute inset-0 m-auto w-3 h-3 bg-black rounded-full border border-white/40 shadow-inner pointer-events-none" />
            {isLoading && (
              <div className="absolute inset-0 bg-black/60 flex items-center justify-center rounded-full">
                <Loader2 className="w-5 h-5 text-spotify-base animate-spin" />
              </div>
            )}
          </div>

          <div className="flex flex-col justify-center max-w-[180px]">
            <div className="flex items-center gap-2">
              <span
                onClick={() => setIsExpanded(true)}
                className={`text-sm font-extrabold hover:underline line-clamp-1 cursor-pointer ${textColor}`}
                title="Click to view full screen Now Playing"
              >
                {currentTrack.name}
              </span>
              {isPlaying && (
                <div className="flex items-end gap-0.5 h-4 flex-shrink-0 mb-0.5">
                  <span className="w-0.5 bg-spotify-base rounded-full equalizer-bar-1" />
                  <span className="w-0.5 bg-spotify-base rounded-full equalizer-bar-2" />
                  <span className="w-0.5 bg-spotify-base rounded-full equalizer-bar-3" />
                  <span className="w-0.5 bg-spotify-base rounded-full equalizer-bar-4" />
                </div>
              )}
            </div>
            <span className={`text-xs hover:underline line-clamp-1 cursor-pointer ${subTextColor}`}>
              {currentTrack.artists?.map((a) => a.name).join(', ')}
            </span>
          </div>

          <button
            onClick={() => toggleLikeTrack(currentTrack)}
            className={`ml-2 transition-transform hover:scale-125 ${
              isLiked(currentTrack?.id) ? 'text-spotify-base' : `${subTextColor} hover:${textColor}`
            }`}
            title={isLiked(currentTrack?.id) ? 'Remove from Liked Songs' : 'Save to Liked Songs'}
          >
            <Heart
              size={18}
              fill={isLiked(currentTrack?.id) ? '#1db954' : 'none'}
              className={isLiked(currentTrack?.id) ? 'animate-pulse' : ''}
            />
          </button>
        </div>

        {/* Center: Controls & Progress Bar */}
        <div className="flex flex-col items-center justify-center w-1/3 max-w-[722px]">
          <div className="flex items-center gap-6 mb-1">
            <button onClick={playPrevious} className={`${controlBtnColor} transition-all hover:scale-110`} title="Previous">
              <SkipBack size={20} fill="currentColor" />
            </button>

            <button
              className="w-9 h-9 flex items-center justify-center rounded-full hover:scale-110 transition-all shadow-lg bg-spotify-base text-black hover:bg-spotify-highlight"
              onClick={() => setIsPlaying(!isPlaying)}
              title={isPlaying ? 'Pause' : 'Play'}
            >
              {isLoading ? (
                <Loader2 size={18} className="animate-spin text-black" />
              ) : isPlaying ? (
                <Pause size={18} fill="black" className="text-black" />
              ) : (
                <Play size={18} fill="black" className="text-black ml-0.5" />
              )}
            </button>

            <button onClick={playNext} className={`${controlBtnColor} transition-all hover:scale-110`} title="Next">
              <SkipForward size={20} fill="currentColor" />
            </button>
          </div>

          {/* Progress Bar */}
          <div className="flex items-center gap-2 w-full max-w-[500px]">
            <span className={`text-xs min-w-[40px] text-right font-semibold ${subTextColor}`}>
              {formatTime(duration * played)}
            </span>

            <div className="relative w-full h-1.5 group flex items-center cursor-pointer">
              <input
                type="range"
                min="0"
                max="1"
                step="0.001"
                value={played}
                onChange={handleSeekChange}
                className="absolute w-full h-full opacity-0 cursor-pointer z-10"
              />
              <div className={`w-full h-1.5 rounded-full overflow-hidden ${theme === 'light' ? 'bg-gray-300' : 'bg-[#4d4d4d]'}`}>
                <div
                  className="h-full bg-spotify-base transition-all duration-75"
                  style={{ width: `${played * 100}%` }}
                />
              </div>
              <div
                className="absolute h-3.5 w-3.5 bg-spotify-base rounded-full opacity-0 group-hover:opacity-100 shadow-md pointer-events-none transition-opacity"
                style={{ left: `calc(${played * 100}% - 7px)` }}
              />
            </div>

            <span className={`text-xs min-w-[40px] font-semibold ${subTextColor}`}>{formatTime(duration)}</span>
          </div>
        </div>

        {/* Right: Volume & Expand Full Screen Button */}
        <div className="flex items-center justify-end gap-4 w-1/3 min-w-[200px]">
          <div className="flex items-center gap-2 w-24 group relative">
            <button className={`${controlBtnColor} transition-colors`} title="Volume">
              <Volume2 size={16} />
            </button>
            <input
              type="range"
              min="0"
              max="1"
              step="0.01"
              value={volume}
              onChange={handleVolumeChange}
              className="absolute right-0 w-16 h-1 opacity-0 cursor-pointer z-10"
            />
            <div className={`w-16 h-1 rounded-full overflow-hidden ${theme === 'light' ? 'bg-gray-300' : 'bg-[#4d4d4d]'}`}>
              <div
                className="h-full bg-spotify-base"
                style={{ width: `${volume * 100}%` }}
              />
            </div>
          </div>

          <button
            onClick={() => setIsExpanded(true)}
            className={`${controlBtnColor} transition-all hover:scale-110 p-1.5 rounded-full hover:bg-white/10 flex items-center gap-1`}
            title="Expand to Full Screen View"
          >
            <Maximize2 size={16} />
          </button>
        </div>
      </div>
    </>
  );
};

export default MusicPlayer;
