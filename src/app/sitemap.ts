import type { MetadataRoute } from "next";
import { MENU_URL, SITE_URL } from "@/lib/site-seo";

export const dynamic = "force-static";

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date();

  return [
    {
      url: `${SITE_URL}/`,
      lastModified,
      changeFrequency: "weekly",
      priority: 1,
    },
    {
      url: MENU_URL,
      lastModified,
      changeFrequency: "weekly",
      priority: 0.9,
    },
  ];
}
