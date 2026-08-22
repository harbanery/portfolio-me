"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { ArrowUp } from "lucide-react";

/**
 * Scroll-to-top button pinned to the left edge of the viewport.
 * Appears once the About section (the first section after the hero) is in
 * view, and hides again on the hero itself.
 */

const ScrollToTop = () => {
  const pathname = usePathname();
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    // Deferred into a frame to avoid synchronous state updates in the
    // effect body.
    let frame: number | null = null;

    const sync = () => {
      const about = document.getElementById("about");
      setVisible(
        !!about &&
          about.getBoundingClientRect().top <= window.innerHeight * 0.5,
      );
    };

    const reveal = requestAnimationFrame(() => sync());

    const handleScroll = () => {
      if (frame !== null) return;
      frame = requestAnimationFrame(() => {
        sync();
        frame = null;
      });
    };

    window.addEventListener("scroll", handleScroll, { passive: true });

    return () => {
      cancelAnimationFrame(reveal);
      window.removeEventListener("scroll", handleScroll);
      if (frame !== null) cancelAnimationFrame(frame);
    };
  }, [pathname]);

  const scrollTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <button
      onClick={scrollTop}
      aria-label="Scroll back to top"
      className={`fixed left-5 bottom-3 z-40 flex h-11 w-11 items-center justify-center rounded-full border border-white/15 bg-black/60 text-gray-400 backdrop-blur-md transition-all duration-500 hover:border-white/40 hover:text-white ${
        visible
          ? "translate-y-0 opacity-100"
          : "pointer-events-none translate-y-4 opacity-0"
      }`}
    >
      <ArrowUp size={18} />
    </button>
  );
};

export default ScrollToTop;
