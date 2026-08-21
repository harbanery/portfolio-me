import { readFile } from "fs/promises";
import path from "path";

/**
 * Data service for the curated profile at `public/data/me.en.json`.
 * Powers the hero lead, hero stats, and navbar status — mirroring the
 * progress-self pattern of keeping data access in `src/services`.
 */

interface MeLocation {
  city: string;
  countryCode: string;
}

interface MeBasics {
  name: string;
  label: string;
  location: MeLocation;
}

interface MeWork {
  company: string;
  startDate: string;
  endDate: string | null;
  isCurrentRole?: boolean;
}

interface MeProfile {
  basics: MeBasics;
  work: MeWork[];
  projects: Array<{ name: string }>;
}

export interface HeroStat {
  value: string;
  label: string;
}

export interface HeroContent {
  name: string;
  label: string;
  locationLabel: string;
  lead: string;
  stats: HeroStat[];
}

/**
 * Hero lead, curated from the strongest highlights in me.en.json
 * (work[0].highlights: 94% commit ownership across six enterprise systems,
 * 60% dashboard load-time reduction, test coverage 20% → 80%+).
 * Two sentences, progress only, last sentence starts with "I develop".
 */
const HERO_LEAD =
  "Principal frontend engineer across six enterprise systems, owning ~94% of commits on a national rail ticketing platform serving thousands of daily passengers. I develop and optimize fullstack applications, cutting dashboard load times by up to 60% and raising test coverage from under 20% to 80%+.";

/** Whole months between two dates (month granularity, day ignored). */
function monthsBetween(from: Date, to: Date): number {
  return (
    (to.getFullYear() - from.getFullYear()) * 12 +
    (to.getMonth() - from.getMonth())
  );
}

/** Formal, count-aware stat labels derived from the data. */
function buildStats(me: MeProfile): HeroStat[] {
  const projectCount = me.projects.length;
  const companyCount = new Set(me.work.map((job) => job.company)).size;

  // Total professional experience: earliest work start through today
  // (current role has no end date).
  const starts = me.work.map((job) => new Date(`${job.startDate}-01`));
  const earliest = starts.reduce(
    (min, current) => (current < min ? current : min),
    starts[0] ?? new Date(),
  );
  const months = Math.max(0, monthsBetween(earliest, new Date()));
  const years = Math.max(1, Math.round(months / 12));

  return [
    {
      value: `${projectCount}`,
      label: `${projectCount === 1 ? "Project" : "Projects"} delivered`,
    },
    {
      value: `${companyCount}`,
      label: `${companyCount === 1 ? "Company" : "Companies"} worked with`,
    },
    {
      value: `${years}+ ${years === 1 ? "Year" : "Years"}`,
      label: `of professional experience`,
    },
  ];
}

async function readMeProfile(): Promise<MeProfile | null> {
  try {
    const file = path.join(process.cwd(), "public", "data", "me.en.json");
    const raw = await readFile(file, "utf8");
    return JSON.parse(raw) as MeProfile;
  } catch (error) {
    console.error("Error reading public/data/me.en.json:", error);
    return null;
  }
}

/** Hero content derived from the curated profile data. */
export async function getHeroContent(): Promise<HeroContent | null> {
  const me = await readMeProfile();
  if (!me) return null;

  return {
    name: me.basics.name,
    label: me.basics.label,
    locationLabel: `${me.basics.location.city}, Indonesia`,
    lead: HERO_LEAD,
    stats: buildStats(me),
  };
}
