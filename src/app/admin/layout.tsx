import "antd/dist/reset.css";
import AntdThemeProvider from "@/lib/providers/theme";
import { AntdRegistry } from "@ant-design/nextjs-registry";
import BaseLayout from "./components/layout";
import { App } from "antd";

export default function AdminRootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    // <AntdThemeProvider>
    <AntdRegistry>
      <App>{children}</App>
    </AntdRegistry>
    // </AntdThemeProvider>
  );
}
