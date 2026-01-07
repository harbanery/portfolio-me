"use client";

import React from "react";
import { ConfigProvider } from "antd";
import { ThemeProvider, useTheme } from "next-themes";
import type { ThemeProviderProps } from "next-themes";
import { customThemes } from "../config/themes";

export interface ColorModeProviderProps extends ThemeProviderProps {}

export type ColorMode = keyof typeof customThemes | "system";

export function ColorModeProvider(props: ColorModeProviderProps) {
  const { resolvedTheme, forcedTheme } = useTheme();
  const colorMode = (forcedTheme || resolvedTheme) as ColorMode;

  const effectiveTheme: keyof typeof customThemes =
    colorMode === "system"
      ? window.matchMedia("(prefers-color-scheme: dark)").matches
        ? "dark"
        : "light"
      : colorMode;

  const antdThemeConfig = customThemes[effectiveTheme] || customThemes.light;

  return (
    <ThemeProvider attribute="class" disableTransitionOnChange {...props}>
      <ConfigProvider theme={antdThemeConfig}>{props.children}</ConfigProvider>
    </ThemeProvider>
  );
}

export function useColorMode() {
  const { resolvedTheme, setTheme, forcedTheme } = useTheme();
  const colorMode = (forcedTheme || resolvedTheme) as ColorMode;

  const toggleColorMode = () => {
    const modes = Object.keys(customThemes);
    const currentIndex = modes.indexOf(colorMode);
    const nextIndex = (currentIndex + 1) % modes.length;
    setTheme(modes[nextIndex]);
  };

  return { colorMode, setColorMode: setTheme, toggleColorMode };
}

const AntdThemeProvider = (props: ColorModeProviderProps) => {
  return (
    <ConfigProvider>
      <ColorModeProvider {...props} />
    </ConfigProvider>
  );
};

export default AntdThemeProvider;
