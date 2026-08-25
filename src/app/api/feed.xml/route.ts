import { eq } from "drizzle-orm";
import { db } from "@/db";
import { products } from "@/db/schema";
import {
  absoluteUrl,
  getStoreUrl,
  SITE_DESCRIPTION,
  SITE_NAME,
} from "@/lib/site";

export const dynamic = "force-dynamic";

function esc(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

/**
 * تغذية منتجات بصيغة Google Merchant Center (RSS 2.0)
 * تُستعمل لعرض منتجات المتجر مجاناً في Google Shopping.
 */
export async function GET() {
  const base = await getStoreUrl();
  const all = await db
    .select()
    .from(products)
    .where(eq(products.active, true));

  const items = all
    .map((p) => {
      const link = absoluteUrl(`/produit/${p.id}`, base);
      const image = p.image.startsWith("http")
        ? p.image
        : absoluteUrl(p.image, base);
      const description =
        p.description.trim() || `${p.name} — متوفر في ${SITE_NAME}`;
      return `    <item>
      <g:id>MH-${p.id}</g:id>
      <g:title>${esc(p.name)}</g:title>
      <g:description>${esc(description)}</g:description>
      <g:link>${esc(link)}</g:link>
      <g:image_link>${esc(image)}</g:image_link>
      <g:availability>${p.stock > 0 ? "in_stock" : "out_of_stock"}</g:availability>
      <g:price>${p.price}.00 MAD</g:price>${
        p.oldPrice && p.oldPrice > p.price
          ? `\n      <g:sale_price>${p.price}.00 MAD</g:sale_price>`
          : ""
      }
      <g:condition>new</g:condition>
      <g:brand>${esc(SITE_NAME)}</g:brand>
      <g:product_type>${esc(p.category)}</g:product_type>
      <g:identifier_exists>no</g:identifier_exists>
      <g:shipping>
        <g:country>MA</g:country>
        <g:service>Standard</g:service>
        <g:price>35.00 MAD</g:price>
      </g:shipping>
    </item>`;
    })
    .join("\n");

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:g="http://base.google.com/ns/1.0">
  <channel>
    <title>${esc(SITE_NAME)}</title>
    <link>${esc(absoluteUrl("/", base))}</link>
    <description>${esc(SITE_DESCRIPTION)}</description>
${items}
  </channel>
</rss>`;

  return new Response(xml, {
    headers: { "Content-Type": "application/xml; charset=utf-8" },
  });
}
