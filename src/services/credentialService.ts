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

/** Host serving the admin-uploaded certificate files. */
const CLOUDINARY_HOST = "res.cloudinary.com";

/**
 * Viewer URL for an admin-uploaded certificate file. Cloudinary stores
 * those PDFs with a disguised .docx extension (and blocks direct PDF
 * delivery), so the raw link downloads a bogus MS Word file instead of
 * opening it. Routing the URL through the /api/file proxy — WITHOUT
 * `download=1` — fetches the asset server-side, detects the real `%PDF-`
 * magic bytes, and serves it as `application/pdf` with
 * `Content-Disposition: inline`: the browser opens its built-in PDF
 * viewer instead of downloading. Non-Cloudinary URLs pass through
 * untouched (the proxy rejects them anyway).
 */
const toViewerUrl = (fileUrl: string): string => {
  try {
    const parsed = new URL(fileUrl);
    if (parsed.hostname === CLOUDINARY_HOST) {
      return `/api/file?url=${encodeURIComponent(fileUrl)}`;
    }
  } catch {
    // Not a parsable URL — hand it through as-is.
  }
  return fileUrl;
};

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
        kind: row.educationType === "FORMAL" ? "Formal" : "Non-formal",
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
        fileUrl: true,
      },
    });

    // Once the table responds, its rows are the source of truth (no dummy
    // fallback). Visibility rules: a credential needs a link — the
    // verification URL, or the certificate file when no URL exists — and
    // one with a passed expiry date is retired.
    if (rows.length > 0) {
      const now = new Date();
      const visible = rows.filter(
        (row) =>
          !!(row.credentialUrl || row.fileUrl) &&
          (!row.expiryDate || row.expiryDate >= now),
      );

      return visible.map((row) => ({
        category: row.category,
        year: yearOf(row.issueDate),
        title: row.title,
        issuer: row.issuer,
        detail: "",
        // Verification pages link straight out; certificate files go
        // through the inline viewer proxy so the PDF is displayed, never
        // downloaded as the disguised .docx Cloudinary stores.
        url:
          row.credentialUrl ||
          (row.fileUrl ? toViewerUrl(row.fileUrl) : null),
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
