import { getDb } from "@/db";
import { requestMetrics } from "@/db/schema";

const startedAt = Date.now();

export function processUptimeSec() {
  return Math.floor((Date.now() - startedAt) / 1000);
}

/** Best-effort metric insert; never throws into the request path. */
export async function recordMetric(input: {
  route: string;
  method: string;
  status: number;
  latencyMs: number;
}) {
  try {
    const db = getDb();
    if (!db) return;
    await db.insert(requestMetrics).values({
      route: input.route,
      method: input.method,
      status: input.status,
      latencyMs: Math.max(0, Math.round(input.latencyMs)),
    });
  } catch {
    // Swallow — metrics must not break demos.
  }
}

export async function withMetrics<T extends Response>(
  route: string,
  method: string,
  handler: () => Promise<T>
): Promise<T> {
  const started = Date.now();
  const response = await handler();
  void recordMetric({
    route,
    method,
    status: response.status,
    latencyMs: Date.now() - started,
  });
  return response;
}
