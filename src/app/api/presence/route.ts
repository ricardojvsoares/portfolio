import { visitorCount } from "@/lib/presence/store";
import { withMetrics } from "@/lib/api/metrics";
import { jsonOk } from "@/lib/api/response";

export const runtime = "nodejs";

export async function GET() {
  return withMetrics("/api/presence", "GET", async () => {
    return jsonOk({ count: visitorCount() });
  });
}
