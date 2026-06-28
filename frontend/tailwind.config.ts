import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          red: '#f84f70',
          pink: '#fb608d',
          dark: '#0f172a',
          purple: '#6b46c1',
          green: '#047857',
        },
      },
      fontFamily: {
        sans: ['var(--font-inter)'],
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'hero-grid': 'radial-gradient(circle, #e2e8f0 1px, transparent 1px)',
        'frontier': 'url("https://www.transparenttextures.com/patterns/stardust.png")',
      },
    },
  },
  plugins: [],
};
export default config;
