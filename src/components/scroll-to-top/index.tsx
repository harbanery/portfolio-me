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
      className={`group fixed bottom-3 left-5 z-40 flex cursor-pointer items-center gap-2 rounded-full border border-white/15 bg-black/60 py-2 pl-3 pr-3 text-gray-400 backdrop-blur-md transition-all duration-500 hover:border-white/40 hover:text-white ${
        visible
          ? "translate-y-0 opacity-100"
          : "pointer-events-none translate-y-4 opacity-0"
      }`}
    >
      <ArrowUp
        size={18}
        className="transition-transform duration-300 group-hover:-translate-y-0.5"
      />
      {/* Short label — expands out on hover, hidden on the smallest
          screens so the pill stays compact. */}
      <span className="hidden max-w-0 overflow-hidden text-[10px] uppercase tracking-[0.2em] font-martian-mono text-nowrap opacity-0 transition-[max-width,opacity] duration-300 group-hover:max-w-[8rem] group-hover:opacity-100 sm:inline">
        Back to top
      </span>
    </button>
  );
};

export default ScrollToTop;
