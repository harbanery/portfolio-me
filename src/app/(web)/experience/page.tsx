import { lazy, Suspense } from "react";
import BaseLayout from "@/components/custom/layout";
import ContactSection from "@/components/custom/section/contact";
import TimelineSection from "./section/timeline";
import AboutSection from "./section/about";
import ssrAction from "./actions";

// Lazy load components untuk performance
const LazyTimelineSection = lazy(() => import("./section/timeline").then(mod => ({ default: mod.TimelineSection })));
const LazyAboutSection = lazy(() => import("./section/about").then(mod => ({ default: mod.AboutSection })));

const WorkPage = async () => {
  // Fetch work experiences from database
  const { data } = await ssrAction();

  return (
    <BaseLayout navbar={true} footer={true}>
      <div className="w-full bg-[#0B0B0B]">
        <Suspense fallback={<div className="min-h-screen flex items-center justify-center">
          <div className="animate-pulse">Loading...</div>
        </div>}>
          <LazyAboutSection />
          <LazyTimelineSection experiences={data?.experiences || []} />
        </Suspense>
        <ContactSection contacts={data?.personal?.contacts || []} />
      </div>
    </BaseLayout>
  );
};

export default WorkPage;
