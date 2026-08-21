import SectionHeading from "@/components/section-heading";
import { masterDataMap } from "@/models/master-data";

interface SkillsSectionProps {
  /** Skill keys from the Personal row in the database. */
  skills: string[];
}

/**
 * Grouping rules: a DB skill lands in the first group whose filter matches
 * its master-data categories; anything unrecognized falls into "Other".
 */
const GROUP_RULES: Array<{
  title: string;
  subtitle: string;
  match: (categories: string[]) => boolean;
}> = [
  {
    title: "Frontend",
    subtitle: "Interfaces, state, and motion",
    match: (c) => c.includes("frontend") || c.includes("ui"),
  },
  {
    title: "Backend",
    subtitle: "APIs, services, and systems",
    match: (c) => c.includes("backend"),
  },
  {
    title: "Data & Cloud",
    subtitle: "Storage, delivery, and infrastructure",
    match: (c) =>
      c.includes("database") ||
      c.includes("cloud") ||
      c.includes("deployment") ||
      c.includes("orm"),
  },
  {
    title: "Workflow",
    subtitle: "Shipping and collaboration",
    match: (c) => c.includes("tool") || c.includes("version-control"),
  },
];

/** Fallback when the profile has no skills yet. */
const FALLBACK_KEYS = [
  "react",
  "next",
  "typescript",
  "javascript",
  "redux",
  "css",
  "tailwind",
  "golang",
  "laravel",
  "postgre",
  "prisma",
  "cloudinary",
  "git",
  "github",
  "docker",
  "postman",
];

/** Grouped capability columns built from the DB skill list. */
const SkillsSection = ({ skills }: SkillsSectionProps) => {
  const keys = skills.filter((key) => masterDataMap[key]);
  const source = keys.length > 0 ? keys : FALLBACK_KEYS;

  const groups = GROUP_RULES.map((rule) => ({
    title: rule.title,
    subtitle: rule.subtitle,
    keys: source.filter((key) => {
      const categories = masterDataMap[key]?.category ?? [];
      return rule.match(categories);
    }),
  })).filter((group) => group.keys.length > 0);

  const others = source.filter(
    (key) => !groups.some((group) => group.keys.includes(key)),
  );
  if (others.length > 0) {
    groups.push({
      title: "Practices",
      subtitle: "Methods and everything in between",
      keys: others,
    });
  }

  const tracked = source.length;

  return (
    <section
      id="skills"
      className="relative bg-black py-24 md:py-32"
    >
      <div className="mx-auto w-full max-w-6xl px-6 lg:px-10">
        <SectionHeading
          label="Capabilities"
          meta={`${tracked} TRACKED`}
          lineOne="The stack,"
          lineTwo="end to end."
        />

        <p
          data-aos="fade-up"
          className="max-w-[60ch] text-lg text-gray-400 font-neue-haas font-light leading-relaxed mb-14 md:mb-20"
        >
          Grouped by what it is actually used for. Everything here has shipped
          to production or to a client deliverable.
        </p>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-10">
          {groups.map((group, index) => (
            <div
              key={group.title}
              data-aos="fade-up"
              data-aos-delay={`${(index + 1) * 100}`}
              className="border-t border-white/10 pt-6"
            >
              <h3 className="text-lg font-inter font-semibold text-white mb-1">
                {group.title}
              </h3>
              <p className="text-sm text-gray-500 font-neue-haas font-light mb-5">
                {group.subtitle}
              </p>
              <div className="flex flex-wrap gap-2">
                {group.keys.map((key) => (
                  <span
                    key={key}
                    className="rounded-full border border-white/13 px-3 py-1 text-xs text-gray-300 font-neue-haas"
                  >
                    {masterDataMap[key]?.name || key}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default SkillsSection;
