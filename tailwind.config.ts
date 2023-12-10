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
        'gold': '#D4AF37'
      }
    },
  },
  plugins: [],
};
export default config;
