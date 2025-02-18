import type { Config } from "tailwindcss";

export default {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        dark: {
          DEFAULT: "#1E1E1E",
          "50": "#2D2D2D",
          "100": "#333333",
          "200": "#3D3D3D",
          "300": "#4D4D4D",
          "400": "#666666",
          "500": "#808080",
          "600": "#999999",
          "700": "#B3B3B3",
          "800": "#CCCCCC",
          "900": "#E6E6E6",
        },
        background: "var(--background)",
        foreground: "var(--foreground)",
      },
      fontFamily: {
        mono: [
          "Menlo",
          "Monaco",
          "Consolas",
          "Liberation Mono",
          "Courier New",
          "monospace",
        ],
      },
    },
  },
  plugins: [],
} satisfies Config;
