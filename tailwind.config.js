/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#EDF3FF',
          100: '#DBEAFE',
          200: '#BFDBFE',
          300: '#93C5FD',
          400: '#6F9EFF',
          500: '#4169E1',
          600: '#2949B8',
          700: '#1E3A9A',
          800: '#1F3485',
          900: '#172554',
        },
        teal: {
          50: '#CCFBF1',
          100: '#99F6E4',
          300: '#5EEAD4',
          500: '#0D9488',
          600: '#0F766E',
          700: '#0F5E57',
        },
        coral: {
          50: '#FFE4E6',
          100: '#FFD6D8',
          300: '#FCA5A5',
          500: '#F97373',
          600: '#EF4444',
          700: '#DC2626',
        },
        lavender: {
          50: '#EDE9FE',
          100: '#DDD6FE',
          300: '#C4B5FD',
          500: '#A78BFA',
          600: '#7C3AED',
        },
        gold: {
          50: '#FEF3C7',
          300: '#FCD34D',
          500: '#FBBF24',
          600: '#D97706',
        },
        surface: {
          DEFAULT: '#FFFFFF',
          muted: '#F5F7FC',
          subtle: '#EDF3FF',
        },
        border: {
          light: '#E2E8F0',
        }
      },
      fontFamily: {
        sans: ['Plus Jakarta Sans', 'Inter', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'Menlo', 'monospace'],
      },
      boxShadow: {
        'xs': '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
        'card': '0 1px 3px 0 rgba(15, 23, 42, 0.07), 0 12px 30px -18px rgba(51, 65, 85, 0.18)',
        'card-hover': '0 18px 36px -18px rgba(65, 105, 225, 0.18), 0 14px 28px -18px rgba(15, 23, 42, 0.12)',
        'modal': '0 24px 60px -16px rgba(15, 23, 42, 0.18), 0 12px 28px -14px rgba(15, 23, 42, 0.12)',
        'hero': '0 18px 40px -24px rgba(65, 105, 225, 0.28)',
        'button': '0 12px 22px -16px rgba(65, 105, 225, 0.48)',
        'button-teal': '0 12px 22px -16px rgba(13, 148, 136, 0.45)',
        'button-coral': '0 12px 22px -16px rgba(249, 115, 115, 0.42)',
        'soft': '0 24px 38px -24px rgba(37, 99, 235, 0.18)',
      },
      backgroundImage: {
        'hero-gradient': 'linear-gradient(135deg, #EDF3FF 0%, #F2EBFF 52%, #E8F8F5 100%)',
        'card-gradient': 'linear-gradient(145deg, #FFFFFF 0%, #F8FAFF 100%)',
        'match-gradient': 'linear-gradient(135deg, #EDF3FF 0%, #EDE9FE 100%)',
      }
    },
  },
  plugins: [],
}
