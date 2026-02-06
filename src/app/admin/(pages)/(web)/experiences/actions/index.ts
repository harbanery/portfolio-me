"use server";

import prisma from "@/lib/config/database";

export type ExperienceStatus = "ACTIVE" | "NONACTIVE";

export interface ExperienceData {
  id?: number;
  jobTitle: string;
  companyName: string;
  description?: string;
  skills: string[];
  images?: string[];
  startDate: Date;
  endDate?: Date;
  isPresent?: boolean;
  status?: ExperienceStatus;
}

export async function getExperiences() {
  try {
    const experiences = await prisma.experience.findMany({
      orderBy: { startDate: "desc" },
    });
    return { success: true, data: experiences };
  } catch (error) {
    console.error("Error fetching experiences:", error);
    return { success: false, error: "Failed to fetch experiences" };
  }
}

export async function getExperienceById(id: number) {
  try {
    const experience = await prisma.experience.findUnique({
      where: { id },
    });
    return { success: true, data: experience };
  } catch (error) {
    console.error("Error fetching experience:", error);
    return { success: false, error: "Failed to fetch experience" };
  }
}

export async function createExperience(data: ExperienceData) {
  try {
    const experience = await prisma.experience.create({
      data: {
        jobTitle: data.jobTitle,
        companyName: data.companyName,
        description: data.description,
        skills: data.skills,
        images: data.images || [],
        startDate: data.startDate,
        endDate: data.isPresent ? null : data.endDate,
        isPresent: data.isPresent || false,
        status: "ACTIVE",
      },
    });
    return { success: true, data: experience };
  } catch (error) {
    console.error("Error creating experience:", error);
    return { success: false, error: "Failed to create experience" };
  }
}

export async function updateExperience(id: number, data: ExperienceData) {
  try {
    const experience = await prisma.experience.update({
      where: { id },
      data: {
        jobTitle: data.jobTitle,
        companyName: data.companyName,
        description: data.description,
        skills: data.skills,
        ...(data.images && { images: data.images }),
        startDate: data.startDate,
        endDate: data.isPresent ? null : data.endDate,
        isPresent: data.isPresent || false,
      },
    });
    return { success: true, data: experience };
  } catch (error) {
    console.error("Error updating experience:", error);
    return { success: false, error: "Failed to update experience" };
  }
}

export async function toggleExperienceStatus(
  id: number,
  status: ExperienceStatus,
) {
  try {
    const experience = await prisma.experience.update({
      where: { id },
      data: { status: status as any },
    });
    return { success: true, data: experience };
  } catch (error) {
    console.error("Error toggling experience status:", error);
    return { success: false, error: "Failed to toggle experience status" };
  }
}

export async function deleteExperience(id: number) {
  try {
    await prisma.experience.delete({
      where: { id },
    });
    return { success: true };
  } catch (error) {
    console.error("Error deleting experience:", error);
    return { success: false, error: "Failed to delete experience" };
  }
}
