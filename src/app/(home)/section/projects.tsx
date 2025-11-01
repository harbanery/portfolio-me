import CardProject from "@/components/custom/card/project";
import projects from "@/data/projects.json";

const ProjectSection = () => {
  return (
    <section
      id="projects"
      className="w-full h-auto relative p-20 space-y-10 bg-slate-900"
    >
      <h1 className="text-white text-center font-bebas tracking-wide font-bold text-7xl">
        Portfolio
      </h1>
      <div className="flex justify-center flex-1 gap-x-10 md:gap-x-5 flex-wrap">
        {projects.map((project, index) => (
          <CardProject key={index} data={project} />
        ))}
      </div>
    </section>
  );
};

export default ProjectSection;
