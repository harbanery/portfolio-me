import BaseLayout from "@/components/layout";
import { getHomeData } from "@/server/actions";
import { getHeroContent } from "@/services/meProfileService";
import { getCredentials, getPublications } from "@/services/credentialService";
import { getContactUrl } from "@/helpers";
import { buildMenuSections } from "@/models/menu";
import HeroSection from "./section/hero";
import AboutSection from "./section/about";
import ExperienceSection from "./section/experience";
import SkillsSection, { isVisibleSkillKey } from "./section/skills";
import ProjectSection from "./section/projects";
// Hidden for now — kept in the tree to be re-enabled later.
// import OpenSourceSection from "./section/open-source";
import CredentialsSection from "./section/credentials";
import WritingSection from "./section/writing";
import HomeContactSection from "./section/contact";
import SkillsMarqueeSection from "./section/skills-marquee";

/**
 * ISR: pages are prerendered statically and revalidated in the background
 * at most every 60 seconds, so database edits appear on the site within a
 * minute — no redeploy and no external webhook needed (DB-only refresh).
 */
export const revalidate = 60;

const HomePage = async () => {
  const [{ data }, hero, credentials, publications] = await Promise.all([
    getHomeData(),
    getHeroContent(),
    getCredentials(),
    getPublications(),
  ]);

  // Hero stats from database data: projects, distinct companies, and total
  // professional experience. The project count covers every ACTIVE project,
  // not only the showcaseable ones. Zero-valued stats are dropped — with no
  // data at all the stats column disappears entirely (see HeroSection).
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
  ].filter((stat) => Number(stat.value) > 0);

  const contacts = data?.personal?.contacts;
  const linkedinUrl = getContactUrl(contacts, "linkedin");
  const githubUrl = getContactUrl(contacts, "github");

  const experiences = data?.experiences || [];
  const skills = data?.skills || [];

  // Sections that disappear entirely when their data is missing also drop
  // out of the side menu and the navbar mobile menu. Experience and
  // Projects always render (they switch to their empty-state cards), so
  // their menu entries stay.
  const menuSections = buildMenuSections({
    hasSkills: skills.some((key) => isVisibleSkillKey(key)),
    hasCredentials: credentials.length > 0,
    hasWriting: publications.length > 0,
  });

  return (
    <BaseLayout
      navbar={true}
      footer={true}
      locationLabel={hero?.locationLabel}
      availability={data?.personal?.availability}
      cvUrl={data?.cv?.url}
      cvName={data?.cv?.name}
      sections={menuSections}
    >
      <div className="w-full bg-black">
        <HeroSection
          name={data?.personal?.name ?? hero?.name}
          lead={hero?.lead}
          stats={stats}
        />
        <SkillsMarqueeSection
          skills={skills}
          name={data?.personal?.name ?? hero?.name}
        />
        <AboutSection
          about={data?.personal?.about}
          availability={data?.personal?.availability}
          openTo={data?.personal?.openTo || []}
          languages={data?.personal?.languages || []}
          prioritySkills={data?.personal?.prioritySkills || []}
          education={data?.education || []}
        />
        <ExperienceSection
          experiences={experiences}
          linkedinUrl={linkedinUrl}
        />
        {/* The heading count covers every ACTIVE project; the grid still
            renders the showcaseable subset. */}
        <ProjectSection
          projects={data?.projects || []}
          totalCount={projectCount}
          githubUrl={githubUrl}
          linkedinUrl={linkedinUrl}
        />
        <SkillsSection skills={skills} />
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
