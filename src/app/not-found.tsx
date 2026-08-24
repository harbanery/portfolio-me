"use client";

import { StarsBackground } from "@/components/effects/bg-stars";
import { ShootingStars } from "@/components/effects/shooting-stars";
import { NightOceanSimple } from "@/components/effects/night-ocean";
import { useRouter } from "next/navigation";

const RootNotFound = () => {
  const router = useRouter();
  return (
    <div className="relative min-h-screen w-full overflow-hidden">
      {/* Layer 1: Night Ocean Background */}
      <div className="absolute inset-0 z-0">
        <NightOceanSimple />
      </div>

      {/* Layer 2: Background stars & shooting stars */}
      <div className="absolute inset-0 z-10">
        <StarsBackground className="pointer-events-none" />
        <ShootingStars className="pointer-events-none" />
      </div>

      {/* Layer 5: 404 Message — Tailwind keyframe animations (see
          index.css). */}
      <div className="absolute inset-0 flex flex-col items-center justify-center z-50 text-center px-4 animate-[rise-in_2s_ease-out_1s_both]">
        <h1 className="text-9xl md:text-8xl font-bold font-neue-haas text-white mb-4 animate-[pop-in_1s_cubic-bezier(0.34,1.56,0.64,1)_1.5s_both]">
          404
        </h1>

        <h2 className="text-4xl font-light font-neue-haas text-white/80 mb-6 animate-[soft-fade_1s_ease-out_2s_both]">
          Lost at Ocean
        </h2>

        <p className="text-lg md:text-xl font-neue-haas text-white/60 mb-8 max-w-md animate-[soft-fade_1s_ease-out_2.5s_both]">
          The page you&apos;re looking for seems to have drifted away in the night.
        </p>

        <div className="animate-[soft-fade_1s_ease-out_3s_both] transition-transform duration-200 ease-out hover:scale-105 active:scale-95">
          <button
            onClick={() => {
              if (globalThis.history.length > 2) {
                router.back();
              } else {
                router.replace("/");
              }
            }}
            className="cursor-pointer bg-white text-black px-12 py-4 rounded-none font-neue-haas text-sm font-medium tracking-wider hover:bg-gray-200 transition-colors duration-300"
          >
            GO BACK
          </button>
        </div>
      </div>

      {/* Layer 6: Fade-in overlay */}
      <div className="absolute inset-0 bg-black pointer-events-none z-60 animate-[fade-out-overlay_2s_ease-out_both]" />

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
