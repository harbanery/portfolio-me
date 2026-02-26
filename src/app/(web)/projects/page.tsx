import { lazy, Suspense } from "react";
import BaseLayout from "@/components/custom/layout";
import ContactSection from "@/components/custom/section/contact";
import ListProjectSection from "./section/list";
import ssrAction from "./actions";

// Lazy load components untuk performance
const LazyListProjectSection = lazy(() => import("./section/list").then(mod => ({ default: mod.ListProjectSection })));

const ProjectsPage = async () => {
  // Fetch projects from database
  const { data } = await ssrAction();

  return (
    <BaseLayout navbar={true} footer={true}>
      <div className="w-full bg-black">
        <Suspense fallback={<div className="min-h-screen flex items-center justify-center">
          <div className="animate-pulse">Loading projects...</div>
        </div>}>
          <LazyListProjectSection projects={data?.projects || []} />
        </Suspense>
        <ContactSection contacts={data?.personal?.contacts || []} />
      </div>
    </BaseLayout>
  );
};

export default ProjectsPage;
