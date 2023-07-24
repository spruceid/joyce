/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{html,js,svelte,ts}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        blue: {
          1: '#3376E7'
        },
        purple: {
          light: '#F6F5FF',
          550: '#625FF5'
        }
      },
      screens: {
        xxs: '320px',
        xs: '480px'
      },
      width: {
        'fill-available': '-webkit-fill-available'
      },
      minHeight: {
        260: '260px'
      }
    }
  },
  plugins: []
};
