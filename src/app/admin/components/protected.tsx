"use client";

import { useEffect, useState } from "react";
import { usePathname, notFound } from "next/navigation";
import { menuAdmin } from "@/utils/helpers/menu";
import { Spin } from "antd";
import LoaderPage from "./loader";

export default function AdminMenuGuard({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const pathname = usePathname();
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    const checkMenuStatus = () => {
      const menuItem = menuAdmin.find((menu) => menu.link === pathname);

      if (menuItem && !menuItem.active) {
        notFound();
      }

      setIsChecking(false);
    };

    checkMenuStatus();
  }, [pathname]);

  if (isChecking) return <LoaderPage />;

  return <>{children}</>;
}
