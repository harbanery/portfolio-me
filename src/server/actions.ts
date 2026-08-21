import {
  getPersonalProfile,
  getExperiences,
  getMarqueeSkills,
} from "@/services/personalService";
import {
  getProjects,
  getProjectById,
  getOtherProjects,
} from "@/services/projectService";

/**
 * Server actions for fetching page data (SSR).
 * Mirrors the structure used in progress-self: pages stay thin, all data
 * access lives in `src/services`, and these actions are the only surface
 * pages talk to.
 */

export async function getHomeData() {
  try {
    const [personal, projects, experiences] = await Promise.all([
      getPersonalProfile(),
      getProjects(),
      getExperiences(),
    ]);

    return {
      success: true,
      data: {
        personal,
        skills: getMarqueeSkills(personal?.skills),
        projects,
        experiences,
      },
    };
  } catch (error) {
    console.error("Error fetching home data:", error);
    return { success: false, error: "Failed to fetch data" };
  }
}

export async function getExperienceData() {
  try {
    const experiences = await getExperiences();
    return { success: true, data: { experiences } };
  } catch (error) {
    console.error("Error fetching experience data:", error);
    return { success: false, error: "Failed to fetch data" };
  }
}

export async function getProjectsData() {
  try {
    const [personal, projects] = await Promise.all([
      getPersonalProfile(),
      getProjects(),
    ]);
    return { success: true, data: { personal, projects } };
  } catch (error) {
    console.error("Error fetching projects data:", error);
    return { success: false, error: "Failed to fetch data" };
  }
}

export async function getProjectDetailData(slug: string) {
  try {
    const projectId = Number.parseInt(slug, 10);
    if (Number.isNaN(projectId)) throw new Error("Invalid project ID");

    const project = await getProjectById(projectId);
    if (!project) {
      return { success: true, data: { project: null, otherProjects: [] } };
    }

    const otherProjects = await getOtherProjects(projectId);
    return { success: true, data: { project, otherProjects } };
  } catch (error) {
    console.error("Error fetching project detail:", error);
    return { success: false, error: "Failed to fetch data" };
  }
}
