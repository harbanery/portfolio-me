"use client";

import { Layout } from "antd";

const { Content } = Layout;

const ContentLayout: React.FC<{ children: React.ReactNode }> = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  return (
    <Content
      style={{
        padding: "72px 10px",
        background: "none",
        display: "flex",
        flexGrow: 1,
        flexDirection: "column",
        width: "100%",
        minWidth: "0",
        height: "calc(100vh - 100px)",
        overflowY: "auto",
      }}
    >
      <div
        style={{
          padding: "1px",
          background: "white",
          borderRadius: "5px",
        }}
      >
        {children}
      </div>
    </Content>
  );
};

export default ContentLayout;
