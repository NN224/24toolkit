import { ReactNode, useEffect } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { useNavigate, useLocation } from 'react-router-dom'
import { CircleNotch } from '@phosphor-icons/react'
import { useTranslation } from 'react-i18next'

interface ProtectedRouteProps {
  children: ReactNode
  requireAuth?: boolean
}

export function ProtectedRoute({ children, requireAuth = true }: ProtectedRouteProps) {
  const { t } = useTranslation()
  const { user, loading } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()

  useEffect(() => {
    if (!loading && requireAuth && !user) {
      // Redirect to sign-in page with current path as redirect parameter
      navigate(`/sign-in?redirect=${encodeURIComponent(location.pathname)}`)
    }
  }, [user, loading, requireAuth, navigate, location.pathname])

  // Show loading spinner while checking auth
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <CircleNotch size={48} className="animate-spin text-accent mx-auto mb-4" />
          <p className="text-muted-foreground">{t('common.loading')}</p>
        </div>
      </div>
    )
  }

  // If auth required and user not signed in, redirect happens in useEffect
  // Show loading state briefly while redirecting
  if (requireAuth && !user) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <CircleNotch size={48} className="animate-spin text-accent mx-auto mb-4" />
          <p className="text-muted-foreground">Redirecting to sign in...</p>
        </div>
      </div>
    )
  }

  // User is authenticated or auth not required
  return <>{children}</>
}
