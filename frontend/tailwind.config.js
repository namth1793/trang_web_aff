/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        shopee: {
          orange: '#EE4D2D',
          light: '#FF7337',
          dark: '#CC3D20',
        }
      }
    },
  },
  plugins: [],
};
