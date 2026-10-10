/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#4F46E5',
          dark: '#4338CA',
          light: '#EEF2FF',
          hover: '#3730A3'
        },
        secondary: {
          DEFAULT: '#6366F1',
          light: '#E0E7FF'
        },
        success: '#16A34A',
        warning: '#F59E0B',
        danger: '#DC2626',
        surface: '#F8FAFC',
        textDark: '#0F172A',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
      }
    },
  },
  plugins: [],
}
