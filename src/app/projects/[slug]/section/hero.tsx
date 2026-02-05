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
          className="object-cover opacity-25 grayscale"
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
          <h1 className="text-2xl font-thin mb-8 tracking-tight leading-none text-gray-400">
            Hire Job Implementation
          </h1>

          <div className="flex justify-center items-center gap-4 mb-16">
            {!project.webLink ? (
              <a
                href={project.webLink}
                target="_blank"
                rel="noopener noreferrer"
                className="flex justify-center items-center gap-2 bg-white text-black px-12 py-4 rounded-none font-neue-haas text-sm font-medium tracking-wider hover:bg-gray-200 transition-colors"
              >
                LIVE DEMO
                <ExternalLink size={16} />
              </a>
            ) : (
              <button
                disabled
                className="bg-white disabled:bg-gray-300 text-black px-12 py-4 rounded-none font-neue-haas text-sm font-medium tracking-wider"
              >
                COMING SOON
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default HeroSection;
