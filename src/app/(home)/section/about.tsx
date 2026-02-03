"use client";

import { masterDataMap } from "@/utils/helpers/category";
import { logoMap } from "@/utils/helpers/icon";
import { useEffect, useRef } from "react";

interface AboutSectionProps {
  about?: string | null;
  skills?: string[];
}

const AboutSection = ({ about, skills = [] }: AboutSectionProps) => {
  if (!about) return null;

  const trackRef = useRef<HTMLDivElement>(null);

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
            <div className="aspect-square bg-gray-800 flex items-center justify-center">
              <div className="text-center">
                <div className="w-32 h-32 mx-auto mb-8 rounded-full border-2 border-gray-600 flex items-center justify-center">
                  <span className="text-4xl font-neue-haas font-light text-white">
                    RY
                  </span>
                </div>
              </div>
            </div>
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
