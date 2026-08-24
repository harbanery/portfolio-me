import SectionHeading from "@/components/section-heading";
import { masterDataMap } from "@/models/master-data";

interface SkillsSectionProps {
  /** Skill keys from the Personal row in the database. */
  skills: string[];
}

/**
 * Fixed six-group layout, mapped straight from the admin master-data
 * categories: languages, frameworks, libraries, databases + cloud,
 * workflow & AI tools, and methodologies. "application" and "soft-skill"
 * entries are never listed.
 */
const EXCLUDED_CATEGORIES = new Set(["application", "soft-skill"]);

const isVisibleSkill = (categories: string[]) =>
  !categories.some((category) => EXCLUDED_CATEGORIES.has(category));

const GROUP_RULES: Array<{
  title: string;
  subtitle: string;
  match: (categories: string[]) => boolean;
}> = [
  {
    title: "Languages",
    subtitle: "Core languages of the stack",
    match: (c) => c.includes("language"),
  },
  {
    title: "Frameworks",
    subtitle: "Frontend and backend frameworks",
    match: (c) => c.includes("framework"),
  },
  {
    title: "Libraries",
    subtitle: "UI, state, and utility libraries",
    match: (c) => c.includes("library"),
  },
  {
    title: "Database & Cloud",
    subtitle: "Storage, ORM, and infrastructure",
    match: (c) =>
      c.includes("database") ||
      c.includes("orm") ||
      c.includes("cloud") ||
      c.includes("deployment") ||
      c.includes("platform"),
  },
  {
    title: "Workflow & AI Tools",
    subtitle: "Daily workflow and AI tooling",
    match: (c) => c.includes("tool") || c.includes("ai-tool"),
  },
  {
    title: "Methodologies",
    subtitle: "Practices and concepts",
    match: (c) => c.includes("methodology"),
  },
];

/** Fallback when the profile has no skills yet. */
const FALLBACK_KEYS = [
  "javascript",
  "typescript",
  "golang",
  "css",
  "react",
  "next",
  "laravel",
  "node",
  "antd",
  "tailwind",
  "redux",
  "axios",
  "postgre",
  "mysql",
  "redis",
  "prisma",
  "cloudinary",
  "vercel",
  "git",
  "gitlab",
  "github",
  "docker",
  "postman",
  "figma",
  "jwt",
  "i18n",
  "testing",
  "microservices",
];

/** Grouped capability grid built from the DB skill list. */
const SkillsSection = ({ skills }: SkillsSectionProps) => {
  const keys = skills.filter(
    (key) => masterDataMap[key] && isVisibleSkill(masterDataMap[key].category),
  );
  const source = keys.length > 0 ? keys : FALLBACK_KEYS;

  const groups = GROUP_RULES.map((rule) => ({
    title: rule.title,
    subtitle: rule.subtitle,
    keys: source.filter((key) => {
      const categories = masterDataMap[key]?.category ?? [];
      return rule.match(categories);
    }),
  })).filter((group) => group.keys.length > 0);

  const tracked = source.length;

  return (
    <section id="skills" className="relative bg-black py-24 md:py-32">
      <div className="mx-auto w-full max-w-6xl px-6 lg:px-10">
        <SectionHeading
          label="Capabilities"
          meta={`${tracked} TRACKED`}
          metaCount={tracked}
          lineOne="The stack,"
          lineTwo="end to end."
        />

        <p
          data-aos="fade-up"
          className="max-w-[60ch] text-lg text-gray-400 font-neue-haas font-light tracking-wider leading-relaxed mb-14 md:mb-20"
        >
          Grouped by what it is actually used for. Everything here has shipped
          to production or to a client deliverable.
        </p>

        {/* One card per category — fixed two-column grid at every
            breakpoint; on hover the border lights up gold with a soft
            matching glow. */}
        <div className="grid grid-cols-2 gap-3 sm:gap-4 md:gap-6">
          {groups.map((group, index) => (
            <div
              key={group.title}
              data-aos="fade-up"
              data-aos-delay={`${(index + 1) * 100}`}
            >
              <div className="flex h-full flex-col rounded-2xl border border-white/10 bg-white/[0.02] p-4 md:p-6 transition-[border-color,background-color,box-shadow] duration-500 ease-in-out hover:border-[#DEB887] hover:bg-[#DEB887]/[0.04] hover:shadow-[0_0_24px_-6px_rgba(222,184,135,0.45)]">
              <h3 className="text-sm md:text-lg font-inter font-semibold text-white mb-0.5 md:mb-1">
                {group.title}
              </h3>
              <p className="mb-4 md:mb-5 text-[10px] md:text-sm text-gray-500 font-neue-haas tracking-wider font-light">
                {group.subtitle}
              </p>
              <div className="flex flex-wrap gap-1.5 md:gap-2">
                {group.keys.map((key) => (
                  <span
                    key={key}
                    className="rounded-full border border-white/13 px-2 py-0.5 md:px-3 md:py-1 text-[10px] md:text-xs text-gray-300 font-neue-haas"
                  >
                    {masterDataMap[key]?.name || key}
                  </span>
                ))}
              </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default SkillsSection;
