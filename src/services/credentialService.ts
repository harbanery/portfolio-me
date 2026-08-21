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
        credentialUrl: true,
      },
    });

    if (rows.length > 0) {
      return rows.map((row) => ({
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
