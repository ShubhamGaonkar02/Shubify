// Synchronized / time-coded lyrics database for popular tracks

export const trackLyricsMap = {
  'lungi dance': [
    { time: 0, text: '🎵 (High energy beat intro...)' },
    { time: 5, text: 'Moochhon ko thoda round ghumake' },
    { time: 10, text: 'Anna ke jaisa chashma lagake' },
    { time: 14, text: 'All the Rajini fans... Thalaiva!' },
    { time: 18, text: 'Don\'t miss the chance!' },
    { time: 22, text: 'Lungi dance, lungi dance, lungi dance!' },
    { time: 26, text: 'Lungi dance, lungi dance, lungi dance!' },
    { time: 30, text: 'Jisko jo bhi hai kehna kehne do' },
    { time: 35, text: 'Apni aisi taisi me rehne do' },
    { time: 40, text: 'Lungi dance, lungi dance, lungi dance!' },
    { time: 45, text: '🔥 All the Rajini fans... Lungi Dance!' },
  ],
  'titli': [
    { time: 0, text: '🎶 (Soulful acoustic guitar intro)' },
    { time: 6, text: 'Banjaara banjaara dil mera banjaara' },
    { time: 12, text: 'Dekha jabse chehra tera main toh dil haara' },
    { time: 18, text: 'Tujh me hi raatein meri, tujh me hi din mere' },
    { time: 25, text: 'Gehra hua ye silsila...' },
    { time: 30, text: 'Kashmakash mein hai raatein meri' },
    { time: 36, text: 'Titli udi udi bas tu hi tu dikhe' },
    { time: 42, text: '💖 Dil ki ye batein saari tujhse kehne lage' },
  ],
  'kaun tujhe': [
    { time: 0, text: '🎹 (Soft piano melody)' },
    { time: 5, text: 'Tu aata hai seene mein' },
    { time: 10, text: 'Jab jab saansein bharti hoon' },
    { time: 15, text: 'Tere dil ki galliyon se' },
    { time: 20, text: 'Main har roz guzarti hoon' },
    { time: 26, text: 'Hawa ke jaise chalta hai tu' },
    { time: 32, text: 'Main ret jaisi udti hoon' },
    { time: 38, text: 'Kaun tujhe yun pyar karega' },
    { time: 44, text: 'Jaise main karti hoon... ✨' },
  ],
  'tum hi ho': [
    { time: 0, text: '🎹 (Arijit Singh Piano Intro)' },
    { time: 6, text: 'Hum tere bin ab reh nahi sakte' },
    { time: 12, text: 'Tere bina kya wajood mera' },
    { time: 18, text: 'Tujhse juda agar ho jayenge' },
    { time: 24, text: 'Toh khud se hi ho jayenge judaa' },
    { time: 30, text: 'Kyunki tum hi ho, ab tum hi ho' },
    { time: 36, text: 'Zindagi ab tum hi ho...' },
    { time: 42, text: 'Chain bhi, mera dard bhi' },
    { time: 48, text: 'Meri aashiqui ab tum hi ho 💖' },
  ],
  'kesariya': [
    { time: 0, text: '🎸 (Kesariya Acoustic Riff)' },
    { time: 5, text: 'Mujhko kitna pyar hai tumse' },
    { time: 10, text: 'Ye jaan lo tum sanam' },
    { time: 15, text: 'Kesar tera rang hai piya' },
    { time: 20, text: 'Aankhon mein tera nasha' },
    { time: 25, text: 'Kesariya tera ishq hai piya' },
    { time: 30, text: 'Rang jaaun jo main haath lagaun' },
    { time: 36, text: 'Din beete saara teri fikr mein' },
    { time: 42, text: 'Raanjhan heere sabse pyaara ✨' },
  ],
  'bekhayali': [
    { time: 0, text: '🥁 (Kabir Singh Rock Beats)' },
    { time: 6, text: 'Bekhayali mein bhi tera hi khayal aaye' },
    { time: 12, text: 'Kyun tarrasta hai dil mera jab tu na aaye' },
    { time: 18, text: 'Raatein meri saari teri hi raahon mein' },
    { time: 25, text: 'Nazar aao tum har lamha khwabon mein' },
    { time: 32, text: 'Kyun dhoondta hai ye dil tumhe har jagah' },
    { time: 40, text: '🔥 Bekhayali mein tera hi khayal aaye...' },
  ],
};

// Fallback lyric generator if specific track is not mapped in preset
export const getLyricsForTrack = (trackName, artistName) => {
  if (!trackName) return [];

  const key = trackName.toLowerCase();
  for (const [name, lyrics] of Object.entries(trackLyricsMap)) {
    if (key.includes(name)) {
      return lyrics;
    }
  }

  // Generic fallback time-coded lyrics
  const artist = artistName || 'Artist';
  return [
    { time: 0, text: `🎵 Listening to ${trackName}` },
    { time: 5, text: `By ${artist} on Shubify` },
    { time: 10, text: 'Suno ye mitha sa taraana...' },
    { time: 16, text: 'Har dil ko chhoo jaaye' },
    { time: 22, text: 'Music that fills your soul with joy' },
    { time: 28, text: 'Feel the rhythm, feel the beat ⚡' },
    { time: 35, text: 'Raaton mein bhi ye aawaaz aaye' },
    { time: 42, text: 'Sing along with Shubify Ad-Free Music 💖' },
    { time: 50, text: '🎶 (Instrumental Solo & Melodic Beats)' },
    { time: 60, text: 'Har pal mein tumhara saath nibhaye' },
    { time: 70, text: 'Ad-Free streaming for endless happiness ✨' },
  ];
};
