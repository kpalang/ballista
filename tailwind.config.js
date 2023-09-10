/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{vue,js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'connection-light': '#f5f5f5',
        'connection-dark': '#444444',
        'input-dark': '#595959',
        'input-placeholder-dark': '#a1a1a1',
        'listing-dark': '#343434',
      }
    },
  },
  plugins: [],
}
