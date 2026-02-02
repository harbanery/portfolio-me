"use client";

import { useColorMode } from "@/lib/providers/theme";
import { Layout } from "antd";

const { Footer } = Layout;

const FooterLayout: React.FC = () => {
  const color = useColorMode();
  return (
    <Footer
      style={{
        // width: "100%",
        // position: "absolute",
        // left: 0,
        // bottom: 0,
        zIndex: 1,
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        gap: 16,
        paddingBlock: 16,
        paddingInline: 40,
        // temp
        background: color.resolvedTheme === "dark" ? "#141414" : "#ffffff",
      }}
    >
      Footer
    </Footer>
  );
};

export default FooterLayout;
