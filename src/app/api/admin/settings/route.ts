import { NextResponse } from "next/server";
import { db } from "@/db";
import { settings } from "@/db/schema";
import { setSetting } from "@/lib/admin";
import { CORS_HEADERS, corsPreflight } from "@/lib/cors";

const ALLOWED = [
  "shipping_fee",
  "free_shipping_threshold",
  "categories",
  "store_phone",
  "store_whatsapp",
  "site_url",
  "site_url_enabled",
  "google_verification",
  "google_html_file",
];

export async function OPTIONS() {
  return corsPreflight();
}

export async function GET() {
  const rows = await db.select().from(settings);
  const map: Record<string, string> = {};
  for (const r of rows) {
    if (r.key !== "admin_secret" && r.key !== "admin_password") {
      map[r.key] = r.value;
    }
  }
  return NextResponse.json(map, { headers: CORS_HEADERS });
}

export async function POST(req: Request) {
  const body = await req.json().catch(() => ({}));

  if (body?.settings && typeof body.settings === "object") {
    for (const [key, value] of Object.entries(
      body.settings as Record<string, unknown>
    )) {
      if (ALLOWED.includes(key)) {
        await setSetting(key, String(value));
      }
    }
  }

  return NextResponse.json({ ok: true }, { headers: CORS_HEADERS });
}
