import "antd/dist/reset.css";
import { AntdRegistry } from "@ant-design/nextjs-registry";
import { App } from "antd";
import { ACCESS_ADMIN } from "@/lib/config/variables";
import { notFound } from "next/navigation";
import { ColorModeProvider } from "@/lib/providers/theme";

export default function AdminRootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  if (!ACCESS_ADMIN) {
    return notFound();
  }

  return (
    // <ColorModeProvider>
    <AntdRegistry>
      <App>{children}</App>
    </AntdRegistry>
    // </ColorModeProvider>
  );
}
