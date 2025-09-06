/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        // Custom Islamic architectural theme colors for Burhani Guards
        gold: '#D4AF37',      // Primary yellow/gold color for headers and member theme
        brown: '#8B4513',     // Secondary brown color for admin theme
        cream: '#F5F5DC',     // Background cream color matching Islamic architecture
        tan: '#C4A47C',       // Light brown accent color
      },
      backgroundImage: {
        // Background image for the login page Islamic architecture
        'architecture': "url('/images/architecture-bg.jpg')",
      },
    },
  },
  plugins: [],
}
    