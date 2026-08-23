import SectionHeading from "@/components/section-heading";
import RotatingText from "@/components/rotating-text";
import { normalizeHtmlBody } from "@/helpers";
import { logoMap } from "@/models/icons";
import { masterDataMap } from "@/models/master-data";
import type { EducationItem } from "@/services/credentialService";
import type { PersonalLanguage } from "@/services/personalService";

interface AboutSectionProps {
  about?: string | null;
  /** Mirrors the Prisma `PersonalAvailability` enum. */
  availability?: string | null;
  /** Role labels from the Personal row ("open_to" column). */
  openTo?: string[];
  /** Languages from the Personal row ("languages" JSON column). */
  languages?: PersonalLanguage[];
  /** Priority skill keys from the Personal row ("priority_skills"). */
  prioritySkills?: string[];
  education: EducationItem[];
}

/** Display label per language level stored in the database. */
const LANGUAGE_LEVEL_LABEL: Record<string, string> = {
  NATIVE: "Native",
  PROFESSIONAL: "Professional",
  LIMITED: "Limited",
};

/** Used while the profile row has no languages stored yet. */
const FALLBACK_LANGUAGES: PersonalLanguage[] = [
  { name: "Bahasa Indonesia", level: "NATIVE" },
  { name: "English", level: "PROFESSIONAL" },
];

/** What the profile is open to, derived from availability when the
 *  database list is empty. */
const fallbackOpenToOf = (
  availability?: string | null,
): { label: string; active: boolean }[] => {
  switch (availability) {
    case "AVAILABLE":
      return [
        { label: "Full-time roles", active: true },
        { label: "Freelance projects", active: true },
      ];
    case "ONLY_FREELANCE":
      return [
        { label: "Full-time roles", active: false },
        { label: "Freelance projects", active: true },
      ];
    case "NOT_AVAILABLE":
      return [{ label: "Nothing at the moment", active: false }];
    default:
      return [
        { label: "Full-time roles", active: true },
        { label: "Freelance projects", active: true },
      ];
  }
};

/** Row label styling shared by every info row. */
const rowLabelClass =
  "font-martian-mono text-[10px] uppercase tracking-[0.25em] text-gray-600 mb-2.5";

/**
 * About section: rich-text body on the left, compact profile card on the
 * right (focusing on, open to, languages, education). No portrait image
 * by design.
 */
const AboutSection = ({
  about,
  availability,
  openTo,
  languages,
  prioritySkills,
  education,
}: AboutSectionProps) => {
  const openToItems =
    openTo && openTo.length > 0
      ? openTo.map((label) => ({ label, active: true }))
      : fallbackOpenToOf(availability);

  const languageItems =
    languages && languages.length > 0 ? languages : FALLBACK_LANGUAGES;

  const focusingOn = (prioritySkills ?? []).filter((key) => masterDataMap[key]);

  return (
    <section id="about" className="relative bg-black py-24 md:py-32">
      <div className="mx-auto w-full max-w-6xl px-6 lg:px-10">
        {/* Heading summarizes the body: a curiosity-driven journey into
            building digital products (see the about data). */}
        <SectionHeading
          label="About"
          meta="Profile"
          lineOne="Curiosity, crafted"
          lineTwo="into code."
        />

        <div className="mt-14 grid items-start gap-12 lg:grid-cols-[1fr_20rem] lg:gap-16">
          {/* Body column */}
          <div
            data-aos="fade-right"
            className="min-w-0 wrap-break-word lg:pt-2"
          >
            {about ? (
              <div
                className="html-body text-lg text-gray-300 text-justify font-neue-haas font-light tracking-wider leading-relaxed paragraph-wrapper wrap-anywhere"
                dangerouslySetInnerHTML={{ __html: normalizeHtmlBody(about) }}
              />
            ) : (
              <p className="max-w-[60ch] text-lg text-gray-400 font-neue-haas font-light leading-relaxed">
                A longer profile is on its way. In the meantime: I take systems
                nobody had modelled and make them answerable.
              </p>
            )}
          </div>

          {/* Info card */}
          <aside
            data-aos="fade-left"
            data-aos-delay="150"
            className="rounded-2xl border border-white/10 bg-white/[0.02] p-6 md:p-7 transition-[border-color] duration-500 ease-out hover:border-[#DEB887]/60"
          >
            {/* Focusing on — priority skills from the database. Icon-only
                pills with a transparent border; hovering a pill expands
                its label and brings back the usual pill border. */}
            {focusingOn.length > 0 && (
              <div className="pb-6">
                <h3 className={rowLabelClass}>Focusing on</h3>
                <div className="flex flex-wrap gap-2">
                  {focusingOn.map((key) => {
                    const Icon = logoMap[key];
                    return (
                      <span
                        key={key}
                        title={masterDataMap[key]?.name || key}
                        className="group/pill inline-flex cursor-pointer items-center rounded-full border border-transparent px-2.5 py-1 text-xs text-gray-300 font-neue-haas transition-[border-color] duration-300 hover:border-white/13"
                      >
                        {Icon ? (
                          <Icon className="h-3.5 w-3.5 shrink-0" />
                        ) : (
                          <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-gray-500" />
                        )}
                        <span className="max-w-0 overflow-hidden text-nowrap opacity-0 transition-[max-width,opacity,margin] duration-300 group-hover/pill:max-w-[12rem] group-hover/pill:opacity-100 group-hover/pill:ml-2">
                          {masterDataMap[key]?.name || key}
                        </span>
                      </span>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Education */}
            <div
              className={`border-t border-white/10 py-6 ${
                focusingOn.length === 0 ? "border-t-0 pt-0" : ""
              }`}
            >
              <h3 className={rowLabelClass}>Education</h3>
              <ul className="space-y-4">
                {education.map((item) => (
                  <li key={`${item.school}-${item.year}`}>
                    <p className="text-sm font-neue-haas font-light tracking-widest text-gray-200">
                      {item.school}
                    </p>
                    <p className="mt-0.5 text-xs text-gray-500 font-neue-haas tracking-wider font-light">
                      {[item.degree, item.field].filter(Boolean).join(" · ")}
                    </p>
                    <p className="mt-1 font-martian-mono text-[10px] uppercase tracking-[0.2em] text-gray-600 tabular-nums">
                      {item.kind} · {item.year}
                    </p>
                  </li>
                ))}
              </ul>
            </div>

            {/* Open to — roles rotate one at a time with the same crossfade
                loop as the Bogor/Jakarta city swap in the navbar. */}
            <div className="border-t border-white/10 py-6">
              <h3 className={rowLabelClass}>Open to</h3>
              <p className="text-sm text-gray-200 font-neue-haas font-light tracking-widest leading-relaxed">
                <RotatingText
                  items={openToItems.map((option) => option.label)}
                />
              </p>
            </div>

            {/* Languages */}
            <div className="border-t border-white/10 pt-6">
              <h3 className={rowLabelClass}>Languages</h3>
              <ul className="space-y-2">
                {languageItems.map((language) => (
                  <li
                    key={language.name}
                    className="flex items-baseline justify-between gap-3 text-sm font-neue-haas font-light tracking-widest text-gray-200"
                  >
                    {language.name}
                    <span className="text-xs text-gray-500">
                      {LANGUAGE_LEVEL_LABEL[language.level] ?? language.level}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          </aside>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;
