"use client";

import { StarsBackground } from "@/components/effects/bg-stars";
import { ShootingStars } from "@/components/effects/shooting-stars";
import { useEffect } from "react";

const RootError = ({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) => {
  useEffect(() => {
    if (error) {
      console.error({
        name: error.name,
        message: error.message,
        stack: error.stack,
        cause: error.cause,
      });
    }
  }, [error]);

  return (
    <div className="relative min-h-screen w-full overflow-hidden bg-linear-to-b from-slate-950 via-blue-950 to-indigo-950">
      <div className="absolute inset-0 z-10">
        <StarsBackground className="pointer-events-none" />
        <ShootingStars className="pointer-events-none" />
      </div>

      {/* Error Message — Tailwind keyframe animations (see index.css). */}
      <div className="absolute inset-0 flex flex-col items-center justify-center z-50 text-center px-4 animate-[rise-in_2s_ease-out_1s_both]">
        <h2 className="text-2xl md:text-4xl font-medium capitalize font-neue-haas text-white mb-6 animate-[pop-in_1s_cubic-bezier(0.34,1.56,0.64,1)_2s_both]">
          Something Went Wrong
        </h2>

        <p className="text-lg md:text-xl font-neue-haas text-white/60 mb-8 max-w-md animate-[soft-fade_1s_ease-out_2.5s_both]">
          {error?.message ?? "An unexpected error occurred"}. Please try again
          later.
        </p>

        <div className="animate-[soft-fade_1s_ease-out_3s_both] transition-transform duration-200 ease-out hover:scale-105 active:scale-95">
          <button
            onClick={reset}
            className="cursor-pointer bg-white text-black px-12 py-4 rounded-none font-neue-haas text-sm font-medium tracking-wider hover:bg-gray-200 transition-colors duration-300"
          >
            TRY AGAIN
          </button>
        </div>
      </div>

      {/* Fade-in overlay */}
      <div className="absolute inset-0 bg-black pointer-events-none z-60 animate-[fade-out-overlay_2s_ease-out_both]" />

      {/* Atmospheric effects */}
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

export default RootError;
