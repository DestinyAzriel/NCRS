import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        station: {
          bg: '#F7F3EC',          // Warm off-white
          ink: '#1B1E23',         // Near-black, header/player chrome
          card: '#FFFFFF',
          border: '#E2DDD3',
          subtle: '#5C6470',
          muted: '#EFEAE1',
          sand: '#E5DFD3',
        },
        accent: {
          live: '#C4441F',        // Burnt clay/rust (on-air/live accent)
          community: '#2E5339',   // Deep sorghum-leaf green
          gold: '#E8B94A',        // Dry-season gold
        },
      },
      fontFamily: {
        display: ['var(--font-fraunces)', 'Georgia', 'serif'],
        sans: ['var(--font-inter)', 'system-ui', 'sans-serif'],
        mono: ['var(--font-plex-mono)', 'monospace'], // STRICTLY for tables and timetables
      },
      animation: {
        'live-pulse': 'pulse-dot 2.5s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      },
      keyframes: {
        'pulse-dot': {
          '0%, 100%': { opacity: '1', transform: 'scale(1)' },
          '50%': { opacity: '0.3', transform: 'scale(0.85)' },
        },
      },
    },
  },
  plugins: [],
};

export default config;
