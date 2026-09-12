"use client";

import { useSyncExternalStore } from "react";

/**
 * Live `prefers-reduced-motion` preference, read via `useSyncExternalStore`
 * (the sanctioned pattern — no setState-in-effect, SSR-safe: the server
 * snapshot is `false` and the real value is adopted right after hydration).
 *
 * Used by the canvas effects to swap their animation loops for static
 * frames when the visitor asks the OS for reduced motion.
 */
export function usePrefersReducedMotion(): boolean {
  return useSyncExternalStore(
    (onChange) => {
      const media = window.matchMedia("(prefers-reduced-motion: reduce)");
      media.addEventListener("change", onChange);
      return () => media.removeEventListener("change", onChange);
    },
    () => window.matchMedia("(prefers-reduced-motion: reduce)").matches,
    () => false,
  );
}
