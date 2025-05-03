import BaseLayout from "@/components/custom/layout";
import HeroSection from "./section/hero";
import AboutSection from "./section/about";
import ContactSection from "./section/contact";
import ProjectSection from "./section/projects";
import hero from "@/assets/template/person-with-bg.png";

const HomePage = () => {
  return (
    <BaseLayout>
      <HeroSection image={hero} />
      <AboutSection />
      <ProjectSection />
      <ContactSection />
    </BaseLayout>
  );
};

export default HomePage;
