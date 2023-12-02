/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        'black-1': '#0F0F0F',
        'black-2': '#0D0D0D',
        'green-1': '#38B081',
        'blue-1': '#999999',
        'yellow-1': '#f09c1f',
        'red-1': '#c13530',
        'gold-1': '#c1c530',
        'bright-grey-1': '#999999',
        'dark-grey-1': '#141414',
        'warning-1': '#9FB038',
        'cancel-1': '#B04638',
        'blue-green': ['#1F7FF0', '#38B081'],
        gradientColorStops: {
          'blue-green': ['#1F7FF0', '#38B081'],
        },
      },
      fontFamily: {
        ClashDisplay: [ 'Clash Display', 'sans-serif'],
        circularStd: ['Circular Std', 'sans-serif' ]
      }
    },
  },
  // theme: {
  //   extend: {
  //     backgroundImage: {
  //       'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
  //       'gradient-conic':
  //         'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
  //     },
  //   },
  // },
  plugins: [],
}
