import { desc } from "drizzle-orm";

import { getDb } from "@/db";
import { requestMetrics } from "@/db/schema";
import { processUptimeSec, withMetrics } from "@/lib/api/metrics";
import { jsonError, jsonOk } from "@/lib/api/response";

export const runtime = "nodejs";

function percentile(sorted: number[], p: number) {
  if (sorted.length === 0) return 0;
  const idx = Math.min(
    sorted.length - 1,
    Math.max(0, Math.ceil((p / 100) * sorted.length) - 1)
  );
  return sorted[idx] ?? 0;
}

export async function GET() {
  return withMetrics("/api/metrics", "GET", async () => {
    const db = getDb();
    if (!db) {
      return jsonError(503, "Database not configured");
    }

    try {
      const rows = await db
        .select({
          latencyMs: requestMetrics.latencyMs,
          status: requestMetrics.status,
          route: requestMetrics.route,
        })
        .from(requestMetrics)
        .orderBy(desc(requestMetrics.createdAt))
        .limit(500);

      const latencies = rows
        .map((row) => row.latencyMs)
        .sort((a, b) => a - b);

      const byRoute = new Map<string, number>();
      for (const row of rows) {
        byRoute.set(row.route, (byRoute.get(row.route) ?? 0) + 1);
      }

      return jsonOk({
        uptimeSec: processUptimeSec(),
        count: rows.length,
        p50: percentile(latencies, 50),
        p95: percentile(latencies, 95),
        routes: [...byRoute.entries()]
          .map(([route, count]) => ({ route, count }))
          .sort((a, b) => b.count - a.count)
          .slice(0, 8),
      });
    } catch {
      return jsonError(503, "Metrics query failed");
    }
  });
}
