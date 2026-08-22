import BaseLayout from "@/components/layout";
import ListProjectSection from "./section/list";
import { getProjectsData } from "@/server/actions";

const ProjectsPage = async () => {
  // Fetch projects from database
  const { data } = await getProjectsData();

  return (
    <BaseLayout navbar={true} footer={true} cvUrl={data?.cv?.url}>
      <div className="w-full bg-black">
        <ListProjectSection projects={data?.archiveProjects || []} />
      </div>
    </BaseLayout>
  );
};

export default ProjectsPage;
