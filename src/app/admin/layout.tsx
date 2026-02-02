import "antd/dist/reset.css";
import { AntdRegistry } from "@ant-design/nextjs-registry";
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
