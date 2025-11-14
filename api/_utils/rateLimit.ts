import type { VercelResponse } from "@vercel/node";

/**
 * Simple in-memory rate limiting for API endpoints
 * For production with multiple instances, consider Redis-based rate limiting
 */

interface RateLimitEntry {
  count: number;
  resetTime: number;
}

const rateLimitStore = new Map<string, RateLimitEntry>();

// Cleanup old entries every 5 minutes
setInterval(() => {
  const now = Date.now();
  for (const [key, entry] of rateLimitStore.entries()) {
    if (now > entry.resetTime) {
      rateLimitStore.delete(key);
    }
  }
}, 5 * 60 * 1000);

export interface RateLimitConfig {
  windowMs: number; // Time window in milliseconds
  maxRequests: number; // Maximum requests per window
}

export interface RateLimitResult {
  allowed: boolean;
  remaining: number;
  resetTime: number;
}

/**
 * Check if request is within rate limit
 * @param identifier - Unique identifier (e.g., IP address, API key)
 * @param config - Rate limit configuration
 */
export function checkRateLimit(
  identifier: string,
  config: RateLimitConfig
): RateLimitResult {
  const now = Date.now();
  const entry = rateLimitStore.get(identifier);

  // No previous entry or window expired
  if (!entry || now > entry.resetTime) {
    const resetTime = now + config.windowMs;
    rateLimitStore.set(identifier, { count: 1, resetTime });
    return {
      allowed: true,
      remaining: config.maxRequests - 1,
      resetTime,
    };
  }

  // Within window
  if (entry.count < config.maxRequests) {
    entry.count++;
    return {
      allowed: true,
      remaining: config.maxRequests - entry.count,
      resetTime: entry.resetTime,
    };
  }

  // Rate limit exceeded
  return {
    allowed: false,
    remaining: 0,
    resetTime: entry.resetTime,
  };
}

/**
 * Get client identifier from request
 * Uses IP address or falls back to user agent
 */
export function getClientIdentifier(req: any): string {
  // Try to get IP from various headers (Vercel, CloudFlare, etc.)
  const forwarded = req.headers["x-forwarded-for"];
  if (forwarded) {
    return Array.isArray(forwarded) ? forwarded[0] : forwarded.split(",")[0].trim();
  }

  const realIp = req.headers["x-real-ip"];
  if (realIp) {
    return Array.isArray(realIp) ? realIp[0] : realIp;
  }

  // Fallback to connection IP or user agent
  return req.socket?.remoteAddress || req.headers["user-agent"] || "unknown";
}

/**
 * Default rate limit configurations for different endpoint types
 */
export const RATE_LIMITS = {
  ai: {
    windowMs: 60 * 1000, // 1 minute
    maxRequests: 10, // 10 requests per minute
  },
  kv: {
    windowMs: 60 * 1000, // 1 minute
    maxRequests: 100, // 100 requests per minute
  },
  general: {
    windowMs: 60 * 1000, // 1 minute
    maxRequests: 60, // 60 requests per minute
  },
} as const;

interface SparkHitRecord {
  count: number;
  expiresAt: number;
}

export interface SparkRateLimitOptions {
  intervalMs?: number;
  uniqueTokenPerInterval?: number;
  sendHeaders?: boolean;
}

export interface SparkRateLimitState {
  limit: number;
  remaining: number;
  reset: number;
}

export interface SparkRateLimitError extends Error {
  statusCode?: number;
  limit?: number;
  reset?: number;
}

export interface RateLimiter {
  check: (res: VercelResponse, limit: number, token: string) => Promise<SparkRateLimitState>;
}

const sparkStore = new Map<string, SparkHitRecord>();

function cleanupSparkStore(now: number, maxSize: number) {
  for (const [token, record] of sparkStore) {
    if (record.expiresAt <= now || sparkStore.size > maxSize) {
      sparkStore.delete(token);
    }
  }
}

export default function rateLimit(options: SparkRateLimitOptions = {}): RateLimiter {
  const interval = options.intervalMs ?? 60_000;
  const uniqueTokenPerInterval = options.uniqueTokenPerInterval ?? 500;
  const sendHeaders = options.sendHeaders ?? true;

  return {
    async check(res: VercelResponse, limit: number, token: string): Promise<SparkRateLimitState> {
      const now = Date.now();
      const existing = sparkStore.get(token);
      const record: SparkHitRecord = existing && existing.expiresAt > now
        ? { ...existing, count: existing.count + 1 }
        : { count: 1, expiresAt: now + interval };

      sparkStore.set(token, record);
      if (sparkStore.size > uniqueTokenPerInterval * 2) {
        cleanupSparkStore(now, uniqueTokenPerInterval);
      }

      const remaining = Math.max(0, limit - record.count);

      if (sendHeaders) {
        res.setHeader("X-RateLimit-Limit", String(limit));
        res.setHeader("X-RateLimit-Remaining", String(remaining));
        res.setHeader("X-RateLimit-Reset", String(record.expiresAt));
      }

      if (record.count > limit) {
        if (sendHeaders) {
          const retryAfter = Math.max(0, Math.ceil((record.expiresAt - now) / 1000));
          res.setHeader("Retry-After", String(retryAfter));
        }

        const error: SparkRateLimitError = new Error("Too many requests");
        error.statusCode = 429;
        error.limit = limit;
        error.reset = record.expiresAt;
        throw error;
      }

      return {
        limit,
        remaining,
        reset: record.expiresAt,
      };
    },
  };
}
