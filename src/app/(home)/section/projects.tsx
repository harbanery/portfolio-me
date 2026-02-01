import CardProject from "@/components/custom/card/project";

interface ProjectSectionProps {
  projects: Array<{
    id: number;
    title: string;
    role: string;
    image: string;
    description: string | null;
    skills: string[];
    repoLinks: string[];
    webLink: string | null;
  }>;
}

const ProjectSection = ({ projects }: ProjectSectionProps) => {
  return (
    <section
      id="projects"
      className="w-full h-auto relative p-20 space-y-10 bg-slate-900"
    >
      <h1 className="text-white text-center font-bebas tracking-wide font-bold text-7xl">
        Portfolio
      </h1>
      <div className="flex justify-center flex-1 gap-x-10 md:gap-x-5 flex-wrap">
        {projects.map((project) => (
          <CardProject
            key={project.id}
            data={{
              title: project.title,
              role: project.role,
              image: project.image,
              description: project.description,
              tools: project.skills,
              source: project.repoLinks.map((repoLink, index) => ({
                name: `Source ${index + 1}`,
                link: repoLink,
              })),
              link: project.webLink,
            }}
          />
        ))}
      </div>
    </section>
  );
};

export default ProjectSection;
