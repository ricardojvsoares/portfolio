import { desc } from "drizzle-orm";

import { getDb } from "@/db";
import { contactMessages } from "@/db/schema";
import { clientIp, hashIp } from "@/lib/api/ip";
import { withMetrics } from "@/lib/api/metrics";
import { rateLimit } from "@/lib/api/rate-limit";
import { fromZodError, jsonError, jsonOk } from "@/lib/api/response";
import { contactSchema } from "@/lib/api/schemas";

export const runtime = "nodejs";

export async function POST(request: Request) {
  return withMetrics("/api/contact", "POST", async () => {
    const ip = clientIp(request);
    const limited = rateLimit(`contact:${hashIp(ip)}`, 5, 60_000);
    if (!limited.ok) {
      return jsonError(429, "Too many requests. Try again shortly.");
    }

    let json: unknown;
    try {
      json = await request.json();
    } catch {
      return jsonError(400, "Invalid JSON body");
    }

    const parsed = contactSchema.safeParse(json);
    if (!parsed.success) return fromZodError(parsed.error);

    const db = getDb();
    if (!db) return jsonError(503, "Database not configured");

    try {
      const [row] = await db
        .insert(contactMessages)
        .values({
          name: parsed.data.name,
          email: parsed.data.email,
          message: parsed.data.message,
          ipHash: hashIp(ip),
        })
        .returning({ id: contactMessages.id, createdAt: contactMessages.createdAt });

      return jsonOk({ id: row?.id, createdAt: row?.createdAt }, { status: 201 });
    } catch {
      return jsonError(503, "Could not save message");
    }
  });
}

export async function GET() {
  return withMetrics("/api/contact", "GET", async () => {
    const db = getDb();
    if (!db) return jsonError(503, "Database not configured");

    try {
      const rows = await db
        .select({
          id: contactMessages.id,
          createdAt: contactMessages.createdAt,
        })
        .from(contactMessages)
        .orderBy(desc(contactMessages.createdAt))
        .limit(1);

      return jsonOk({ countHint: rows.length > 0 ? "has_messages" : "empty" });
    } catch {
      return jsonError(503, "Contact store unavailable");
    }
  });
}
