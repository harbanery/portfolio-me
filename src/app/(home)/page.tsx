import BaseLayout from "@/components/custom/layout";
import HeroSection from "./section/hero";
import AboutSection from "./section/about";
import ProjectSection from "./section/projects";
import ssrAction from "./actions";
import ContactSection from "@/components/custom/section/contact";

const HomePage = async () => {
  const { data } = await ssrAction();

  return (
    <BaseLayout navbar={true} footer={true}>
      <div className="w-full bg-black">
        <HeroSection name={data?.personal?.name} />
        <AboutSection
          about={data?.personal?.about}
          skills={data?.personal?.skills || []}
          images={data?.personal?.images?.map((img: any) => img.url) || []}
        />
        <ProjectSection projects={data?.projects || []} />
        <ContactSection contacts={data?.personal?.contacts || []} />
      </div>
    </BaseLayout>
  );
};

export default HomePage;
