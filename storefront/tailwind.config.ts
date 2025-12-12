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
        sans: ['Inter', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', 'sans-serif'],
      },
      colors: {
        // Primary - Yellow/Gold tones (Industrial/Professional)
        primary: {
          50: '#FFFBEB',
          100: '#FEF3C7',
          200: '#FDE68A',
          300: '#FCD34D',
          400: '#FBBF24',
          500: '#EBAE34',  // Main yellow/gold
          600: '#D97706',
          700: '#B45309',
          800: '#92400E',
          900: '#78350F',
        },
        // Secondary - Dark gray tones (Professional/Industrial)
        secondary: {
          50: '#F9FAFB',
          100: '#F3F4F6',
          200: '#E5E7EB',
          300: '#D1D5DB',
          400: '#9CA3AF',
          500: '#6B7280',
          600: '#4B5563',
          700: '#424242',  // Main dark gray
          800: '#1F2937',
          900: '#111827',
        },
        // Neutral - Light gray/white tones
        neutral: {
          50: '#FBF9F6',   // Almost white background
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
        success: '#27ae60',  // Green
        warning: '#F2B90C',  // Yellow
        danger: '#E61901',   // Red
        info: '#3498db',     // Blue
        // Accent colors
        yellow: '#EBAE34',   // For promotions, highlights
        green: '#70E67F',    // For small accents only
        red: '#E61901',      // For alerts
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
        'base': ['14px', { lineHeight: '1.6' }],
        'lg': ['16px', { lineHeight: '1.6' }],
        'xl': ['18px', { lineHeight: '1.5' }],
        '2xl': ['24px', { lineHeight: '1.3' }],
        '3xl': ['32px', { lineHeight: '1.2' }],
        '4xl': ['48px', { lineHeight: '1.1' }],
      },
      fontWeight: {
        light: '400',
        normal: '600',
        medium: '700',
        semibold: '800',
        bold: '900',
        extrabold: '900',
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
        'sm': '4px',
        'md': '8px',
        'lg': '12px',
      },
      transitionTimingFunction: {
        'ease-standard': 'cubic-bezier(0.16, 1, 0.3, 1)',
      },
      transitionDuration: {
        '150': '150ms',
        '250': '250ms',
        '350': '350ms',
      },
    },
  },
  plugins: [],
}

export default config
