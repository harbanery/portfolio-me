"use client";

import { Dropdown, Button } from "antd";
import { loadAntdIcon } from "@/components/custom/icon";
import { useColorMode } from "@/lib/providers/theme";
import type { MenuProps } from "antd";

const SunIcon = loadAntdIcon("SunOutlined");
const MoonIcon = loadAntdIcon("MoonOutlined");
const LaptopIcon = loadAntdIcon("LaptopOutlined");

export function ThemeSelector() {
  const { colorMode, setColorMode, resolvedTheme } = useColorMode();

  const getIcon = () => {
    const effectiveTheme = resolvedTheme === "dark" ? "dark" : "light";
    if (colorMode === "system") {
      return effectiveTheme === "dark" ? <MoonIcon /> : <SunIcon />;
    }
    return colorMode === "dark" ? <MoonIcon /> : <SunIcon />;
  };

  const getLabel = () => {
    if (colorMode === "system") {
      return resolvedTheme === "dark" ? "Dark (System)" : "Light (System)";
    }
    return colorMode === "dark" ? "Dark" : "Light";
  };

  const items: MenuProps["items"] = [
    {
      key: "light",
      label: (
        <div className="flex items-center gap-2">
          <SunIcon />
          <span>Light</span>
        </div>
      ),
      onClick: () => setColorMode("light"),
    },
    {
      key: "dark",
      label: (
        <div className="flex items-center gap-2">
          <MoonIcon />
          <span>Dark</span>
        </div>
      ),
      onClick: () => setColorMode("dark"),
    },
    {
      key: "system",
      label: (
        <div className="flex items-center gap-2">
          <LaptopIcon />
          <span>System</span>
        </div>
      ),
      onClick: () => setColorMode("system"),
    },
  ];

  return (
    <Dropdown menu={{ items }} trigger={["click"]} placement="bottomRight">
      <Button type="text" icon={getIcon()} iconPosition="end">
        {getLabel()}
      </Button>
    </Dropdown>
  );
}

export default ThemeSelector;
