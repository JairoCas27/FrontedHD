/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        adminAzul: "rgb(52,151,195)", // Registramos tu azul acerado corporativo
      }
    },
  },
  plugins: [],
}