import prisma from "@/lib/config/database";

export default async function ssrAction(slug: string) {
  try {
    const projectId = Number.parseInt(slug);
    if (Number.isNaN(projectId)) throw new Error("Invalid project ID");
    const [project, otherProjects] = await Promise.all([
      prisma.portfolio.findUnique({
        where: {
          id: projectId,
          status: "ACTIVE",
        },
      }),
      prisma.portfolio.findMany({
        where: {
          id: { not: projectId },
          status: "ACTIVE",
        },
        orderBy: {
          createdAt: "desc",
        },
      }),
    ]);
    return { success: true, data: { project, otherProjects } };
  } catch (error) {
    console.error("Error fetching data:", error);
    return { success: false, error: "Failed to fetch data" };
  }
}
