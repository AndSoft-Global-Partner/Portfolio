/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        os: {
          bg: 'var(--os-bg)',
          panel: 'var(--os-panel)',
          window: 'var(--os-window)',
          titlebar: 'var(--os-titlebar)',
          border: 'var(--os-border)',
          green: 'var(--os-green)',
          cyan: 'var(--os-cyan)',
          magenta: 'var(--os-magenta)',
          yellow: 'var(--os-yellow)',
          red: 'var(--os-red)',
          text: 'var(--os-text)',
          muted: 'var(--os-muted)',
          dim: 'var(--os-dim)',
        },
      },
      fontFamily: {
        grotesk: ['Space Grotesk', 'system-ui', 'sans-serif'],
        mono: ['Space Mono', 'Consolas', 'monospace'],
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
