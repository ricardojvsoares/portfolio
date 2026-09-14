import { clientIp, hashIp } from "@/lib/api/ip";
import { withMetrics } from "@/lib/api/metrics";
import { rateLimit } from "@/lib/api/rate-limit";
import { fromZodError, jsonError, jsonOk } from "@/lib/api/response";
import { echoSchema } from "@/lib/api/schemas";

export const runtime = "nodejs";

export async function GET(request: Request) {
  return withMetrics("/api/playground/echo", "GET", async () => {
    const ip = clientIp(request);
    const limited = rateLimit(`echo:${hashIp(ip)}`, 30, 60_000);
    if (!limited.ok) {
      return jsonError(429, "Too many requests. Try again shortly.");
    }

    const url = new URL(request.url);
    const message = url.searchParams.get("message") ?? "pong";

    return jsonOk({
      echo: message,
      method: "GET",
      receivedAt: new Date().toISOString(),
    });
  });
}

export async function POST(request: Request) {
  return withMetrics("/api/playground/echo", "POST", async () => {
    const ip = clientIp(request);
    const limited = rateLimit(`echo:${hashIp(ip)}`, 30, 60_000);
    if (!limited.ok) {
      return jsonError(429, "Too many requests. Try again shortly.");
    }

    let json: unknown = {};
    try {
      const text = await request.text();
      if (text) json = JSON.parse(text);
    } catch {
      return jsonError(400, "Invalid JSON body");
    }

    const parsed = echoSchema.safeParse(json);
    if (!parsed.success) return fromZodError(parsed.error);

    return jsonOk({
      echo: parsed.data.message ?? "pong",
      method: "POST",
      receivedAt: new Date().toISOString(),
    });
  });
}
