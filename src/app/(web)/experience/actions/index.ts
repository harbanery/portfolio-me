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

    // Group experiences by company name
    const companyMap: Record<string, any[]> = {};

    experiences.forEach((exp, index) => {
      if (!companyMap[exp.companyName]) {
        companyMap[exp.companyName] = [];
      }
      companyMap[exp.companyName].push(exp);
    });

    // Sort experiences within each company by start date
    Object.keys(companyMap).forEach((companyName) => {
      companyMap[companyName].sort(
        (a, b) =>
          new Date(a.startDate).getTime() - new Date(b.startDate).getTime(),
      );
    });

    // Convert to array for processing
    const companyGroups = Object.values(companyMap);

    // Transform and merge experiences by company (only consecutive ones)
    const formattedExperiences = companyGroups
      .map((companyExperiences: any[]) => {
        // Company experiences are already sorted by start date from the previous step

        const earliestStart = new Date(companyExperiences[0].startDate);
        const latestEnd = companyExperiences.reduce((latest, exp) => {
          if (!exp.endDate) return null; // If any entry is "Present", the end is null
          if (!latest) return new Date(exp.endDate);
          return new Date(exp.endDate) > latest
            ? new Date(exp.endDate)
            : latest;
        }, null);

        const startMonth = earliestStart.toLocaleDateString("en-US", {
          month: "short",
          year: "numeric",
        });
        const endMonth = latestEnd
          ? latestEnd.toLocaleDateString("en-US", {
              month: "short",
              year: "numeric",
            })
          : "Present";

        // If end date is Present, show "Start – Present"
        // Otherwise if start and end date are same, only show start date
        const title = !latestEnd
          ? `${startMonth} – Present`
          : latestEnd && startMonth === endMonth
            ? startMonth
            : `${startMonth} – ${endMonth}`;

        // Sort by start date (newest first) - current job should have most recent start date
        const sortedChronologically = [...companyExperiences].sort((a, b) => {
          const aStart = new Date(a.startDate).getTime();
          const bStart = new Date(b.startDate).getTime();

          // Most recent start date first
          return bStart - aStart;
        });

        const currentJobTitle = sortedChronologically[0].jobTitle;
        const previousJobTitles = sortedChronologically
          .slice(1)
          .map((exp) => exp.jobTitle);

        // Merge all skills, remove duplicates
        const allSkills = companyExperiences.flatMap((exp) => exp.skills || []);
        const uniqueSkills = [...new Set(allSkills)];

        // Merge all images, remove duplicates
        const allImages = companyExperiences.flatMap((exp) => exp.images || []);
        const uniqueImages = [...new Set(allImages)];

        // Merge descriptions
        const mergedDescription = companyExperiences
          .map((exp) => exp.description || "")
          .filter((desc) => desc.trim())
          .join("\n\n");

        return {
          title,
          content: {
            jobTitle: currentJobTitle,
            previousJobTitles,
            companyName: companyExperiences[0].companyName,
            description: mergedDescription,
            techStack: uniqueSkills,
            images: uniqueImages,
          },
        };
      })
      .sort((a, b) => {
        // Sort merged experiences by start date (descending for most recent first)
        const aStart = a.title.split(" – ")[0];
        const bStart = b.title.split(" – ")[0];
        return new Date(bStart).getTime() - new Date(aStart).getTime();
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
