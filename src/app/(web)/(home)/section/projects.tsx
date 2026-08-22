"use client";

import { ArrowRight, ExternalLink, Folder, Github } from "lucide-react";
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

/** Featured projects shown on the home page. */
const FEATURED_COUNT = 4;

/**
 * Featured work, following the "Some Things I've Built" layout:
 * alternating screenshot + content rows, the content panel overlapping
 * the image, a gradient washing the image toward the panel, and icon
 * links (repo / live site). The skill list keeps the site's tag pills
 * with icons.
 */
const ProjectSection = ({ projects }: ProjectSectionProps) => {
  const router = useRouter();

  if (projects.length === 0) return null;

  const featured = projects.slice(0, FEATURED_COUNT);

  return (
    <section id="projects" className="relative bg-black py-24 md:py-32">
      <div className="mx-auto w-full max-w-6xl px-6 lg:px-10">
        <SectionHeading
          label="Work"
          meta={`${projects.length} PROJECTS`}
          lineOne="What shipped,"
          lineTwo="and what it moved."
        />

        <p
          data-aos="fade-up"
          className="max-w-[60ch] text-lg text-gray-400 font-neue-haas font-light leading-relaxed mb-16 md:mb-24"
        >
          Selected work, front to back. Each one shipped, measured, and still
          standing.
        </p>

        <div className="space-y-24 md:space-y-40">
          {featured.map((project, index) => {
            const flipped = index % 2 === 1;
            const repoUrl = project.repoLinks[0];

            return (
              <article
                key={project.id}
                data-aos={flipped ? "fade-left" : "fade-right"}
                className="group grid items-center gap-6 md:grid-cols-12 md:gap-0"
              >
                {/* Screenshot — under the content panel, gradient washing
                    toward the panel side on desktop. */}
                <button
                  onClick={() =>
                    router.push(`/projects/${getProjectSlug(project)}`)
                  }
                  aria-label={`Open ${project.title}`}
                  className={`relative block overflow-hidden rounded-lg border border-white/10 transition-colors duration-500 hover:border-[#DEB887]/50 md:col-span-7 ${
                    flipped
                      ? "md:col-start-6 md:row-start-1"
                      : "md:col-span-7 md:col-start-1 md:row-start-1"
                  }`}
                >
                  <div className="aspect-[16/10] bg-gray-900">
                    {project.image && (
                      <img
                        src={project.image}
                        alt={project.title}
                        className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.03]"
                        loading={index === 0 ? "eager" : "lazy"}
                        fetchPriority={index === 0 ? "high" : "auto"}
                      />
                    )}
                  </div>
                  {/* Mobile: darken the whole shot; desktop: fade toward
                      the overlapping panel. */}
                  <div
                    className={`pointer-events-none absolute inset-0 bg-black/45 md:bg-black/0 ${
                      flipped
                        ? "md:bg-linear-to-l md:from-transparent md:via-black/35 md:to-black/70"
                        : "md:bg-linear-to-r md:from-transparent md:via-black/35 md:to-black/70"
                    } transition-opacity duration-500 group-hover:opacity-75`}
                  />
                </button>

                {/* Content panel — overlaps the screenshot, elevated. */}
                <div
                  className={`relative z-10 rounded-lg border border-white/10 bg-[#0a0a0a] p-6 shadow-[0_10px_35px_-15px_rgba(0,0,0,0.9)] transition-colors duration-500 group-hover:border-[#DEB887]/40 md:col-span-7 md:p-7 ${
                    flipped
                      ? "md:col-start-1 md:row-start-1 md:mr-8"
                      : "md:col-start-6 md:row-start-1 md:ml-8"
                  }`}
                >
                  <p className="mb-2 text-[10px] font-inter font-semibold uppercase tracking-[0.25em] text-[#DEB887]">
                    Featured Project
                  </p>

                  <button
                    onClick={() =>
                      router.push(`/projects/${getProjectSlug(project)}`)
                    }
                    className="text-left text-xl font-inter font-bold tracking-tight text-white transition-colors duration-300 hover:text-[#DEB887] md:text-2xl"
                  >
                    {project.title}
                  </button>

                  {project.description && (
                    <div
                      className="mt-3 text-sm text-gray-400 text-justify font-neue-haas font-light leading-relaxed line-clamp-3 paragraph-wrapper wrap-anywhere"
                      dangerouslySetInnerHTML={{
                        __html: normalizeHtmlBody(project.description),
                      }}
                    />
                  )}

                  {/* Skill tags — the site's pill component with icons. */}
                  <div className="mt-5 flex flex-wrap gap-2">
                    {project.skills.slice(0, 6).map((tech) => {
                      const Icon = logoMap[tech.toLowerCase()];
                      const techData = masterDataMap[tech.toLowerCase()];
                      return (
                        <span
                          key={tech}
                          className="inline-flex items-center gap-2 rounded-full border border-white/13 px-3 py-1 text-xs text-gray-300 font-neue-haas"
                        >
                          {Icon && <Icon className="h-3.5 w-3.5" />}
                          {techData?.name || tech}
                        </span>
                      );
                    })}
                  </div>

                  {/* Links */}
                  <div className="mt-5 flex items-center gap-4 text-gray-400">
                    {repoUrl && (
                      <a
                        href={repoUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label={`${project.title} repository`}
                        className="transition-colors duration-300 hover:text-[#DEB887]"
                      >
                        <Github size={18} />
                      </a>
                    )}
                    {project.webLink && (
                      <a
                        href={project.webLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label={`${project.title} live site`}
                        className="transition-colors duration-300 hover:text-[#DEB887]"
                      >
                        <ExternalLink size={18} />
                      </a>
                    )}
                    <button
                      onClick={() =>
                        router.push(`/projects/${getProjectSlug(project)}`)
                      }
                      className="ml-auto inline-flex items-center gap-1.5 text-[10px] font-inter font-semibold uppercase tracking-[0.2em] text-gray-300 transition-colors duration-300 hover:text-white"
                    >
                      Details
                      <ArrowRight size={12} />
                    </button>
                  </div>
                </div>
              </article>
            );
          })}
        </div>

        {projects.length > FEATURED_COUNT && (
          <div data-aos="fade-up" className="mt-16 flex justify-center">
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
