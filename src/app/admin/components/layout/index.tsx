import { Layout } from "antd";
import SiderLayout from "./sider";
import HeaderLayout from "./header";
import FooterLayout from "./footer";
import ContentLayout from "./content";

const BaseLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <Layout
      className="hide-scrollbar"
      style={{
        // width: "100%",
        // overflow: "hidden",
        // userSelect: "none",
        minHeight: "100vh",
      }}
      hasSider
    >
      <SiderLayout />

      <Layout
        style={{
          display: "flex",
          flexDirection: "column",
          flex: 1,
          height: "100%",
          minHeight: "inherit",
          justifyContent: "space-between",
          position: "relative",
        }}
      >
        <HeaderLayout />
        <ContentLayout>{children}</ContentLayout>
        <FooterLayout />
      </Layout>
    </Layout>
  );
};

export default BaseLayout;
