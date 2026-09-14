import { createHash } from "node:crypto";

export function hashIp(ip: string | null | undefined): string {
  const value = ip?.trim() || "unknown";
  return createHash("sha256").update(value).digest("hex");
}

export function clientIp(request: Request): string | null {
  const forwarded = request.headers.get("x-forwarded-for");
  if (forwarded) {
    const first = forwarded.split(",")[0]?.trim();
    if (first) return first;
  }
  return request.headers.get("x-real-ip");
}
