import type { MetadataRoute } from "next";
import { eq } from "drizzle-orm";
import { db } from "@/db";
import { products } from "@/db/schema";
import { absoluteUrl, getStoreUrl } from "@/lib/site";

export const dynamic = "force-dynamic";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = await getStoreUrl();

  let items: { id: number; createdAt: Date }[] = [];
  try {
    items = await db
      .select({ id: products.id, createdAt: products.createdAt })
      .from(products)
      .where(eq(products.active, true));
  } catch {
    items = [];
  }

  return [
    {
      url: absoluteUrl("/", base),
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 1,
    },
    ...items.map((p) => ({
      url: absoluteUrl(`/produit/${p.id}`, base),
      lastModified: p.createdAt ?? new Date(),
      changeFrequency: "weekly" as const,
      priority: 0.8,
    })),
  ];
}
