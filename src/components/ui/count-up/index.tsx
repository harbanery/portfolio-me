"use client";

import { useEffect, useRef, useState } from "react";

interface CountUpProps {
  /** Target number to reach. */
  to: number;
  /** Rendered while the animation has not started yet (SSR / pre-reveal). */
  fallback?: string;
  /** Suffix appended to every rendered number (e.g. "+" renders "2+"). */
  suffix?: string;
  /** Extra milliseconds to wait before counting — pass the parent's
   *  reveal delay so the count begins only after the reveal finishes. */
  delay?: number;
  /** Extra className forwarded to the outer <span>. */
  className?: string;
}

/** Site-wide scroll-reveal duration (see `[data-aos]` in index.css). */
const REVEAL_DURATION = 500;
/** Count duration, matching every other animation on the site. */
const COUNT_DURATION = 500;

/**
 * Renders a number that counts from 0 to `to`. The count starts only
 * after the element has entered the viewport AND the surrounding
 * scroll-reveal has finished (`REVEAL_DURATION + delay`), so the number
 * never animates behind a still-fading section. Uses a single rAF loop
 * with ease-in-out timing — no external library.
 */
const CountUp = ({ to, fallback, delay = 0, suffix, className }: CountUpProps) => {
  const ref = useRef<HTMLSpanElement>(null);
  const [display, setDisplay] = useState(fallback ?? `${to}${suffix ?? ""}`);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    let started = false;
    let raf: number;
    let timer: ReturnType<typeof setTimeout>;

    /** ease-in-out (cubic): slow start, fast middle, slow end. */
    const ease = (t: number) =>
      t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2;

    const tick = (start: number) => {
      const elapsed = performance.now() - start;
      const progress = Math.min(elapsed / COUNT_DURATION, 1);
      setDisplay(`${Math.round(ease(progress) * to)}${suffix ?? ""}`);
      if (progress < 1) raf = requestAnimationFrame(() => tick(start));
    };

    const startCount = () => {
      // Wait out the reveal first: duration + the element's delay.
      const wait = REVEAL_DURATION + delay;
      if (wait <= 0) {
        raf = requestAnimationFrame(() => tick(performance.now()));
        return;
      }
      timer = setTimeout(() => {
        raf = requestAnimationFrame(() => tick(performance.now()));
      }, wait);
    };

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (started || !entry.isIntersecting) return;
        started = true;
        startCount();
      },
      { threshold: 0.25 },
    );

    observer.observe(el);
    return () => {
      observer.disconnect();
      clearTimeout(timer);
      cancelAnimationFrame(raf);
    };
  }, [to, delay, suffix]);

  return (
    <span ref={ref} className={className}>
      {display}
    </span>
  );
};

export default CountUp;
