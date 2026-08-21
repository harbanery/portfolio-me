import SectionHeading from "@/components/section-heading";
import { masterDataMap } from "@/models/master-data";

/**
 * Capability groups for the skills section.
 * Group subtitles are placeholders; chips map to real master data entries.
 */
const GROUPS: Array<{
  title: string;
  subtitle: string;
  keys: string[];
}> = [
  {
    title: "Frontend",
    subtitle: "Interfaces, state, and motion",
    keys: ["react", "next", "ts", "javascript", "redux", "css", "tailwind"],
  },
  {
    title: "Backend",
    subtitle: "APIs, services, and systems",
    keys: ["go", "laravel"],
  },
  {
    title: "Data & Cloud",
    subtitle: "Storage, delivery, and infrastructure",
    keys: ["postgre", "cloudinary"],
  },
  {
    title: "Workflow",
    subtitle: "Shipping and collaboration",
    keys: ["github"],
  },
];

/** Grouped capability columns, following the reference design. */
const SkillsSection = () => {
  const tracked = GROUPS.reduce((sum, group) => sum + group.keys.length, 0);

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
          {GROUPS.map((group, index) => (
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
