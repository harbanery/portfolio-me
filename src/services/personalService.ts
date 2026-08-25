import prisma from "@/server/db";
import { masterDataMap } from "@/models/master-data";
import {
  normalizeEmploymentType,
  type EmploymentType,
} from "@/models/experience";
import type { Experience, PersonalAvailability } from "@prisma/client";
import type {
  ExperienceContent,
  ExperienceTimelineEntry,
} from "@/models/experience";

/**
 * Data service for personal profile and experiences.
 * Mirrors the progress-self pattern: server actions stay thin and delegate
 * data access + grouping logic to `src/services`. No dummy fallback: an
 * empty or unreachable database yields empty results.
 */

/** Spoken language entry stored as JSON on the Personal row. */
export interface PersonalLanguage {
  name: string;
  /** NATIVE | PROFESSIONAL | LIMITED */
  level: string;
}

export interface PersonalProfile {
  name: string;
  about: string | null;
  availability: PersonalAvailability | null;
  /** Role labels the profile is open to (e.g. "Full Stack Engineer"). */
  openTo: string[];
  skills: string[];
  /** Priority skill keys — the "Focusing on" list on the about card. */
  prioritySkills: string[];
  languages: PersonalLanguage[];
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

/** Whole months between two dates (day granularity ignored). */
function monthsBetween(from: Date, to: Date): number {
  return (
    (to.getFullYear() - from.getFullYear()) * 12 +
    (to.getMonth() - from.getMonth())
  );
}

/**
 * Company count and total experience span, computed from the database.
 * Zeroes when there is no data — the hero hides zero-valued stats.
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

  const months = earliest
    ? Math.max(0, monthsBetween(earliest, new Date()))
    : 0;
  return { companies, years: months > 0 ? Math.max(1, Math.round(months / 12)) : 0 };
}

/** Normalizes the languages JSON into a typed list (bad shapes dropped). */
const toLanguages = (value: unknown): PersonalLanguage[] =>
  Array.isArray(value)
    ? value.filter(
        (item): item is PersonalLanguage =>
          !!item &&
          typeof item === "object" &&
          typeof (item as PersonalLanguage).name === "string" &&
          typeof (item as PersonalLanguage).level === "string",
      )
    : [];

export async function getPersonalProfile(): Promise<PersonalProfile | null> {
  try {
    // Explicit select: only the columns the UI renders (availability,
    // open_to, priority_skills and languages drive the navbar and the
    // about card). Newer columns may not exist in an unmigrated database —
    // retry without them in that case.
    const personal = await prisma.personal.findFirst({
      select: {
        name: true,
        about: true,
        availability: true,
        openTo: true,
        skills: true,
        prioritySkills: true,
        languages: true,
        contacts: true,
        images: { select: { url: true }, orderBy: { order: "asc" } },
      },
    });

    if (!personal) return null;

    return {
      name: personal.name,
      about: personal.about,
      availability: personal.availability,
      openTo: personal.openTo ?? [],
      skills: personal.skills,
      prioritySkills: personal.prioritySkills ?? [],
      languages: toLanguages(personal.languages),
      contacts: personal.contacts,
      images: personal.images.map((image) => ({ url: image.url })),
    };
  } catch (error) {
    console.warn(
      "Newer personal columns not available, retrying without them:",
      (error as Error).message,
    );
  }

  try {
    const personal = await prisma.personal.findFirst({
      select: {
        name: true,
        about: true,
        availability: true,
        skills: true,
        contacts: true,
        images: { select: { url: true }, orderBy: { order: "asc" } },
      },
    });

    if (!personal) return null;

    return {
      name: personal.name,
      about: personal.about,
      availability: personal.availability,
      openTo: [],
      skills: personal.skills,
      prioritySkills: [],
      languages: [],
      contacts: personal.contacts,
      images: personal.images.map((image) => ({ url: image.url })),
    };
  } catch (error) {
    console.error("Error fetching personal profile:", error);
    return null;
  }
}

/** Skills for the marquee — known keys only; empty when the profile has none. */
export function getMarqueeSkills(skills: string[] | undefined): string[] {
  return (skills ?? []).filter((skill) => !!masterDataMap[skill]);
}

/** Single entry of the Personal `contacts` JSON column. */
interface PersonalContactEntry {
  type: string;
  value: string;
}

const isContactEntry = (value: unknown): value is PersonalContactEntry =>
  !!value &&
  typeof value === "object" &&
  typeof (value as PersonalContactEntry).type === "string" &&
  typeof (value as PersonalContactEntry).value === "string";

/**
 * Email address from the Personal `contacts` JSON (type "mail"). Contact
 * form submissions are delivered here — the recipient lives in the data,
 * not in environment variables.
 */
export async function getPersonalContactEmail(): Promise<string | null> {
  try {
    const personal = await prisma.personal.findFirst({
      select: { contacts: true },
    });
    if (!personal || !Array.isArray(personal.contacts)) return null;

    // Prisma types the column as JsonValue; treat entries as unknown
    // before validating their shape.
    const entries = personal.contacts as unknown[];
    const mail = entries.find(
      (item): item is PersonalContactEntry =>
        isContactEntry(item) &&
        (item.type === "mail" || item.type === "email") &&
        !!item.value.trim(),
    );
    return mail ? mail.value.trim() : null;
  } catch (error) {
    console.error("Error fetching personal contact email:", error);
    return null;
  }
}

/**
 * Active experiences, newest first. Tries to include `employmentType`
 * (newer schema); when the shared database has not been migrated yet the
 * query fails on the missing column and is retried without it — those rows
 * simply default to "full-time".
 */
async function fetchExperiences(): Promise<Experience[]> {
  try {
    return await prisma.experience.findMany({
      where: { status: "ACTIVE" },
      orderBy: { startDate: "desc" },
      select: {
        id: true,
        jobTitle: true,
        companyName: true,
        employmentType: true,
        description: true,
        skills: true,
        images: true,
        startDate: true,
        endDate: true,
        isPresent: true,
        status: true,
        createdAt: true,
        updatedAt: true,
      },
    });
  } catch (error) {
    // Enum not migrated into this database yet — query every other column
    // explicitly so the generated SQL omits it. Those rows simply default
    // their employment type.
    console.warn(
      "employment_type not available, retrying without it:",
      (error as Error).message,
    );
    const legacy = await prisma.experience.findMany({
      where: { status: "ACTIVE" },
      orderBy: { startDate: "desc" },
      select: {
        id: true,
        jobTitle: true,
        companyName: true,
        description: true,
        skills: true,
        images: true,
        startDate: true,
        endDate: true,
        isPresent: true,
        status: true,
        createdAt: true,
        updatedAt: true,
      },
    });
    return legacy as Experience[];
  }
}

/**
 * Group raw experiences by company, merge consecutive roles, and sort by
 * most recent start date.
 */
export async function getExperiences(): Promise<ExperienceTimelineEntry[]> {
  let experiences: Experience[];

  try {
    experiences = await fetchExperiences();
  } catch (error) {
    console.error("Error fetching experiences:", error);
    return [];
  }

  // No data yet: the UI renders its empty state.
  if (experiences.length === 0) return [];

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

      // Tag values come from the most recent role at this company; the
      // group counts as "present" while any of its roles is ongoing.
      const employmentType: EmploymentType = normalizeEmploymentType(
        sortedChronologically[0].employmentType,
      );
      const isPresent = companyExperiences.some((exp) => exp.isPresent);

      const content: ExperienceContent = {
        jobTitle: sortedChronologically[0].jobTitle,
        previousJobTitles: sortedChronologically
          .slice(1)
          .map((exp) => exp.jobTitle),
        companyName: companyExperiences[0].companyName,
        employmentType,
        isPresent,
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
