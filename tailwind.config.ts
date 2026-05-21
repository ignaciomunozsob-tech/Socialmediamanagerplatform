import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        bg: "#0C0C10",
        surface: "#14141A",
        border: "#1E1E28",
        accent: "#7B6EFF",
        "accent-dim": "#5A50CC",
        muted: "#6B6B80",
        text: "#E8E8F0",
        "text-dim": "#9999AA",
      },
    },
  },
  plugins: [],
};
export default config;
