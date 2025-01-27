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
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        dashBoardButtonBg: "#404040",
        dashBoardBorderColor: "#222222",
        barBgColor:"#252527",
        mainBackcolor:"#566FE9",
        assessmentTextColor:"#C7CCF8",
      },

      backgroundImage:{
        'bakground-gradient': 'linear-gradient(140deg, #242c5d 0%, black 20%, black 77% , #242c5d 100%)',
      },
    },
  },
  plugins: [],
  
};
export default config;
