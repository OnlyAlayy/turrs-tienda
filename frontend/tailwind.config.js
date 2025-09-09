/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Colores de TURRS basados en el logo
        'turrs-blue': '#5DADE2',
        'turrs-red': '#C0392B',
        'turrs-brown': '#8B4513',
        'turrs-skin': '#F5DEB3',
        'turrs-black': '#000000',
        'turrs-white': '#FFFFFF',
      },
      fontFamily: {
        // Fuentes para TURRS (puedes cambiar luego por una fuente graffiti)
        'turrs-title': ['"Urban Jungle"', 'sans-serif'],
        'turrs-text': ['Montserrat', 'sans-serif'],
      },
    },
  },
  plugins: [],
}