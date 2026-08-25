import { NextResponse } from "next/server";
import { desc } from "drizzle-orm";
import { db } from "@/db";
import { products } from "@/db/schema";
import { CORS_HEADERS, corsPreflight } from "@/lib/cors";

export async function OPTIONS() {
  return corsPreflight();
}

export async function GET() {
  const all = await db.select().from(products).orderBy(desc(products.id));
  return NextResponse.json(all, { headers: CORS_HEADERS });
}

export async function POST(req: Request) {
  const body = await req.json().catch(() => ({}));
  const name = String(body?.name ?? "").trim();
  const price = Math.round(Number(body?.price));
  const image = String(body?.image ?? "").trim();

  if (!name || !Number.isFinite(price) || price <= 0 || !image) {
    return NextResponse.json(
      { error: "الاسم والثمن والصورة مطلوبة" },
      { status: 400, headers: CORS_HEADERS }
    );
  }

  const oldPriceRaw =
    body?.oldPrice === null || body?.oldPrice === "" || body?.oldPrice === undefined
      ? null
      : Math.round(Number(body.oldPrice));

  const [created] = await db
    .insert(products)
    .values({
      name,
      description: String(body?.description ?? "").trim(),
      price,
      oldPrice: oldPriceRaw && oldPriceRaw > price ? oldPriceRaw : null,
      image,
      category: String(body?.category ?? "المطبخ").trim() || "المطبخ",
      stock: Math.max(0, Math.floor(Number(body?.stock) || 0)),
      featured: Boolean(body?.featured),
      active: body?.active === undefined ? true : Boolean(body?.active),
    })
    .returning();

  return NextResponse.json(created, { headers: CORS_HEADERS });
}
