/**
 * Convert project name to kebab-case for URL slugs
 * @param text - The project name to convert
 * @returns kebab-case string
 */
export function toKebabCase(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, (match) => {
      if (match.length > 1) {
        return match[0] + '-' + match.slice(1).join('-');
      }
      return match[0];
    });
}

/**
 * Get project slug from project data
 * @param project - Project data object
 * @returns kebab-case slug for URL
 */
export function getProjectSlug(project: { title: string; id?: number }): string {
  // For Prisma data, we'll use the ID as the slug for simplicity
  // This avoids slug collisions and ensures stable URLs
  return project.id?.toString() || toKebabCase(project.title);
}
