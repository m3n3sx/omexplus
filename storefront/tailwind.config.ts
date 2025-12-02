import type { Config } from "tailwindcss"

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#f0f7fa',
          100: '#e0f0f5',
          200: '#c1e1eb',
          300: '#a2d2e1',
          400: '#83c3d7',
          500: '#2185a3', // OMEX Main Teal
          600: '#1b6a82',
          700: '#155461',
          800: '#0f3c40',
          900: '#092829',
          950: '#041415',
        },
        secondary: {
          50: '#fef5e7',
          100: '#fdebd0',
          200: '#fbd7a1',
          300: '#f9c372',
          400: '#f7af43',
          500: '#f39c12', // OMEX Orange
          600: '#d68910',
          700: '#b9760e',
          800: '#9c630c',
          900: '#7f500a',
        },
      },
    },
  },
  plugins: [],
}

export default config
