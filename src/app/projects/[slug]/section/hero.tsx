"use client";

import { ExternalLink } from "lucide-react";
import Image from "next/image";

const HeroSection = ({ project }: { project?: any }) => {
  return (
    <div
      id="hero"
      className="relative h-screen flex items-center justify-center overflow-hidden"
    >
      <div className="absolute inset-0 z-0 blur-sm">
        <Image
          src={project.image}
          alt={project.title}
          fill
          className="object-cover opacity-60"
          priority
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw"
          quality={85}
        />
      </div>
      <div className="relative z-10 max-w-4xl mx-auto px-4 py-24 text-center">
        <div className="animate-fade-in">
          <h1 className="text-6xl md:text-7xl lg:text-8xl font-thin mb-8 tracking-tight leading-none">
            {project.title}
          </h1>

          <div className="flex justify-center items-center gap-4 mb-16">
            {project.webLink ? (
              <a
                href={project.webLink}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-3 px-6 py-3 bg-white bg-opacity-10 backdrop-blur-sm border border-white border-opacity-20 rounded-full text-white hover:text-gray-900 hover:bg-opacity-60 transition-all duration-500"
              >
                <span className="font-medium">Live Demo</span>
                <ExternalLink className="w-5 h-5" />
              </a>
            ) : (
              <span className="px-6 py-3 bg-gray-800 bg-opacity-50 backdrop-blur-sm border border-gray-950 border-opacity-50 rounded-full text-gray-300 font-medium">
                Coming Soon
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default HeroSection;
