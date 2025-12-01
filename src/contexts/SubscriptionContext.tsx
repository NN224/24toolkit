import { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react'
import { useAuth } from './AuthContext'
import { 
  getUserSubscription, 
  useAICredit, 
  canUseAI,
  getCreditsDisplay,
  shouldShowAds,
  subscribeToSubscription,
  type UserSubscriptionData,
  type SubscriptionPlan,
  PLAN_LIMITS
} from '@/lib/subscription'

// ============================================
// Types
// ============================================

interface SubscriptionContextType {
  subscription: UserSubscriptionData | null
  loading: boolean
  
  // Credit management
  canUseAI: () => { allowed: boolean; reason?: string; remaining?: number }
  useCredit: () => Promise<{ success: boolean; remaining: number }>
  getCreditsDisplay: () => string
  
  // Plan info
  currentPlan: SubscriptionPlan
  isPro: boolean
  isUnlimited: boolean
  isPaid: boolean
  
  // Ads
  showAds: boolean
  
  // Actions
  refreshSubscription: () => Promise<void>
  openUpgradeModal: () => void
}

const SubscriptionContext = createContext<SubscriptionContextType | undefined>(undefined)

export function useSubscription() {
  const context = useContext(SubscriptionContext)
  if (!context) {
    throw new Error('useSubscription must be used within SubscriptionProvider')
  }
  return context
}

// ============================================
// Provider
// ============================================

interface SubscriptionProviderProps {
  children: ReactNode
}

export function SubscriptionProvider({ children }: SubscriptionProviderProps) {
  const { user } = useAuth()
  const [subscription, setSubscription] = useState<UserSubscriptionData | null>(null)
  const [loading, setLoading] = useState(true)

  // Fetch subscription data
  const fetchSubscription = useCallback(async () => {
    if (!user) {
      setSubscription(null)
      setLoading(false)
      return
    }

    try {
      const sub = await getUserSubscription(user.uid)
      setSubscription(sub)
    } catch (error) {
      console.error('Error fetching subscription:', error)
    } finally {
      setLoading(false)
    }
  }, [user])

  // Initial fetch and real-time updates
  useEffect(() => {
    if (!user) {
      setSubscription(null)
      setLoading(false)
      return
    }

    setLoading(true)
    
    // Subscribe to real-time updates
    const unsubscribe = subscribeToSubscription(user.uid, (sub) => {
      setSubscription(sub)
      setLoading(false)
    })

    // Initial fetch
    fetchSubscription()

    return unsubscribe
  }, [user, fetchSubscription])

  // Check if user can use AI
  const checkCanUseAI = useCallback(() => {
    if (!subscription) {
      return { allowed: false, reason: 'Please sign in to use AI tools' }
    }
    return canUseAI(subscription)
  }, [subscription])

  // Use one AI credit
  const useCredits = useCallback(async () => {
    if (!user) {
      return { success: false, remaining: 0 }
    }
    
    const result = await useAICredit(user.uid)
    
    // Refresh subscription after using credit
    if (result.success) {
      await fetchSubscription()
    }
    
    return result
  }, [user, fetchSubscription])

  // Get credits display
  const getCreditsStr = useCallback(() => {
    if (!subscription) return '0'
    return getCreditsDisplay(subscription)
  }, [subscription])

  // Open upgrade modal
  const openUpgradeModal = useCallback(() => {
    window.dispatchEvent(new CustomEvent('open-subscription-modal'))
  }, [])

  // Computed values
  const currentPlan = subscription?.odg || 'free'
  const isPro = currentPlan === 'pro'
  const isUnlimited = currentPlan === 'unlimited'
  const isPaid = isPro || isUnlimited
  const showAds = subscription ? shouldShowAds(subscription) : true

  const value: SubscriptionContextType = {
    subscription,
    loading,
    canUseAI: checkCanUseAI,
    useCredit: useCredits,
    getCreditsDisplay: getCreditsStr,
    currentPlan,
    isPro,
    isUnlimited,
    isPaid,
    showAds,
    refreshSubscription: fetchSubscription,
    openUpgradeModal,
  }

  return (
    <SubscriptionContext.Provider value={value}>
      {children}
    </SubscriptionContext.Provider>
  )
}

// Re-export for convenience
export { PLAN_LIMITS }
export type { SubscriptionPlan, UserSubscriptionData }
