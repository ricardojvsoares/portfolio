import { drizzle, type PostgresJsDatabase } from "drizzle-orm/postgres-js";
import postgres from "postgres";

import * as schema from "@/db/schema";

export type Database = PostgresJsDatabase<typeof schema>;

let cached: Database | null = null;
let client: ReturnType<typeof postgres> | null = null;

function withSsl(url: string): string {
  if (url.includes("sslmode=")) return url;
  return `${url}${url.includes("?") ? "&" : "?"}sslmode=require`;
}

/** Returns a Drizzle client, or null when DATABASE_URL is missing. */
export function getDb(): Database | null {
  const url = process.env.DATABASE_URL;
  if (!url) return null;
  if (cached) return cached;

  // prepare: false plays nicer with PgBouncer / Supabase pooler.
  client = postgres(withSsl(url), { prepare: false, max: 1 });
  cached = drizzle(client, { schema });
  return cached;
}

export function isDbConfigured(): boolean {
  return Boolean(process.env.DATABASE_URL);
}
