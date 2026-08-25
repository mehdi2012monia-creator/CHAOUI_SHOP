import { NextResponse } from "next/server";
import { desc } from "drizzle-orm";
import { db } from "@/db";
import { orders } from "@/db/schema";
import { CORS_HEADERS, corsPreflight } from "@/lib/cors";

export async function OPTIONS() {
  return corsPreflight();
}

export async function GET() {
  const all = await db.select().from(orders).orderBy(desc(orders.id));
  return NextResponse.json(all, { headers: CORS_HEADERS });
}
