"use client";

import { ArrowRight, Star } from "lucide-react";
import SectionHeading from "@/components/section-heading";

/**
 * Dummy public repositories for the open source section.
 * Replace with real GitHub data when available.
 */
const REPOS = [
  {
    name: "portfolio",
    description:
      "Personal portfolio — this very site, built with Next.js, Tailwind CSS, and Prisma.",
    language: "TypeScript",
    year: "2026",
    stars: 1,
  },
  {
    name: "progress-self",
    description:
      "Self-tracking PWA for daily challenges, evaluation dashboards, and push reminders.",
    language: "TypeScript",
    year: "2026",
  },
  {
    name: "shift-schedule",
    description:
      "Automated shift schedule generation using a genetic algorithm for optimization.",
    language: "Python",
    year: "2024",
    stars: 1,
  },
  {
    name: "passenger-counter",
    description: "Entry counter web app built with vanilla HTML, CSS, and JavaScript.",
    language: "CSS",
    year: "2022",
  },
];

const GITHUB_PROFILE = "https://github.com/";

/** Public GitHub archive grid, following the reference design. */
const OpenSourceSection = () => (
  <section
    id="open-source"
    className="relative bg-black py-24 md:py-32"
  >
    <div className="mx-auto w-full max-w-6xl px-6 lg:px-10">
      <SectionHeading
        label="Source Code"
        meta="4 PUBLIC REPOS"
        lineOne="Every public repository,"
        lineTwo="six years deep."
      />

      <div
        data-aos="fade-up"
        className="mb-10 md:mb-14 flex justify-end"
      >
        <a
          href={GITHUB_PROFILE}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 rounded-full border border-white/20 px-6 py-3 text-sm font-inter font-semibold tracking-wider text-white hover:border-white/50 transition-colors duration-500"
        >
          VIEW PROFILE
          <ArrowRight size={16} />
        </a>
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        {REPOS.map((repo, index) => (
          <a
            key={repo.name}
            href={GITHUB_PROFILE}
            target="_blank"
            rel="noopener noreferrer"
            data-aos="fade-up"
            data-aos-delay={`${(index % 2 + 1) * 100}`}
            className="group border border-white/10 rounded-2xl p-6 hover:border-white/25 transition-colors duration-500"
          >
            <div className="flex items-center justify-between gap-4 mb-3">
              <span className="font-mono text-sm text-[#DEB887] group-hover:text-[#f0d5ae] transition-colors">
                {repo.name}
              </span>
              <span className="text-[10px] uppercase tracking-[0.25em] text-gray-600 tabular-nums">
                {repo.language} · {repo.year}
              </span>
            </div>
            <p className="text-sm text-gray-400 font-neue-haas font-light leading-relaxed line-clamp-2">
              {repo.description}
            </p>
            {repo.stars ? (
              <span className="mt-4 inline-flex items-center gap-1.5 text-xs text-gray-500 tabular-nums">
                <Star size={12} /> {repo.stars}
              </span>
            ) : null}
          </a>
        ))}
      </div>
    </div>
  </section>
);

export default OpenSourceSection;
