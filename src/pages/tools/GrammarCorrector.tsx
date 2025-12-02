import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Copy, Trash, Sparkle } from '@phosphor-icons/react'
import { toast } from 'sonner'
import { AIProviderSelector, type AIProvider } from '@/components/ai/AIProviderSelector'
import { useCopyToClipboard } from '@/hooks/use-copy-to-clipboard'
import { callAI } from '@/lib/ai'
import { AI_PROMPTS, validatePromptInput } from '@/lib/ai-prompts'
import { useSEO } from '@/hooks/useSEO'
import { getPageMetadata } from '@/lib/seo-metadata'

export default function GrammarCorrector() {
  const { t } = useTranslation()
  
  // Set SEO metadata
  const metadata = getPageMetadata('grammar-corrector')
  useSEO({ ...metadata, canonicalPath: '/tools/grammar-corrector' })

  const [text, setText] = useState('')
  const [correctedText, setCorrectedText] = useState('')
  const [corrections, setCorrections] = useState<string[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [provider, setProvider] = useState<AIProvider>('anthropic')
  const copyToClipboard = useCopyToClipboard()

  const correctGrammar = async () => {
    if (!text.trim()) {
      toast.error(t('tools.common.pleaseEnterText'))
      return
    }

    try {
      validatePromptInput(text, 5, 10000)
    } catch (error) {
      if (error instanceof Error && 'code' in error && error.code === 'TOO_SHORT') {
        const validationError = error as { code: string; min?: number }
        toast.error(t('tools.common.inputTooShort', { min: validationError.min || 5 }))
      } else if (error instanceof Error && 'code' in error && error.code === 'TOO_LONG') {
        const validationError = error as { code: string; max?: number }
        toast.error(t('tools.common.inputTooLong', { max: validationError.max || 10000 }))
      } else {
        toast.error(error instanceof Error ? error.message : t('tools.common.invalidInput'))
      }
      return
    }

    setIsLoading(true)
    setCorrectedText('')
    
    try {
      const promptText = AI_PROMPTS.GRAMMAR_CORRECTOR(text)

      const result = await callAI(promptText, provider)
      
      setCorrectedText(result.trim())
      
      const foundCorrections: string[] = []
      if (text.length !== result.trim().length) {
        foundCorrections.push(t('tools.grammarCorrector.textLengthAdjusted'))
      }
      if (text !== result.trim()) {
        foundCorrections.push(t('tools.grammarCorrector.grammarSpellingCorrected'))
        foundCorrections.push(t('tools.grammarCorrector.punctuationImproved'))
      }
      
      setCorrections(foundCorrections.length > 0 ? foundCorrections : [t('tools.grammarCorrector.noCorrections')])
      toast.success(t('tools.grammarCorrector.corrected'))
    } catch (error) {
      console.error('Grammar check error:', error)
      toast.error(error instanceof Error ? error.message : t('tools.grammarCorrector.checkFailed'))
    } finally {
      setIsLoading(false)
    }
  }



  const handleClear = () => {
    setText('')
    setCorrectedText('')
    setCorrections([])
    toast.success(t('tools.common.cleared'))
  }

  return (
    <div className="py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-3">
            <h1 className="text-4xl font-semibold text-foreground tracking-tight">
              {t('tools.grammarCorrector.name')}
            </h1>
            <div className="px-3 py-1 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 text-white text-xs font-medium">
              {t('tools.common.aiPowered')}
            </div>
          </div>
          <p className="text-lg text-muted-foreground">
            {t('tools.grammarCorrector.description')}
          </p>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>{t('tools.grammarCorrector.enterText')}</CardTitle>
              <CardDescription>
                {t('tools.grammarCorrector.enterTextDescription')}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Textarea
                id="text-input"
                placeholder={t('tools.common.typeOrPaste')}
                value={text}
                onChange={(e) => setText(e.target.value)}
                className="min-h-[200px] resize-y font-normal"
              />
              
              <div className="space-y-3">
                <AIProviderSelector value={provider} onValueChange={setProvider} />
              
                <div className="flex gap-2">
                  <Button
                    onClick={correctGrammar}
                    disabled={!text || isLoading}
                    variant="default"
                    className="gap-2"
                  >
                    <Sparkle size={16} weight="fill" />
                    {isLoading ? t('tools.grammarCorrector.correcting') : t('tools.grammarCorrector.correct')}
                  </Button>
                  <Button
                    onClick={handleClear}
                    variant="outline"
                    className="gap-2"
                  >
                    <Trash size={16} />
                    {t('tools.common.clear')}
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {correctedText && (
            <>
              <Card>
                <CardHeader>
                  <CardTitle>{t('tools.grammarCorrector.correctedText')}</CardTitle>
                  <CardDescription>
                    {t('tools.grammarCorrector.correctedTextDescription')}
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <Textarea
                    id="corrected-output"
                    value={correctedText}
                    readOnly
                    className="min-h-[200px] resize-y font-normal bg-muted/30"
                  />
                  
                  <Button
                    onClick={() => copyToClipboard(correctedText, t('tools.common.copiedToClipboard'))}
                    variant="default"
                    className="gap-2"
                  >
                    <Copy size={16} />
                    {t('tools.common.copy')}
                  </Button>
                </CardContent>
              </Card>

              {corrections.length > 0 && (
                <Card className="border-primary/20 bg-primary/5">
                  <CardHeader>
                    <CardTitle className="text-lg">{t('tools.grammarCorrector.correctionsMade')}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2">
                      {corrections.map((correction, index) => (
                        <li key={index} className="flex items-center gap-2 text-sm">
                          <div className="w-1.5 h-1.5 rounded-full bg-primary" />
                          <span>{correction}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  )
}
