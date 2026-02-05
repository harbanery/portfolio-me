import BaseLayout from "@/components/custom/layout";
import ContactSection from "@/components/custom/section/contact";
import ListProjectSection from "./section/list";
import ssrAction from "./actions";

const ProjectsPage = async () => {
  // Fetch projects from database
  const { data } = await ssrAction();

  return (
    <BaseLayout navbar={true} footer={true}>
      <ListProjectSection projects={data?.projects || []} />
      <ContactSection contacts={data?.personal?.contacts || []} />
    </BaseLayout>
  );
};

export default ProjectsPage;
