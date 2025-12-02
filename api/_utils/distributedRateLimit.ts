/**
 * Distributed Rate Limiting with Upstash Redis
 * 
 * Falls back to in-memory rate limiting if Upstash is not configured.
 * This ensures the app works in both scenarios.
 */

import { redis, isUpstashAvailable } from './upstash.js'
import { checkRateLimit as checkInMemoryRateLimit, type RateLimitConfig, type RateLimitResult } from './rateLimit.js'

/**
 * Check rate limit using Upstash Redis (distributed) or in-memory (single instance)
 */
export async function checkDistributedRateLimit(
  identifier: string,
  config: RateLimitConfig
): Promise<RateLimitResult> {
  // Fallback to in-memory if Upstash is not available
  if (!isUpstashAvailable() || !redis) {
    return checkInMemoryRateLimit(identifier, config)
  }

  const key = `ratelimit:${identifier}`
  const now = Date.now()
  const windowMs = config.windowMs
  const maxRequests = config.maxRequests

  try {
    // Use Redis pipeline for atomic operations
    const pipeline = redis.pipeline()
    
    // Get current count
    pipeline.get(key)
    // Get TTL
    pipeline.ttl(key)
    
    const results = await pipeline.exec()
    const currentCount = (results[0] as number) || 0
    const currentTTL = (results[1] as number) || -1

    // Calculate reset time
    const resetTime = currentTTL > 0 
      ? now + (currentTTL * 1000)
      : now + windowMs

    // Check if within limit
    if (currentCount >= maxRequests) {
      return {
        allowed: false,
        remaining: 0,
        resetTime,
      }
    }

    // Increment counter
    if (currentCount === 0 || currentTTL <= 0) {
      // New window - set with expiration
      await redis.setex(key, Math.ceil(windowMs / 1000), 1)
    } else {
      // Existing window - just increment
      await redis.incr(key)
    }

    return {
      allowed: true,
      remaining: maxRequests - currentCount - 1,
      resetTime,
    }
  } catch (error) {
    console.error('[DistributedRateLimit] Redis error, falling back to in-memory:', error)
    // Fallback to in-memory on error
    return checkInMemoryRateLimit(identifier, config)
  }
}

/**
 * Reset rate limit for an identifier (useful for testing or admin actions)
 */
export async function resetRateLimit(identifier: string): Promise<boolean> {
  if (!isUpstashAvailable() || !redis) {
    return false
  }

  try {
    const key = `ratelimit:${identifier}`
    await redis.del(key)
    return true
  } catch (error) {
    console.error('[DistributedRateLimit] Failed to reset:', error)
    return false
  }
}

/**
 * Get current rate limit status without incrementing
 */
export async function getRateLimitStatus(
  identifier: string,
  config: RateLimitConfig
): Promise<{ count: number; remaining: number; resetTime: number } | null> {
  if (!isUpstashAvailable() || !redis) {
    return null
  }

  try {
    const key = `ratelimit:${identifier}`
    const pipeline = redis.pipeline()
    pipeline.get(key)
    pipeline.ttl(key)
    
    const results = await pipeline.exec()
    const count = (results[0] as number) || 0
    const ttl = (results[1] as number) || -1
    
    return {
      count,
      remaining: Math.max(0, config.maxRequests - count),
      resetTime: ttl > 0 ? Date.now() + (ttl * 1000) : Date.now() + config.windowMs,
    }
  } catch (error) {
    console.error('[DistributedRateLimit] Failed to get status:', error)
    return null
  }
}
