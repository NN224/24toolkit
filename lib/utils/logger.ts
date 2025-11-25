/**
 * Production-safe logger utility
 * Only logs in development or when explicitly enabled
 */

const isDevelopment = process.env.NODE_ENV === "development"
const isDebugEnabled = process.env.DEBUG === "true"

export const logger = {
  log: (...args: unknown[]) => {
    if (isDevelopment || isDebugEnabled) {
      console.log(...args)
    }
  },
  error: (...args: unknown[]) => {
    // Always log errors for monitoring
    console.error(...args)
  },
  warn: (...args: unknown[]) => {
    if (isDevelopment || isDebugEnabled) {
      console.warn(...args)
    }
  },
  debug: (...args: unknown[]) => {
    // Only log debug info in development
    if (isDevelopment) {
      console.log("[DEBUG]", ...args)
    }
  },
}

