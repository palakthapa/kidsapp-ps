/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx}",
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
    "./node_modules/flowbite-react/**/*.js",

    // Or if using `src` directory:
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        purple: "#9077f4",
        yellow: "#ffdf22",
        pink: "#f173c4",
        aqua: "#52d5f2",
        green: "#a4d955",
        peach: "#56d4c5",
        danger: "#e3400b",
        wheat: "#ceb49d"
      },
      backgroundImage: {
        'main-bg-img': "url('/images/bg-img.jpg')"
      },
      keyframes: {
        bounce: {
          '0%, 100%': {
            transform: 'translate(0,0)',
            backgroundColor: 'rgb(156, 162, 175)'
          },
          '30%, 65%': {
            transform: 'translate(0,2px)',
            backgroundColor: 'rgb(169, 175, 186)'
          },
          '50%': {
            transform: 'translate(0,3px)',
            backgroundColor: 'rgb(182, 188, 197)'
          },
        }
      },
      screens: {
        'tall': { 'raw': '(min-height: 615px)' },
      }
    },
  },
  plugins: [
    require('flowbite/plugin')
  ]
}
