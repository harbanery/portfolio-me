import { logoMap } from "@/models/icons";
import { masterDataMap } from "@/models/master-data";

interface SkillsMarqueeSectionProps {
  skills?: string[];
  /** Profile name — the marquee content while no skills exist yet. */
  name?: string | null;
}

/**
 * "Technologies I work with" marquee — same band pattern as the
 * OrganisationsSection, but with tool logos instead of text.
 *
 * Runs at one constant, somewhat slow speed (theme `--animate-scroll`);
 * scrolling does not change it. With no skills at all the band keeps the
 * same rhythm but scrolls the profile name instead.
 */
const SkillsMarqueeSection = ({
  skills = [],
  name,
}: SkillsMarqueeSectionProps) => {
  const fallbackName = (name ?? "Raihan Yusuf").trim() || "Raihan Yusuf";
  const skillList = skills
    .filter((skill) => logoMap[skill])
    .map((skill) => ({
      key: skill,
      icon: logoMap[skill],
      name: masterDataMap[skill]?.name || skill,
    }));

  return (
    <section
      aria-label={
        skillList.length > 0
          ? "Technologies I work with"
          : `${fallbackName} — technologies coming soon`
      }
      className="relative bg-black border-y border-white/10 py-10"
    >
      <div className="group relative overflow-hidden">
        <div className="bg-linear-to-r from-black from-0% to-transparent to-100% absolute left-0 z-10 w-4/12 h-full pointer-events-none" />
        <div className="bg-linear-to-l from-black from-0% to-transparent to-100% absolute right-0 z-10 w-4/12 h-full pointer-events-none" />
        {/* Track pauses while any item is hovered (group-hover) so it can
            be inspected without scrolling away. */}
        <div className="flex w-max animate-scroll items-center gap-16 md:gap-24 pr-16 md:pr-24 group-hover:[animation-play-state:paused]">
          {skillList.length > 0
            ? [...skillList, ...skillList].map((item, index) => (
                <span
                  key={`${item.key}-${index + 1}`}
                  className="flex items-center gap-16 md:gap-24 text-gray-500 hover:text-white cursor-pointer transition-colors duration-500 whitespace-nowrap"
                >
                  <item.icon size={36} className="shrink-0" />
                  <span className="h-1 w-1 rounded-full bg-gray-700" />
                </span>
              ))
            : [...Array(6)].map((_, index) => (
                <span
                  key={`name-${index + 1}`}
                  className="flex items-center gap-16 md:gap-24 whitespace-nowrap"
                >
                  <span className="font-inter text-3xl md:text-4xl font-extrabold tracking-tight text-gray-600 select-none">
                    {fallbackName}
                  </span>
                  <span className="h-1 w-1 rounded-full bg-gray-700" />
                </span>
              ))}
        </div>
      </div>
    </section>
  );
};

export default SkillsMarqueeSection;
