type Bucket = { timestamps: number[] };

const buckets = new Map<string, Bucket>();

/**
 * In-memory sliding-window rate limit.
 * Note: on Vercel, each instance has its own memory — fine for demos, not multi-region hard limits.
 */
export function rateLimit(key: string, limit: number, windowMs: number) {
  const now = Date.now();
  const bucket = buckets.get(key) ?? { timestamps: [] };
  bucket.timestamps = bucket.timestamps.filter((ts) => now - ts < windowMs);

  if (bucket.timestamps.length >= limit) {
    buckets.set(key, bucket);
    const retryAfterMs = windowMs - (now - bucket.timestamps[0]!);
    return { ok: false as const, retryAfterMs };
  }

  bucket.timestamps.push(now);
  buckets.set(key, bucket);
  return { ok: true as const };
}
