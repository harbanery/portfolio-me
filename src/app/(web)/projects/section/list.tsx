"use client";

import { ExternalLink, Github } from "lucide-react";
import { menuRole } from "@/models/menu";
import { masterDataMap } from "@/models/master-data";
import type { Project } from "@/models/project";

interface ProjectSectionProps {
  projects: Project[];
}

/**
 * Role value (stored by the admin, e.g. "frontend") → display label from
 * menuRole ("Frontend Developer"). Unknown values fall back to the raw
 * string so nothing ever renders blank.
 */
const roleLabelOf = (role: string): string =>
  menuRole.find((entry) => entry.value === role)?.label ?? role;

/** Desktop column template with EVEN fr-based tracks so the gaps between
 *  columns stay consistent no matter the content: year fixed, made-at
 *  fixed-ish, project/built-with share the flexible space. */
const TABLE_COLS =
  "md:grid-cols-[4rem_minmax(10rem,1.3fr)_minmax(9rem,1fr)_minmax(12rem,1.7fr)_minmax(8rem,1fr)]";

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
          className="mb-2 font-martian-mono text-xs uppercase tracking-[0.25em] text-gray-500"
        >
          Project Archives
        </p>
        <h2
          data-aos="fade-up"
          data-aos-delay="100"
          className="mb-10 font-inter font-extrabold text-white leading-[1.02] tracking-tight text-[clamp(2.25rem,6vw,4.75rem)]"
        >
          Things I&apos;ve built.
        </h2>

        {/* Table header — alignment mirrors the rows: year and made at
            centered, project/built-with/link left. */}
        <div
          data-aos="fade-up"
          className={`hidden gap-x-6 border-b border-white/10 pb-3 font-martian-mono text-[10px] uppercase tracking-[0.25em] text-gray-600 md:grid lg:gap-x-8 ${TABLE_COLS}`}
        >
          <span className="text-center">Year</span>
          <span>Project</span>
          <span className="text-center">Made at</span>
          <span>Built with</span>
          <span>Link</span>
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
                data-aos-delay={`${((index % 3) + 1) * 75}`}
                className={`group grid grid-cols-1 gap-x-6 gap-y-2 border-b border-white/10 py-5 transition-colors duration-500 hover:bg-white/[0.02] md:items-baseline md:py-6 lg:gap-x-8 ${TABLE_COLS}`}
              >
                {/* Year — centered */}
                <span className="font-martian-mono text-center text-xs text-[#DEB887] tabular-nums md:text-sm">
                  {yearOf(project)}
                </span>

                {/* Project — left aligned, information only. Role renders
                    its menuRole label ("frontend" → "Frontend Developer"). */}
                <div className="min-w-0 flex flex-col gap-1.5">
                  <span className="font-inter font-semibold text-white transition-colors duration-500 group-hover:text-[#DEB887]">
                    {project.title}
                  </span>
                  <span className="font-martian-mono text-[10px] uppercase tracking-[0.15em] text-gray-400/70">
                    {roleLabelOf(project.role)}
                  </span>
                </div>

                {/* Made at — centered */}
                <span
                  className="min-w-0 truncate text-center text-sm text-gray-400 font-neue-haas tracking-wider font-light"
                  title={madeAt}
                >
                  {madeAt || <span className="text-gray-700">—</span>}
                </span>

                {/* Built with — left aligned; plain text skill names
                    (master-data display names) separated by middle dots,
                    no icons or tag pills. The dot TRAILS each skill (except
                    the last) so a wrapped line never starts with a stray
                    separator, and `break-words` only splits names that are
                    genuinely too long for the column. */}
                <span className="flex min-w-0 flex-wrap items-baseline gap-y-1 text-xs leading-relaxed font-martian-mono text-gray-300">
                  {project.skills.map((tech, skillIndex) => {
                    const isLast = skillIndex === project.skills.length - 1;
                    return (
                      <span key={tech} className="max-w-full break-words">
                        {masterDataMap[tech.toLowerCase()]?.name || tech}
                        {!isLast && (
                          <span className="mx-1.5 text-[#DEB887]">·</span>
                        )}
                      </span>
                    );
                  })}
                </span>

                {/* Link — left aligned. Website: host name with the icon on
                    its right. Repo (only when no website): "github" with
                    the icon on its LEFT. Neither: "Coming soon". Opens
                    externally in a new tab, never the detail page. */}
                <span className="flex min-w-0 items-center justify-start">
                  {href ? (
                    isRepo ? (
                      <a
                        href={href}
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label={`${project.title} repository`}
                        className="inline-flex cursor-pointer items-center gap-1.5 whitespace-nowrap text-sm text-gray-400 font-neue-haas tracking-wider font-light transition-colors duration-500 hover:text-[#DEB887]"
                      >
                        <Github size={15} className="shrink-0" />
                        Github
                      </a>
                    ) : (
                      <a
                        href={href}
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label={`${project.title} website`}
                        className="inline-flex cursor-pointer items-center gap-1.5 whitespace-nowrap text-sm text-gray-400 font-neue-haas tracking-wider font-light transition-colors duration-500 hover:text-[#DEB887]"
                      >
                        {hostOf(href)}
                        <ExternalLink size={15} className="shrink-0" />
                      </a>
                    )
                  ) : (
                    <span className="text-sm text-gray-600 font-neue-haas tracking-wider font-light italic">
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
