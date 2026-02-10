"use client";

import Footer from "../footer";
import Navbar from "../navbar";
import AOS from "aos";
import "aos/dist/aos.css";
import { usePathname } from "next/navigation";
import { useEffect } from "react";

const BaseLayout = ({
  navbar = false,
  children,
  footer = true,
}: {
  navbar?: boolean;
  children: React.ReactNode;
  footer?: boolean;
}) => {
  const pathname = usePathname();

  useEffect(() => {
    AOS.init();
  }, []);

  return (
    <main
      className={`w-full hide-scrollbar select-none ${pathname === "/" ? "overflow-x-hidden" : ""}`}
    >
      {navbar && <Navbar />}
      {children}
      {footer && <Footer />}
    </main>
  );
};

export default BaseLayout;
