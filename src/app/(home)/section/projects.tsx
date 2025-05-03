import CardProject from "@/components/custom/card/project";

const ProjectSection = () => {
  return (
    <section
      id="projects"
      className="w-full h-auto relative p-20 space-y-10 bg-slate-900"
    >
      <h1 className="text-white text-center font-bebas tracking-wide font-bold text-7xl">
        Portfolio
      </h1>
      <div className="flex justify-center gap-x-10 flex-wrap">
        <CardProject />
        <CardProject />
      </div>
    </section>
  );
};

export default ProjectSection;
