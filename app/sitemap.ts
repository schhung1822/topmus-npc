import type { MetadataRoute } from "next";
import { getSeoSettings } from "@/lib/seo-settings";

export const dynamic = "force-dynamic";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const seo = await getSeoSettings();

  return [
    {
      url: seo.siteUrl,
      lastModified: new Date(seo.updatedAt),
      changeFrequency: "weekly",
      priority: 1,
    },
  ];
}
