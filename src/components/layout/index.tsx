"use client";

import Aos from "aos";
import Footer from "../footer";
import Navbar from "../navbar";
import SideMenu from "../side-menu";
import ScrollToTop from "../scroll-to-top";
import "aos/dist/aos.css";
import { usePathname } from "next/navigation";
import { useEffect } from "react";
import type { AvailabilityStatus } from "../navbar";

const BaseLayout = ({
  navbar = false,
  children,
  footer = true,
  locationLabel,
  availability,
}: {
  navbar?: boolean;
  children: React.ReactNode;
  footer?: boolean;
  locationLabel?: string;
  availability?: AvailabilityStatus | null;
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
      {navbar && <Navbar locationLabel={locationLabel} availability={availability} />}
      {/* Vertical section menu on the right edge — renders itself only on
          the home route. */}
      {navbar && <SideMenu />}
      {/* Scroll-to-top on the left edge — appears from the About section. */}
      {navbar && <ScrollToTop />}
      {children}
      {footer && <Footer />}
    </main>
  );
};

export default BaseLayout;
