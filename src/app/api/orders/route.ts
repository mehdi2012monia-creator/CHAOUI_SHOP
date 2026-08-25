import { NextResponse } from "next/server";
import { inArray, eq, sql } from "drizzle-orm";
import { db } from "@/db";
import { orders, products, type OrderItem } from "@/db/schema";
import { getSetting } from "@/lib/admin";

/** السماح للنسخة HTML المستضافة في Google Sites بإرسال الطلبات */
const CORS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type",
};

export async function OPTIONS() {
  return new Response(null, { status: 204, headers: CORS });
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const customer = body?.customer ?? {};
    const items: { productId: number; qty: number }[] = Array.isArray(
      body?.items
    )
      ? body.items
      : [];

    const name = String(customer.name ?? "").trim();
    const phone = String(customer.phone ?? "").trim();
    const city = String(customer.city ?? "").trim();
    const address = String(customer.address ?? "").trim();
    const note = String(customer.note ?? "").trim();

    const bad = (error: string, status: number) =>
      NextResponse.json({ error }, { status, headers: CORS });

    if (name.length < 3) return bad("الاسم الكامل مطلوب", 400);
    if (!/^0[5-7]\d{8}$/.test(phone)) return bad("رقم الهاتف غير صحيح", 400);
    if (!city) return bad("المدينة مطلوبة", 400);
    if (address.length < 6) return bad("العنوان مطلوب", 400);
    if (items.length === 0) return bad("السلة فارغة", 400);

    const ids = items
      .map((i) => Number(i.productId))
      .filter((n) => Number.isFinite(n));
    const found = await db
      .select()
      .from(products)
      .where(inArray(products.id, ids));

    const snapshot: OrderItem[] = [];
    for (const line of items) {
      const qty = Math.max(1, Math.floor(Number(line.qty) || 1));
      const p = found.find((x) => x.id === Number(line.productId));
      if (!p || !p.active) return bad("أحد المنتجات لم يعد متوفراً", 409);
      if (p.stock < qty)
        return bad(`الكمية المطلوبة من «${p.name}» غير متوفرة`, 409);
      snapshot.push({
        productId: p.id,
        name: p.name,
        price: p.price,
        qty,
        image: p.image,
      });
    }

    const subtotal = snapshot.reduce((s, i) => s + i.price * i.qty, 0);
    const fee = Number(await getSetting("shipping_fee", "35")) || 0;
    const threshold =
      Number(await getSetting("free_shipping_threshold", "500")) || 0;
    const shipping = subtotal >= threshold ? 0 : fee;
    const total = subtotal + shipping;

    const ref = `MH-${Date.now().toString(36).toUpperCase()}${Math.floor(
      Math.random() * 36
    )
      .toString(36)
      .toUpperCase()}`;

    const [order] = await db
      .insert(orders)
      .values({
        ref,
        customerName: name,
        phone,
        city,
        address,
        note,
        items: snapshot,
        subtotal,
        shipping,
        total,
        status: "pending",
      })
      .returning();

    for (const line of snapshot) {
      await db
        .update(products)
        .set({ stock: sql`${products.stock} - ${line.qty}` })
        .where(eq(products.id, line.productId));
    }

    return NextResponse.json(
      { ok: true, ref: order.ref, total: order.total },
      { headers: CORS }
    );
  } catch (e) {
    console.error("create order failed", e);
    return NextResponse.json(
      { error: "وقع مشكل أثناء تسجيل الطلب، عاود المحاولة" },
      { status: 500, headers: CORS }
    );
  }
}
