import { notFound } from "next/navigation";
import BaseLayout from "@/components/custom/layout";
import HeroSection from "./section/hero";
import ContentSection from "./section/content";
import { prisma } from "@/lib/config/database";
import OtherSection from "./section/others";

// Server-side function to fetch single project from Prisma
async function getProjectBySlug(slug: string) {
  try {
    // Try to find project by ID if slug is numeric
    const projectId = parseInt(slug);
    if (!isNaN(projectId)) {
      const project = await prisma.portfolio.findUnique({
        where: {
          id: projectId,
          status: "ACTIVE",
        },
      });
      return project;
    }

    // If no project found by ID or slug is not numeric, return null
    return null;
  } catch (error) {
    console.error("Error fetching project:", error);
    return null;
  }
}

// Generate static params for static generation
async function generateStaticParams() {
  try {
    const projects = await prisma.portfolio.findMany({
      where: {
        status: "ACTIVE",
      },
      select: {
        id: true,
      },
    });

    return projects.map((project) => ({
      slug: project.id.toString(),
    }));
  } catch (error) {
    console.error("Error generating static params:", error);
    return [];
  }
}

const ProjectDetailPage = async ({ params }: { params: { slug: string } }) => {
  const { slug } = params;
  const project = await getProjectBySlug(slug);

  if (!project) {
    notFound();
  }

  return (
    <BaseLayout navbar={true} footer={true}>
      <div className="min-h-screen bg-gray-950 text-white relative">
        {/* Hero Section with Parallax */}
        <HeroSection project={project} />

        {/* Content Section with Editorial Layout */}
        <ContentSection project={project} />

        {/* More Projects Section */}
        <OtherSection />
      </div>
    </BaseLayout>
  );
};

export default ProjectDetailPage;
