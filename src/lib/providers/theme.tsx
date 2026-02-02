"use client";

import React from "react";
import { ConfigProvider, theme as antdTheme } from "antd";
import { ThemeProvider, useTheme as useNextTheme } from "next-themes";
import type { ThemeProviderProps } from "next-themes";
import { customThemes } from "../config/themes";

export interface ColorModeProviderProps extends ThemeProviderProps {
  children: React.ReactNode;
}

export type ColorMode = "light" | "dark" | "system";

export function ColorModeProvider({ children, ...props }: ColorModeProviderProps) {
  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem {...props}>
      <ColorModeContent>{children}</ColorModeContent>
    </ThemeProvider>
  );
}

function ColorModeContent({ children }: { children: React.ReactNode }) {
  const { resolvedTheme, systemTheme } = useNextTheme();
  
  const isDark = resolvedTheme === "dark" || (resolvedTheme === "system" && systemTheme === "dark");
  
  const antdThemeConfig = {
    algorithm: isDark ? antdTheme.darkAlgorithm : antdTheme.defaultAlgorithm,
    token: {
      colorPrimary: isDark ? "#1f6feb" : "#1890ff",
    },
  };

  return <ConfigProvider theme={antdThemeConfig}>{children}</ConfigProvider>;
}

export function useColorMode() {
  const { theme, setTheme, resolvedTheme, systemTheme } = useNextTheme();
  
  const colorMode = (theme || "system") as ColorMode;
  
  const setColorMode = (mode: ColorMode) => {
    setTheme(mode);
  };

  return { 
    colorMode, 
    resolvedTheme,
    systemTheme,
    setColorMode,
  };
}

export default ColorModeProvider;
