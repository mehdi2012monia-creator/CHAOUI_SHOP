import { NextResponse } from "next/server";
import { eq } from "drizzle-orm";
import { db } from "@/db";
import { ORDER_STATUSES, orders } from "@/db/schema";
import { CORS_HEADERS, corsPreflight } from "@/lib/cors";

type Params = { params: Promise<{ id: string }> };

export async function OPTIONS() {
  return corsPreflight();
}

export async function PATCH(req: Request, { params }: Params) {
  const { id } = await params;
  const oid = Number(id);
  const body = await req.json().catch(() => ({}));
  const status = String(body?.status ?? "");

  if (!ORDER_STATUSES.includes(status as (typeof ORDER_STATUSES)[number])) {
    return NextResponse.json(
      { error: "حالة غير صالحة" },
      { status: 400, headers: CORS_HEADERS }
    );
  }

  const [updated] = await db
    .update(orders)
    .set({ status })
    .where(eq(orders.id, oid))
    .returning();

  if (!updated) {
    return NextResponse.json(
      { error: "الطلب غير موجود" },
      { status: 404, headers: CORS_HEADERS }
    );
  }
  return NextResponse.json(updated, { headers: CORS_HEADERS });
}
