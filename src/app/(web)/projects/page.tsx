import BaseLayout from "@/components/custom/layout";
import ContactSection from "@/components/custom/section/contact";
import ListProjectSection from "./section/list";
import ssrAction from "./actions";

const ProjectsPage = async () => {
  // Fetch projects from database
  const { data } = await ssrAction();

  return (
    <BaseLayout navbar={true} footer={true}>
      <div className="w-full bg-black">
        <ListProjectSection projects={data?.projects || []} />
        <ContactSection contacts={data?.personal?.contacts || []} />
      </div>
    </BaseLayout>
  );
};

export default ProjectsPage;
