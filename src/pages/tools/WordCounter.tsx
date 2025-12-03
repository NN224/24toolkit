import { useState, useMemo, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Copy, Trash } from '@phosphor-icons/react'
import { toast } from 'sonner'
import { useSEO } from '@/hooks/useSEO'
import { getPageMetadata } from '@/lib/seo-metadata'
import { trackToolUsage } from '@/components/UserProgress'
import { RelatedTools } from '@/components/RelatedTools'

export default function WordCounter() {
  const { t } = useTranslation()
  
  // Set SEO metadata
  const metadata = getPageMetadata('word-counter')
  useSEO({ ...metadata, canonicalPath: '/tools/word-counter' })

  const [text, setText] = useState('')

  // Track tool usage
  useEffect(() => {
    trackToolUsage('Word Counter')
  }, [])

  const stats = useMemo(() => {
    const trimmedText = text.trim()
    const words = trimmedText.length > 0 ? trimmedText.split(/\s+/).filter(word => word.length > 0) : []
    const characters = text.length
    const charactersNoSpaces = text.replace(/\s/g, '').length
    const paragraphs = trimmedText.length > 0 ? trimmedText.split(/\n\n+/).filter(p => p.length > 0).length : 0
    const sentences = trimmedText.length > 0 ? trimmedText.split(/[.!?]+/).filter(s => s.trim().length > 0).length : 0
    const readingTime = Math.ceil(words.length / 200)

    return {
      words: words.length,
      characters,
      charactersNoSpaces,
      paragraphs,
      sentences,
      readingTime: readingTime || 0
    }
  }, [text])

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(text)
      toast.success(t('tools.common.copied'))
    } catch (err) {
      toast.error(t('tools.common.error'))
    }
  }

  const handleClear = () => {
    setText('')
    toast.success(t('tools.common.cleared'))
  }

  return (
    <div className="py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl font-semibold text-foreground mb-3 tracking-tight">
            {t('tools.wordCounter.name')}
          </h1>
          <p className="text-lg text-muted-foreground">
            {t('tools.wordCounter.description')}
          </p>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>{t('tools.wordCounter.enterText')}</CardTitle>
              <CardDescription>
                {t('tools.wordCounter.startTyping')}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Textarea
                id="text-input"
                placeholder={t('tools.common.typeOrPaste')}
                value={text}
                onChange={(e) => setText(e.target.value)}
                className="min-h-[300px] resize-y font-normal"
              />
              
              <div className="flex gap-2">
                <Button
                  onClick={handleCopy}
                  disabled={!text}
                  variant="outline"
                  className="gap-2"
                >
                  <Copy size={16} />
                  {t('tools.common.copyText')}
                </Button>
                <Button
                  onClick={handleClear}
                  disabled={!text}
                  variant="outline"
                  className="gap-2"
                >
                  <Trash size={16} />
                  {t('tools.common.clear')}
                </Button>
              </div>
            </CardContent>
          </Card>

          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            <Card>
              <CardContent className="pt-6">
                <div className="text-3xl font-semibold text-primary mb-1">
                  {stats.words.toLocaleString()}
                </div>
                <div className="text-sm text-muted-foreground">{t('tools.wordCounter.words')}</div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <div className="text-3xl font-semibold text-primary mb-1">
                  {stats.characters.toLocaleString()}
                </div>
                <div className="text-sm text-muted-foreground">{t('tools.wordCounter.characters')}</div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <div className="text-3xl font-semibold text-primary mb-1">
                  {stats.charactersNoSpaces.toLocaleString()}
                </div>
                <div className="text-sm text-muted-foreground">{t('tools.wordCounter.charactersNoSpaces')}</div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <div className="text-3xl font-semibold text-primary mb-1">
                  {stats.paragraphs.toLocaleString()}
                </div>
                <div className="text-sm text-muted-foreground">{t('tools.wordCounter.paragraphs')}</div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <div className="text-3xl font-semibold text-primary mb-1">
                  {stats.sentences.toLocaleString()}
                </div>
                <div className="text-sm text-muted-foreground">{t('tools.wordCounter.sentences')}</div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <div className="text-3xl font-semibold text-primary mb-1">
                  {stats.readingTime}{t('tools.wordCounter.minuteShort')}
                </div>
                <div className="text-sm text-muted-foreground">{t('tools.wordCounter.readingTime')}</div>
              </CardContent>
            </Card>
          </div>

          {/* Related Tools for internal linking */}
          <RelatedTools currentToolId="word-counter" category="text" />
        </div>
      </div>
    </div>
  )
}
