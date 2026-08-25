import { desc, eq } from "drizzle-orm";
import { db } from "@/db";
import { products } from "@/db/schema";
import { getSetting } from "@/lib/admin";
import { buildStoreHtml } from "@/lib/export-html";
import { clean, isLocal } from "@/lib/site";

export const dynamic = "force-dynamic";

export async function GET(req: Request) {
  const url = new URL(req.url);
  const download = url.searchParams.get("download") === "1";

  // رابط الخادم المشتغل حالياً (يعمل دائماً)
  const fwdHost =
    req.headers.get("x-forwarded-host") ?? req.headers.get("host") ?? "";
  const fwdProto =
    req.headers.get("x-forwarded-proto") ??
    (fwdHost.startsWith("localhost") || fwdHost.startsWith("127.")
      ? "http"
      : "https");
  const runtime = fwdHost ? clean(`${fwdProto}://${fwdHost}`) : url.origin;

  const [
    all,
    shippingRaw,
    thresholdRaw,
    categoriesRaw,
    whatsapp,
    phone,
    savedUrl,
    urlEnabled,
  ] = await Promise.all([
    db
      .select()
      .from(products)
      .where(eq(products.active, true))
      .orderBy(desc(products.featured), desc(products.id)),
    getSetting("shipping_fee", "35"),
    getSetting("free_shipping_threshold", "500"),
    getSetting("categories", "المطبخ,إلكترونيات,المنزل"),
    getSetting("store_whatsapp", "212600000000"),
    getSetting("store_phone", "0600-000000"),
    getSetting("site_url", ""),
    getSetting("site_url_enabled", "false"),
  ]);

  // نستعمل النطاق المخصص فقط إذا كان مفعّلاً **ويستجيب فعلاً** على الإنترنت،
  // وإلا نرجع لرابط الخادم العامل حتى تشتغل السلة ولوحة التحكم داخل الملف.
  const custom = clean(savedUrl);
  const forceLive = url.searchParams.get("live") === "1";
  const override = clean(url.searchParams.get("base") ?? "");

  let apiBase = runtime;

  if (override && !isLocal(override)) {
    apiBase = override;
  } else if (!forceLive && urlEnabled === "true" && custom && !isLocal(custom)) {
    try {
      const ping = await fetch(custom, {
        method: "HEAD",
        redirect: "follow",
        signal: AbortSignal.timeout(4000),
      });
      if (ping.ok) apiBase = custom;
    } catch {
      // النطاق غير مربوط بعد — نبقى على الرابط العامل
    }
  }

  const html = buildStoreHtml({
    products: all,
    categories: categoriesRaw
      .split(",")
      .map((c) => c.trim())
      .filter(Boolean),
    shippingFee: Number(shippingRaw) || 35,
    freeThreshold: Number(thresholdRaw) || 500,
    apiBase,
    whatsapp: whatsapp.replace(/\D/g, "") || "212600000000",
    phone,
  });

  return new Response(html, {
    headers: {
      "Content-Type": "text/html; charset=utf-8",
      "Cache-Control": "no-store",
      ...(download
        ? {
            "Content-Disposition":
              'attachment; filename="chaouishop-store.html"',
          }
        : {}),
    },
  });
}
