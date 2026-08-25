"use client";

import { useEffect, useRef, useState } from "react";

interface CountUpProps {
  /** Target number to reach. */
  to: number;
  /** Rendered while the animation has not started yet (SSR / pre-AOS). */
  fallback?: string;
  /** Extra milliseconds to wait before counting — pass the parent's
   *  AOS delay so the count begins only after the reveal finishes. */
  delay?: number;
  /** Extra className forwarded to the outer <span>. */
  className?: string;
}

/** Site-wide AOS duration (see Aos.init in components/layout). */
const AOS_DURATION = 500;
/** Count duration, matching every other animation on the site. */
const COUNT_DURATION = 500;

/**
 * Renders a number that counts from 0 to `to`. The count starts only
 * after the element has entered the viewport AND the surrounding AOS
 * reveal has finished (`AOS_DURATION + delay`), so the number never
 * animates behind a still-fading section. Uses a single rAF loop with
 * ease-in-out timing — no external library.
 */
const CountUp = ({ to, fallback, delay = 0, className }: CountUpProps) => {
  const ref = useRef<HTMLSpanElement>(null);
  const [display, setDisplay] = useState(fallback ?? `${to}`);

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
      setDisplay(`${Math.round(ease(progress) * to)}`);
      if (progress < 1) raf = requestAnimationFrame(() => tick(start));
    };

    const startCount = () => {
      // Wait out the AOS reveal first: duration + the element's delay.
      const wait = AOS_DURATION + delay;
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
  }, [to, delay]);

  return (
    <span ref={ref} className={className}>
      {display}
    </span>
  );
};

export default CountUp;
