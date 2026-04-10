"use server";

import prisma from "@/lib/config/database";

export type ProjectStatus = "ACTIVE" | "NONACTIVE";

export interface ProjectData {
  id?: number;
  title: string;
  subtitle?: string;
  projectType?: string;
  clientName?: string;
  companyName?: string;
  role: string;
  image?: string;
  images?: string[];
  description?: string;
  apiDocumentation?: string;
  features?: string[];
  highlights?: string[];
  challenges?: string;
  solutions?: string;
  story?: string;
  outcomes?: string[];
  skills: string[];
  repoLinks?: string[];
  webLink?: string;
  status?: ProjectStatus;
}

export async function getProjects() {
  try {
    const projects = await prisma.portfolio.findMany({
      orderBy: { createdAt: "desc" },
    });
    return { success: true, data: projects };
  } catch (error) {
    console.error("Error fetching projects:", error);
    return { success: false, error: "Failed to fetch projects" };
  }
}

export async function getProjectById(id: number) {
  try {
    const project = await prisma.portfolio.findUnique({
      where: { id },
    });
    return { success: true, data: project };
  } catch (error) {
    console.error("Error fetching project:", error);
    return { success: false, error: "Failed to fetch project" };
  }
}

export async function createProject(data: ProjectData) {
  try {
    const project = await prisma.portfolio.create({
      data: {
        title: data.title,
        subtitle: data.subtitle,
        projectType: data.projectType || "personal",
        clientName: data.clientName,
        companyName: data.companyName,
        role: data.role,
        image: data.image || "",
        images: data.images || [],
        description: data.description,
        apiDocumentation: data.apiDocumentation,
        features: data.features || [],
        highlights: data.highlights || [],
        challenges: data.challenges,
        solutions: data.solutions,
        story: data.story,
        outcomes: data.outcomes || [],
        skills: data.skills,
        repoLinks: data.repoLinks || [],
        webLink: data.webLink,
        status: "ACTIVE",
      },
    });
    return { success: true, data: project };
  } catch (error) {
    console.error("Error creating project:", error);
    return { success: false, error: "Failed to create project" };
  }
}

export async function updateProject(id: number, data: ProjectData) {
  try {
    const project = await prisma.portfolio.update({
      where: { id },
      data: {
        title: data.title,
        subtitle: data.subtitle,
        projectType: data.projectType || "personal",
        clientName: data.clientName,
        companyName: data.companyName,
        role: data.role,
        ...(data.image && { image: data.image }),
        ...(data.images && { images: data.images }),
        description: data.description,
        apiDocumentation: data.apiDocumentation,
        features: data.features || [],
        highlights: data.highlights || [],
        challenges: data.challenges,
        solutions: data.solutions,
        story: data.story,
        outcomes: data.outcomes || [],
        skills: data.skills,
        repoLinks: data.repoLinks || [],
        webLink: data.webLink,
      },
    });
    return { success: true, data: project };
  } catch (error) {
    console.error("Error updating project:", error);
    return { success: false, error: "Failed to update project" };
  }
}

export async function toggleProjectStatus(id: number, status: ProjectStatus) {
  try {
    const project = await prisma.portfolio.update({
      where: { id },
      data: { status: status as any },
    });
    return { success: true, data: project };
  } catch (error) {
    console.error("Error toggling project status:", error);
    return { success: false, error: "Failed to toggle project status" };
  }
}

export async function deleteProject(id: number) {
  try {
    await prisma.portfolio.delete({
      where: { id },
    });
    return { success: true };
  } catch (error) {
    console.error("Error deleting project:", error);
    return { success: false, error: "Failed to delete project" };
  }
}
