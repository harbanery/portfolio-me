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

interface MeProfile {
  basics: MeBasics;
}

export interface HeroContent {
  name: string;
  label: string;
  locationLabel: string;
  lead: string;
}

/**
 * Hero lead, curated from the strongest highlights in me.en.json.
 * Two sentences max, with bold and underline emphasis (styled like the
 * rich-text bodies). Hero stats are NOT sourced here — they are computed
 * from the database (see personalService.getExperienceStats and
 * projectService).
 */
const HERO_LEAD =
  "Principal engineer on <strong>enterprise systems</strong>, owning ~94% of commits on a national rail ticketing platform. I develop <span>fullstack applications</span> that cut load times by 60% and raise coverage to 80%+.";

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
  };
}
