import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Copy, Trash } from '@phosphor-icons/react'
import { toast } from 'sonner'
import { useSEO } from '@/hooks/useSEO'
import { getPageMetadata } from '@/lib/seo-metadata'

export default function RemoveLineBreaks() {
  const { t } = useTranslation()
  
  // Set SEO metadata
  const metadata = getPageMetadata('remove-line-breaks')
  useSEO(metadata)

  const [text, setText] = useState('')

  const removeLineBreaks = () => {
    const cleaned = text.replace(/\n/g, ' ')
    setText(cleaned)
    toast.success(t('tools.removeLineBreaks.lineBreaksRemoved'))
  }

  const removeExtraSpaces = () => {
    const cleaned = text.replace(/\s+/g, ' ').trim()
    setText(cleaned)
    toast.success(t('tools.removeLineBreaks.extraSpacesRemoved'))
  }

  const removeAll = () => {
    const cleaned = text
      .replace(/\n/g, ' ')
      .replace(/\s+/g, ' ')
      .trim()
    setText(cleaned)
    toast.success(t('tools.removeLineBreaks.allRemoved'))
  }

  const trimLines = () => {
    const cleaned = text
      .split('\n')
      .map(line => line.trim())
      .join('\n')
    setText(cleaned)
    toast.success(t('tools.removeLineBreaks.linesTrimmed'))
  }

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(text)
      toast.success(t('tools.removeLineBreaks.textCopied'))
    } catch (err) {
      toast.error(t('tools.removeLineBreaks.copyFailed'))
    }
  }

  const handleClear = () => {
    setText('')
    toast.success(t('tools.removeLineBreaks.textCleared'))
  }

  return (
    <div className="py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl font-semibold text-foreground mb-3 tracking-tight">
            {t('tools.removeLineBreaks.title')}
          </h1>
          <p className="text-lg text-muted-foreground">
            {t('tools.removeLineBreaks.subtitle')}
          </p>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>{t('tools.removeLineBreaks.enterYourText')}</CardTitle>
              <CardDescription>
                {t('tools.removeLineBreaks.enterDescription')}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Textarea
                id="text-input"
                placeholder={t('tools.removeLineBreaks.placeholder')}
                value={text}
                onChange={(e) => setText(e.target.value)}
                className="min-h-[300px] resize-y font-normal"
              />
              
              <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                <Button
                  onClick={removeLineBreaks}
                  disabled={!text}
                  variant="outline"
                >
                  {t('tools.removeLineBreaks.removeLineBreaksBtn')}
                </Button>
                <Button
                  onClick={removeExtraSpaces}
                  disabled={!text}
                  variant="outline"
                >
                  {t('tools.removeLineBreaks.removeExtraSpacesBtn')}
                </Button>
                <Button
                  onClick={removeAll}
                  disabled={!text}
                  variant="default"
                >
                  {t('tools.removeLineBreaks.removeAllBtn')}
                </Button>
                <Button
                  onClick={trimLines}
                  disabled={!text}
                  variant="outline"
                >
                  {t('tools.removeLineBreaks.trimLinesBtn')}
                </Button>
              </div>

              <div className="flex gap-2">
                <Button
                  onClick={handleCopy}
                  disabled={!text}
                  variant="outline"
                  className="gap-2"
                >
                  <Copy size={16} />
                  {t('tools.removeLineBreaks.copyText')}
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
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
