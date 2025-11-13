import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Textarea } from '@/components/ui/textarea'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Copy, Envelope } from '@phosphor-icons/react'
import { toast } from 'sonner'
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group'
import { callAI } from '@/lib/ai'

type EmailMode = 'formal' | 'casual' | 'business'
type Provider = 'anthropic' | 'groq'

export default function AIEmailWriter() {
  const [topic, setTopic] = useState('')
  const [mode, setMode] = useState<EmailMode>('formal')
  const [generatedEmail, setGeneratedEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [provider, setProvider] = useState<Provider>('anthropic')

  const generateEmail = async () => {
    if (!topic.trim()) {
      toast.error('Please enter an email topic')
      return
    }

    setLoading(true)
    setGeneratedEmail('')
    
    try {
      const modeInstructions = {
        formal: 'Write a formal, professional email',
        casual: 'Write a casual, friendly email',
        business: 'Write a business-appropriate email'
      }

      const promptText = `${modeInstructions[mode]} about: ${topic}

Include a subject line, greeting, body, and professional closing. Format it as a complete email.`

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

  const copyToClipboard = () => {
    navigator.clipboard.writeText(generatedEmail)
    toast.success('Email copied to clipboard!')
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

          <div className="space-y-2">
            <Label>AI Provider</Label>
            <ToggleGroup 
              type="single" 
              value={provider} 
              onValueChange={(value) => value && setProvider(value as Provider)}
              className="w-full justify-start"
              variant="outline"
            >
              <ToggleGroupItem value="anthropic" className="flex-1">
                Anthropic Claude
              </ToggleGroupItem>
              <ToggleGroupItem value="groq" className="flex-1">
                Groq
              </ToggleGroupItem>
            </ToggleGroup>
          </div>

          <Button
            onClick={generateEmail}
            className="w-full bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600"
            disabled={loading}
          >
            {loading ? 'Generating...' : 'Generate Email'}
          </Button>

          {generatedEmail && (
            <div className="space-y-2 mt-4">
              <div className="flex items-center justify-between">
                <Label>Generated Email</Label>
                <Button variant="ghost" size="sm" onClick={copyToClipboard}>
                  <Copy size={16} className="mr-2" />
                  Copy
                </Button>
              </div>
              <div className="p-4 bg-gradient-to-br from-indigo-50 to-purple-50 rounded-lg border border-indigo-200">
                <pre className="text-foreground whitespace-pre-wrap font-sans text-sm">
                  {generatedEmail}
                </pre>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
