// Rate limiting implementation using in-memory store
// For production, consider using Redis or a database

interface RateLimitEntry {
  count: number
  resetTime: number
}

const rateLimitStore = new Map<string, RateLimitEntry>()

// Clean up old entries every 5 minutes
setInterval(
  () => {
    const now = Date.now()
    for (const [key, entry] of rateLimitStore.entries()) {
      if (entry.resetTime < now) {
        rateLimitStore.delete(key)
      }
    }
  },
  5 * 60 * 1000,
)

export interface RateLimitConfig {
  maxRequests: number
  windowMs: number
}

export function checkRateLimit(
  identifier: string,
  config: RateLimitConfig = { maxRequests: 10, windowMs: 60 * 60 * 1000 },
): { allowed: boolean; remaining: number; resetTime: number } {
  const now = Date.now()
  const entry = rateLimitStore.get(identifier)

  if (!entry || entry.resetTime < now) {
    // Create new entry
    const resetTime = now + config.windowMs
    rateLimitStore.set(identifier, { count: 1, resetTime })
    return { allowed: true, remaining: config.maxRequests - 1, resetTime }
  }

  if (entry.count >= config.maxRequests) {
    return { allowed: false, remaining: 0, resetTime: entry.resetTime }
  }

  entry.count++
  return { allowed: true, remaining: config.maxRequests - entry.count, resetTime: entry.resetTime }
}

export function getRateLimitHeaders(remaining: number, resetTime: number) {
  return {
    "X-RateLimit-Remaining": remaining.toString(),
    "X-RateLimit-Reset": new Date(resetTime).toISOString(),
  }
}
