import { ErrorBoundary as ReactErrorBoundary, type FallbackProps } from 'react-error-boundary'
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert'
import { Button } from '@/components/ui/button'
import { AlertTriangle, RotateCcw, Home } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import type { ReactNode, ReactElement } from 'react'

/**
 * Error fallback component shown when an error is caught.
 * Handles both chunk load errors and general runtime errors.
 */
function ErrorFallbackUI({ error, resetErrorBoundary }: FallbackProps) {
  const { t } = useTranslation()
  const isChunkLoadError = error?.message?.includes('Loading chunk') || 
                           error?.message?.includes('Failed to fetch dynamically imported module') ||
                           error?.name === 'ChunkLoadError'

  const handleGoHome = () => {
    resetErrorBoundary()
    window.location.href = '/'
  }

  return (
    <div className="min-h-[50vh] flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <Alert variant="destructive" className="mb-6">
          <AlertTriangle className="h-5 w-5" />
          <AlertTitle className="ml-2">
            {isChunkLoadError ? t('errorBoundary.failedToLoadTool') : t('errorBoundary.somethingWentWrong')}
          </AlertTitle>
          <AlertDescription className="mt-2">
            {isChunkLoadError 
              ? t('errorBoundary.toolFailedToLoad')
              : t('errorBoundary.unexpectedError')
            }
          </AlertDescription>
        </Alert>

        {/* Error details in development */}
        {import.meta.env.DEV && error && (
          <div className="bg-card border rounded-lg p-4 mb-6">
            <h3 className="font-semibold text-sm text-muted-foreground mb-2">
              {t('errorBoundary.errorDetails')}
            </h3>
            <pre className="text-xs text-destructive bg-muted/50 p-3 rounded border overflow-auto max-h-32">
              {error.name}: {error.message}
            </pre>
          </div>
        )}

        <div className="flex gap-3">
          <Button
            onClick={resetErrorBoundary}
            className="flex-1"
            variant="outline"
          >
            <RotateCcw className="h-4 w-4 mr-2" />
            {t('common.tryAgain')}
          </Button>
          <Button
            onClick={handleGoHome}
            className="flex-1"
            variant="default"
          >
            <Home className="h-4 w-4 mr-2" />
            {t('errorBoundary.goHome')}
          </Button>
        </div>
      </div>
    </div>
  )
}

interface ErrorBoundaryProps {
  children: ReactNode
  fallback?: ReactNode
}

/**
 * ErrorBoundary component that catches JavaScript errors anywhere in child component tree.
 * Prevents the entire app from crashing (White Screen of Death) when a component fails.
 * Particularly useful for catching errors from lazy-loaded chunks that fail to load.
 * 
 * Uses react-error-boundary under the hood for React 19 compatibility.
 */
export function ErrorBoundary({ children, fallback }: ErrorBoundaryProps) {
  const handleError = (error: Error, info: { componentStack?: string | null }) => {
    // Log error details for debugging
    console.error('ErrorBoundary caught an error:', error)
    if (info.componentStack) {
      console.error('Component stack:', info.componentStack)
    }
    // In production, you could send this to an error reporting service
    // e.g., Sentry, LogRocket, etc.
  }

  if (fallback) {
    return (
      <ReactErrorBoundary 
        fallback={fallback as ReactElement}
        onError={handleError}
      >
        {children}
      </ReactErrorBoundary>
    )
  }

  return (
    <ReactErrorBoundary 
      FallbackComponent={ErrorFallbackUI}
      onError={handleError}
    >
      {children}
    </ReactErrorBoundary>
  )
}

export default ErrorBoundary
