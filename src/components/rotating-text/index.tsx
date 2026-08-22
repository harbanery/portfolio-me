"use client";

import { useEffect, useRef, useState } from "react";

/** How long each item stays before swapping (ms) — matches the navbar
 *  Bogor/Jakarta city loop. */
const SWAP_INTERVAL = 3200;

/** Crossfade duration — leaving items are released back to their parked
 *  spot after this. */
const TRANSITION_MS = 800;

/**
 * Crossfading text loop with a consistent upward motion: the incoming item
 * slides up into view from below while the outgoing one slides up and out
 * above, both fading. Every item shares one grid cell, so the container
 * keeps the widest item's width and nothing shifts around it.
 *
 * After a swap, the leaving item settles back to the "waiting below"
 * position while fully transparent — invisible, so the next entry always
 * rises from below.
 */
const RotatingText = ({
  items,
  className,
}: {
  items: string[];
  className?: string;
}) => {
  const [index, setIndex] = useState(0);
  const [leaving, setLeaving] = useState<number | null>(null);
  const releaseTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (items.length < 2) return;

    const id = setInterval(() => {
      setIndex((current) => {
        if (releaseTimer.current) clearTimeout(releaseTimer.current);
        setLeaving(current);
        releaseTimer.current = setTimeout(
          () => setLeaving(null),
          TRANSITION_MS,
        );
        return (current + 1) % items.length;
      });
    }, SWAP_INTERVAL);

    return () => {
      clearInterval(id);
      if (releaseTimer.current) clearTimeout(releaseTimer.current);
    };
  }, [items.length]);

  if (items.length === 0) return null;
  if (items.length === 1) {
    return <span className={className}>{items[0]}</span>;
  }

  return (
    <span className={`relative inline-grid overflow-hidden ${className ?? ""}`}>
      {items.map((item, itemIndex) => {
        const isActive = itemIndex === index;
        const isLeaving = itemIndex === leaving;
        return (
          <span
            key={item}
            aria-hidden={!isActive}
            className="[grid-area:1/1] motion-safe:transition-[opacity,transform] motion-safe:duration-[800ms] motion-safe:ease-[cubic-bezier(0.65,0,0.35,1)]"
            style={{
              opacity: isActive ? 1 : 0,
              transform: isActive
                ? "translateY(0)"
                : `translateY(${isLeaving ? -70 : 70}%)`,
            }}
          >
            {item}
          </span>
        );
      })}
    </span>
  );
};

export default RotatingText;
