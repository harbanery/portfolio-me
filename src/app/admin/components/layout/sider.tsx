"use client";

import { Button, Layout, Menu, MenuProps } from "antd";
import { useEffect, useState } from "react";
import { menuAdmin } from "@/utils/helpers/menu";
import { loadAntdIcon } from "@/components/custom/icon";
import { usePathname, useRouter } from "next/navigation";

const { Sider } = Layout;

type MenuItem = Required<MenuProps>["items"][number];

const SiderLayout: React.FC = ({
  theme = "dark",
}: {
  theme?: "dark" | "light";
}) => {
  const MenuUnfoldOutlined = loadAntdIcon("MenuUnfoldOutlined");
  const MenuFoldOutlined = loadAntdIcon("MenuFoldOutlined");

  const pathname = usePathname();
  const router = useRouter();

  const [collapsed, setCollapsed] = useState<boolean>(true);
  const [selectedKey, setSelectedKey] = useState<string[]>([]);

  const filteredMenu = menuAdmin?.filter((item) => item?.active);

  const menuItems: MenuItem[] = filteredMenu?.map((item) => {
    const Icon = loadAntdIcon(item.icon);
    return {
      key: item.key,
      icon: <Icon />,
      label: item.label,
    };
  });

  const toggleCollapsed = () => {
    setCollapsed(!collapsed);
  };

  const toggleMenu = ({ key }: any) => {
    const linkTarget = filteredMenu.find((item) => item.key === key)?.link;
    if (!linkTarget) return;
    setSelectedKey([key]);
    router.replace(linkTarget);
  };

  useEffect(() => {
    const key = filteredMenu.find((item) => pathname === item.link)?.key;
    setSelectedKey(key ? [key] : []);
  }, [pathname]);

  return (
    <Sider
      // width={collapsed ? 60 : 200}
      // collapsible
      collapsed={collapsed}
      // onCollapse={toggleCollapsed}
      width={200}
      theme={theme}
      style={
        {
          // position: "relative",
          // transition: "width 0.1s ease",
        }
      }
    >
      {/* <div
        className="fixed"
        style={{ width: collapsed ? 60 : 200, transition: "width 0.1s ease" }}
      > */}
      <div className="p-1">
        <Button
          color="primary"
          variant={theme == "dark" ? "solid" : "filled"}
          onClick={toggleCollapsed}
          style={{
            marginBottom: 16,
            width: "100%",
            height: 40,
            // transition: "width 0.1s ease",
          }}
        >
          {collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
        </Button>
      </div>
      <Menu
        selectedKeys={selectedKey}
        mode="inline"
        theme={theme}
        inlineCollapsed={collapsed}
        items={menuItems}
        onClick={toggleMenu}
        // style={{
        //   transition: "width 0.1s ease",
        // }}
      />
      {/* </div> */}
    </Sider>
  );
};

export default SiderLayout;
