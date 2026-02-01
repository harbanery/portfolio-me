import BaseLayout from "@/components/custom/layout";
import HeroSection from "./section/hero";
import AboutSection from "./section/about";
import ContactSection from "./section/contact";
import ProjectSection from "./section/projects";
import hero from "@/assets/template/person-with-bg.png";
import SkillSection from "./section/skill";
import ssrAction from "./actions";

const HomePage = async () => {
  const { data } = await ssrAction();

  return (
    <BaseLayout>
      <div className="bg-slate-950">
        <HeroSection image={hero} />
        <AboutSection about={data?.personal?.about} />
        <SkillSection skills={data?.personal?.skills || []} />
        <ProjectSection projects={data?.projects || []} />
        <ContactSection contacts={data?.personal?.contacts || []} />
      </div>
    </BaseLayout>
  );
};

export default HomePage;
