/** Full project record (Prisma `Portfolio` row shape used by the UI). */
export interface Project {
  id: number;
  title: string;
  subtitle?: string | null;
  projectType: string;
  clientName?: string | null;
  companyName?: string | null;
  role: string;
  image: string;
  images: string[];
  description?: string | null;
  apiDocumentation?: string | null;
  features: string[];
  highlights: string[];
  challenges?: string | null;
  solutions?: string | null;
  story?: string | null;
  outcomes: string[];
  skills: string[];
  repoLinks: string[];
  webLink?: string | null;
  /** Manual showcase position — smallest `order` renders first. */
  order?: number;
  /** Completion date — drives the archive year; null while ongoing. */
  endDate?: string | Date | null;
  /** Record creation — archive year fallback (start date is not used). */
  createdAt?: string | Date | null;
}

/** Minimal project shape used by cards & carousels. */
export interface ProjectSummary {
  id: number;
  title: string;
  image: string;
}

/** Showcase card shape (home page) — only the fields the featured
 *  card renders. Keeping this lean shrinks the RSC payload sent to
 *  the client: long-form fields (story, features, highlights…) are
 *  never serialized into the HTML. */
export interface ShowcaseProject {
  id: number;
  title: string;
  projectType: string;
  image: string;
  description?: string | null;
  apiDocumentation?: string | null;
  skills: string[];
  repoLinks: string[];
  webLink?: string | null;
}

/** Archive row shape (/projects) — only the fields the year table
 *  renders. Descriptions and galleries are not needed here at all,
 *  so they stay out of the payload entirely. */
export interface ArchiveProject {
  id: number;
  title: string;
  projectType: string;
  clientName?: string | null;
  companyName?: string | null;
  role: string;
  skills: string[];
  repoLinks: string[];
  webLink?: string | null;
  /** Completion date — drives the archive year; null while ongoing. */
  endDate?: string | Date | null;
  /** Record creation — archive year fallback (start date is not used). */
  createdAt?: string | Date | null;
}
