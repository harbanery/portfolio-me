import BaseLayout from "@/components/layout";
import { getHomeData } from "@/server/actions";
import HeroSection from "./section/hero";
import SkillsMarqueeSection from "./section/skills-marquee";
import AboutSection from "./section/about";
import ExperienceSection from "./section/experience";
import ProjectSection from "./section/projects";
import SkillsSection from "./section/skills";
import OpenSourceSection from "./section/open-source";
import CredentialsSection from "./section/credentials";
import WritingSection from "./section/writing";
import HomeContactSection from "./section/contact";

const HomePage = async () => {
  const { data } = await getHomeData();

  return (
    <BaseLayout navbar={true} footer={true}>
      <div className="w-full bg-black">
        <HeroSection
          name={data?.personal?.name}
          stats={
            data?.projects?.length
              ? [
                  {
                    value: `${data.projects.length}`,
                    label: "Projects shipped end to end",
                  },
                  {
                    value: `${data.experiences.length}`,
                    label: "Companies across five industries",
                  },
                  { value: "6+ years", label: "Building data & AI systems" },
                ]
              : undefined
          }
        />
        <SkillsMarqueeSection skills={data?.skills || []} />
        <AboutSection
          about={data?.personal?.about}
          images={data?.personal?.images?.map((img) => img.url) || []}
        />
        <ExperienceSection experiences={data?.experiences || []} />
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
