import prisma from "@/server/db";
import { dummyProjects } from "@/models/dummy-projects";
import type { Project } from "@/models/project";

/**
 * Data service for portfolio projects.
 * Mirrors the progress-self pattern: server actions stay thin and delegate
 * data access + fallback logic to `src/services`.
 */

/** Projects are "real" once the database holds at least one ACTIVE row. */
export async function getProjects(): Promise<Project[]> {
  try {
    const projects = await prisma.portfolio.findMany({
      where: { status: "ACTIVE" },
      orderBy: { createdAt: "desc" },
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
    });
    if (projects.length > 0) return projects as Project[];
  } catch (error) {
    console.error("Error fetching other projects:", error);
  }

  // Database unavailable or empty: serve matching dummy data.
  return dummyProjects.filter((project) => project.id !== projectId);
}
