import SectionHeading from "@/components/section-heading";
import { logoMap } from "@/models/icons";
import { masterDataMap } from "@/models/master-data";
import type { ExperienceTimelineEntry } from "@/models/experience";

interface ExperienceSectionProps {
  experiences: ExperienceTimelineEntry[];
}

/** Numbered experience list, following the reference design. */
const ExperienceSection = ({ experiences }: ExperienceSectionProps) => (
  <section
    id="experience"
    className="relative bg-black py-24 md:py-32"
  >
    <div className="mx-auto w-full max-w-6xl px-6 lg:px-10">
      <SectionHeading
        number="02"
        label="Experience"
        meta={`${experiences.length} ROLES`}
        lineOne="Five years,"
        lineTwo="five industries."
      />

      <p
        data-aos="fade-up"
        className="max-w-[60ch] text-lg text-gray-400 font-neue-haas font-light leading-relaxed mb-14 md:mb-20"
      >
        Different domains, one throughline: taking a system nobody had modelled
        and making it answerable.
      </p>

      {experiences.length === 0 ? (
        <p
          data-aos="fade-up"
          className="text-lg text-gray-500 font-neue-haas font-light"
        >
          Roles will be listed here soon.
        </p>
      ) : (
        <div>
          {experiences.map((item, index) => {
            const isActive = item.title.includes("Present");

            return (
              <article
                key={item.title}
                data-aos="fade-up"
                className="grid md:grid-cols-[5rem_1fr] gap-4 md:gap-8 border-t border-white/10 py-10 first:border-t-0 first:pt-0"
              >
                {/* Number + status */}
                <div className="flex md:flex-col items-center md:items-start gap-3">
                  <span className="text-xs text-[#DEB887] tabular-nums">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  {isActive && (
                    <span className="text-[10px] uppercase tracking-[0.25em] text-[#DEB887] border border-[#DEB887]/30 rounded-full px-3 py-0.5">
                      Active
                    </span>
                  )}
                </div>

                {/* Body */}
                <div className="min-w-0">
                  <div className="flex flex-wrap items-baseline gap-x-4 gap-y-1 mb-2">
                    <h3 className="text-xl md:text-2xl font-inter font-bold text-white tracking-tight">
                      {item.content.companyName}
                    </h3>
                    <span className="text-xs uppercase tracking-[0.2em] text-gray-500 tabular-nums">
                      {item.title}
                    </span>
                  </div>

                  <p className="text-base text-gray-300 font-neue-haas mb-1">
                    {item.content.jobTitle}
                  </p>
                  {item.content.previousJobTitles?.map((title) => (
                    <p
                      key={title}
                      className="text-sm text-gray-500 font-neue-haas font-light"
                    >
                      Previously {title}
                    </p>
                  ))}

                  {item.content.description && (
                    <div
                      className="mt-4 text-base text-gray-400 font-neue-haas font-light text-justify leading-relaxed paragraph-wrapper"
                      dangerouslySetInnerHTML={{ __html: item.content.description }}
                    />
                  )}

                  {item.content.techStack.length > 0 && (
                    <div className="mt-6 flex flex-wrap gap-2">
                      {item.content.techStack.map((tech) => {
                        const Icon = logoMap[tech.toLowerCase()];
                        const techData = masterDataMap[tech.toLowerCase()];
                        return (
                          <span
                            key={tech}
                            className="inline-flex items-center gap-2 rounded-full border border-white/13 px-3 py-1 text-xs text-gray-300 font-neue-haas"
                          >
                            {Icon ? (
                              <Icon className="h-3.5 w-3.5" />
                            ) : (
                              <span className="h-1.5 w-1.5 rounded-full bg-gray-500" />
                            )}
                            {techData?.name || tech}
                          </span>
                        );
                      })}
                    </div>
                  )}
                </div>
              </article>
            );
          })}
        </div>
      )}
    </div>
  </section>
);

export default ExperienceSection;
