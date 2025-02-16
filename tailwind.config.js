/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        urgency: {
          critical: {
            DEFAULT: '#FF3B3B',
            light: '#FFE5E5',
            dark: '#CC2F2F'
          },
          high: {
            DEFAULT: '#FF8C42',
            light: '#FFE8D9',
            dark: '#CC7035'
          },
          medium: {
            DEFAULT: '#FFD93D',
            light: '#FFF8D9',
            dark: '#CCB031'
          },
          low: {
            DEFAULT: '#4CAF50',
            light: '#E8F5E9',
            dark: '#388E3C'
          },
          base: {
            DEFAULT: '#B8D8F5',
            light: '#EDF5FC',
            dark: '#8FB6D9'
          }
        },
        samu: {
          DEFAULT: '#003399',
          light: '#B3D1FF',
          dark: '#002266',
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