"use client";

import { useState, useEffect } from "react";
import { lazy, Suspense } from "react";
import { useRouter } from "next/navigation";
import IntroSection from "./intro";

const StarsBackground = lazy(() => import("@/components/aceternity/ui/bg-stars").then(mod => ({ default: mod.StarsBackground })));
const ShootingStars = lazy(() => import("@/components/aceternity/ui/shooting-stars").then(mod => ({ default: mod.ShootingStars })));

const HeroSection = ({ name, title }: { name?: string; title?: string }) => {
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

  return (
    <>
      {showIntro && <IntroSection onComplete={handleIntroComplete} />}
      <section
        id="hero"
        className={`min-h-screen bg-black flex items-center justify-center px-4 relative transition-opacity duration-1000 ${
          showIntro ? "opacity-0" : "opacity-100"
        }`}
      >
        <Suspense fallback={<div className="absolute inset-0 bg-black" />}>
          <StarsBackground className="pointer-events-none" />
          <ShootingStars className="pointer-events-none" />
        </Suspense>
        <div className="max-w-7xl mx-auto w-full">
          <div className="text-center">
            <h1
              data-aos="fade-up"
              data-aos-delay="3200"
              className="text-4xl sm:text-5xl md:text-7xl lg:text-8xl xl:text-9xl font-inter text-white font-bold mb-8 leading-tight uppercase"
            >
              {name ?? "RAIHAN YUSUF"}
            </h1>

            <p
              data-aos="fade-up"
              data-aos-delay="3300"
              className="text-md sm:text-lg md:text-2xl text-gray-400 font-neue-haas font-light mb-12 max-w-4xl mx-auto tracking-wider leading-relaxed"
            >
              {title ??
                "Building for the web means working in a dynamic, growing space."}
            </p>

            <div
              data-aos="fade-up"
              data-aos-delay="3350"
              className="flex flex-col items-center gap-8"
            >
              <button
                onClick={() => router.push("/experience")}
                className="bg-white text-black px-12 py-4 rounded-none font-neue-haas text-sm font-medium tracking-wider hover:bg-gray-200 transition-colors duration-300"
              >
                EXPLORE MY WORK
              </button>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default HeroSection;
