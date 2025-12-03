import { createRoot } from 'react-dom/client'
import { ErrorBoundary } from "react-error-boundary";
import "@github/spark/spark"
import { inject } from '@vercel/analytics'

import App from './App.tsx'
import { ErrorFallback } from './ErrorFallback.tsx'
import { initSentry, captureError } from './lib/sentry'

// Initialize i18n
import './i18n'

import "./main.css"
import "./styles/theme.css"
import "./index.css"

// Initialize Sentry error tracking
initSentry()

// Initialize Vercel Web Analytics
inject()

// Enhanced error handler that reports to Sentry
const handleError = (error: Error, info: { componentStack?: string }) => {
  captureError(error, { componentStack: info.componentStack })
  console.error('App Error:', error, info)
}

createRoot(document.getElementById('root')!).render(
  <ErrorBoundary FallbackComponent={ErrorFallback} onError={handleError}>
    <App />
  </ErrorBoundary>
)
