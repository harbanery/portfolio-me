"use client";

import { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import { menuSections } from "@/models/menu";

/**
 * Vertical section menu pinned to the right edge of the viewport
 * (home route only). Separate from the navbar: it owns its scroll-spy
 * (active section renders brighter) and its reveal animation.
 */

/** Viewport fraction that marks the "current" reading position. */
const ACTIVE_LINE_RATIO = 0.35;

const SideMenu = () => {
  const pathname = usePathname();
  const isHome = pathname === "/";
  const [activeId, setActiveId] = useState<string | null>(null);
  const [visible, setVisible] = useState(false);
  const frame = useRef<number | null>(null);

  useEffect(() => {
    if (!isHome) return;

    // Reveal after hydration with a single CSS transition (no AOS).
    const reveal = requestAnimationFrame(() => setVisible(true));

    /** Mark the section crossing the active line as current. */
    const syncActive = () => {
      const line = window.innerHeight * ACTIVE_LINE_RATIO;
      // None active until a section actually crosses the line — the hero
      // viewport is not part of any menu item (not even "About").
      let current: string | null = null;

      for (const section of menuSections) {
        const el = document.getElementById(section.id);
        if (!el) continue;
        // Sections are ordered; the last one whose top crossed the line wins.
        if (el.getBoundingClientRect().top <= line) {
          current = section.id;
        }
      }

      setActiveId(current);
    };

    /** rAF-throttled scroll handler. */
    const handleScroll = () => {
      if (frame.current !== null) return;
      frame.current = requestAnimationFrame(() => {
        syncActive();
        frame.current = null;
      });
    };

    syncActive();
    window.addEventListener("scroll", handleScroll, { passive: true });

    return () => {
      cancelAnimationFrame(reveal);
      window.removeEventListener("scroll", handleScroll);
      if (frame.current !== null) cancelAnimationFrame(frame.current);
    };
  }, [isHome]);

  if (!isHome) return null;

  const goToSection = (id: string) => {
    document
      .getElementById(id)
      ?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <nav
      aria-label="Section navigation"
      className={`fixed right-5 top-1/2 -translate-y-1/2 z-40 hidden xl:flex flex-col items-end gap-4 transition-all duration-1000 ease-out ${
        visible ? "translate-x-0 opacity-100" : "translate-x-4 opacity-0"
      }`}
    >
      {menuSections.map((section) => {
        const isActive = activeId === section.id;
        return (
          <button
            key={section.id}
            onClick={() => goToSection(section.id)}
            aria-current={isActive ? "true" : undefined}
            className={`group flex cursor-pointer items-center gap-2 text-[10px] uppercase tracking-[0.25em] font-inter font-medium transition-colors duration-300 ${
              isActive
                ? "text-[#DEB887]"
                : "text-gray-600 hover:text-white"
            }`}
          >
            <span
              className={`h-px transition-all duration-300 ${
                isActive
                  ? "w-5 bg-[#DEB887]"
                  : "w-0 bg-[#DEB887] group-hover:w-4"
              }`}
            />
            {section.name}
          </button>
        );
      })}
    </nav>
  );
};

export default SideMenu;
