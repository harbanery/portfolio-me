export const META_TITLE: string | undefined = process.env.TITLE_WEB;
export const META_APP: string | undefined = process.env.APP_WEB;
export const META_DESCRIPTION: string | undefined = process.env.DESCRIPTION_WEB;

export const BASE_URL: string = process.env.NEXT_PUBLIC_URL || "http://localhost:3000";

export const NODE_ENV: string = process.env.NODE_ENV || "development";

export const DATABASE_URL: string = process.env.DATABASE_URL || "";
export const DIRECT_URL: string = process.env.DIRECT_URL || "";

// Email (Nodemailer SMTP) — same pattern as progress-self. When SMTP_HOST
// is empty the contact endpoint reports email as unavailable.
export const SMTP_HOST: string = process.env.SMTP_HOST || "";
export const SMTP_PORT: number = Number(process.env.SMTP_PORT || "465");
/** Direct TLS on 465; STARTTLS for other ports (587). */
const SMTP_SECURE_RAW = process.env.SMTP_SECURE ?? "";
export const SMTP_SECURE: boolean =
  SMTP_SECURE_RAW === "" ? SMTP_PORT === 465 : SMTP_SECURE_RAW === "true";
export const SMTP_USER: string = process.env.SMTP_USER || "";
export const SMTP_PASS: string = process.env.SMTP_PASS || "";
/** Sender address — falls back to SMTP_USER. */
export const SMTP_FROM: string = process.env.SMTP_FROM || SMTP_USER;
