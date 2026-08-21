"use client";

import { useEffect, useState } from "react";
import { logoMap } from "@/models/icons";
import { masterDataMap } from "@/models/master-data";

interface SkillsMarqueeSectionProps {
  skills?: string[];
}

/** Marquee duration while the page is idle (matches --animate-scroll). */
const SLOW_DURATION_SECONDS = 60;

/** Marquee duration while the user is scrolling. */
const FAST_DURATION_SECONDS = 10;

/** Idle time after the last scroll event before slowing down again (ms). */
const SCROLL_IDLE_RESET_MS = 250;

/**
 * "Technologies I work with" marquee — same band pattern as the
 * OrganisationsSection, but with tool logos instead of text.
 *
 * Crawls slowly by default and speeds up while the page is being scrolled
 * (inline `animation-duration` overrides the theme value).
 */
const SkillsMarqueeSection = ({ skills = [] }: SkillsMarqueeSectionProps) => {
  const [isScrolling, setIsScrolling] = useState(false);

  useEffect(() => {
    let resetTimer: ReturnType<typeof setTimeout> | null = null;
    let ticking = false;

    const handleScroll = () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(() => {
        setIsScrolling(true);

        if (resetTimer) clearTimeout(resetTimer);
        resetTimer = setTimeout(
          () => setIsScrolling(false),
          SCROLL_IDLE_RESET_MS,
        );

        ticking = false;
      });
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", handleScroll);
      if (resetTimer) clearTimeout(resetTimer);
    };
  }, []);

  const skillList = skills
    .filter((skill) => logoMap[skill])
    .map((skill) => ({
      key: skill,
      icon: logoMap[skill],
      name: masterDataMap[skill]?.name || skill,
    }));

  if (skillList.length === 0) return null;

  return (
    <section
      aria-label="Technologies I work with"
      className="relative bg-black border-y border-white/10 py-10"
    >
      <div className="group relative overflow-hidden">
        <div className="bg-linear-to-r from-black from-0% to-transparent to-100% absolute left-0 z-10 w-4/12 h-full pointer-events-none" />
        <div className="bg-linear-to-l from-black from-0% to-transparent to-100% absolute right-0 z-10 w-4/12 h-full pointer-events-none" />
        {/* Track pauses while any skill is hovered (group-hover) so a logo
            can be inspected without scrolling away. */}
        <div
          className="flex w-max animate-scroll items-center gap-16 md:gap-24 pr-16 md:pr-24 group-hover:[animation-play-state:paused]"
          style={{
            animationDuration: `${isScrolling ? FAST_DURATION_SECONDS : SLOW_DURATION_SECONDS}s`,
          }}
        >
          {[...skillList, ...skillList].map((item, index) => (
            <span
              key={`${item.key}-${index + 1}`}
              title={item.name}
              className="flex items-center gap-16 md:gap-24 text-gray-500 hover:text-white transition-colors duration-300 whitespace-nowrap"
            >
              <item.icon size={36} className="shrink-0" />
              <span className="h-1 w-1 rounded-full bg-gray-700" />
            </span>
          ))}
        </div>
      </div>
    </section>
  );
};

export default SkillsMarqueeSection;
