"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";

/** Viewport offset where the aside sticks — must match `md:top-28` (7rem). */
const STICKY_TOP_PX = 112;

/**
 * Sticky aside that eases in and out of its stuck state. `position: sticky`
 * alone snaps the moment it engages; toggling a small translate with a
 * transition makes the column follow the viewport with a smooth motion.
 *
 * A zero-height sentinel is placed at the top of the parent element and
 * observed against a rootMargin-shifted viewport, mirroring exactly when
 * the sticky column starts and stops following the screen.
 */
const SmoothSticky = ({ children }: { children: ReactNode }) => {
  const ref = useRef<HTMLDivElement>(null);
  const [stuck, setStuck] = useState(false);

  useEffect(() => {
    const parent = ref.current?.parentElement;
    if (!parent) return;

    const sentinel = document.createElement("div");
    sentinel.setAttribute("aria-hidden", "true");
    sentinel.style.cssText =
      "position:absolute;top:0;left:0;width:100%;height:1px;pointer-events:none;";
    parent.prepend(sentinel);

    const observer = new IntersectionObserver(
      ([entry]) => setStuck(!entry.isIntersecting),
      { rootMargin: `-${STICKY_TOP_PX}px 0px 0px 0px` },
    );
    observer.observe(sentinel);

    return () => {
      observer.disconnect();
      sentinel.remove();
    };
  }, []);

  return (
    <div
      ref={ref}
      className={`min-w-0 md:sticky md:top-28 md:self-start md:pb-1.5 motion-safe:md:transition-transform motion-safe:md:duration-500 motion-safe:md:ease-in-out ${
        stuck ? "md:-translate-y-3" : "md:translate-y-0"
      }`}
    >
      {children}
    </div>
  );
};

export default SmoothSticky;
