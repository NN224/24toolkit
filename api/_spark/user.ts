import type { VercelRequest, VercelResponse } from "@vercel/node";

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

  // --- Return anonymous user response ---
  res.setHeader("Content-Type", "application/json");
  return res.status(200).json({ user: null });
}
