"use client";

import { masterDataMap } from "@/utils/helpers/category";
import { logoMap } from "@/utils/helpers/icon";
import { useEffect, useRef } from "react";

interface SkillSectionProps {
  skills?: string[];
}

const SkillSection = ({ skills = [] }: SkillSectionProps) => {
  const sliderRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);

  const skillList = skills
    .filter((skill) => logoMap[skill])
    .map((skill) => ({
      key: skill,
      icon: logoMap[skill],
      name: masterDataMap[skill].name,
    }));

  useEffect(() => {
    const slider = sliderRef.current;
    const track = trackRef.current;
    if (!slider || !track) return;

    // Clone the skills for infinite scrolling
    const skills = Array.from(track.children);
    skills.forEach((skill) => {
      const clone = skill.cloneNode(true);
      track.appendChild(clone);
    });

    // Pause animation on hover
    const pause = () => {
      track.style.animationPlayState = "paused";
    };

    const resume = () => {
      track.style.animationPlayState = "running";
    };

    slider.addEventListener("mouseover", pause);
    slider.addEventListener("mouseout", resume);

    return () => {
      slider.removeEventListener("mouseover", pause);
      slider.removeEventListener("mouseout", resume);
    };
  }, []);

  return (
    <section
      id="skills"
      className="h-full py-20 bg-black flex items-center justify-center px-4"
    >
      <div className="max-w-full mx-auto w-full">
        <h2 className="text-5xl lg:text-7xl font-neue-haas text-white font-light mb-20 text-center">
          Expertise
        </h2>
        <div className="">
          <div ref={sliderRef} className="overflow-hidden w-full py-8 relative">
            <div className="bg-gradient-to-r from-black from-0% to-transparent to-100% absolute left-0 z-10 w-4/12 h-full pointer-events-none" />
            <div className="bg-gradient-to-l from-black from-0% to-transparent to-100% absolute right-0 z-10 w-4/12 h-full pointer-events-none" />
            <div
              ref={trackRef}
              className="flex w-max animate-scroll items-center gap-24"
            >
              {skillList.map((item) => (
                <div
                  key={item.key}
                  className="group relative flex flex-col items-center cursor-pointer transition-transform duration-300 hover:scale-110"
                  title={item.name}
                >
                  <div className="w-32 h-32 flex items-center justify-center mb-4">
                    <item.icon size={100} className="text-white" />
                  </div>
                  <span className="text-gray-400 font-neue-haas text-sm font-light tracking-wider text-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    {item.name.toUpperCase()}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default SkillSection;
