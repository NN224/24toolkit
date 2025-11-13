import type { VercelRequest, VercelResponse } from "@vercel/node";

/**
 * KV Store endpoint - Root endpoint (list & set keys)
 *
 * Minimal in-memory implementation.
 * Data resets on cold starts (serverless).
 *
 * For production, use:
 * - Vercel KV → https://vercel.com/docs/storage/vercel-kv
 * - Upstash Redis → https://upstash.com/
 */

// Initialize global KV store
if (!(global as any).kvStore) {
  (global as any).kvStore = new Map<string, any>();
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  const kvStore = (global as any).kvStore as Map<string, any>;

  // --- CORS headers ---
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization, X-Spark-Initial");

  // Handle preflight
  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  // --- GET: return all keys ---
  if (req.method === "GET") {
    const keys = Array.from(kvStore.keys());
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
    kvStore.set(key, value);
    return res.status(200).json({ ok: true, key });
  }

  // --- DELETE: clear all keys ---
  if (req.method === "DELETE") {
    kvStore.clear();
    return res.status(200).json({ ok: true, cleared: true });
  }

  // --- fallback ---
  return res.status(405).json({ error: "Method not allowed" });
}
