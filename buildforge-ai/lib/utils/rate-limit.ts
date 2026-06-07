/**
 * Rate limiting utilities (in-memory)
 */

interface RateLimitEntry {
  count: number;
  resetAt: number;
}

const memoryStore = new Map<string, RateLimitEntry>();

export interface RateLimitOptions {
  key: string;
  limit: number;
  windowMs: number;
}

export async function rateLimit({ key, limit, windowMs }: RateLimitOptions) {
  const now = Date.now();
  const entry = memoryStore.get(key);
  if (!entry || entry.resetAt < now) {
    memoryStore.set(key, { count: 1, resetAt: now + windowMs });
    return { success: true, remaining: limit - 1, resetAt: now + windowMs };
  }
  entry.count += 1;
  return {
    success: entry.count <= limit,
    remaining: Math.max(0, limit - entry.count),
    resetAt: entry.resetAt,
  };
}
