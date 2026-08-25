```ts
import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";

const databaseUrl = process.env.DATABASE_URL;

const isLocal =
  databaseUrl?.includes("localhost") ||
  databaseUrl?.includes("127.0.0.1") ||
  databaseUrl?.includes("0.0.0.0");

const globalForDb = globalThis as typeof globalThis & {
  __arenaNextJsPostgresqlPool?: Pool;
};

export const pool =
  globalForDb.__arenaNextJsPostgresqlPool ??
  new Pool({
    connectionString:
      databaseUrl ||
      "postgresql://postgres:postgres@localhost:5432/postgres",
    ssl: isLocal || !databaseUrl
      ? undefined
      : { rejectUnauthorized: false },
    max: isLocal ? 10 : 3,
    idleTimeoutMillis: 15_000,
    connectionTimeoutMillis: 15_000,
  });

if (process.env.NODE_ENV !== "production") {
  globalForDb.__arenaNextJsPostgresqlPool = pool;
}

export const db = drizzle(pool);
```
