import BaseLayout from "@/components/custom/layout";
import HeroSection from "./section/hero";
import AboutSection from "./section/about";
import ContactSection from "./section/contact";
import ProjectSection from "./section/projects";
import hero from "@/assets/template/person-with-bg.png";
import ssrAction from "./actions";

const HomePage = async () => {
  const { data } = await ssrAction();

  return (
    <BaseLayout navbar={true} footer={true}>
      <div className="w-full bg-black">
        <HeroSection image={hero} />
        <AboutSection
          about={data?.personal?.about}
          skills={data?.personal?.skills || []}
        />
        <ProjectSection projects={data?.projects || []} />
        <ContactSection contacts={data?.personal?.contacts || []} />
      </div>
    </BaseLayout>
  );
};

export default HomePage;
