import { eq } from "drizzle-orm";
import { cookies } from "next/headers";

import { getDb } from "@/db";
import { sessions } from "@/db/schema";
import { clientIp, hashIp } from "@/lib/api/ip";
import { withMetrics } from "@/lib/api/metrics";
import { rateLimit } from "@/lib/api/rate-limit";
import { fromZodError, jsonError, jsonOk } from "@/lib/api/response";
import { sessionSchema } from "@/lib/api/schemas";
import {
  SESSION_COOKIE,
  SESSION_TTL_SEC,
  isSessionConfigured,
  readSession,
  sessionCookieOptions,
  signSession,
} from "@/lib/auth/session";

export const runtime = "nodejs";

export async function GET() {
  return withMetrics("/api/auth/session", "GET", async () => {
    const session = await readSession();
    if (!session) return jsonOk({ authenticated: false });
    return jsonOk({
      authenticated: true,
      displayName: session.name,
      sid: session.sid,
    });
  });
}

export async function POST(request: Request) {
  return withMetrics("/api/auth/session", "POST", async () => {
    if (!isSessionConfigured()) {
      return jsonError(503, "SESSION_SECRET not configured");
    }

    const ip = clientIp(request);
    const limited = rateLimit(`auth:${hashIp(ip)}`, 20, 60_000);
    if (!limited.ok) {
      return jsonError(429, "Too many requests. Try again shortly.");
    }

    let json: unknown;
    try {
      json = await request.json();
    } catch {
      return jsonError(400, "Invalid JSON body");
    }

    const parsed = sessionSchema.safeParse(json);
    if (!parsed.success) return fromZodError(parsed.error);

    const db = getDb();
    if (!db) return jsonError(503, "Database not configured");

    const expiresAt = new Date(Date.now() + SESSION_TTL_SEC * 1000);

    try {
      const [row] = await db
        .insert(sessions)
        .values({
          displayName: parsed.data.displayName,
          expiresAt,
        })
        .returning({ id: sessions.id, displayName: sessions.displayName });

      if (!row) return jsonError(500, "Could not create session");

      const token = await signSession({
        sid: row.id,
        name: row.displayName,
      });
      if (!token) return jsonError(503, "SESSION_SECRET not configured");

      const jar = await cookies();
      jar.set(SESSION_COOKIE, token, sessionCookieOptions());

      return jsonOk(
        { authenticated: true, displayName: row.displayName },
        { status: 201 }
      );
    } catch {
      return jsonError(503, "Could not create session");
    }
  });
}

export async function DELETE() {
  return withMetrics("/api/auth/session", "DELETE", async () => {
    const session = await readSession();
    const jar = await cookies();
    jar.set(SESSION_COOKIE, "", sessionCookieOptions(0));

    if (session) {
      const db = getDb();
      if (db) {
        try {
          await db.delete(sessions).where(eq(sessions.id, session.sid));
        } catch {
          // ignore
        }
      }
    }

    return jsonOk({ authenticated: false });
  });
}
