import { Inter, Martian_Mono } from "next/font/google";

export const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
  adjustFontFallback: true,
  fallback: ["system-ui", "sans-serif"],
});

export const martianMono = Martian_Mono({
  subsets: ["latin"],
  variable: "--font-martian-mono",
  display: "swap",
  weight: ["400", "700"],
  adjustFontFallback: true,
  fallback: ["system-ui", "monospace"],
});
