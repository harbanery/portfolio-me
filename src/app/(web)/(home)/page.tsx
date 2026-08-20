import BaseLayout from "@/components/layout";
import { getHomeData, getExperienceData } from "@/server/actions";
import HeroSection from "./section/hero";
import AboutSection from "./section/about";
import SkillsMarqueeSection from "./section/skills-marquee";
import ExperienceSection from "./section/experience";
import ProjectSection from "./section/projects";
import SkillsSection from "./section/skills";
import OpenSourceSection from "./section/open-source";
import CredentialsSection from "./section/credentials";
import WritingSection from "./section/writing";
import HomeContactSection from "./section/contact";

const HomePage = async () => {
  const [{ data }, { data: experienceData }] = await Promise.all([
    getHomeData(),
    getExperienceData(),
  ]);

  return (
    <BaseLayout navbar={true} footer={true}>
      <div className="w-full bg-black">
        <HeroSection name={data?.personal?.name} />
        <SkillsMarqueeSection skills={data?.personal?.skills || []} />
        <AboutSection
          about={data?.personal?.about}
          images={data?.personal?.images?.map((img) => img.url) || []}
        />
        <ExperienceSection experiences={experienceData?.experiences || []} />
        <ProjectSection projects={data?.projects || []} />
        <SkillsSection />
        <OpenSourceSection />
        <CredentialsSection />
        <WritingSection />
        <HomeContactSection contacts={data?.personal?.contacts || []} />
      </div>
    </BaseLayout>
  );
};

export default HomePage;
