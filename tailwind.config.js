/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    screens: {
      sm: '640px',
      md: '768px',
      lg: '1024px',
      xl: '1280px',
      '2xl': '1536px',
    },
    extend: {
      colors: {
        teal: {
          DEFAULT: '#0F6E56',
          dark: '#085041',
          light: '#E1F5EE',
          mid: '#1D9E75',
          50: '#E1F5EE',
          100: '#9FE1CB',
          600: '#0F6E56',
          800: '#085041',
          900: '#04342C',
        },
        forest: {
          DEFAULT: '#1A3C34',
          light: '#214A40',
          dark: '#152E28',
        },
        connect: {
          DEFAULT: '#F5A623',
          dark: '#E67E22',
        },
        amber: {
          DEFAULT: '#BA7517',
          light: '#FAEEDA',
          dark: '#633806',
        },
        purple: {
          DEFAULT: '#534AB7',
          light: '#EEEDFE',
          dark: '#26215C',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      spacing: {
        'safe-bottom': 'env(safe-area-inset-bottom)',
        'safe-top': 'env(safe-area-inset-top)',
      },
      minHeight: {
        touch: '44px',
      },
      maxWidth: {
        mobile: '430px',
      },
    },
  },
  plugins: [],
};
