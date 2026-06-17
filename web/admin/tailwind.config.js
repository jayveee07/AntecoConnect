/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#fff6ed', 100: '#ffe8d5', 200: '#ffd1a8', 300: '#ffb07a',
          400: '#ff8f4a', 500: '#FF6B00', 600: '#e65c00', 700: '#cc5200',
          800: '#b34700', 900: '#8a3800', 950: '#5c2600',
        },
        electric: { 50: '#fff6ed', 100: '#ffe8d5', 200: '#ffd1a8', 300: '#ffb07a', 400: '#ff8f4a', 500: '#FF6B00' },
      },
      fontFamily: { sans: ['Inter', 'system-ui', 'sans-serif'] },
      animation: { 'fade-in': 'fadeIn 0.5s ease-in-out', 'slide-up': 'slideUp 0.5s ease-out' },
      keyframes: {
        fadeIn: { '0%': { opacity: '0' }, '100%': { opacity: '1' } },
        slideUp: { '0%': { transform: 'translateY(20px)', opacity: '0' }, '100%': { transform: 'translateY(0)', opacity: '1' } },
      },
    },
  },
  plugins: [],
};
