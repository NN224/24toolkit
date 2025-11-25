// Input sanitization utilities

export function sanitizeString(input: string, maxLength = 500): string {
  if (typeof input !== "string") return ""

  // Remove null bytes
  let sanitized = input.replace(/\0/g, "")

  // Trim whitespace
  sanitized = sanitized.trim()

  // Limit length
  if (sanitized.length > maxLength) {
    sanitized = sanitized.substring(0, maxLength)
  }

  return sanitized
}

export function sanitizeEmail(email: string): string {
  const sanitized = sanitizeString(email, 254)

  // Basic email validation
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  if (!emailRegex.test(sanitized)) {
    throw new Error("Invalid email format")
  }

  return sanitized.toLowerCase()
}

export function sanitizeSlug(slug: string): string {
  return slug
    .toLowerCase()
    .replace(/[^a-z0-9-]/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "")
    .substring(0, 200)
}

export function sanitizeProductName(name: string): string {
  const sanitized = sanitizeString(name, 100)

  // Remove potentially dangerous characters
  return sanitized.replace(/[<>"'`]/g, "")
}

export function detectSpam(text: string): boolean {
  const spamPatterns = [
    /viagra|cialis|pharmacy/i,
    /\b(buy|cheap|discount)\s+(now|here|online)\b/i,
    /click\s+here/i,
    /\$\$\$/,
    /http[s]?:\/\/[^\s]{50,}/i, // Very long URLs
    /(.)\1{10,}/, // Repeated characters
  ]

  return spamPatterns.some((pattern) => pattern.test(text))
}

export function sanitizeHtml(html: string): string {
  // Remove all HTML tags
  return html.replace(/<[^>]*>/g, "")
}
