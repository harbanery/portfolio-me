import type { ExperienceTimelineEntry } from "@/models/experience";

/**
 * Dummy experience timeline entries.
 * Used as a fallback when the database has no active experience rows yet.
 * Grouped by company, roles merged, date labels in en-US — same shape the
 * experience service produces from real data. Replace by seeding the
 * `Experience` table (see public/database) and the site will automatically
 * switch to real data.
 */
export const dummyExperiences: ExperienceTimelineEntry[] = [
  {
    title: "Mar 2024 – Present",
    content: {
      jobTitle: "Manager, AI Engineering",
      companyName: "Fiber Backbone Operator",
      employmentType: "full-time",
      isPresent: true,
      description:
        "<p>Building the AI function from zero on top of a 25,000 km DWDM fiber backbone: a medallion data platform, a multi-agent LLM layer for network assurance, and the guardrails that make both trustworthy enough for operations.</p>",
      techStack: ["next", "ts", "postgre", "go"],
      images: [],
    },
  },
  {
    title: "Jun 2022 – Feb 2024",
    content: {
      jobTitle: "Data Engineer",
      previousJobTitles: ["Business Intelligence Analyst"],
      companyName: "Logistics & Supply Chain Group",
      employmentType: "contract",
      isPresent: false,
      description:
        "<p>Consolidated fragmented operational sources into a governed warehouse, then shipped the dashboards that made planning meetings argue about decisions instead of numbers.</p>",
      techStack: ["postgre", "javascript", "github"],
      images: [],
    },
  },
  {
    title: "Aug 2020 – May 2022",
    content: {
      jobTitle: "Full Stack Developer",
      companyName: "Digital Agency Studio",
      employmentType: "freelancer",
      isPresent: false,
      description:
        "<p>Shipped client web products end to end — from database schema to pixel — across retail, education, and fintech, and learned to treat scope, budget, and quality as one negotiation.</p>",
      techStack: ["react", "laravel", "css", "tailwind"],
      images: [],
    },
  },
];
