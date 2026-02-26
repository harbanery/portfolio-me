import { notFound } from "next/navigation";
import BaseLayout from "@/components/custom/layout";
import HeroSection from "./section/hero";
import ContentSection from "./section/content";
import OtherSection from "./section/others";
import ssrAction from "./actions";

const ProjectDetailPage = async ({ params }: { params: { slug: string } }) => {
  const { slug } = params;
  const { data } = await ssrAction(slug);

  if (!data?.project) {
    notFound();
  }

  return (
    <BaseLayout navbar={true} footer={true}>
      <div className="min-h-screen bg-gray-950 text-white relative">
        {/* Hero Section with Parallax */}
        <HeroSection project={data.project} />

        {/* Content Section with Editorial Layout */}
        <ContentSection project={data.project} />

        {/* More Projects Section */}
        <OtherSection projects={data.otherProjects} />
      </div>
    </BaseLayout>
  );
};

export default ProjectDetailPage;
