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
    const project = await prisma.portfolio.findUnique({
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
 * without a cover image or live link still counts.
 */
export async function getAllProjects(): Promise<Project[]> {
  try {
    const projects = await prisma.portfolio.findMany({
      where: { status: "ACTIVE" },
      orderBy: projectOrdering,
      select: projectColumns,
    });

    if (projects.length === 0) return dummyProjects;
    return projects as Project[];
  } catch (error) {
    console.error("Error fetching all projects, falling back to dummy data:", error);
    return dummyProjects;
  }
}
