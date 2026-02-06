import prisma from "@/lib/config/database";

export default async function ssrAction() {
  try {
    const [personal, experiences] = await Promise.all([
      prisma.personal.findFirst(),
      prisma.experience.findMany({
        where: { status: "ACTIVE" },
        orderBy: { startDate: "desc" },
      }),
    ]);

    // Transform database data to match timeline component format
    const formattedExperiences = experiences.map((exp: any) => {
      const startMonth = new Date(exp.startDate).toLocaleDateString("en-US", {
        month: "short",
        year: "numeric",
      });
      const endMonth = exp.endDate
        ? new Date(exp.endDate).toLocaleDateString("en-US", {
            month: "short",
            year: "numeric",
          })
        : "Present";

      return {
        title: `${startMonth} – ${endMonth}`,
        content: {
          jobTitle: exp.jobTitle,
          companyName: exp.companyName,
          description: exp.description || "",
          techStack: exp.skills,
          images: exp.images || [],
        },
      };
    });

    return {
      success: true,
      data: { personal, experiences: formattedExperiences },
    };
  } catch (error) {
    console.error("Error fetching data:", error);
    return { success: false, error: "Failed to fetch data" };
  }
}
