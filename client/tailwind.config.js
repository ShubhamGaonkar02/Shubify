/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        spotify: {
          green: '#1DB954',
          dark: '#121212',
          light: '#282828',
          base: '#1db954',
          highlight: '#1ed760'
        }
      }
    },
  },
  plugins: [],
}
