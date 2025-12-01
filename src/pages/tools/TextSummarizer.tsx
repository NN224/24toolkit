import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Sparkle, ArrowRight } from '@phosphor-icons/react'
import { toast } from 'sonner'
import { AILoadingSpinner } from '@/components/ai/AILoadingSpinner'
import { AIBadge } from '@/components/ai/AIBadge'
import { AIResponseCard } from '@/components/ai/AIResponseCard'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { AIProviderSelector, type AIProvider } from '@/components/ai/AIProviderSelector'
import { callAI } from '@/lib/ai'
import { AI_PROMPTS, validatePromptInput } from '@/lib/ai-prompts'
import { useSEO } from '@/hooks/useSEO'
import { getPageMetadata } from '@/lib/seo-metadata'
import { ToolRecommendations, useToolRecommendations } from '@/components/ToolRecommendations'

type SummaryLength = 'short' | 'medium' | 'detailed'

export default function TextSummarizer() {
  // Set SEO metadata
  const metadata = getPageMetadata('text-summarizer')
  useSEO(metadata)

  // Smart tool recommendations
  const { triggerRecommendations, PopupComponent } = useToolRecommendations('text-summarizer')

  const [text, setText] = useState('')
  const [summary, setSummary] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [summaryLength, setSummaryLength] = useState<SummaryLength>('medium')
  const [provider, setProvider] = useState<AIProvider>('anthropic')
  const [isArabic, setIsArabic] = useState(false)

  const MAX_CHARS = 10000

  // Detect if input is Arabic
  useEffect(() => {
    setIsArabic(/[\u0600-\u06FF]/.test(text))
  }, [text])

  const handleSummarize = async () => {
    if (!text.trim()) {
      toast.error(isArabic ? 'الرجاء إدخال نص لتلخيصه' : 'Please enter some text to summarize')
      return
    }

    try {
      validatePromptInput(text, 50, MAX_CHARS)
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Invalid input')
      return
    }

    setIsLoading(true)
    setSummary('')

    const lengthMap: Record<SummaryLength, 'short' | 'medium' | 'long'> = {
      short: 'short',
      medium: 'medium',
      detailed: 'long'
    }
    
    const promptText = AI_PROMPTS.TEXT_SUMMARIZER(text, lengthMap[summaryLength])

    try {
      await callAI(promptText, provider, (accumulatedText) => {
        setSummary(accumulatedText)
      })
      toast.success(isArabic ? 'تم تلخيص النص بنجاح!' : 'Text summarized successfully!')
      triggerRecommendations(isArabic ? 'تم تلخيص النص بنجاح!' : 'Text summarized successfully!')
    } catch (error) {
      console.error('Summarization error:', error)
      toast.error(error instanceof Error ? error.message : (isArabic ? 'فشل في تلخيص النص' : 'Failed to summarize text'))
    } finally {
      setIsLoading(false)
    }
  }

  const handleClear = () => {
    setText('')
    setSummary('')
    toast.success(isArabic ? 'تم المسح' : 'Cleared')
  }

  return (
    <div className="py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-3">
            <h1 className="text-4xl font-semibold text-foreground tracking-tight">
              {isArabic ? 'ملخص النصوص الذكي' : 'AI Text Summarizer'}
            </h1>
            <AIBadge />
          </div>
          <p className="text-lg text-muted-foreground">
            {isArabic 
              ? 'حوّل المقالات والوثائق الطويلة إلى نقاط موجزة وسهلة الفهم'
              : 'Transform long articles and documents into concise, digestible bullet points with AI-powered summarization.'}
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>{isArabic ? 'النص المدخل' : 'Input Text'}</CardTitle>
              <CardDescription>
                {isArabic ? 'الصق النص الذي تريد تلخيصه' : 'Paste the text you want to summarize'}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Textarea
                  id="text-input"
                  placeholder={isArabic ? 'الصق مقالتك أو وثيقتك أو أي نص طويل هنا...' : 'Paste your article, document, or any long text here...'}
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                  className="min-h-[400px] resize-y font-normal"
                  maxLength={MAX_CHARS}
                  dir={isArabic ? 'rtl' : 'ltr'}
                />
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>{text.length.toLocaleString()} / {MAX_CHARS.toLocaleString()} {isArabic ? 'حرف' : 'characters'}</span>
                  <span className={text.length > MAX_CHARS * 0.9 ? 'text-orange-500 font-medium' : ''}>
                    {text.length > MAX_CHARS * 0.9 && (isArabic ? 'اقتربت من الحد' : 'Approaching limit')}
                  </span>
                </div>
              </div>
              
              <div className="space-y-3">
                <AIProviderSelector value={provider} onValueChange={setProvider} />
                
                <div className="flex flex-col sm:flex-row gap-3">
                  <Select value={summaryLength} onValueChange={(value) => setSummaryLength(value as SummaryLength)}>
                    <SelectTrigger className="w-full sm:w-[180px]">
                      <SelectValue placeholder={isArabic ? 'طول الملخص' : 'Summary length'} />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="short">{isArabic ? 'قصير (3 نقاط)' : 'Short (3 points)'}</SelectItem>
                      <SelectItem value="medium">{isArabic ? 'متوسط (5 نقاط)' : 'Medium (5 points)'}</SelectItem>
                      <SelectItem value="detailed">{isArabic ? 'مفصل (8 نقاط)' : 'Detailed (8 points)'}</SelectItem>
                    </SelectContent>
                  </Select>
                  
                  <Button
                    onClick={handleSummarize}
                    disabled={!text.trim() || isLoading}
                    className="gap-2 flex-1 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600"
                  >
                    <Sparkle size={16} weight="fill" />
                    {isArabic ? 'لخّص' : 'Summarize'}
                    <ArrowRight size={16} />
                  </Button>
                </div>
                
                <Button
                  onClick={handleClear}
                  variant="outline"
                  className="w-full"
                >
                  {isArabic ? 'مسح الكل' : 'Clear All'}
                </Button>
              </div>
            </CardContent>
          </Card>

          <AIResponseCard
            title={isArabic ? 'نتيجة الملخص' : 'Summary Result'}
            content={summary}
            isLoading={isLoading}
            emptyMessage={isArabic ? 'سيظهر الملخص هنا' : 'Your summary will appear here'}
            variant="purple"
            showShare={true}
            shareText={summary.slice(0, 200) + '... - Created with 24Toolkit'}
          />
        </div>

        {/* Smart Tool Recommendations */}
        <ToolRecommendations currentToolId="text-summarizer" />

        {/* Recommendations Popup */}
        <PopupComponent />
      </div>
    </div>
  )
}
