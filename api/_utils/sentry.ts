/**
 * Sentry Error Tracking for Backend (Serverless Functions)
 * 
 * Initialize once per cold start, captures errors from API routes.
 * Get your DSN from: https://sentry.io/
 */

import * as Sentry from '@sentry/node';

let isInitialized = false;

/**
 * Initialize Sentry for backend
 * Call this at the start of each serverless function
 */
export function initSentryBackend() {
  if (isInitialized) return;
  
  const dsn = process.env.SENTRY_DSN;
  
  if (!dsn) {
    console.log('[Sentry Backend] No DSN configured, error tracking disabled');
    return;
  }

  Sentry.init({
    dsn,
    environment: process.env.NODE_ENV || 'development',
    
    // Performance monitoring
    tracesSampleRate: process.env.NODE_ENV === 'production' ? 0.1 : 1.0,
    
    // Filter out non-critical errors
    beforeSend(event, hint) {
      const error = hint.originalException;
      
      // Ignore rate limit errors (expected behavior)
      if (error instanceof Error && error.message?.includes('Too many requests')) {
        return null;
      }
      
      // Ignore auth errors (user not logged in)
      if (error instanceof Error && error.message?.includes('Unauthorized')) {
        return null;
      }
      
      return event;
    },
  });

  isInitialized = true;
  console.log('[Sentry Backend] Error tracking initialized');
}

/**
 * Capture an error with context
 */
export function captureBackendError(
  error: Error | unknown,
  context?: {
    endpoint?: string;
    userId?: string;
    extra?: Record<string, unknown>;
  }
) {
  if (!isInitialized) return;

  Sentry.withScope((scope) => {
    if (context?.endpoint) {
      scope.setTag('endpoint', context.endpoint);
    }
    if (context?.userId) {
      scope.setUser({ id: context.userId });
    }
    if (context?.extra) {
      scope.setExtras(context.extra);
    }
    
    Sentry.captureException(error);
  });
}

/**
 * Wrap an async handler with error tracking
 */
export function withSentry<T extends (...args: any[]) => Promise<any>>(
  handler: T,
  endpoint: string
): T {
  return (async (...args: Parameters<T>) => {
    initSentryBackend();
    
    try {
      return await handler(...args);
    } catch (error) {
      captureBackendError(error, { endpoint });
      throw error;
    }
  }) as T;
}

/**
 * Flush pending events (call before function ends)
 */
export async function flushSentry(timeout = 2000): Promise<void> {
  if (!isInitialized) return;
  await Sentry.flush(timeout);
}

export { Sentry };
