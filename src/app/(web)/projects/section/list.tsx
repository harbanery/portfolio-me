"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { ArrowUpRight, ExternalLink, Github } from "lucide-react";
import { menuRole } from "@/models/menu";
import { masterDataMap } from "@/models/master-data";
import { logoMap } from "@/models/icons";
import type { Project } from "@/models/project";

interface ProjectSectionProps {
  projects: Project[];
  /** GitHub profile URL from the personal contacts — the empty-state link. */
  githubUrl?: string | null;
  /** LinkedIn profile URL from the personal contacts — the empty-state link. */
  linkedinUrl?: string | null;
}

/** LinkedIn icon from the shared icon registry (FaLinkedin). */
const LinkedInIcon = logoMap.linkedin;

/**
 * Empty state: while the archive holds no projects, point visitors at
 * GitHub (the code) or LinkedIn (the story). With neither contact the
 * card simply explains that the data is being prepared.
 */
const ArchiveEmptyState = ({
  githubUrl,
  linkedinUrl,
}: {
  githubUrl?: string | null;
  linkedinUrl?: string | null;
}) => {
  const link = githubUrl ?? linkedinUrl;
  const isGithub = !!githubUrl;

  if (!link) {
    return (
      <section className="flex min-h-[80vh] items-center justify-center bg-black px-4 py-20">
        <div className="max-w-xl rounded-2xl border border-white/10 bg-white/[0.02] p-6 md:p-7">
          <h3 className="text-lg font-inter font-bold tracking-tight text-white md:text-xl">
            Projects are being prepared.
          </h3>
          <p className="mt-1.5 text-sm text-gray-500 font-neue-haas font-light tracking-wider">
            The archive will be published here soon.
          </p>
        </div>
      </section>
    );
  }

  return (
    <section className="flex min-h-[80vh] items-center justify-center bg-black px-4 py-20">
      <a
        href={link}
        target="_blank"
        rel="noopener noreferrer"
        className="group flex w-full max-w-xl flex-col gap-4 rounded-2xl border border-white/10 bg-white/[0.02] p-6 transition-[border-color,box-shadow] duration-500 ease-in-out hover:border-[#DEB887] hover:shadow-[0_0_24px_-6px_rgba(222,184,135,0.45)] sm:flex-row sm:items-center sm:justify-between md:p-7"
      >
        <div className="min-w-0">
          <h3 className="text-lg font-inter font-bold tracking-tight text-white md:text-xl">
            {isGithub
              ? "Selected work lives on GitHub."
              : "Selected work lives on LinkedIn."}
          </h3>
          <p className="mt-1.5 text-sm text-gray-500 font-neue-haas font-light tracking-wider">
            The project archive is being prepared for this site.
          </p>
        </div>
        <span className="inline-flex shrink-0 items-center gap-2 self-start rounded-full border border-white/15 px-5 py-2.5 font-martian-mono text-[11px] font-semibold uppercase tracking-[0.15em] text-gray-300 transition-colors duration-500 group-hover:border-[#DEB887]/60 group-hover:text-[#DEB887] sm:self-auto">
          {isGithub ? <Github size={14} /> : <LinkedInIcon size={14} />}
          {isGithub ? "View GitHub" : "View LinkedIn"}
          <ArrowUpRight
            size={12}
            className="transition-transform duration-500 group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
          />
        </span>
      </a>
    </section>
  );
};

/**
 * Role value (stored by the admin, e.g. "frontend") → display label from
 * menuRole ("Frontend Developer"). Unknown values fall back to the raw
 * string so nothing ever renders blank.
 */
const roleLabelOf = (role: string): string =>
  menuRole.find((entry) => entry.value === role)?.label ?? role;

/** Laptop column template with EVEN fr-based tracks so the gaps between
 *  columns stay consistent no matter the content: year fixed, made-at
 *  fixed-ish, project/built-with share the flexible space. Phones AND
 *  tablets render the mobile stack instead (single column) — the table
 *  exists only from lg up. */
const TABLE_COLS =
  "lg:grid-cols-[4rem_minmax(10rem,1.3fr)_minmax(9rem,1fr)_minmax(12rem,1.7fr)_minmax(8rem,1fr)]";

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

