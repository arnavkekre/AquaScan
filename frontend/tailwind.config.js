/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        crimson: {
          DEFAULT: '#e11d48',
          hover: '#be123c',
          dark: '#9f1239',
          light: '#fb7185',
        },
        dark: {
          DEFAULT: '#121212',
          surface: '#1a1a1a',
          elevated: '#242424',
          border: 'rgba(255, 255, 255, 0.08)',
        },
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
      borderRadius: {
        '40px': '40px',
        '2.5rem': '2.5rem',
        '3rem': '3rem',
      },
      fontFamily: {
        calsans: ['Cal Sans', 'sans-serif'],
        poppins: ['Poppins', 'sans-serif'],
        mono: ['JetBrains Mono', 'Menlo', 'Monaco', 'Courier New', 'monospace'],
        sans: ['Poppins', 'Inter', 'system-ui', '-apple-system', 'sans-serif'],
      },
      transitionTimingFunction: {
        luxury: 'cubic-bezier(0.4, 0, 0.2, 1)',
        'bounce-soft': 'cubic-bezier(0.34, 1.56, 0.64, 1)',
        'smooth': 'cubic-bezier(0.25, 0.46, 0.45, 0.94)',
      },
      animation: {
        'pulse-slow':     'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'sonar-ping':     'sonarPing 2s cubic-bezier(0, 0, 0.2, 1) infinite',
        'waterfall':      'waterfallScroll 10s linear infinite',
        'fade-up':        'fadeUp 0.6s ease forwards',
        'fade-in':        'fadeIn 0.5s ease forwards',
        'slide-left':     'slideLeft 0.5s ease forwards',
        'slide-right':    'slideRight 0.5s ease forwards',
        'float':          'float 6s ease-in-out infinite',
        'float-slow':     'float 9s ease-in-out infinite',
        'shimmer':        'shimmer 2.5s linear infinite',
        'glow-pulse':     'glowPulse 2.5s ease-in-out infinite',
        'sonar-sweep':    'sonarSweep 3s ease-in-out infinite',
        'border-glow':    'borderGlow 2s ease-in-out infinite alternate',
        'typing-cursor':  'typingCursor 1.1s step-end infinite',
        'scale-in':       'scaleIn 0.4s cubic-bezier(0.34, 1.56, 0.64, 1) forwards',
        'ripple':         'ripple 0.6s ease-out forwards',
        'wave-move':      'waveMove 8s linear infinite',
        'particle-drift': 'particleDrift 12s linear infinite',
        'counter-reveal': 'counterReveal 0.8s cubic-bezier(0.22, 1, 0.36, 1) forwards',
        'scan-line':      'scanLine 4s linear infinite',
      },
      keyframes: {
        sonarPing: {
          '75%, 100%': { transform: 'scale(2.2)', opacity: '0' },
        },
        waterfallScroll: {
          '0%':   { transform: 'translateY(0%)' },
          '100%': { transform: 'translateY(50%)' },
        },
        fadeUp: {
          '0%':   { opacity: '0', transform: 'translateY(28px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        fadeIn: {
          '0%':   { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideLeft: {
          '0%':   { opacity: '0', transform: 'translateX(40px)' },
          '100%': { opacity: '1', transform: 'translateX(0)' },
        },
        slideRight: {
          '0%':   { opacity: '0', transform: 'translateX(-40px)' },
          '100%': { opacity: '1', transform: 'translateX(0)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%':      { transform: 'translateY(-14px)' },
        },
        shimmer: {
          '0%':   { backgroundPosition: '-700px 0' },
          '100%': { backgroundPosition: '700px 0' },
        },
        glowPulse: {
          '0%, 100%': { boxShadow: '0 0 10px 2px rgba(0, 240, 255, 0.15)' },
          '50%':      { boxShadow: '0 0 28px 6px rgba(0, 240, 255, 0.40)' },
        },
        sonarSweep: {
          '0%':   { transform: 'scale(0.8)', opacity: '0.8' },
          '50%':  { transform: 'scale(1.15)', opacity: '0.3' },
          '100%': { transform: 'scale(0.8)', opacity: '0.8' },
        },
        borderGlow: {
          '0%':   { borderColor: 'rgba(0,240,255,0.15)' },
          '100%': { borderColor: 'rgba(0,240,255,0.55)' },
        },
        typingCursor: {
          '0%, 100%': { opacity: '1' },
          '50%':      { opacity: '0' },
        },
        scaleIn: {
          '0%':   { opacity: '0', transform: 'scale(0.88)' },
          '100%': { opacity: '1', transform: 'scale(1)' },
        },
        ripple: {
          '0%':   { transform: 'scale(0)', opacity: '0.6' },
          '100%': { transform: 'scale(4)', opacity: '0' },
        },
        waveMove: {
          '0%':   { transform: 'translateX(0)' },
          '100%': { transform: 'translateX(-50%)' },
        },
        particleDrift: {
          '0%':   { transform: 'translateY(100vh) translateX(0px)', opacity: '0' },
          '10%':  { opacity: '1' },
          '90%':  { opacity: '0.6' },
          '100%': { transform: 'translateY(-100px) translateX(30px)', opacity: '0' },
        },
        counterReveal: {
          '0%':   { opacity: '0', transform: 'translateY(12px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        scanLine: {
          '0%':   { top: '-2px' },
          '100%': { top: '100%' },
        },
      },
      transitionDuration: {
        '400': '400ms',
        '600': '600ms',
        '800': '800ms',
      },
      transitionTimingFunction: {
        'bounce-soft': 'cubic-bezier(0.34, 1.56, 0.64, 1)',
        'smooth': 'cubic-bezier(0.25, 0.46, 0.45, 0.94)',
      },
    },
  },
  plugins: [],
}
