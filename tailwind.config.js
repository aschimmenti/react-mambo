/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
    "./public/index.html"
  ],
  theme: {
    extend: {
      colors: {
        olympic: {
          blue: '#0085C7',
          yellow: '#FFD700',
          black: '#000000',
          green: '#009F3D',
          red: '#DF0024'
        }
      }
    }
  },
  plugins: [],
}