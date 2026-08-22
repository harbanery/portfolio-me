import { notFound } from "next/navigation";
import BaseLayout from "@/components/layout";
import HeroSection from "./section/hero";
import ContentSection from "./section/content";
import OtherSection from "./section/others";
import { getProjectDetailData } from "@/server/actions";

const ProjectDetailPage = async ({
  params,
}: {
  params: Promise<{ slug: string }>;
}) => {
  const { slug } = await params;
  const { data } = await getProjectDetailData(slug);

  const project = data?.project;
  if (!project) {
    notFound();
  }

  return (
    <BaseLayout navbar={true} footer={true} cvUrl={data?.cv?.url}>
      <div className="min-h-screen bg-gray-950 text-white relative">
        {/* Hero Section with Parallax */}
        <HeroSection project={project} />

        {/* Content Section with Editorial Layout */}
        <ContentSection project={project} />

        {/* More Projects Section */}
        <OtherSection projects={data?.otherProjects} />
      </div>
    </BaseLayout>
  );
};

export default ProjectDetailPage;
