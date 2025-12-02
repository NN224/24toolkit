/**
 * Upstash Redis Client
 * 
 * Serverless Redis for:
 * - Rate limiting (distributed across instances)
 * - Session storage
 * - Caching
 * 
 * Get your credentials from: https://console.upstash.com/
 */

import { Redis } from '@upstash/redis'

// Create Redis client (will be null if not configured)
let redis: Redis | null = null

try {
  const url = process.env.UPSTASH_REDIS_REST_URL
  const token = process.env.UPSTASH_REDIS_REST_TOKEN

  if (url && token) {
    redis = new Redis({
      url,
      token,
    })
    console.log('[Upstash] Redis client initialized')
  } else {
    console.log('[Upstash] No credentials configured, using in-memory fallback')
  }
} catch (error) {
  console.error('[Upstash] Failed to initialize Redis:', error)
}

export { redis }

/**
 * Check if Upstash is configured and available
 */
export function isUpstashAvailable(): boolean {
  return redis !== null
}

/**
 * Get a value from Redis with fallback
 */
export async function get<T>(key: string): Promise<T | null> {
  if (!redis) return null
  try {
    return await redis.get<T>(key)
  } catch (error) {
    console.error('[Upstash] GET error:', error)
    return null
  }
}

/**
 * Set a value in Redis with optional expiration (in seconds)
 */
export async function set(
  key: string,
  value: unknown,
  expirationSeconds?: number
): Promise<boolean> {
  if (!redis) return false
  try {
    if (expirationSeconds) {
      await redis.setex(key, expirationSeconds, value)
    } else {
      await redis.set(key, value)
    }
    return true
  } catch (error) {
    console.error('[Upstash] SET error:', error)
    return false
  }
}

/**
 * Delete a key from Redis
 */
export async function del(key: string): Promise<boolean> {
  if (!redis) return false
  try {
    await redis.del(key)
    return true
  } catch (error) {
    console.error('[Upstash] DEL error:', error)
    return false
  }
}

/**
 * Increment a counter (useful for rate limiting)
 */
export async function incr(key: string): Promise<number | null> {
  if (!redis) return null
  try {
    return await redis.incr(key)
  } catch (error) {
    console.error('[Upstash] INCR error:', error)
    return null
  }
}

/**
 * Set expiration on a key
 */
export async function expire(key: string, seconds: number): Promise<boolean> {
  if (!redis) return false
  try {
    await redis.expire(key, seconds)
    return true
  } catch (error) {
    console.error('[Upstash] EXPIRE error:', error)
    return false
  }
}

/**
 * Get time-to-live for a key
 */
export async function ttl(key: string): Promise<number | null> {
  if (!redis) return null
  try {
    return await redis.ttl(key)
  } catch (error) {
    console.error('[Upstash] TTL error:', error)
    return null
  }
}
