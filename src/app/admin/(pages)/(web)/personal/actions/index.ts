"use server";

import prisma from "@/lib/prisma";

export interface PersonalData {
  id?: number;
  name: string;
  about?: string;
  skills: string[];
  contacts?: any;
}

export async function getPersonal() {
  try {
    const personal = await prisma.personal.findFirst({
      orderBy: { createdAt: "desc" },
    });
    return { success: true, data: personal };
  } catch (error) {
    console.error("Error fetching personal:", error);
    return { success: false, error: "Failed to fetch personal data" };
  }
}

export async function savePersonal(data: PersonalData) {
  try {
    const existing = await prisma.personal.findFirst();

    let personal;
    if (existing) {
      personal = await prisma.personal.update({
        where: { id: existing.id },
        data: {
          name: data.name,
          about: data.about,
          skills: data.skills,
          contacts: data.contacts,
        },
      });
    } else {
      personal = await prisma.personal.create({
        data: {
          name: data.name,
          about: data.about,
          skills: data.skills,
          contacts: data.contacts,
        },
      });
    }

    return { success: true, data: personal };
  } catch (error) {
    console.error("Error saving personal:", error);
    return { success: false, error: "Failed to save personal data" };
  }
}
