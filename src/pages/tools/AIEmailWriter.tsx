import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Textarea } from '@/components/ui/textarea'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Envelope } from '@phosphor-icons/react'
import { toast } from 'sonner'
import { AIProviderSelector, type AIProvider } from '@/components/ai/AIProviderSelector'
import { AIResponseCard } from '@/components/ai/AIResponseCard'
import { callAI } from '@/lib/ai'
import { AI_PROMPTS, validatePromptInput } from '@/lib/ai-prompts'
import { useSEO } from '@/hooks/useSEO'
import { getPageMetadata } from '@/lib/seo-metadata'

type EmailMode = 'formal' | 'casual' | 'business'

export default function AIEmailWriter() {
  // Set SEO metadata
  const metadata = getPageMetadata('ai-email-writer')
  useSEO(metadata)

  const [topic, setTopic] = useState('')
  const [mode, setMode] = useState<EmailMode>('formal')
  const [generatedEmail, setGeneratedEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [provider, setProvider] = useState<AIProvider>('anthropic')
  const [isArabic, setIsArabic] = useState(false)

  // Detect if topic is Arabic
  useEffect(() => {
    setIsArabic(/[\u0600-\u06FF]/.test(topic))
  }, [topic])

  const generateEmail = async () => {
    if (!topic.trim()) {
      toast.error('Please enter an email topic')
      return
    }

    try {
      validatePromptInput(topic, 3, 500)
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Invalid input')
      return
    }

    setLoading(true)
    setGeneratedEmail('')
    
    try {
      const toneMap = {
        formal: 'formal',
        casual: 'friendly',
        business: 'professional'
      }
      
      const promptText = AI_PROMPTS.EMAIL_WRITER(topic, toneMap[mode])

      await callAI(promptText, provider, (accumulatedText) => {
        setGeneratedEmail(accumulatedText)
      })
      toast.success('Email generated successfully!')
    } catch (error) {
      console.error('Email generation error:', error)
      toast.error(error instanceof Error ? error.message : 'Failed to generate email. Please try again.')
    } finally {
      setLoading(false)
    }
  }



  return (
    <div className="container mx-auto max-w-4xl px-4 py-8 space-y-6">
      <div className="space-y-2">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-500 ai-glow">
            <Envelope size={24} className="text-white" weight="bold" />
          </div>
          <div>
            <h1 className="text-3xl font-semibold text-foreground">AI Email Writer</h1>
            <p className="text-muted-foreground">Generate professional emails with AI assistance</p>
          </div>
        </div>
      </div>

      <Card className="border-indigo-200">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>AI Email Generator</CardTitle>
              <CardDescription>Create emails in formal, casual, or business tones</CardDescription>
            </div>
            <span className="px-3 py-1 text-xs font-semibold bg-gradient-to-r from-indigo-500 to-purple-500 text-white rounded-full">
              Powered by AI
            </span>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email-topic">Email Topic or Purpose</Label>
            <Textarea
              id="email-topic"
              placeholder="e.g., Request for meeting, Thank you for interview, Product inquiry..."
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              rows={3}
            />
          </div>

          <Tabs value={mode} onValueChange={(v) => setMode(v as EmailMode)}>
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="formal">Formal</TabsTrigger>
              <TabsTrigger value="business">Business</TabsTrigger>
              <TabsTrigger value="casual">Casual</TabsTrigger>
            </TabsList>
          </Tabs>

          <AIProviderSelector value={provider} onValueChange={setProvider} />

          <Button
            onClick={generateEmail}
            className="w-full bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600"
            disabled={loading}
          >
            {loading ? 'Generating...' : 'Generate Email'}
          </Button>

          {generatedEmail && (
            <div className="mt-4">
              <AIResponseCard
                title="Generated Email"
                content={generatedEmail}
                variant="blue"
                showShare={true}
                shareText={`Check out this email I created with AI! - 24Toolkit`}
              />
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
