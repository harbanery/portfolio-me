"use client";

import { StarsBackground } from "@/components/aceternity/ui/bg-stars";
import { ShootingStars } from "@/components/aceternity/ui/shooting-stars";
import { useRouter } from "next/navigation";

const HeroSection = ({ name, title }: { name?: string; title?: string }) => {
  const router = useRouter();
  return (
    <section
      id="hero"
      className="min-h-screen bg-black flex items-center justify-center px-4 relative"
    >
      <StarsBackground className="pointer-events-none" />
      <ShootingStars className="pointer-events-none" />
      <div className="max-w-7xl mx-auto w-full">
        <div className="text-center">
          <h1
            data-aos="fade-up"
            data-aos-delay="200"
            className="text-4xl sm:text-5xl md:text-7xl lg:text-8xl xl:text-9xl font-inter text-white font-bold mb-8 leading-tight uppercase"
          >
            {name ?? "RAIHAN YUSUF"}
          </h1>

          <p
            data-aos="fade-up"
            data-aos-delay="300"
            className="text-md sm:text-lg md:text-2xl text-gray-400 font-neue-haas font-light mb-12 max-w-4xl mx-auto tracking-wider leading-relaxed"
          >
            {title ?? "Web development, fast-paced and ever-changing"}
          </p>

          <div
            data-aos="fade-up"
            data-aos-delay="350"
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
  );
};

export default HeroSection;
