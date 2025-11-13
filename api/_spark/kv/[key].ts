import type { VercelRequest, VercelResponse } from "@vercel/node";

/**
 * KV Store endpoint - Key-specific operations
 *
 * Supports GET, POST (set), and DELETE for individual keys.
 * Uses in-memory Map (non-persistent across cold starts).
 */

// Initialize global KV store
if (!(global as any).kvStore) {
  (global as any).kvStore = new Map<string, any>();
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
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

  // Log for debugging
  console.log(`[KV] Method: ${req.method}, Key: ${key}`);

  // Validate key
  if (!key || typeof key !== "string") {
    return res.status(400).json({ error: "Key parameter is required" });
  }

  const decodedKey = decodeURIComponent(key);

  // --- Handle methods ---
  if (req.method === "GET") {
    const value = kvStore.get(decodedKey);
    if (value === undefined) {
      return res.status(404).json({ value: null });
    }
    res.setHeader("Content-Type", "application/json");
    return res.status(200).json({ key: decodedKey, value });
  }

  if (req.method === "POST") {
    try {
      const body = typeof req.body === "string" ? JSON.parse(req.body) : req.body;
      kvStore.set(decodedKey, body);
      return res.status(200).json({ ok: true, key: decodedKey });
    } catch (error) {
      console.error("Error setting KV value:", error);
      return res.status(500).json({ error: "Failed to set value" });
    }
  }

  if (req.method === "PUT") {
    try {
      const body = typeof req.body === "string" ? JSON.parse(req.body) : req.body;
      kvStore.set(decodedKey, body);
      return res.status(200).json({ ok: true, key: decodedKey });
    } catch (error) {
      console.error("Error setting KV value:", error);
      return res.status(500).json({ error: "Failed to set value" });
    }
  }

  if (req.method === "DELETE") {
    kvStore.delete(decodedKey);
    return res.status(200).json({ ok: true, deleted: decodedKey });
  }

  return res.status(405).json({ error: "Method not allowed" });
}
