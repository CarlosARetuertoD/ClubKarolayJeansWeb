import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './src/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        mocha: {
          50: '#fdf8f3',
          100: '#f5ead9',
          200: '#e8d0b3',
          300: '#d4ad82',
          400: '#c08a55',
          500: '#9b6d53',
          600: '#7a5240',
          700: '#6b4725',
          800: '#4a3019',
          900: '#201e1e',
          950: '#110a06',
        },
        gold: {
          DEFAULT: '#ddb153',
          light: '#e8c778',
          dark: '#b8922f',
        },
        dark: {
          DEFAULT: '#201e1e',
          card: '#252626',
          deep: '#181515',
          surface: '#0b0908',
        },
      },
      fontFamily: {
        sans: ['Roboto', 'system-ui', 'sans-serif'],
        heading: ['Montserrat', 'system-ui', 'sans-serif'],
      },
      animation: {
        'pulse-glow': 'pulseGlow 1.6s ease-in-out infinite',
        'fade-in-up': 'fadeInUp 1s cubic-bezier(0.16, 1, 0.3, 1) both',
        'fade-in-down': 'fadeInDown 1s cubic-bezier(0.16, 1, 0.3, 1) both',
        'fade-in': 'fadeIn 1s cubic-bezier(0.16, 1, 0.3, 1) both',
        'slide-in-left': 'slideInLeft 1s cubic-bezier(0.16, 1, 0.3, 1) both',
        'slide-in-right': 'slideInRight 1s cubic-bezier(0.16, 1, 0.3, 1) both',
        'scale-in': 'scaleIn 1s cubic-bezier(0.16, 1, 0.3, 1) both',
      },
      keyframes: {
        pulseGlow: {
          '0%, 100%': { transform: 'translateY(0)', boxShadow: '0 0 0 rgba(221, 177, 83, 0)' },
          '50%': { transform: 'translateY(-1px)', boxShadow: '0 0 18px rgba(221, 177, 83, 0.35)' },
        },
        fadeInUp: {
          '0%': { opacity: '0', transform: 'translateY(30px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        fadeInDown: {
          '0%': { opacity: '0', transform: 'translateY(-20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideInLeft: {
          '0%': { opacity: '0', transform: 'translateX(-40px)' },
          '100%': { opacity: '1', transform: 'translateX(0)' },
        },
        slideInRight: {
          '0%': { opacity: '0', transform: 'translateX(40px)' },
          '100%': { opacity: '1', transform: 'translateX(0)' },
        },
        scaleIn: {
          '0%': { opacity: '0', transform: 'scale(0.9)' },
          '100%': { opacity: '1', transform: 'scale(1)' },
        },
      },
    },
  },
  plugins: [],
}

export default config
