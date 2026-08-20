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
}

/** Minimal project shape used by cards & carousels. */
export interface ProjectSummary {
  id: number;
  title: string;
  image: string;
}
