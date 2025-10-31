/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        background: 'rgb(254 250 224 / <alpha-value>)', // #FEFAE0
        foreground: 'rgb(30 41 59 / <alpha-value>)', // #1E293B
        primary: 'rgb(44 110 73 / <alpha-value>)', // #2C6E49
        secondary: 'rgb(76 149 108 / <alpha-value>)', // #4C956C
        accent: 'rgb(245 185 113 / <alpha-value>)', // #F5B971
        border: 'rgb(229 231 235 / <alpha-value>)', // #E5E7EB
      },
      keyframes: {
        marquee: {
          '0%': { transform: 'translateX(0)' },
          '100%': { transform: 'translateX(-100%)' },
        },
      },
      animation: {
        marquee: 'marquee 25s linear infinite',
      },
    },
  },
  plugins: [],
}
