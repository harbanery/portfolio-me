"use client";

import { masterDataMap } from "@/utils/helpers/category";
import { logoMap } from "@/utils/helpers/icon";
import { useEffect, useRef, useState } from "react";

interface AboutSectionProps {
  about?: string | null;
  skills?: string[];
  images?: string | string[];
}

const AboutSection = ({ about, skills = [], images }: AboutSectionProps) => {
  if (!about) return null;

  const trackRef = useRef<HTMLDivElement>(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const profileImages = Array.isArray(images) ? images : [];

  const skillList = skills
    .filter((skill) => logoMap[skill])
    .map((skill) => ({
      key: skill,
      icon: logoMap[skill],
      name: masterDataMap[skill].name,
    }));

  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;

    // Clone the skills for infinite scrolling
    const skills = Array.from(track.children);
    skills.forEach((skill) => {
      const clone = skill.cloneNode(true);
      track.appendChild(clone);
    });
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex(
        (prevIndex) => (prevIndex + 1) % profileImages.length,
      );
    }, 3000); // Change image every 3 seconds

    return () => clearInterval(interval);
  }, [profileImages.length]);

  return (
    <section
      id="about"
      className="h-full bg-gray-950 flex items-center justify-center px-4 py-20"
    >
      <div className="max-w-6xl mx-auto w-full">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <div>
            <h2 className="text-5xl lg:text-7xl font-neue-haas text-white font-light mb-12">
              About
            </h2>
            <div
              className="text-lg text-gray-300 font-neue-haas leading-relaxed space-y-6"
              dangerouslySetInnerHTML={{ __html: about }}
            />
          </div>
          <div className="relative">
            <div className="aspect-square bg-gray-800 flex items-center justify-center grayscale hover:grayscale-0 transition-all duration-300 overflow-hidden">
              {profileImages?.length > 0 ? (
                profileImages.map((image, index) => (
                  <img
                    key={index + 1}
                    src={image}
                    alt={`RY ${index + 1}`}
                    className={`absolute w-full h-full object-cover transition-opacity duration-1000 ease-in-out ${
                      index === currentImageIndex ? "opacity-100" : "opacity-0"
                    }`}
                  />
                ))
              ) : (
                <div className="text-center">
                  <div className="w-32 h-32 mx-auto mb-8 rounded-full border-2 border-gray-600 flex items-center justify-center">
                    <span className="text-4xl font-neue-haas font-light text-white">
                      RY
                    </span>
                  </div>
                </div>
              )}
            </div>
            {profileImages?.length > 1 && (
              <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
                {profileImages.map((_, index) => (
                  <button
                    key={index + 1}
                    onClick={() => setCurrentImageIndex(index)}
                    className={`w-2 h-2 rounded-full transition-all duration-300 ${
                      index === currentImageIndex
                        ? "bg-white w-8"
                        : "bg-white/50 hover:bg-white/75"
                    }`}
                    aria-label={`Go to image ${index + 1}`}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
        <div className="overflow-hidden w-full relative py-16">
          <div className="bg-gradient-to-r from-gray-950 from-0% to-transparent to-100% absolute left-0 z-10 w-4/12 h-full pointer-events-none" />
          <div className="bg-gradient-to-l from-gray-950 from-0% to-transparent to-100% absolute right-0 z-10 w-4/12 h-full pointer-events-none" />
          <div
            ref={trackRef}
            className="flex w-max animate-scroll items-center gap-16"
          >
            {skillList.map((item) => (
              <div
                key={item.key}
                className="group relative flex flex-col items-center cursor-pointer transition-transform duration-300 hover:scale-110"
                title={item.name}
              >
                <div className="w-10 h-16 flex items-center justify-center">
                  <item.icon size={40} className="text-white" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;
