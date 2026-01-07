"use client";

import { loadAntdIcon } from "@/components/custom/icon";
import { menuAdmin } from "@/utils/helpers/menu";
import { Breadcrumb, Button, Layout } from "antd";
import { usePathname } from "next/navigation";

const { Header } = Layout;

const HeaderLayout: React.FC = ({
  theme = "dark",
}: {
  theme?: "dark" | "light";
}) => {
  const pathname = usePathname();

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
        // temp
        backgroundColor: "white",
      }}
    >
      {/* <nav
        className={`flex justify-between items-start gap-4 px-10 py-4 w-full`}
      > */}
      <Breadcrumb style={{ fontWeight: 600 }} items={breadcrumbItems} />
      <Button
        style={{ fontWeight: 600 }}
        icon={<LogoutIcon />}
        type="text"
        iconPosition="end"
      >
        Logout
      </Button>
      {/* </nav> */}
    </Header>
  );
};

export default HeaderLayout;
