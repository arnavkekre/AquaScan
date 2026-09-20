/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        ocean: {
          950: '#030712',
          900: '#070E1E',
          850: '#0B152B',
          800: '#0F1E3D',
          700: '#182C54',
          600: '#25447E',
        },
        sonar: {
          cyan: '#00F0FF',
          teal: '#0DF5C4',
          emerald: '#10B981',
          amber: '#F59E0B',
          coral: '#EF4444',
          purple: '#8B5CF6'
        }
      },
      fontFamily: {
        mono: ['JetBrains Mono', 'Menlo', 'Monaco', 'Courier New', 'monospace'],
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
      },
      animation: {
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'sonar-ping': 'sonarPing 2s cubic-bezier(0, 0, 0.2, 1) infinite',
        'waterfall': 'waterfallScroll 10s linear infinite',
      },
      keyframes: {
        sonarPing: {
          '75%, 100%': {
            transform: 'scale(2.2)',
            opacity: '0',
          },
        },
        waterfallScroll: {
          '0%': { transform: 'translateY(0%)' },
          '100%': { transform: 'translateY(50%)' },
        }
      }
    },
  },
  plugins: [],
}
