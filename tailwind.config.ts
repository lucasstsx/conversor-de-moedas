import type { Config } from 'tailwindcss'

const config = {
  darkMode: ['class'],
  content: [
    './pages/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './app/**/*.{ts,tsx}',
    './src/**/*.{ts,tsx}',
  ],
  prefix: '',
  theme: {
    container: {
      center: true,
      padding: '2rem',
      screens: {
        '2xl': '1400px',
      },
    },
    extend: {
      keyframes: {
        'accordion-down': {
          from: { height: '0' },
          to: { height: 'var(--radix-accordion-content-height)' },
        },
        'accordion-up': {
          from: { height: 'var(--radix-accordion-content-height)' },
          to: { height: '0' },
        },
      },
      animation: {
        'accordion-down': 'accordion-down 0.2s ease-out',
        'accordion-up': 'accordion-up 0.2s ease-out',
      },
      colors: {
        'blue-100': '#080815',
        'blue-200': '#0E0F25',
        'blue-300': '#141534',
        'blue-400': '#1F2151',
        'blue-500': '#2F3279',
        'blue-600': '#2F34AB',
        'blue-700': '#4A5DCD',
        'blue-800': '#7D8DEC',
        'blue-900': '#B2B8DE',
        white: '#F1F2F6',
      },
    },
  },
  plugins: [require('tailwindcss-animate')],
} satisfies Config

export default config
