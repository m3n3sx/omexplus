import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        // Primary
        primary: {
          50: '#f0f4f8',
          100: '#dfe9f3',
          200: '#c5d9e8',
          300: '#a8c3dc',
          400: '#8aaccc',
          500: '#5d8fb7',
          600: '#4a7399',
          700: '#375a7a',
          800: '#1a3a52',
          900: '#0f2538',
        },
        // Secondary
        secondary: {
          50: '#fef9f5',
          100: '#fee5d0',
          200: '#fccc9a',
          300: '#f9a855',
          400: '#f47c20',
          500: '#d66b1a',
          600: '#b85a15',
          700: '#9a4810',
        },
        // Neutral
        neutral: {
          50: '#f9f9f9',
          100: '#f5f5f5',
          200: '#e0e0e0',
          300: '#d0d0d0',
          400: '#999999',
          500: '#666666',
          600: '#404040',
          700: '#262626',
          800: '#1a1a1a',
          900: '#000000',
        },
        // Status
        success: '#27ae60',
        warning: '#f39c12',
        danger: '#e74c3c',
        info: '#3498db',
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
        normal: '400',
        medium: '500',
        semibold: '600',
        bold: '700',
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
