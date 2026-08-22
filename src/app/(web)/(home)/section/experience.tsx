import SectionHeading from "@/components/section-heading";
import SmoothSticky from "@/components/smooth-sticky";
import { logoMap } from "@/models/icons";
import { masterDataMap } from "@/models/master-data";
import { normalizeHtmlBody } from "@/helpers";
import { employmentTypeLabel } from "@/models/experience";
import type { ExperienceTimelineEntry } from "@/models/experience";

interface ExperienceSectionProps {
  experiences: ExperienceTimelineEntry[];
}

/** Experience list with the date range on the left, per the reference design. */
const ExperienceSection = ({ experiences }: ExperienceSectionProps) => (
  <section id="experience" className="relative bg-black py-24 md:py-32">
    <div className="mx-auto w-full max-w-6xl px-6 lg:px-10">
      <SectionHeading
        label="Experience"
        meta={`${experiences.length} ROLES`}
        lineOne="From bootcamp"
        lineTwo="to enterprise."
      />

      {experiences.length === 0 ? (
        <p
          data-aos="fade-up"
          className="mt-14 text-lg text-gray-500 font-neue-haas font-light"
        >
          Roles will be listed here soon.
        </p>
      ) : (
        <div className="mt-14 md:mt-20">
          {experiences.map((item) => (
            <article
              key={item.title}
              data-aos="fade-up"
              className="relative grid md:grid-cols-[16rem_1fr] gap-4 md:gap-10 border-t border-white/10 py-10 first:border-t-0 first:pt-0"
            >
              {/* Company + date range — company keeps to one line via
                  truncation within the wider column. Follows the viewport
                  while the role body scrolls, easing smoothly in and out of
                  the stuck state (see SmoothSticky). */}
              <SmoothSticky>
                <div className="md:pt-1.5">
                  {/* Employment type tag — bright with a pulsing dot while
                      still working there, dark and dotless otherwise (same
                      dot treatment as the navbar "Available for work"). */}
                  <span
                    className={`mb-2 inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-[10px] uppercase tracking-[0.18em] font-inter font-medium ${
                      item.content.isPresent
                        ? "border-[#2DD4BF]/40 bg-[#2DD4BF]/10 text-[#2DD4BF]"
                        : "border-white/10 bg-white/[0.03] text-gray-500"
                    }`}
                  >
                    {item.content.isPresent && (
                      <span className="relative flex h-1.5 w-1.5">
                        <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#2DD4BF] opacity-60" />
                        <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-[#2DD4BF]" />
                      </span>
                    )}
                    {employmentTypeLabel[item.content.employmentType]}
                  </span>
                  <h3 className="truncate text-xl md:text-2xl font-inter font-bold text-white tracking-tight leading-snug">
                    {item.content.companyName}
                  </h3>
                  <span className="mt-1.5 block text-xs uppercase tracking-[0.2em] text-[#DEB887] tabular-nums">
                    {item.title}
                  </span>
                </div>
              </SmoothSticky>

              {/* Body — job title is the heading */}
              <div className="min-w-0 wrap-break-word">
                <p className="text-md md:text-lg uppercase font-neue-haas font-medium text-gray-300 tracking-[0.15em]">
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
                    className="html-body mt-4 text-base text-gray-400 text-justify font-neue-haas font-light leading-relaxed paragraph-wrapper wrap-anywhere"
                    dangerouslySetInnerHTML={{
                      __html: normalizeHtmlBody(item.content.description),
                    }}
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
          ))}
        </div>
      )}
    </div>
  </section>
);

export default ExperienceSection;
