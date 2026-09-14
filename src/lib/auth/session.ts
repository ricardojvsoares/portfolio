import { SignJWT, jwtVerify } from "jose";
import { cookies } from "next/headers";

export const SESSION_COOKIE = "portfolio_session";
const SESSION_TTL_SEC = 60 * 60 * 24 * 7;

export type SessionPayload = {
  sid: string;
  name: string;
};

function secretKey() {
  const secret = process.env.SESSION_SECRET;
  if (!secret || secret.length < 32) return null;
  return new TextEncoder().encode(secret);
}

export function isSessionConfigured() {
  return Boolean(secretKey());
}

export async function signSession(payload: SessionPayload): Promise<string | null> {
  const key = secretKey();
  if (!key) return null;
  return new SignJWT({ name: payload.name })
    .setProtectedHeader({ alg: "HS256" })
    .setSubject(payload.sid)
    .setIssuedAt()
    .setExpirationTime(`${SESSION_TTL_SEC}s`)
    .sign(key);
}

export async function verifySessionToken(
  token: string
): Promise<SessionPayload | null> {
  const key = secretKey();
  if (!key) return null;
  try {
    const { payload } = await jwtVerify(token, key);
    const sid = typeof payload.sub === "string" ? payload.sub : null;
    const name = typeof payload.name === "string" ? payload.name : null;
    if (!sid || !name) return null;
    return { sid, name };
  } catch {
    return null;
  }
}

export async function readSession(): Promise<SessionPayload | null> {
  const jar = await cookies();
  const token = jar.get(SESSION_COOKIE)?.value;
  if (!token) return null;
  return verifySessionToken(token);
}

export function sessionCookieOptions(maxAge = SESSION_TTL_SEC) {
  return {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax" as const,
    path: "/",
    maxAge,
  };
}

export { SESSION_TTL_SEC };
