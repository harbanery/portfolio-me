import type { Metadata } from "next";
import BaseLayout from "@/components/layout";
import ListProjectSection from "./section/list";
import { getProjectsData } from "@/server/actions";
import { getContactUrl } from "@/helpers";
import { META_APP } from "@/config/variables";

/**
 * ISR (see the home page for details) — 60-second background
 * revalidation keeps the archive in sync with the database.
 */
export const revalidate = 60;

/** Page metadata — mirrors the root layout's shape, but points the
 *  Open Graph image at the dedicated archive artwork under
 *  public/images/projects instead of the site-wide one. */
export const metadata: Metadata = {
  title: "Project Archives by Raihan Yusuf",
  description:
    "The complete project archive of Raihan Yusuf — every build, role, and the technology behind it, year by year.",
  openGraph: {
    title: "Project Archives by Raihan Yusuf",
    description:
      "The complete project archive of Raihan Yusuf — every build, role, and the technology behind it, year by year.",
    type: "profile",
    siteName: META_APP,
    countryName: "Indonesia",
    locale: "en-US",
    url: `/projects`,
    images: [
      {
        url: `images/projects/opengraph-image.png`,
        alt: "Project Archives by Raihan Yusuf",
        type: "image/png",
      },
    ],
  },
};

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
