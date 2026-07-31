import express from 'express';
import cors from 'cors';
import axios from 'axios';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5001;

app.use(cors());
app.use(express.json());

const SPOTIFY_CLIENT_ID = process.env.SPOTIFY_CLIENT_ID;
const SPOTIFY_CLIENT_SECRET = process.env.SPOTIFY_CLIENT_SECRET;
const REDIRECT_URI = process.env.REDIRECT_URI || 'http://127.0.0.1:5001/callback';
const FRONTEND_URI = process.env.FRONTEND_URI || 'http://localhost:5173';

// Setup basic route
app.get('/', (req, res) => {
  res.send('Spotify Clone Backend is running.');
});

// Spotify Login Route
app.get('/login', (req, res) => {
  const scope = 'streaming user-read-email user-read-private user-library-read user-library-modify user-read-playback-state user-modify-playback-state user-top-read user-read-recently-played playlist-read-private playlist-read-collaborative playlist-modify-public playlist-modify-private';
  
  const queryParams = new URLSearchParams({
    response_type: 'code',
    client_id: SPOTIFY_CLIENT_ID,
    scope: scope,
    redirect_uri: REDIRECT_URI,
  });

  res.redirect(`https://accounts.spotify.com/authorize?${queryParams.toString()}`);
});

// Spotify Callback Route
app.get('/callback', async (req, res) => {
  const code = req.query.code || null;

  try {
    const response = await axios({
      method: 'post',
      url: 'https://accounts.spotify.com/api/token',
      data: new URLSearchParams({
        grant_type: 'authorization_code',
        code: code,
        redirect_uri: REDIRECT_URI,
      }).toString(),
      headers: {
        'content-type': 'application/x-www-form-urlencoded',
        Authorization: `Basic ${Buffer.from(`${SPOTIFY_CLIENT_ID}:${SPOTIFY_CLIENT_SECRET}`).toString('base64')}`,
      },
    });

    const { access_token, refresh_token, expires_in } = response.data;
    
    // Redirect back to frontend with tokens in URL
    const queryParams = new URLSearchParams({
      access_token,
      refresh_token,
      expires_in
    });

    res.redirect(`${FRONTEND_URI}/login?${queryParams.toString()}`);
  } catch (error) {
    console.error('Error in /callback:', error.response?.data || error.message);
    res.redirect(`${FRONTEND_URI}/login?error=invalid_token`);
  }
});

// Refresh Token Route
app.get('/refresh_token', async (req, res) => {
  const { refresh_token } = req.query;

  try {
    const response = await axios({
      method: 'post',
      url: 'https://accounts.spotify.com/api/token',
      data: new URLSearchParams({
        grant_type: 'refresh_token',
        refresh_token: refresh_token,
      }).toString(),
      headers: {
        'content-type': 'application/x-www-form-urlencoded',
        Authorization: `Basic ${Buffer.from(`${SPOTIFY_CLIENT_ID}:${SPOTIFY_CLIENT_SECRET}`).toString('base64')}`,
      },
    });

    res.send(response.data);
  } catch (error) {
    res.status(400).send(error);
  }
});

app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
