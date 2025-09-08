/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './index.html',
    './src/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        'turrs-blue': '#5DADE2',
        'turrs-red': '#C0392B',
        'turrs-brown': '#8B4513',
        'turrs-skin': '#F5DEB3',
      },
    },
  },
  plugins: [],
}
