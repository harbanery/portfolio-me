import prisma from "@/server/db";
import type {
  ArchiveProject,
  Project,
  ShowcaseProject,
} from "@/models/project";

/**
 * Data service for portfolio projects.
 * Mirrors the progress-self pattern: server actions stay thin and delegate
 * data access to `src/services`. No dummy fallback: an empty or unreachable
 * database yields an empty list and the UI renders its empty state.
 */

/**
 * Full column set — used by the single-project lookups only. The list
 * endpoints below select leaner shapes so long-form fields (story,
 * features, highlights, challenges, solutions, outcomes, galleries)
 * never bloat the RSC payload embedded in the HTML.
 */
const projectColumns = {
  id: true,
  title: true,
  subtitle: true,
  projectType: true,
  clientName: true,
  companyName: true,
  role: true,
  image: true,
  images: true,
  description: true,
  apiDocumentation: true,
  features: true,
  highlights: true,
  challenges: true,
  solutions: true,
  story: true,
  outcomes: true,
  skills: true,
  repoLinks: true,
  webLink: true,
  order: true,
  endDate: true,
  createdAt: true,
} as const;

/** Showcase (home) columns — everything the featured card renders.
 *  `updatedAt` feeds the cover URL's cache buster (not part of the
 *  public shape). */
const showcaseColumns = {
  id: true,
  title: true,
  projectType: true,
  image: true,
  description: true,
  apiDocumentation: true,
  skills: true,
  repoLinks: true,
  webLink: true,
  updatedAt: true,
} as const;

/** Archive (/projects) columns — everything the year table renders. */
const archiveColumns = {
  id: true,
  title: true,
  projectType: true,
  clientName: true,
  companyName: true,
  role: true,
  skills: true,
  repoLinks: true,
  webLink: true,
  endDate: true,
  createdAt: true,
} as const;

/**
 * Showcase order: smallest `order` first (top of the page), newest created
 * breaking ties.
 */
const projectOrdering = [{ order: "asc" as const }, { createdAt: "desc" as const }];

/**
 * A project is only showcased when it is presentable: has a cover image and
 * a live web link. Ongoing/active status is enforced by isOngoing when the
 * column exists (older rows without it default true in the schema).
 */
const isShowcaseable = (
  project: Pick<Project, "image" | "webLink">,
): boolean => !!project.image && !!project.webLink;

/**
 * Effective archive date as a timestamp: the completion date (endDate) when
 * set, else the record's creation date — the same date that drives the
 * archive year column. Dateless records sink to the bottom (0).
 */
const archiveTimestampOf = (
  project: Pick<ArchiveProject, "endDate" | "createdAt">,
): number => {
  const raw = project.endDate || project.createdAt;
  if (!raw) return 0;
  const time = new Date(raw).getTime();
  return Number.isNaN(time) ? 0 : time;
};

const createdTimestampOf = (
  project: Pick<ArchiveProject, "createdAt">,
): number =>
  project.createdAt ? new Date(project.createdAt).getTime() || 0 : 0;

/**
 * Archive ordering: latest year first, then latest month — the effective
 * archive date descending. Records sharing a date fall back to newest
 * created first; dateless records sink to the bottom.
 */
const byArchiveDateDesc = (
  a: Pick<ArchiveProject, "endDate" | "createdAt">,
  b: Pick<ArchiveProject, "endDate" | "createdAt">,
): number =>
  archiveTimestampOf(b) - archiveTimestampOf(a) ||
  createdTimestampOf(b) - createdTimestampOf(a);

/** Every ACTIVE showcaseable project, smallest order first. */
export async function getProjects(): Promise<ShowcaseProject[]> {
  try {
    const projects = await prisma.portfolio.findMany({
      where: { status: "ACTIVE" },
      orderBy: projectOrdering,
      select: showcaseColumns,
    });

    return (projects as (ShowcaseProject & { updatedAt: Date })[])
      .filter(isShowcaseable)
      .map(({ updatedAt, ...project }) => ({
        ...project,
        // Inline base64 covers are served through the cacheable cover
        // route instead of being embedded in the RSC payload.
        image: project.image.startsWith("data:")
          ? `/api/portfolio-cover/${project.id}?v=${updatedAt.getTime()}`
          : project.image,
      }));
  } catch (error) {
    console.error("Error fetching projects:", error);
    return [];
  }
}

/** A single ACTIVE project by its ID slug. */
export async function getProjectById(
  projectId: number,
): Promise<Project | null> {
  try {
    // findFirst, not findUnique: the status filter is not a unique field.
    const project = await prisma.portfolio.findFirst({
      where: { id: projectId, status: "ACTIVE" },
      select: projectColumns,
    });
    return (project as Project) ?? null;
  } catch (error) {
    console.error("Error fetching project:", error);
    return null;
  }
}

/** Every ACTIVE showcaseable project except the given one, smallest order first. */
export async function getOtherProjects(
  projectId: number,
): Promise<Project[]> {
  try {
    const projects = await prisma.portfolio.findMany({
      where: { id: { not: projectId }, status: "ACTIVE" },
      orderBy: projectOrdering,
      select: projectColumns,
    });
    return (projects as Project[]).filter(isShowcaseable);
  } catch (error) {
    console.error("Error fetching other projects:", error);
    return [];
  }
}

/**
 * Every ACTIVE project for the archive page — no showcase filter, so work
 * without a cover image or live link still counts. Sorted by the effective
 * archive date (endDate, falling back to createdAt) descending: latest
 * year first, then latest month.
 */
export async function getAllProjects(): Promise<ArchiveProject[]> {
  try {
    const projects = await prisma.portfolio.findMany({
      where: { status: "ACTIVE" },
      orderBy: projectOrdering,
      select: archiveColumns,
    });

    return (projects as ArchiveProject[]).sort(byArchiveDateDesc);
  } catch (error) {
    console.error("Error fetching all projects:", error);
    return [];
  }
}
