"use client";

import { StarsBackground } from "@/components/effects/bg-stars";
import { ShootingStars } from "@/components/effects/shooting-stars";
import { RotateCcw } from "lucide-react";
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
    <div className="relative min-h-screen w-full overflow-hidden bg-black">
      <div className="absolute inset-0 z-10">
        <StarsBackground className="pointer-events-none" />
        <ShootingStars className="pointer-events-none" />
      </div>

      {/* Error message — same editorial heading + pill button language as
          the rest of the site. Animations run on Tailwind keyframes (see
          index.css). The raw error text stays in the console; the page only
          surfaces the digest as a short reference. */}
      <div className="absolute inset-0 flex flex-col items-center justify-center z-50 text-center px-4 animate-[rise-in_0.5s_ease-in-out_1s_both]">
        <p className="mb-6 font-martian-mono text-xs uppercase tracking-[0.25em] text-gray-500">
          Error{error?.digest ? ` · ${error.digest}` : ""}
        </p>

        <h2 className="mb-6 font-inter font-extrabold text-white leading-[1.02] tracking-tight text-[clamp(2.25rem,6vw,3.25rem)] animate-[pop-in_0.5s_ease-in-out_2s_both]">
          Something went wrong.
        </h2>

        <p className="mb-10 max-w-xl text-lg md:text-xl font-neue-haas font-light tracking-wider leading-relaxed text-gray-400 animate-[soft-fade_0.5s_ease-in-out_2.5s_both]">
          An unexpected error occurred while loading this page. Please try again
          — if the problem persists, come back later.
        </p>

        <div className="flex flex-wrap items-center justify-center gap-4 animate-[soft-fade_0.5s_ease-in-out_3s_both]">
          <button
            onClick={reset}
            className="group inline-flex cursor-pointer items-center gap-2.5 rounded-full bg-[#DEB887] px-8 py-4 text-sm font-martian-mono font-semibold tracking-wider text-[#241B0E] hover:bg-[#E6CC9E] hover:shadow-[0_8px_24px_-8px_rgba(222,184,135,0.55)] transition-[background-color,box-shadow] duration-500"
          >
            <RotateCcw
              size={16}
              strokeWidth={3}
              className="transition-transform duration-500 group-hover:-rotate-180"
            />
            TRY AGAIN
          </button>
        </div>
      </div>

      {/* Fade-in overlay */}
      <div className="absolute inset-0 bg-black pointer-events-none z-60 animate-[fade-out-overlay_0.5s_ease-in-out_both]" />

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
