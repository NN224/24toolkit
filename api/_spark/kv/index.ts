import type { VercelRequest, VercelResponse } from "@vercel/node";
import { validateKVKey, sanitizeErrorMessage } from '../../_utils/validation';
import { checkRateLimit, getClientIdentifier, RATE_LIMITS } from '../../_utils/rateLimit';
import { logger } from '../../_utils/logger';

/**
 * KV Store endpoint - Root endpoint (list & set keys)
 *
 * Minimal in-memory implementation.
 * Data resets on cold starts (serverless).
 *
 * WARNING: This is a simple in-memory store that resets on serverless cold starts.
 * For production with persistent storage, use:
 * - Vercel KV → https://vercel.com/docs/storage/vercel-kv
 * - Upstash Redis → https://upstash.com/
 */

// Initialize global KV store
if (!(global as any).kvStore) {
  (global as any).kvStore = new Map<string, any>();
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  const startTime = Date.now();
  const kvStore = (global as any).kvStore as Map<string, any>;

  // --- CORS headers ---
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization, X-Spark-Initial");

  // Handle preflight
  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  // Rate limiting
  const clientId = getClientIdentifier(req);
  const rateLimit = checkRateLimit(clientId, RATE_LIMITS.kv);
  
  res.setHeader('X-RateLimit-Limit', RATE_LIMITS.kv.maxRequests.toString());
  res.setHeader('X-RateLimit-Remaining', rateLimit.remaining.toString());
  res.setHeader('X-RateLimit-Reset', new Date(rateLimit.resetTime).toISOString());

  if (!rateLimit.allowed) {
    logger.warn('Rate limit exceeded', { clientId, endpoint: '/_spark/kv' });
    return res.status(429).json({ 
      error: 'Too many requests. Please try again later.',
      retryAfter: Math.ceil((rateLimit.resetTime - Date.now()) / 1000)
    });
  }

  try {
    // --- GET: return all keys ---
    if (req.method === "GET") {
      const keys = Array.from(kvStore.keys());
      const duration = Date.now() - startTime;
      logger.logResponse(req.method, '/_spark/kv', 200, duration, { keysCount: keys.length });
      return res
        .status(200)
        .setHeader("Content-Type", "application/json")
        .json({ keys });
    }

    // --- POST: set a key/value ---
    if (req.method === "POST") {
      const { key, value } = req.body;
      if (!key) {
        return res.status(400).json({ error: "Missing 'key' in body" });
      }

      // Validate key
      const validation = validateKVKey(key);
      if (!validation.isValid) {
        logger.warn('Invalid KV key in POST', { error: validation.error, key });
        return res.status(400).json({ error: validation.error });
      }

      // Check value size (limit to 1MB)
      const valueSize = JSON.stringify(value).length;
      if (valueSize > 1024 * 1024) {
        return res.status(413).json({ error: "Value too large (max 1MB)" });
      }

      kvStore.set(key, value);
      const duration = Date.now() - startTime;
      logger.logResponse(req.method, '/_spark/kv', 200, duration, { key });
      return res.status(200).json({ ok: true, key });
    }

    // --- DELETE: clear all keys ---
    if (req.method === "DELETE") {
      const keysCount = kvStore.size;
      kvStore.clear();
      const duration = Date.now() - startTime;
      logger.logResponse(req.method, '/_spark/kv', 200, duration, { clearedKeys: keysCount });
      return res.status(200).json({ ok: true, cleared: true });
    }

    // --- fallback ---
    return res.status(405).json({ error: "Method not allowed" });
  } catch (error) {
    logger.error("KV operation error", error instanceof Error ? error : new Error(String(error)));
    const duration = Date.now() - startTime;
    logger.logResponse(req.method || 'UNKNOWN', '/_spark/kv', 500, duration);
    return res.status(500).json({ error: sanitizeErrorMessage(error, false) });
  }
}
