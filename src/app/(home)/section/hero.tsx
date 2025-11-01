"use client";
import { StaticImport } from "next/dist/shared/lib/get-img-props";
import { StarsBackground } from "@/components/aceternity/ui/bg-stars";
import { ShootingStars } from "@/components/aceternity/ui/shooting-stars";
import { FlipWords } from "@/components/aceternity/ui/flip-words";
import { TextHoverEffect } from "@/components/aceternity/ui/hover-text-effect";

const HeroSection = ({ image }: { image: string | StaticImport }) => {
  return (
    <section id="hero" className="w-full h-screen max-h-[780px] relative">
      <StarsBackground />
      <ShootingStars />
      <div
        style={{
          maskImage: "radial-gradient(eclipse, black 30%, transparent 100%)",
          WebkitMaskImage:
            "radial-gradient(eclipse, black 20%, transparent 100%)",
        }}
        className=" w-full h-full absolute top-[0%] hidden xl:flex items-center justify-center"
      >
        <TextHoverEffect text="RAIHAN" idCustom={1} />
      </div>
      <div className="h-full flex justify-center items-center px-4 pointer-events-none">
        <div className="w-full px-36 text-7xl font-inter mx-auto font-light text-neutral-300 dark:text-neutral-400">
          Hi,
          <FlipWords words={["I'm Raihan Yusuf", "Everyone!"]} />
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
