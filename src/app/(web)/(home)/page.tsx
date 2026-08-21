import BaseLayout from "@/components/layout";
import { getHomeData } from "@/server/actions";
import { getHeroContent } from "@/services/meProfileService";
import { getCredentials, getPublications } from "@/services/credentialService";
import HeroSection from "./section/hero";
import AboutSection from "./section/about";
import ExperienceSection from "./section/experience";
import SkillsSection from "./section/skills";
import ProjectSection from "./section/projects";
import OpenSourceSection from "./section/open-source";
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
  // professional experience. Labels stay formal and count-aware.
  const projectCount = data?.projects.length ?? 0;
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
    <BaseLayout navbar={true} footer={true} locationLabel={hero?.locationLabel}>
      <div className="w-full bg-black">
        <HeroSection
          name={data?.personal?.name ?? hero?.name}
          lead={hero?.lead}
          stats={stats}
        />
        <SkillsMarqueeSection skills={data?.skills || []} />
        <AboutSection
          about={data?.personal?.about}
          images={data?.personal?.images?.map((img) => img.url) || []}
        />
        <ExperienceSection experiences={data?.experiences || []} />
        <SkillsSection skills={data?.skills || []} />
        <ProjectSection projects={data?.projects || []} />
        <OpenSourceSection />
        <CredentialsSection items={credentials} />
        <WritingSection items={publications} />
        <HomeContactSection contacts={data?.personal?.contacts || []} />
      </div>
    </BaseLayout>
  );
};

export default HomePage;
