import SectionHeading from "@/components/section-heading";
import { normalizeHtmlBody } from "@/helpers";
import type { EducationItem } from "@/services/credentialService";

interface AboutSectionProps {
  about?: string | null;
  /** Mirrors the Prisma `PersonalAvailability` enum. */
  availability?: string | null;
  education: EducationItem[];
}

/** Spoken languages — profile-level facts, not tracked in the database. */
const LANGUAGES = [
  { name: "Bahasa Indonesia", level: "Native" },
  { name: "English", level: "Professional" },
];

/** What the profile is open to, derived from the availability status. */
const openToOf = (
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
  "text-[10px] uppercase tracking-[0.25em] text-gray-600 mb-2.5";

/**
 * About section: rich-text body on the left, compact profile card on the
 * right (open to, languages, education). No portrait image by design.
 */
const AboutSection = ({ about, availability, education }: AboutSectionProps) => {
  const openTo = openToOf(availability);

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
                className="html-body text-lg text-gray-300 text-justify font-neue-haas font-light leading-relaxed paragraph-wrapper wrap-anywhere"
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
            {/* Open to */}
            <div className="pb-6">
              <h3 className={rowLabelClass}>Open to</h3>
              <ul className="space-y-2">
                {openTo.map((option) => (
                  <li
                    key={option.label}
                    className={`flex items-center gap-2 text-sm font-neue-haas font-light ${
                      option.active ? "text-gray-200" : "text-gray-600"
                    }`}
                  >
                    <span
                      className={`h-1.5 w-1.5 rounded-full ${
                        option.active ? "bg-[#2DD4BF]" : "bg-gray-700"
                      }`}
                    />
                    {option.label}
                  </li>
                ))}
              </ul>
            </div>

            {/* Languages */}
            <div className="border-t border-white/10 py-6">
              <h3 className={rowLabelClass}>Languages</h3>
              <ul className="space-y-2">
                {LANGUAGES.map((language) => (
                  <li
                    key={language.name}
                    className="flex items-baseline justify-between gap-3 text-sm font-neue-haas font-light text-gray-200"
                  >
                    {language.name}
                    <span className="text-xs text-gray-500">
                      {language.level}
                    </span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Education */}
            <div className="border-t border-white/10 pt-6">
              <h3 className={rowLabelClass}>Education</h3>
              <ul className="space-y-4">
                {education.map((item) => (
                  <li key={`${item.school}-${item.year}`}>
                    <p className="text-sm font-neue-haas font-light text-gray-200">
                      {item.school}
                    </p>
                    <p className="mt-0.5 text-xs text-gray-500 font-neue-haas font-light">
                      {[item.degree, item.field].filter(Boolean).join(" · ")}
                    </p>
                    <p className="mt-1 text-[10px] uppercase tracking-[0.2em] text-gray-600 tabular-nums">
                      {item.kind} · {item.year}
                    </p>
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
