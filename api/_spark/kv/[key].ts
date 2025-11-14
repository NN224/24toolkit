import type { VercelRequest, VercelResponse } from "@vercel/node";
import { validateKVKey, sanitizeErrorMessage } from '../../_utils/validation';
import { checkRateLimit, getClientIdentifier, RATE_LIMITS } from '../../_utils/rateLimit';
import { logger } from '../../_utils/logger';

/**
 * KV Store endpoint - Key-specific operations
 *
 * Supports GET, POST (set), and DELETE for individual keys.
 * Uses in-memory Map (non-persistent across cold starts).
 * 
 * WARNING: This is a simple in-memory store that resets on serverless cold starts.
 * For production with persistent storage, use:
 * - Vercel KV: https://vercel.com/docs/storage/vercel-kv
 * - Upstash Redis: https://upstash.com/
 */

// Initialize global KV store
if (!(global as any).kvStore) {
  (global as any).kvStore = new Map<string, any>();
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  const startTime = Date.now();
  const kvStore = (global as any).kvStore as Map<string, any>;
  const { key } = req.query;

  // --- CORS headers ---
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization, X-Spark-Initial");

  // Handle OPTIONS preflight
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
    logger.warn('Rate limit exceeded', { clientId, endpoint: '/_spark/kv/:key' });
    return res.status(429).json({ 
      error: 'Too many requests. Please try again later.',
      retryAfter: Math.ceil((rateLimit.resetTime - Date.now()) / 1000)
    });
  }

  // Validate key
  if (!key || typeof key !== "string") {
    return res.status(400).json({ error: "Key parameter is required" });
  }

  const decodedKey = decodeURIComponent(key);
  
  // Validate key format
  const validation = validateKVKey(decodedKey);
  if (!validation.isValid) {
    logger.warn('Invalid KV key', { error: validation.error, key: decodedKey });
    return res.status(400).json({ error: validation.error });
  }

  logger.debug(`KV operation: ${req.method}`, { key: decodedKey });

  // --- Handle methods ---
  try {
    if (req.method === "GET") {
      let value = kvStore.get(decodedKey);
      
      // Return empty array for undefined array-like keys to prevent "a.map is not a function"
      if (value === undefined) {
        if (decodedKey.includes("messages") || decodedKey.includes("list") || decodedKey.includes("items")) {
          value = [];
        } else {
          value = null;
        }
      }
      
      // Ensure arrays are always arrays (defensive programming)
      if (value === null && (decodedKey.includes("messages") || decodedKey.includes("list"))) {
        value = [];
      }
      
      res.setHeader("Content-Type", "application/json");
      const duration = Date.now() - startTime;
      logger.logResponse(req.method, '/_spark/kv/:key', 200, duration, { key: decodedKey });
      return res.status(200).json({ value });
    }

    if (req.method === "POST" || req.method === "PUT") {
      try {
        const body = typeof req.body === "string" ? JSON.parse(req.body) : req.body;
        
        // Check value size (limit to 1MB)
        const valueSize = JSON.stringify(body).length;
        if (valueSize > 1024 * 1024) {
          return res.status(413).json({ error: "Value too large (max 1MB)" });
        }
        
        kvStore.set(decodedKey, body);
        const duration = Date.now() - startTime;
        logger.logResponse(req.method, '/_spark/kv/:key', 200, duration, { key: decodedKey });
        return res.status(200).json({ ok: true, key: decodedKey });
      } catch (parseError) {
        logger.error("Error parsing KV value", parseError instanceof Error ? parseError : new Error(String(parseError)));
        return res.status(400).json({ error: "Invalid JSON in request body" });
      }
    }

    if (req.method === "DELETE") {
      kvStore.delete(decodedKey);
      const duration = Date.now() - startTime;
      logger.logResponse(req.method, '/_spark/kv/:key', 200, duration, { key: decodedKey });
      return res.status(200).json({ ok: true, deleted: decodedKey });
    }

    return res.status(405).json({ error: "Method not allowed" });
  } catch (error) {
    logger.error("KV operation error", error instanceof Error ? error : new Error(String(error)), { 
      key: decodedKey,
      method: req.method 
    });
    const duration = Date.now() - startTime;
    logger.logResponse(req.method, '/_spark/kv/:key', 500, duration);
    return res.status(500).json({ error: sanitizeErrorMessage(error, false) });
  }
}
