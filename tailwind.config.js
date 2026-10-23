/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./components/**/*.{js,vue,ts}",
    "./layouts/**/*.vue",
    "./pages/**/*.vue",
    "./plugins/**/*.{js,ts}",
    "./app.vue",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'Helvetica Neue', 'Arial', 'sans-serif'],
      },
      colors: {
        primary: {
          50: '#FFF3E6',
          100: '#FFE0CC',
          200: '#FFC299',
          300: '#FFA366',
          400: '#F2A365',
          500: '#E76F51',
          600: '#D35400',
          700: '#BF4A00',
          800: '#A63F00',
          900: '#8C3500',
        },
        secondary: {
          50: '#FFF8E7',
          100: '#FFEFCC',
          200: '#FCE69E',
          300: '#F9C56D',
          400: '#F4A261',
          500: '#E9963B',
          600: '#CC7A2A',
          700: '#A65F1A',
        }
      }
    }
  },
  plugins: [],
}