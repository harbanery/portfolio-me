import BaseLayout from "@/components/layout";
import { getHomeData } from "@/server/actions";
import { getHeroContent } from "@/services/meProfileService";
import { getCredentials, getPublications } from "@/services/credentialService";
import HeroSection from "./section/hero";
import AboutSection from "./section/about";
import ExperienceSection from "./section/experience";
import SkillsSection from "./section/skills";
import ProjectSection from "./section/projects";
// Hidden for now — kept in the tree to be re-enabled later.
// import OpenSourceSection from "./section/open-source";
import CredentialsSection from "./section/credentials";
import WritingSection from "./section/writing";
import HomeContactSection from "./section/contact";
import SkillsMarqueeSection from "./section/skills-marquee";

const HomePage = async () => {
  const [{ data }, hero, credentials, publications] = await Promise.all([
    getHomeData(),
    getHeroContent(),
    getCredentials(),
    getPublications(),
  ]);

  // Hero stats from database data: projects, distinct companies, and total
  // professional experience. The project count covers every ACTIVE project,
  // not only the showcaseable ones. Labels stay formal and count-aware.
  const projectCount = data?.allProjects.length ?? 0;
  const companyCount = data?.experienceStats.companies ?? 0;
  const years = data?.experienceStats.years ?? 0;

  const stats = [
    {
      value: `${projectCount}`,
      label: `${projectCount === 1 ? "Project" : "Projects"} delivered`,
    },
    {
      value: `${companyCount}`,
      label: `${companyCount === 1 ? "Company" : "Companies"} worked with`,
    },
    {
      value: `${years}`,
      label: `${years === 1 ? "Year" : "Years"} of professional experience`,
    },
  ];

  return (
    <BaseLayout
      navbar={true}
      footer={true}
      locationLabel={hero?.locationLabel}
      availability={data?.personal?.availability}
      cvUrl={data?.cv?.url}
      cvName={data?.cv?.name}
    >
      <div className="w-full bg-black">
        <HeroSection
          name={data?.personal?.name ?? hero?.name}
          lead={hero?.lead}
          stats={stats}
        />
        <SkillsMarqueeSection skills={data?.skills || []} />
        <AboutSection
          about={data?.personal?.about}
          availability={data?.personal?.availability}
          openTo={data?.personal?.openTo || []}
          languages={data?.personal?.languages || []}
          prioritySkills={data?.personal?.prioritySkills || []}
          education={data?.education || []}
        />
        <ExperienceSection experiences={data?.experiences || []} />
        {/* The heading count covers every ACTIVE project; the grid still
            renders the showcaseable subset. */}
        <ProjectSection
          projects={data?.projects || []}
          totalCount={data?.allProjects.length ?? 0}
        />
        <SkillsSection skills={data?.skills || []} />
        {/* Hidden for now — kept in the tree to be re-enabled later. */}
        {/* <OpenSourceSection /> */}
        <CredentialsSection items={credentials} />
        <WritingSection items={publications} />
        <HomeContactSection
          contacts={data?.personal?.contacts || []}
          availability={data?.personal?.availability}
        />
      </div>
    </BaseLayout>
  );
};

export default HomePage;
