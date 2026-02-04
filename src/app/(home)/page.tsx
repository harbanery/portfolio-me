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
        <HeroSection name={data?.personal?.name} />
        <AboutSection
          about={data?.personal?.about}
          skills={data?.personal?.skills || []}
          images={data?.personal?.images?.map((img: any) => `data:${img.mimeType};base64,${img.data}`) || []}
        />
        <ProjectSection projects={data?.projects || []} />
        <ContactSection contacts={data?.personal?.contacts || []} />
      </div>
    </BaseLayout>
  );
};

export default HomePage;
