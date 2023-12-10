import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic":
          "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
        "auth-bg": "url('/public/images/auth-bg.png')",
      },
      backgroundColor: {
        customBlack: "#050506",
        customGold: "#D4AF37",
        // customGold: "gold",
      },
      colors: {
        'gold': '#D4AF37',
        'black-1': '#0F0F0F',
        'black-2': '#0D0D0D',
        'green-1': '#38B081',
        'blue-1': '#999999',
        'yellow-1': '#f09c1f',
        'red-1': '#c13530',
        'gold-1': '#c1c530',
      }
    },
  },
  plugins: [],
};
export default config;
