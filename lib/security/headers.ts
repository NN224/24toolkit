// Enhanced dynamic security headers & CSP configuration for production readiness
// Sources are conditionally included based on enabled services (Supabase, Analytics, AdSense)
// Avoids unsafe-eval in production while keeping dev DX acceptable.

export function getSecurityHeaders() {
  const isProd = process.env.NODE_ENV === "production"

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://www.productsvs.com"
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ""
  const supabaseOrigin = supabaseUrl ? safeOrigin(supabaseUrl) : ""

  const gaEnabled = !!process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID
  const adsenseEnabled = !!process.env.NEXT_PUBLIC_ADSENSE_PUBLISHER_ID

  const analyticsSrc = gaEnabled ? ["https://www.googletagmanager.com", "https://www.google-analytics.com"] : []
  const adsenseSrc = adsenseEnabled
    ? [
        "https://pagead2.googlesyndication.com",
        "https://googleads.g.doubleclick.net",
        "https://tpc.googlesyndication.com",
      ]
    : []

  const scriptSrc = [
    "'self'",
    "'unsafe-inline'", // Required for Next.js hydration & certain inline styles
    ...(isProd ? [] : ["'unsafe-eval'"]), // Allow eval only in development for HMR convenience
    "https://va.vercel-scripts.com",
    ...analyticsSrc,
    ...adsenseSrc,
  ]

  const styleSrc = ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com"]
  const fontSrc = ["'self'", "https://fonts.gstatic.com"]
  const imgSrc = ["'self'", "data:", "blob:", "https:"]
  const connectSrc = [
    "'self'",
    "https://va.vercel-scripts.com",
    supabaseOrigin || "https://*.supabase.co",
    ...analyticsSrc,
    ...adsenseSrc,
  ]

  // Build CSP string
  const csp = [
    "default-src 'self'",
    `script-src ${scriptSrc.join(" ")}`,
    `style-src ${styleSrc.join(" ")}`,
    `font-src ${fontSrc.join(" ")}`,
    `img-src ${imgSrc.join(" ")}`,
    `connect-src ${connectSrc.join(" ")}`,
    "frame-ancestors 'self'",
  ].join("; ")

  return {
    "X-XSS-Protection": "1; mode=block",
    "X-Frame-Options": "SAMEORIGIN",
    "X-Content-Type-Options": "nosniff",
    "Referrer-Policy": "strict-origin-when-cross-origin",
    "Content-Security-Policy": csp,
    "Permissions-Policy": "camera=(), microphone=(), geolocation=()",
  }
}

function safeOrigin(url: string): string {
  try {
    return new URL(url).origin
  } catch {
    return ""
  }
}
