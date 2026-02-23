/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        os: {
          bg: '#0a0a16',
          panel: '#0e0e1a',
          window: '#111120',
          titlebar: '#181830',
          border: '#252545',
          green: '#00ff88',
          cyan: '#00b4d8',
          magenta: '#e040fb',
          yellow: '#ffbd2e',
          red: '#ff5f57',
          text: '#d0d0e0',
          muted: '#7a7a9a',
          dim: '#4a4a6a',
        },
      },
      fontFamily: {
        ubuntu: ['Ubuntu', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'Consolas', 'monospace'],
      },
      animation: {
        scroll: 'scroll 20s linear infinite',
        float: 'float 6s ease-in-out infinite',
        blink: 'blink 1s step-end infinite',
        marquee: 'marquee 30s linear infinite',
      },
      keyframes: {
        scroll: {
          '0%': { transform: 'translateX(0)' },
          '100%': { transform: 'translateX(-50%)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-6px)' },
        },
        blink: {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0' },
        },
        marquee: {
          from: { transform: 'translateX(0)' },
          to: { transform: 'translateX(-50%)' },
        },
      },
    },
  },
  plugins: [],
};
