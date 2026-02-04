import { ExternalLink } from "lucide-react";
import { logoMap } from "@/utils/helpers/icon";
import { masterDataMap } from "@/utils/helpers/category";
import { getProjectSlug } from "@/utils/slug";
import { StarsBackground } from "@/components/aceternity/ui/bg-stars";
import { ShootingStars } from "@/components/aceternity/ui/shooting-stars";

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

const ListProjectSection = ({ projects }: ProjectSectionProps) => {
  if (projects.length === 0) return null;

  const renderSkillIcon = (skill: string) => {
    const Icon = logoMap[skill];
    return Icon ? <Icon size={20} /> : null;
  };

  return (
    <section
      id="projects"
      className="min-h-screen bg-black flex items-center justify-center px-4 py-20"
    >
      <StarsBackground className="pointer-events-none" />
      <ShootingStars className="pointer-events-none" />
      <div className="max-w-7xl mx-auto w-full">
        <h2 className="text-5xl lg:text-7xl font-neue-haas text-white font-light mb-20 text-center">
          Projects
        </h2>

        <div className="space-y-32">
          {projects.map((project, index) => (
            <div
              key={project.id}
              className={`grid lg:grid-cols-2 gap-16 items-center ${
                index % 2 === 1 ? "lg:grid-flow-col-dense" : ""
              }`}
            >
              <div className={index % 2 === 1 ? "lg:col-start-2" : ""}>
                <div className="aspect-video bg-gray-800 rounded-none overflow-hidden grayscale hover:grayscale-0 transition-all duration-300">
                  {project.image && (
                    <img
                      src={project.image}
                      alt={project.title}
                      className="w-full h-full object-cover"
                    />
                  )}
                </div>
              </div>
              <div
                className={
                  index % 2 === 1
                    ? "lg:col-start-1 lg:row-start-1 lg:text-right"
                    : ""
                }
              >
                <h3 className="text-3xl lg:text-4xl font-neue-haas text-white font-light mb-6">
                  {project.title}
                </h3>
                <p className="text-lg text-gray-300 font-neue-haas leading-relaxed mb-8">
                  {project.description || "No description available"}
                </p>
                {project?.skills?.length ? (
                  <div
                    className={`flex flex-wrap gap-2 mb-8 ${index % 2 === 1 ? "lg:justify-end" : ""}`}
                  >
                    {project.skills
                      .filter((skill) => logoMap[skill])
                      .slice(0, 6)
                      .map((skill) => (
                        <div
                          key={skill}
                          className="p-2 bg-gray-800 rounded border border-gray-700 transition-all duration-300 text-gray-500 hover:text-[var(--skill-color)]"
                          style={{
                            ["--skill-color" as any]:
                              masterDataMap[skill].color || "#FFFFFF",
                          }}
                        >
                          {renderSkillIcon(skill)}
                        </div>
                      ))}
                  </div>
                ) : null}
                <div className="mb-4">
                  <a
                    href={`/project/${getProjectSlug(project)}`}
                    className="inline-flex items-center gap-2 text-white font-neue-haas font-medium tracking-wider hover:underline"
                  >
                    VIEW PROJECT
                    <ExternalLink size={16} />
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ListProjectSection;
