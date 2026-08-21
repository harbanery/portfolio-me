import prisma from "@/server/db";
import { dummyExperiences } from "@/models/dummy-experiences";
import { masterDataMap } from "@/models/master-data";
import type { Experience } from "@prisma/client";
import type {
  ExperienceContent,
  ExperienceTimelineEntry,
} from "@/models/experience";

/**
 * Data service for personal profile and experiences.
 * Mirrors the progress-self pattern: server actions stay thin and delegate
 * data access + grouping logic to `src/services`.
 */

export interface PersonalProfile {
  name: string;
  about: string | null;
  skills: string[];
  contacts: unknown;
  images: Array<{ url: string }>;
}

/** Aggregate experience figures for the hero stats. */
export interface ExperienceStats {
  /** Distinct companies across active experiences. */
  companies: number;
  /** Total professional experience in whole years (current role counts). */
  years: number;
}

const MONTH_LABELS = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];

/** Whole months between two dates (day granularity ignored). */
function monthsBetween(from: Date, to: Date): number {
  return (
    (to.getFullYear() - from.getFullYear()) * 12 +
    (to.getMonth() - from.getMonth())
  );
}

/** Parse the "MMM YYYY" start label of a dummy timeline title. */
function parseStartFromTitle(title: string): Date | null {
  const match = /^([A-Za-z]{3}) (\d{4})$/.exec(title.split(" – ")[0].trim());
  if (!match) return null;
  const monthIndex = MONTH_LABELS.indexOf(match[1]);
  if (monthIndex === -1) return null;
  return new Date(Number(match[2]), monthIndex, 1);
}

/**
 * Company count and total experience span, computed from the database.
 * Falls back to the dummy timeline while no rows exist.
 */
export async function getExperienceStats(): Promise<ExperienceStats> {
  let companies = 0;
  let earliest: Date | null = null;

  try {
    const rows = await prisma.experience.findMany({
      where: { status: "ACTIVE" },
      select: { companyName: true, startDate: true },
    });

    if (rows.length > 0) {
      companies = new Set(rows.map((row) => row.companyName)).size;
      earliest = rows
        .map((row) => new Date(row.startDate))
        .reduce((min, current) => (current < min ? current : min));
    }
  } catch (error) {
    console.error("Error fetching experience stats:", error);
  }

  // Database empty or unreachable: derive the same figures from the dummy
  // timeline ("MMM YYYY – ..." titles).
  if (companies === 0) {
    companies = dummyExperiences.length;
    earliest = dummyExperiences
      .map((entry) => parseStartFromTitle(entry.title))
      .filter((date): date is Date => date !== null)
      .reduce<Date | null>(
        (min, current) => (min === null || current < min ? current : min),
        null,
      );
  }

  const months = earliest ? Math.max(0, monthsBetween(earliest, new Date())) : 0;
  return { companies, years: Math.max(1, Math.round(months / 12)) };
}

const SKILL_ORDER = [
  "react",
  "next",
  "typescript",
  "javascript",
  "redux",
  "css",
  "tailwind",
  "golang",
  "laravel",
  "postgre",
  "cloudinary",
  "github",
];

/** Fallback skill marquee when the profile has no skills yet. */
const dummySkills = SKILL_ORDER.filter((key) => !!masterDataMap[key]);

export async function getPersonalProfile(): Promise<PersonalProfile | null> {
  try {
    // Explicit select: keeps working before the availability column is
    // migrated into an older database.
    const personal = await prisma.personal.findFirst({
      select: {
        name: true,
        about: true,
        skills: true,
        contacts: true,
        images: { select: { url: true }, orderBy: { order: "asc" } },
      },
    });

    if (!personal) return null;

    return {
      name: personal.name,
      about: personal.about,
      skills: personal.skills,
      contacts: personal.contacts,
      images: personal.images.map((image) => ({ url: image.url })),
    };
  } catch (error) {
    console.error("Error fetching personal profile:", error);
    return null;
  }
}

/** Skills for the marquee; falls back to a curated default set. */
export function getMarqueeSkills(skills: string[] | undefined): string[] {
  const list = (skills ?? []).filter((skill) => !!masterDataMap[skill]);
  return list.length > 0 ? list : dummySkills;
}

/**
 * Group raw experiences by company, merge consecutive roles, and sort by
 * most recent start date. Falls back to dummy entries while the database
 * has no active experience rows yet.
 */
export async function getExperiences(): Promise<ExperienceTimelineEntry[]> {
  let experiences: Experience[];

  try {
    experiences = await prisma.experience.findMany({
      where: { status: "ACTIVE" },
      orderBy: { startDate: "desc" },
    });
  } catch (error) {
    console.error(
      "Error fetching experiences, falling back to dummy data:",
      error,
    );
    return dummyExperiences;
  }

  // No data yet: serve the dummy timeline.
  if (experiences.length === 0) return dummyExperiences;

  // Group experiences by company name
  const companyMap: Record<string, Experience[]> = {};
  experiences.forEach((exp) => {
    if (!companyMap[exp.companyName]) {
      companyMap[exp.companyName] = [];
    }
    companyMap[exp.companyName].push(exp);
  });

  // Sort experiences within each company by start date
  Object.keys(companyMap).forEach((companyName) => {
    companyMap[companyName].sort(
      (a, b) =>
        new Date(a.startDate).getTime() - new Date(b.startDate).getTime(),
    );
  });

  return Object.values(companyMap)
    .map((companyExperiences) => {
      // Company experiences are sorted by start date, oldest first
      const earliestStart = new Date(companyExperiences[0].startDate);
      const latestEnd = companyExperiences.reduce<Date | null>(
        (latest, exp) => {
          if (!exp.endDate) return null; // "Present"
          if (!latest) return new Date(exp.endDate);
          return new Date(exp.endDate) > latest
            ? new Date(exp.endDate)
            : latest;
        },
        null,
      );

      const startMonth = earliestStart.toLocaleDateString("en-US", {
        month: "short",
        year: "numeric",
      });
      const endMonth = latestEnd
        ? latestEnd.toLocaleDateString("en-US", {
            month: "short",
            year: "numeric",
          })
        : "Present";

      const title = !latestEnd
        ? `${startMonth} – Present`
        : startMonth === endMonth
          ? startMonth
          : `${startMonth} – ${endMonth}`;

      const sortedChronologically = [...companyExperiences].sort(
        (a, b) =>
          new Date(b.startDate).getTime() - new Date(a.startDate).getTime(),
      );

      const content: ExperienceContent = {
        jobTitle: sortedChronologically[0].jobTitle,
        previousJobTitles: sortedChronologically
          .slice(1)
          .map((exp) => exp.jobTitle),
        companyName: companyExperiences[0].companyName,
        description: companyExperiences
          .map((exp) => exp.description || "")
          .filter((desc) => desc.trim())
          .join("\n\n"),
        techStack: [
          ...new Set(companyExperiences.flatMap((exp) => exp.skills || [])),
        ],
        images: [
          ...new Set(companyExperiences.flatMap((exp) => exp.images || [])),
        ],
      };

      return { title, content };
    })
    .sort(
      (a, b) =>
        new Date(b.title.split(" – ")[0]).getTime() -
        new Date(a.title.split(" – ")[0]).getTime(),
    );
}
