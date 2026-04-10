"use server";

import prisma from "@/lib/config/database";

export interface PersonalData {
  id?: number;
  name: string;
  about?: string;
  skills: string[];
  contacts?: any;
  images?: PersonalImageData[];
}

export interface PersonalImageData {
  id?: number;
  url: string;
  storagePath: string;
  mimeType: string;
  size: number;
  caption?: string;
  order?: number;
}

export async function getPersonal() {
  try {
    const personal = await prisma.personal.findFirst({
      orderBy: { createdAt: "desc" },
      include: {
        images: {
          orderBy: { order: "asc" },
        },
      },
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

    // Handle images
    if (data.images) {
      // Get existing images to delete from storage
      const existingImages = await prisma.personalImage.findMany({
        where: { personalId: personal.id },
      });

      // Delete existing images from database
      await prisma.personalImage.deleteMany({
        where: { personalId: personal.id },
      });

      // Delete old images from Supabase storage
      if (existingImages.length > 0) {
        const { supabase } = await import("@/lib/config/storage");
        for (const existingImage of existingImages) {
          if (existingImage.storagePath) {
            try {
              const filename = existingImage.storagePath.split("/").pop() || "";
              await supabase.storage
                .from("portfolio-images")
                .remove([filename]);
            } catch (error) {
              console.error(
                `Failed to delete old image ${existingImage.storagePath}:`,
                error,
              );
            }
          }
        }
      }

      // Create new images
      if (data.images.length > 0) {
        await prisma.personalImage.createMany({
          data: data.images.map((image, index) => ({
            personalId: personal.id,
            url: image.url,
            storagePath: image.storagePath,
            mimeType: image.mimeType,
            size: image.size,
            caption: image.caption,
            order: image.order ?? index,
          })),
        });
      }
    }

    return { success: true, data: personal };
  } catch (error) {
    console.error("Error saving personal:", error);
    return { success: false, error: "Failed to save personal data" };
  }
}
