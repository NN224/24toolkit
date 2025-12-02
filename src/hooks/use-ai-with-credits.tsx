/**
 * Enhanced hook for AI calls with credit handling, better UX, and confetti celebration
 */
import { useState } from 'react'
import { callAI, AIError, type AIProvider } from '@/lib/ai'
import { toast } from 'sonner'
import { useSubscription } from '@/contexts/SubscriptionContext'
import Confetti from '@/components/Confetti'

interface UseAIOptions {
  onSuccess?: (result: string) => void
  onError?: (error: Error) => void
  successMessage?: string
  celebrateOnSuccess?: boolean
}

export function useAIWithCredits(options: UseAIOptions = {}) {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<Error | null>(null)
  const [showConfetti, setShowConfetti] = useState(false)
  const { refreshSubscription, openUpgradeModal } = useSubscription()

  const execute = async (
    prompt: string,
    provider: AIProvider = 'anthropic',
    onUpdate?: (text: string) => void
  ) => {
    setIsLoading(true)
    setError(null)
    setShowConfetti(false)

    try {
      const result = await callAI(prompt, provider, onUpdate)
      
      // Refresh credits after successful AI call
      await refreshSubscription()
      
      // Celebrate with confetti! 🎉
      if (options.celebrateOnSuccess !== false) {
        setShowConfetti(true)
        setTimeout(() => setShowConfetti(false), 3000)
      }
      
      if (options.successMessage) {
        toast.success(options.successMessage, {
          icon: '🎉',
        })
      }
      
      if (options.onSuccess) {
        options.onSuccess(result)
      }
      
      return result
    } catch (err) {
      const error = err as Error | AIError
      setError(error)
      
      // Handle credit exhaustion with custom UI
      if (error instanceof AIError && error.code === 'CREDITS_EXHAUSTED') {
        // Show upgrade modal with custom message
        toast.error(
          <div className="flex flex-col gap-2">
            <p className="font-semibold">Daily Limit Reached! 🚀</p>
            <p className="text-sm">You've used all your free AI requests for today.</p>
            <button
              onClick={() => {
                toast.dismiss()
                openUpgradeModal()
              }}
              className="mt-2 px-3 py-1.5 bg-gradient-to-r from-purple-600 to-sky-500 text-white rounded-lg text-sm font-medium hover:opacity-90 transition-all"
            >
              Upgrade Now
            </button>
          </div>,
          {
            duration: 8000,
            position: 'top-center',
          }
        )
        
        // Also trigger upgrade modal after a short delay
        setTimeout(() => {
          openUpgradeModal()
        }, 500)
        
        if (options.onError) {
          options.onError(error)
        }
        return null
      }
      
      // Handle auth errors
      if (error instanceof AIError && error.code === 'AUTH_FAILED') {
        toast.error(
          <div className="flex flex-col gap-2">
            <p className="font-semibold">Sign In Required</p>
            <p className="text-sm">Please sign in to use AI features.</p>
            <button
              onClick={() => {
                toast.dismiss()
                window.dispatchEvent(new CustomEvent('open-login-modal'))
              }}
              className="mt-2 px-3 py-1.5 bg-gradient-to-r from-purple-600 to-sky-500 text-white rounded-lg text-sm font-medium hover:opacity-90 transition-all"
            >
              Sign In
            </button>
          </div>,
          {
            duration: 6000,
            position: 'top-center',
          }
        )
        
        if (options.onError) {
          options.onError(error)
        }
        return null
      }
      
      // Handle service unavailable
      if (error instanceof AIError && error.code === 'SERVICE_UNAVAILABLE') {
        toast.error(
          <div className="flex flex-col gap-1">
            <p className="font-semibold">Service Temporarily Unavailable</p>
            <p className="text-sm">All AI providers are currently busy. Please try again in a few moments.</p>
          </div>,
          {
            duration: 5000,
          }
        )
        
        if (options.onError) {
          options.onError(error)
        }
        return null
      }
      
      // Generic error handling
      const errorMessage = error instanceof Error ? error.message : 'An unexpected error occurred'
      toast.error(errorMessage)
      
      if (options.onError) {
        options.onError(error)
      }
      
      return null
    } finally {
      setIsLoading(false)
    }
  }

  return {
    execute,
    isLoading,
    error,
    ConfettiEffect: () => <Confetti trigger={showConfetti} />,
  }
}
