import prisma from "@/server/db";

/**
 * Data service for certifications (credentials section) and publications
 * (writing section). Mirrors the admin-portfolio schema. No dummy
 * fallback: empty or unreachable tables yield empty lists and the
 * sections stay hidden.
 */

export interface CredentialItem {
  category: string;
  year: string;
  title: string;
  issuer: string;
  detail: string;
  url: string | null;
}

export interface WritingItem {
  kind: string;
  year: string;
  title: string;
  excerpt: string;
  url: string | null;
  /** Co-author names, excluding the profile owner. */
  authors: string[];
}

export interface EducationItem {
  /** "Formal" or "Non-formal" — display label of the education type. */
  kind: string;
  school: string;
  /** e.g. "Bachelor" — omitted for non-formal education. */
  degree: string | null;
  field: string;
  /** e.g. "3.87 / 4.00" — omitted when not stored. */
  grade: string | null;
  year: string;
}

const yearOf = (date: Date) => `${date.getFullYear()}`;

/** Year range label for an education entry ("2023" or "2019 – 2023"). */
const yearRangeOf = (start: Date, end: Date | null): string => {
  const startYear = start.getFullYear();
  const endYear = end ? end.getFullYear() : null;
  return endYear && endYear !== startYear
    ? `${startYear} – ${endYear}`
    : `${startYear}`;
};

export interface CvFile {
  name: string;
  url: string;
}

/**
 * The primary CV for the navbar download button: the ACTIVE row flagged
 * `is_primary`, falling back to the most recent ACTIVE row. Null when the
 * table is empty or unreachable (the button hides).
 */
export async function getPrimaryCv(): Promise<CvFile | null> {
  try {
    const primary = await prisma.cv.findFirst({
      where: { status: "ACTIVE", isPrimary: true },
      orderBy: { updatedAt: "desc" },
      select: { name: true, fileUrl: true },
    });
    if (primary?.fileUrl) {
      return { name: primary.name, url: primary.fileUrl };
    }

    const anyActive = await prisma.cv.findFirst({
      where: { status: "ACTIVE" },
      orderBy: { updatedAt: "desc" },
      select: { name: true, fileUrl: true },
    });
    if (anyActive?.fileUrl) {
      return { name: anyActive.name, url: anyActive.fileUrl };
    }
  } catch (error) {
    console.error("Error fetching primary CV:", error);
  }

  return null;
}

/** Education history from the database, newest first. */
export async function getEducation(): Promise<EducationItem[]> {
  try {
    const rows = await prisma.education.findMany({
      where: { status: "ACTIVE" },
      orderBy: { startDate: "desc" },
      select: {
        educationType: true,
        school: true,
        degree: true,
        field: true,
        grade: true,
        startDate: true,
        endDate: true,
      },
    });

    if (rows.length > 0) {
      return rows.map((row) => ({
        kind:
          row.educationType === "FORMAL" ? "Formal" : "Non-formal",
        school: row.school,
        degree: row.degree || null,
        field: row.field,
        grade: row.grade || null,
        year: yearRangeOf(
          new Date(row.startDate),
          row.endDate ? new Date(row.endDate) : null,
        ),
      }));
    }
  } catch (error) {
    console.error("Error fetching education:", error);
  }

  return [];
}

/** Certifications from the database, newest first. */
export async function getCredentials(): Promise<CredentialItem[]> {
  try {
    const rows = await prisma.certification.findMany({
      where: { status: "ACTIVE" },
      orderBy: { issueDate: "desc" },
      select: {
        title: true,
        issuer: true,
        category: true,
        issueDate: true,
        expiryDate: true,
        credentialUrl: true,
      },
    });

    // Once the table responds, its rows are the source of truth (no dummy
    // fallback). Visibility rules: a credential needs a verification link,
    // and one with a passed expiry date is retired.
    if (rows.length > 0) {
      const now = new Date();
      const visible = rows.filter(
        (row): row is typeof row & { credentialUrl: string } =>
          !!row.credentialUrl && (!row.expiryDate || row.expiryDate >= now),
      );

      return visible.map((row) => ({
        category: row.category,
        year: yearOf(row.issueDate),
        title: row.title,
        issuer: row.issuer,
        detail: "",
        url: row.credentialUrl,
      }));
    }
  } catch (error) {
    console.error("Error fetching certifications:", error);
  }

  return [];
}

/** Publications from the database, newest first. */
export async function getPublications(): Promise<WritingItem[]> {
  try {
    const rows = await prisma.publication.findMany({
      where: { status: "ACTIVE" },
      orderBy: { publishDate: "desc" },
      select: {
        title: true,
        publicationType: true,
        publishDate: true,
        abstract: true,
        url: true,
        authors: true,
      },
    });

    if (rows.length > 0) {
      return rows.map((row) => ({
        kind: row.publicationType,
        year: yearOf(row.publishDate),
        title: row.title,
        excerpt: row.abstract ?? "",
        url: row.url,
        authors: row.authors ?? [],
      }));
    }
  } catch (error) {
    console.error("Error fetching publications:", error);
  }

  return [];
}
