import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Copy, Trash, ArrowsLeftRight } from '@phosphor-icons/react'
import { toast } from 'sonner'
import { useSEO } from '@/hooks/useSEO'
import { getPageMetadata } from '@/lib/seo-metadata'

export default function TextReverser() {
  const { t } = useTranslation()
  
  // Set SEO metadata
  const metadata = getPageMetadata('text-reverser')
  useSEO(metadata)

  const [text, setText] = useState('')
  const [result, setResult] = useState('')

  const reverseEntireText = () => {
    const reversed = text.split('').reverse().join('')
    setResult(reversed)
    toast.success(t('tools.textReverser.reversed'))
  }

  const reverseWords = () => {
    const reversed = text.split(/\s+/).reverse().join(' ')
    setResult(reversed)
    toast.success(t('tools.textReverser.reversed'))
  }

  const reverseEachWord = () => {
    const reversed = text
      .split(/\s+/)
      .map(word => word.split('').reverse().join(''))
      .join(' ')
    setResult(reversed)
    toast.success(t('tools.textReverser.reversed'))
  }

  const reverseLines = () => {
    const reversed = text.split('\n').reverse().join('\n')
    setResult(reversed)
    toast.success(t('tools.textReverser.reversed'))
  }

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(result)
      toast.success(t('tools.common.copied'))
    } catch (err) {
      toast.error(t('tools.common.error'))
    }
  }

  const handleClear = () => {
    setText('')
    setResult('')
    toast.success(t('common.clear'))
  }

  return (
    <div className="py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl font-semibold text-foreground mb-3 tracking-tight">
            {t('tools.textReverser.name')}
          </h1>
          <p className="text-lg text-muted-foreground">
            {t('tools.textReverser.description')}
          </p>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>{t('tools.textReverser.enterText')}</CardTitle>
              <CardDescription>
                {t('tools.common.enterText')}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Textarea
                id="text-input"
                placeholder={t('tools.common.enterText')}
                value={text}
                onChange={(e) => setText(e.target.value)}
                className="min-h-[150px] resize-y font-normal"
              />
              
              <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                <Button
                  onClick={reverseEntireText}
                  disabled={!text}
                  variant="outline"
                  className="gap-2"
                >
                  <ArrowsLeftRight size={16} />
                  {t('tools.textReverser.reverseAll')}
                </Button>
                <Button
                  onClick={reverseWords}
                  disabled={!text}
                  variant="outline"
                >
                  {t('tools.textReverser.reverseWords')}
                </Button>
                <Button
                  onClick={reverseEachWord}
                  disabled={!text}
                  variant="outline"
                >
                  {t('tools.textReverser.reverseEachWord')}
                </Button>
                <Button
                  onClick={reverseLines}
                  disabled={!text}
                  variant="outline"
                >
                  {t('tools.textReverser.reverseLines')}
                </Button>
              </div>
            </CardContent>
          </Card>

          {result && (
            <Card>
              <CardHeader>
                <CardTitle>{t('tools.textReverser.reversedText')}</CardTitle>
                <CardDescription>
                  {t('tools.textReverser.reversed')}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <Textarea
                  id="result-output"
                  value={result}
                  readOnly
                  className="min-h-[150px] resize-y font-normal bg-muted/30"
                />
                
                <div className="flex gap-2">
                  <Button
                    onClick={handleCopy}
                    variant="default"
                    className="gap-2"
                  >
                    <Copy size={16} />
                    {t('tools.common.copy')}
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
          )}
        </div>
      </div>
    </div>
  )
}
