import type { MetadataRoute } from "next";
import { absoluteUrl, getStoreUrl } from "@/lib/site";

export const dynamic = "force-dynamic";

export default async function robots(): Promise<MetadataRoute.Robots> {
  const base = await getStoreUrl();

  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/admin", "/api/"],
      },
    ],
    sitemap: absoluteUrl("/sitemap.xml", base),
    host: absoluteUrl("/", base),
  };
}
