/**
 * Sentry Error Tracking Configuration
 * 
 * Tracks errors, performance, and user sessions in production.
 * Get your DSN from: https://sentry.io/
 */

import * as Sentry from '@sentry/react'

const SENTRY_DSN = import.meta.env.VITE_SENTRY_DSN

export function initSentry() {
  if (!SENTRY_DSN) {
    console.log('[Sentry] No DSN configured, error tracking disabled')
    return
  }

  Sentry.init({
    dsn: SENTRY_DSN,
    
    // Environment
    environment: import.meta.env.MODE,
    
    // Release version (set during build)
    release: import.meta.env.VITE_APP_VERSION || '1.0.0',
    
    // Integrations
    integrations: [
      // Browser tracing for performance
      Sentry.browserTracingIntegration(),
      // Replay for session recording (only on errors)
      Sentry.replayIntegration({
        maskAllText: false,
        blockAllMedia: false,
      }),
    ],
    
    // Performance Monitoring
    tracesSampleRate: import.meta.env.MODE === 'production' ? 0.1 : 1.0,
    
    // Session Replay - only capture on errors
    replaysSessionSampleRate: 0,
    replaysOnErrorSampleRate: 1.0,
    
    // Filter out non-critical errors
    beforeSend(event, hint) {
      const error = hint.originalException as Error
      
      // Ignore network errors (user offline, etc.)
      if (error?.message?.includes('Network Error')) {
        return null
      }
      
      // Ignore cancelled requests
      if (error?.message?.includes('AbortError')) {
        return null
      }
      
      // Ignore rate limit errors (expected behavior)
      if (error?.message?.includes('Too many requests')) {
        return null
      }
      
      return event
    },
    
    // Don't send errors in development
    enabled: import.meta.env.MODE === 'production',
  })

  console.log('[Sentry] Error tracking initialized')
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
