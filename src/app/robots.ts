import type { MetadataRoute } from "next";
import { BASE_URL } from "@/utils/config/variables";

/**
 * Robots policy — everything public is crawlable; the sitemap points
 * crawlers at the generated sitemap.xml (see app/sitemap.ts).
 */
export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
    },
    sitemap: `${BASE_URL}/sitemap.xml`,
  };
}
