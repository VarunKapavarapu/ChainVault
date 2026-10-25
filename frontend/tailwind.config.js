/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        vault: {
          950: '#04060a',
          900: '#080c14',
          850: '#0c1220',
          800: '#11192b',
          750: '#17223b',
          700: '#1f2d4d',
          600: '#2b3e66',
          500: '#3a5280',
        },
        cyber: {
          cyan:    '#38bdf8',
          blue:    '#3b82f6',
          indigo:  '#6366f1',
          emerald: '#10b981',
          amber:   '#f59e0b',
          rose:    '#f43f5e',
          violet:  '#8b5cf6',
        }
      },
      fontFamily: {
        sans:    ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
        mono:    ['JetBrains Mono', 'Fira Code', 'Cascadia Code', 'monospace'],
        display: ['Outfit', 'Inter', 'sans-serif'],
      },
      spacing: {
        'navbar': '56px',
      },
      height: {
        'navbar': '56px',
        'screen-nav': 'calc(100vh - 56px)',
      },
      minHeight: {
        'screen-nav': 'calc(100vh - 56px)',
      },
      animation: {
        'pulse-subtle':   'pulse 4s cubic-bezier(0.4,0,0.6,1) infinite',
        'float-slow':     'float 6s ease-in-out infinite',
        'fade-in':        'fadeIn 0.25s ease-out',
        'slide-up':       'slideUp 0.3s ease-out',
        'slide-in-right': 'slideInRight 0.25s ease-out',
        'glow-pulse':     'glowPulse 2s ease-in-out infinite',
        'shimmer':        'shimmer 2s linear infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%':       { transform: 'translateY(-6px)' },
        },
        fadeIn: {
          from: { opacity: 0 },
          to:   { opacity: 1 },
        },
        slideUp: {
          from: { opacity: 0, transform: 'translateY(12px)' },
          to:   { opacity: 1, transform: 'translateY(0)' },
        },
        slideInRight: {
          from: { opacity: 0, transform: 'translateX(-12px)' },
          to:   { opacity: 1, transform: 'translateX(0)' },
        },
        glowPulse: {
          '0%, 100%': { boxShadow: '0 0 15px rgba(56,189,248,0.2)' },
          '50%':       { boxShadow: '0 0 30px rgba(56,189,248,0.4)' },
        },
        shimmer: {
          '0%':   { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition:  '200% 0' },
        },
      },
      boxShadow: {
        'cyan-glow':   '0 0 20px rgba(56,189,248,0.2), 0 4px 20px rgba(0,0,0,0.3)',
        'panel':       '0 4px 24px rgba(0,0,0,0.4)',
        'modal':       '0 8px 40px rgba(0,0,0,0.6)',
      },
      backdropBlur: {
        '2xl': '40px',
      },
    },
  },
  plugins: [],
}
