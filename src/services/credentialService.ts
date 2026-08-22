import prisma from "@/server/db";

/**
 * Data service for certifications (credentials section) and publications
 * (writing section). Mirrors the admin-portfolio schema. Dummy data is
 * served while the tables are empty or unreachable.
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
}

export interface EducationItem {
  /** "Formal" or "Non-formal" — display label of the education type. */
  kind: string;
  school: string;
  /** e.g. "Bachelor" — omitted for non-formal education. */
  degree: string | null;
  field: string;
  year: string;
}

/** Dummy education for the about info card. */
const dummyEducation: EducationItem[] = [
  {
    kind: "Formal",
    school: "Institute of Technology",
    degree: "Bachelor",
    field: "Informatics Engineering",
    year: "2019 – 2023",
  },
  {
    kind: "Non-formal",
    school: "Pijar Camp",
    degree: null,
    field: "Fullstack Web & Golang Developer",
    year: "2024",
  },
];

/** Dummy credentials, aligned with the Certification categories. */
const dummyCredentials: CredentialItem[] = [
  {
    category: "CERTIFICATION",
    year: "2026",
    title: "Google IT Support",
    issuer: "Google",
    detail: "IT support fundamentals, troubleshooting, and system administration.",
    url: null,
  },
  {
    category: "CERTIFICATION",
    year: "2026",
    title: "Google Network Security Specialization",
    issuer: "Google",
    detail: "Network security defense, detection, and mitigation practices.",
    url: null,
  },
  {
    category: "TRAINING",
    year: "2024",
    title: "Fullstack Web & Golang Developer",
    issuer: "Pijar Camp",
    detail: "Intensive bootcamp — graduated with distinction (95.33%).",
    url: null,
  },
];

/** Dummy publications for the writing section. */
const dummyWriting: WritingItem[] = [
  {
    kind: "JOURNAL",
    year: "2023",
    title:
      "Super Encryption on Video Cryptography: Vigenere Cipher and Transposition Myszkowski",
    excerpt:
      "Combining Vigenere cipher with Myszkowski transposition to strengthen video data confidentiality.",
    url: null,
  },
  {
    kind: "OTHER",
    year: "2022",
    title:
      "Tempellemahbang Tourism Village Website for Promotion and Increasing Visitors",
    excerpt:
      "A community tourism website built to promote a local village and grow visitor numbers.",
    url: null,
  },
];

const yearOf = (date: Date) => `${date.getFullYear()}`;

/** Year range label for an education entry ("2023" or "2019 – 2023"). */
const yearRangeOf = (start: Date, end: Date | null): string => {
  const startYear = start.getFullYear();
  const endYear = end ? end.getFullYear() : null;
  return endYear && endYear !== startYear
    ? `${startYear} – ${endYear}`
    : `${startYear}`;
};

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
        year: yearRangeOf(
          new Date(row.startDate),
          row.endDate ? new Date(row.endDate) : null,
        ),
      }));
    }
  } catch (error) {
    console.error("Error fetching education, falling back to dummy data:", error);
  }

  return dummyEducation;
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
    console.error("Error fetching certifications, falling back to dummy data:", error);
  }

  return dummyCredentials;
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
      },
    });

    if (rows.length > 0) {
      return rows.map((row) => ({
        kind: row.publicationType,
        year: yearOf(row.publishDate),
        title: row.title,
        excerpt: row.abstract ?? "",
        url: row.url,
      }));
    }
  } catch (error) {
    console.error("Error fetching publications, falling back to dummy data:", error);
  }

  return dummyWriting;
}
