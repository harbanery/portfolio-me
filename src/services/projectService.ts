import prisma from "@/server/db";
import { dummyProjects } from "@/models/dummy-projects";
import type { Project } from "@/models/project";

/**
 * Data service for portfolio projects.
 * Mirrors the progress-self pattern: server actions stay thin and delegate
 * data access + fallback logic to `src/services`.
 */

/**
 * Column set used by the UI. Explicit select keeps queries working before
 * the newer admin-portfolio columns (is_ongoing, end_date, order) are
 * migrated into an older database.
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
const isShowcaseable = (project: Project): boolean =>
  !!project.image && !!project.webLink;

/**
 * Effective archive date as a timestamp: the completion date (endDate) when
 * set, else the record's creation date — the same date that drives the
 * archive year column. Dateless records sink to the bottom (0).
 */
const archiveTimestampOf = (project: Project): number => {
  const raw = project.endDate || project.createdAt;
  if (!raw) return 0;
  const time = new Date(raw).getTime();
  return Number.isNaN(time) ? 0 : time;
};

const createdTimestampOf = (project: Project): number =>
  project.createdAt ? new Date(project.createdAt).getTime() || 0 : 0;

/**
 * Archive ordering: latest year first, then latest month — the effective
 * archive date descending. Records sharing a date fall back to newest
 * created first; dateless records (dummy data) keep their original order.
 */
const byArchiveDateDesc = (a: Project, b: Project): number =>
  archiveTimestampOf(b) - archiveTimestampOf(a) ||
  createdTimestampOf(b) - createdTimestampOf(a);

/** Projects are "real" once the database holds at least one ACTIVE row. */
export async function getProjects(): Promise<Project[]> {
  try {
    const projects = await prisma.portfolio.findMany({
      where: { status: "ACTIVE" },
      orderBy: projectOrdering,
      select: projectColumns,
    });

    if (projects.length === 0) return dummyProjects;
    return (projects as Project[]).filter(isShowcaseable);
  } catch (error) {
    console.error("Error fetching projects, falling back to dummy data:", error);
    return dummyProjects;
  }
}

/** A single ACTIVE project by its ID slug, with dummy fallback. */
export async function getProjectById(
  projectId: number,
): Promise<Project | null> {
  try {
    // findFirst, not findUnique: the status filter is not a unique field.
    const project = await prisma.portfolio.findFirst({
      where: { id: projectId, status: "ACTIVE" },
      select: projectColumns,
    });
    if (project) return project as Project;
  } catch (error) {
    console.error("Error fetching project:", error);
  }

  // Database unavailable or empty: serve matching dummy data.
  return dummyProjects.find((project) => project.id === projectId) ?? null;
}

/** Every ACTIVE showcaseable project except the given one, smallest order first. */
export async function getOtherProjects(
  projectId: number,
): Promise<Project[]> {
  try {
    const projects = await prisma.portfolio.findMany({
      where: { id: { not: projectId }, status: "ACTIVE" },
      orderBy: projectOrdering,
      select: { id: true, title: true, image: true, order: true },
    });
    if (projects.length > 0) {
      return (projects as Project[]).filter(isShowcaseable);
    }
  } catch (error) {
    console.error("Error fetching other projects:", error);
  }

  // Database unavailable or empty: serve matching dummy data.
  return dummyProjects.filter((project) => project.id !== projectId);
}

/**
 * Every ACTIVE project for the archive page — no showcase filter, so work
 * without a cover image or live link still counts. Sorted by the effective
 * archive date (endDate, falling back to createdAt) descending: latest
 * year first, then latest month.
 */
export async function getAllProjects(): Promise<Project[]> {
  try {
    const projects = await prisma.portfolio.findMany({
      where: { status: "ACTIVE" },
      orderBy: projectOrdering,
      select: projectColumns,
    });

    if (projects.length === 0) return dummyProjects;
    return (projects as Project[]).sort(byArchiveDateDesc);
  } catch (error) {
    console.error("Error fetching all projects, falling back to dummy data:", error);
    return dummyProjects;
  }
}
