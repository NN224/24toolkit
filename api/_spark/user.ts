import type { VercelRequest, VercelResponse } from "@vercel/node";
import { checkRateLimit, getClientIdentifier, RATE_LIMITS } from '../_utils/rateLimit.js';
import { logger } from '../_utils/logger.js';

/**
 * Spark Runtime - User Stub Endpoint
 *
 * In GitHub Spark, this returns user info.
 * In this standalone setup, it simply returns `null` (anonymous user).
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

  // --- Allow only GET (and maybe POST for compatibility) ---
  if (req.method !== "GET" && req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  // Rate limiting
  const clientId = getClientIdentifier(req);
  const rateLimit = checkRateLimit(clientId, RATE_LIMITS.general);
  
  res.setHeader('X-RateLimit-Limit', RATE_LIMITS.general.maxRequests.toString());
  res.setHeader('X-RateLimit-Remaining', rateLimit.remaining.toString());

  if (!rateLimit.allowed) {
    logger.warn('Rate limit exceeded', { clientId, endpoint: '/_spark/user' });
    return res.status(429).json({ 
      error: 'Too many requests. Please try again later.'
    });
  }

  // --- Return anonymous user response ---
  res.setHeader("Content-Type", "application/json");
  logger.debug('User endpoint called', { method: req.method });
  return res.status(200).json({ user: null });
}
