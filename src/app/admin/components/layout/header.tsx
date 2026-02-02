"use client";

import { loadAntdIcon } from "@/components/custom/icon";
import { menuAdmin } from "@/utils/helpers/menu";
import { Breadcrumb, Button, Layout, message, Modal, Space } from "antd";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import { ThemeSelector } from "../theme-selector";
import { useColorMode } from "@/lib/providers/theme";

const { Header } = Layout;

const HeaderLayout: React.FC = ({
  theme = "dark",
}: {
  theme?: "dark" | "light";
}) => {
  const color = useColorMode();
  const pathname = usePathname();
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  console.log("Current color mode in HeaderLayout:", color);

  const LogoutIcon = loadAntdIcon("LogoutOutlined");

  const breadcrumbItems = menuAdmin
    ?.filter((item) => item.link === pathname)
    ?.map((item) => {
      const Icon = loadAntdIcon(item.icon);

      return {
        title: (
          <div className="flex gap-1 items-center">
            <Icon />
            <span className="px-1">{item?.label}</span>
          </div>
        ),
      };
    });

  const handleLogout = async () => {
    Modal.confirm({
      title: "Logout",
      content: "Are you sure you want to logout?",
      okText: "Yes",
      okButtonProps: { type: "primary", danger: true },
      okType: "danger",
      cancelText: "No",
      onOk: async () => {
        setLoading(true);
        try {
          // Get CSRF token first
          const csrfResponse = await fetch("/admin/auth/api/csrf");
          const csrfData = await csrfResponse.json();

          // Logout
          const response = await fetch("/admin/auth/api/logout", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              csrfToken: csrfData.token,
            }),
          });

          const data = await response.json();

          if (response.ok && data.success) {
            message.success("Logout successful");
            router.replace("/admin/auth");
          } else {
            message.error(data.error || "Logout failed");
          }
        } catch (error) {
          console.error("Logout error:", error);
          message.error("An error occurred during logout");
        } finally {
          setLoading(false);
        }
      },
    });
  };

  return (
    <Header
      style={{
        width: "100%",
        position: "absolute",
        left: 0,
        top: 0,
        zIndex: 1,
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        gap: 16,
        paddingBlock: 16,
        paddingInline: 40,
        backgroundColor: color.resolvedTheme === "dark" ? "#141414" : "#ffffff",
      }}
    >
      <Breadcrumb style={{ fontWeight: 600 }} items={breadcrumbItems} />
      <Space size="middle">
        <ThemeSelector />
        <Button
          style={{ fontWeight: 600 }}
          icon={<LogoutIcon />}
          type="text"
          iconPosition="end"
          loading={loading}
          onClick={handleLogout}
        >
          Logout
        </Button>
      </Space>
    </Header>
  );
};

export default HeaderLayout;
