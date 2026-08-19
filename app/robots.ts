import type { MetadataRoute } from "next";
import { getSeoSettings } from "@/lib/seo-settings";

export const dynamic = "force-dynamic";

export default async function robots(): Promise<MetadataRoute.Robots> {
  const seo = await getSeoSettings();

  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/admin/", "/api/"],
    },
    sitemap: new URL("/sitemap.xml", seo.siteUrl).toString(),
    host: seo.siteUrl,
  };
}
