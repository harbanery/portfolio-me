/**
 * Normalize rich-text HTML bodies before rendering.
 * Stored content often uses `&nbsp;` entities instead of plain spaces, which
 * produces long unbreakable runs and makes the text overflow its container.
 */
export function normalizeHtmlBody(html: string): string {
  return html
    .replace(/&nbsp;/gi, " ")
    .replace(/\u00A0/g, " ")
    .replace(/[ \t]{2,}/g, " ");
}

export function formatURLContact(value: string, type: string): string {
  switch (type) {
    case "mail":
      return `mailto:${value}`;
    case "phone":
      return `tel:${value}`;
    case "linkedin":
      return `https://www.linkedin.com/in/${value}`;
    case "github":
      return `https://github.com/${value}`;
    case "whatsapp":
      return `https://wa.me/${value}`;
    case "twitter":
      return `https://x.com/${value}`;
    case "instagram":
      return `https://www.instagram.com/${value}`;
    case "facebook":
      return `https://www.facebook.com/${value}`;
    default:
      return value;
  }
}

/** One entry of the Personal `contacts` JSON column. */
interface ContactEntry {
  type: string;
  value: string;
}

const isContactEntry = (value: unknown): value is ContactEntry =>
  !!value &&
  typeof value === "object" &&
  typeof (value as ContactEntry).type === "string" &&
  typeof (value as ContactEntry).value === "string";

/**
 * Full profile URL for a contact channel (e.g. "linkedin" → the LinkedIn
 * profile page) from the raw `contacts` JSON column. Null when the
 * channel is absent — used for the section empty-state links.
 */
export function getContactUrl(contacts: unknown, type: string): string | null {
  if (!Array.isArray(contacts)) return null;
  const entry = contacts.find(
    (item): item is ContactEntry =>
      isContactEntry(item) && item.type === type && !!item.value.trim(),
  );
  if (!entry) return null;
  const url = formatURLContact(entry.value.trim(), type);
  return url.startsWith("http") ? url : `https://${url}`;
}
