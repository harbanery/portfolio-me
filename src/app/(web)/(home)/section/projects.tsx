"use client";

import { ArrowRight } from "lucide-react";
import { useRouter } from "next/navigation";
import SectionHeading from "@/components/section-heading";
import { getProjectSlug } from "@/utils/slug";
import { logoMap } from "@/models/icons";
import { masterDataMap } from "@/models/master-data";
import { normalizeHtmlBody } from "@/helpers";
import type { Project } from "@/models/project";

interface ProjectSectionProps {
  projects: Project[];
}

const ProjectSection = ({ projects }: ProjectSectionProps) => {
  const router = useRouter();

  if (projects.length === 0) return null;

  return (
    <section id="projects" className="relative bg-black py-24 md:py-32">
      <div className="mx-auto w-full max-w-6xl px-6 lg:px-10">
        <SectionHeading
          number="03"
          label="Work"
          meta={`${projects.length} PROJECTS`}
          lineOne="What shipped,"
          lineTwo="and what it moved."
        />

        <p
          data-aos="fade-up"
          className="max-w-[60ch] text-lg text-gray-400 font-neue-haas font-light leading-relaxed mb-14 md:mb-20"
        >
          Selected work, front to back. Each one shipped, measured, and still
          standing.
        </p>

        <div className="space-y-6">
          {projects.slice(0, 4).map((project, index) => (
            <button
              key={project.id}
              data-aos="fade-up"
              data-aos-delay={`${((index % 2) + 1) * 100}`}
              onClick={() =>
                router.push(`/projects/${getProjectSlug(project)}`)
              }
              className="group grid md:grid-cols-[1fr_2fr] gap-6 md:gap-10 w-full text-left border border-white/10 rounded-2xl p-5 md:p-6 hover:border-white/25 transition-colors duration-300"
            >
              {/* Thumbnail */}
              <div className="relative aspect-video md:aspect-[4/3] bg-gray-900 rounded-xl overflow-hidden grayscale group-hover:grayscale-0 transition-all duration-300">
                {project.image && (
                  <img
                    src={project.image}
                    alt={project.title}
                    className="w-full h-full object-cover"
                    loading={index === 0 ? "eager" : "lazy"}
                    fetchPriority={index === 0 ? "high" : "auto"}
                  />
                )}
              </div>

              {/* Body */}
              <div className="flex flex-col justify-center min-w-0">
                <div className="flex flex-wrap items-center gap-x-4 gap-y-2 mb-3">
                  <span className="text-[10px] uppercase tracking-[0.25em] text-[#DEB887]">
                    {masterDataMap[project.role]?.name || project.role}
                  </span>
                  {project.repoLinks.length === 0 && (
                    <span className="text-[10px] uppercase tracking-[0.25em] text-gray-600 border border-white/10 rounded-full px-3 py-0.5">
                      Private
                    </span>
                  )}
                </div>

                <h3 className="text-2xl md:text-3xl font-inter font-bold text-white mb-3 tracking-tight">
                  {project.title}
                </h3>

                {project.description && (
                  <div
                    className="text-base text-gray-400 text-justify font-neue-haas font-light leading-relaxed line-clamp-2 paragraph-wrapper wrap-anywhere mb-5"
                    dangerouslySetInnerHTML={{
                      __html: normalizeHtmlBody(project.description),
                    }}
                  />
                )}

                <div className="flex flex-wrap items-center gap-2">
                  {project.skills.slice(0, 5).map((tech) => {
                    const Icon = logoMap[tech.toLowerCase()];
                    const techData = masterDataMap[tech.toLowerCase()];
                    return (
                      <span
                        key={tech}
                        className="inline-flex items-center gap-2 rounded-full border border-white/13 px-3 py-1 text-xs text-gray-300 font-neue-haas"
                      >
                        {Icon ? (
                          <Icon className="h-3.5 w-3.5" />
                        ) : (
                          <span className="h-1.5 w-1.5 rounded-full bg-gray-500" />
                        )}
                        {techData?.name || tech}
                      </span>
                    );
                  })}
                </div>

                <span className="mt-6 inline-flex items-center gap-2 text-sm font-inter font-semibold tracking-wider text-white">
                  VIEW PROJECT
                  <ArrowRight
                    size={16}
                    className="transition-transform duration-200 group-hover:translate-x-1"
                  />
                </span>
              </div>
            </button>
          ))}
        </div>

        {projects.length > 4 && (
          <div
            data-aos="fade-up"
            className="mt-12 flex md:grid md:grid-cols-[1fr_2fr] md:gap-10"
          >
            <span className="hidden md:block" />
            <button
              onClick={() => router.push("/projects")}
              className="inline-flex items-center gap-2 rounded-full border border-white/20 px-8 py-4 text-sm font-inter font-semibold tracking-wider text-white hover:border-white/50 transition-colors duration-300"
            >
              ALL PROJECTS
              <ArrowRight size={16} />
            </button>
          </div>
        )}
      </div>
    </section>
  );
};

export default ProjectSection;
