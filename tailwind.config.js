/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        plum: {
          50: '#faf5f7',
          100: '#f3e8ee',
          200: '#e9d0dc',
          300: '#d9a9c0',
          400: '#c47a9d',
          500: '#a84d7a',
          600: '#8f3a63',
          700: '#762e50',
          800: '#632843',
          900: '#54243a',
          950: '#32111f'
        },
        gold: {
          50: '#fbf8f1',
          100: '#f5eedc',
          200: '#eadcba',
          300: '#dbc38e',
          400: '#cba662',
          500: '#b88d45',
          600: '#9e7139',
          700: '#7f5731',
          800: '#6a472d',
          900: '#5a3c29',
          950: '#331f14'
        },
        cream: {
          50: '#fdfcfa',
          100: '#f9f6f0',
          200: '#f2ebe0',
          300: '#e8dcc9',
          400: '#d9c5a8',
          500: '#c9ab87'
        }
      },
      fontFamily: {
        display: ['Playfair Display', 'serif'],
        sans: ['Inter', 'system-ui', 'sans-serif']
      }
    },
  },
  plugins: [],
}
