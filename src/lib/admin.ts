import { eq } from "drizzle-orm";
import { db } from "@/db";
import { settings } from "@/db/schema";

export async function getSetting(key: string, fallback = ""): Promise<string> {
  const rows = await db
    .select()
    .from(settings)
    .where(eq(settings.key, key))
    .limit(1);
  return rows[0]?.value ?? fallback;
}

export async function setSetting(key: string, value: string): Promise<void> {
  await db
    .insert(settings)
    .values({ key, value })
    .onConflictDoUpdate({ target: settings.key, set: { value } });
}
