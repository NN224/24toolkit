import { auth } from './firebase'

/**
 * AI API Error with additional metadata
 */
export class AIError extends Error {
  code: string
  creditsRemaining?: number
  isPremium?: boolean

  constructor(message: string, code: string, creditsRemaining?: number, isPremium?: boolean) {
    super(message)
    this.name = 'AIError'
    this.code = code
    this.creditsRemaining = creditsRemaining
    this.isPremium = isPremium
  }
}

/**
 * Get the current user's Firebase ID token
 */
async function getAuthToken(): Promise<string | null> {
  const user = auth.currentUser
  if (!user) return null
  
  try {
    return await user.getIdToken()
  } catch (error) {
    console.error('Error getting auth token:', error)
    return null
  }
}

/**
 * Supported AI providers
 */
export type AIProvider = 'anthropic' | 'groq' | 'gemini' | 'openrouter'

/**
 * Call the AI API with streaming support and automatic fallback
 * @param prompt - The prompt to send to the AI
 * @param provider - The preferred AI provider (will fallback to others if unavailable)
 * @param onUpdate - Callback function called with accumulated text as it streams
 * @returns The final accumulated text
 */
export async function callAI(
  prompt: string,
  provider: AIProvider = 'anthropic',
  onUpdate?: (text: string) => void
): Promise<string> {
  // Get auth token for credit system
  const authToken = await getAuthToken()
  
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  }
  
  if (authToken) {
    headers['Authorization'] = `Bearer ${authToken}`
  }

  const response = await fetch('/api/ai', {
    method: 'POST',
    headers,
    body: JSON.stringify({
      prompt,
      provider,
    }),
  })

  if (!response.ok) {
    let errorData
    try {
      errorData = await response.json()
    } catch {
      throw new Error(`HTTP error ${response.status}`)
    }
    
    // Handle specific error codes
    if (errorData.error === 'NO_CREDITS' || errorData.code === 'CREDITS_EXHAUSTED') {
      throw new AIError(
        errorData.message || errorData.error || 'Daily limit reached',
        'CREDITS_EXHAUSTED',
        errorData.remainingCredits || errorData.creditsRemaining,
        errorData.isPremium
      )
    }
    
    if (errorData.error === 'AUTH_FAILED' || errorData.code === 'AUTH_FAILED') {
      throw new AIError(
        errorData.message || errorData.error || 'Authentication failed',
        'AUTH_FAILED'
      )
    }
    
    if (errorData.error === 'ALL_PROVIDERS_FAILED') {
      throw new AIError(
        errorData.message || 'All AI providers are currently unavailable',
        'SERVICE_UNAVAILABLE'
      )
    }
    
    throw new Error(errorData.message || errorData.error || 'Failed to process AI request')
  }

  // Handle SSE streaming response
  const reader = response.body?.getReader()
  const decoder = new TextDecoder()
  let accumulatedText = ''
  let usedProvider: string | undefined
  let buffer = ''

  if (!reader) {
    throw new Error('No response body')
  }

  while (true) {
    const { done, value } = await reader.read()
    if (done) break

    buffer += decoder.decode(value, { stream: true })
    const lines = buffer.split('\n')
    
    // Keep the last incomplete line in the buffer
    buffer = lines.pop() || ''

    for (const line of lines) {
      const trimmedLine = line.trim()
      if (!trimmedLine || !trimmedLine.startsWith('data: ')) continue
      
      const data = trimmedLine.slice(6).trim()
      if (data === '[DONE]') continue
      
      try {
        const parsed = JSON.parse(data)
        
        if (parsed.text) {
          accumulatedText += parsed.text
          if (onUpdate) {
            onUpdate(accumulatedText)
          }
        }
        
        if (parsed.done && parsed.provider) {
          usedProvider = parsed.provider
        }
        
        if (parsed.error) {
          throw new Error(parsed.message || 'Stream error')
        }
      } catch (parseError) {
        // Skip invalid JSON lines (not an error, just incomplete data)
        if (data && !data.startsWith('{')) {
          // This might be raw text from an older format
          accumulatedText += data
          if (onUpdate) {
            onUpdate(accumulatedText)
          }
        }
      }
    }
  }
  
  // Process any remaining data in buffer
  if (buffer.trim().startsWith('data: ')) {
    try {
      const data = buffer.trim().slice(6).trim()
      const parsed = JSON.parse(data)
      if (parsed.text) {
        accumulatedText += parsed.text
        if (onUpdate) {
          onUpdate(accumulatedText)
        }
      }
    } catch {
      // Ignore final buffer parsing errors
    }
  }

  if (!accumulatedText) {
    throw new Error('No response from AI')
  }

  // Log which provider was used (for debugging)
  if (usedProvider) {
    console.debug(`AI response from: ${usedProvider}`)
  }

  return accumulatedText
}
