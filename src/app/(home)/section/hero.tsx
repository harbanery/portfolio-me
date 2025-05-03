"use client";
import { TextHoverEffect } from "@/components/aceternity/ui/hover-text-effect";
import { StaticImport } from "next/dist/shared/lib/get-img-props";
import { motion } from "motion/react";
import Image from "next/image";
import { StarsBackground } from "@/components/aceternity/ui/bg-stars";
import { ShootingStars } from "@/components/aceternity/ui/shooting-stars";

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
        className=" w-full h-[526px] absolute top-[0%] hidden xl:flex items-center justify-center"
      >
        <TextHoverEffect text="RAIHAN" idCustom={1} />
      </div>
      <div
        style={{
          maskImage: "radial-gradient(eclipse, black 30%, transparent 100%)",
          WebkitMaskImage:
            "radial-gradient(eclipse, black 20%, transparent 100%)",
        }}
        className="w-full h-[526px] absolute top-[45%] hidden xl:flex items-center justify-center"
      >
        <TextHoverEffect text="YUSUF" idCustom={2} />
      </div>
      {/* <div className="absolute bottom-0 left-[50%] transform -translate-x-1/2 pointer-events-none">
        <Image
          style={{
            WebkitFilter: "drop-shadow(5px 10px 20px #222)",
            filter: "drop-shadow(5px 5px 5px #222)",
            maskImage:
              "linear-gradient(to bottom, black 90%, transparent 100%)",
            WebkitMaskImage:
              "linear-gradient(to bottom, black 90%, transparent 100%)",
          }}
          src={image}
          width={600}
          height={600}
          alt="Picture of the author"
        />
      </div> */}
      {/* <div className="px-[72px]">
          <div>
            <h1 className="w-full max-w-[288px] text-5xl font-inter font-bold leading-[1.1] text-white">
              Halo👋, Salam Kenal
            </h1>
          </div>
        </div> */}
    </section>
  );
};

export default HeroSection;
