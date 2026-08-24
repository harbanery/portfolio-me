"use client";

import { ArrowRight, ExternalLink, Github, Lock } from "lucide-react";
import { useRouter } from "next/navigation";
import SectionHeading from "@/components/section-heading";
import { logoMap } from "@/models/icons";
import { masterDataMap } from "@/models/master-data";
import { normalizeHtmlBody } from "@/helpers";
import type { Project } from "@/models/project";

/** Postman icon from the shared icon registry (SiPostman). */
const PostmanIcon = logoMap.postman;

interface ProjectSectionProps {
  projects: Project[];
  /** Total ACTIVE projects from the database — drives the heading count. */
  totalCount?: number;
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
const ProjectSection = ({ projects, totalCount }: ProjectSectionProps) => {
  const router = useRouter();

  if (projects.length === 0) return null;

  const featured = projects.slice(0, FEATURED_COUNT);
  // The heading count reflects every ACTIVE project in the database, not
  // just the showcaseable/featured subset rendered below.
  const count = totalCount ?? projects.length;

  return (
    <section id="projects" className="relative bg-black py-24 md:py-32">
      <div className="mx-auto w-full max-w-6xl px-6 lg:px-10">
        <SectionHeading
          label="Work"
          meta={`${count} PROJECTS`}
          metaCount={count}
          lineOne="What shipped,"
          lineTwo="and what it moved."
        />

        <p
          data-aos="fade-up"
          className="max-w-[60ch] text-base md:text-lg text-gray-400 font-neue-haas font-light tracking-wider leading-relaxed mb-16 md:mb-24"
        >
          Selected work, front to back. Each one shipped, measured, and still
          standing.
        </p>

        <div className="space-y-24 md:space-y-40">
          {featured.map((project, index) => {
            const flipped = index % 2 === 1;
            const repoUrl = project.repoLinks[0];

            return (
              <article key={project.id} data-aos={flipped ? "fade-left" : "fade-right"}>
                {/* AOS animates the article; the Tailwind group/hover
                    lives on the inner grid so transitions keep working. */}
                <div className="group grid items-center gap-6 md:grid-cols-12 md:gap-0">
                {/* Screenshot — under the content panel, gradient washing
                    toward the panel side on desktop. Rests in black &
                    white, coloring up on hover. Presentation only: no
                    click-through to the detail page. */}
                <div
                  className={`relative block overflow-hidden rounded-lg border border-white/10 md:col-span-7 ${
                    flipped
                      ? "md:col-start-6 md:row-start-1"
                      : "md:col-span-7 md:col-start-1 md:row-start-1"
                  }`}
                >
                  <div className="aspect-video bg-gray-900">
                    {project.image && (
                      <img
                        src={project.image}
                        alt={project.title}
                        className="h-full w-full object-cover grayscale transition-[filter] duration-500 ease-in-out group-hover:grayscale-0"
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
                </div>

                {/* Content panel — overlaps the screenshot, elevated. On
                    hover the border lights up gold with a soft glow. */}
                <div
                  className={`relative z-10 rounded-lg border border-white/10 bg-[#0a0a0a] p-6 shadow-[0_10px_35px_-15px_rgba(0,0,0,0.9)] transition-[border-color,box-shadow] duration-500 group-hover:border-[#DEB887] group-hover:shadow-[0_0_24px_-6px_rgba(222,184,135,0.45)] md:col-span-7 md:p-7 ${
                    flipped
                      ? "md:col-start-1 md:row-start-1 md:mr-8"
                      : "md:col-start-6 md:row-start-1 md:ml-8"
                  }`}
                >
                  {/* Eyebrow + ownership badge. Internal work is private
                      (lock icon), client work is client owned, personal
                      projects carry no badge. */}
                  <div className="mb-2 flex items-center justify-between gap-3">
                    <p className="text-[10px] font-martian-mono uppercase tracking-[0.25em] text-[#DEB887]">
                      Featured Project
                    </p>
                    {project.projectType === "internal" && (
                      <span className="inline-flex items-center gap-1.5 rounded-full border border-white/13 px-2.5 py-0.5 font-inter font-medium text-[10px] uppercase tracking-[0.18em] text-gray-400">
                        <Lock size={10} />
                        Private
                      </span>
                    )}
                    {project.projectType === "client" && (
                      <span className="inline-flex items-center rounded-full border border-[#DEB887]/40 px-2.5 py-0.5 font-inter font-medium text-[10px] uppercase tracking-[0.18em] text-[#DEB887]">
                        Client Owned
                      </span>
                    )}
                  </div>

                  <h3 className="text-xl font-inter font-bold tracking-tight text-white md:text-2xl">
                    {project.title}
                  </h3>

                  {project.description && (
                    <div
                      className="mt-3 text-sm text-gray-400 text-justify font-neue-haas font-light tracking-wider leading-relaxed paragraph-wrapper wrap-anywhere lg:line-clamp-3"
                      dangerouslySetInnerHTML={{
                        __html: normalizeHtmlBody(project.description),
                      }}
                    />
                  )}

                  {/* Skill tags — the site's pill component with icons,
                      sized like the capabilities grid pills. */}
                  <div className="mt-5 flex flex-wrap gap-1.5 md:gap-2">
                    {project.skills.map((tech) => {
                      const Icon = logoMap[tech.toLowerCase()];
                      const techData = masterDataMap[tech.toLowerCase()];
                      return (
                        <span
                          key={tech}
                          className="inline-flex items-center gap-1.5 md:gap-2 rounded-full border border-white/13 px-2 py-0.5 text-[10px] md:px-3 md:py-1 md:text-xs text-gray-300 font-neue-haas"
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
                        className="transition-colors duration-500 hover:text-[#DEB887]"
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
                        className="transition-colors duration-500 hover:text-[#DEB887]"
                      >
                        <ExternalLink size={18} />
                      </a>
                    )}
                    {project.apiDocumentation && (
                      <a
                        href={project.apiDocumentation}
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label={`${project.title} API documentation`}
                        title="API documentation (Postman)"
                        className="transition-colors duration-500 hover:text-[#DEB887]"
                      >
                        <PostmanIcon size={18} />
                      </a>
                    )}
                  </div>
                </div>
                </div>
              </article>
            );
          })}
        </div>

        {count > FEATURED_COUNT && (
          <div data-aos="fade-up" className="mt-16 flex justify-center">
            <button
              onClick={() => router.push("/projects")}
              className="group inline-flex cursor-pointer items-center gap-2 rounded-full border border-white/20 px-6 py-3 text-xs sm:px-7 sm:py-3.5 sm:text-sm md:px-8 md:py-4 font-martian-mono tracking-wider text-white hover:border-white/50 transition-colors duration-500"
            >
              CLICK FOR ALL PROJECTS
              <ArrowRight
                size={16}
                className="transition-transform duration-500 group-hover:translate-x-1"
              />
            </button>
          </div>
        )}
      </div>
    </section>
  );
};

export default ProjectSection;
