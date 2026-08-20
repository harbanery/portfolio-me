"use client";

import { useState } from "react";
import { ArrowRight } from "lucide-react";
import SectionHeading from "@/components/section-heading";

/**
 * Dummy credentials for the certificates section.
 * Replace with real degrees, trainings, and certifications when available.
 */
const CREDENTIALS = [
  {
    category: "EDUCATION",
    year: "2024",
    title: "B.Sc. Computer Science",
    issuer: "Universitas Pancasila, Jakarta",
    detail: "GPA 3.78 of 4.00. Graduated with distinction.",
  },
  {
    category: "EDUCATION",
    year: "2024",
    title: "Academic Transcript",
    issuer: "Universitas Pancasila, Jakarta",
    detail: "Full course record across four years of study.",
  },
  {
    category: "TRAINING",
    year: "2023",
    title: "Machine Learning, Basic to Advanced",
    issuer: "Professional Training",
    detail: "Supervised and unsupervised learning end to end.",
  },
  {
    category: "TRAINING",
    year: "2022",
    title: "Business Intelligence Fundamentals",
    issuer: "Professional Training",
    detail: "Warehousing concepts, dimensional modelling, and dashboards.",
  },
  {
    category: "CERTIFICATION",
    year: "2022",
    title: "Data Science Fundamentals",
    issuer: "Dicoding",
    detail: "Core data science workflow and Python tooling.",
  },
  {
    category: "CERTIFICATION",
    year: "2021",
    title: "Python Programming",
    issuer: "Dicoding",
    detail: "Language fundamentals, idioms, and standard library.",
  },
];

const FILTERS = ["All", "Education", "Training", "Certification"];

/** Filterable credential list, following the reference design. */
const CredentialsSection = () => {
  const [active, setActive] = useState("All");

  const filtered =
    active === "All"
      ? CREDENTIALS
      : CREDENTIALS.filter((c) => c.category === active.toUpperCase());

  return (
    <section
      id="credentials"
      className="relative bg-black py-24 md:py-32"
    >
      <div className="mx-auto w-full max-w-6xl px-6 lg:px-10">
        <SectionHeading
          number="06"
          label="Credentials"
          meta={`${CREDENTIALS.length} VERIFIED`}
          lineOne="Verified,"
          lineTwo="not asserted."
        />

        <p
          data-aos="fade-up"
          className="max-w-[60ch] text-lg text-gray-400 font-neue-haas font-light leading-relaxed mb-10"
        >
          Degrees, trainings, and certifications behind the practice.
        </p>

        {/* Filters */}
        <div
          data-aos="fade-up"
          className="flex flex-wrap gap-2 mb-10 md:mb-14"
        >
          {FILTERS.map((filter) => (
            <button
              key={filter}
              onClick={() => setActive(filter)}
              className={`rounded-full border px-4 py-1.5 text-xs uppercase tracking-[0.15em] font-inter font-semibold transition-colors duration-300 ${
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
          {filtered.map((credential, index) => (
            <article
              key={`${credential.title}-${credential.year}`}
              data-aos="fade-up"
              data-aos-delay={`${(index % 3 + 1) * 75}`}
              className="group grid md:grid-cols-[10rem_1fr_auto] gap-3 md:gap-8 items-baseline border-t border-white/10 py-6 first:border-t-0 first:pt-0"
            >
              <div className="flex items-center gap-3">
                <span className="text-[10px] uppercase tracking-[0.2em] text-gray-600">
                  {credential.category}
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
                  {credential.issuer} — {credential.detail}
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
            </article>
          ))}
        </div>
      </div>
    </section>
  );
};

export default CredentialsSection;
