"use client";

import { Layout } from "antd";

const { Footer } = Layout;

const FooterLayout: React.FC = () => {
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
        background: "white",
      }}
    >
      Footer
    </Footer>
  );
};

export default FooterLayout;
