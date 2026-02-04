"use client";
import { StarsBackground } from "@/components/aceternity/ui/bg-stars";
import { ShootingStars } from "@/components/aceternity/ui/shooting-stars";
import { StaticImport } from "next/dist/shared/lib/get-img-props";

const HeroSection = ({ image }: { image: string | StaticImport }) => {
  return (
    <section
      id="hero"
      className="min-h-screen bg-black flex items-center justify-center px-4 relative"
    >
      <StarsBackground className="pointer-events-none" />
      <ShootingStars className="pointer-events-none" />
      <div className="max-w-7xl mx-auto w-full">
        <div className="text-center">
          <h1 className="text-6xl md:text-8xl lg:text-9xl font-inter text-white font-bold mb-8 leading-tight">
            RAIHAN YUSUF
          </h1>

          <p className="text-xl md:text-2xl text-gray-400 font-neue-haas font-light mb-12 max-w-4xl mx-auto leading-relaxed">
            I craft elegant digital experiences with precision and passion
          </p>

          <div className="flex flex-col items-center gap-8">
            <button className="bg-white text-black px-12 py-4 rounded-none font-neue-haas text-sm font-medium tracking-wider hover:bg-gray-200 transition-colors">
              EXPLORE MY WORK
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
