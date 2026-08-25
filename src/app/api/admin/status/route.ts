import { NextResponse } from "next/server";
import { sql } from "drizzle-orm";
import { db } from "@/db";
import { orders, products } from "@/db/schema";
import { getSetting } from "@/lib/admin";
import { CORS_HEADERS, corsPreflight } from "@/lib/cors";
import { clean } from "@/lib/site";

export const dynamic = "force-dynamic";

export async function OPTIONS() {
  return corsPreflight();
}

export async function GET(req: Request) {
  const url = new URL(req.url);
  const fwdHost =
    req.headers.get("x-forwarded-host") ?? req.headers.get("host") ?? "";
  const fwdProto = req.headers.get("x-forwarded-proto") ?? "https";
  const runtime = fwdHost ? clean(`${fwdProto}://${fwdHost}`) : url.origin;

  // قاعدة البيانات
  let dbOk = false;
  let productCount = 0;
  let orderCount = 0;
  let dbError = "";
  try {
    const [p] = await db
      .select({ n: sql<number>`count(*)::int` })
      .from(products);
    const [o] = await db.select({ n: sql<number>`count(*)::int` }).from(orders);
    productCount = p?.n ?? 0;
    orderCount = o?.n ?? 0;
    dbOk = true;
  } catch (e) {
    dbError = e instanceof Error ? e.message : "خطأ في الاتصال";
  }

  // الإعدادات
  const [siteUrl, urlEnabled, gVerify, gFile] = await Promise.all([
    getSetting("site_url", ""),
    getSetting("site_url_enabled", "false"),
    getSetting("google_verification", ""),
    getSetting("google_html_file", ""),
  ]);

  const domain = clean(siteUrl);

  // هل النطاق يستجيب فعلاً على الإنترنت؟
  let domainLive = false;
  let domainMsg = "لم يُضبط نطاق";
  if (domain) {
    try {
      const res = await fetch(domain, {
        method: "HEAD",
        redirect: "follow",
        signal: AbortSignal.timeout(6000),
      });
      domainLive = res.ok;
      domainMsg = res.ok
        ? `يستجيب (${res.status})`
        : `لا يستجيب (${res.status})`;
    } catch {
      domainLive = false;
      domainMsg = "النطاق غير مسجّل أو غير مربوط بعد";
    }
  }

  const hosted = !/localhost|127\.0\.0\.1|e2b\.app|vercel\.app$/.test(
    domain.replace(/^https?:\/\//, "")
  );

  return NextResponse.json(
    {
      runtime,
      database: {
        ok: dbOk,
        productCount,
        orderCount,
        error: dbError,
      },
      domain: {
        value: domain,
        enabled: urlEnabled === "true",
        live: domainLive,
        message: domainMsg,
        isCustom: hosted && domain.length > 0,
      },
      google: {
        verification: Boolean(gVerify),
        htmlFile: Boolean(gFile),
        verified: Boolean(gVerify || gFile),
      },
      seo: {
        sitemap: `${runtime}/sitemap.xml`,
        robots: `${runtime}/robots.txt`,
        feed: `${runtime}/api/feed.xml`,
      },
    },
    { headers: CORS_HEADERS }
  );
}
