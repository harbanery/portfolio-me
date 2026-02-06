"use client";

import { StarsBackground } from "@/components/aceternity/ui/bg-stars";
import { ShootingStars } from "@/components/aceternity/ui/shooting-stars";
import Image from "next/image";
import { logoMap } from "@/utils/helpers/icon";
import { masterDataMap } from "@/utils/helpers/category";

interface ExperienceContent {
  jobTitle: string;
  companyName: string;
  description: string;
  techStack: string[];
  images: string[];
}

interface TimelineEntry {
  title: string;
  content: ExperienceContent;
}

interface TimelineSectionProps {
  experiences: TimelineEntry[];
}

const ExperienceContent = ({ content }: { content: ExperienceContent }) => {
  return (
    <div className="text-left max-w-2xl md:max-w-3xl">
      <h3 className="text-2xl lg:text-3xl font-neue-haas text-white font-medium mb-2">
        {content.jobTitle}
      </h3>
      <p className="text-lg text-[#8A8A8A] italic font-neue-haas mb-6">
        {content.companyName}
      </p>
      <p
        className="text-base text-[#B5B5B5] font-neue-haas leading-relaxed mb-6"
        dangerouslySetInnerHTML={{ __html: content.description }}
      />

      {/* Tech Stack Badges */}
      <div
        className={`flex flex-wrap gap-3 ${content.images && content.images.length > 0 ? "mb-8" : ""}`}
      >
        {content.techStack.map((tech) => {
          const Icon = logoMap[tech.toLowerCase()];
          const techData = masterDataMap[tech.toLowerCase()];

          return (
            <div
              key={tech}
              className="group flex items-center gap-3 px-3 py-2 bg-gray-800 bg-opacity-50 backdrop-blur-sm border border-gray-700 border-opacity-50 rounded-full hover:bg-opacity-75 transition-all duration-300"
            >
              <div
                className="w-5 h-5 flex items-center justify-center transition-all duration-300 text-gray-500 group-hover:text-[var(--skill-color)]"
                style={{
                  ["--skill-color" as any]: techData?.color || "#FFFFFF",
                }}
              >
                {Icon ? (
                  <Icon className="w-full h-full" />
                ) : (
                  <div className="w-full h-full bg-gray-600 rounded-full flex items-center justify-center text-xs text-white font-medium">
                    {tech.charAt(0)}
                  </div>
                )}
              </div>
              <span className="text-gray-300 font-neue-haas font-light text-sm">
                {techData?.name || tech}
              </span>
            </div>
          );
        })}
      </div>

      {/* Images Grid */}
      {content.images && content.images.length > 0 && (
        <div className={`grid gap-4 grid-cols-2 xl:grid-cols-3`}>
          {content.images.map((imgUrl, imgIndex) => (
            <div
              key={`${content.companyName}-${imgIndex}`}
              className="relative aspect-video rounded-lg overflow-hidden border border-[#1F1F1F] grayscale hover:grayscale-0 transition-all duration-300"
            >
              <Image
                src={imgUrl}
                alt={`${content.companyName} ${imgIndex + 1}`}
                fill
                className="object-cover"
              />
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

const TimelineSection = ({ experiences }: TimelineSectionProps) => {
  return (
    <section
      id="work"
      className="min-h-screen bg-black flex items-center px-4 py-20 md:py-32"
    >
      <StarsBackground className="pointer-events-none" />
      <ShootingStars className="pointer-events-none" />
      <div className="w-full">
        <div className="max-w-6xl mx-auto px-4 md:px-8 lg:px-10 py-10">
          <h2 className="text-5xl lg:text-7xl font-neue-haas text-white font-light mb-4 text-center">
            Work Experience
          </h2>
          <p className="text-xl text-[#B5B5B5] font-neue-haas font-light max-w-3xl mx-auto mb-20 text-center leading-relaxed">
            A timeline of my professional journey in software development
          </p>
        </div>

        {/* Custom styled Timeline adapted from aceternity UI */}
        <div className="w-full bg-black">
          {experiences.map((item) => (
            <div
              key={item.title}
              className="flex justify-start pt-10 md:pt-20 md:gap-10 max-w-6xl mx-auto px-4"
            >
              {/* Left Column - Period (Hidden on mobile, sticky on tablet+) */}
              <div className="hidden md:flex sticky flex-col md:flex-row z-40 items-center top-20 self-start max-w-xs lg:max-w-sm md:w-full">
                <div className="h-10 absolute left-3 md:left-3 w-10 rounded-full bg-black flex items-center justify-center border-2 border-[#2A2A2A]">
                  <div className="h-3 w-3 rounded-full bg-white border border-black" />
                </div>
                <div className="pl-20 md:pl-20">
                  <h3 className="text-sm md:text-xl lg:text-2xl font-neue-haas text-white font-light">
                    {item.title}
                  </h3>
                </div>
              </div>

              {/* Right Column - Job Details */}
              <div className="relative pl-0 pr-4 md:pl-4 w-full">
                {/* Mobile-only Period Label */}
                <div className="md:hidden mb-6">
                  <p className="text-xs font-medium tracking-widest text-[#8A8A8A] mb-2">
                    PERIOD
                  </p>
                  <h3 className="text-sm font-neue-haas text-white font-light">
                    {item.title}
                  </h3>
                </div>
                <ExperienceContent content={item.content} />
              </div>
            </div>
          ))}

          {/* Vertical Timeline Line (Hidden on mobile) */}
          <div className="relative max-w-6xl mx-auto hidden md:block">
            <div className="absolute left-8 md:left-8 top-0 bottom-0 w-px bg-[#2A2A2A]" />
          </div>
        </div>
      </div>
    </section>
  );
};

export default TimelineSection;
