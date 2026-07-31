import axios from 'axios';

const spotifyApi = axios.create({
  baseURL: 'https://api.spotify.com/v1',
});

export const setAccessToken = (token) => {
  if (token) {
    spotifyApi.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  } else {
    delete spotifyApi.defaults.headers.common['Authorization'];
  }
};

export const getFeaturedPlaylists = async () => {
  try {
    const response = await spotifyApi.get('/browse/featured-playlists');
    return response.data;
  } catch (error) {
    console.error('Error fetching featured playlists from Spotify', error);
    return null;
  }
};

// Fallback search using iTunes Public API when Spotify token is missing or API errors out
const searchITunesFallback = async (query) => {
  try {
    const res = await axios.get(`https://itunes.apple.com/search`, {
      params: {
        term: query,
        country: 'IN',
        entity: 'song',
        limit: 25,
      },
    });

    const items = res.data.results || [];

    const tracks = items.map((item) => ({
      id: String(item.trackId || Math.random()),
      name: item.trackName,
      artists: [{ name: item.artistName || 'Unknown Artist' }],
      album: {
        name: item.collectionName || 'Single',
        images: [
          {
            url: item.artworkUrl100
              ? item.artworkUrl100.replace('100x100bb', '600x600bb')
              : 'https://images.unsplash.com/photo-1614613535308-eb5fbd3d2c17?auto=format&fit=crop&q=80&w=300&h=300',
          },
        ],
      },
      preview_url: item.previewUrl,
      duration_ms: item.trackTimeMillis || 180000,
    }));

    // Generate unique artists list
    const artistNames = [...new Set(items.map((i) => i.artistName))].filter(Boolean);
    const artists = artistNames.map((name, idx) => ({
      id: `artist-${idx}`,
      name,
      images: [
        {
          url:
            items.find((i) => i.artistName === name)?.artworkUrl100?.replace('100x100bb', '600x600bb') ||
            'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&q=80&w=300&h=300',
        },
      ],
    }));

    // Generate unique albums list
    const albumNames = [...new Set(items.map((i) => i.collectionName))].filter(Boolean);
    const albums = albumNames.map((albumName, idx) => {
      const match = items.find((i) => i.collectionName === albumName);
      return {
        id: `album-${idx}`,
        name: albumName,
        artists: [{ name: match?.artistName || 'Various' }],
        images: [
          {
            url:
              match?.artworkUrl100?.replace('100x100bb', '600x600bb') ||
              'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&q=80&w=300&h=300',
          },
        ],
      };
    });

    return {
      tracks: { items: tracks },
      artists: { items: artists },
      albums: { items: albums },
    };
  } catch (err) {
    console.error('iTunes fallback search error:', err);
    return null;
  }
};

export const searchSpotify = async (query, type = 'track,artist,album') => {
  if (!query || !query.trim()) return null;

  try {
    const hasToken = Boolean(localStorage.getItem('spotify_token'));
    if (hasToken) {
      const response = await spotifyApi.get('/search', {
        params: {
          q: query,
          type: type,
          limit: 20,
        },
      });

      if (response.data && response.data.tracks && response.data.tracks.items.length > 0) {
        return response.data;
      }
    }
  } catch (error) {
    console.warn('Spotify search failed or unauthenticated, falling back to iTunes API...', error?.message);
  }

  // Fallback to iTunes API if Spotify call fails or returns empty
  return await searchITunesFallback(query);
};

export default spotifyApi;
