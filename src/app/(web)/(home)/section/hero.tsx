"use client";

import { useEffect, useState } from "react";
import { ArrowRight, ChevronDown, MessageSquare } from "lucide-react";
import CountUp from "@/components/count-up";
import IntroSection from "./intro";
import { StarsBackground } from "@/components/effects/bg-stars";
import { ShootingStars } from "@/components/effects/shooting-stars";

interface HeroStat {
  value: string;
  label: string;
}

interface HeroSectionProps {
  name?: string;
  lead?: string;
  stats?: HeroStat[];
}

/** Fallback lead while public/data/me.en.json is unavailable. */
const DEFAULT_LEAD =
  "Fullstack Developer building <strong>scalable web applications</strong>. I develop <span>production-grade systems</span> with Next.js, TypeScript, and Golang.";

/** Focus line, aligned with the Fullstack Developer profile. */
const FOCUS_LINE =
  "Fullstack web development. Scalable frontend platforms. Performance-focused engineering.";

const HeroSection = ({ name, lead, stats = [] }: HeroSectionProps) => {
  const [showIntro, setShowIntro] = useState(true);

  useEffect(() => {
    if (showIntro) {
      document.body.style.overflow = "hidden";
      document.documentElement.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
      document.documentElement.style.overflow = "";
    }

    return () => {
      document.body.style.overflow = "";
      document.documentElement.style.overflow = "";
    };
  }, [showIntro]);

  const handleIntroComplete = () => {
    setShowIntro(false);
  };

  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  };

  const fullName = (name ?? "Raihan Yusuf").trim();
  const nameParts = fullName.split(/\s+/);
  const firstName = (nameParts[0] ?? "").toUpperCase();
  const lastName = nameParts.slice(1).join(" ").toUpperCase();

  // Mobile stat columns follow the surviving stat count (stats with a
  // zero value are dropped by the page): 3 → thirds, 2 → halves, 1 → full.
  const statColumnsClass =
    stats.length === 3
      ? "grid-cols-3"
      : stats.length === 2
        ? "grid-cols-2"
        : "grid-cols-1";

  return (
    <>
      {showIntro && <IntroSection onComplete={handleIntroComplete} />}
      <section
        id="hero"
        className={`relative min-h-screen bg-black flex items-center transition-opacity duration-1000 ${
          showIntro ? "opacity-0" : "opacity-100"
        }`}
      >
        <StarsBackground className="pointer-events-none" />
        <ShootingStars className="pointer-events-none" />

        <div className="mx-auto w-full max-w-6xl px-6 lg:px-10 py-28">
          {/* Two columns only while stats exist; zero-valued stats are
              dropped by the page, and an empty list removes the right
              column entirely so the identity block takes full width. */}
          <div
            className={`grid items-center gap-16 ${
              stats.length > 0 ? "lg:grid-cols-[1.6fr_1fr]" : ""
            }`}
          >
            {/* Left: identity — the full status row (availability, location,
                local time) lives in the navbar on the home route. */}
            <div className="min-w-0">
              {/* Name */}
              <h1 className="font-inter font-extrabold text-white leading-[0.95] tracking-tight">
                <span
                  data-aos="fade-up"
                  data-aos-delay="100"
                  className="block text-[clamp(3rem,9vw,6.5rem)]"
                >
                  {firstName}
                </span>
                {lastName && (
                  <span
                    data-aos="fade-up"
                    data-aos-delay="200"
                    className="block text-[clamp(3rem,9vw,6.5rem)]"
                  >
                    {lastName}
                    {/* Accent strip — same treatment as the side-menu rules. */}
                    <span className="ml-5 inline-block h-[0.055em] w-[1.05em] translate-y-[-0.14em] bg-[#DEB887]" />
                  </span>
                )}
              </h1>

              {/* Lead — rich text: <strong> emphasis, <span> italic accent.
                  No paragraph-wrapper here on purpose: it underlines spans. */}
              <div data-aos="fade-up" data-aos-delay="300" className="mt-8">
                <p
                  className="text-base sm:text-lg md:text-xl text-gray-400 font-neue-haas text-balance tracking-wide leading-relaxed [&_span]:font-medium [&_span]:italic [&_span]:text-[#DEB887] [&_strong]:font-medium [&_strong]:text-white"
                  dangerouslySetInnerHTML={{ __html: lead ?? DEFAULT_LEAD }}
                />
              </div>

              {/* Focus line */}
              <p
                data-aos="fade-up"
                data-aos-delay="350"
                className="mt-4 text-sm md:text-base text-gray-500 font-neue-haas font-light text-balance tracking-wide leading-relaxed"
              >
                {FOCUS_LINE}
              </p>

              {/* CTAs */}
              <div
                data-aos="fade-up"
                data-aos-delay="400"
                data-aos-offset="0"
                className="mt-10 flex flex-wrap items-center gap-4"
              >
                <button
                  onClick={() => scrollTo("contact")}
                  className="group inline-flex cursor-pointer items-center gap-2.5 rounded-full bg-[#DEB887] px-6 py-3 text-xs sm:px-7 sm:py-3.5 sm:text-sm md:px-8 md:py-4 font-martian-mono font-semibold tracking-wider text-[#241B0E] hover:bg-[#E6CC9E] hover:shadow-[0_8px_24px_-8px_rgba(222,184,135,0.55)] transition-[background-color,box-shadow] duration-500"
                >
                  <MessageSquare
                    size={15}
                    strokeWidth={3}
                    className="transition-transform duration-500 group-hover:-translate-x-1 group-hover:-translate-y-1 group-hover:-rotate-45"
                  />
                  START A CONVERSATION
                </button>
                <button
                  onClick={() => scrollTo("projects")}
                  className="group inline-flex cursor-pointer items-center gap-2.5 rounded-full border border-white/20 px-6 py-3 text-xs sm:px-7 sm:py-3.5 sm:text-sm md:px-8 md:py-4 font-martian-mono tracking-wider text-white hover:border-white/50 transition-colors duration-500"
                >
                  VIEW PROJECTS
                  <ArrowRight
                    size={15}
                    className="transition-transform duration-500 group-hover:translate-x-1"
                  />
                </button>
              </div>

              {/* Stats — compact row for tablet/mobile (the desktop
                  sidebar column below takes over from lg). Same count-up
                  behavior and delay as the desktop block. Hidden entirely
                  when no stat qualifies (all values zero / no data). */}
              {stats.length > 0 && (
                <dl
                  data-aos="fade-up"
                  data-aos-delay="450"
                  data-aos-offset="0"
                  className={`mt-12 grid ${statColumnsClass} gap-x-4 gap-y-5 border-t border-white/10 pt-8 sm:gap-x-6 lg:hidden`}
                >
                  {stats.map((stat) => (
                    <div key={stat.label} className="min-w-0">
                      <dt className="font-inter text-2xl sm:text-3xl font-bold tracking-tight text-white">
                        <CountUp
                          to={Number(stat.value)}
                          fallback={stat.value}
                          delay={showIntro ? 5 : 0}
                        />
                      </dt>
                      <dd className="mt-1.5 text-[9px] sm:text-[10px] font-martian-mono uppercase leading-relaxed tracking-[0.2em] text-gray-500">
                        {stat.label}
                      </dd>
                    </div>
                  ))}
                </dl>
              )}
            </div>

            {/* Right: stats — the count starts after this block's AOS
                reveal finishes (delay 450 + duration 500), plus the intro
                splash time so the numbers are never counted behind it. */}
            {stats.length > 0 && (
              <div
                data-aos="fade-left"
                data-aos-delay="450"
                className="hidden lg:block"
              >
                <dl className="divide-y divide-white/10 border-y border-white/10">
                  {stats.map((stat) => (
                    <div
                      key={stat.label}
                      className="group py-6 first:pt-7 last:pb-7 transition-colors"
                    >
                      <dt className="font-inter text-3xl font-bold tracking-tight text-white transition-colors group-hover:text-[#DEB887]">
                        <CountUp
                          to={Number(stat.value)}
                          fallback={stat.value}
                          delay={showIntro ? 5 : 0}
                        />
                      </dt>
                      <dd className="mt-2 text-[10px] font-martian-mono uppercase tracking-[0.25em] text-gray-500">
                        {stat.label}
                      </dd>
                    </div>
                  ))}
                </dl>
              </div>
            )}
          </div>
        </div>

        {/* Scroll indicator */}
        <button
          onClick={() => scrollTo("about")}
          aria-label="Scroll to about"
          data-aos="fade-up"
          data-aos-delay="600"
          data-aos-offset="0"
          className="absolute bottom-8 left-1/2 -translate-x-1/2 cursor-pointer text-gray-500 hover:text-white transition-colors"
        >
          <ChevronDown className="animate-bounce" size={20} />
        </button>
      </section>
    </>
  );
};

export default HeroSection;
