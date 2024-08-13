/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{html,js}"],
  theme: {
    container: {
      center: true,
      padding: {
        DEFAULT: '1rem',
        sm: '2rem',
        lg: '4rem',
        xl: '5rem',
        '2xl': '6rem',
      },
      screens: {
        'tablet': '640px',
        // => @media (min-width: 640px) { ... }
  
        'laptop': '1024px',
        // => @media (min-width: 1024px) { ... }
  
        'desktop': '1280px',
        // => @media (min-width: 1280px) { ... }
      },
      spacing: {
        '128': '32rem',
      },
      minWidth: {
        '128': '32rem',
      },
      height: {
        '128': '32rem',
      }
    },

    extend: {
      zIndex: {
        '100': '100',
      }
    },
  },
  plugins: [],
};
