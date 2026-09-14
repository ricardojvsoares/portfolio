import { sql } from "drizzle-orm";

import { getDb, isDbConfigured } from "@/db";
import { processUptimeSec, withMetrics } from "@/lib/api/metrics";
import { jsonOk } from "@/lib/api/response";

export const runtime = "nodejs";

const version = "1.0.0";

export async function GET() {
  return withMetrics("/api/status", "GET", async () => {
    const started = Date.now();
    let db: "up" | "down" | "unconfigured" = "unconfigured";

    if (!isDbConfigured()) {
      db = "unconfigured";
    } else {
      try {
        const client = getDb();
        if (!client) {
          db = "unconfigured";
        } else {
          await client.execute(sql`select 1`);
          db = "up";
        }
      } catch {
        db = "down";
      }
    }

    return jsonOk({
      ok: db === "up" || db === "unconfigured",
      uptimeSec: processUptimeSec(),
      db,
      latencyMs: Date.now() - started,
      version,
    });
  });
}
