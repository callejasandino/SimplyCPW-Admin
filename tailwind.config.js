/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './index.html',
    './src/**/*.{vue,js}',
  ],
  theme: {
    extend: {
      colors: {
        // Primary colors
        'primary': {
          DEFAULT: '#003f8a', // Deep Blue
          light: '#1a5ba6',
          dark: '#002d63',
        },
        'secondary': {
          DEFAULT: '#48b0f7', // Sky Blue
          light: '#7ac6f9',
          dark: '#1a9cf5',
        },
        // Secondary colors
        'white': '#ffffff', // Pure White
        'light-gray': '#e6e6e6', // Light Gray
        // Accent colors
        'charcoal': {
          DEFAULT: '#2c2c2c', // Dark Charcoal
          light: '#444444',
          dark: '#1a1a1a',
        },
        'lime': {
          DEFAULT: '#aaff00', // Bright Lime/Neon Green
          light: '#c4ff4d',
          dark: '#88cc00',
        },
        // Optional branding add-ons
        'orange': {
          DEFAULT: '#f77f00', // Rust Remover/Before-After
          light: '#ff9a33',
          dark: '#cc6900',
        },
        'green': {
          DEFAULT: '#4caf50', // Eco-Friendly
          light: '#6ec071',
          dark: '#3d8c40',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        card: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
      },
      animation: {
        'water-ripple': 'water-ripple 1.5s infinite ease-out',
      },
      keyframes: {
        'water-ripple': {
          '0%': { transform: 'scale(0.95)', opacity: '1' },
          '100%': { transform: 'scale(1.2)', opacity: '0' },
        },
      },
    },
  },
  plugins: [],
}