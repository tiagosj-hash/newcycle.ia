/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        emerald: {
          50:  '#E1F5EE',
          100: '#C3EBD7',
          200: '#96D9B8',
          400: '#5DCAA5',
          500: '#2AB688',
          600: '#1D9E75',
          700: '#0F6E56',
          800: '#085041',
          900: '#042E25',
          950: '#021A15',
        },
      },
      fontFamily: {
        sans: ['Inter', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'sans-serif'],
      },
      boxShadow: {
        card: '0 1px 3px 0 rgb(0 0 0 / 0.07), 0 1px 2px -1px rgb(0 0 0 / 0.04)',
        'card-hover': '0 4px 12px 0 rgb(0 0 0 / 0.10), 0 2px 4px -1px rgb(0 0 0 / 0.06)',
        'float': '0 20px 40px -8px rgb(0 0 0 / 0.25)',
      },
    },
  },
  plugins: [],
}
