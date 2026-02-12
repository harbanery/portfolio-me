"use client";

import { StarsBackground } from "@/components/aceternity/ui/bg-stars";
import { ShootingStars } from "@/components/aceternity/ui/shooting-stars";
import {
  CheckCircle,
  Github,
  Star,
  Target,
  TrendingUp,
  Briefcase,
  ChevronRight,
  AlertTriangle,
  Lightbulb,
} from "lucide-react";
import Image from "next/image";
import { logoMap } from "@/utils/helpers/icon";
import { masterDataMap } from "@/utils/helpers/category";
import { useState, useEffect } from "react";
import { menuRole } from "@/utils/helpers/menu";
import { getGithubRepoName } from "@/utils/helpers";
import { FaCaretRight } from "react-icons/fa6";

const ContentSection = ({ project }: { project?: any }) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  // Use images array if available, otherwise fallback to single image
  const projectImages =
    project.images && project.images.length > 0
      ? project.images
      : [project.image];
  const role = menuRole.find((r) => r.value === project.role)?.label;

  // Project type display
  const projectType = project.projectType;
  const clientName = project.clientName;
  const companyName = project.companyName;

  // API documentation link
  const postmanLink = project.apiDocumentation || "#";

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

      <div className="max-w-7xl mx-auto px-4 md:px-6">
        <div className="">
          <div className="grid lg:grid-cols-2 gap-12 md:gap-16 lg:gap-24 items-start">
            {/* Left Column - Project Image Gallery */}
            <div className="space-y-8 self-start h-full min-w-0">
              {/* Main Image with Dynamic Carousel */}
              <div
                data-aos="fade-up"
                data-aos-delay="200"
                className="aspect-video bg-gray-800 overflow-hidden group relative"
              >
                <div className="relative w-full h-full group">
                  {projectImages.map((image: any, index: number) => (
                    <Image
                      key={index + 1}
                      src={image}
                      alt={`${project.title} - ${index + 1}`}
                      fill
                      className={`object-cover transition-all duration-1000 ease-in-out grayscale group-hover:grayscale-0 ${
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
                    {projectImages.map((_: any, index: number) => (
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
                {projectImages.length > 1 ? (
                  <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
                ) : null}
              </div>

              {/* Project Metadata */}
              <div
                data-aos="fade-up"
                data-aos-delay="250"
                className="space-y-8"
                style={{ position: "sticky", top: "7rem" }}
              >
                <div
                  // data-aos="fade-zoom-in"
                  // data-aos-delay="250"
                  className="border-[0.5px] rounded-full border-white/50 mx-auto"
                />

                {/* Project Type - Only show if not personal */}
                {projectType !== "personal" && (
                  <div>
                    <h3
                      // data-aos="fade-up"
                      // data-aos-delay="300"
                      className="text-xl font-semibold text-white mb-4 font-inter"
                    >
                      {projectType === "client" ? "Client" : "Company"}
                    </h3>
                    <p
                      // data-aos="fade-up"
                      // data-aos-delay="300"
                      className="text-lg text-white font-light mb-8 font-neue-haas"
                    >
                      {projectType === "client" ? clientName : companyName}
                    </p>
                  </div>
                )}

                <div>
                  <h3
                    // data-aos="fade-up"
                    // data-aos-delay="300"
                    className="text-xl font-semibold text-white mb-2 font-inter"
                  >
                    Role
                  </h3>
                  <p
                    // data-aos="fade-up"
                    // data-aos-delay="300"
                    className="text-lg text-white font-light mb-8 font-neue-haas"
                  >
                    {role}
                  </p>
                </div>

                {/* Technologies Section */}
                <div>
                  <h3
                    // data-aos="fade-up"
                    // data-aos-delay="300"
                    className="text-xl font-semibold text-white mb-4 font-inter"
                  >
                    Tech Stack
                  </h3>
                  <div className="flex flex-wrap gap-3">
                    {(project.skills || []).map(
                      (tech: string, index: number) => {
                        const Icon = logoMap[tech.toLowerCase()];
                        const techData = masterDataMap[tech.toLowerCase()];

                        return (
                          <div
                            key={index + 1}
                            // data-aos="fade-up"
                            // data-aos-delay={`${(index + 6) * 50}`}
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
                            <span className="text-gray-300 font-neue-haas font-light text-sm">
                              {techData?.name || tech}
                            </span>
                          </div>
                        );
                      },
                    )}
                  </div>
                </div>

                {project.repoLinks && project.repoLinks.length > 0 && (
                  <div>
                    <h3
                      // data-aos="fade-up"
                      // data-aos-delay="300"
                      className="text-xl font-semibold text-white mb-4 font-inter"
                    >
                      Repository Link
                    </h3>
                    <div className="flex flex-col gap-4">
                      {project.repoLinks?.map((repo: any, index: number) => (
                        <a
                          key={index + 1}
                          // data-aos="fade-up"
                          // data-aos-delay={`${(index + 6) * 50}`}
                          href={repo}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-2 font-neue-haas font-medium tracking-wider hover:translate-x-1 transition-transform duration-200"
                        >
                          <Github size={16} className="text-white" />
                          <span className="paragraph-wrapper text-white">
                            {getGithubRepoName(repo) || repo}
                          </span>
                        </a>
                      ))}
                    </div>
                  </div>
                )}

                {/* API Documentation - Postman Link */}
                {postmanLink && postmanLink !== "#" && (
                  <div>
                    <a
                      // data-aos="fade-up"
                      // data-aos-delay="400"
                      href={postmanLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex justify-center items-center px-3 py-2 max-w-48 rounded bg-orange-600 hover:bg-orange-700 gap-2 text-white font-neue-haas font-medium tracking-wider transition-colors duration-300"
                    >
                      <FaCaretRight size={16} />
                      Run in Postman
                    </a>
                  </div>
                )}
              </div>
            </div>

            {/* Right Column - Content */}
            <div className="space-y-12 lg:max-w-xl min-w-0">
              {/* Description */}
              <div>
                <h3
                  data-aos="fade-right"
                  data-aos-delay="50"
                  className="text-4xl font-neue-haas font-thin text-white mb-8"
                >
                  About
                </h3>
                <div data-aos="fade-zoom-in" data-aos-delay="150">
                  <p
                    className="text-lg text-gray-300 font-neue-haas text-justify leading-relaxed mb-12 paragraph-wrapper"
                    dangerouslySetInnerHTML={{
                      __html: project.description || "No description available",
                    }}
                  />
                </div>
              </div>

              {/* Highlights */}
              {project.highlights && project.highlights.length > 0 && (
                <div>
                  <h3
                    data-aos="fade-right"
                    data-aos-delay="50"
                    className="text-2xl font-neue-haas font-thin text-white mb-8"
                  >
                    Technical Highlights
                  </h3>
                  <ul className="space-y-4">
                    {project.highlights.map((highlight: any, index: number) => (
                      <li
                        key={index + 1}
                        data-aos="fade-left"
                        data-aos-delay={`${(index + 1) * 50}`}
                        className="flex items-center justify-start gap-4"
                      >
                        <div className="w-5 h-5 text-yellow-400 flex items-center justify-center">
                          <Star className="w-5 h-5" />
                        </div>
                        <span className="text-gray-300 font-neue-haas font-light">
                          {highlight}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Outcome/Impact */}
              {project.outcomes && project.outcomes.length > 0 && (
                <div
                  data-aos="fade-zoom-in"
                  data-aos-delay="50"
                  className="mt-16 p-8 bg-gray-800 rounded-2xl"
                >
                  <h3
                    data-aos="fade-left"
                    data-aos-delay="100"
                    className="text-2xl font-neue-haas font-thin text-white mb-6 flex items-center gap-3"
                  >
                    <TrendingUp size={24} className="text-blue-400" />
                    Outcome & Impact
                  </h3>
                  <ul className="space-y-4">
                    {project.outcomes.map((outcome: any, index: number) => (
                      <li
                        key={index + 1}
                        data-aos="fade-zoom-in"
                        data-aos-delay={`${(index + 3) * 50}`}
                        className="flex justify-start items-center gap-4 hover:translate-x-1 transition-transform duration-200"
                      >
                        <div className="w-5 h-5 text-blue-400 flex items-center justify-center">
                          <CheckCircle className="w-5 h-5" />
                        </div>
                        <span className="text-gray-300 font-neue-haas font-light">
                          {outcome}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Features */}
              {project.features && project.features.length > 0 && (
                <div>
                  <h3
                    data-aos="fade-right"
                    data-aos-delay="50"
                    className="text-2xl font-neue-haas font-thin text-white mb-8"
                  >
                    Features
                  </h3>
                  <ul className="space-y-4">
                    {project.features.map((feature: any, index: number) => (
                      <li
                        key={index + 1}
                        data-aos="fade-left"
                        data-aos-delay={`${(index + 1) * 50}`}
                        className="flex items-center justify-start gap-4 hover:translate-x-1 transition-transform duration-200"
                      >
                        <div className="w-5 h-5 text-green-400 flex items-center justify-center">
                          <CheckCircle className="w-5 h-5" />
                        </div>
                        <span className="text-gray-300 font-neue-haas font-light">
                          {feature}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Challenges & Solutions */}
              {(project.challenges || project.solutions) && (
                <div
                  data-aos="fade-zoom-in"
                  data-aos-delay="50"
                  className="mt-16 p-8 bg-gray-800 rounded-2xl"
                >
                  {/* Challenges Section */}
                  <div className="mb-12">
                    <h4
                      data-aos="fade-left"
                      data-aos-delay="50"
                      className="text-xl font-neue-haas font-thin text-white mb-6 pb-3 border-b border-gray-700 flex items-center gap-3"
                    >
                      <AlertTriangle size={20} className="text-red-400" />
                      The Challenge
                    </h4>
                    <div
                      data-aos="fade-zoom-in"
                      data-aos-delay="50"
                      className="space-y-6"
                    >
                      {project.challenges && (
                        <p
                          className="text-gray-300 font-neue-haas text-justify leading-relaxed paragraph-wrapper"
                          dangerouslySetInnerHTML={{
                            __html: project.challenges,
                          }}
                        />
                      )}
                    </div>
                  </div>

                  {/* Solutions Section */}
                  <div>
                    <h4
                      data-aos="fade-left"
                      data-aos-delay="100"
                      className="text-xl font-neue-haas font-thin text-white mb-6 pb-3 border-b border-gray-700 flex items-center gap-3"
                    >
                      <Lightbulb size={20} className="text-green-400" />
                      The Solution
                    </h4>
                    <div
                      data-aos="fade-zoom-in"
                      data-aos-delay="100"
                      className="space-y-6"
                    >
                      {project.solutions && (
                        <p
                          className="text-gray-300 font-neue-haas text-justify leading-relaxed paragraph-wrapper"
                          dangerouslySetInnerHTML={{
                            __html: project.solutions,
                          }}
                        />
                      )}
                    </div>
                  </div>
                </div>
              )}

              {/* Story */}
              {project.story && (
                <div
                  data-aos="fade-zoom-in"
                  data-aos-delay="50"
                  className="mt-16 p-8 bg-gray-800 rounded-2xl"
                >
                  <h3
                    data-aos="fade-left"
                    data-aos-delay="50"
                    className="text-2xl font-neue-haas font-thin text-white mb-6"
                  >
                    Story
                  </h3>
                  <div data-aos="fade-zoom-in" data-aos-delay="50">
                    <p
                      className="text-gray-300 font-neue-haas text-justify leading-relaxed paragraph-wrapper"
                      dangerouslySetInnerHTML={{ __html: project.story }}
                    />
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContentSection;
