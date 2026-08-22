"use client";

import { ExternalLink, Github } from "lucide-react";
import { logoMap } from "@/models/icons";
import { masterDataMap } from "@/models/master-data";
import type { Project } from "@/models/project";

interface ProjectSectionProps {
  projects: Project[];
}

/**
 * Project archive table — every ACTIVE project in a four-column index:
 * project name, made at (company for internal/client work), built with
 * (all skills, icons + names), and a single link (website, else repo).
 */
const ListProjectSection = ({ projects }: ProjectSectionProps) => {
  if (!projects || projects.length === 0) {
    return (
      <section className="flex min-h-[80vh] items-center justify-center bg-black px-4 py-20">
        <p className="text-2xl text-gray-400 font-neue-haas font-light">
          No projects available at the moment.
        </p>
      </section>
    );
  }

  return (
    <section id="projects" className="relative bg-black py-24 md:py-32">
      <div className="mx-auto w-full max-w-6xl px-6 lg:px-10">
        <p
          data-aos="fade-up"
          className="mb-2 text-xs uppercase tracking-[0.25em] text-gray-500"
        >
          Archive
        </p>
        <h2
          data-aos="fade-up"
          data-aos-delay="100"
          className="mb-10 font-inter font-extrabold text-white leading-[1.02] tracking-tight text-[clamp(2.25rem,6vw,4.75rem)]"
        >
          Things I&apos;ve built.
        </h2>

        {/* Table header */}
        <div
          data-aos="fade-up"
          className="hidden grid-cols-[1.4fr_0.9fr_1.8fr_auto] gap-x-8 border-b border-white/10 pb-3 text-[10px] uppercase tracking-[0.25em] text-gray-600 md:grid"
        >
          <span>Project</span>
          <span>Made at</span>
          <span>Built with</span>
          <span className="text-right">Link</span>
        </div>

        <div>
          {projects.map((project, index) => {
            // Made at: company name for internal/client work, blank for
            // personal projects.
            const madeAt =
              project.projectType === "internal" ||
              project.projectType === "client"
                ? project.companyName || project.clientName || ""
                : "";

            // One link max: website preferred, else the first repo.
            const href = project.webLink || project.repoLinks[0] || null;
            const isRepo = !project.webLink && !!project.repoLinks[0];

            return (
              <div
                key={project.id}
                data-aos="fade-up"
                data-aos-delay={`${(index % 3 + 1) * 75}`}
                className="group grid grid-cols-1 gap-x-8 gap-y-2 border-b border-white/10 py-5 transition-colors duration-300 hover:bg-white/[0.02] md:grid-cols-[1.4fr_0.9fr_1.8fr_auto] md:items-baseline md:py-6"
              >
                {/* Project */}
                <span className="font-inter font-semibold text-white transition-colors duration-300 group-hover:text-[#DEB887]">
                  {project.title}
                </span>

                {/* Made at */}
                <span className="text-sm text-gray-400 font-neue-haas font-light">
                  {madeAt || <span className="text-gray-700">—</span>}
                </span>

                {/* Built with — every skill, icon + name */}
                <span className="flex flex-wrap items-center gap-2">
                  {project.skills.map((tech) => {
                    const Icon = logoMap[tech.toLowerCase()];
                    const name = masterDataMap[tech.toLowerCase()]?.name || tech;
                    return (
                      <span
                        key={tech}
                        className="inline-flex items-center gap-1.5 rounded-full border border-white/13 px-2.5 py-0.5 text-xs text-gray-300 font-neue-haas"
                      >
                        {Icon ? (
                          <Icon className="h-3 w-3 shrink-0" />
                        ) : (
                          <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-gray-500" />
                        )}
                        {name}
                      </span>
                    );
                  })}
                </span>

                {/* Link */}
                <span className="flex items-center md:justify-self-end">
                  {href ? (
                    <a
                      href={href}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={`${project.title} ${isRepo ? "repository" : "website"}`}
                      className="text-gray-500 transition-colors duration-300 hover:text-[#DEB887]"
                    >
                      {isRepo ? <Github size={16} /> : <ExternalLink size={16} />}
                    </a>
                  ) : (
                    <span className="text-gray-700">—</span>
                  )}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default ListProjectSection;
