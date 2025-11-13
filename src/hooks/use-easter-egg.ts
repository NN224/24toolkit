import { useEffect } from 'react'
import { toast } from 'sonner'

const quotes = [
  "We built 24Toolkit because developers deserve better tools. 🚀",
  "Every pixel matters. Every interaction counts. ✨",
  "In a world of complexity, we choose simplicity. 🎯",
  "Tools should work for you, not against you. 💪",
  "The best tools are invisible until you need them. 🌟",
  "We believe in making the web more accessible, one tool at a time. 🌐",
  "Quality over quantity, always. But we do have 80+ tools. 😉"
]

export function useEasterEgg() {
  useEffect(() => {
    let keySequence: string[] = []
    const targetSequence = ['Control', 'Alt', 'o']

    const handleKeyDown = (e: KeyboardEvent) => {
      keySequence.push(e.key)
      
      if (keySequence.length > targetSequence.length) {
        keySequence.shift()
      }

      if (
        keySequence.length === targetSequence.length &&
        keySequence.every((key, index) => key === targetSequence[index])
      ) {
        const randomQuote = quotes[Math.floor(Math.random() * quotes.length)]
        toast.success('Easter Egg Found! 🥚', {
          description: randomQuote,
          duration: 5000
        })
        keySequence = []
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [])
}
