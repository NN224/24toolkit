import { ReactNode, useState, useEffect } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { LoginModal } from './LoginModal'
import { CircleNotch } from '@phosphor-icons/react'

interface ProtectedRouteProps {
  children: ReactNode
  requireAuth?: boolean
}

export function ProtectedRoute({ children, requireAuth = true }: ProtectedRouteProps) {
  const { user, loading } = useAuth()
  const [showLoginModal, setShowLoginModal] = useState(false)

  useEffect(() => {
    if (!loading && requireAuth && !user) {
      setShowLoginModal(true)
    }
  }, [user, loading, requireAuth])

  // Show loading spinner while checking auth
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <CircleNotch size={48} className="animate-spin text-accent mx-auto mb-4" />
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    )
  }

  // If auth required and user not signed in, show modal
  if (requireAuth && !user) {
    return (
      <>
        {/* Show blurred content behind modal */}
        <div className="filter blur-sm pointer-events-none select-none">
          {children}
        </div>
        
        <LoginModal
          isOpen={showLoginModal}
          onClose={() => {
            setShowLoginModal(false)
            // Redirect to home if they close without signing in
            window.location.href = '/'
          }}
          redirectPath={window.location.pathname}
        />
      </>
    )
  }

  // User is authenticated or auth not required
  return <>{children}</>
}
