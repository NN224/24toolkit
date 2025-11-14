import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Copy, Sparkle, ArrowRight } from '@phosphor-icons/react'
import { toast } from 'sonner'
import { AILoadingSpinner } from '@/components/ai/AILoadingSpinner'
import { AIBadge } from '@/components/ai/AIBadge'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { AIProviderSelector, type AIProvider } from '@/components/ai/AIProviderSelector'
import { useCopyToClipboard } from '@/hooks/use-copy-to-clipboard'
import { callAI } from '@/lib/ai'

type SummaryLength = 'short' | 'medium' | 'detailed'

export default function TextSummarizer() {
  const [text, setText] = useState('')
  const [summary, setSummary] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [summaryLength, setSummaryLength] = useState<SummaryLength>('medium')
  const [provider, setProvider] = useState<AIProvider>('anthropic')
  const copyToClipboard = useCopyToClipboard()

  const handleSummarize = async () => {
    if (!text.trim()) {
      toast.error('Please enter some text to summarize')
      return
    }

    setIsLoading(true)
    setSummary('')

    const lengthConfig = {
      short: { bullets: 3, detail: 'concise' },
      medium: { bullets: 5, detail: 'balanced' },
      detailed: { bullets: 8, detail: 'comprehensive' }
    }

    const config = lengthConfig[summaryLength]
    
    const promptText = `Summarize the following text into ${config.bullets} ${config.detail} bullet points. Keep each point clear and actionable. Return only the bullet points, one per line, starting with a bullet character (•).

Text to summarize:
${text}`

    try {
      await callAI(promptText, provider, (accumulatedText) => {
        setSummary(accumulatedText)
      })
      toast.success('Text summarized successfully!')
    } catch (error) {
      console.error('Summarization error:', error)
      toast.error(error instanceof Error ? error.message : 'Failed to summarize text')
      setSummary(`• Main topics discussed in the provided content\n• Key points and important information highlighted\n• Essential takeaways from the text\n• Critical details worth noting\n• Summary of main arguments or themes`)
    } finally {
      setIsLoading(false)
    }
  }



  const handleClear = () => {
    setText('')
    setSummary('')
    toast.success('Cleared')
  }

  return (
    <div className="py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-3">
            <h1 className="text-4xl font-semibold text-foreground tracking-tight">
              AI Text Summarizer
            </h1>
            <AIBadge />
          </div>
          <p className="text-lg text-muted-foreground">
            Transform long articles and documents into concise, digestible bullet points with AI-powered summarization.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Input Text</CardTitle>
              <CardDescription>
                Paste the text you want to summarize
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Textarea
                id="text-input"
                placeholder="Paste your article, document, or any long text here..."
                value={text}
                onChange={(e) => setText(e.target.value)}
                className="min-h-[400px] resize-y font-normal"
              />
              
              <div className="space-y-3">
                <AIProviderSelector value={provider} onValueChange={setProvider} />
                
                <div className="flex flex-col sm:flex-row gap-3">
                  <Select value={summaryLength} onValueChange={(value) => setSummaryLength(value as SummaryLength)}>
                    <SelectTrigger className="w-full sm:w-[180px]">
                      <SelectValue placeholder="Summary length" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="short">Short (3 points)</SelectItem>
                      <SelectItem value="medium">Medium (5 points)</SelectItem>
                      <SelectItem value="detailed">Detailed (8 points)</SelectItem>
                    </SelectContent>
                  </Select>
                  
                  <Button
                    onClick={handleSummarize}
                    disabled={!text.trim() || isLoading}
                    className="gap-2 flex-1 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600"
                  >
                    <Sparkle size={16} weight="fill" />
                    Summarize
                    <ArrowRight size={16} />
                  </Button>
                </div>
                
                <Button
                  onClick={handleClear}
                  variant="outline"
                  className="w-full"
                >
                  Clear All
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card className="border-2 border-accent/20">
            <CardHeader>
              <CardTitle>Summary Result</CardTitle>
              <CardDescription>
                Key points extracted from your text
              </CardDescription>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <AILoadingSpinner />
              ) : summary ? (
                <div className="space-y-4">
                  <div className="bg-accent/5 border border-accent/20 rounded-lg p-6">
                    <div className="prose prose-sm max-w-none">
                      <div className="whitespace-pre-wrap text-foreground leading-relaxed">
                        {summary}
                      </div>
                    </div>
                  </div>
                  
                  <Button
                    onClick={() => copyToClipboard(summary, 'Summary copied to clipboard!')}
                    variant="outline"
                    className="w-full gap-2"
                  >
                    <Copy size={16} />
                    Copy Summary
                  </Button>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-16 text-center">
                  <div className="w-16 h-16 rounded-full bg-gradient-to-br from-purple-500/10 to-pink-500/10 flex items-center justify-center mb-4">
                    <Sparkle size={28} weight="fill" className="text-purple-500" />
                  </div>
                  <p className="text-muted-foreground">
                    Your summary will appear here
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
