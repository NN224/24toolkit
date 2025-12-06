import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Textarea } from '@/components/ui/textarea'
import { Button } from '@/components/ui/button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Label } from '@/components/ui/label'
import { Globe, Copy } from '@phosphor-icons/react'
import { toast } from 'sonner'
import { AIProviderSelector, type AIProvider } from '@/components/ai/AIProviderSelector'
import { useCopyToClipboard } from '@/hooks/use-copy-to-clipboard'
import { callAI } from '@/lib/ai'
import { AI_PROMPTS, validatePromptInput } from '@/lib/ai-prompts'
import { useSEO } from '@/hooks/useSEO'
import { getPageMetadata } from '@/lib/seo-metadata'
import { RelatedTools } from '@/components/RelatedTools'

const languages = [
  { code: 'es', name: 'Spanish' },
  { code: 'fr', name: 'French' },
  { code: 'de', name: 'German' },
  { code: 'it', name: 'Italian' },
  { code: 'pt', name: 'Portuguese' },
  { code: 'ru', name: 'Russian' },
  { code: 'ja', name: 'Japanese' },
  { code: 'zh', name: 'Chinese' },
  { code: 'ar', name: 'Arabic' },
  { code: 'hi', name: 'Hindi' },
]

export default function AITranslator() {
  const { t } = useTranslation()
  
  // Set SEO metadata
  const metadata = getPageMetadata('ai-translator')
  useSEO({ ...metadata, canonicalPath: '/tools/ai-translator' })

  // Use SEO H1 if available, otherwise fall back to translation
  const pageH1 = metadata.h1 || t('tools.aITranslator.name')

  const [inputText, setInputText] = useState('')
  const [targetLang, setTargetLang] = useState('es')
  const [translatedText, setTranslatedText] = useState('')
  const [loading, setLoading] = useState(false)
  const [provider, setProvider] = useState<AIProvider>('anthropic')
  const copyToClipboard = useCopyToClipboard()

  const translateText = async () => {
    if (!inputText.trim()) {
      toast.error(t('tools.common.enterText'))
      return
    }

    try {
      validatePromptInput(inputText, 1, 10000)
    } catch (error) {
      if (error instanceof Error && 'code' in error && error.code === 'TOO_SHORT') {
        const validationError = error as { code: string; min?: number }
        toast.error(t('tools.common.inputTooShort', { min: validationError.min || 1 }))
      } else if (error instanceof Error && 'code' in error && error.code === 'TOO_LONG') {
        const validationError = error as { code: string; max?: number }
        toast.error(t('tools.common.inputTooLong', { max: validationError.max || 10000 }))
      } else {
        toast.error(error instanceof Error ? error.message : t('tools.common.invalidInput'))
      }
      return
    }

    setLoading(true)
    setTranslatedText('')
    
    try {
      // Use English language name for AI prompt (AI models understand English names better)
      const targetLanguage = languages.find(l => l.code === targetLang)?.name || 'English'
      const promptText = AI_PROMPTS.TRANSLATOR(inputText, targetLanguage)

      await callAI(promptText, provider, (accumulatedText) => {
        setTranslatedText(accumulatedText)
      })
      toast.success(t('tools.aiTranslator.translationComplete'))
    } catch (error) {
      console.error('Translation error:', error)
      toast.error(error instanceof Error ? error.message : t('tools.common.error'))
    } finally {
      setLoading(false)
    }
  }



  return (
    <div className="container mx-auto max-w-4xl px-4 py-8 space-y-6">
      <div className="space-y-2">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-gradient-to-br from-purple-500 to-pink-500 ai-glow">
            <Globe size={24} className="text-white" weight="bold" />
          </div>
          <div>
            <h1 className="text-3xl font-semibold text-foreground">{pageH1}</h1>
            <p className="text-muted-foreground">{metadata.description}</p>
          </div>
        </div>
      </div>

      <Card className="border-purple-200">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>{t('tools.aiTranslator.aiPoweredTranslation')}</CardTitle>
              <CardDescription>{t('tools.aiTranslator.naturalTranslations')}</CardDescription>
            </div>
            <span className="px-3 py-1 text-xs font-semibold bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-full">
              {t('tools.common.poweredByAI')}
            </span>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="input-text">{t('tools.aiTranslator.textToTranslate')}</Label>
            <Textarea
              id="input-text"
              placeholder={t('tools.aiTranslator.enterTextToTranslate')}
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              rows={6}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="target-lang">{t('tools.aiTranslator.targetLanguage')}</Label>
            <Select value={targetLang} onValueChange={setTargetLang}>
              <SelectTrigger id="target-lang">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {languages.map((lang) => (
                  <SelectItem key={lang.code} value={lang.code}>
                    {lang.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <AIProviderSelector value={provider} onValueChange={setProvider} />

          <Button
            onClick={translateText}
            className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600"
            disabled={loading}
          >
            {loading ? t('tools.aiTranslator.translating') : t('tools.aiTranslator.translate')}
          </Button>

          {translatedText && (
            <div className="space-y-2 mt-4">
              <div className="flex items-center justify-between">
                <Label>{t('tools.aiTranslator.translation')}</Label>
                <Button variant="ghost" size="sm" onClick={() => copyToClipboard(translatedText)}>
                  <Copy size={16} className="ltr:mr-2 rtl:ml-2" />
                  {t('tools.common.copy')}
                </Button>
              </div>
              <div className="p-4 bg-gradient-to-br from-purple-50 to-pink-50 rounded-lg border border-purple-200">
                <p className="text-foreground whitespace-pre-wrap">{translatedText}</p>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

    {/* Related Tools for internal linking */}
    <RelatedTools currentToolId="ai-translator" category="ai" />
    </div>
  )
}
