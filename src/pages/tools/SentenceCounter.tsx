import { useState, useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Trash, ListNumbers } from '@phosphor-icons/react'
import { toast } from 'sonner'
import { useSEO } from '@/hooks/useSEO'
import { getPageMetadata } from '@/lib/seo-metadata'
import { RelatedTools } from '@/components/RelatedTools'

export default function SentenceCounter() {
  const { t } = useTranslation()
  
  // Set SEO metadata
  const metadata = getPageMetadata('sentence-counter')
  useSEO({ ...metadata, canonicalPath: '/tools/sentence-counter' })

  const [text, setText] = useState('')

  const stats = useMemo(() => {
    if (!text.trim()) {
      return {
        sentences: 0,
        avgWordsPerSentence: 0,
        avgCharsPerSentence: 0,
        longestSentence: '',
        shortestSentence: ''
      }
    }

    const sentenceEndings = /[.!?]+(?=\s+[A-Z]|$)/g
    const sentences = text.split(sentenceEndings).filter(s => s.trim().length > 0)

    const wordsPerSentence = sentences.map(s => 
      s.trim().split(/\s+/).filter(w => w.length > 0).length
    )
    
    const charsPerSentence = sentences.map(s => s.trim().length)

    const avgWords = wordsPerSentence.length > 0
      ? Math.round(wordsPerSentence.reduce((a, b) => a + b, 0) / wordsPerSentence.length)
      : 0

    const avgChars = charsPerSentence.length > 0
      ? Math.round(charsPerSentence.reduce((a, b) => a + b, 0) / charsPerSentence.length)
      : 0

    const longest = sentences.reduce((a, b) => a.length > b.length ? a : b, '')
    const shortest = sentences.reduce((a, b) => a.length < b.length ? a : b, longest)

    return {
      sentences: sentences.length,
      avgWordsPerSentence: avgWords,
      avgCharsPerSentence: avgChars,
      longestSentence: longest.trim(),
      shortestSentence: shortest.trim()
    }
  }, [text])

  const handleClear = () => {
    setText('')
    toast.success(t('tools.common.cleared'))
  }

  return (
    <div className="py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl font-semibold text-foreground mb-3 tracking-tight">
            {t('tools.sentenceCounter.title')}
          </h1>
          <p className="text-lg text-muted-foreground">
            {t('tools.sentenceCounter.subtitle')}
          </p>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>{t('tools.sentenceCounter.enterYourText')}</CardTitle>
              <CardDescription>
                {t('tools.sentenceCounter.enterDescription')}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Textarea
                id="text-input"
                placeholder={t('tools.common.enterText')}
                value={text}
                onChange={(e) => setText(e.target.value)}
                className="min-h-[250px] resize-y font-normal"
              />
              
              <Button
                onClick={handleClear}
                variant="outline"
                className="gap-2"
              >
                <Trash size={16} />
                {t('tools.common.clear')}
              </Button>
            </CardContent>
          </Card>

          {text && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <ListNumbers size={24} />
                  {t('tools.sentenceCounter.sentenceStatistics')}
                </CardTitle>
                <CardDescription>
                  {t('tools.sentenceCounter.detailedAnalysis')}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-6">
                  <div className="p-4 rounded-lg bg-primary/10 border border-primary/20">
                    <p className="text-3xl font-semibold text-foreground">{stats.sentences}</p>
                    <p className="text-sm text-muted-foreground mt-1">{t('tools.sentenceCounter.totalSentences')}</p>
                  </div>

                  <div className="p-4 rounded-lg bg-muted/50 border border-border">
                    <p className="text-3xl font-semibold text-foreground">{stats.avgWordsPerSentence}</p>
                    <p className="text-sm text-muted-foreground mt-1">{t('tools.sentenceCounter.avgWordsPerSentence')}</p>
                  </div>

                  <div className="p-4 rounded-lg bg-muted/50 border border-border">
                    <p className="text-3xl font-semibold text-foreground">{stats.avgCharsPerSentence}</p>
                    <p className="text-sm text-muted-foreground mt-1">{t('tools.sentenceCounter.avgCharsPerSentence')}</p>
                  </div>
                </div>

                {stats.longestSentence && (
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <h4 className="font-medium text-sm text-muted-foreground">{t('tools.sentenceCounter.longestSentence', { count: stats.longestSentence.split(/\s+/).length })}</h4>
                      <p className="p-3 rounded-lg bg-muted/30 border border-border text-sm text-foreground">
                        {stats.longestSentence}
                      </p>
                    </div>

                    <div className="space-y-2">
                      <h4 className="font-medium text-sm text-muted-foreground">{t('tools.sentenceCounter.shortestSentence', { count: stats.shortestSentence.split(/\s+/).length })}</h4>
                      <p className="p-3 rounded-lg bg-muted/30 border border-border text-sm text-foreground">
                        {stats.shortestSentence}
                      </p>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          )}
        </div>
      </div>

    {/* Related Tools for internal linking */}
    <RelatedTools currentToolId="sentence-counter" category="text" />
    </div>
  )
}
