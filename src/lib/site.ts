import { headers } from "next/headers";
import { getSetting } from "./admin";

export const SITE_NAME = "MEHDISHOP";
export const SITE_TAGLINE = "متجر المواد المنزلية والإلكترونيات";
export const SITE_DESCRIPTION =
  "متجر CHAOUISHOP المغربي لبيع المواد المنزلية، أدوات المطبخ والأجهزة الإلكترونية بأثمنة مناسبة. الدفع عند الاستلام، توصيل سريع لجميع مدن المغرب خلال 24 إلى 48 ساعة.";

/** النطاق المستقبلي للمتجر (يُفعّل من الإعدادات بعد شرائه وربطه) */
export const PLANNED_DOMAIN = "https://chaouishop.app";

export const SITE_KEYWORDS = [
  "CHAOUISHOP",
  "شاوي شوب",
  "متجر إلكتروني مغربي",
  "مواد منزلية المغرب",
  "أدوات المطبخ",
  "إلكترونيات المغرب",
  "الدفع عند الاستلام",
  "توصيل مجاني المغرب",
];

export function clean(u: string): string {
  return u.trim().replace(/\/$/, "");
}

export function isLocal(u: string): boolean {
  return (
    !u ||
    u.includes("localhost") ||
    u.includes("127.0.0.1") ||
    u.includes("0.0.0.0")
  );
}

/** رابط الخادم الحقيقي المشتغل الآن (من ترويسات الطلب) */
export async function getRuntimeUrl(): Promise<string> {
  try {
    const h = await headers();
    const host = h.get("x-forwarded-host") ?? h.get("host") ?? "";
    if (!host) return "";
    const proto =
      h.get("x-forwarded-proto") ??
      (host.startsWith("localhost") || host.startsWith("127.")
        ? "http"
        : "https");
    return clean(`${proto}://${host}`);
  } catch {
    return "";
  }
}

/** الرابط من متغيرات البيئة (متزامن، للاستعمالات التي لا تدعم async) */
export function getSiteUrl(): string {
  const fromEnv =
    process.env.NEXT_PUBLIC_SITE_URL ||
    (process.env.VERCEL_PROJECT_PRODUCTION_URL
      ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
      : "") ||
    (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : "");

  return clean(fromEnv) || "http://localhost:3000";
}

/**
 * الرابط المعتمد للمتجر.
 * 1) النطاق المخصص إن كان مفعّلاً في لوحة التحكم (بعد ربطه فعلياً)
 * 2) وإلا: رابط الخادم المشتغل حالياً — فيبقى كل شيء يعمل دائماً
 */
export async function getStoreUrl(): Promise<string> {
  let saved = "";
  let enabled = false;
  try {
    saved = clean(await getSetting("site_url", ""));
    enabled = (await getSetting("site_url_enabled", "false")) === "true";
  } catch {
    /* قاعدة البيانات غير متاحة */
  }

  if (enabled && saved && !isLocal(saved)) return saved;

  const runtime = await getRuntimeUrl();
  if (runtime && !isLocal(runtime)) return runtime;

  const env = getSiteUrl();
  if (!isLocal(env)) return env;

  return runtime || env;
}

export function absoluteUrl(path = "/", base?: string): string {
  const root = base ? clean(base) : getSiteUrl();
  return `${root}${path.startsWith("/") ? path : `/${path}`}`;
}
