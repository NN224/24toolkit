import type { VercelRequest, VercelResponse } from "@vercel/node";
import { checkRateLimit, getClientIdentifier, RATE_LIMITS } from '../_utils/rateLimit.js';
import { logger } from '../_utils/logger.js';

/**
 * Spark Runtime - Telemetry / Loaded Stub
 *
 * This endpoint acknowledges analytics or load events from Spark.
 * It exists mainly to satisfy the Spark runtime environment so it
 * doesn't throw network errors in standalone deployments.
 */

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // --- CORS headers ---
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");

  // --- Handle OPTIONS preflight ---
  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  // --- Accept POST or GET (for flexibility) ---
  if (req.method !== "POST" && req.method !== "GET") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  // Rate limiting
  const clientId = getClientIdentifier(req);
  const rateLimit = checkRateLimit(clientId, RATE_LIMITS.general);
  
  res.setHeader('X-RateLimit-Limit', RATE_LIMITS.general.maxRequests.toString());
  res.setHeader('X-RateLimit-Remaining', rateLimit.remaining.toString());

  if (!rateLimit.allowed) {
    logger.warn('Rate limit exceeded', { clientId, endpoint: '/_spark/loaded' });
    return res.status(429).json({ 
      error: 'Too many requests. Please try again later.'
    });
  }

  // --- Acknowledge request ---
  res.setHeader("Content-Type", "application/json");
  logger.debug('Loaded endpoint called', { method: req.method });
  return res.status(200).json({ success: true });
}
