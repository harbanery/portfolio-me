"use client";

import { ArrowRight } from "lucide-react";
import { logoMap } from "@/utils/helpers/icon";
import { useRouter } from "next/navigation";
import { getProjectSlug } from "@/utils/slug";

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

const ProjectSection = ({ projects }: ProjectSectionProps) => {
  const router = useRouter();

  if (projects.length === 0) return null;

  const renderSkillIcon = (skill: string) => {
    const Icon = logoMap[skill];
    return Icon ? <Icon size={20} /> : null;
  };

  const gridCols = (length: number) => {
    switch (length) {
      case 1:
        return "grid-cols-1";
      case 2:
        return "grid-cols-2";
      case 3:
        return "grid-cols-3";
      default:
        return "grid-cols-3";
    }
  };

  return (
    <section
      id="projects"
      className="bg-gray-950 flex items-center justify-center px-4 py-20"
    >
      <div className="max-w-7xl mx-auto w-full">
        <h2
          data-aos="fade-left"
          data-aos-delay="200"
          className="text-5xl lg:text-5xl font-neue-haas text-white font-light mb-4 text-right"
        >
          Featured Projects
        </h2>
        <p
          data-aos="fade-left"
          data-aos-delay="250"
          className="text-md sm:text-lg md:text-xl text-gray-400 font-neue-haas font-light mb-12 tracking-wider leading-relaxed text-right"
        >
          Some things I've built & worked on recently
        </p>

        <div className={`grid ${gridCols(projects.length)} gap-4 mb-8`}>
          {projects.map((project, index) => (
            <button
              key={project.id}
              data-aos="fade-left"
              data-aos-delay={`${(index + 2) * 100}`}
              onClick={() =>
                router.push(`/projects/${getProjectSlug(project)}`)
              }
              className="relative aspect-video bg-gray-800 rounded-none overflow-hidden group grayscale transition-all duration-300"
            >
              <img
                src={project.image}
                alt={project.title}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-60 transition-all duration-300 flex items-center justify-center">
                <span className="text-white font-neue-haas text-2xl lg:text-3xl font-light opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  {project.title}
                </span>
              </div>
            </button>
          ))}
        </div>

        <button
          data-aos="fade-zoom-in"
          data-aos-delay="100"
          onClick={() => router.push(`/projects`)}
          className={`inline-flex items-center gap-2 text-white font-neue-haas font-medium tracking-wider hover:translate-x-1 transition-transform duration-200`}
        >
          VIEW MORE PROJECTS
          <ArrowRight size={16} />
        </button>
      </div>
    </section>
  );
};

export default ProjectSection;
