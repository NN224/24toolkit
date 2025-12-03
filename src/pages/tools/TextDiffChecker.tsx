import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Trash, GitDiff } from '@phosphor-icons/react'
import { toast } from 'sonner'
import { useSEO } from '@/hooks/useSEO'
import { getPageMetadata } from '@/lib/seo-metadata'
import { RelatedTools } from '@/components/RelatedTools'

export default function TextDiffChecker() {
  const { t } = useTranslation()
  
  // Set SEO metadata
  const metadata = getPageMetadata('text-diff-checker')
  useSEO({ ...metadata, canonicalPath: '/tools/text-diff-checker' })

  const [text1, setText1] = useState('')
  const [text2, setText2] = useState('')
  const [showDiff, setShowDiff] = useState(false)

  const getDiff = () => {
    if (!text1 || !text2) {
      toast.error(t('tools.textDiffChecker.enterBothTexts'))
      return { additions: [], deletions: [], common: [] }
    }

    const words1 = text1.split(/\s+/)
    const words2 = text2.split(/\s+/)

    const set1 = new Set(words1)
    const set2 = new Set(words2)

    const additions = words2.filter(word => !set1.has(word))
    const deletions = words1.filter(word => !set2.has(word))
    const common = words1.filter(word => set2.has(word))

    return { additions, deletions, common }
  }

  const handleCompare = () => {
    if (!text1 || !text2) {
      toast.error(t('tools.textDiffChecker.enterBothTexts'))
      return
    }
    setShowDiff(true)
    toast.success(t('tools.textDiffChecker.textsCompared'))
  }

  const handleClear = () => {
    setText1('')
    setText2('')
    setShowDiff(false)
    toast.success(t('tools.common.cleared'))
  }

  const diff = showDiff ? getDiff() : null

  return (
    <div className="py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl font-semibold text-foreground mb-3 tracking-tight">
            {t('tools.textDiffChecker.title')}
          </h1>
          <p className="text-lg text-muted-foreground">
            {t('tools.textDiffChecker.subtitle')}
          </p>
        </div>

        <div className="space-y-6">
          <div className="grid md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>{t('tools.textDiffChecker.original')}</CardTitle>
                <CardDescription>
                  {t('tools.textDiffChecker.enterFirstText')}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <Textarea
                  id="text1-input"
                  placeholder={t('tools.textDiffChecker.firstTextPlaceholder')}
                  value={text1}
                  onChange={(e) => setText1(e.target.value)}
                  className="min-h-[200px] resize-y font-normal"
                />
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>{t('tools.textDiffChecker.modified')}</CardTitle>
                <CardDescription>
                  {t('tools.textDiffChecker.enterSecondText')}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <Textarea
                  id="text2-input"
                  placeholder={t('tools.textDiffChecker.secondTextPlaceholder')}
                  value={text2}
                  onChange={(e) => setText2(e.target.value)}
                  className="min-h-[200px] resize-y font-normal"
                />
              </CardContent>
            </Card>
          </div>

          <div className="flex gap-2">
            <Button
              onClick={handleCompare}
              disabled={!text1 || !text2}
              variant="default"
              className="gap-2"
            >
              <GitDiff size={16} />
              {t('tools.textDiffChecker.compareTexts')}
            </Button>
            <Button
              onClick={handleClear}
              variant="outline"
              className="gap-2"
            >
              <Trash size={16} />
              {t('tools.textDiffChecker.clearAll')}
            </Button>
          </div>

          {showDiff && diff && (
            <Card>
              <CardHeader>
                <CardTitle>{t('tools.textDiffChecker.comparisonResults')}</CardTitle>
                <CardDescription>
                  {t('tools.textDiffChecker.differencesBetweenTexts')}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-4">
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-sm font-medium">
                      <div className="w-4 h-4 rounded bg-green-500" />
                      <span>{t('tools.textDiffChecker.additions')} ({diff.additions.length} {t('tools.textDiffChecker.words')})</span>
                    </div>
                    <div className="p-3 rounded-lg bg-green-500/10 border border-green-500/20 min-h-[60px]">
                      <p className="text-sm text-foreground">
                        {diff.additions.length > 0 ? diff.additions.join(', ') : t('tools.textDiffChecker.noAdditions')}
                      </p>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-sm font-medium">
                      <div className="w-4 h-4 rounded bg-red-500" />
                      <span>{t('tools.textDiffChecker.deletions')} ({diff.deletions.length} {t('tools.textDiffChecker.words')})</span>
                    </div>
                    <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/20 min-h-[60px]">
                      <p className="text-sm text-foreground">
                        {diff.deletions.length > 0 ? diff.deletions.join(', ') : t('tools.textDiffChecker.noDeletions')}
                      </p>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-sm font-medium">
                      <div className="w-4 h-4 rounded bg-blue-500" />
                      <span>{t('tools.textDiffChecker.commonWords')} ({diff.common.length} {t('tools.textDiffChecker.words')})</span>
                    </div>
                    <div className="p-3 rounded-lg bg-blue-500/10 border border-blue-500/20 min-h-[60px]">
                      <p className="text-sm text-foreground">
                        {diff.common.length > 0 ? diff.common.slice(0, 20).join(', ') + (diff.common.length > 20 ? '...' : '') : t('tools.textDiffChecker.noCommonWords')}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-4 pt-4 border-t border-border">
                  <div className="text-center">
                    <p className="text-2xl font-semibold text-foreground">{text1.split(/\s+/).filter(w => w).length}</p>
                    <p className="text-sm text-muted-foreground">{t('tools.textDiffChecker.wordsInText1')}</p>
                  </div>
                  <div className="text-center">
                    <p className="text-2xl font-semibold text-foreground">{text2.split(/\s+/).filter(w => w).length}</p>
                    <p className="text-sm text-muted-foreground">{t('tools.textDiffChecker.wordsInText2')}</p>
                  </div>
                  <div className="text-center">
                    <p className="text-2xl font-semibold text-foreground">
                      {Math.round((diff.common.length / Math.max(text1.split(/\s+/).filter(w => w).length, text2.split(/\s+/).filter(w => w).length)) * 100)}%
                    </p>
                    <p className="text-sm text-muted-foreground">{t('tools.textDiffChecker.similarity')}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>

    {/* Related Tools for internal linking */}
    <RelatedTools currentToolId="text-diff-checker" category="text" />
    </div>
  )
}
