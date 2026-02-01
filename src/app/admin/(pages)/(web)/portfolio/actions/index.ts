"use server";

import prisma from "@/lib/config/database";

export type PortfolioStatus = "ACTIVE" | "NONACTIVE";

export interface PortfolioData {
  id?: number;
  title: string;
  role: string;
  image?: string;
  description?: string;
  skills: string[];
  repoLinks?: string[];
  webLink?: string;
  status?: PortfolioStatus;
}

export async function getPortfolios() {
  try {
    const portfolios = await prisma.portfolio.findMany({
      orderBy: { createdAt: "desc" },
    });
    return { success: true, data: portfolios };
  } catch (error) {
    console.error("Error fetching portfolios:", error);
    return { success: false, error: "Failed to fetch portfolios" };
  }
}

export async function getPortfolioById(id: number) {
  try {
    const portfolio = await prisma.portfolio.findUnique({
      where: { id },
    });
    return { success: true, data: portfolio };
  } catch (error) {
    console.error("Error fetching portfolio:", error);
    return { success: false, error: "Failed to fetch portfolio" };
  }
}

export async function createPortfolio(data: PortfolioData) {
  try {
    const portfolio = await prisma.portfolio.create({
      data: {
        title: data.title,
        role: data.role,
        image: data.image || "",
        description: data.description,
        skills: data.skills,
        repoLinks: data.repoLinks || [],
        webLink: data.webLink,
        status: "ACTIVE",
      },
    });
    return { success: true, data: portfolio };
  } catch (error) {
    console.error("Error creating portfolio:", error);
    return { success: false, error: "Failed to create portfolio" };
  }
}

export async function updatePortfolio(id: number, data: PortfolioData) {
  try {
    const portfolio = await prisma.portfolio.update({
      where: { id },
      data: {
        title: data.title,
        role: data.role,
        ...(data.image && { image: data.image }),
        description: data.description,
        skills: data.skills,
        repoLinks: data.repoLinks || [],
        webLink: data.webLink,
      },
    });
    return { success: true, data: portfolio };
  } catch (error) {
    console.error("Error updating portfolio:", error);
    return { success: false, error: "Failed to update portfolio" };
  }
}

export async function togglePortfolioStatus(
  id: number,
  status: PortfolioStatus,
) {
  try {
    const portfolio = await prisma.portfolio.update({
      where: { id },
      data: { status: status as any },
    });
    return { success: true, data: portfolio };
  } catch (error) {
    console.error("Error toggling portfolio status:", error);
    return { success: false, error: "Failed to toggle portfolio status" };
  }
}

export async function deletePortfolio(id: number) {
  try {
    await prisma.portfolio.delete({
      where: { id },
    });
    return { success: true };
  } catch (error) {
    console.error("Error deleting portfolio:", error);
    return { success: false, error: "Failed to delete portfolio" };
  }
}
