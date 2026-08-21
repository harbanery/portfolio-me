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
} as const;

/** Projects are "real" once the database holds at least one ACTIVE row. */
export async function getProjects(): Promise<Project[]> {
  try {
    const projects = await prisma.portfolio.findMany({
      where: { status: "ACTIVE" },
      orderBy: { createdAt: "desc" },
      select: projectColumns,
    });

    if (projects.length === 0) return dummyProjects;
    return projects as Project[];
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

/** Every ACTIVE project except the given one, newest first. */
export async function getOtherProjects(
  projectId: number,
): Promise<Project[]> {
  try {
    const projects = await prisma.portfolio.findMany({
      where: { id: { not: projectId }, status: "ACTIVE" },
      orderBy: { createdAt: "desc" },
      select: { id: true, title: true, image: true },
    });
    if (projects.length > 0) return projects as Project[];
  } catch (error) {
    console.error("Error fetching other projects:", error);
  }

  // Database unavailable or empty: serve matching dummy data.
  return dummyProjects.filter((project) => project.id !== projectId);
}
