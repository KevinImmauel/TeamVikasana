/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#e6f1fe',
          100: '#cce3fd',
          200: '#99c8fb',
          300: '#66acf9',
          400: '#3391f7',
          500: '#0066cc', // Main primary color
          600: '#0052a3',
          700: '#003d7a',
          800: '#002952',
          900: '#001429',
        },
        secondary: {
          50: '#f5f7fa',
          100: '#ebeef5',
          200: '#d8deeb',
          300: '#c4cde0',
          400: '#b0bdd6',
          500: '#8599c2',
          600: '#6b7f9e',
          700: '#526177',
          800: '#38424f',
          900: '#1f2428',
        },
        accent: {
          50: '#e6f7fd',
          100: '#cceffc',
          200: '#99dff8',
          300: '#66cff5',
          400: '#33bff1',
          500: '#00aaed',
          600: '#0088bd',
          700: '#00668e',
          800: '#00445e',
          900: '#00222f',
        },
        success: '#10b981',
        warning: '#f59e0b',
        danger: '#ef4444',
        info: '#3b82f6',
        dark: {
          100: '#383b45',
          200: '#2e3039',
          300: '#25262e',
          400: '#1c1d22',
          500: '#121317', // Main dark background
        },
      },
      boxShadow: {
        'soft': '0 2px 15px 0 rgba(0, 0, 0, 0.05)',
        'soft-lg': '0 4px 20px 0 rgba(0, 0, 0, 0.07)',
        'soft-xl': '0 8px 30px 0 rgba(0, 0, 0, 0.1)',
        'soft-dark': '0 2px 15px 0 rgba(0, 0, 0, 0.3)',
      },
      fontFamily: {
        sans: ['var(--font-geist-sans)'],
        mono: ['var(--font-geist-mono)'],
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic':
          'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
      },
    },
  },
  plugins: [],
}