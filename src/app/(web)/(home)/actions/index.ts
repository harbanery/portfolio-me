import prisma from "@/lib/config/database";

export default async function ssrAction() {
  try {
    const [personal, projects] = await Promise.all([
      prisma.personal.findFirst({
        include: {
          images: {
            orderBy: { order: "asc" },
          },
        },
      }),
      prisma.portfolio.findMany({
        where: { status: "ACTIVE" },
        orderBy: { createdAt: "desc" },
      }),
    ]);
    return { success: true, data: { personal, projects } };
  } catch (error) {
    console.error("Error fetching data:", error);
    return { success: false, error: "Failed to fetch data" };
  }
}
