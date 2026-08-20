import { logoMap } from "@/models/icons";
import { masterDataMap } from "@/models/master-data";

interface SkillsMarqueeSectionProps {
  skills?: string[];
}

/**
 * "Technologies I work with" marquee — same band pattern as the
 * OrganisationsSection, but with tool logos instead of text.
 */
const SkillsMarqueeSection = ({ skills = [] }: SkillsMarqueeSectionProps) => {
  const skillList = skills
    .filter((skill) => logoMap[skill])
    .map((skill) => ({
      key: skill,
      icon: logoMap[skill],
      name: masterDataMap[skill]?.name || skill,
    }));

  if (skillList.length === 0) return null;

  return (
    <section
      aria-label="Technologies I work with"
      className="relative bg-black border-y border-white/10 py-10"
    >
      <div className="relative overflow-hidden">
        <div className="bg-linear-to-r from-black from-0% to-transparent to-100% absolute left-0 z-10 w-4/12 h-full pointer-events-none" />
        <div className="bg-linear-to-l from-black from-0% to-transparent to-100% absolute right-0 z-10 w-4/12 h-full pointer-events-none" />
        <div className="flex w-max animate-scroll items-center gap-16 md:gap-24 pr-16 md:pr-24">
          {[...skillList, ...skillList].map((item, index) => (
            <span
              key={`${item.key}-${index + 1}`}
              title={item.name}
              className="flex items-center gap-16 md:gap-24 text-gray-500 hover:text-white transition-colors duration-300 whitespace-nowrap"
            >
              <item.icon size={36} className="shrink-0" />
              <span className="h-1 w-1 rounded-full bg-gray-700" />
            </span>
          ))}
        </div>
      </div>
    </section>
  );
};

export default SkillsMarqueeSection;
