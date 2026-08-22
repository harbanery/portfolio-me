/** Employment type tag shown above the company name. */
export type EmploymentType =
  | "full-time"
  | "part-time"
  | "contract"
  | "freelancer"
  | "internship";

/** Display label per employment type. */
export const employmentTypeLabel: Record<EmploymentType, string> = {
  "full-time": "Full-time",
  "part-time": "Part-time",
  contract: "Contract",
  freelancer: "Freelancer",
  internship: "Internship",
};

/** Known spellings (EN/ID) mapped onto the canonical employment types. */
const EMPLOYMENT_TYPE_ALIASES: Record<string, EmploymentType> = {
  fulltime: "full-time",
  "full-time": "full-time",
  full: "full-time",
  tetap: "full-time",
  parttime: "part-time",
  "part-time": "part-time",
  part: "part-time",
  contract: "contract",
  kontrak: "contract",
  freelance: "freelancer",
  freelancer: "freelancer",
  internship: "internship",
  intern: "internship",
  magang: "internship",
};

/** Canonical employment type for a raw database value (default full-time). */
export function normalizeEmploymentType(value: string | null | undefined): EmploymentType {
  const key = (value ?? "").trim().toLowerCase().replace(/[\s_]+/g, "-");
  if (key && EMPLOYMENT_TYPE_ALIASES[key]) return EMPLOYMENT_TYPE_ALIASES[key];
  // Also tolerate "full time" (space) and "fulltime" style spacing.
  const squashed = (value ?? "").trim().toLowerCase().replace(/[\s_-]+/g, "");
  return EMPLOYMENT_TYPE_ALIASES[squashed] ?? "full-time";
}

/** Shape of one merged, company-grouped experience entry rendered on the timeline. */
export interface ExperienceContent {
  jobTitle: string;
  previousJobTitles?: string[];
  companyName: string;
  /** Employment type tag rendered above the company name. */
  employmentType: EmploymentType;
  /** True while still working at this company (drives the bright tag + dot). */
  isPresent: boolean;
  description: string;
  techStack: string[];
  images: string[];
}

/** Timeline entry: `title` is the date range label (e.g. "Mar 2024 – Present"). */
export interface ExperienceTimelineEntry {
  title: string;
  content: ExperienceContent;
}
