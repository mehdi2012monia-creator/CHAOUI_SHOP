import "dotenv/config";
import { eq, sql } from "drizzle-orm";
import { db } from "./index";
import { products, settings } from "./schema";
import { SEED_PRODUCTS, SEED_SETTINGS } from "./seed-data";

async function main() {
  const [{ count }] = await db
    .select({ count: sql<number>`count(*)::int` })
    .from(products);

  if (count === 0) {
    await db.insert(products).values(SEED_PRODUCTS);
    console.log(`✓ Seeded ${SEED_PRODUCTS.length} products`);
  } else {
    console.log(`• Products already exist (${count}), skipping`);
  }

  for (const [key, value] of Object.entries(SEED_SETTINGS)) {
    const existing = await db
      .select()
      .from(settings)
      .where(eq(settings.key, key))
      .limit(1);
    if (existing.length === 0) {
      await db.insert(settings).values({ key, value });
      console.log(`✓ Setting ${key} = ${value}`);
    }
  }
  console.log("✓ Seed complete");
}

main()
  .then(() => process.exit(0))
  .catch((e) => {
    console.error(e);
    process.exit(1);
  });
