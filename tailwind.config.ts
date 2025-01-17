import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        "mainBackgroundColor" :"#0D1117",
        "columnBackgroundColor" : "#161C22"
      },
    },
  },
  plugins: [],
};
export default config;
