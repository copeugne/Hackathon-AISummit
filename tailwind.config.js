/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#2B6CB0',
          light: '#4299E1',
          dark: '#2C5282',
        },
        success: {
          DEFAULT: '#38A169',
          light: '#48BB78',
          dark: '#2F855A',
        },
        accent: {
          DEFAULT: '#ED8936',
          light: '#F6AD55',
          dark: '#C05621',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      borderRadius: {
        DEFAULT: '8px',
      },
      boxShadow: {
        subtle: '0 2px 4px rgba(0,0,0,0.05)',
      },
    },
  },
  plugins: [],
};