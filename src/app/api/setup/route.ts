import { NextResponse } from "next/server";
import { sql } from "drizzle-orm";
import { db, pool } from "@/db";
import { products, settings } from "@/db/schema";
import { SEED_PRODUCTS, SEED_SETTINGS } from "@/db/seed-data";

export const dynamic = "force-dynamic";
export const maxDuration = 60;

/** إنشاء الجداول إن لم تكن موجودة (بديل drizzle-kit push بدون terminal) */
const DDL = `
CREATE TABLE IF NOT EXISTS products (
  id serial PRIMARY KEY,
  name text NOT NULL,
  description text NOT NULL DEFAULT '',
  price integer NOT NULL,
  old_price integer,
  image text NOT NULL,
  category text NOT NULL DEFAULT 'المطبخ',
  stock integer NOT NULL DEFAULT 10,
  featured boolean NOT NULL DEFAULT false,
  active boolean NOT NULL DEFAULT true,
  created_at timestamp NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS orders (
  id serial PRIMARY KEY,
  ref text NOT NULL UNIQUE,
  customer_name text NOT NULL,
  phone text NOT NULL,
  city text NOT NULL,
  address text NOT NULL,
  note text NOT NULL DEFAULT '',
  items jsonb NOT NULL,
  subtotal integer NOT NULL,
  shipping integer NOT NULL,
  total integer NOT NULL,
  status text NOT NULL DEFAULT 'pending',
  created_at timestamp NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS settings (
  key text PRIMARY KEY,
  value text NOT NULL
);
`;

async function runSetup() {
  const steps: string[] = [];

  await pool.query(DDL);
  steps.push("✓ تم إنشاء الجداول (products, orders, settings)");

  const [{ count }] = await db
    .select({ count: sql<number>`count(*)::int` })
    .from(products);

  if (count === 0) {
    await db.insert(products).values(SEED_PRODUCTS);
    steps.push(`✓ تمت إضافة ${SEED_PRODUCTS.length} منتجاً`);
  } else {
    steps.push(`• المنتجات موجودة مسبقاً (${count}) — لم يتم تغييرها`);
  }

  let added = 0;
  for (const [key, value] of Object.entries(SEED_SETTINGS)) {
    const res = await db
      .insert(settings)
      .values({ key, value })
      .onConflictDoNothing()
      .returning();
    if (res.length > 0) added++;
  }
  steps.push(
    added > 0
      ? `✓ تمت تهيئة ${added} إعداداً افتراضياً`
      : "• الإعدادات موجودة مسبقاً"
  );

  return steps;
}

function authorized(req: Request): boolean {
  const token = process.env.SETUP_TOKEN;
  if (!token) return true; // لم يُضبط رمز: مسموح (للتهيئة الأولى)
  const url = new URL(req.url);
  return url.searchParams.get("token") === token;
}

export async function GET(req: Request) {
  if (!authorized(req)) {
    return new Response("Unauthorized — أضف ?token=...", { status: 401 });
  }

  try {
    const steps = await runSetup();
    const html = `<!DOCTYPE html><html lang="ar" dir="rtl"><head><meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1"><title>تهيئة المتجر</title>
<style>body{font-family:system-ui,sans-serif;background:#0e1726;color:#f5f2ea;display:grid;place-items:center;min-height:100vh;margin:0;padding:20px}
.c{background:rgba(255,255,255,.06);border:1px solid rgba(255,255,255,.12);border-radius:16px;padding:34px;max-width:520px;width:100%}
h1{margin:0 0 6px;font-size:26px}p{color:rgba(245,242,234,.6);margin:0 0 20px;font-size:14px}
li{padding:9px 0;border-top:1px solid rgba(255,255,255,.08);font-size:14px;font-weight:600;list-style:none}
a{display:inline-block;margin-top:22px;background:#ffb524;color:#0e1726;text-decoration:none;padding:13px 26px;border-radius:10px;font-weight:800}</style>
</head><body><div class="c"><h1>✅ تمت تهيئة المتجر</h1>
<p>قاعدة البيانات جاهزة والمنتجات مضافة.</p><ul>${steps
          .map((s) => `<li>${s}</li>`)
          .join("")}</ul>
<a href="/">فتح المتجر ←</a></div></body></html>`;
    return new Response(html, {
      headers: { "Content-Type": "text/html; charset=utf-8" },
    });
  } catch (e) {
    const msg = e instanceof Error ? e.message : "خطأ غير معروف";
    return new Response(
      `<!DOCTYPE html><html lang="ar" dir="rtl"><head><meta charset="utf-8"><title>خطأ</title></head>
<body style="font-family:system-ui;background:#0e1726;color:#f5f2ea;padding:40px">
<h1>❌ فشلت التهيئة</h1><pre style="background:rgba(255,255,255,.08);padding:16px;border-radius:10px;white-space:pre-wrap;direction:ltr">${msg}</pre>
<p>تأكد أن متغير <b>DATABASE_URL</b> صحيح في إعدادات Vercel.</p></body></html>`,
      { status: 500, headers: { "Content-Type": "text/html; charset=utf-8" } }
    );
  }
}

export async function POST(req: Request) {
  if (!authorized(req)) {
    return NextResponse.json({ error: "غير مصرح" }, { status: 401 });
  }
  try {
    const steps = await runSetup();
    return NextResponse.json({ ok: true, steps });
  } catch (e) {
    return NextResponse.json(
      { error: e instanceof Error ? e.message : "خطأ" },
      { status: 500 }
    );
  }
}
