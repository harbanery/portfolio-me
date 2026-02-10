import { Bebas_Neue, Inter } from "next/font/google";

export const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
  adjustFontFallback: true,
  fallback: ["system-ui", "sans-serif"],
});

export const bebas = Bebas_Neue({
  subsets: ["latin"],
  variable: "--font-bebas",
  display: "swap",
  weight: ["400"],
  adjustFontFallback: true,
  fallback: ["system-ui", "sans-serif"],
});
