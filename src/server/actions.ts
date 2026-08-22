import {
  getPersonalProfile,
  getExperiences,
  getMarqueeSkills,
  getExperienceStats,
} from "@/services/personalService";
import {
  getProjects,
  getProjectById,
  getOtherProjects,
  getAllProjects,
} from "@/services/projectService";
import { getEducation, getPrimaryCv } from "@/services/credentialService";

/**
 * Server actions for fetching page data (SSR).
 * Mirrors the structure used in progress-self: pages stay thin, all data
 * access lives in `src/services`, and these actions are the only surface
 * pages talk to.
 */

export async function getHomeData() {
  try {
    const [personal, projects, allProjects, experiences, experienceStats, education, cv] =
      await Promise.all([
        getPersonalProfile(),
        getProjects(),
        getAllProjects(),
        getExperiences(),
        getExperienceStats(),
        getEducation(),
        getPrimaryCv(),
      ]);

    return {
      success: true,
      data: {
        personal,
        skills: getMarqueeSkills(personal?.skills),
        projects,
        // Hero "projects delivered" counts every ACTIVE project, not only
        // the showcaseable ones on the home grid.
        allProjects,
        experiences,
        experienceStats,
        education,
        cv,
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
    const [personal, projects, archiveProjects, cv] = await Promise.all([
      getPersonalProfile(),
      getProjects(),
      getAllProjects(),
      getPrimaryCv(),
    ]);
    return {
      success: true,
      data: { personal, projects, archiveProjects, cv },
    };
  } catch (error) {
    console.error("Error fetching projects data:", error);
    return { success: false, error: "Failed to fetch data" };
  }
}

/** Personal profile for the dedicated /contacts page. */
export async function getContactsData() {
  try {
    const [personal, cv] = await Promise.all([
      getPersonalProfile(),
      getPrimaryCv(),
    ]);
    return { success: true, data: { personal, cv } };
  } catch (error) {
    console.error("Error fetching contacts data:", error);
    return { success: false, error: "Failed to fetch data" };
  }
}

export async function getProjectDetailData(slug: string) {
  try {
    const projectId = Number.parseInt(slug, 10);
    if (Number.isNaN(projectId)) throw new Error("Invalid project ID");

    const [project, cv] = await Promise.all([
      getProjectById(projectId),
      getPrimaryCv(),
    ]);
    if (!project) {
      return { success: true, data: { project: null, otherProjects: [], cv } };
    }

    const otherProjects = await getOtherProjects(projectId);
    return { success: true, data: { project, otherProjects, cv } };
  } catch (error) {
    console.error("Error fetching project detail:", error);
    return { success: false, error: "Failed to fetch data" };
  }
}
