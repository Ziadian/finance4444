/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'dime': {
          bg:      '#111318',
          bg2:     '#1a1d24',
          bg3:     '#22262f',
          card:    '#1e2028',
          border:  '#2a2d38',
          text:    '#e8eaf2',
          muted:   '#6b7280',
          accent:  '#00d4a0',
          red:     '#f44060',
          green:   '#00d4a0',
          gold:    '#f5a623',
          blue:    '#4b8fff',
        }
      },
      fontFamily: {
        thai: ['"Noto Sans Thai"', 'sans-serif'],
        head: ['"Space Grotesk"', '"Noto Sans Thai"', 'sans-serif'],
        mono: ['"Space Mono"', 'monospace'],
      },
      borderRadius: {
        '2xl': '16px',
        '3xl': '24px',
      },
    },
  },
  plugins: [],
}
