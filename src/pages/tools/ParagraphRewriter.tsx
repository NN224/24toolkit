import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Copy, Sparkle, ArrowsLeftRight } from '@phosphor-icons/react'
import { toast } from 'sonner'
import { AILoadingSpinner } from '@/components/ai/AILoadingSpinner'
import { AIBadge } from '@/components/ai/AIBadge'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { AIProviderSelector, type AIProvider } from '@/components/ai/AIProviderSelector'
import { useCopyToClipboard } from '@/hooks/use-copy-to-clipboard'
import { callAI } from '@/lib/ai'
import { AI_PROMPTS, validatePromptInput } from '@/lib/ai-prompts'
import { useSEO } from '@/hooks/useSEO'
import { getPageMetadata } from '@/lib/seo-metadata'
import { RelatedTools } from '@/components/RelatedTools'

type Tone = 'formal' | 'neutral' | 'casual'

export default function ParagraphRewriter() {
  const { t } = useTranslation()
  
  // Set SEO metadata
  const metadata = getPageMetadata('paragraph-rewriter')
  useSEO({ ...metadata, canonicalPath: '/tools/paragraph-rewriter' })

  const [inputText, setInputText] = useState('')
  const [outputText, setOutputText] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [tone, setTone] = useState<Tone>('neutral')
  const [provider, setProvider] = useState<AIProvider>('anthropic')
  const copyToClipboard = useCopyToClipboard()

  const handleRewrite = async () => {
    if (!inputText.trim()) {
      toast.error(t('tools.paragraphRewriter.enterTextError'))
      return
    }

    try {
      validatePromptInput(inputText, 10, 5000)
    } catch (error) {
      if (error instanceof Error && 'code' in error && error.code === 'TOO_SHORT') {
        const validationError = error as { code: string; min?: number }
        toast.error(t('tools.common.inputTooShort', { min: validationError.min || 10 }))
      } else if (error instanceof Error && 'code' in error && error.code === 'TOO_LONG') {
        const validationError = error as { code: string; max?: number }
        toast.error(t('tools.common.inputTooLong', { max: validationError.max || 5000 }))
      } else {
        toast.error(error instanceof Error ? error.message : t('tools.common.invalidInput'))
      }
      return
    }

    setIsLoading(true)
    setOutputText('')

    const styleMap: Record<Tone, 'professional' | 'casual' | 'creative' | 'concise'> = {
      formal: 'professional',
      neutral: 'concise',
      casual: 'casual'
    }

    const promptText = AI_PROMPTS.PARAGRAPH_REWRITER(inputText, styleMap[tone])

    try {
      await callAI(promptText, provider, (accumulatedText) => {
        setOutputText(accumulatedText.trim())
      })
      toast.success(t('tools.paragraphRewriter.rewriteSuccess'))
    } catch (error) {
      console.error('Rewrite error:', error)
      toast.error(error instanceof Error ? error.message : t('tools.paragraphRewriter.rewriteFailed'))
    } finally {
      setIsLoading(false)
    }
  }



  const handleClear = () => {
    setInputText('')
    setOutputText('')
    toast.success(t('tools.paragraphRewriter.cleared'))
  }

  return (
    <div className="py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-3">
            <h1 className="text-4xl font-semibold text-foreground tracking-tight">
              {t('tools.paragraphRewriter.title')}
            </h1>
            <AIBadge />
          </div>
          <p className="text-lg text-muted-foreground">
            {t('tools.paragraphRewriter.subtitle')}
          </p>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>{t('tools.paragraphRewriter.rewriteSettings')}</CardTitle>
              <CardDescription>
                {t('tools.paragraphRewriter.chooseTone')}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">{t('tools.paragraphRewriter.tone')}</label>
                <Select value={tone} onValueChange={(value) => setTone(value as Tone)}>
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder={t('tools.paragraphRewriter.selectTone')} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="formal">
                      <span className="font-medium">{t('tools.paragraphRewriter.formal')}</span>
                    </SelectItem>
                    <SelectItem value="neutral">
                      <span className="font-medium">{t('tools.paragraphRewriter.neutral')}</span>
                    </SelectItem>
                    <SelectItem value="casual">
                      <span className="font-medium">{t('tools.paragraphRewriter.casual')}</span>
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <AIProviderSelector value={provider} onValueChange={setProvider} />
              
              <div className="flex flex-wrap gap-3">
                <Button
                  onClick={handleRewrite}
                  disabled={!inputText.trim() || isLoading}
                  className="gap-2 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600"
                >
                  <Sparkle size={16} weight="fill" />
                  {t('tools.paragraphRewriter.rewriteText')}
                </Button>
                
                <Button
                  onClick={handleClear}
                  variant="outline"
                >
                  {t('tools.paragraphRewriter.clearAll')}
                </Button>
              </div>
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>{t('tools.paragraphRewriter.originalText')}</CardTitle>
                <CardDescription>
                  {t('tools.paragraphRewriter.enterTextToRewrite')}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <Textarea
                  id="input-text"
                  placeholder={t('tools.paragraphRewriter.textPlaceholder')}
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  className="min-h-[400px] resize-y font-normal"
                />
                
                <Button
                  onClick={() => copyToClipboard(inputText)}
                  disabled={!inputText}
                  variant="outline"
                  className="w-full gap-2"
                >
                  <Copy size={16} />
                  {t('tools.paragraphRewriter.copyOriginal')}
                </Button>
              </CardContent>
            </Card>

            <Card className="border-2 border-accent/20">
              <CardHeader>
                <CardTitle>{t('tools.paragraphRewriter.rewrittenText')}</CardTitle>
                <CardDescription>
                  {t('tools.paragraphRewriter.textWillAppear')}
                </CardDescription>
              </CardHeader>
              <CardContent>
                {isLoading ? (
                  <AILoadingSpinner />
                ) : outputText ? (
                  <div className="space-y-4">
                    <Tabs defaultValue="output" className="w-full">
                      <TabsList className="grid w-full grid-cols-2">
                        <TabsTrigger value="output">{t('tools.paragraphRewriter.rewritten')}</TabsTrigger>
                        <TabsTrigger value="compare">{t('tools.paragraphRewriter.compare')}</TabsTrigger>
                      </TabsList>
                      
                      <TabsContent value="output" className="space-y-4">
                        <div className="bg-accent/5 border border-accent/20 rounded-lg p-6 min-h-[400px]">
                          <div className="prose prose-sm max-w-none">
                            <div className="whitespace-pre-wrap text-foreground leading-relaxed">
                              {outputText}
                            </div>
                          </div>
                        </div>
                        
                        <Button
                          onClick={() => copyToClipboard(outputText)}
                          variant="outline"
                          className="w-full gap-2"
                        >
                          <Copy size={16} />
                          {t('tools.paragraphRewriter.copyRewritten')}
                        </Button>
                      </TabsContent>
                      
                      <TabsContent value="compare" className="space-y-4">
                        <div className="space-y-3">
                          <div className="bg-muted/50 border border-border rounded-lg p-4">
                            <p className="text-xs font-medium text-muted-foreground mb-2">{t('tools.paragraphRewriter.originalLabel')}</p>
                            <p className="text-sm text-foreground whitespace-pre-wrap leading-relaxed">
                              {inputText}
                            </p>
                          </div>
                          
                          <div className="flex justify-center">
                            <ArrowsLeftRight size={24} className="text-accent" />
                          </div>
                          
                          <div className="bg-accent/5 border border-accent/20 rounded-lg p-4">
                            <p className="text-xs font-medium text-accent mb-2">{t('tools.paragraphRewriter.rewrittenLabel')}</p>
                            <p className="text-sm text-foreground whitespace-pre-wrap leading-relaxed">
                              {outputText}
                            </p>
                          </div>
                        </div>
                      </TabsContent>
                    </Tabs>
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center py-16 text-center min-h-[400px]">
                    <div className="w-16 h-16 rounded-full bg-gradient-to-br from-purple-500/10 to-pink-500/10 flex items-center justify-center mb-4">
                      <Sparkle size={28} weight="fill" className="text-purple-500" />
                    </div>
                    <p className="text-muted-foreground">
                      {t('tools.paragraphRewriter.emptyState')}
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

    {/* Related Tools for internal linking */}
    <RelatedTools currentToolId="paragraph-rewriter" category="ai" />
    </div>
  )
}
