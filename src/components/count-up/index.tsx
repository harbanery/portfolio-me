"use client";

import { useEffect, useRef, useState } from "react";

interface CountUpProps {
  /** Target number to reach. */
  to: number;
  /** Rendered while the component is still invisible / mounting. */
  fallback?: string;
  /** Extra className forwarded to the outer <span>. */
  className?: string;
}

/**
 * Renders a number that counts from 0 to `to` once the element enters
 * the viewport. Uses a single `requestAnimationFrame` loop with
 * `ease-in-out` timing over 500 ms — no external library.
 */
const CountUp = ({ to, fallback, className }: CountUpProps) => {
   const ref = useRef<HTMLSpanElement>(null);
   const [display, setDisplay] = useState(fallback ?? `${to}`);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    let started = false;
    let raf: number;
    const duration = 500;

    const ease = (t: number) => (t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2);

    const tick = (start: number) => {
      const elapsed = performance.now() - start;
      const progress = Math.min(elapsed / duration, 1);
      setDisplay(`${Math.round(ease(progress) * to)}`);
      if (progress < 1) raf = requestAnimationFrame(() => tick(start));
    };

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (started || !entry.isIntersecting) return;
        started = true;
        raf = requestAnimationFrame(() => tick(performance.now()));
      },
      { threshold: 0.25 },
    );

    observer.observe(el);
    return () => {
      observer.disconnect();
      cancelAnimationFrame(raf);
    };
  }, [to]);

  return (
    <span ref={ref} className={className}>
      {display}
    </span>
  );
};

export default CountUp;
