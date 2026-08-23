"use client";

import { ExternalLink, Github } from "lucide-react";
import { logoMap } from "@/models/icons";
import { masterDataMap } from "@/models/master-data";
import type { Project } from "@/models/project";

interface ProjectSectionProps {
  projects: Project[];
}

/** Desktop column template — sized so no column crowds another:
 *  year fixed, project/made-at/link content-width via max-content,
 *  built-with absorbs the rest and wraps its pills. */
const TABLE_COLS =
  "md:grid-cols-[3.5rem_minmax(9rem,1fr)_minmax(8rem,0.9fr)_minmax(12rem,1.6fr)_minmax(7rem,max-content)]";

/** Link host without protocol — "vercel.com" from the full URL. */
const hostOf = (url: string): string => {
  try {
    return new URL(url).host.replace(/^www\./, "");
  } catch {
    return url;
  }
};

/** Archive year: end date when set, else the record's creation date. */
const yearOf = (project: Project): string => {
  const raw = project.endDate || project.createdAt;
  if (!raw) return "—";
  const year = new Date(raw).getFullYear();
  return Number.isNaN(year) ? "—" : `${year}`;
};

/**
 * Project archive table — every ACTIVE project in a five-column index:
 * year (end date, falling back to the record's creation date), project
 * name, made at (company for internal/client work), built with (all
 * skills), and a single link (website, else repo) shown as its host name
 * with the icon on the right; "Coming soon" when neither exists. Rows are
 * informational only — nothing navigates to the project detail page; the
 * link column opens the external site in a new tab.
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
          className={`hidden gap-x-6 border-b border-white/10 pb-3 text-[10px] uppercase tracking-[0.25em] text-gray-600 md:grid lg:gap-x-8 ${TABLE_COLS}`}
        >
          <span>Year</span>
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
                className={`group grid grid-cols-1 gap-x-6 gap-y-2 border-b border-white/10 py-5 transition-colors duration-300 hover:bg-white/[0.02] md:items-baseline md:py-6 lg:gap-x-8 ${TABLE_COLS}`}
              >
                {/* Year */}
                <span className="text-xs text-[#DEB887] tabular-nums md:text-sm">
                  {yearOf(project)}
                </span>

                {/* Project — information only, no detail navigation */}
                <span className="min-w-0 font-inter font-semibold text-white transition-colors duration-300 group-hover:text-[#DEB887]">
                  {project.title}
                </span>

                {/* Made at */}
                <span className="min-w-0 truncate text-sm text-gray-400 font-neue-haas font-light" title={madeAt}>
                  {madeAt || <span className="text-gray-700">—</span>}
                </span>

                {/* Built with — every skill, icon + name; pills wrap within
                    the column instead of stretching the row. */}
                <span className="flex min-w-0 flex-wrap items-center gap-1.5">
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

                {/* Link — host name with the icon on its right; repo links
                    read "github"; no link at all reads "Coming soon". The
                    only interactive element: opens externally, in a new
                    tab, never the detail page. */}
                <span className="flex min-w-0 items-center justify-start md:justify-end">
                  {href ? (
                    <a
                      href={href}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={`${project.title} ${isRepo ? "repository" : "website"}`}
                      className="inline-flex items-center gap-1.5 whitespace-nowrap text-sm text-gray-400 font-neue-haas font-light transition-colors duration-300 hover:text-[#DEB887]"
                    >
                      {isRepo ? "github" : hostOf(href)}
                      {isRepo ? (
                        <Github size={15} className="shrink-0" />
                      ) : (
                        <ExternalLink size={15} className="shrink-0" />
                      )}
                    </a>
                  ) : (
                    <span className="text-sm text-gray-600 font-neue-haas font-light italic">
                      Coming soon
                    </span>
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
