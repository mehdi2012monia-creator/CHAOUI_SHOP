import { NextResponse } from "next/server";
import { eq } from "drizzle-orm";
import { db } from "@/db";
import { products } from "@/db/schema";
import { CORS_HEADERS, corsPreflight } from "@/lib/cors";

type Params = { params: Promise<{ id: string }> };

export async function OPTIONS() {
  return corsPreflight();
}

export async function PATCH(req: Request, { params }: Params) {
  const { id } = await params;
  const pid = Number(id);
  if (!Number.isFinite(pid)) {
    return NextResponse.json(
      { error: "معرف غير صالح" },
      { status: 400, headers: CORS_HEADERS }
    );
  }

  const body = await req.json().catch(() => ({}));
  const patch: Record<string, unknown> = {};

  if (body.name !== undefined) patch.name = String(body.name).trim();
  if (body.description !== undefined)
    patch.description = String(body.description).trim();
  if (body.price !== undefined) {
    const price = Math.round(Number(body.price));
    if (!Number.isFinite(price) || price <= 0)
      return NextResponse.json(
        { error: "ثمن غير صالح" },
        { status: 400, headers: CORS_HEADERS }
      );
    patch.price = price;
  }
  if (body.oldPrice !== undefined) {
    patch.oldPrice =
      body.oldPrice === null || body.oldPrice === ""
        ? null
        : Math.round(Number(body.oldPrice));
  }
  if (body.image !== undefined) patch.image = String(body.image).trim();
  if (body.category !== undefined) patch.category = String(body.category).trim();
  if (body.stock !== undefined)
    patch.stock = Math.max(0, Math.floor(Number(body.stock) || 0));
  if (body.featured !== undefined) patch.featured = Boolean(body.featured);
  if (body.active !== undefined) patch.active = Boolean(body.active);

  const [updated] = await db
    .update(products)
    .set(patch)
    .where(eq(products.id, pid))
    .returning();

  if (!updated) {
    return NextResponse.json(
      { error: "المنتج غير موجود" },
      { status: 404, headers: CORS_HEADERS }
    );
  }
  return NextResponse.json(updated, { headers: CORS_HEADERS });
}

export async function DELETE(_req: Request, { params }: Params) {
  const { id } = await params;
  const pid = Number(id);
  await db.delete(products).where(eq(products.id, pid));
  return NextResponse.json({ ok: true }, { headers: CORS_HEADERS });
}
