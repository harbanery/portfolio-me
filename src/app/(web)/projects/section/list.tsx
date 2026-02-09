"use client";

import { ExternalLink } from "lucide-react";
import { getProjectSlug } from "@/utils/slug";
import { StarsBackground } from "@/components/aceternity/ui/bg-stars";
import { ShootingStars } from "@/components/aceternity/ui/shooting-stars";
import { useRouter } from "next/navigation";
import { logoMap } from "@/utils/helpers/icon";
import { masterDataMap } from "@/utils/helpers/category";

interface ProjectSectionProps {
  projects: Array<{
    id: number;
    title: string;
    role: string;
    image: string;
    description: string | null;
    skills: string[];
    repoLinks: string[];
    webLink: string | null;
  }>;
}

const ListProjectSection = ({ projects }: ProjectSectionProps) => {
  const router = useRouter();

  if (!projects || projects.length === 0) {
    return (
      <section
        id="projects"
        className="min-h-screen bg-black flex items-center justify-center px-4 py-20"
      >
        <StarsBackground className="pointer-events-none" />
        <ShootingStars className="pointer-events-none" />
        <div className="max-w-7xl mx-auto w-full text-center">
          <h2 className="text-5xl lg:text-7xl font-neue-haas text-white font-light mb-20 text-center">
            Projects
          </h2>
          <p className="text-2xl text-gray-400 font-neue-haas font-light">
            No projects available at the moment.
          </p>
        </div>
      </section>
    );
  }

  return (
    <section
      id="projects"
      className="min-h-screen bg-black flex items-center justify-center px-4 py-20"
    >
      <StarsBackground className="pointer-events-none" />
      <ShootingStars className="pointer-events-none" />
      <div className="max-w-7xl mx-auto w-full">
        <h2 className="text-5xl lg:text-7xl font-neue-haas text-white font-light mb-20 text-center">
          Projects
        </h2>

        <div className="space-y-32">
          {projects.map((project, index) => (
            <div
              key={project.id}
              className={`grid lg:grid-cols-2 gap-16 items-center ${
                index % 2 === 1 ? "lg:grid-flow-col-dense" : ""
              }`}
            >
              <button
                onClick={() =>
                  router.push(`/projects/${getProjectSlug(project)}`)
                }
                className={index % 2 === 1 ? "lg:col-start-2" : ""}
              >
                <div className="aspect-video bg-gray-800 rounded-none overflow-hidden grayscale hover:grayscale-0 transition-all duration-300">
                  {project.image && (
                    <img
                      src={project.image}
                      alt={project.title}
                      className="w-full h-full object-cover"
                    />
                  )}
                </div>
              </button>
              <div
                className={
                  index % 2 === 1
                    ? "lg:col-start-1 lg:row-start-1 lg:text-right space-y-6"
                    : "space-y-6"
                }
              >
                <h3 className="text-3xl lg:text-4xl font-neue-haas text-white font-light">
                  {project.title}
                </h3>
                <p
                  className="text-lg text-gray-300 font-neue-haas leading-relaxed line-clamp-3 paragraph-wrapper"
                  dangerouslySetInnerHTML={{
                    __html: project.description || "No description available",
                  }}
                />

                <div
                  className={`flex flex-wrap ${index % 2 === 1 ? "justify-end" : ""} gap-3`}
                >
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
                        <span className="text-gray-300 font-neue-haas font-light text-sm">
                          {techData?.name || tech}
                        </span>
                      </div>
                    );
                  })}
                </div>

                <div className="mb-4">
                  <button
                    onClick={() =>
                      router.push(`/projects/${getProjectSlug(project)}`)
                    }
                    className="inline-flex items-center gap-2 text-white font-neue-haas font-medium tracking-wider hover:underline"
                  >
                    VIEW PROJECT
                    <ExternalLink size={16} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ListProjectSection;
