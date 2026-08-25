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
import { buildMenuSections, type MenuSection } from "@/models/menu";

const BaseLayout = ({
  navbar = false,
  children,
  footer = true,
  locationLabel,
  availability,
  cvUrl,
  cvName,
  name,
  sections,
}: {
  navbar?: boolean;
  children: React.ReactNode;
  footer?: boolean;
  locationLabel?: string;
  availability?: AvailabilityStatus | null;
  /** Primary CV from the database — navbar download button. */
  cvUrl?: string | null;
  /** Display name of the CV file — navbar download button. */
  cvName?: string | null;
  /** Profile name for the navbar brand on non-home pages. */
  name?: string | null;
  /** Home menu sections; hidden sections (no data) are omitted by the page. */
  sections?: MenuSection[];
}) => {
  const pathname = usePathname();
  const menuSections = sections ?? buildMenuSections();

  const shouldScrollToTop =
    pathname === "/" ||
    pathname === "/experience" ||
    pathname.includes("/projects/");

  useEffect(() => {
    // Global AOS: 0.5s ease-in-out, matching every other animation.
    Aos.init({ duration: 500, easing: 'ease-in-out' });

    // Scroll to top when on home page — "instant" opts out of the global
    // CSS smooth scrolling so route changes never animate the jump.
    if (shouldScrollToTop) {
      window.scrollTo({ top: 0, left: 0, behavior: "instant" });
    }
  }, [pathname, shouldScrollToTop]);

  return (
    <main className="w-full hide-scrollbar select-none overflow-x-clip">
      {navbar && (
        <Navbar
          locationLabel={locationLabel}
          availability={availability}
          cvUrl={cvUrl}
          cvName={cvName}
          name={name}
          sections={menuSections}
        />
      )}
      {/* Vertical section menu on the right edge — renders itself only on
          the home route. */}
      {navbar && <SideMenu sections={menuSections} />}
      {/* Scroll-to-top on the left edge — appears from the About section. */}
      {navbar && <ScrollToTop />}
      {children}
      {footer && <Footer />}
    </main>
  );
};

export default BaseLayout;
