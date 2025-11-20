import { useState, useMemo } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Trash } from '@phosphor-icons/react'
import { toast } from 'sonner'
import { useSEO } from '@/hooks/useSEO'
import { getPageMetadata } from '@/lib/seo-metadata'

export default function WordFrequencyAnalyzer() {
  // Set SEO metadata
  const metadata = getPageMetadata('word-frequency-analyzer')
  useSEO(metadata)

  const [text, setText] = useState('')

  const wordFrequency = useMemo(() => {
    if (!text.trim()) return []

    const words = text
      .toLowerCase()
      .replace(/[^\w\s]/g, '')
      .split(/\s+/)
      .filter(word => word.length > 0)

    const frequency: Record<string, number> = {}
    words.forEach(word => {
      frequency[word] = (frequency[word] || 0) + 1
    })

    return Object.entries(frequency)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 10)
  }, [text])

  const handleClear = () => {
    setText('')
    toast.success('Text cleared')
  }

  return (
    <div className="py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl font-semibold text-foreground mb-3 tracking-tight">
            Word Frequency Analyzer
          </h1>
          <p className="text-lg text-muted-foreground">
            Discover the most frequently used words in your text. Shows top 10 words.
          </p>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Enter Your Text</CardTitle>
              <CardDescription>
                Paste or type text to analyze word frequency
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Textarea
                id="text-input"
                placeholder="Type or paste your text here..."
                value={text}
                onChange={(e) => setText(e.target.value)}
                className="min-h-[200px] resize-y font-normal"
              />
              
              <div className="flex gap-2">
                <Button
                  onClick={handleClear}
                  variant="outline"
                  className="gap-2"
                >
                  <Trash size={16} />
                  Clear
                </Button>
              </div>
            </CardContent>
          </Card>

          {wordFrequency.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Top 10 Most Frequent Words</CardTitle>
                <CardDescription>
                  Words ranked by frequency of occurrence
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {wordFrequency.map(([word, count], index) => (
                    <div key={word} className="flex items-center justify-between p-3 rounded-lg bg-muted/30 border border-border">
                      <div className="flex items-center gap-4">
                        <div className="w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-semibold text-sm">
                          {index + 1}
                        </div>
                        <span className="font-medium text-foreground">{word}</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="w-32 h-2 bg-muted rounded-full overflow-hidden">
                          <div 
                            className="h-full bg-primary transition-all"
                            style={{ width: `${(count / wordFrequency[0][1]) * 100}%` }}
                          />
                        </div>
                        <span className="text-muted-foreground font-medium min-w-[3rem] text-right">
                          {count} {count === 1 ? 'time' : 'times'}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  )
}
