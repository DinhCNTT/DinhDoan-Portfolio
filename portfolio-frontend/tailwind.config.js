/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        cyber: {
          dark: '#09090b', // Zinc dark
          slate: '#0f172a', // Slate dark
          light: '#f8fafc', // Light text
          muted: '#94a3b8', // Muted text
          neon: '#a855f7', // Neon purple
        }
      },
      fontFamily: {
        sans: ['Outfit', 'Inter', 'sans-serif'],
      }
    },
  },
  plugins: [],
}
