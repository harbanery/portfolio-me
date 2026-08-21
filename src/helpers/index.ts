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

export function getGithubRepoName(url: string): string | null {
  const pathname = new URL(url).pathname;
  const parts = pathname.split("/").filter(Boolean);
  return parts[1] || null;
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
