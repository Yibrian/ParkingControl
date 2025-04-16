module.exports = {
  content: [
    './src/**/*.{js,jsx,ts,tsx}', // Asegúrate de incluir todos los archivos relevantes
    './public/index.html',
  ],
  theme: {
    extend: {
      colors: {
        primary: '#CF0018', // Color primario (por ejemplo, para botones principales)
        success: '#27AE60', // Color para añadir nuevas cosas
        save: '#2563EB', // Color para guardar cambios
        text: '#424343', // Color para la letra
      },
      fontFamily: {
        sans: ['Roboto', 'Arial', 'sans-serif'], // Tipografía personalizada
      },
    },
  },
  plugins: [],
};