import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {},
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
      'whit-e': '#F1F2F6',
    },
  },
  plugins: [],
}
export default config
