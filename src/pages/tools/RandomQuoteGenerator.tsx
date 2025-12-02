import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Sparkle, Copy } from '@phosphor-icons/react'
import { toast } from 'sonner'
import { motion } from 'framer-motion'
import { useSEO } from '@/hooks/useSEO'
import { getPageMetadata } from '@/lib/seo-metadata'

const quotes = [
  { text: "The only way to do great work is to love what you do.", author: "Steve Jobs" },
  { text: "Innovation distinguishes between a leader and a follower.", author: "Steve Jobs" },
  { text: "Be yourself; everyone else is already taken.", author: "Oscar Wilde" },
  { text: "Two things are infinite: the universe and human stupidity; and I'm not sure about the universe.", author: "Albert Einstein" },
  { text: "The best time to plant a tree was 20 years ago. The second best time is now.", author: "Chinese Proverb" },
  { text: "Your time is limited, don't waste it living someone else's life.", author: "Steve Jobs" },
  { text: "The only impossible journey is the one you never begin.", author: "Tony Robbins" },
  { text: "Life is what happens when you're busy making other plans.", author: "John Lennon" },
  { text: "Success is not final, failure is not fatal: it is the courage to continue that counts.", author: "Winston Churchill" },
  { text: "Believe you can and you're halfway there.", author: "Theodore Roosevelt" },
  { text: "The future belongs to those who believe in the beauty of their dreams.", author: "Eleanor Roosevelt" },
  { text: "It is during our darkest moments that we must focus to see the light.", author: "Aristotle" },
  { text: "Don't watch the clock; do what it does. Keep going.", author: "Sam Levenson" },
  { text: "Keep your face always toward the sunshine—and shadows will fall behind you.", author: "Walt Whitman" },
  { text: "The only limit to our realization of tomorrow is our doubts of today.", author: "Franklin D. Roosevelt" }
]

export default function RandomQuoteGenerator() {
  const { t } = useTranslation()
  
  // Set SEO metadata
  const metadata = getPageMetadata('random-quote-generator')
  useSEO({ ...metadata, canonicalPath: '/tools/random-quote-generator' })

  const [quote, setQuote] = useState(quotes[0])
  const [key, setKey] = useState(0)

  const generateQuote = () => {
    const randomIndex = Math.floor(Math.random() * quotes.length)
    setQuote(quotes[randomIndex])
    setKey(prev => prev + 1)
    toast.success(t('tools.common.success'))
  }

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(`"${quote.text}" - ${quote.author}`)
      toast.success(t('tools.common.copied'))
    } catch {
      toast.error(t('tools.common.error'))
    }
  }

  return (
    <div className="py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl font-semibold text-foreground mb-3 tracking-tight">
            {t('tools.randomQuoteGenerator.name')}
          </h1>
          <p className="text-lg text-muted-foreground">
            {t('tools.randomQuoteGenerator.description')}
          </p>
        </div>

        <div className="space-y-6">
          <Card>
            <CardContent className="pt-8">
              <motion.div
                key={key}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="space-y-6"
              >
                <div className="text-center space-y-4">
                  <p className="text-2xl md:text-3xl font-serif italic text-foreground leading-relaxed">
                    "{quote.text}"
                  </p>
                  <p className="text-lg text-muted-foreground">
                    — {quote.author}
                  </p>
                </div>

                <div className="flex gap-2 justify-center pt-4">
                  <Button onClick={generateQuote} size="lg" className="gap-2">
                    <Sparkle size={20} />
                    {t('tools.randomQuoteGenerator.newQuote')}
                  </Button>
                  <Button onClick={handleCopy} variant="outline" size="lg" className="gap-2">
                    <Copy size={20} />
                    {t('tools.common.copy')}
                  </Button>
                </div>
              </motion.div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
