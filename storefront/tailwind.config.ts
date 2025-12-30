import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Open Sans', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
        heading: ['Gilroy', 'Open Sans', 'sans-serif'],
      },
      colors: {
        // Primary - Orange (Induxter theme color)
        primary: {
          50: '#FFF5F0',
          100: '#FFE8DC',
          200: '#FFD0B8',
          300: '#FFB08A',
          400: '#FF8A52',
          500: '#F9580E',  // Main orange - Induxter theme
          600: '#E04A08',
          700: '#B83D06',
          800: '#8F3005',
          900: '#6B2404',
        },
        // Secondary - Dark gray tones (Induxter heading color)
        secondary: {
          50: '#F9FAFB',
          100: '#F3F4F6',
          200: '#E5E7EB',
          300: '#D1D5DB',
          400: '#9CA3AF',
          500: '#626262',  // Induxter text color
          600: '#4B5563',
          700: '#282828',  // Induxter heading color
          800: '#1F2937',
          900: '#111827',
        },
        // Neutral - Light gray/white tones
        neutral: {
          50: '#F9F9F9',   // Induxter light bg
          100: '#F5F5F5',
          200: '#E5E5E5',
          300: '#D4D4D4',
          400: '#A3A3A3',
          500: '#737373',
          600: '#525252',
          700: '#404040',
          750: '#2E2E2E',
          800: '#262626',
          900: '#171717',
        },
        // Status colors
        success: '#27ae60',
        warning: '#F9580E',
        danger: '#E61901',
        info: '#3498db',
        // Accent colors
        orange: '#F9580E',
        green: '#70E67F',
        red: '#E61901',
      },
      spacing: {
        'xs': '4px',
        'sm': '8px',
        'md': '16px',
        'lg': '24px',
        'xl': '32px',
        '2xl': '48px',
      },
      fontSize: {
        'xs': ['12px', { lineHeight: '1.5' }],
        'sm': ['14px', { lineHeight: '1.5' }],
        'base': ['15px', { lineHeight: '1.87' }],  // Induxter: 15px, line-height 28px
        'lg': ['16px', { lineHeight: '1.6' }],
        'xl': ['19px', { lineHeight: '1.5' }],     // Induxter h5
        '2xl': ['23px', { lineHeight: '1.3' }],    // Induxter h4
        '3xl': ['30px', { lineHeight: '1.2' }],    // Induxter h3
        '4xl': ['50px', { lineHeight: '1.2' }],    // Induxter h2
        '5xl': ['65px', { lineHeight: '1.1' }],    // Induxter h1
      },
      fontWeight: {
        light: '400',
        normal: '400',
        medium: '600',
        semibold: '700',
        bold: '700',
        extrabold: '700',
      },
      letterSpacing: {
        tighter: '-0.02em',
        tight: '-0.01em',
        normal: '0',
        wide: '0.01em',
        wider: '0.02em',
        widest: '0.05em',
      },
      boxShadow: {
        'sm': '0 1px 2px rgba(0, 0, 0, 0.05)',
        'md': '0 4px 6px rgba(0, 0, 0, 0.1)',
        'lg': '0 10px 15px rgba(0, 0, 0, 0.1)',
        'xl': '0 20px 25px rgba(0, 0, 0, 0.1)',
      },
      borderRadius: {
        'none': '0',
        'xs': '4px',
        'sm': '6px',
        'DEFAULT': '8px',
        'md': '10px',
        'lg': '12px',
        'xl': '16px',
        '2xl': '20px',
        '3xl': '24px',
        'full': '9999px',
      },
      transitionTimingFunction: {
        'ease-standard': 'cubic-bezier(0.16, 1, 0.3, 1)',
      },
      transitionDuration: {
        '150': '150ms',
        '250': '250ms',
        '300': '300ms',
        '350': '350ms',
      },
    },
  },
  plugins: [],
}

export default config
