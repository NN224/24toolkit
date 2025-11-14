import { useState } from 'react'
import { toast } from 'sonner'
import { callAI } from '@/lib/ai'
import type { AIProvider } from '@/components/ai/AIProviderSelector'

interface UseAIOptions {
  provider: AIProvider
  onSuccess?: (result: string) => void
  onError?: (error: Error) => void
  successMessage?: string
  errorMessage?: string
}

/**
 * Custom hook for handling AI operations with loading state, error handling, and streaming
 * @param options Configuration options for AI calls
 * @returns Object with loading state and a function to call AI
 */
export function useAI(options: UseAIOptions) {
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState('')

  const execute = async (
    prompt: string,
    onStream?: (text: string) => void
  ): Promise<string> => {
    setLoading(true)
    setResult('')

    try {
      const response = await callAI(prompt, options.provider, (accumulatedText) => {
        setResult(accumulatedText)
        onStream?.(accumulatedText)
      })

      if (options.successMessage) {
        toast.success(options.successMessage)
      }

      options.onSuccess?.(response)
      return response
    } catch (error) {
      console.error('AI error:', error)
      const errorMsg = error instanceof Error ? error.message : (options.errorMessage || 'AI request failed')
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
    execute
  }
}
