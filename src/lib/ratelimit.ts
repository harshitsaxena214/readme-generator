import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";

let ratelimit: Ratelimit | null = null;

/**
 * Get the rate limiter instance (lazily initialized).
 * Returns null if Redis credentials are not configured.
 */
function getRatelimit(): Ratelimit | null {
  if (ratelimit) return ratelimit;

  const url = process.env.UPSTASH_REDIS_REST_URL;
  const token = process.env.UPSTASH_REDIS_REST_TOKEN;

  if (!url || !token) {
    console.warn(
      "[rate-limit] UPSTASH_REDIS_REST_URL or UPSTASH_REDIS_REST_TOKEN not configured. Rate limiting is disabled."
    );
    return null;
  }

  try {
    const redis = new Redis({ url, token });
    ratelimit = new Ratelimit({
      redis,
      limiter: Ratelimit.slidingWindow(5, "1 h"), // 5 requests per hour per IP
      analytics: true,
      prefix: "readme-wizard",
    });
    return ratelimit;
  } catch (error) {
    console.error("[rate-limit] Failed to initialize rate limiter:", error);
    return null;
  }
}

export interface RateLimitResult {
  success: boolean;
  limit: number;
  remaining: number;
  reset: number; // Unix timestamp in ms when the limit resets
}

/**
 * Check rate limit for a given identifier (IP address).
 * Returns { success: true } if Redis is unavailable (fail open).
 */
export async function checkRateLimit(
  identifier: string
): Promise<RateLimitResult> {
  const limiter = getRatelimit();

  // Fail open: if Redis is not configured, allow the request
  if (!limiter) {
    return { success: true, limit: 5, remaining: 5, reset: 0 };
  }

  try {
    const result = await limiter.limit(identifier);
    return {
      success: result.success,
      limit: result.limit,
      remaining: result.remaining,
      reset: result.reset,
    };
  } catch (error) {
    console.error("[rate-limit] Error checking rate limit:", error);
    // Fail open on Redis errors
    return { success: true, limit: 5, remaining: 5, reset: 0 };
  }
}

/**
 * Extract the client IP from a Next.js request.
 * Supports Vercel's x-forwarded-for and standard headers.
 */
export function getClientIP(request: Request): string {
  // Vercel / reverse proxy headers
  const forwarded = request.headers.get("x-forwarded-for");
  if (forwarded) {
    // x-forwarded-for can be a comma-separated list; take the first (client) IP
    return forwarded.split(",")[0].trim();
  }

  const realIp = request.headers.get("x-real-ip");
  if (realIp) {
    return realIp.trim();
  }

  // Fallback for local development
  return "127.0.0.1";
}
