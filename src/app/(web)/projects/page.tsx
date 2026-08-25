import BaseLayout from "@/components/layout";
import ListProjectSection from "./section/list";
import { getProjectsData } from "@/server/actions";
import { getContactUrl } from "@/helpers";

/**
 * ISR (see the home page for details) — 60-second background
 * revalidation keeps the archive in sync with the database.
 */
export const revalidate = 60;

const ProjectsPage = async () => {
  // Fetch projects from database
  const { data } = await getProjectsData();

  return (
    <BaseLayout
      navbar={true}
      footer={true}
      cvUrl={data?.cv?.url}
      cvName={data?.cv?.name}
      name={data?.personal?.name}
      availability={data?.personal?.availability}
    >
      <div className="w-full bg-black">
        <ListProjectSection
          projects={data?.archiveProjects || []}
          githubUrl={getContactUrl(data?.personal?.contacts, "github")}
          linkedinUrl={getContactUrl(data?.personal?.contacts, "linkedin")}
        />
      </div>
    </BaseLayout>
  );
};

export default ProjectsPage;
