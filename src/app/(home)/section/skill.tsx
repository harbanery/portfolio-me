"use client";

import { useEffect, useRef } from "react";
import skills from "@/data/skills.json";
import { logoMap } from "@/utils/helpers/icon";

const SkillSection = () => {
  const sliderRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);

  const skillList = skills
    .filter((skill) => logoMap[skill.key])
    .map((skill) => ({
      ...skill,
      icon: logoMap[skill.key],
    }));

  const renderList = (list: any[]) => {
    return list.map((item) => (
      <item.icon
        key={item.key}
        size={100}
        className="transition-transform scale-100 duration-300 hover:scale-125"
      />
    ));
  };

  useEffect(() => {
    const slider = sliderRef.current;
    const track = trackRef.current;
    if (!slider || !track) return;

    const logos = Array.from(track.children);
    logos.forEach((logo) => {
      const clone = logo.cloneNode(true);
      track.appendChild(clone);
    });

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
      id="skill"
      className="w-full h-auto relative py-20 space-y-10 bg-slate-900"
    >
      <h1 className="text-white text-center font-bebas tracking-wide font-bold text-7xl">
        Skills
      </h1>
      <div className="bg-gradient-to-r from-slate-900 from-0% to-transparent to-100% absolute left-0 z-10 w-4/12 h-1/2 pointer-events-none" />
      <div className="bg-gradient-to-l from-slate-900 from-0% to-transparent to-100% absolute right-0 z-10 w-4/12 h-1/2 pointer-events-none" />
      <div ref={sliderRef} className="overflow-hidden w-full py-12">
        <div
          ref={trackRef}
          className="flex w-max animate-scroll items-center gap-24 brightness-0 invert"
        >
          {renderList(skillList)}
        </div>
      </div>
    </section>
  );
};

export default SkillSection;
