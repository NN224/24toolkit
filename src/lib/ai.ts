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
 * Call the AI API with streaming support
 * @param prompt - The prompt to send to the AI
 * @param provider - The AI provider ('anthropic' or 'groq')
 * @param onUpdate - Callback function called with accumulated text as it streams
 * @returns The final accumulated text
 */
export async function callAI(
  prompt: string,
  provider: 'anthropic' | 'groq',
  onUpdate?: (text: string) => void
): Promise<string> {
  const modelMap = {
    anthropic: 'claude-3-5-haiku-20241022',
    groq: 'llama-3.3-70b-versatile'
  }

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
      prompt: prompt,
      provider: provider,
      model: modelMap[provider]
    }),
  })

  if (!response.ok) {
    const errorData = await response.json()
    
    // Handle specific error codes
    if (errorData.code === 'CREDITS_EXHAUSTED') {
      throw new AIError(
        errorData.error || 'Daily limit reached',
        'CREDITS_EXHAUSTED',
        errorData.creditsRemaining,
        errorData.isPremium
      )
    }
    
    if (errorData.code === 'AUTH_REQUIRED') {
      throw new AIError(
        errorData.error || 'Please sign in to use AI features',
        'AUTH_REQUIRED'
      )
    }
    
    if (errorData.code === 'AUTH_FAILED') {
      throw new AIError(
        errorData.error || 'Authentication failed',
        'AUTH_FAILED'
      )
    }
    
    throw new Error(errorData.error || 'Failed to process AI request')
  }

  // Handle streaming response
  const reader = response.body?.getReader()
  const decoder = new TextDecoder()
  let accumulatedText = ''

  if (!reader) {
    throw new Error('No response body')
  }

  while (true) {
    const { done, value } = await reader.read()
    if (done) break

    const chunk = decoder.decode(value)
    const lines = chunk.split('\n')

    for (const line of lines) {
      if (line.startsWith('data: ')) {
        const data = line.slice(6)
        if (data === '[DONE]') {
          break
        }
        
        try {
          const parsed = JSON.parse(data)
          if (parsed.text) {
            accumulatedText += parsed.text
            if (onUpdate) {
              onUpdate(accumulatedText)
            }
          } else if (parsed.error) {
            throw new Error(parsed.error)
          }
        } catch (parseError) {
          // Skip invalid JSON lines
        }
      }
    }
  }

  if (!accumulatedText) {
    throw new Error('No response from AI')
  }

  return accumulatedText
}
