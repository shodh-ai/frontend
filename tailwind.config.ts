import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      keyframes:{
        slide: {
          "0%": {transform : "translateX(50%)", opacity: "0"},
          "100%": {tranform: "translateX(0%)", opacity: "1"}
        }
      },
      animation:{
        "slide-left": "slide 1s forwards"
      },
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        dashBoardButtonBg: "#404040",
        dashBoardBorderColor: "#222222",
        barBgColor:"#252527",
        mainBackcolor:"#566FE9",
      },

      backgroundImage:{
        'bakground-gradient': 'linear-gradient(180deg, #242c5d 3%, black 30%, black 60% , #242c5d 95%)',
      },
    },
  },
  plugins: [],
  
};
export default config;
