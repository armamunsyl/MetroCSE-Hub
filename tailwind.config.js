/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      keyframes: {
        'fade-up': {
          '0%': { opacity: '0', transform: 'translateY(16px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        'slide-loop': {
          '0%, 49%': { transform: 'translateX(0%)' },
          '50%, 99%': { transform: 'translateX(-50%)' },
          '100%': { transform: 'translateX(-50%)' },
        },
      },
      animation: {
        'fade-up': 'fade-up 0.8s ease forwards',
        'slide-loop': 'slide-loop 4s ease-in-out infinite',
      },
    },
  },
  plugins: [],
}
