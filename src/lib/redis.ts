import { Redis } from "@upstash/redis";

/**
 * Persistent rate limiting for the contact endpoint.
 *
 * The in-process `Map` alone is weak on serverless: every cold start (or
 * parallel instance) begins with an empty map, so a sweep across
 * instances slips through. When Upstash Redis credentials are configured
 * (`UPSTASH_REDIS_REST_URL` + `UPSTASH_REDIS_REST_TOKEN`) the send
 * timestamps live in Redis and every instance shares the same window;
 * without them the module degrades to the original in-memory behavior.
 *
 * Keys are SHA-256 hashed before they touch Redis — raw sender emails and
 * IP addresses never land in the store.
 */

/** Rolling window before the same email/IP may send again (ms). */
export const RATE_LIMIT_MS = 24 * 60 * 60 * 1000;

const RATE_LIMIT_TTL_SECONDS = Math.floor(RATE_LIMIT_MS / 1000);

/** Key prefix inside Redis. */
const REDIS_KEY_PREFIX = "contact:rl:";

/** Redis client — null when credentials are not configured. */
function getRedis(): Redis | null {
  const url = process.env.UPSTASH_REDIS_REST_URL;
  const token = process.env.UPSTASH_REDIS_REST_TOKEN;
  if (!url || !token) return null;
  try {
    return new Redis({ url, token });
  } catch {
    return null;
  }
}

/** SHA-256 hex digest of a rate-limit key (Web Crypto, Node 18+). */
async function hashKey(key: string): Promise<string> {
  const bytes = new TextEncoder().encode(key);
  const digest = await crypto.subtle.digest("SHA-256", bytes);
  return Array.from(new Uint8Array(digest))
    .map((byte) => byte.toString(16).padStart(2, "0"))
    .join("");
}

// ---------------------------------------------------------------------------
// In-memory fallback (also the only store without Redis credentials).
// ---------------------------------------------------------------------------

const lastSentAt = new Map<string, number>();

/** Prune entries older than the window so the map never grows unbounded. */
function pruneMemoryLimits(now: number): void {
  for (const [key, sentAt] of lastSentAt) {
    if (now - sentAt >= RATE_LIMIT_MS) lastSentAt.delete(key);
  }
}

/** Earliest remaining wait among the in-memory keys, or null. */
function memoryWaitMs(keys: string[], now: number): number | null {
  let wait: number | null = null;
  for (const key of keys) {
    const sentAt = lastSentAt.get(key);
    if (!sentAt) continue;
    const remaining = RATE_LIMIT_MS - (now - sentAt);
    if (remaining > 0 && (wait === null || remaining > wait)) wait = remaining;
  }
  return wait;
}

// ---------------------------------------------------------------------------
// Public API.
// ---------------------------------------------------------------------------

export interface RateLimitResult {
  /** True when any key already sent within the window. */
  limited: boolean;
  /** Milliseconds until the strictest window expires (null when not limited). */
  retryAfterMs: number | null;
}

/**
 * Check every key (sender email + client IP) across both stores. Redis
 * errors never fail the request — the in-memory store still applies and
 * a degraded Redis simply fails open for that one request.
 */
export async function checkRateLimits(
  keys: string[],
  now = Date.now(),
): Promise<RateLimitResult> {
  pruneMemoryLimits(now);

  let wait = memoryWaitMs(keys, now);

  const redis = getRedis();
  if (redis) {
    try {
      const hashed = await Promise.all(keys.map((key) => hashKey(key)));
      const rows = await redis.mget<(string | null)[]>(
        ...hashed.map((hash) => `${REDIS_KEY_PREFIX}${hash}`),
      );
      rows.forEach((sentAt) => {
        if (sentAt === null || sentAt === undefined) return;
        const remaining = RATE_LIMIT_MS - (now - Number(sentAt));
        if (remaining > 0 && (wait === null || remaining > wait)) wait = remaining;
      });
    } catch (error) {
      console.warn("[rate-limit] Redis check failed, falling back:", error);
    }
  }

  return { limited: wait !== null, retryAfterMs: wait };
}

/** Record a successful send for every key in both stores. */
export async function recordRateLimits(
  keys: string[],
  now = Date.now(),
): Promise<void> {
  for (const key of keys) {
    lastSentAt.set(key, now);
  }

  const redis = getRedis();
  if (!redis) return;
  try {
    const hashed = await Promise.all(keys.map((key) => hashKey(key)));
    await Promise.all(
      hashed.map((hash) =>
        redis.set(`${REDIS_KEY_PREFIX}${hash}`, String(now), {
          ex: RATE_LIMIT_TTL_SECONDS,
        }),
      ),
    );
  } catch (error) {
    console.warn("[rate-limit] Redis record failed:", error);
  }
}
