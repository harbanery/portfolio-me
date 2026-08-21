"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowRight, ChevronDown, MessageSquare } from "lucide-react";
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
  "Fullstack Developer building scalable, user-friendly web applications. I develop production-grade frontend and backend systems with Next.js, TypeScript, and Golang.";

/** Focus line, aligned with the Fullstack Developer profile. */
const FOCUS_LINE =
  "Fullstack web development. Scalable frontend platforms. Performance-focused engineering.";

const DEFAULT_STATS: HeroStat[] = [
  { value: "9", label: "Projects delivered" },
  { value: "2", label: "Companies worked with" },
  { value: "2", label: "Years of professional experience" },
];

const HeroSection = ({
  name,
  lead,
  stats = DEFAULT_STATS,
}: HeroSectionProps) => {
  const router = useRouter();
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

        <div className="mx-auto w-full max-w-6xl px-6 lg:px-10 pt-28 pb-32">
          <div className="grid items-center gap-16 lg:grid-cols-[1.6fr_1fr]">
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
                    <span className="ml-4 inline-block h-[0.14em] w-[0.14em] translate-y-[-0.08em] rounded-full bg-[#DEB887]" />
                  </span>
                )}
              </h1>

              {/* Lead */}
              <p
                data-aos="fade-up"
                data-aos-delay="300"
                className="mt-8 max-w-[52ch] text-lg md:text-xl text-gray-400 font-neue-haas text-balance leading-relaxed"
              >
                {lead ?? DEFAULT_LEAD}
              </p>

              {/* Focus line */}
              <p
                data-aos="fade-up"
                data-aos-delay="350"
                className="mt-4 max-w-[52ch] text-sm md:text-base text-gray-500 font-neue-haas font-light text-balance leading-relaxed"
              >
                {FOCUS_LINE}
              </p>

              {/* CTAs */}
              <div
                data-aos="fade-up"
                data-aos-delay="400"
                className="mt-10 flex flex-wrap items-center gap-4"
              >
                <button
                  onClick={() => scrollTo("contact")}
                  className="inline-flex items-center gap-2.5 rounded-full bg-[#DEB887] px-8 py-4 text-sm font-inter font-semibold tracking-wider text-[#241B0E] hover:bg-[#E6CC9E] transition-colors duration-300"
                >
                  <MessageSquare size={16} />
                  START A CONVERSATION
                </button>
                <button
                  onClick={() => router.push("/projects")}
                  className="inline-flex items-center gap-2.5 rounded-full border border-white/20 px-8 py-4 text-sm font-inter font-semibold tracking-wider text-white hover:border-white/50 transition-colors duration-300"
                >
                  VIEW PROJECTS
                  <ArrowRight size={16} />
                </button>
              </div>
            </div>

            {/* Right: stats */}
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
                      {stat.value}
                    </dt>
                    <dd className="mt-2 text-[10px] uppercase tracking-[0.25em] text-gray-500">
                      {stat.label}
                    </dd>
                  </div>
                ))}
              </dl>
            </div>
          </div>
        </div>

        {/* Scroll indicator */}
        <button
          onClick={() => scrollTo("about")}
          aria-label="Scroll to about"
          data-aos="fade-up"
          data-aos-delay="600"
          data-aos-offset="0"
          className="absolute bottom-8 left-1/2 -translate-x-1/2 text-gray-500 hover:text-white transition-colors"
        >
          <ChevronDown className="animate-bounce" size={20} />
        </button>
      </section>
    </>
  );
};

export default HeroSection;
