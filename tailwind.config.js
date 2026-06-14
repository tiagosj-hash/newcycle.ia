/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        brand: {
          50:  '#edfaf4',
          100: '#d3f4e5',
          200: '#a9e8cc',
          400: '#4fd4a0',
          500: '#22bf82',
          600: '#16a36d',
          700: '#0e7a52',
          800: '#0a5539',
          900: '#063322',
          950: '#031a12',
        },
      },
      fontFamily: {
        sans: ['Inter', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'sans-serif'],
      },
      boxShadow: {
        card:       '0 1px 3px 0 rgb(0 0 0 / 0.06), 0 1px 2px -1px rgb(0 0 0 / 0.04)',
        'card-hover': '0 8px 24px -4px rgb(0 0 0 / 0.12), 0 2px 8px -2px rgb(0 0 0 / 0.06)',
        float:      '0 24px 48px -8px rgb(0 0 0 / 0.28)',
        glow:       '0 0 0 3px rgb(22 163 109 / 0.2)',
      },
      fontSize: {
        '2xs': ['0.65rem', { lineHeight: '1rem' }],
      },
    },
  },
  plugins: [],
}
