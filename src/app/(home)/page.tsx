import BaseLayout from "@/components/custom/layout";
import HeroSection from "./section/hero";
import AboutSection from "./section/about";
import ContactSection from "./section/contact";
import ProjectSection from "./section/projects";
import hero from "@/assets/template/person-with-bg.png";
import SkillSection from "./section/skill";

const HomePage = () => {
  return (
    <BaseLayout>
      <div className="bg-slate-950">
        <HeroSection image={hero} />
        <AboutSection />
        <SkillSection />
        <ProjectSection />
        <ContactSection />
      </div>
    </BaseLayout>
  );
};

export default HomePage;
