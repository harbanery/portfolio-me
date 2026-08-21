"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowRight, ChevronDown, MessageSquare } from "lucide-react";
import IntroSection from "./intro";
import { StarsBackground } from "@/components/effects/bg-stars";
import { ShootingStars } from "@/components/effects/shooting-stars";

const formatClock = () =>
  `${new Date().toLocaleTimeString("en-GB", {
    hour12: false,
    timeZone: "Asia/Jakarta",
  })} GMT+7`;

interface HeroSectionProps {
  name?: string;
  stats?: Array<{ value: string; label: string }>;
}

const DEFAULT_STATS: Array<{ value: string; label: string }> = [
  { value: "25,000 km", label: "DWDM backbone operated on" },
  { value: "3 layers", label: "AI, data platform, agents built from zero" },
  { value: "6+ years", label: "Across five industries" },
];

const HeroSection = ({ name, stats = DEFAULT_STATS }: HeroSectionProps) => {
  const router = useRouter();
  const [showIntro, setShowIntro] = useState(true);
  const [clock, setClock] = useState<string | null>(null);

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

  useEffect(() => {
    // Deferred into a frame to avoid synchronous state updates in the effect.
    const raf = requestAnimationFrame(() => setClock(formatClock()));
    const id = setInterval(() => setClock(formatClock()), 1000);
    return () => {
      cancelAnimationFrame(raf);
      clearInterval(id);
    };
  }, []);

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

        <div className="mx-auto w-full max-w-6xl px-6 lg:px-10 py-24">
          <div className="grid items-center gap-16 lg:grid-cols-[1.6fr_1fr]">
            {/* Left: identity */}
            <div className="min-w-0">
              {/* Status row */}
              <div
                data-aos="fade-up"
                className="mb-8 flex flex-wrap items-center gap-x-5 gap-y-2"
              >
                <span className="flex items-center gap-2.5">
                  <span className="relative flex h-2 w-2">
                    <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#DEB887] opacity-60" />
                    <span className="relative inline-flex h-2 w-2 rounded-full bg-[#DEB887]" />
                  </span>
                  <span className="text-xs uppercase tracking-[0.2em] text-[#DEB887]">
                    Available for work
                  </span>
                </span>
                <span className="hidden h-3 w-px bg-white/15 sm:block" />
                <span className="text-xs uppercase tracking-[0.2em] text-gray-400">
                  Jakarta, Indonesia
                </span>
                <span className="hidden h-3 w-px bg-white/15 sm:block" />
                <span
                  className="text-xs uppercase tracking-[0.2em] text-gray-400 tabular-nums"
                  suppressHydrationWarning
                >
                  {clock ?? "--:--:-- GMT+7"}
                </span>
              </div>

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
                    className="block text-[clamp(3rem,9vw,7.5rem)]"
                  >
                    {lastName}
                  </span>
                )}
              </h1>

              {/* Lead */}
              <p
                data-aos="fade-up"
                data-aos-delay="300"
                className="mt-8 max-w-[52ch] text-lg md:text-xl text-gray-400 font-neue-haas text-balance leading-relaxed"
              >
                Manager, AI Engineering at a 25,000 km DWDM fiber backbone
                operator. I build the AI function, the data platform, and the
                agent layer from zero.
              </p>

              {/* Focus line */}
              <p
                data-aos="fade-up"
                data-aos-delay="350"
                className="mt-4 text-sm md:text-base text-gray-500 font-neue-haas font-light text-balance leading-relaxed"
              >
                Multi-agent LLM systems. Medallion data platforms. Smart
                contract security research.
              </p>

              {/* CTAs */}
              <div
                data-aos="fade-up"
                data-aos-delay="400"
                className="mt-10 flex flex-wrap items-center gap-4"
              >
                <button
                  onClick={() => scrollTo("contact")}
                  className="inline-flex items-center gap-2.5 rounded-full bg-white px-8 py-4 text-sm font-inter font-semibold tracking-wider text-black hover:bg-gray-200 transition-colors duration-300"
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
                    <dt className="text-[10px] uppercase tracking-[0.25em] text-gray-500">
                      {stat.label}
                    </dt>
                    <dd className="mt-2 font-inter text-3xl font-bold tracking-tight text-white transition-colors group-hover:text-[#DEB887]">
                      {stat.value}
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
