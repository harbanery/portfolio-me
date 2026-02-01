export function isEmpty(obj: any): boolean {
  if (obj === null || obj === undefined) return true;

  if (typeof obj !== "object") return false;

  return Object.values(obj).every((value) => {
    if (value === null || value === undefined) return true;
    if (typeof value === "string") return value.trim() === "";
    if (Array.isArray(value)) return value.length === 0;
    if (typeof value === "object") return Object.keys(value).length === 0;

    return false; // numbers, booleans, etc. are NOT empty
  });
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
    default:
      return value;
  }
}
