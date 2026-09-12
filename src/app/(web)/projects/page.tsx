import type { Metadata } from "next";
import BaseLayout from "@/components/layout";
import ListProjectSection from "./section/list";
import { getProjectsData } from "@/server/actions";
import { getContactUrl } from "@/helpers";
import { META_APP } from "@/config/variables";

/**
 * Rendering: dynamically rendered per request (see the home page for
 * details) — the nonce CSP requires it; `unstable_cache` keeps the data
 * queries on a 60-second revalidate so the archive stays in sync.
 */
export const dynamic = "force-dynamic";

/** Page metadata — mirrors the root layout's shape and shares its
 *  Open Graph artwork (with the call-to-action pill), pointing the
 *  URL and title at the archive. */
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
        url: `images/opengraph-image.png`,
        alt: "Project Archives by Raihan Yusuf",
        type: "image/png",
        width: 1200,
        height: 630,
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
