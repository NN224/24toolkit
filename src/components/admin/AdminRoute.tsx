import { Navigate } from 'react-router-dom'
import { useAdminAuth } from '@/hooks/useAdminAuth'
import { Loader2 } from 'lucide-react'

interface AdminRouteProps {
  children: React.ReactNode
}

export function AdminRoute({ children }: AdminRouteProps) {
  const { isAdmin, isLoading, user } = useAdminAuth()

  // Loading state
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <Loader2 className="w-12 h-12 animate-spin text-purple-500 mx-auto mb-4" />
          <p className="text-muted-foreground">Checking permissions...</p>
        </div>
      </div>
    )
  }

  // Not logged in
  if (!user) {
    return <Navigate to="/sign-in?redirect=/admin" replace />
  }

  // Not admin
  if (!isAdmin) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background px-4">
        <div className="text-center max-w-md">
          <div className="text-6xl mb-4">🔒</div>
          <h1 className="text-3xl font-bold mb-2 text-foreground">Access Denied</h1>
          <p className="text-muted-foreground mb-6">
            You don't have permission to access the admin panel.
          </p>
          <a 
            href="/"
            className="inline-block px-6 py-3 bg-gradient-to-r from-purple-600 to-sky-500 text-white rounded-xl font-semibold hover:opacity-90 transition-opacity"
          >
            Go Back Home
          </a>
        </div>
      </div>
    )
  }

  // Admin access granted
  return <>{children}</>
}
