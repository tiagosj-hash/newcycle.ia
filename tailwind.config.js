/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        emerald: {
          50: '#E1F5EE',
          100: '#C3EBD7',
          400: '#5DCAA5',
          500: '#2AB688',
          600: '#1D9E75',
          700: '#0F6E56',
          800: '#085041',
          900: '#042E25',
        },
      },
      fontFamily: {
        sans: ['-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
