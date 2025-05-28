/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{vue,js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#4A90E2',
          light: '#D6F1FF',
          dark: '#3A73B4',
        },
        secondary: {
          DEFAULT: '#A7E9EB',
          light: '#D6F8F9',
          dark: '#7BCBCD',
        },
        neutral: {
          DEFAULT: '#4A4A4A',
          light: '#EDEDED',
          dark: '#2A2A2A',
        },
        success: '#4CAF50',
        warning: '#F77F00',
        danger: '#DC2626',
        info: '#48B0F7',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        card: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
      },
    },
  },
  plugins: [],
}