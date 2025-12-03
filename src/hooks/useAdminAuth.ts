import { useMemo } from 'react'
import { useAuth } from '@/contexts/AuthContext'

// Admin emails - يمكنك تغييرهم
const ADMIN_EMAILS = [
  'info@24toolkit.com',
  'owner@nnh.ae',
  // أضف emails الـ admins هنا
]

export function useAdminAuth() {
  const { user } = useAuth()

  const isAdmin = useMemo(() => {
    if (!user?.email) return false
    
    // Check if user email is in admin list
    return ADMIN_EMAILS.includes(user.email.toLowerCase())
  }, [user])

  const isLoading = !user && typeof user === 'undefined'

  return {
    isAdmin,
    isLoading,
    user
  }
}
