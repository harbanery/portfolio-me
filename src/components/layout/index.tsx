"use client";

import Aos from "aos";
import Footer from "../footer";
import Navbar from "../navbar";
import SideMenu from "../side-menu";
import "aos/dist/aos.css";
import { usePathname } from "next/navigation";
import { useEffect } from "react";

const BaseLayout = ({
  navbar = false,
  children,
  footer = true,
  locationLabel,
}: {
  navbar?: boolean;
  children: React.ReactNode;
  footer?: boolean;
  locationLabel?: string;
}) => {
  const pathname = usePathname();

  const shouldScrollToTop =
    pathname === "/" ||
    pathname === "/experience" ||
    pathname.includes("/projects/");

  useEffect(() => {
    Aos.init();

    // Scroll to top when on home page
    if (shouldScrollToTop) {
      window.scrollTo(0, 0);
    }
  }, [pathname, shouldScrollToTop]);

  return (
    <main className="w-full hide-scrollbar select-none overflow-x-clip">
      {navbar && <Navbar locationLabel={locationLabel} />}
      {/* Vertical section menu on the right edge — renders itself only on
          the home route. */}
      {navbar && <SideMenu />}
      {children}
      {footer && <Footer />}
    </main>
  );
};

export default BaseLayout;
