import { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
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
  const { t } = useTranslation()
  
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
      toast.error(t('tools.aiEmailWriter.enterTopicError'))
      return
    }

    try {
      validatePromptInput(topic, 3, 500)
    } catch (error) {
      if (error instanceof Error && 'code' in error && error.code === 'TOO_SHORT') {
        const validationError = error as { code: string; min?: number }
        toast.error(t('tools.common.inputTooShort', { min: validationError.min || 3 }))
      } else if (error instanceof Error && 'code' in error && error.code === 'TOO_LONG') {
        const validationError = error as { code: string; max?: number }
        toast.error(t('tools.common.inputTooLong', { max: validationError.max || 500 }))
      } else {
        toast.error(error instanceof Error ? error.message : t('tools.common.invalidInput'))
      }
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
      toast.success(t('tools.aiEmailWriter.generatedSuccess'))
    } catch (error) {
      console.error('Email generation error:', error)
      toast.error(error instanceof Error ? error.message : t('tools.aiEmailWriter.generationFailed'))
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
            <h1 className="text-3xl font-semibold text-foreground">{t('tools.aiEmailWriter.name')}</h1>
            <p className="text-muted-foreground">{t('tools.aiEmailWriter.subtitle')}</p>
          </div>
        </div>
      </div>

      <Card className="border-indigo-200">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>{t('tools.aiEmailWriter.cardTitle')}</CardTitle>
              <CardDescription>{t('tools.aiEmailWriter.cardDescription')}</CardDescription>
            </div>
            <span className="px-3 py-1 text-xs font-semibold bg-gradient-to-r from-indigo-500 to-purple-500 text-white rounded-full">
              {t('tools.aiEmailWriter.poweredByAI')}
            </span>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email-topic">{t('tools.aiEmailWriter.topicLabel')}</Label>
            <Textarea
              id="email-topic"
              placeholder={t('tools.aiEmailWriter.topicPlaceholder')}
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              rows={3}
            />
          </div>

          <Tabs value={mode} onValueChange={(v) => setMode(v as EmailMode)}>
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="formal">{t('tools.aiEmailWriter.formal')}</TabsTrigger>
              <TabsTrigger value="business">{t('tools.aiEmailWriter.business')}</TabsTrigger>
              <TabsTrigger value="casual">{t('tools.aiEmailWriter.casual')}</TabsTrigger>
            </TabsList>
          </Tabs>

          <AIProviderSelector value={provider} onValueChange={setProvider} />

          <Button
            onClick={generateEmail}
            className="w-full bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600"
            disabled={loading}
          >
            {loading ? t('tools.aiEmailWriter.generating') : t('tools.aiEmailWriter.generateButton')}
          </Button>

          {generatedEmail && (
            <div className="mt-4">
              <AIResponseCard
                title={t('tools.aiEmailWriter.generatedEmailTitle')}
                content={generatedEmail}
                variant="blue"
                showShare={true}
                shareText={t('tools.aiEmailWriter.shareText')}
              />
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
