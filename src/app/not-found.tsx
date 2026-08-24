"use client";

import { StarsBackground } from "@/components/effects/bg-stars";
import { ShootingStars } from "@/components/effects/shooting-stars";
import { NightOceanSimple } from "@/components/effects/night-ocean";
import { ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";

const RootNotFound = () => {
  const router = useRouter();

  /** Prefer the browser history; fall back home on a fresh tab. */
  const goBack = () => {
    if (globalThis.history.length > 2) {
      router.back();
    } else {
      router.replace("/");
    }
  };

  return (
    <div className="relative min-h-screen w-full overflow-hidden select-none">
      {/* Layer 1: Night Ocean Background */}
      <div className="absolute inset-0 z-0">
        <NightOceanSimple />
      </div>

      {/* Layer 2: Background stars & shooting stars */}
      <div className="absolute inset-0 z-10">
        <StarsBackground className="pointer-events-none" />
        <ShootingStars className="pointer-events-none" />
      </div>

      {/* 404 message — same editorial heading + pill button language as
          the rest of the site. Animations run on Tailwind keyframes (see
          index.css). */}
      <div className="absolute inset-0 flex flex-col items-center justify-center z-50 text-center px-4 animate-[rise-in_0.5s_ease-in-out_1s_both]">
        <p className="mb-6 font-martian-mono text-xs uppercase tracking-[0.25em] text-gray-500">
          Error 404
        </p>

        <h1 className="mb-6 font-inter font-extrabold text-white leading-[1.02] tracking-tight text-[clamp(2.75rem,7vw,4.5rem)] animate-[pop-in_0.5s_ease-in-out_1.5s_both]">
          Lost in{" "}
          <span className="bg-gradient-to-r from-cyan-700 via-blue-400 to-cyan-900 bg-[length:200%_auto] bg-clip-text text-transparent animate-ocean-text">
            Ocean
          </span>
          .
        </h1>

        <p className="mb-10 max-w-xl text-lg md:text-xl font-neue-haas font-light tracking-wider leading-relaxed text-white/60 animate-[soft-fade_0.5s_ease-in-out_2.5s_both]">
          The page you&apos;re looking for doesn&apos;t exist or may have
          drifted elsewhere. Head back home and keep exploring from there.
        </p>

        <div className="flex flex-wrap items-center justify-center gap-4 animate-[soft-fade_0.5s_ease-in-out_3s_both]">
          <button
            onClick={goBack}
            className="group inline-flex cursor-pointer items-center gap-2.5 rounded-full border border-white/20 px-8 py-4 text-sm font-martian-mono tracking-wider text-white hover:border-white/50 transition-colors duration-500"
          >
            <ArrowLeft
              size={16}
              className="transition-transform duration-500 group-hover:-translate-x-1"
            />
            GO BACK
          </button>
        </div>
      </div>

      {/* Layer 6: Fade-in overlay */}
      <div className="absolute inset-0 bg-black pointer-events-none z-60 animate-[fade-out-overlay_0.5s_ease-in-out_both]" />

      {/* Layer 5: Atmospheric effects */}
      <div className="absolute inset-0 z-50 pointer-events-none">
        {/* Depth haze */}
        <div
          className="absolute bottom-0 left-0 right-0 h-48"
          style={{
            background:
              "linear-gradient(to top, rgba(0, 50, 100, 0.05) 0%, transparent)",
            filter: "blur(30px)",
          }}
        />
      </div>
    </div>
  );
};

export default RootNotFound;
