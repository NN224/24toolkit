import type { VercelRequest, VercelResponse } from "@vercel/node";

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

  // --- Acknowledge request ---
  res.setHeader("Content-Type", "application/json");
  return res.status(200).json({ success: true });
}
