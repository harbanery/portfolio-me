"use client";

import { useEffect, useRef, useState } from "react";
import { ArrowRight, Plus } from "lucide-react";
import SectionHeading from "@/components/section-heading";
import type { CredentialItem } from "@/services/credentialService";

interface CredentialsSectionProps {
  items: CredentialItem[];
}

/** Display order for the category filters. */
const CATEGORY_ORDER = ["Certification", "Competency", "Academic", "Training"];

/** Rows revealed per click of "show more". */
const PAGE_SIZE = 5;

const capitalize = (value: string) =>
  value.charAt(0).toUpperCase() + value.slice(1).toLowerCase();

/** Filterable, paginated credential list backed by the Certification table. */
const CredentialsSection = ({ items }: CredentialsSectionProps) => {
  // A credential without a verification link is not shown, so the whole
  // section is hidden when nothing qualifies.
  const credentials = items.filter((item) => item.url);

  const [active, setActive] = useState("All");
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);
  const sectionRef = useRef<HTMLElement | null>(null);

  // Only categories that actually hold data get a filter button.
  const filters = [
    "All",
    ...Array.from(
      new Set(credentials.map((item) => capitalize(item.category))),
    ).sort((a, b) => {
      const rank = (value: string) => {
        const index = CATEGORY_ORDER.indexOf(value);
        return index === -1 ? CATEGORY_ORDER.length : index;
      };
      return rank(a) - rank(b);
    }),
  ];

  const filtered =
    active === "All"
      ? credentials
      : credentials.filter((item) => capitalize(item.category) === active);

  const list = filtered.length > 0 ? filtered : credentials;
  const visibleList = list.slice(0, visibleCount);
  const hasMore = visibleCount < list.length;

  /** Changing filters always restarts pagination from the first page. */
  const selectFilter = (filter: string) => {
    if (filter === active) return;
    setActive(filter);
    setVisibleCount(PAGE_SIZE);
  };

  /** Leaving the section (it scrolls out of view) collapses the list back
      to the first page so re-entering always starts fresh. */
  useEffect(() => {
    const node = sectionRef.current;
    if (!node) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) setVisibleCount(PAGE_SIZE);
      },
      { rootMargin: "0px 0px -10% 0px" },
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  if (credentials.length === 0) return null;

  return (
    <section
      id="credentials"
      ref={sectionRef}
      className="relative bg-black py-24 md:py-32"
    >
      <div className="mx-auto w-full max-w-6xl px-6 lg:px-10">
        <SectionHeading
          label="Credentials"
          meta={`${credentials.length} VERIFIED`}
          lineOne="Verified,"
          lineTwo="not asserted."
        />

        <p
          data-aos="fade-up"
          className="max-w-[60ch] text-lg text-gray-400 font-neue-haas font-light leading-relaxed mb-10"
        >
          Trainings, competencies, and certifications behind the practice.
        </p>

        {/* Filters */}
        <div
          data-aos="fade-up"
          className="flex flex-wrap gap-2 mb-10 md:mb-14"
        >
          {filters.map((filter) => (
            <button
              key={filter}
              onClick={() => selectFilter(filter)}
              className={`cursor-pointer rounded-full border px-4 py-1.5 text-xs uppercase tracking-[0.15em] font-inter font-semibold transition-colors duration-300 ${
                active === filter
                  ? "border-white/60 text-white bg-white/10"
                  : "border-white/13 text-gray-500 hover:text-gray-300 hover:border-white/30"
              }`}
            >
              {filter}
            </button>
          ))}
        </div>

        {/* List */}
        <div>
          {visibleList.map((credential, index) => {
            const content = (
              <>
                <div className="flex items-center gap-3">
                  <span className="text-[10px] uppercase tracking-[0.2em] text-gray-600">
                    {capitalize(credential.category)}
                  </span>
                  <span className="text-xs text-[#DEB887] tabular-nums md:hidden">
                    {credential.year}
                  </span>
                </div>
                <div className="min-w-0">
                  <h3 className="text-lg font-inter font-semibold text-white mb-1">
                    {credential.title}
                  </h3>
                  <p className="text-sm text-gray-500 font-neue-haas font-light">
                    {credential.detail
                      ? `${credential.issuer} — ${credential.detail}`
                      : credential.issuer}
                  </p>
                </div>
                <div className="hidden md:flex items-center gap-6">
                  <span className="text-xs text-[#DEB887] tabular-nums">
                    {credential.year}
                  </span>
                  <span className="inline-flex items-center gap-1.5 text-xs uppercase tracking-[0.15em] text-gray-500 group-hover:text-white transition-colors">
                    View
                    <ArrowRight
                      size={12}
                      className="transition-transform duration-200 group-hover:translate-x-0.5"
                    />
                  </span>
                </div>
              </>
            );

            const shared = {
              key: `${credential.title}-${credential.year}`,
              "data-aos": "fade-up",
              "data-aos-delay": `${(index % 3 + 1) * 75}`,
              className:
                "group grid md:grid-cols-[10rem_1fr_auto] gap-3 md:gap-8 items-baseline border-t border-white/10 py-6 first:border-t-0 first:pt-0",
            } as const;

            return credential.url ? (
              <a
                {...shared}
                href={credential.url}
                target="_blank"
                rel="noopener noreferrer"
              >
                {content}
              </a>
            ) : (
              <article {...shared}>{content}</article>
            );
          })}
        </div>

        {/* Show more */}
        {hasMore && (
          <button
            onClick={() => setVisibleCount((count) => count + PAGE_SIZE)}
            className="group mt-10 inline-flex cursor-pointer items-center gap-2 rounded-full border border-white/15 px-5 py-2 text-xs uppercase tracking-[0.15em] font-inter font-semibold text-gray-400 transition-colors duration-300 hover:border-white/40 hover:text-white"
          >
            <Plus
              size={12}
              className="transition-transform duration-300 group-hover:-rotate-90"
            />
            Show {Math.min(PAGE_SIZE, list.length - visibleCount)} more
          </button>
        )}
      </div>
    </section>
  );
};

export default CredentialsSection;
