import { desc, eq } from "drizzle-orm";
import { cookies } from "next/headers";

import { getDb } from "@/db";
import { guestbookEntries, sessions } from "@/db/schema";
import { clientIp, hashIp } from "@/lib/api/ip";
import { withMetrics } from "@/lib/api/metrics";
import { rateLimit } from "@/lib/api/rate-limit";
import { fromZodError, jsonError, jsonOk } from "@/lib/api/response";
import { guestbookSchema } from "@/lib/api/schemas";
import { readSession } from "@/lib/auth/session";

export const runtime = "nodejs";

export async function GET() {
  return withMetrics("/api/guestbook", "GET", async () => {
    const db = getDb();
    if (!db) return jsonError(503, "Database not configured");

    try {
      const entries = await db
        .select({
          id: guestbookEntries.id,
          displayName: guestbookEntries.displayName,
          body: guestbookEntries.body,
          createdAt: guestbookEntries.createdAt,
        })
        .from(guestbookEntries)
        .orderBy(desc(guestbookEntries.createdAt))
        .limit(40);

      return jsonOk({ entries });
    } catch {
      return jsonError(503, "Guestbook unavailable");
    }
  });
}

export async function POST(request: Request) {
  return withMetrics("/api/guestbook", "POST", async () => {
    const session = await readSession();
    if (!session) {
      return jsonError(401, "Sign in to leave a note");
    }

    const ip = clientIp(request);
    const limited = rateLimit(`guestbook:${hashIp(ip)}`, 10, 60_000);
    if (!limited.ok) {
      return jsonError(429, "Too many requests. Try again shortly.");
    }

    let json: unknown;
    try {
      json = await request.json();
    } catch {
      return jsonError(400, "Invalid JSON body");
    }

    const parsed = guestbookSchema.safeParse(json);
    if (!parsed.success) return fromZodError(parsed.error);

    const db = getDb();
    if (!db) return jsonError(503, "Database not configured");

    try {
      const [existing] = await db
        .select({ id: sessions.id, expiresAt: sessions.expiresAt })
        .from(sessions)
        .where(eq(sessions.id, session.sid))
        .limit(1);

      if (!existing || existing.expiresAt.getTime() < Date.now()) {
        const jar = await cookies();
        jar.delete("portfolio_session");
        return jsonError(401, "Session expired. Sign in again.");
      }

      const [row] = await db
        .insert(guestbookEntries)
        .values({
          displayName: session.name,
          body: parsed.data.body,
          sessionId: session.sid,
        })
        .returning({
          id: guestbookEntries.id,
          displayName: guestbookEntries.displayName,
          body: guestbookEntries.body,
          createdAt: guestbookEntries.createdAt,
        });

      return jsonOk({ entry: row }, { status: 201 });
    } catch {
      return jsonError(503, "Could not save entry");
    }
  });
}
