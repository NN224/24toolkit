import { useState } from 'react'
import { toast } from 'sonner'
import { callAI, AIError, type AIProvider } from '@/lib/ai'
import { useAuth } from '@/contexts/AuthContext'
import { openSubscriptionModal } from '@/components/SubscriptionModal'
import i18n from '@/i18n'

interface UseAIOptions {
  provider: AIProvider
  onSuccess?: (result: string) => void
  onError?: (error: Error) => void
  successMessage?: string
  errorMessage?: string
}

/**
 * Custom hook for handling AI operations with loading state, error handling, streaming,
 * and credit system integration
 * @param options Configuration options for AI calls
 * @returns Object with loading state and a function to call AI
 */
export function useAI(options: UseAIOptions) {
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState('')
  const { user, userProfile, refreshUserProfile } = useAuth()

  const execute = async (
    prompt: string,
    onStream?: (text: string) => void
  ): Promise<string> => {
    // Check if user is logged in
    if (!user) {
      toast.error(i18n.t('ai.signInRequired'), {
        description: i18n.t('ai.signInDescription'),
        action: {
          label: i18n.t('common.signIn'),
          onClick: () => window.dispatchEvent(new CustomEvent('open-login-modal'))
        }
      })
      throw new AIError(i18n.t('ai.signInRequired'), 'AUTH_REQUIRED')
    }

    // Check credits locally before making API call (for non-premium users)
    if (userProfile && !userProfile.isPremium && userProfile.aiCredits <= 0) {
      // Open subscription/upgrade modal
      openSubscriptionModal()
      throw new AIError(i18n.t('ai.dailyLimitReached'), 'CREDITS_EXHAUSTED', 0, false)
    }

    setLoading(true)
    setResult('')

    try {
      const response = await callAI(prompt, options.provider, (accumulatedText) => {
        setResult(accumulatedText)
        onStream?.(accumulatedText)
      })

      // Refresh user profile to get updated credit count
      await refreshUserProfile()

      if (options.successMessage) {
        toast.success(options.successMessage)
      }

      options.onSuccess?.(response)
      return response
    } catch (error) {
      console.error('AI error:', error)
      
      // Handle specific AI errors
      if (error instanceof AIError) {
        if (error.code === 'CREDITS_EXHAUSTED') {
          // Open subscription/upgrade modal
          openSubscriptionModal()
        } else if (error.code === 'AUTH_REQUIRED') {
          toast.error(i18n.t('common.signIn'), {
            description: i18n.t('ai.signInToUse'),
            action: {
              label: i18n.t('common.signIn'),
              onClick: () => window.dispatchEvent(new CustomEvent('open-login-modal'))
            }
          })
        } else {
          toast.error(error.message)
        }
        options.onError?.(error)
        throw error
      }
      
      const errorMsg = error instanceof Error ? error.message : (options.errorMessage || i18n.t('ai.requestFailed'))
      toast.error(errorMsg)
      options.onError?.(error instanceof Error ? error : new Error(errorMsg))
      throw error
    } finally {
      setLoading(false)
    }
  }

  return {
    loading,
    result,
    execute,
    // Expose credit info for components that need it
    hasCredits: userProfile ? (userProfile.isPremium || userProfile.aiCredits > 0) : false,
    credits: userProfile?.aiCredits ?? 0,
    isPremium: userProfile?.isPremium ?? false
  }
}
