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
  // If project has an ID-based slug, use that
  const knownSlugs: Record<string, string> = {
    '1': 'modern-dashboard',
    '2': 'ecommerce-platform',
    '3': 'mobile-banking',
    '4': 'ai-content-generator'
  };
  
  // Return known slug if exists, otherwise convert title to kebab-case
  return knownSlugs[project.id?.toString()] || toKebabCase(project.title);
}
