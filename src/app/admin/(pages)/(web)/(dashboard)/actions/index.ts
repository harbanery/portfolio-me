import prisma from "@/lib/config/database";

export async function getDashboardStats() {
  try {
    const [personalCount, activeProjectsCount, totalProjectsCount, recentProjects] =
      await Promise.all([
        prisma.personal.count(),
        prisma.portfolio.count({ where: { status: "ACTIVE" } }),
        prisma.portfolio.count(),
        prisma.portfolio.findMany({
          orderBy: { createdAt: "desc" },
          take: 5,
          select: {
            id: true,
            title: true,
            role: true,
            status: true,
            createdAt: true,
          },
        }),
      ]);

    return {
      success: true,
      data: {
        stats: {
          personalCount,
          activeProjectsCount,
          totalProjectsCount,
        },
        recentProjects,
      },
    };
  } catch (error) {
    console.error("Error fetching dashboard stats:", error);
    return {
      success: false,
      error: "Failed to fetch dashboard stats",
    };
  }
}

export async function getProjectAnalytics() {
  try {
    const projects = await prisma.portfolio.findMany({
      select: {
        status: true,
        createdAt: true,
      },
    });

    const statusDistribution = projects.reduce(
      (acc, project) => {
        acc[project.status] = (acc[project.status] || 0) + 1;
        return acc;
      },
      { ACTIVE: 0, NONACTIVE: 0 }
    );

    const projectsByMonth = projects.reduce((acc, project) => {
      const date = new Date(project.createdAt);
      const key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`;
      acc[key] = (acc[key] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const sortedMonths = Object.keys(projectsByMonth).sort().slice(-6);
    const monthlyData = sortedMonths.map((month) => ({
      month,
      count: projectsByMonth[month],
    }));

    return {
      success: true,
      data: {
        statusDistribution,
        monthlyData,
      },
    };
  } catch (error) {
    console.error("Error fetching project analytics:", error);
    return {
      success: false,
      error: "Failed to fetch project analytics",
    };
  }
}