/** Viewport fraction that marks the "current" reading position — same
 *  tuning as the home side menu. */
const ACTIVE_LINE_RATIO = 0.35;

/**
 * Project archive — every ACTIVE project grouped by year (newest first;
 * `projects` arrives sorted by effective date descending). Phones and
 * tablets get a year heading per group plus a year side menu on the right
 * edge (scroll-spy, same behavior as the home side menu) and left-aligned
 * columns; laptops keep the original flat five-column table with centered
 * year/made-at columns.
 */
const ListProjectSection = ({
  projects,
  githubUrl,
  linkedinUrl,
}: ProjectSectionProps) => {
  /** Consecutive same-year rows collapse into one group (the sort already
   *  orders them, so groups appear newest-year first). */
  const yearGroups = useMemo(() => {
    const groups: { year: string; items: Project[] }[] = [];
    projects.forEach((project) => {
      const year = yearOf(project);
      const last = groups[groups.length - 1];
      if (last && last.year === year) last.items.push(project);
      else groups.push({ year, items: [project] });
    });
    return groups;
  }, [projects]);

  const [activeYear, setActiveYear] = useState<string | null>(null);
  const frame = useRef<number | null>(null);

  // Scroll-spy for the year side menu: the last group whose anchor crossed
  // the active line is current. rAF-throttled, mirroring SideMenu.
  useEffect(() => {
    const syncActive = () => {
      const line = window.innerHeight * ACTIVE_LINE_RATIO;
      let current: string | null = null;
      yearGroups.forEach((group) => {
        const el = document.getElementById(`year-${group.year}`);
        if (el && el.getBoundingClientRect().top <= line) current = group.year;
      });
      setActiveYear(current);
    };

    const reveal = requestAnimationFrame(syncActive);
    const handleScroll = () => {
      if (frame.current !== null) return;
      frame.current = requestAnimationFrame(() => {
        syncActive();
        frame.current = null;
      });
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => {
      cancelAnimationFrame(reveal);
      window.removeEventListener("scroll", handleScroll);
      if (frame.current !== null) cancelAnimationFrame(frame.current);
    };
  }, [yearGroups]);

  const goToYear = (year: string) => {
    document
      .getElementById(`year-${year}`)
      ?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  if (!projects || projects.length === 0) {
    return <ArchiveEmptyState githubUrl={githubUrl} linkedinUrl={linkedinUrl} />;
  }

  return (
    <section id="projects" className="relative bg-black py-24 md:py-32">
      {/* Year side menu — phones & tablets only; laptops read the year off
          the flat table's Year column. Same visual language as the home
          side menu: trailing rule, active year in tan. */}
      <nav
        aria-label="Project years"
        className="fixed right-2.5 top-1/2 z-40 flex -translate-y-1/2 flex-col items-end gap-3.5 lg:hidden"
      >
        {yearGroups.map((group) => {
          const isActive = activeYear === group.year;
          return (
            <button
              key={group.year}
              onClick={() => goToYear(group.year)}
              aria-current={isActive ? "true" : undefined}
              className={`group flex cursor-pointer items-center gap-2 font-martian-mono text-[10px] uppercase tracking-[0.2em] font-medium transition-colors duration-500 ${
                isActive ? "text-[#DEB887]" : "text-gray-600 hover:text-white"
              }`}
            >
              <span
                className={`h-px transition-all duration-500 ${
                  isActive
                    ? "w-4 bg-[#DEB887]"
                    : "w-0 bg-[#DEB887] group-hover:w-3"
                }`}
              />
              {group.year}
            </button>
          );
        })}
      </nav>

      {/* Right padding leaves room for the year side menu below lg. */}
      <div className="mx-auto w-full max-w-6xl pl-6 pr-16 md:pr-20 lg:px-10">
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

        {/* Table header — laptops only. Below lg every field stacks in one
            left-aligned column (the year lives in the group heading), so
            there is no header row to mirror. */}
        <div
          data-aos="fade-up"
          className={`hidden gap-x-6 border-b border-white/10 pb-3 font-martian-mono text-[10px] uppercase tracking-[0.25em] text-gray-600 lg:grid lg:gap-x-8 ${TABLE_COLS}`}
        >
          <span className="text-center">Year</span>
          <span>Project</span>
          <span className="text-center">Made at</span>
          <span>Built with</span>
          <span>Link</span>
        </div>

        <div>
          {yearGroups.map((group) => (
            <div
              key={group.year}
              id={`year-${group.year}`}
              className="scroll-mt-28"
            >
              {/* Year group heading — phones & tablets only; the laptop
                  table keeps its per-row Year column instead. */}
              <h3
                data-aos="fade-up"
                className="border-b border-white/10 py-4 font-martian-mono text-xs uppercase tracking-[0.25em] text-[#DEB887] tabular-nums lg:hidden"
              >
                {group.year}
              </h3>

              {group.items.map((project, index) => {
                // Made at: company name for internal/client work, blank
                // for personal projects.
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
                    className={`group grid grid-cols-1 gap-x-6 gap-y-2 border-b border-white/10 py-5 transition-colors duration-500 hover:bg-white/[0.02] max-lg:active:bg-white/[0.04] lg:items-baseline lg:gap-x-8 lg:py-6 ${TABLE_COLS}`}
                  >
                    {/* Year — laptop column only (the group heading covers
                        it on phones and tablets). Centered, as on the
                        original table. */}
                    <span className="hidden text-center font-martian-mono text-sm text-[#DEB887] tabular-nums lg:block">
                      {yearOf(project)}
                    </span>

                    {/* Project — left aligned, information only. Role
                        renders its menuRole label ("frontend" → "Frontend
                        Developer"). */}
                    <div className="min-w-0 flex flex-col gap-1.5">
                      <span className="font-inter font-semibold text-white transition-colors duration-500 group-hover:text-[#DEB887]">
                        {project.title}
                      </span>
                      <span className="font-martian-mono text-[10px] uppercase tracking-[0.15em] text-gray-400/70">
                        {roleLabelOf(project.role)}
                      </span>
                    </div>

                    {/* Made at — left aligned below lg, centered on
                        laptops. */}
                    <span
                      className="min-w-0 truncate text-left text-xs md:text-sm text-gray-400 font-neue-haas tracking-wider font-light lg:text-center"
                      title={madeAt}
                    >
                      {madeAt || <span className="text-gray-700">—</span>}
                    </span>

                    {/* Built with — left aligned; plain text skill names
                        (master-data display names) separated by middle
                        dots, no icons or tag pills. The dot TRAILS each
                        skill (except the last) so a wrapped line never
                        starts with a stray separator, and `break-words`
                        only splits names that are genuinely too long for
                        the column. */}
                    <span className="flex min-w-0 flex-wrap items-baseline gap-y-1 text-[10px] leading-relaxed font-martian-mono text-gray-300 md:text-xs">
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

                    {/* Link — left aligned. Website: host name with the
                        icon on its right. Repo (only when no website):
                        "github" with the icon on its LEFT. Neither:
                        "Coming soon". Opens externally in a new tab, never
                        the detail page. */}
                    <span className="flex min-w-0 items-center justify-start">
                      {href ? (
                        isRepo ? (
                          <a
                            href={href}
                            target="_blank"
                            rel="noopener noreferrer"
                            aria-label={`${project.title} repository`}
                            className="inline-flex cursor-pointer items-center gap-1.5 whitespace-nowrap text-xs md:text-sm text-gray-400 font-neue-haas tracking-wider font-light transition-colors duration-500 hover:text-[#DEB887]"
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
                            className="inline-flex cursor-pointer items-center gap-1.5 whitespace-nowrap text-xs md:text-sm text-gray-400 font-neue-haas tracking-wider font-light transition-colors duration-500 hover:text-[#DEB887]"
                          >
                            {hostOf(href)}
                            <ExternalLink size={15} className="shrink-0" />
                          </a>
                        )
                      ) : (
                        <span className="text-xs md:text-sm text-gray-600 font-neue-haas tracking-wider font-light italic">
                          Coming soon
                        </span>
                      )}
                    </span>
                  </div>
                );
              })}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ListProjectSection;
