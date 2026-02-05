"use client";

import { StarsBackground } from "@/components/aceternity/ui/bg-stars";
import { ShootingStars } from "@/components/aceternity/ui/shooting-stars";
import { CheckCircle, Github, Star } from "lucide-react";
import Image from "next/image";
import { logoMap } from "@/utils/helpers/icon";
import { masterDataMap } from "@/utils/helpers/category";
import { useState, useEffect } from "react";
import { menuRole } from "@/utils/helpers/menu";
import { getGithubRepoName } from "@/utils/helpers";

const ContentSection = ({ project }: { project?: any }) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  // Generate multiple images for carousel (using same image with different variations for demo)
  const projectImages = [project.image];
  const role = menuRole.find((r) => r.value === project.role)?.label;

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex(
        (prevIndex) => (prevIndex + 1) % projectImages.length,
      );
    }, 4000); // Change image every 4 seconds

    return () => clearInterval(interval);
  }, [projectImages.length]);

  return (
    <div id="content" className="relative bg-black py-24">
      <StarsBackground className="pointer-events-none" />
      <ShootingStars className="pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6">
        <div className="grid lg:grid-cols-2 gap-24 lg:gap-32 items-start">
          {/* Left Column - Project Image Gallery */}
          <div className="space-y-8">
            {/* Main Image with Dynamic Carousel */}
            <div className="aspect-video bg-gray-800 overflow-hidden group relative">
              <div className="relative w-full h-full">
                {projectImages.map((image, index) => (
                  <Image
                    key={index + 1}
                    src={image}
                    alt={`${project.title} - ${index + 1}`}
                    fill
                    className={`object-cover transition-all duration-1000 ease-in-out grayscale hover:grayscale-0 ${
                      index === currentImageIndex
                        ? "opacity-100 scale-100"
                        : "opacity-0 scale-105"
                    }`}
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw"
                    quality={90}
                  />
                ))}
              </div>

              {/* Image Navigation Dots */}
              {projectImages.length > 1 && (
                <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2 z-10">
                  {projectImages.map((_, index) => (
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

              {/* Hover Effect Overlay */}
              {/* <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" /> */}
            </div>

            {/* Project Metadata */}
            <div className="space-y-8">
              <div>
                <h3 className="text-xl font-semibold text-white mb-2 font-inter">
                  Role
                </h3>
                <p className="text-lg text-white font-light mb-8">{role}</p>
              </div>

              {/* Technologies Section */}
              <div>
                <h3 className="text-xl font-semibold text-white mb-4 font-inter">
                  Tech Stack
                </h3>
                <div className="flex flex-wrap gap-3">
                  {(project.skills || []).map((tech: string, index: number) => {
                    const Icon = logoMap[tech.toLowerCase()];
                    const techData = masterDataMap[tech.toLowerCase()];

                    return (
                      <div
                        key={index + 1}
                        className="group flex items-center gap-3 px-3 py-2 bg-gray-800 bg-opacity-50 backdrop-blur-sm border border-gray-700 border-opacity-50 rounded-full hover:bg-opacity-75 transition-all duration-300"
                      >
                        <div
                          className="w-5 h-5 flex items-center justify-center transition-all duration-300 text-gray-500 group-hover:text-[var(--skill-color)]"
                          style={{
                            ["--skill-color" as any]:
                              masterDataMap[tech]?.color || "#FFFFFF",
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
                        <span className="text-gray-300 font-light text-sm">
                          {techData?.name || tech}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>

              {project.repoLinks && project.repoLinks.length > 0 && (
                <div>
                  <h3 className="text-xl font-semibold text-white mb-4 font-inter">
                    Repository Link
                  </h3>
                  <div className="flex flex-col gap-4">
                    {project.repoLinks?.map((repo: any, index: number) => (
                      <a
                        key={index + 1}
                        href={repo}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 text-white font-neue-haas font-medium tracking-wider hover:underline"
                      >
                        <Github size={16} />
                        {getGithubRepoName(repo)}
                      </a>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Right Column - Content */}
          <div className="space-y-12 lg:max-w-xl">
            {/* Description */}
            <div>
              <h3 className="text-4xl font-thin text-white mb-8">About</h3>
              <p className="text-lg text-gray-300 font-light leading-relaxed mb-12">
                {project.description}
              </p>
            </div>

            {/* Features */}
            {project.features && project.features.length > 0 && (
              <div>
                <h3 className="text-2xl font-thin text-white mb-8">Features</h3>
                <ul className="space-y-4">
                  {project.features.map((feature: any, index: number) => (
                    <li key={index + 1} className="flex items-center gap-4">
                      <div className="w-8 h-8 text-green-400 flex items-center justify-center">
                        <CheckCircle className="w-5 h-5" />
                      </div>
                      <span className="text-gray-300 font-light">
                        {feature}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Highlights */}
            {project.highlights && project.highlights.length > 0 && (
              <div>
                <h3 className="text-2xl font-thin text-white mb-8">
                  Project Highlights
                </h3>
                <ul className="space-y-4">
                  {project.highlights.map((highlight: any, index: number) => (
                    <li key={index + 1} className="flex items-center gap-4">
                      <div className="w-8 h-8 text-yellow-400 flex items-center justify-center">
                        <Star className="w-5 h-5" />
                      </div>
                      <span className="text-gray-300 font-light">
                        {highlight}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Story */}
            {project.story && (
              <div className="mt-16 p-8 bg-gray-800 rounded-2xl">
                <h3 className="text-2xl font-thin text-white mb-6">Story</h3>
                <p className="text-gray-300 font-light leading-relaxed">
                  {project.story}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContentSection;
