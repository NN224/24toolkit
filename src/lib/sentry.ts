/**
 * Sentry Error Tracking Configuration
 * 
 * Features:
 * - Error tracking with full stack traces
 * - Performance monitoring (Core Web Vitals, API calls)
 * - Session Replay (video recording on errors)
 * - Sourcemaps for readable stack traces
 * 
 * Get your DSN from: https://sentry.io/
 */

import * as Sentry from '@sentry/react'

const SENTRY_DSN = import.meta.env.VITE_SENTRY_DSN
const IS_PRODUCTION = import.meta.env.MODE === 'production'

export function initSentry() {
  if (!SENTRY_DSN) {
    console.log('[Sentry] No DSN configured, error tracking disabled')
    return
  }

  Sentry.init({
    dsn: SENTRY_DSN,
    
    // Environment & Release
    environment: import.meta.env.MODE,
    release: import.meta.env.VITE_APP_VERSION || '1.0.0',
    
    // ==========================================================================
    // Integrations
    // ==========================================================================
    integrations: [
      // Performance: Browser Tracing
      Sentry.browserTracingIntegration({
        // Track navigation and page loads
        enableInp: true, // Interaction to Next Paint
      }),
      
      // Session Replay: Record user sessions
      Sentry.replayIntegration({
        // Privacy settings
        maskAllText: false,        // Don't mask text (not sensitive)
        maskAllInputs: true,       // Mask password/credit card inputs
        blockAllMedia: false,      // Allow images/videos
        
        // Network request/response capture
        networkDetailAllowUrls: [
          window.location.origin,
          /\/api\//,
        ],
        networkRequestHeaders: ['X-Request-Id'],
        networkResponseHeaders: ['X-Request-Id'],
      }),
      
      // Capture console errors
      Sentry.captureConsoleIntegration({
        levels: ['error'],
      }),
      
      // HTTP client errors
      Sentry.httpClientIntegration(),
    ],
    
    // ==========================================================================
    // Performance Monitoring
    // ==========================================================================
    // Sample rate for performance data (0.0 to 1.0)
    // Production: 10% of transactions
    // Development: 100% for debugging
    tracesSampleRate: IS_PRODUCTION ? 0.1 : 1.0,
    
    // Profile slow transactions (requires Performance plan)
    profilesSampleRate: IS_PRODUCTION ? 0.1 : 0,
    
    // ==========================================================================
    // Session Replay
    // ==========================================================================
    // Capture 0% of normal sessions (too expensive)
    replaysSessionSampleRate: 0,
    
    // Capture 100% of sessions WITH errors (super useful for debugging)
    replaysOnErrorSampleRate: 1.0,
    
    // ==========================================================================
    // Error Filtering
    // ==========================================================================
    beforeSend(event, hint) {
      const error = hint.originalException as Error
      const message = error?.message || ''
      
      // Ignore common non-critical errors
      const ignoredPatterns = [
        'Network Error',           // User offline
        'AbortError',              // Cancelled requests
        'Too many requests',       // Rate limiting (expected)
        'Failed to fetch',         // Network issues
        'Load failed',             // Resource loading issues
        'ResizeObserver',          // Browser resize observer errors
        'ChunkLoadError',          // Code splitting failures (user refreshes)
        'Loading chunk',           // Same as above
        'Script error',            // Cross-origin script errors (no info)
      ]
      
      for (const pattern of ignoredPatterns) {
        if (message.includes(pattern)) {
          return null
        }
      }
      
      return event
    },
    
    // Filter performance transactions
    beforeSendTransaction(event) {
      // Ignore health check pings
      if (event.transaction?.includes('/api/health')) {
        return null
      }
      return event
    },
    
  // ==========================================================================
  // General Settings
  // ==========================================================================
  // Enable when DSN is configured (works in all environments)
  enabled: !!SENTRY_DSN,
  
  // Attach stack traces to messages
  attachStacktrace: true,
  
  // Send default PII (IP address, etc) - disable for privacy
  sendDefaultPii: false,
  
  // Note: session tracking should use the SDK defaults or be configured
  // via supported APIs; the `autoSessionTracking` option is not recognized
  // by the current BrowserOptions types and has been removed.
  })

  console.log('[Sentry] Error tracking initialized (Performance + Replay enabled)')
}

/**
 * Capture a custom error with context
 */
export function captureError(error: Error, context?: Record<string, unknown>) {
  Sentry.captureException(error, {
    extra: context,
  })
}

/**
 * Capture a message/event
 */
export function captureMessage(message: string, level: 'info' | 'warning' | 'error' = 'info') {
  Sentry.captureMessage(message, level)
}

/**
 * Set user context for error tracking
 */
export function setUser(user: { id: string; email?: string; username?: string } | null) {
  if (user) {
    Sentry.setUser(user)
  } else {
    Sentry.setUser(null)
  }
}

/**
 * Add breadcrumb for debugging
 */
export function addBreadcrumb(message: string, category: string, data?: Record<string, unknown>) {
  Sentry.addBreadcrumb({
    message,
    category,
    data,
    level: 'info',
  })
}

// Export Sentry for advanced usage
export { Sentry }
