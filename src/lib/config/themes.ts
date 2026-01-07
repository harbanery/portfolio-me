import { theme as antdTheme } from "antd";

export const customThemes = {
  light: {
    ...antdTheme.defaultAlgorithm,
    token: {
      colorPrimary: "#1890ff",
      colorBgBase: "#ffffff",
      colorTextBase: "#000000",
    },
  },
  dark: {
    ...antdTheme.darkAlgorithm,
    token: {
      colorPrimary: "#1f6feb",
      colorBgBase: "#141414",
      colorTextBase: "#ffffff",
    },
  },
  ocean: {
    ...antdTheme.defaultAlgorithm,
    token: {
      colorPrimary: "#00aaff",
      colorBgBase: "#e0f7ff",
      colorTextBase: "#003366",
    },
  },
};
