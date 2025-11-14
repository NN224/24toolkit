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
    anthropic: 'claude-3-haiku-20240307',
    groq: 'llama3-8b-8192'
  }

  const response = await fetch('/api/ai', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      prompt: prompt,
      provider: provider,
      model: modelMap[provider]
    }),
  })

  if (!response.ok) {
    const errorData = await response.json()
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
