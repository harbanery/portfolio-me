import { notFound } from "next/navigation";
import { lazy, Suspense } from "react";
import BaseLayout from "@/components/custom/layout";
import HeroSection from "./section/hero";
import ContentSection from "./section/content";
import OtherSection from "./section/others";
import ssrAction from "./actions";

// Lazy load components untuk performance
const LazyHeroSection = lazy(() => import("./section/hero").then(mod => ({ default: mod.HeroSection })));
const LazyContentSection = lazy(() => import("./section/content").then(mod => ({ default: mod.ContentSection })));
const LazyOtherSection = lazy(() => import("./section/others").then(mod => ({ default: mod.OtherSection })));

const ProjectDetailPage = async ({ params }: { params: { slug: string } }) => {
  const { slug } = params;
  const { data } = await ssrAction(slug);

  if (!data?.project) {
    notFound();
  }

  return (
    <BaseLayout navbar={true} footer={true}>
      <div className="min-h-screen bg-gray-950 text-white relative">
        <Suspense fallback={
          <div className="min-h-screen flex items-center justify-center">
            <div className="animate-pulse">Loading project details...</div>
          </div>
        }>
          {/* Hero Section dengan lazy loading */}
          <LazyHeroSection project={data.project} />

          {/* Content Section dengan lazy loading */}
          <LazyContentSection project={data.project} />

          {/* More Projects Section */}
          <LazyOtherSection projects={data.otherProjects} />
        </Suspense>
      </div>
    </BaseLayout>
  );
};

export default ProjectDetailPage;
