"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import SectionHeading from "@/components/section-heading";

interface AboutSectionProps {
  about?: string | null;
  skills?: string[];
  images?: string[];
}

const PRINCIPLES = [
  {
    number: "01",
    title: "Structure before styling",
    description:
      "A layout is a system, not a decoration. Semantics, spacing, and hierarchy come first; the rest follows naturally.",
  },
  {
    number: "02",
    title: "Details carry the experience",
    description:
      "Transitions, timing, and states are not polish. They are the difference between a page and a product.",
  },
  {
    number: "03",
    title: "Measured, then shipped",
    description:
      "Every change is verified against real builds and real browsers before it goes anywhere near production.",
  },
];

const AboutSection = ({ about, images }: AboutSectionProps) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const profileImages = Array.isArray(images) ? images : [];

  useEffect(() => {
    if (profileImages.length < 2) return;

    const interval = setInterval(() => {
      setCurrentImageIndex(
        (prevIndex) => (prevIndex + 1) % profileImages.length,
      );
    }, 3000);

    return () => clearInterval(interval);
  }, [profileImages.length]);

  return (
    <section id="about" className="relative bg-black py-24 md:py-32">
      <div className="mx-auto w-full max-w-6xl px-6 lg:px-10">
        <SectionHeading
          number="01"
          label="About"
          meta="Profile"
          lineOne="Signal out of"
          lineTwo="operational noise."
        />

        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-start">
          {/* Text column */}
          <div>
            {/* Principles */}
            <div className="mt-14 space-y-10">
              {PRINCIPLES.map((principle, index) => (
                <div
                  key={principle.number}
                  data-aos="fade-up"
                  data-aos-delay={`${(index + 1) * 100}`}
                  className="grid grid-cols-[3rem_1fr] gap-4 border-t border-white/10 pt-6"
                >
                  <span className="text-xs text-[#DEB887] tabular-nums pt-1">
                    {principle.number}
                  </span>
                  <div>
                    <h3 className="text-lg font-inter font-semibold text-white mb-2">
                      {principle.title}
                    </h3>
                    <p className="text-base text-gray-400 font-neue-haas font-light leading-relaxed">
                      {principle.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Image column */}
          <div data-aos="fade-left" data-aos-delay="200" className="relative">
            <div className="aspect-square rounded-2xl bg-gray-900 flex items-center justify-center grayscale hover:grayscale-0 transition-all duration-300 overflow-hidden">
              {profileImages.length > 0 ? (
                profileImages.map((image, index) => (
                  <img
                    key={index + 1}
                    src={image}
                    alt={`Portrait ${index + 1}`}
                    className={`absolute w-full h-full object-cover transition-opacity duration-1000 ease-in-out ${
                      index === currentImageIndex ? "opacity-100" : "opacity-0"
                    }`}
                    loading={index === 0 ? "eager" : "lazy"}
                  />
                ))
              ) : (
                <div className="text-center">
                  <div className="w-32 h-32 mx-auto rounded-full border-2 border-gray-700 flex items-center justify-center">
                    <Image
                      className="mix-blend-screen"
                      src="/logo.png"
                      width={72}
                      height={72}
                      alt=""
                      priority={true}
                      sizes="72px"
                    />
                  </div>
                </div>
              )}
            </div>
            {profileImages.length > 1 && (
              <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex space-x-2">
                {profileImages.map((_, index) => (
                  <button
                    key={index + 1}
                    onClick={() => setCurrentImageIndex(index)}
                    className={`h-2 rounded-full transition-all duration-300 ${
                      index === currentImageIndex
                        ? "bg-white w-8"
                        : "bg-white/50 hover:bg-white/75 w-2"
                    }`}
                    aria-label={`Go to image ${index + 1}`}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;
