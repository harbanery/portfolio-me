import BaseLayout from "@/components/custom/layout";
import ContactSection from "@/components/custom/section/contact";
import TimelineSection from "./section/timeline";
import ssrAction from "./actions";

const WorkPage = async () => {
  // Fetch work experiences from dummy data
  const { data } = await ssrAction();

  return (
    <BaseLayout navbar={true} footer={true}>
      <div className="w-full bg-[#0B0B0B]">
        <TimelineSection experiences={data?.experiences || []} />
        <ContactSection contacts={data?.personal.contacts || []} />
      </div>
    </BaseLayout>
  );
};

export default WorkPage;
