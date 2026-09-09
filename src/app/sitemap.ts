import type { MetadataRoute } from "next";
import { BASE_URL } from "@/config/variables";
import { getLatestUpdate } from "@/server/actions";

/**
 * Sitemap for the indexable routes. `lastModified` follows the newest
 * content row (projects/experiences) so search engines pick up edits
 * within the ISR window instead of guessing.
 */
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const lastModified = await getLatestUpdate();

  return [
    {
      url: `${BASE_URL}/`,
      lastModified: lastModified ?? new Date(),
      changeFrequency: "weekly",
      priority: 1,
    },
    {
      url: `${BASE_URL}/projects`,
      lastModified: lastModified ?? new Date(),
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      // /contacts only exists while the profile is reachable; a crawl of
      // a 404 is harmless and the URL re-enters the index later.
      url: `${BASE_URL}/contacts`,
      changeFrequency: "yearly",
      priority: 0.5,
    },
  ];
}
